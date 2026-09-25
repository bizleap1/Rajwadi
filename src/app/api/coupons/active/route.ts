import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const activeCoupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
      select: {
        id: true,
        code: true,
        discountType: true,
        discountValue: true,
        description: true,
        applicableScope: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      coupons: activeCoupons,
    });
  } catch (error: any) {
    console.error("Error fetching active coupons:", error);
    return NextResponse.json({ coupons: [] }, { status: 500 });
  }
}
