import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CancelOrderSchema = z.object({
  reason: z.string().min(1, "Please select a reason for cancellation"),
  comments: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const guestToken = searchParams.get("token");

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Access control check
    const session = await getServerSession();
    const isOwnerUser = session?.user?.id && order.userId === session.user.id;
    const isAdmin = session?.user?.role === "ADMIN";
    const isValidGuestToken =
      guestToken &&
      order.guestAccessToken &&
      guestToken === order.guestAccessToken;

    if (!isOwnerUser && !isAdmin && !isValidGuestToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in or provide valid order credentials." },
        { status: 403 }
      );
    }

    // Check if already cancelled
    if (order.fulfilmentStatus === "CANCELLED") {
      return NextResponse.json(
        { error: "This order is already cancelled." },
        { status: 400 }
      );
    }

    // Standard E-commerce Cancellation Policy:
    // Orders can only be cancelled before dispatch / crafting in atelier
    if (order.fulfilmentStatus === "DISPATCHED" || order.fulfilmentStatus === "DELIVERED") {
      return NextResponse.json(
        {
          error:
            "This order has already been dispatched/delivered and cannot be cancelled directly. You can request a 7-day exchange once received or contact our concierge.",
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const validated = CancelOrderSchema.safeParse(body);

    const reason = validated.success ? validated.data.reason : "Cancelled by patron";
    const comments = validated.success && validated.data.comments ? ` - ${validated.data.comments}` : "";
    const cancellationNote = `[CANCELLED by Patron on ${new Date().toLocaleString("en-IN")}]: ${reason}${comments}`;

    const newPaymentStatus =
      order.paymentStatus === "PAID" ? "REFUNDED" : "CANCELLED";

    // Atomically cancel order and restore inventory stock
    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      // 1. Restore product stock for all items
      for (const item of order.items) {
        if (item.productId) {
          await tx.product
            .update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
                inStock: true,
              },
            })
            .catch(() => {
              // Ignore if product ID not found by slug
            });
        }
      }

      // 2. Remove any stock reservations
      await tx.stockReservation.deleteMany({
        where: { orderId: order.id },
      });

      // 3. Update order status
      return await tx.order.update({
        where: { id: order.id },
        data: {
          fulfilmentStatus: "CANCELLED",
          paymentStatus: newPaymentStatus,
          notes: order.notes
            ? `${order.notes}\n${cancellationNote}`
            : cancellationNote,
        },
        include: {
          items: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Order has been cancelled successfully. Any payment credit will be processed per refund policy.",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("POST /api/orders/[id]/cancel error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel order" },
      { status: 500 }
    );
  }
}
