import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { razorpayInstance, isRazorpayConfigured } from "@/lib/razorpay";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit(`order-pay:${ip}`, {
      windowMs: 60_000,
      maxRequests: 20,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many payment requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    let guestToken = searchParams.get("token");

    // Also try reading from body if provided
    try {
      const body = await req.json();
      if (body?.token) guestToken = body.token;
    } catch {
      // Body is optional
    }

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

    // Access control: User or Guest token
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
            "Unauthorized. Please provide a valid access token or log in with the associated account.",
        },
        { status: 403 }
      );
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        {
          error: "This order is already marked as PAID.",
          alreadyPaid: true,
        },
        { status: 400 }
      );
    }

    if (!isRazorpayConfigured || !razorpayInstance) {
      return NextResponse.json(
        {
          error: "Razorpay payment gateway is not configured on the server.",
        },
        { status: 503 }
      );
    }

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;

    // Check if an existing razorpayOrderId is valid or create a fresh one
    let razorpayOrderId = order.razorpayOrderId;

    if (!razorpayOrderId) {
      const shippingAddr = (order.shippingAddress as any) || {};
      const rzpOrder = await razorpayInstance.orders.create({
        amount: order.totalInPaise,
        currency: "INR",
        receipt: order.orderNumber,
        notes: {
          orderNumber: order.orderNumber,
          customerEmail: order.guestEmail || shippingAddr.email || "",
          customerPhone: shippingAddr.phone || "",
        },
      });

      razorpayOrderId = rzpOrder.id;

      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId },
      });
    }

    const shippingAddr = (order.shippingAddress as any) || {};
    const customerName =
      shippingAddr.fullName || shippingAddr.name || "Valued Patron";
    const customerEmail =
      order.guestEmail || shippingAddr.email || "";
    const customerPhone = shippingAddr.phone || "";

    return NextResponse.json({
      success: true,
      keyId,
      razorpayOrderId,
      amountInPaise: order.totalInPaise,
      currency: "INR",
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      guestAccessToken: order.guestAccessToken,
    });
  } catch (error: any) {
    console.error("POST /api/orders/[id]/pay error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate payment retry." },
      { status: 500 }
    );
  }
}
