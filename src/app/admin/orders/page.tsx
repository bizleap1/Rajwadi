"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  Trash2,
} from "lucide-react";

interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalInPaise: number;
  totalFormatted: string;
  itemCount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  fulfilmentStatus: "PENDING" | "IN_ATELIER" | "READY_TO_DISPATCH" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
  courierPartner?: string | null;
  trackingNumber?: string | null;
  estimatedDeliveryDate?: string | null;
  exchangeCount?: number;
  hasActiveExchange?: boolean;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [fulfilmentStatus, setFulfilmentStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        paymentStatus,
        fulfilmentStatus,
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to load orders.");
      }

      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, [page, paymentStatus, fulfilmentStatus, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (
      !confirm(
        `Are you sure you want to PERMANENTLY DELETE Order #${orderNumber}?\n\nThis will remove all items and payment proofs to free up database storage.`
      )
    ) {
      return;
    }

    setDeletingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete order");
      }

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      alert(err.message || "Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "FAILED":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getFulfilmentBadge = (status: string) => {
    switch (status) {
      case "IN_ATELIER":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-purple-50 text-purple-800 border border-purple-200">
            In Atelier
          </span>
        );
      case "READY_TO_DISPATCH":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
            Quality Check
          </span>
        );
      case "DISPATCHED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-blue-50 text-blue-800 border border-blue-200">
            <Truck className="w-3 h-3" />
            Dispatched
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <PackageCheck className="w-3 h-3" />
            Delivered
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-red-50 text-red-700 border border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded bg-amber-50 text-amber-800 border border-amber-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EBD9C8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-5 bg-[#855D25]" />
            <span className="text-[10.5px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
              FULFILMENT & ATELIER ORDERS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#171717] mt-1">
            Orders ({totalCount})
          </h1>
          <p className="text-xs text-[#6B5E55] mt-0.5">
            Track customer orders, payments, bespoke stitching status, and deliveries
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#EBD9C8] rounded-sm shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
          <input
            type="text"
            placeholder="Search by order #, name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25] rounded-sm placeholder:text-[#A09285]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs text-[#6B5E55]">Payment:</span>
          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              setPage(1);
            }}
            className="bg-[#FCFAF6] border border-[#D9C4B0] text-xs py-2 px-2.5 rounded-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <span className="text-[#D9C4B0]">|</span>

          <span className="text-xs text-[#6B5E55]">Fulfilment:</span>
          <select
            value={fulfilmentStatus}
            onChange={(e) => {
              setFulfilmentStatus(e.target.value);
              setPage(1);
            }}
            className="bg-[#FCFAF6] border border-[#D9C4B0] text-xs py-2 px-2.5 rounded-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          >
            <option value="ALL">All Fulfilment</option>
            <option value="PENDING">Pending</option>
            <option value="IN_ATELIER">In Atelier</option>
            <option value="READY_TO_DISPATCH">Quality Check</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="bg-white border border-[#EBD9C8] rounded-sm py-20 flex flex-col items-center justify-center text-[#8A796B]">
          <Loader2 className="w-8 h-8 animate-spin text-[#6D1A2A] mb-3" />
          <p className="text-xs uppercase tracking-wider">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        /* Empty state */
        <div className="bg-white border border-[#EBD9C8] rounded-sm py-16 text-center px-4">
          <div className="w-12 h-12 mx-auto bg-[#F8F1E7] flex items-center justify-center rounded-full text-[#855D25] mb-3">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif text-[#171717]">No orders found</h3>
          <p className="text-xs text-[#6B5E55] max-w-sm mx-auto mt-1">
            {search || paymentStatus !== "ALL" || fulfilmentStatus !== "ALL"
              ? "No orders match the selected filters."
              : "When customers place orders, they will appear here with full payment and address snapshots."}
          </p>
        </div>
      ) : (
        /* Orders Table */
        <div className="bg-white border border-[#EBD9C8] rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F1E7] border-b border-[#EBD9C8] text-[#4A3E37] uppercase tracking-wider text-[11px] font-medium">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Fulfilment &amp; Tracking</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E5D8]">
                {orders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#FCFAF6] transition-colors"
                    >
                      {/* Order Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#6D1A2A]">
                        <div className="flex flex-col items-start gap-1">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                          {order.hasActiveExchange && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-sans font-bold uppercase tracking-wider bg-[#855D25]/15 text-[#855D25] border border-[#855D25]/30">
                              ⇄ Exchange Active
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-[#6B5E55] whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#171717]">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-[#8A796B] truncate max-w-[180px]">
                          {order.customerEmail}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-3 font-medium text-[#4A3E37]">
                        {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-3 font-semibold text-[#171717]">
                        {order.totalFormatted}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-3">
                        {getPaymentBadge(order.paymentStatus)}
                      </td>

                      {/* Fulfilment Status */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          {getFulfilmentBadge(order.fulfilmentStatus)}
                          {order.courierPartner && (
                            <div className="text-[10.5px] text-[#6B5E55] truncate max-w-[150px]">
                              {order.courierPartner} {order.trackingNumber ? `(${order.trackingNumber})` : ""}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF6F0] hover:bg-[#F3EBE1] text-[#6D1A2A] font-medium text-xs rounded border border-[#EBD9C8] transition-colors"
                            title="View & Track Order"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                            disabled={deletingId === order.id}
                            className="p-1.5 bg-white hover:bg-red-50 text-red-600 hover:text-red-800 border border-red-200 rounded transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                            title="Delete Order (Free Database Storage)"
                          >
                            {deletingId === order.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3.5 bg-[#FAF6F0] border-t border-[#EBD9C8] flex items-center justify-between text-xs text-[#6B5E55]">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 bg-white border border-[#D9C4B0] text-[#171717] hover:bg-[#F3EBE1] disabled:opacity-40 rounded-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 bg-white border border-[#D9C4B0] text-[#171717] hover:bg-[#F3EBE1] disabled:opacity-40 rounded-sm"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
