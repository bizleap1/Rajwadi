import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await requireAdminSession(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Parallel aggregate queries for ultra-fast response
    const [
      totalOrders,
      paidOrdersCount,
      pendingOrdersCount,
      revenueResult,
      fulfilmentInAtelier,
      fulfilmentDispatched,
      fulfilmentDelivered,
      fulfilmentPending,
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      stitchedCount,
      unstitchedCount,
      traditionalCount,
      lowStockProducts,
      activeCouponsCount,
      couponRedemptionsResult,
      totalDiscountResult,
      pendingExchangesCount,
      totalExchangesCount,
      recentOrdersRaw,
      recentWeekOrders,
    ] = await Promise.all([
      // Orders counts
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: "PAID" } }),
      prisma.order.count({ where: { paymentStatus: "PENDING" } }),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { totalInPaise: true },
      }),

      // Fulfilment breakdown
      prisma.order.count({ where: { fulfilmentStatus: "IN_ATELIER" } }),
      prisma.order.count({ where: { fulfilmentStatus: "DISPATCHED" } }),
      prisma.order.count({ where: { fulfilmentStatus: "DELIVERED" } }),
      prisma.order.count({ where: { fulfilmentStatus: "PENDING" } }),

      // Catalog breakdown
      prisma.product.count(),
      prisma.product.count({ where: { inStock: true } }),
      prisma.product.count({ where: { inStock: false } }),
      prisma.product.count({ where: { category: "Stitched" } }),
      prisma.product.count({ where: { category: "Unstitched" } }),
      prisma.product.count({ where: { category: "Traditional" } }),
      prisma.product.findMany({
        where: { stock: { lte: 3 } },
        take: 5,
        select: { id: true, name: true, stock: true, category: true, slug: true, priceInPaise: true },
        orderBy: { stock: "asc" },
      }),

      // Discounts
      prisma.coupon.count({ where: { isActive: true } }),
      prisma.coupon.aggregate({ _sum: { usedCount: true } }),
      prisma.order.aggregate({ _sum: { discountInPaise: true } }),

      // Exchanges
      prisma.exchangeRequest.count({ where: { status: "REQUESTED" } }),
      prisma.exchangeRequest.count(),

      // Top 6 Recent Orders
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { select: { id: true, productName: true, quantity: true, unitPriceInPaise: true } },
        },
      }),

      // Past 7 Days Orders for Trend
      prisma.order.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, totalInPaise: true, paymentStatus: true },
      }),
    ]);

    const totalRevenueInPaise = revenueResult._sum.totalInPaise || 0;
    const avgOrderValueInPaise =
      paidOrdersCount > 0 ? Math.round(totalRevenueInPaise / paidOrdersCount) : 0;

    // Process 7-day trend
    const dayMap = new Map<string, { label: string; revenueInPaise: number; count: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
      dayMap.set(key, { label, revenueInPaise: 0, count: 0 });
    }

    for (const order of recentWeekOrders) {
      const key = order.createdAt.toISOString().slice(0, 10);
      if (dayMap.has(key)) {
        const entry = dayMap.get(key)!;
        entry.count += 1;
        if (order.paymentStatus === "PAID") {
          entry.revenueInPaise += order.totalInPaise;
        }
      }
    }

    const salesTrend = Array.from(dayMap.entries()).map(([date, val]) => ({
      date,
      label: val.label,
      revenueInRupees: Math.round(val.revenueInPaise / 100),
      ordersCount: val.count,
    }));

    // Formatted recent orders
    const recentOrders = recentOrdersRaw.map((o) => {
      const addr = o.shippingAddress as any;
      const customerName = addr?.fullName || o.user?.name || "Guest Patron";
      const customerEmail = o.guestEmail || o.user?.email || addr?.email || "—";
      const totalItems = o.items.reduce((s, it) => s + it.quantity, 0);

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        customerName,
        customerEmail,
        totalInPaise: o.totalInPaise,
        totalInRupees: Math.round(o.totalInPaise / 100),
        totalItems,
        paymentStatus: o.paymentStatus,
        fulfilmentStatus: o.fulfilmentStatus,
        createdAt: o.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      metrics: {
        revenue: {
          totalInPaise: totalRevenueInPaise,
          totalInRupees: Math.round(totalRevenueInPaise / 100),
          paidOrdersCount,
          avgOrderValueInRupees: Math.round(avgOrderValueInPaise / 100),
        },
        orders: {
          total: totalOrders,
          paid: paidOrdersCount,
          pending: pendingOrdersCount,
          inAtelier: fulfilmentInAtelier,
          dispatched: fulfilmentDispatched,
          delivered: fulfilmentDelivered,
          fulfilmentPending,
        },
        catalog: {
          total: totalProducts,
          inStock: inStockProducts,
          outOfStock: outOfStockProducts,
          categories: {
            stitched: stitchedCount,
            unstitched: unstitchedCount,
            traditional: traditionalCount,
          },
        },
        discounts: {
          activeCoupons: activeCouponsCount,
          totalRedemptions: couponRedemptionsResult._sum.usedCount || 0,
          totalDiscountGivenInRupees: Math.round(
            (totalDiscountResult._sum.discountInPaise || 0) / 100
          ),
        },
        exchanges: {
          pendingRequests: pendingExchangesCount,
          totalRequests: totalExchangesCount,
        },
      },
      lowStockProducts,
      salesTrend,
      recentOrders,
    });
  } catch (error: any) {
    console.error("GET /api/admin/dashboard error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
