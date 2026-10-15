import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await requireAdminSession(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const now = new Date();
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month"); // 1 - 12

  const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear();
  const month = monthParam ? parseInt(monthParam, 10) : now.getMonth() + 1;

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid month or year parameter" }, { status: 400 });
  }

  // Define date range for the selected month in UTC/Local bounds
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: true,
      },
    });

    // Aggregates
    let totalGrossInPaise = 0;
    let totalPaidInPaise = 0;
    let totalPendingInPaise = 0;
    let totalStitchingInPaise = 0;
    let totalDiscountInPaise = 0;
    let totalShippingInPaise = 0;

    let paidOrdersCount = 0;
    let pendingOrdersCount = 0;
    let cancelledOrdersCount = 0;

    const fulfilmentBreakdown: Record<string, number> = {
      DELIVERED: 0,
      DISPATCHED: 0,
      IN_ATELIER: 0,
      PENDING: 0,
      CANCELLED: 0,
    };

    const productSalesMap: Record<
      string,
      { productName: string; quantity: number; totalInPaise: number }
    > = {};

    const formattedOrders = orders.map((order) => {
      const isPaid = order.paymentStatus === "PAID";
      const isPending =
        order.paymentStatus === "PENDING" ||
        order.paymentStatus === "VERIFICATION_PENDING";
      const isCancelled =
        order.paymentStatus === "CANCELLED" || order.fulfilmentStatus === "CANCELLED";

      totalGrossInPaise += order.totalInPaise;
      totalStitchingInPaise += order.stitchingInPaise;
      totalDiscountInPaise += order.discountInPaise;
      totalShippingInPaise += order.shippingInPaise;

      if (isPaid) {
        totalPaidInPaise += order.totalInPaise;
        paidOrdersCount++;
      } else if (isPending) {
        totalPendingInPaise += order.totalInPaise;
        pendingOrdersCount++;
      }

      if (isCancelled) {
        cancelledOrdersCount++;
      }

      const fStatus = order.fulfilmentStatus || "PENDING";
      fulfilmentBreakdown[fStatus] = (fulfilmentBreakdown[fStatus] || 0) + 1;

      // Extract shipping address safely
      let shippingInfo: any = {};
      if (typeof order.shippingAddress === "string") {
        try {
          shippingInfo = JSON.parse(order.shippingAddress);
        } catch {
          shippingInfo = {};
        }
      } else if (order.shippingAddress && typeof order.shippingAddress === "object") {
        shippingInfo = order.shippingAddress;
      }

      // Aggregate item metrics
      const itemsList = order.items.map((item) => {
        const key = item.productId || item.productName;
        if (!productSalesMap[key]) {
          productSalesMap[key] = {
            productName: item.productName,
            quantity: 0,
            totalInPaise: 0,
          };
        }
        productSalesMap[key].quantity += item.quantity;
        productSalesMap[key].totalInPaise += item.totalInPaise;

        return {
          id: item.id,
          productName: item.productName,
          size: item.size,
          quantity: item.quantity,
          stitchingSelected: item.stitchingSelected,
          unitPriceInPaise: item.unitPriceInPaise,
          totalInPaise: item.totalInPaise,
        };
      });

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.createdAt.toISOString(),
        customerName:
          shippingInfo.fullName || order.user?.name || "Patron",
        customerEmail:
          shippingInfo.email || order.user?.email || order.guestEmail || "—",
        customerPhone: shippingInfo.phone || order.user?.phone || "—",
        city: shippingInfo.city || "—",
        state: shippingInfo.state || "—",
        paymentStatus: order.paymentStatus,
        fulfilmentStatus: order.fulfilmentStatus,
        paymentMethod: order.paymentMethod,
        utrNumber: order.utrNumber,
        subtotalInPaise: order.subtotalInPaise,
        stitchingInPaise: order.stitchingInPaise,
        discountInPaise: order.discountInPaise,
        totalInPaise: order.totalInPaise,
        itemsCount: order.items.reduce((acc, it) => acc + it.quantity, 0),
        items: itemsList,
      };
    });

    // Top selling items
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.totalInPaise - a.totalInPaise)
      .slice(0, 5)
      .map((p) => ({
        ...p,
        totalInRupees: Math.round(p.totalInPaise / 100),
      }));

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthLabel = `${monthNames[month - 1]} ${year}`;
    const avgOrderValueInPaise =
      paidOrdersCount > 0 ? Math.round(totalPaidInPaise / paidOrdersCount) : 0;

    return NextResponse.json({
      reportPeriod: {
        month,
        year,
        label: monthLabel,
        generatedAt: new Date().toISOString(),
        reportReference: `RW-AUDIT-${year}${String(month).padStart(2, "0")}`,
      },
      summary: {
        totalOrders: orders.length,
        paidOrdersCount,
        pendingOrdersCount,
        cancelledOrdersCount,
        totalGrossInPaise,
        totalGrossInRupees: Math.round(totalGrossInPaise / 100),
        totalPaidInPaise,
        totalPaidInRupees: Math.round(totalPaidInPaise / 100),
        totalPendingInPaise,
        totalPendingInRupees: Math.round(totalPendingInPaise / 100),
        totalStitchingInPaise,
        totalStitchingInRupees: Math.round(totalStitchingInPaise / 100),
        totalDiscountInPaise,
        totalDiscountInRupees: Math.round(totalDiscountInPaise / 100),
        totalShippingInPaise,
        totalShippingInRupees: Math.round(totalShippingInPaise / 100),
        avgOrderValueInRupees: Math.round(avgOrderValueInPaise / 100),
        fulfilmentBreakdown,
      },
      topProducts,
      orders: formattedOrders,
    });
  } catch (error: any) {
    console.error("Monthly report error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate monthly report" },
      { status: 500 }
    );
  }
}
