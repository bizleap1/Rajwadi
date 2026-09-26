"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ArrowRightLeft,
  Tag,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  Truck,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import AdminMonthlyReportModal from "@/components/AdminMonthlyReportModal";

interface DashboardData {
  metrics: {
    revenue: {
      totalInPaise: number;
      totalInRupees: number;
      paidOrdersCount: number;
      avgOrderValueInRupees: number;
    };
    orders: {
      total: number;
      paid: number;
      pending: number;
      inAtelier: number;
      dispatched: number;
      delivered: number;
      fulfilmentPending: number;
    };
    catalog: {
      total: number;
      inStock: number;
      outOfStock: number;
      categories: {
        stitched: number;
        unstitched: number;
        traditional: number;
      };
    };
    discounts: {
      activeCoupons: number;
      totalRedemptions: number;
      totalDiscountGivenInRupees: number;
    };
    exchanges: {
      pendingRequests: number;
      totalRequests: number;
    };
  };
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    category: string;
    slug: string;
    priceInPaise: number;
  }>;
  salesTrend: Array<{
    date: string;
    label: string;
    revenueInRupees: number;
    ordersCount: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    totalInRupees: number;
    totalItems: number;
    paymentStatus: string;
    fulfilmentStatus: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fetchDashboard = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to load dashboard metrics");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Max value for visual sales chart scaling
  const maxRevenue = data?.salesTrend
    ? Math.max(...data.salesTrend.map((d) => d.revenueInRupees), 1000)
    : 1000;

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Top Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#EBD9C8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold block">
              RAJPUTI ATELIER COMMERCE COMMAND
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-medium rounded-xs border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Store Sync
            </span>
          </div>
          <h1 className="text-2xl font-serif text-[#171717] mt-0.5">
            Atelier Executive Dashboard
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#855D25]" />
            <span>{todayFormatted}</span>
            <span>·</span>
            <span>Real-time overview of revenue, handcrafted orders & inventory</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={isRefreshing}
            className="flex-1 sm:flex-initial justify-center px-3 py-2 bg-white border border-[#EBD9C8] hover:bg-[#FAF6F0] text-xs font-semibold text-[#4A3E37] rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#6D1A2A]" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 bg-white border border-[#855D25] hover:bg-[#FAF6F0] text-[#855D25] hover:text-[#6D1A2A] text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Download Monthly Audit Report & Order Ledger"
          >
            <Download className="w-3.5 h-3.5 text-[#6D1A2A]" />
            <span>Monthly Report</span>
          </button>

          <Link
            href="/admin/products"
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 bg-[#FAF6F0] border border-[#855D25]/40 text-[#855D25] hover:bg-[#855D25]/10 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Poshak</span>
          </Link>

          <Link
            href="/admin/orders"
            className="w-full sm:w-auto justify-center px-4 py-2 bg-[#6D1A2A] hover:bg-[#551320] text-white text-xs uppercase tracking-wider font-semibold shadow-xs rounded-sm transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-[#EBD9C8] rounded-sm p-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#6D1A2A] animate-spin" />
          <span className="text-xs uppercase tracking-wider text-[#8A796B]">
            Aggregating atelier analytics & sales metrics...
          </span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-sm text-center">
          <AlertTriangle className="w-6 h-6 mx-auto text-red-600 mb-2" />
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => fetchDashboard()}
            className="mt-3 px-4 py-1.5 bg-red-700 text-white text-xs rounded-sm hover:bg-red-800 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : data ? (
        <>
          {/* ================= ROW 1: 5 EXECUTIVE METRIC CARDS ================= */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* 1. Net Revenue */}
            <div className="p-4 bg-white border border-[#EBD9C8] rounded-sm shadow-2xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[#855D25] mb-2">
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold">
                    Net Paid Revenue
                  </span>
                  <div className="p-1.5 bg-[#FAF6F0] rounded-xs text-[#6D1A2A]">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-bold text-[#6D1A2A]">
                  ₹ {data.metrics.revenue.totalInRupees.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[#FAF6F0] text-[11px] text-[#8A796B]">
                <span>{data.metrics.revenue.paidOrdersCount} paid orders</span>
                {data.metrics.revenue.avgOrderValueInRupees > 0 && (
                  <span className="block text-[10px] text-[#855D25]">
                    Avg: ₹{data.metrics.revenue.avgOrderValueInRupees.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            {/* 2. Total Orders */}
            <div className="p-4 bg-white border border-[#EBD9C8] rounded-sm shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[#855D25] mb-2">
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold">
                    Total Orders
                  </span>
                  <div className="p-1.5 bg-[#FAF6F0] rounded-xs text-[#855D25]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-bold text-[#171717]">
                  {data.metrics.orders.total}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[#FAF6F0] flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-medium">
                  {data.metrics.orders.paid} Paid
                </span>
                <span className="text-amber-700 font-medium">
                  {data.metrics.orders.pending} Pending
                </span>
              </div>
            </div>

            {/* 3. Catalog Inventory */}
            <div className="p-4 bg-white border border-[#EBD9C8] rounded-sm shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[#855D25] mb-2">
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold">
                    Poshak Catalog
                  </span>
                  <div className="p-1.5 bg-[#FAF6F0] rounded-xs text-[#855D25]">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-bold text-[#171717]">
                  {data.metrics.catalog.total} Poshaks
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[#FAF6F0] text-[11px] text-[#8A796B]">
                <span className="text-emerald-700 font-medium">
                  {data.metrics.catalog.inStock} In Stock
                </span>
                {data.metrics.catalog.outOfStock > 0 && (
                  <span className="text-rose-600 font-medium ml-1.5">
                    · {data.metrics.catalog.outOfStock} Out
                  </span>
                )}
              </div>
            </div>

            {/* 4. Active Offers & Redemptions */}
            <div className="p-4 bg-white border border-[#EBD9C8] rounded-sm shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[#855D25] mb-2">
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold">
                    Offers & Promos
                  </span>
                  <div className="p-1.5 bg-[#FAF6F0] rounded-xs text-[#855D25]">
                    <Tag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-bold text-[#171717]">
                  {data.metrics.discounts.activeCoupons} Active
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[#FAF6F0] text-[11px] text-[#8A796B]">
                <span>{data.metrics.discounts.totalRedemptions} redemptions</span>
                <span className="block text-[10px] text-[#6D1A2A]">
                  Saved ₹{data.metrics.discounts.totalDiscountGivenInRupees.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* 5. Exchanges / Inquiries */}
            <div className="p-4 bg-white border border-[#EBD9C8] rounded-sm shadow-2xs flex flex-col justify-between col-span-2 md:col-span-1">
              <div>
                <div className="flex items-center justify-between text-[#855D25] mb-2">
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold">
                    Exchanges & Alterations
                  </span>
                  <div className="p-1.5 bg-[#FAF6F0] rounded-xs text-[#855D25]">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-bold text-[#171717]">
                  {data.metrics.exchanges.pendingRequests} Pending
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[#FAF6F0] text-[11px] text-[#8A796B] flex items-center justify-between">
                <span>{data.metrics.exchanges.totalRequests} total requests</span>
                <Link
                  href="/admin/exchanges"
                  className="text-[#6D1A2A] hover:underline font-medium text-[10px]"
                >
                  Review →
                </Link>
              </div>
            </div>
          </div>

          {/* ================= ROW 2: SALES VELOCITY & FULFILMENT PIPELINE ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sales Velocity 7-Day Visual Bars (2 Columns) */}
            <div className="lg:col-span-2 bg-white border border-[#EBD9C8] rounded-sm p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#171717] flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#855D25]" />
                      <span>7-Day Sales & Order Velocity</span>
                    </h3>
                    <p className="text-[11px] text-[#8A796B] mt-0.5">
                      Daily order revenue and checkout velocity over the last 7 days
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A796B] block">
                      7-Day Revenue
                    </span>
                    <span className="text-base font-serif font-bold text-[#6D1A2A]">
                      ₹{" "}
                      {data.salesTrend
                        .reduce((sum, d) => sum + d.revenueInRupees, 0)
                        .toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Bar Graph Visual */}
                <div className="pt-6 pb-2">
                  <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-40 border-b border-[#EBD9C8]">
                    {data.salesTrend.map((day, idx) => {
                      const heightPercent =
                        maxRevenue > 0
                          ? Math.max(12, Math.round((day.revenueInRupees / maxRevenue) * 100))
                          : 12;

                      return (
                        <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                          {/* Hover Tooltip Value */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#6D1A2A] mb-1 bg-[#FAF6F0] px-1.5 py-0.5 rounded-xs border border-[#EBD9C8] whitespace-nowrap shadow-xs">
                            ₹{day.revenueInRupees.toLocaleString("en-IN")}
                          </div>

                          {/* Bar */}
                          <div
                            className="w-full max-w-[42px] bg-[#EBD9C8] group-hover:bg-[#6D1A2A] rounded-t-xs transition-all duration-300 relative flex items-center justify-center"
                            style={{ height: `${heightPercent}%` }}
                          >
                            {day.ordersCount > 0 && (
                              <span className="text-[9px] font-bold text-white group-hover:text-white px-0.5">
                                {day.ordersCount}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Date Labels below bars */}
                  <div className="grid grid-cols-7 gap-2 sm:gap-3 mt-2 text-center">
                    {data.salesTrend.map((day) => (
                      <div key={day.date} className="text-[10px] text-[#6B5E55] font-medium truncate">
                        {day.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#FAF6F0] flex items-center justify-between text-xs text-[#8A796B]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-2xs bg-[#6D1A2A]" />
                    <span>Paid Revenue</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-2xs bg-[#EBD9C8]" />
                    <span>Activity Volume</span>
                  </span>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-[#6D1A2A] hover:underline font-semibold text-[11px] flex items-center gap-1"
                >
                  <span>Detailed Orders</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Fulfilment & Production Pipeline (1 Column) */}
            <div className="bg-white border border-[#EBD9C8] rounded-sm p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-serif font-bold text-[#171717] flex items-center gap-1.5 mb-1">
                  <Truck className="w-4 h-4 text-[#855D25]" />
                  <span>Atelier Fulfilment Pipeline</span>
                </h3>
                <p className="text-[11px] text-[#8A796B] mb-4">
                  Live workflow stages for current orders
                </p>

                {/* Pipeline Stages */}
                <div className="space-y-3">
                  {/* Stage 1: Pending */}
                  <div className="p-2.5 bg-[#FAF6F0] border border-[#EBD9C8] rounded-sm">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#4A3E37] font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Payment / Verification</span>
                      </span>
                      <span className="font-bold text-[#171717]">
                        {data.metrics.orders.pending}
                      </span>
                    </div>
                    <div className="w-full bg-[#EBD9C8] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full"
                        style={{
                          width: `${
                            data.metrics.orders.total > 0
                              ? (data.metrics.orders.pending / data.metrics.orders.total) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stage 2: In Atelier */}
                  <div className="p-2.5 bg-[#FAF6F0] border border-[#EBD9C8] rounded-sm">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#4A3E37] font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#6D1A2A]" />
                        <span>In Atelier (Stitching / Finishing)</span>
                      </span>
                      <span className="font-bold text-[#6D1A2A]">
                        {data.metrics.orders.inAtelier}
                      </span>
                    </div>
                    <div className="w-full bg-[#EBD9C8] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#6D1A2A] h-full rounded-full"
                        style={{
                          width: `${
                            data.metrics.orders.total > 0
                              ? (data.metrics.orders.inAtelier / data.metrics.orders.total) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stage 3: Dispatched */}
                  <div className="p-2.5 bg-[#FAF6F0] border border-[#EBD9C8] rounded-sm">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#4A3E37] font-medium flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Dispatched / In Transit</span>
                      </span>
                      <span className="font-bold text-[#171717]">
                        {data.metrics.orders.dispatched}
                      </span>
                    </div>
                    <div className="w-full bg-[#EBD9C8] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{
                          width: `${
                            data.metrics.orders.total > 0
                              ? (data.metrics.orders.dispatched / data.metrics.orders.total) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stage 4: Delivered */}
                  <div className="p-2.5 bg-[#FAF6F0] border border-[#EBD9C8] rounded-sm">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#4A3E37] font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Delivered to Patron</span>
                      </span>
                      <span className="font-bold text-emerald-700">
                        {data.metrics.orders.delivered}
                      </span>
                    </div>
                    <div className="w-full bg-[#EBD9C8] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{
                          width: `${
                            data.metrics.orders.total > 0
                              ? (data.metrics.orders.delivered / data.metrics.orders.total) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown Chips */}
              <div className="mt-4 pt-3 border-t border-[#FAF6F0]">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#855D25] mb-2">
                  Catalog Category Breakdown
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-2 bg-[#FAF6F0] rounded-xs border border-[#EBD9C8]">
                    <span className="text-[10px] text-[#8A796B] block">Stitched</span>
                    <span className="text-xs font-bold text-[#171717]">
                      {data.metrics.catalog.categories.stitched}
                    </span>
                  </div>
                  <div className="p-2 bg-[#FAF6F0] rounded-xs border border-[#EBD9C8]">
                    <span className="text-[10px] text-[#8A796B] block">Unstitched</span>
                    <span className="text-xs font-bold text-[#171717]">
                      {data.metrics.catalog.categories.unstitched}
                    </span>
                  </div>
                  <div className="p-2 bg-[#FAF6F0] rounded-xs border border-[#EBD9C8]">
                    <span className="text-[10px] text-[#8A796B] block">Traditional</span>
                    <span className="text-xs font-bold text-[#171717]">
                      {data.metrics.catalog.categories.traditional}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= ROW 3: RECENT ORDERS LIVE TABLE & ATELIER ALERTS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Recent Orders Table (2 Columns) */}
            <div className="lg:col-span-2 bg-white border border-[#EBD9C8] rounded-sm p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F3EBE1]">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#171717] flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#855D25]" />
                    <span>Recent Customer Orders</span>
                  </h3>
                  <p className="text-[11px] text-[#8A796B] mt-0.5">
                    Latest poshak orders placed by patrons
                  </p>
                </div>

                <Link
                  href="/admin/orders"
                  className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#EBD9C8] border border-[#EBD9C8] text-[#6D1A2A] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1"
                >
                  <span>All Orders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {data.recentOrders.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#8A796B]">
                  <ShoppingBag className="w-8 h-8 mx-auto text-[#EBD9C8] mb-2" />
                  <span>No orders placed yet. Orders will appear here in real time.</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EBD9C8] text-[10px] uppercase tracking-wider text-[#8A796B]">
                        <th className="pb-2.5 font-semibold">Order</th>
                        <th className="pb-2.5 font-semibold">Customer</th>
                        <th className="pb-2.5 font-semibold">Total</th>
                        <th className="pb-2.5 font-semibold">Payment</th>
                        <th className="pb-2.5 font-semibold">Status</th>
                        <th className="pb-2.5 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3EBE1]">
                      {data.recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                          <td className="py-3">
                            <span className="font-mono font-bold text-[#6D1A2A]">
                              #{ord.orderNumber}
                            </span>
                            <span className="block text-[10px] text-[#8A796B]">
                              {ord.totalItems} {ord.totalItems === 1 ? "poshak" : "poshaks"}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="font-medium text-[#171717] block truncate max-w-[140px]">
                              {ord.customerName}
                            </span>
                            <span className="text-[10px] text-[#8A796B] block truncate max-w-[140px]">
                              {ord.customerEmail}
                            </span>
                          </td>
                          <td className="py-3 font-semibold text-[#171717]">
                            ₹ {ord.totalInRupees.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3">
                            {ord.paymentStatus === "PAID" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-xs border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Paid
                              </span>
                            ) : ord.paymentStatus === "PENDING" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-semibold rounded-xs border border-amber-200">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-800 text-[10px] font-semibold rounded-xs">
                                {ord.paymentStatus}
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className="inline-flex items-center px-2 py-0.5 bg-[#FAF6F0] border border-[#EBD9C8] text-[#4A3E37] text-[10px] uppercase font-semibold rounded-xs">
                              {ord.fulfilmentStatus.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              href="/admin/orders"
                              className="px-2.5 py-1 text-[11px] text-[#6D1A2A] hover:bg-[#6D1A2A] hover:text-white rounded-xs transition-colors font-medium border border-[#EBD9C8]"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Atelier Attention & Quick Shortcuts (1 Column) */}
            <div className="space-y-4">
              {/* Attention Alerts */}
              <div className="bg-white border border-[#EBD9C8] rounded-sm p-5 shadow-2xs">
                <h3 className="text-sm font-serif font-bold text-[#171717] flex items-center gap-1.5 mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#855D25]" />
                  <span>Atelier Operations Health</span>
                </h3>

                <div className="space-y-2.5">
                  {/* Stock health status */}
                  {data.lowStockProducts.length > 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-sm text-xs">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-700" />
                        <span>Low Stock Poshaks ({data.lowStockProducts.length})</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-amber-800 mt-1">
                        {data.lowStockProducts.map((p) => (
                          <li key={p.id} className="flex justify-between">
                            <span className="truncate max-w-[160px]">{p.name}</span>
                            <span className="font-bold">{p.stock} left</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/admin/products"
                        className="text-amber-800 font-bold underline block mt-2 text-[10px]"
                      >
                        Replenish in Products →
                      </Link>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>All 53 Poshaks healthy in stock. No urgent shortages.</span>
                    </div>
                  )}

                  {/* Exchanges notification */}
                  {data.metrics.exchanges.pendingRequests > 0 ? (
                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-sm text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                        <span>
                          <strong>{data.metrics.exchanges.pendingRequests}</strong> exchange requests pending
                        </span>
                      </div>
                      <Link
                        href="/admin/exchanges"
                        className="text-blue-700 font-bold underline text-[10px]"
                      >
                        Action
                      </Link>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FAF6F0] border border-[#EBD9C8] text-[#4A3E37] rounded-sm text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#855D25] shrink-0" />
                      <span>All exchange & alteration requests up to date.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Navigation Commands */}
              <div className="bg-white border border-[#EBD9C8] rounded-sm p-5 shadow-2xs">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#855D25] mb-2.5">
                  Admin Command Hub
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/admin/products"
                    className="p-3 bg-[#FAF6F0] border border-[#EBD9C8] hover:border-[#855D25] rounded-sm transition-all group flex flex-col justify-between"
                  >
                    <Package className="w-4 h-4 text-[#855D25] mb-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-semibold text-[#171717] block">
                        Products
                      </span>
                      <span className="text-[10px] text-[#8A796B]">
                        53 Catalog Items
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/admin/orders"
                    className="p-3 bg-[#FAF6F0] border border-[#EBD9C8] hover:border-[#855D25] rounded-sm transition-all group flex flex-col justify-between"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#855D25] mb-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-semibold text-[#171717] block">
                        Orders
                      </span>
                      <span className="text-[10px] text-[#8A796B]">
                        Order Pipeline
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/admin/discounts"
                    className="p-3 bg-[#FAF6F0] border border-[#EBD9C8] hover:border-[#855D25] rounded-sm transition-all group flex flex-col justify-between"
                  >
                    <Tag className="w-4 h-4 text-[#855D25] mb-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-semibold text-[#171717] block">
                        Discounts
                      </span>
                      <span className="text-[10px] text-[#8A796B]">
                        Promos & Vouchers
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/admin/exchanges"
                    className="p-3 bg-[#FAF6F0] border border-[#EBD9C8] hover:border-[#855D25] rounded-sm transition-all group flex flex-col justify-between"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-[#855D25] mb-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-semibold text-[#171717] block">
                        Exchanges
                      </span>
                      <span className="text-[10px] text-[#8A796B]">
                        Patron Requests
                      </span>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="p-3 bg-[#FAF6F0] border border-[#855D25]/40 hover:border-[#855D25] rounded-sm transition-all group flex flex-col justify-between text-left cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#6D1A2A] mb-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-semibold text-[#6D1A2A] block">
                        Monthly Report
                      </span>
                      <span className="text-[10px] text-[#855D25]">
                        PDF & CSV Export
                      </span>
                    </div>
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-[#F3EBE1]">
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-[#FAF6F0] hover:bg-[#EBD9C8] text-[#855D25] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Public Storefront</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Monthly Audit Report Download Modal */}
      <AdminMonthlyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
