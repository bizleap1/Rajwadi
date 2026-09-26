import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { VerifyPaymentSchema } from "@/lib/validations/checkout";
import {
  verifyRazorpaySignature,
  fetchRazorpayPayment,
  isRazorpayConfigured,
} from "@/lib/razorpay";
import { sendOrderInvoiceEmail } from "@/backend/services/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = VerifyPaymentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid payment verification data", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      validated.data;

    // Find the matching internal order
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order record not found" },
        { status: 404 }
      );
    }

    // Idempotency check: if order is already marked PAID, return success
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        guestAccessToken: order.guestAccessToken,
        message: "Payment was already verified successfully.",
      });
    }

    // Verify order binding
    if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json(
        { error: "Razorpay order ID mismatch with local order." },
        { status: 400 }
      );
    }

    if (!isRazorpayConfigured) {
      return NextResponse.json(
        { error: "Razorpay is not configured on the server." },
        { status: 503 }
      );
    }

    // 1. Verify HMAC Signature
    const isSignatureValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isSignatureValid) {
      console.error(
        `Invalid payment signature for Order ${order.orderNumber} (Payment: ${razorpayPaymentId})`
      );
      return NextResponse.json(
        { error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }

    // 2. Fetch payment details from Razorpay to verify capture status and amount
    let rzpPayment: any;
    try {
      rzpPayment = await fetchRazorpayPayment(razorpayPaymentId);
    } catch (fetchErr: any) {
      console.error("Failed to fetch Razorpay payment status:", fetchErr);
      return NextResponse.json(
        { error: "Failed to confirm payment status with provider." },
        { status: 502 }
      );
    }

    if (
      rzpPayment.status !== "captured" &&
      rzpPayment.status !== "authorized"
    ) {
      return NextResponse.json(
        {
          error: `Payment is not successful (status: ${rzpPayment.status}). Please contact support if money was debited.`,
        },
        { status: 400 }
      );
    }

    // Verify amount in paise matches order total
    if (rzpPayment.amount !== order.totalInPaise) {
      console.error(
        `Amount mismatch: Razorpay paid ${rzpPayment.amount} paise vs Order ${order.totalInPaise} paise`
      );
      return NextResponse.json(
        { error: "Payment amount mismatch detected." },
        { status: 400 }
      );
    }

    // 3. Atomically finalize payment and deduct product stock
    await prisma.$transaction(
      async (tx) => {
        // Update Order Status
        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            fulfilmentStatus: "IN_ATELIER",
            razorpayPaymentId,
            razorpaySignature,
          },
        });

        // Finalize stock reservations & decrement actual stock concurrently
        const stockUpdates = order.items
          .filter((item: any) => item.productId)
          .map((item: any) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
          );

        if (stockUpdates.length > 0) {
          await Promise.all(stockUpdates);
        }

        // Mark reservations finalized
        await tx.stockReservation.updateMany({
          where: { orderId: order.id },
          data: { status: "FINALIZED" },
        });

        // Record transaction
        await tx.paymentTransaction.create({
          data: {
            orderId: order.id,
            gateway: "RAZORPAY",
            razorpayOrderId,
            razorpayPaymentId,
            status: rzpPayment.status.toUpperCase(),
            amountInPaise: rzpPayment.amount,
            currency: rzpPayment.currency || "INR",
            payload: rzpPayment as any,
          },
        });
      },
      {
        maxWait: 15000,
        timeout: 30000,
      }
    );

    // Asynchronously trigger tax invoice delivery to both customer & store owner (bizleap1@gmail.com)
    sendOrderInvoiceEmail(order.id).catch((emailErr) => {
      console.error("Payment verified invoice delivery error:", emailErr);
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      guestAccessToken: order.guestAccessToken,
      message: "Payment verified successfully.",
    });
  } catch (error: any) {
    console.error("POST /api/checkout/verify error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
