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
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { order: { orderNumber: { contains: search, mode: "insensitive" } } },
        { orderItem: { productName: { contains: search, mode: "insensitive" } } },
        { guestEmail: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [exchanges, total] = await Promise.all([
      prisma.exchangeRequest.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              shippingAddress: true,
              totalInPaise: true,
            },
          },
          orderItem: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
      prisma.exchangeRequest.count({ where }),
    ]);

    return NextResponse.json({
      exchanges: exchanges.map((ex: any) => ({
        id: ex.id,
        orderId: ex.orderId,
        orderNumber: ex.order.orderNumber,
        customerName:
          (ex.order.shippingAddress as any)?.fullName || ex.user?.name || "Patron",
        customerEmail:
          ex.guestEmail || ex.user?.email || (ex.order.shippingAddress as any)?.email,
        customerPhone:
          (ex.order.shippingAddress as any)?.phone || ex.user?.phone || "",
        productName: ex.orderItem.productName,
        productImage: ex.orderItem.imageUrl,
        originalSize: ex.orderItem.size,
        desiredSize: ex.desiredSize,
        desiredReplacement: ex.desiredReplacement,
        reason: ex.reason,
        reasonDetails: ex.reasonDetails,
        status: ex.status,
        adminNotes: ex.adminNotes,
        reverseCourierPartner: ex.reverseCourierPartner,
        reverseTrackingNumber: ex.reverseTrackingNumber,
        replacementTrackingNumber: ex.replacementTrackingNumber,
        createdAt: ex.createdAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("GET /api/admin/exchanges error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch exchange requests" },
      { status: 500 }
    );
  }
}
