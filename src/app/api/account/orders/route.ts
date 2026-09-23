import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [{ createdAt: "desc" }],
      include: {
        items: true,
      },
    });

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
        const subtotalInPaise = o.subtotalInPaise || o.totalInPaise || 0;
        const stitchingInPaise = o.stitchingInPaise || 0;
        const shippingInPaise = o.shippingInPaise || 0;
        const totalInPaise = o.totalInPaise || 0;

        return {
          id: o.id,
          orderNumber: o.orderNumber,
          guestEmail: o.guestEmail || null,
          subtotalInPaise,
          stitchingInPaise,
          shippingInPaise,
          totalInPaise,
          subtotalFormatted: `₹ ${(subtotalInPaise / 100).toLocaleString("en-IN")}`,
          stitchingFormatted: `₹ ${(stitchingInPaise / 100).toLocaleString("en-IN")}`,
          shippingFormatted: shippingInPaise === 0 ? "FREE" : `₹ ${(shippingInPaise / 100).toLocaleString("en-IN")}`,
          totalFormatted: `₹ ${(totalInPaise / 100).toLocaleString("en-IN")}`,
          itemCount: o.items.reduce((acc: number, i: any) => acc + i.quantity, 0),
          paymentStatus: o.paymentStatus,
          paymentMethod: o.paymentMethod || "ONLINE",
          fulfilmentStatus: o.fulfilmentStatus,
          courierPartner: o.courierPartner || null,
          trackingNumber: o.trackingNumber || null,
          trackingUrl: o.trackingUrl || null,
          estimatedDeliveryDate: o.estimatedDeliveryDate ? new Date(o.estimatedDeliveryDate).toISOString() : null,
          deliveredAt: o.deliveredAt ? new Date(o.deliveredAt).toISOString() : null,
          shippingAddress: o.shippingAddress || null,
          exchangeRequests: orderExchanges.map((ex: any) => ({
            id: ex.id,
            orderItemId: ex.orderItemId,
            desiredSize: ex.desiredSize,
            status: ex.status,
            createdAt: new Date(ex.createdAt).toISOString(),
          })),
          createdAt: new Date(o.createdAt).toISOString(),
          updatedAt: new Date(o.updatedAt || o.createdAt).toISOString(),
          items: o.items.map((i: any) => {
            const unitPrice = i.unitPriceInPaise || 0;
            const totalItem = i.totalInPaise || unitPrice * (i.quantity || 1);
            return {
              id: i.id,
              productName: i.productName,
              category: i.category || "Traditional Poshak",
              size: i.size,
              stitchingSelected: i.stitchingSelected || false,
              stitchingPriceInPaise: i.stitchingPriceInPaise || 0,
              quantity: i.quantity,
              unitPriceInPaise: unitPrice,
              unitPriceFormatted: `₹ ${(unitPrice / 100).toLocaleString("en-IN")}`,
              totalInPaise: totalItem,
              totalFormatted: `₹ ${(totalItem / 100).toLocaleString("en-IN")}`,
              imageUrl: i.imageUrl,
            };
          }),
        };
      }),
    });
  } catch (error) {
    console.error("GET /api/account/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch account orders" },
      { status: 500 }
    );
  }
}
