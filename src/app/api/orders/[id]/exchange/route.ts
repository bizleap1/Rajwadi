import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateExchangeSchema = z.object({
  orderItemId: z.string().trim().min(1, "Please select an item to exchange").max(100),
  reason: z.enum([
    "SIZE_FITTING",
    "COLOR_PREFERENCE",
    "DAMAGE_DEFECT",
    "ALTERATION",
    "OTHER",
  ]),
  reasonDetails: z.string().trim().max(1000, "Details cannot exceed 1000 characters").optional(),
  desiredSize: z.string().trim().max(50, "Size cannot exceed 50 characters").optional(),
  desiredReplacement: z.string().trim().max(200, "Replacement cannot exceed 200 characters").optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit(`order-exchange-post:${ip}`, {
      windowMs: 60_000,
      maxRequests: 5,
    });
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many exchange requests. Please wait a minute before trying again." },
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

    // Crash-safe JSON parsing
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const validated = CreateExchangeSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid exchange request details", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { orderItemId, reason, reasonDetails, desiredSize, desiredReplacement } = validated.data;

    // Verify order is delivered before allowing exchange
    if (order.fulfilmentStatus !== "DELIVERED") {
      return NextResponse.json(
        { error: "Exchange requests can only be submitted once the order has been delivered." },
        { status: 400 }
      );
    }

    // Verify 7-day exchange window
    const deliveryDate = (order as any).deliveredAt || order.updatedAt;
    if (deliveryDate) {
      const daysSinceDelivery = (Date.now() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDelivery > 7) {
        return NextResponse.json(
          { error: "The 7-day exchange guarantee period has ended for this order. Please reach out to concierge support." },
          { status: 400 }
        );
      }
    }

    // Verify order item belongs to order
    const orderItem = order.items.find((item) => item.id === orderItemId);
    if (!orderItem) {
      return NextResponse.json(
        { error: "Selected item does not belong to this order" },
        { status: 400 }
      );
    }

    // Check if an existing open exchange request exists
    const existingExchange = await prisma.exchangeRequest.findFirst({
      where: {
        orderId: order.id,
        orderItemId,
        status: { in: ["REQUESTED", "APPROVED", "PICKUP_SCHEDULED", "RECEIVED_AT_ATELIER", "REPLACEMENT_DISPATCHED"] },
      },
    });

    if (existingExchange) {
      return NextResponse.json(
        { error: "An active exchange request is already in progress for this item." },
        { status: 409 }
      );
    }

    const exchange = await prisma.exchangeRequest.create({
      data: {
        orderId: order.id,
        orderItemId,
        userId: session?.user?.id || order.userId || null,
        guestEmail: order.guestEmail || null,
        reason,
        reasonDetails: reasonDetails?.trim() || null,
        desiredSize: desiredSize?.trim() || null,
        desiredReplacement: desiredReplacement?.trim() || null,
        status: "REQUESTED",
      },
      include: {
        orderItem: true,
      },
    });

    return NextResponse.json({ success: true, exchange }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders/[id]/exchange error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create exchange request" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit(`order-exchange-get:${ip}`, {
      windowMs: 60_000,
      maxRequests: 30,
    });
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const exchanges = await prisma.exchangeRequest.findMany({
      where: {
        orderId: order.id,
      },
      orderBy: [{ createdAt: "desc" }],
      include: {
        orderItem: true,
      },
    });

    return NextResponse.json({ exchanges });
  } catch (error: any) {
    console.error("GET /api/orders/[id]/exchange error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch exchange requests" },
      { status: 500 }
    );
  }
}
