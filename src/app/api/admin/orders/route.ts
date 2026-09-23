import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const paymentStatus = searchParams.get("paymentStatus");
    const fulfilmentStatus = searchParams.get("fulfilmentStatus");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { guestEmail: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (paymentStatus && paymentStatus !== "ALL") {
      where.paymentStatus = paymentStatus;
    }

    if (fulfilmentStatus && fulfilmentStatus !== "ALL") {
      where.fulfilmentStatus = fulfilmentStatus;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          items: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    const orderIds = orders.map((o) => o.id);
    let allExchanges: any[] = [];
    try {
      allExchanges = await (prisma as any).exchangeRequest.findMany({
        where: { orderId: { in: orderIds } },
      });
    } catch {
      allExchanges = [];
    }

    return NextResponse.json({
      orders: orders.map((o: any) => {
        const orderExchanges = allExchanges.filter((ex) => ex.orderId === o.id);
        return {
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: (o.shippingAddress as any)?.fullName || o.user?.name || "Guest Customer",
          customerEmail: o.guestEmail || o.user?.email || (o.shippingAddress as any)?.email,
          totalInPaise: o.totalInPaise,
          totalFormatted: `₹ ${(o.totalInPaise / 100).toLocaleString("en-IN")}`,
          itemCount: o.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
          paymentStatus: o.paymentStatus,
          fulfilmentStatus: o.fulfilmentStatus,
          courierPartner: o.courierPartner || null,
          trackingNumber: o.trackingNumber || null,
          estimatedDeliveryDate: o.estimatedDeliveryDate ? o.estimatedDeliveryDate.toISOString() : null,
          exchangeCount: orderExchanges.length,
          hasActiveExchange: orderExchanges.some(
            (ex: any) => ex.status !== "COMPLETED" && ex.status !== "REJECTED"
          ),
          createdAt: o.createdAt.toISOString(),
        };
      }),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin orders" },
      { status: 500 }
    );
  }
}
