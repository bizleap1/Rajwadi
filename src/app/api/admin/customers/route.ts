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
    const search = searchParams.get("search")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const skip = (page - 1) * limit;

    const where: any = {
      role: "CUSTOMER",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          addresses: {
            select: {
              id: true,
              city: true,
              state: true,
              pincode: true,
              isDefault: true,
            },
          },
          orders: {
            select: {
              id: true,
              orderNumber: true,
              totalInPaise: true,
              paymentStatus: true,
              fulfilmentStatus: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Format customers with aggregate lifetime spend and stats
    const customers = users.map((u) => {
      const paidOrders = u.orders.filter((o) => o.paymentStatus === "PAID");
      const totalSpentInPaise = paidOrders.reduce((sum, o) => sum + o.totalInPaise, 0);

      return {
        id: u.id,
        name: u.name || "Patron",
        email: u.email,
        phone: u.phone || "N/A",
        image: u.image,
        totalOrders: u.orders.length,
        paidOrdersCount: paidOrders.length,
        totalSpentInPaise,
        totalSpentFormatted: `₹ ${(totalSpentInPaise / 100).toLocaleString("en-IN")}`,
        addressesCount: u.addresses.length,
        defaultCity: u.addresses[0]?.city || "N/A",
        defaultState: u.addresses[0]?.state || "N/A",
        recentOrders: u.orders.slice(0, 5),
        createdAt: u.createdAt.toISOString(),
      };
    });

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      customers,
      totalCount,
      totalPages,
      page,
    });
  } catch (error: any) {
    console.error("Error fetching admin customers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
