import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit(`order-details:${ip}`, {
      windowMs: 60_000,
      maxRequests: 60,
    });
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

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

    // Safely query exchange requests without throwing if relation is newly added
    let exchangeRequests: any[] = [];
    try {
      exchangeRequests = await (prisma as any).exchangeRequest.findMany({
        where: { orderId: order.id },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.warn("Could not query exchange requests:", e);
      exchangeRequests = [];
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
        {
          error:
            "Unauthorized. Please log in with the associated account or provide a valid access token.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        guestEmail: order.guestEmail,
        subtotalInPaise: order.subtotalInPaise,
        shippingInPaise: order.shippingInPaise,
        stitchingInPaise: order.stitchingInPaise,
        totalInPaise: order.totalInPaise,
        subtotalFormatted: `₹ ${(order.subtotalInPaise / 100).toLocaleString("en-IN")}`,
        shippingFormatted: order.shippingInPaise === 0 ? "FREE" : `₹ ${(order.shippingInPaise / 100).toLocaleString("en-IN")}`,
        stitchingFormatted: `₹ ${(order.stitchingInPaise / 100).toLocaleString("en-IN")}`,
        totalFormatted: `₹ ${(order.totalInPaise / 100).toLocaleString("en-IN")}`,
        discountInPaise: (order as any).discountInPaise || 0,
        discountFormatted: (order as any).discountInPaise ? `₹ ${((order as any).discountInPaise / 100).toLocaleString("en-IN")}` : null,
        couponCode: (order as any).couponCode || null,
        paymentStatus: order.paymentStatus,
        fulfilmentStatus: order.fulfilmentStatus,
        courierPartner: (order as any).courierPartner || null,
        trackingNumber: (order as any).trackingNumber || null,
        trackingUrl: (order as any).trackingUrl || null,
        estimatedDeliveryDate: (order as any).estimatedDeliveryDate
          ? new Date((order as any).estimatedDeliveryDate).toISOString()
          : null,
        deliveredAt: (order as any).deliveredAt
          ? new Date((order as any).deliveredAt).toISOString()
          : null,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        createdAt: new Date(order.createdAt).toISOString(),
        items: (order.items || []).map((item: any) => ({
          id: item.id,
          productId: item.productSlug || item.productId,
          productName: item.productName,
          category: item.category,
          size: item.size,
          stitchingSelected: item.stitchingSelected,
          stitchingPriceInPaise: item.stitchingPriceInPaise,
          unitPriceInPaise: item.unitPriceInPaise,
          unitPriceFormatted: `₹ ${(item.unitPriceInPaise / 100).toLocaleString("en-IN")}`,
          quantity: item.quantity,
          totalInPaise: item.totalInPaise,
          totalFormatted: `₹ ${(item.totalInPaise / 100).toLocaleString("en-IN")}`,
          imageUrl: item.imageUrl,
        })),
        exchangeRequests: exchangeRequests || [],
      },
    });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
