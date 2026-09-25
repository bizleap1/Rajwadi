import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { CouponFormSchema } from "@/lib/validations/discount";

export const dynamic = "force-dynamic";

// GET /api/admin/discounts/[id] - Fetch single coupon details & recent orders using it
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            totalInPaise: true,
            discountInPaise: true,
            guestEmail: true,
            createdAt: true,
            paymentStatus: true,
          },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Discount coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (error: any) {
    console.error("GET /api/admin/discounts/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch coupon" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/discounts/[id] - Update coupon
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.coupon.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Discount coupon not found" }, { status: 404 });
    }

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

    // Check if new code conflicts with another coupon
    if (code !== existing.code) {
      const duplicate = await prisma.coupon.findUnique({ where: { code } });
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json(
          { error: `Coupon code "${code}" is already in use.` },
          { status: 409 }
        );
      }
    }

    // Convert values
    let discountValue = data.discountValue;
    if (data.discountType === "FIXED_AMOUNT") {
      discountValue = Math.round(data.discountValue * 100);
    } else if (data.discountType === "FREE_SHIPPING") {
      discountValue = 0;
    }

    const maxDiscountInPaise = data.maxDiscountInRupees
      ? Math.round(data.maxDiscountInRupees * 100)
      : null;

    const minOrderValueInPaise = Math.round(data.minOrderValueInRupees * 100);

    const updated = await prisma.coupon.update({
      where: { id },
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
      message: "Coupon updated successfully.",
      coupon: updated,
    });
  } catch (error: any) {
    console.error("PUT /api/admin/discounts/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update discount coupon" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/discounts/[id] - Delete coupon
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.coupon.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Discount coupon not found" }, { status: 404 });
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Coupon "${existing.code}" deleted successfully.`,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/discounts/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete discount coupon" },
      { status: 500 }
    );
  }
}
