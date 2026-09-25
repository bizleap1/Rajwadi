import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ValidateCouponSchema } from "@/lib/validations/discount";
import { getServerSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Rate limiting to prevent brute force code guessing
  const ip = getClientIp(req.headers);
  const rateLimit = checkRateLimit(`coupon-validate:${ip}`, {
    windowMs: 60_000,
    maxRequests: 30,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { valid: false, error: "Too many coupon attempts. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validated = ValidateCouponSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { valid: false, error: "Invalid coupon validation payload", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { code, subtotalInPaise, shippingInPaise, categories, items, email } = validated.data;
    const session = await getServerSession();
    const customerEmail = email || session?.user?.email || null;
    const userId = session?.user?.id || null;

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: `Coupon code "${code}" is invalid or does not exist.` },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, error: `Coupon "${code}" is currently disabled.` },
        { status: 400 }
      );
    }

    const now = new Date();

    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return NextResponse.json(
        { valid: false, error: `Coupon "${code}" will be active from ${new Date(coupon.startDate).toLocaleDateString("en-IN")}.` },
        { status: 400 }
      );
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return NextResponse.json(
        { valid: false, error: `Coupon "${code}" has expired.` },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { valid: false, error: `Coupon "${code}" has reached its maximum total redemption limit.` },
        { status: 400 }
      );
    }

    if (coupon.minOrderValueInPaise > 0 && subtotalInPaise < coupon.minOrderValueInPaise) {
      const minInRupees = (coupon.minOrderValueInPaise / 100).toLocaleString("en-IN");
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum order subtotal of ₹${minInRupees} is required to apply "${code}".`,
        },
        { status: 400 }
      );
    }

    // Check per-user limit
    if (customerEmail || userId) {
      const userOrdersCount = await prisma.order.count({
        where: {
          couponCode: code,
          paymentStatus: { notIn: ["FAILED", "CANCELLED"] },
          OR: [
            ...(customerEmail ? [{ guestEmail: { equals: customerEmail, mode: "insensitive" as const } }] : []),
            ...(userId ? [{ userId }] : []),
          ],
        },
      });

      if (userOrdersCount >= coupon.perUserLimit) {
        return NextResponse.json(
          {
            valid: false,
            error: `You have already redeemed coupon "${code}" the maximum allowed number of times (${coupon.perUserLimit}x).`,
          },
          { status: 400 }
        );
      }
    }

    // Determine eligible items & eligible subtotal
    const isSpecificProductScope =
      coupon.applicableScope === "SPECIFIC_PRODUCTS" ||
      (Array.isArray(coupon.applicableProducts) && (coupon.applicableProducts as string[]).length > 0);

    const isSpecificCategoryScope =
      coupon.applicableScope === "SPECIFIC_CATEGORIES" ||
      (Array.isArray(coupon.applicableCategories) && (coupon.applicableCategories as string[]).length > 0);

    let eligibleSubtotalInPaise = subtotalInPaise;
    let matchingProductNames: string[] = [];

    // 1. SPECIFIC PRODUCT TARGETING
    if (isSpecificProductScope) {
      const targetProducts = (coupon.applicableProducts as string[]) || [];

      if (items && items.length > 0) {
        const eligibleItems = items.filter((item) => {
          const itemPId = (item.productId || "").toLowerCase();
          const itemSlug = (item.slug || "").toLowerCase();
          const itemName = (item.name || "").toLowerCase();

          return targetProducts.some((t) => {
            const target = t.toLowerCase();
            return target === itemPId || target === itemSlug || target === itemName;
          });
        });

        if (eligibleItems.length === 0) {
          return NextResponse.json(
            {
              valid: false,
              error: `Coupon "${code}" is valid only for specific poshaks: ${targetProducts.join(", ")}. Please add eligible items to your bag.`,
            },
            { status: 400 }
          );
        }

        matchingProductNames = eligibleItems.map((it) => it.name || it.slug || it.productId);
        eligibleSubtotalInPaise = eligibleItems.reduce((acc, it) => {
          const unitP = it.priceInPaise || it.unitPriceInPaise || 0;
          return acc + unitP * (it.quantity || 1);
        }, 0);
      }
    }
    // 2. SPECIFIC CATEGORY TARGETING
    else if (isSpecificCategoryScope) {
      const allowedCategories = (coupon.applicableCategories as string[]) || [];

      if (items && items.length > 0) {
        const eligibleItems = items.filter((item) => {
          const itemCat = (item.category || "").toLowerCase();
          return allowedCategories.some((ac) => ac.toLowerCase() === itemCat);
        });

        if (eligibleItems.length === 0) {
          return NextResponse.json(
            {
              valid: false,
              error: `Coupon "${code}" is only valid for categories: ${allowedCategories.join(", ")}.`,
            },
            { status: 400 }
          );
        }

        matchingProductNames = eligibleItems.map((it) => it.name || it.slug || it.productId);
        eligibleSubtotalInPaise = eligibleItems.reduce((acc, it) => {
          const unitP = it.priceInPaise || it.unitPriceInPaise || 0;
          return acc + unitP * (it.quantity || 1);
        }, 0);
      } else if (categories && categories.length > 0) {
        const hasMatching = categories.some((c) =>
          allowedCategories.some((ac) => ac.toLowerCase() === c.toLowerCase())
        );
        if (!hasMatching) {
          return NextResponse.json(
            {
              valid: false,
              error: `Coupon "${code}" is only valid for categories: ${allowedCategories.join(", ")}.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Calculate exact discount in paise based on eligible items
    let discountInPaise = 0;

    if (coupon.discountType === "PERCENTAGE") {
      const rawDiscount = Math.round((eligibleSubtotalInPaise * coupon.discountValue) / 100);
      if (coupon.maxDiscountInPaise && coupon.maxDiscountInPaise > 0) {
        discountInPaise = Math.min(rawDiscount, coupon.maxDiscountInPaise);
      } else {
        discountInPaise = rawDiscount;
      }
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      discountInPaise = Math.min(coupon.discountValue, eligibleSubtotalInPaise);
    } else if (coupon.discountType === "FREE_SHIPPING") {
      discountInPaise = shippingInPaise || 0;
    }

    // Ensure discount never exceeds total
    const totalBeforeDiscount = subtotalInPaise + (shippingInPaise || 0);
    discountInPaise = Math.min(discountInPaise, totalBeforeDiscount);

    const finalTotalInPaise = Math.max(0, totalBeforeDiscount - discountInPaise);

    const targetDesc =
      matchingProductNames.length > 0
        ? ` (${matchingProductNames.slice(0, 2).join(", ")}${matchingProductNames.length > 2 ? "..." : ""})`
        : "";

    return NextResponse.json({
      valid: true,
      message: `Coupon "${code}" applied successfully! ₹${(discountInPaise / 100).toLocaleString("en-IN")} saved${targetDesc}`,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountInPaise: coupon.maxDiscountInPaise,
        minOrderValueInPaise: coupon.minOrderValueInPaise,
        applicableScope: coupon.applicableScope,
      },
      discountInPaise,
      finalTotalInPaise,
    });
  } catch (error: any) {
    console.error("POST /api/coupons/validate error:", error);
    return NextResponse.json(
      { valid: false, error: error.message || "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
