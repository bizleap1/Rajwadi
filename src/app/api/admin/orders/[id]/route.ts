import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateOrderSchema = z.object({
  paymentStatus: z
    .enum([
      "PENDING",
      "VERIFICATION_PENDING",
      "PAID",
      "FAILED",
      "CANCELLED",
      "REFUNDED",
    ])
    .optional(),
  fulfilmentStatus: z
    .enum([
      "PENDING",
      "IN_ATELIER",
      "READY_TO_DISPATCH",
      "DISPATCHED",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),
  courierPartner: z.string().nullable().optional(),
  trackingNumber: z.string().nullable().optional(),
  trackingUrl: z.string().nullable().optional(),
  estimatedDeliveryDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const order: any = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: true,
        transactions: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    try {
      order.exchangeRequests = await (prisma as any).exchangeRequest.findMany({
        where: { orderId: order.id },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      order.exchangeRequests = [];
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("GET /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateOrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid order update details", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (validated.data.paymentStatus !== undefined) {
      updateData.paymentStatus = validated.data.paymentStatus;
    }

    if (validated.data.fulfilmentStatus !== undefined) {
      updateData.fulfilmentStatus = validated.data.fulfilmentStatus;
      if (validated.data.fulfilmentStatus === "DELIVERED") {
        updateData.deliveredAt = new Date();
      }
    }

    if (validated.data.courierPartner !== undefined) {
      updateData.courierPartner = validated.data.courierPartner;
    }

    if (validated.data.trackingNumber !== undefined) {
      updateData.trackingNumber = validated.data.trackingNumber;
    }

    if (validated.data.trackingUrl !== undefined) {
      updateData.trackingUrl = validated.data.trackingUrl;
    }

    if (validated.data.estimatedDeliveryDate !== undefined) {
      updateData.estimatedDeliveryDate = validated.data.estimatedDeliveryDate
        ? new Date(validated.data.estimatedDeliveryDate)
        : null;
    }

    if (validated.data.notes !== undefined) {
      updateData.notes = validated.data.notes;
    }

    const updated: any = await prisma.order.update({
      where: { id: order.id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: true,
        transactions: true,
      },
    });

    try {
      updated.exchangeRequests = await (prisma as any).exchangeRequest.findMany({
        where: { orderId: updated.id },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      updated.exchangeRequests = [];
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Atomically delete all child records and the order
    await prisma.$transaction(
      async (tx) => {
        // 1. Delete stock reservations
        await tx.stockReservation.deleteMany({
          where: { orderId: order.id },
        });

        // 2. Delete exchange requests
        try {
          await (tx as any).exchangeRequest.deleteMany({
            where: { orderId: order.id },
          });
        } catch {
          // ignore if model not present
        }

        // 3. Delete payment transactions
        await tx.paymentTransaction.deleteMany({
          where: { orderId: order.id },
        });

        // 4. Delete order items
        await tx.orderItem.deleteMany({
          where: { orderId: order.id },
        });

        // 5. Delete order record
        await tx.order.delete({
          where: { id: order.id },
        });
      },
      {
        maxWait: 15000,
        timeout: 30000,
      }
    );

    return NextResponse.json({
      success: true,
      message: `Order #${order.orderNumber} deleted permanently.`,
      deletedOrderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
