import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { CreateCheckoutOrderSchema } from "@/lib/validations/checkout";
import { getServerSession } from "@/lib/auth";
import { razorpayInstance, isRazorpayConfigured } from "@/lib/razorpay";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendOrderInvoiceEmail } from "@/backend/services/email";

export const dynamic = "force-dynamic";

async function generateUniqueOrderNumber(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const num = Math.floor(1000 + Math.random() * 9000);
    const candidate = `RW${num}`;
    const exists = await prisma.order.findUnique({
      where: { orderNumber: candidate },
    });
    if (!exists) return candidate;
  }
  return `RW${Date.now().toString().slice(-6)}`;
}

export async function POST(req: NextRequest) {
  // Rate limiting: 15 checkout creations per minute per IP
  const ip = getClientIp(req.headers);
  const rateLimit = checkRateLimit(`checkout-create:${ip}`, {
    windowMs: 60_000,
    maxRequests: 15,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many checkout requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validated = CreateCheckoutOrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid checkout details", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { items, deliveryAddress, notes, paymentScreenshotUrl, utrNumber, couponCode } = validated.data;
    const session = await getServerSession();
    const userId = session?.user?.id || null;

    // Fetch live products
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        OR: [{ id: { in: productIds } }, { slug: { in: productIds } }],
        status: "PUBLISHED",
      },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    const productMap = new Map();
    for (const p of dbProducts) {
      productMap.set(p.id, p);
      productMap.set(p.slug, p);
    }

    // Validate quantities and pricing
    const orderItemsData: Array<{
      productId: string;
      productName: string;
      productSlug: string;
      category: string;
      size: string;
      stitchingSelected: boolean;
      stitchingPriceInPaise: number;
      unitPriceInPaise: number;
      quantity: number;
      totalInPaise: number;
      imageUrl: string | null;
    }> = [];
    let subtotalInPaise = 0;
    let stitchingInPaise = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product || !product.inStock || product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Product "${product?.name || item.productId}" is out of stock or does not have sufficient inventory.`,
          },
          { status: 400 }
        );
      }

      let unitPrice = product.priceInPaise;
      let variantName = item.size || null;

      if (item.variantId) {
        const variant = product.variants.find((v: { id: string; name: string; priceAdjustmentInPaise: number }) => v.id === item.variantId);
        if (variant) {
          unitPrice += variant.priceAdjustmentInPaise;
          variantName = variant.name;
        }
      }

      let itemStitching = 0;
      let stitchingSelected = false;
      if (item.stitchingSelected && product.stitchingAvailable) {
        stitchingSelected = true;
        itemStitching = product.stitchingPriceInPaise;
      }

      const lineTotal = (unitPrice + itemStitching) * item.quantity;
      subtotalInPaise += unitPrice * item.quantity;
      stitchingInPaise += itemStitching * item.quantity;

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        category: product.category,
        size: variantName || (product.category === "Unstitched" ? "Unstitched" : "Stitched"),
        stitchingSelected,
        stitchingPriceInPaise: itemStitching,
        unitPriceInPaise: unitPrice,
        quantity: item.quantity,
        totalInPaise: lineTotal,
        imageUrl: product.images[0]?.secureUrl || "/placeholder.webp",
      });
    }

    const shippingInPaise = 0; // Explicit free shipping

    // ── COUPON DISCOUNT VALIDATION & CALCULATION ──
    let appliedCoupon: any = null;
    let discountInPaise = 0;
    let discountDetails: any = null;

    if (couponCode && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const couponRecord = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });

      const now = new Date();
      if (
        couponRecord &&
        couponRecord.isActive &&
        (!couponRecord.startDate || new Date(couponRecord.startDate) <= now) &&
        (!couponRecord.endDate || new Date(couponRecord.endDate) >= now) &&
        (!couponRecord.usageLimit || couponRecord.usedCount < couponRecord.usageLimit) &&
        (couponRecord.minOrderValueInPaise === 0 || subtotalInPaise >= couponRecord.minOrderValueInPaise)
      ) {
        const isSpecificProductScope =
          couponRecord.applicableScope === "SPECIFIC_PRODUCTS" ||
          (Array.isArray(couponRecord.applicableProducts) && (couponRecord.applicableProducts as string[]).length > 0);

        const isSpecificCategoryScope =
          couponRecord.applicableScope === "SPECIFIC_CATEGORIES" ||
          (Array.isArray(couponRecord.applicableCategories) && (couponRecord.applicableCategories as string[]).length > 0);

        let eligibleSubtotalInPaise = subtotalInPaise;
        let isEligible = true;

        if (isSpecificProductScope) {
          const targetProducts = (couponRecord.applicableProducts as string[]) || [];
          const eligibleItems = orderItemsData.filter((item) => {
            const itemPId = (item.productId || "").toLowerCase();
            const itemSlug = (item.productSlug || "").toLowerCase();
            const itemName = (item.productName || "").toLowerCase();
            return targetProducts.some((t) => {
              const target = t.toLowerCase();
              return target === itemPId || target === itemSlug || target === itemName;
            });
          });

          if (eligibleItems.length === 0) {
            isEligible = false;
          } else {
            eligibleSubtotalInPaise = eligibleItems.reduce((acc, it) => acc + it.unitPriceInPaise * it.quantity, 0);
          }
        } else if (isSpecificCategoryScope) {
          const allowedCategories = (couponRecord.applicableCategories as string[]) || [];
          const eligibleItems = orderItemsData.filter((item) => {
            const itemCat = (item.category || "").toLowerCase();
            return allowedCategories.some((ac) => ac.toLowerCase() === itemCat);
          });

          if (eligibleItems.length === 0) {
            isEligible = false;
          } else {
            eligibleSubtotalInPaise = eligibleItems.reduce((acc, it) => acc + it.unitPriceInPaise * it.quantity, 0);
          }
        }

        if (isEligible) {
          appliedCoupon = couponRecord;

          if (couponRecord.discountType === "PERCENTAGE") {
            const rawDiscount = Math.round((eligibleSubtotalInPaise * couponRecord.discountValue) / 100);
            discountInPaise = couponRecord.maxDiscountInPaise
              ? Math.min(rawDiscount, couponRecord.maxDiscountInPaise)
              : rawDiscount;
          } else if (couponRecord.discountType === "FIXED_AMOUNT") {
            discountInPaise = Math.min(couponRecord.discountValue, eligibleSubtotalInPaise);
          } else if (couponRecord.discountType === "FREE_SHIPPING") {
            discountInPaise = shippingInPaise;
          }

          discountInPaise = Math.min(discountInPaise, subtotalInPaise + stitchingInPaise + shippingInPaise);

          discountDetails = {
            couponId: couponRecord.id,
            code: couponRecord.code,
            discountType: couponRecord.discountType,
            discountValue: couponRecord.discountValue,
            discountInPaise,
            applicableScope: couponRecord.applicableScope,
          };
        }
      }
    }

    const totalBeforeDiscount = subtotalInPaise + stitchingInPaise + shippingInPaise;
    const totalInPaise = Math.max(0, totalBeforeDiscount - discountInPaise);

    const orderNumber = await generateUniqueOrderNumber();
    const guestAccessToken = crypto.randomBytes(32).toString("hex");
    const reservationExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15-minute stock reservation

    // ── RAZORPAY PAUSE MODE ──
    // When paused, orders are confirmed directly without opening the payment gateway modal
    const isRazorpayPaused = true;

    if (isRazorpayPaused) {
      const defaultDelivery = new Date();
      defaultDelivery.setDate(defaultDelivery.getDate() + 7);

      const savedOrder = await prisma.$transaction(
        async (tx) => {
          const order = await tx.order.create({
            data: {
              orderNumber,
              userId,
              guestAccessToken,
              guestEmail: deliveryAddress.email.toLowerCase(),
              subtotalInPaise,
              shippingInPaise,
              stitchingInPaise,
              discountInPaise,
              couponId: appliedCoupon ? appliedCoupon.id : null,
              couponCode: appliedCoupon ? appliedCoupon.code : null,
              discountDetails: discountDetails || undefined,
              totalInPaise,
              paymentStatus: "VERIFICATION_PENDING",
              fulfilmentStatus: "PENDING",
              paymentMethod: "UPI_SCANNER",
              paymentScreenshotUrl: paymentScreenshotUrl || null,
              utrNumber: utrNumber || null,
              estimatedDeliveryDate: defaultDelivery,
              shippingAddress: deliveryAddress as any,
              notes: notes || null,
              items: {
                create: orderItemsData,
              },
            },
          });

          // Increment coupon usedCount if coupon applied
          if (appliedCoupon) {
            await tx.coupon.update({
              where: { id: appliedCoupon.id },
              data: { usedCount: { increment: 1 } },
            }).catch(() => {});
          }

          // Deduct product stock concurrently
          const stockUpdates = orderItemsData
            .filter((item) => item.productId)
            .map((item) =>
              tx.product
                .update({
                  where: { id: item.productId },
                  data: {
                    stock: { decrement: item.quantity },
                  },
                })
                .catch(() => {})
            );

          if (stockUpdates.length > 0) {
            await Promise.all(stockUpdates);
          }

          // Save delivery address to user account for future checkouts
          if (userId) {
            await tx.address
              .create({
                data: {
                  userId,
                  name: deliveryAddress.fullName,
                  phone: deliveryAddress.phone,
                  address: deliveryAddress.address,
                  city: deliveryAddress.city,
                  state: deliveryAddress.state,
                  pincode: deliveryAddress.pincode,
                  isDefault: true,
                },
              })
              .catch(() => {});
          }

          return order;
        },
        {
          maxWait: 15000,
          timeout: 30000,
        }
      );

      // Asynchronously trigger tax invoice delivery to both customer & store owner (bizleap1@gmail.com)
      sendOrderInvoiceEmail(savedOrder.id, deliveryAddress.email).catch((emailErr) => {
        console.error("Async invoice delivery error:", emailErr);
      });

      return NextResponse.json({
        success: true,
        directSuccess: true,
        orderId: savedOrder.id,
        orderNumber: savedOrder.orderNumber,
        guestAccessToken,
        discountInPaise,
        totalInPaise,
        paymentStatus: "VERIFICATION_PENDING",
      });
    }

    // Check Razorpay configuration
    if (!isRazorpayConfigured || !razorpayInstance) {
      return NextResponse.json(
        {
          error:
            "Razorpay payment gateway is not yet configured on the server. Please set valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.",
          isRazorpayConfigured: false,
        },
        { status: 503 }
      );
    }

    // Create Razorpay Order via official SDK
    let razorpayOrder;
    try {
      razorpayOrder = await razorpayInstance.orders.create({
        amount: totalInPaise,
        currency: "INR",
        receipt: orderNumber,
        notes: {
          orderNumber,
          customerEmail: deliveryAddress.email,
          customerPhone: deliveryAddress.phone,
        },
      });
    } catch (rzpErr: any) {
      console.error("Razorpay order creation error:", rzpErr);
      return NextResponse.json(
        {
          error:
            rzpErr.error?.description ||
            rzpErr.message ||
            "Failed to initiate order with Razorpay gateway.",
        },
        { status: 502 }
      );
    }

    // Persist pending Order and Stock Reservation in database transaction
    const savedOrder = await prisma.$transaction(
      async (tx) => {
        const order = await tx.order.create({
          data: {
            orderNumber,
            userId,
            guestAccessToken,
            guestEmail: deliveryAddress.email.toLowerCase(),
            subtotalInPaise,
            shippingInPaise,
            stitchingInPaise,
            totalInPaise,
            paymentStatus: "PENDING",
            fulfilmentStatus: "PENDING",
            paymentMethod: "RAZORPAY",
            razorpayOrderId: razorpayOrder.id,
            shippingAddress: deliveryAddress as any,
            notes: notes || null,
            items: {
              create: orderItemsData,
            },
          },
        });

        // Create stock reservations concurrently
        const reservationPromises = orderItemsData
          .filter((item) => item.productId)
          .map((item) =>
            tx.stockReservation.create({
              data: {
                productId: item.productId,
                quantity: item.quantity,
                orderId: order.id,
                sessionId: guestAccessToken,
                expiresAt: reservationExpiry,
                status: "ACTIVE",
              },
            })
          );

        if (reservationPromises.length > 0) {
          await Promise.all(reservationPromises);
        }

        return order;
      },
      {
        maxWait: 15000,
        timeout: 30000,
      }
    );

    return NextResponse.json({
      success: true,
      orderId: savedOrder.id,
      orderNumber: savedOrder.orderNumber,
      guestAccessToken,
      razorpayOrderId: razorpayOrder.id,
      amountInPaise: totalInPaise,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      customer: {
        name: deliveryAddress.fullName,
        email: deliveryAddress.email,
        contact: deliveryAddress.phone,
      },
    });
  } catch (error: any) {
    console.error("POST /api/checkout/create-order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout order" },
      { status: 500 }
    );
  }
}
