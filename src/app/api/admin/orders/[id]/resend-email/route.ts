import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { sendOrderInvoiceEmail } from "@/backend/services/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const customEmail = body?.customEmail?.trim()?.toLowerCase();

    // 1. Fetch order
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        user: { select: { email: true, name: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Ensure guestAccessToken exists so tracking link always works
    let guestToken = order.guestAccessToken;
    if (!guestToken) {
      guestToken = crypto.randomBytes(24).toString("hex");
      await prisma.order.update({
        where: { id: order.id },
        data: { guestAccessToken: guestToken },
      });
    }

    // 3. Determine target customer email
    let targetEmail = customEmail || order.guestEmail || order.user?.email;
    if (!targetEmail && order.shippingAddress) {
      try {
        const addr =
          typeof order.shippingAddress === "string"
            ? JSON.parse(order.shippingAddress)
            : order.shippingAddress;
        if (addr?.email) targetEmail = String(addr.email).trim().toLowerCase();
      } catch {}
    }

    if (!targetEmail) {
      return NextResponse.json(
        {
          error:
            "No customer email found for this order. Please specify an email address.",
        },
        { status: 400 }
      );
    }

    // If admin provided a new custom email, save to guestEmail
    if (customEmail && customEmail !== order.guestEmail) {
      await prisma.order.update({
        where: { id: order.id },
        data: { guestEmail: customEmail },
      });
    }

    // 4. Dispatch invoice & tracking link email
    const result = await sendOrderInvoiceEmail(order.id, targetEmail);

    const siteBase =
      process.env.NEXT_PUBLIC_SITE_URL || "https://rajwadirajputiposhak.com";
    const trackingUrl = `${siteBase}/order/${order.id}?token=${guestToken}`;

    return NextResponse.json({
      success: true,
      emailSentTo: targetEmail,
      customerSent: result.customerSent,
      trackingUrl,
      message: `Invoice & tracking link successfully sent to ${targetEmail}`,
    });
  } catch (error: any) {
    console.error("POST /api/admin/orders/[id]/resend-email error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to resend invoice email" },
      { status: 500 }
    );
  }
}
