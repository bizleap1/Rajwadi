import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: {
          orderBy: { createdAt: "desc" },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
          },
        },
        sessions: {
          select: {
            id: true,
            expiresAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const paidOrders = user.orders.filter((o) => o.paymentStatus === "PAID");
    const totalSpentInPaise = paidOrders.reduce((sum, o) => sum + o.totalInPaise, 0);

    return NextResponse.json({
      customer: {
        ...user,
        totalSpentInPaise,
        totalSpentFormatted: `₹ ${(totalSpentInPaise / 100).toLocaleString("en-IN")}`,
        addresses: user.addresses.map((a) => ({
          id: a.id,
          fullName: a.name,
          phone: a.phone,
          streetAddress: a.address,
          city: a.city,
          state: a.state,
          pincode: a.pincode,
          country: "India",
          isDefault: a.isDefault,
        })),
        orders: user.orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          totalInPaise: o.totalInPaise,
          discountInPaise: o.discountInPaise || 0,
          couponCode: o.couponCode || null,
          paymentStatus: o.paymentStatus,
          fulfilmentStatus: o.fulfilmentStatus,
          createdAt: o.createdAt.toISOString(),
          items: o.items.map((it) => ({
            id: it.id,
            productTitle: it.productName || "Product",
            quantity: it.quantity,
            priceInPaise: it.unitPriceInPaise,
            size: it.size,
          })),
        })),
      },
    });
  } catch (error: any) {
    console.error("Error fetching customer details:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch customer details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Customer profile not found or already deleted" },
        { status: 404 }
      );
    }

    // Protection: Do not allow deleting an ADMIN account from customer portal
    if (targetUser.role === "ADMIN") {
      return NextResponse.json(
        { error: "Administrator profiles cannot be deleted from the customer section." },
        { status: 403 }
      );
    }

    // Safety: Detach userId from existing orders so financial/accounting records are preserved
    await prisma.order.updateMany({
      where: { userId: id },
      data: { userId: null },
    });

    // Delete customer user profile (cascades sessions, accounts, addresses)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Customer profile for ${targetUser.name || targetUser.email} has been permanently deleted.`,
    });
  } catch (error: any) {
    console.error("Error deleting customer profile:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete customer profile" },
      { status: 500 }
    );
  }
}
