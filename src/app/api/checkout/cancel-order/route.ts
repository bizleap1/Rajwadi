import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId, guestAccessToken } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required." },
        { status: 400 }
      );
    }

    // Find matching order
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: true, message: "Order does not exist or already removed." },
        { status: 200 }
      );
    }

    // Critical Security Guard: NEVER delete or modify a paid order through this endpoint
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Paid orders cannot be automatically removed." },
        { status: 400 }
      );
    }

    // Validate access token if order has one
    if (
      guestAccessToken &&
      order.guestAccessToken &&
      order.guestAccessToken !== guestAccessToken
    ) {
      return NextResponse.json(
        { error: "Unauthorized token mismatch." },
        { status: 403 }
      );
    }

    // Only clean up uncompleted PENDING orders
    if (order.paymentStatus === "PENDING") {
      await prisma.$transaction(
        async (tx) => {
          // 1. Release stock reservations
          await tx.stockReservation.deleteMany({
            where: { orderId: order.id },
          });

          // 2. Delete payment transactions
          await tx.paymentTransaction.deleteMany({
            where: { orderId: order.id },
          });

          // 3. Delete order items
          await tx.orderItem.deleteMany({
            where: { orderId: order.id },
          });

          // 4. Delete the order record
          await tx.order.delete({
            where: { id: order.id },
          });
        },
        {
          maxWait: 10000,
          timeout: 20000,
        }
      );

      try {
        const { revalidatePath } = await import("next/cache");
        revalidatePath("/admin/orders");
        revalidatePath("/admin/customers");
        revalidatePath("/admin");
      } catch {
        // ignore cache warnings
      }

      return NextResponse.json({
        success: true,
        message: `Pending order #${order.orderNumber} successfully cleaned up.`,
      });
    }

    return NextResponse.json(
      { message: "Order is not in pending status." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/checkout/cancel-order error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to cancel pending order" },
      { status: 500 }
    );
  }
}
