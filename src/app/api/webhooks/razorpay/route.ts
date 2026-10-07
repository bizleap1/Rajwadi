import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { sendOrderInvoiceEmail } from "@/backend/services/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      console.error("Invalid Razorpay webhook signature");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || `evt_${Date.now()}_${Math.random()}`;
    const eventType = payload.event;

    // Idempotency: Deduplicate event
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { id: eventId },
    });

    if (existingEvent) {
      return NextResponse.json({ received: true, deduplicated: true });
    }

    // Process event
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId },
          include: { items: true },
        });

        if (order && order.paymentStatus !== "PAID") {
          await prisma.$transaction(
            async (tx) => {
              let resolvedUserId = order.userId;
              if (!resolvedUserId && order.guestEmail) {
                const u = await tx.user.findUnique({
                  where: { email: order.guestEmail.toLowerCase().trim() },
                });
                if (u) resolvedUserId = u.id;
              }

              await tx.order.update({
                where: { id: order.id },
                data: {
                  paymentStatus: "PAID",
                  fulfilmentStatus: "IN_ATELIER",
                  razorpayPaymentId: razorpayPaymentId || order.razorpayPaymentId,
                  ...(resolvedUserId ? { userId: resolvedUserId } : {}),
                },
              });

              const stockUpdates = order.items
                .filter((item) => item.productId)
                .map((item) =>
                  tx.product.update({
                    where: { id: item.productId! },
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

              await tx.stockReservation.updateMany({
                where: { orderId: order.id },
                data: { status: "FINALIZED" },
              });
            },
            {
              maxWait: 15000,
              timeout: 30000,
            }
          );

          // Asynchronously trigger tax invoice delivery to both customer & store owner
          sendOrderInvoiceEmail(order.id).catch((emailErr) => {
            console.error("Webhook invoice delivery error:", emailErr);
          });
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;

      if (razorpayOrderId) {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId },
        });

        // Only mark failed if not already paid
        if (order && order.paymentStatus === "PENDING") {
          await prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: "FAILED" },
          });
        }
      }
    }

    // Persist event record
    await prisma.webhookEvent.create({
      data: {
        id: eventId,
        eventType,
        payload,
      },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
