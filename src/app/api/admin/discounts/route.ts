import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { CouponFormSchema } from "@/lib/validations/discount";

export const dynamic = "force-dynamic";

// GET /api/admin/discounts - List all coupons with stats, filters & pagination
export async function GET(req: NextRequest) {
  const admin = await requireAdminSession(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "15", 10));
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL"; // ALL, ACTIVE, INACTIVE, EXPIRED
    const discountType = searchParams.get("type") || "ALL"; // ALL, PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING

    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { code: { contains: search.trim().toUpperCase(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const now = new Date();

    if (status === "ACTIVE") {
      where.isActive = true;
      where.OR = [
        { endDate: null },
        { endDate: { gte: now } },
      ];
    } else if (status === "INACTIVE") {
      where.isActive = false;
    } else if (status === "EXPIRED") {
      where.endDate = { lt: now };
    }

    if (discountType !== "ALL") {
      where.discountType = discountType;
    }

    const skip = (page - 1) * limit;

    const [coupons, total, totalActive, totalRedemptions] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.coupon.count({ where }),
      prisma.coupon.count({
        where: {
          isActive: true,
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
      }),
      prisma.coupon.aggregate({
        _sum: { usedCount: true },
      }),
    ]);

    // Calculate total discount given across all orders
    const totalDiscountResult = await prisma.order.aggregate({
      _sum: { discountInPaise: true },
    });

    return NextResponse.json({
      coupons,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      stats: {
        totalCoupons: total,
        activeCoupons: totalActive,
        totalRedemptions: totalRedemptions._sum.usedCount || 0,
        totalDiscountGivenInPaise: totalDiscountResult._sum.discountInPaise || 0,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/discounts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}

// POST /api/admin/discounts - Create a new discount coupon
export async function POST(req: NextRequest) {
  const admin = await requireAdminSession(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CouponFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;
    const code = data.code.toUpperCase();

    // Check if coupon code already exists
    const existing = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Coupon with code "${code}" already exists.` },
        { status: 409 }
      );
    }

    // Convert values
    let discountValue = data.discountValue;
    if (data.discountType === "FIXED_AMOUNT") {
      // In Rupees -> convert to paise
      discountValue = Math.round(data.discountValue * 100);
    } else if (data.discountType === "FREE_SHIPPING") {
      discountValue = 0;
    }

    const maxDiscountInPaise = data.maxDiscountInRupees
      ? Math.round(data.maxDiscountInRupees * 100)
      : null;

    const minOrderValueInPaise = Math.round(data.minOrderValueInRupees * 100);

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description: data.description || null,
        discountType: data.discountType,
        discountValue,
        maxDiscountInPaise,
        minOrderValueInPaise,
        usageLimit: data.usageLimit || null,
        perUserLimit: data.perUserLimit || 1,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: data.isActive,
        applicableScope: data.applicableScope || "ALL",
        applicableProducts: data.applicableProducts ? data.applicableProducts : undefined,
        applicableCategories: data.applicableCategories ? data.applicableCategories : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Discount coupon created successfully.",
      coupon,
    });
  } catch (error: any) {
    console.error("POST /api/admin/discounts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create discount coupon" },
      { status: 500 }
    );
  }
}
