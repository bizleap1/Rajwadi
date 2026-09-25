import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PATCH /api/admin/discounts/[id]/toggle - Toggle active status
export async function PATCH(
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

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    return NextResponse.json({
      success: true,
      message: `Coupon "${updated.code}" is now ${updated.isActive ? "ACTIVE" : "INACTIVE"}.`,
      isActive: updated.isActive,
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/discounts/[id]/toggle error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to toggle discount coupon" },
      { status: 500 }
    );
  }
}
