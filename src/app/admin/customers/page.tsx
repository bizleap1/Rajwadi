"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Loader2,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  CreditCard,
  X,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  image?: string | null;
  totalOrders: number;
  paidOrdersCount: number;
  totalSpentInPaise: number;
  totalSpentFormatted: string;
  addressesCount: number;
  defaultCity: string;
  defaultState: string;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalInPaise: number;
    paymentStatus: string;
    fulfilmentStatus: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface FullCustomerDetail {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  totalSpentInPaise: number;
  totalSpentFormatted: string;
  addresses: Array<{
    id: string;
    fullName: string;
    phone: string;
    streetAddress: string;
    apartmentSuite?: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    totalInPaise: number;
    discountInPaise?: number;
    couponCode?: string | null;
    paymentStatus: string;
    fulfilmentStatus: string;
    createdAt: string;
    items: Array<{
      id: string;
      productTitle: string;
      quantity: number;
      priceInPaise: number;
      size?: string | null;
      color?: string | null;
    }>;
  }>;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetail, setCustomerDetail] = useState<FullCustomerDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Delete modal states
  const [customerToDelete, setCustomerToDelete] = useState<CustomerSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`/api/admin/customers?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to load customer profiles.");
      }

      const data = await res.json();
      setCustomers(data.customers || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load customer profiles.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  // View Customer Detail
  const handleOpenDetail = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsLoadingDetail(true);
    setCustomerDetail(null);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch customer profile details.");
      const data = await res.json();
      setCustomerDetail(data.customer);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error fetching customer details");
      setSelectedCustomerId(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Perform Customer Deletion
  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete customer profile.");
      }

      setDeleteSuccessMsg(data.message || "Customer deleted successfully.");
      setTimeout(() => {
        setDeleteSuccessMsg("");
      }, 4000);

      setCustomerToDelete(null);
      if (selectedCustomerId === customerToDelete.id) {
        setSelectedCustomerId(null);
        setCustomerDetail(null);
      }
      fetchCustomers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error deleting customer profile");
    } finally {
      setIsDeleting(false);
    }
  };

  // Compute aggregate stats across loaded list
  const totalLifetimeSpend = customers.reduce((sum, c) => sum + c.totalSpentInPaise, 0);
  const totalOrdersCount = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="space-y-6">
      {/* ── HEADER & BREADCRUMBS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EBD9C8] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#855D25] font-semibold mb-1">
            <span>Admin Portal</span>
            <span>/</span>
            <span>Patron Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#171717] tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#6D1A2A]" />
            <span>Customers &amp; Patrons</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8A796B] mt-1">
            View registered patron profiles, order histories, saved addresses, and manage accounts.
          </p>
        </div>

        <button
          onClick={() => fetchCustomers()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 bg-white border border-[#EBD9C8] text-xs font-semibold uppercase tracking-wider text-[#4A3E37] hover:bg-[#F3EBE1] rounded-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#6D1A2A]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ── SUCCESS NOTIFICATION BANNER ── */}
      {deleteSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md text-xs sm:text-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold">Success:</span>
            <span>{deleteSuccessMsg}</span>
          </div>
          <button
            onClick={() => setDeleteSuccessMsg("")}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STATS OVERVIEW CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#EBD9C8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8A796B] font-medium">
              Total Registered Patrons
            </span>
            <div className="w-8 h-8 rounded-full bg-[#6D1A2A]/10 flex items-center justify-center text-[#6D1A2A]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-[#171717] mt-2">
            {totalCount.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-[#8A796B] mt-1">Active customer accounts in database</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#EBD9C8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8A796B] font-medium">
              Orders Placed by Patrons
            </span>
            <div className="w-8 h-8 rounded-full bg-[#855D25]/10 flex items-center justify-center text-[#855D25]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-[#171717] mt-2">
            {totalOrdersCount.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-[#8A796B] mt-1">Total orders across current view</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#EBD9C8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8A796B] font-medium">
              Patron Lifetime Spend
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-[#171717] mt-2">
            ₹ {(totalLifetimeSpend / 100).toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-[#8A796B] mt-1">Total paid order value from customers</p>
        </div>
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#EBD9C8] shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8A796B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by customer name, email address, or mobile number..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#FAF6F0] border border-[#EBD9C8] rounded-md focus:bg-white focus:outline-hidden focus:border-[#6D1A2A] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A796B] hover:text-[#171717] text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── CUSTOMERS LIST ── */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-[#EBD9C8] p-12 text-center shadow-xs">
          <Loader2 className="w-8 h-8 text-[#6D1A2A] animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-[#4A3E37]">Loading customer profiles...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-600" />
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={() => fetchCustomers()}
            className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs uppercase font-medium rounded-sm hover:bg-red-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#EBD9C8] p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-[#D9C4B0] mx-auto mb-3" />
          <h3 className="text-lg font-serif text-[#171717]">No Customer Profiles Found</h3>
          <p className="text-xs sm:text-sm text-[#8A796B] mt-1 max-w-md mx-auto">
            {search
              ? `No customer matches the query "${search}". Try searching with a different name, email, or mobile number.`
              : "Registered customers who create an account or place an order will appear here."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-4 px-4 py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#521320] cursor-pointer"
            >
              Reset Search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ── DESKTOP VIEW TABLE (hidden on mobile) ── */}
          <div className="hidden md:block bg-white rounded-lg border border-[#EBD9C8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EBD9C8] bg-[#FAF6F0] text-[11px] uppercase tracking-wider text-[#855D25] font-semibold">
                    <th className="py-3.5 px-4">Patron Details</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4 text-center">Orders Placed</th>
                    <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                    <th className="py-3.5 px-4 text-center">Registered</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E5D8] text-xs">
                  {customers.map((c) => {
                    const initials = c.name
                      ? c.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : "P";

                    return (
                      <tr key={c.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                        {/* Patron Name & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#6D1A2A]/10 border border-[#6D1A2A]/20 flex items-center justify-center text-[#6D1A2A] font-bold text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-[#171717]">{c.name}</p>
                              <p className="text-[11px] text-[#8A796B] font-mono">{c.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-[#4A3E37]">
                            <Phone className="w-3.5 h-3.5 text-[#855D25]" />
                            <span className="font-mono">{c.phone}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-[#4A3E37]">
                            <MapPin className="w-3.5 h-3.5 text-[#8A796B]" />
                            <span>
                              {c.defaultCity !== "N/A"
                                ? `${c.defaultCity}, ${c.defaultState}`
                                : "No address saved"}
                            </span>
                          </div>
                          {c.addressesCount > 0 && (
                            <span className="text-[10px] text-[#855D25] font-medium block mt-0.5">
                              {c.addressesCount} saved {c.addressesCount === 1 ? "address" : "addresses"}
                            </span>
                          )}
                        </td>

                        {/* Orders Placed */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F3EBE1] text-[#4A3E37]">
                            <ShoppingBag className="w-3 h-3 text-[#855D25]" />
                            {c.totalOrders}
                          </span>
                        </td>

                        {/* Lifetime Spend */}
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-serif font-bold text-sm text-[#6D1A2A]">
                            {c.totalSpentFormatted}
                          </span>
                          <span className="text-[10px] text-[#8A796B] block">
                            {c.paidOrdersCount} paid {c.paidOrdersCount === 1 ? "order" : "orders"}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 text-center text-[#8A796B] font-mono text-[11px]">
                          {new Date(c.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenDetail(c.id)}
                              className="p-1.5 bg-[#FAF6F0] hover:bg-[#6D1A2A] hover:text-white text-[#4A3E37] rounded-sm transition-colors cursor-pointer"
                              title="View Customer Profile &amp; Orders"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setCustomerToDelete(c)}
                              className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 rounded-sm transition-colors cursor-pointer"
                              title="Permanently Delete Customer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── MOBILE CARD VIEW (hidden on desktop) ── */}
          <div className="md:hidden space-y-3">
            {customers.map((c) => {
              const initials = c.name
                ? c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "P";

              return (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-lg border border-[#EBD9C8] shadow-xs space-y-3"
                >
                  {/* Top Bar: Avatar, Name, Email, Delete */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#6D1A2A]/10 border border-[#6D1A2A]/20 flex items-center justify-center text-[#6D1A2A] font-bold text-xs shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[#171717]">{c.name}</h4>
                        <p className="text-[11px] text-[#8A796B] font-mono truncate max-w-[180px]">
                          {c.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCustomerToDelete(c)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Customer Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF6F0] p-2.5 rounded-md">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A796B] block">
                        Phone
                      </span>
                      <span className="font-mono text-[#171717] font-medium">{c.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A796B] block">
                        Location
                      </span>
                      <span className="text-[#171717] font-medium truncate block">
                        {c.defaultCity !== "N/A" ? `${c.defaultCity}, ${c.defaultState}` : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A796B] block">
                        Total Orders
                      </span>
                      <span className="text-[#171717] font-bold">{c.totalOrders} Orders</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A796B] block">
                        Lifetime Spend
                      </span>
                      <span className="font-serif text-[#6D1A2A] font-bold">
                        {c.totalSpentFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <button
                    onClick={() => handleOpenDetail(c.id)}
                    className="w-full py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-[#521320] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile &amp; Orders</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── PAGINATION BAR ── */}
          {totalPages > 1 && (
            <div className="bg-white p-3.5 rounded-lg border border-[#EBD9C8] flex items-center justify-between shadow-xs">
              <span className="text-xs text-[#8A796B]">
                Page {page} of {totalPages} ({totalCount} total patrons)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 border border-[#EBD9C8] rounded-sm text-[#4A3E37] hover:bg-[#F3EBE1] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold px-2">{page}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 border border-[#EBD9C8] rounded-sm text-[#4A3E37] hover:bg-[#F3EBE1] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── MODAL 1: CUSTOMER PROFILE & ORDER HISTORY DRAWER ── */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl border border-[#EBD9C8] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#EBD9C8] bg-[#FAF6F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6D1A2A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {customerDetail?.name
                    ? customerDetail.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "P"}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#171717]">
                    {isLoadingDetail ? "Loading Profile..." : customerDetail?.name || "Patron Profile"}
                  </h3>
                  <p className="text-xs text-[#8A796B] font-mono">
                    {customerDetail?.email || "Account Details"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCustomerId(null);
                  setCustomerDetail(null);
                }}
                className="p-1.5 text-[#8A796B] hover:text-[#171717] hover:bg-[#EBD9C8]/40 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {isLoadingDetail ? (
                <div className="py-16 text-center">
                  <Loader2 className="w-8 h-8 text-[#6D1A2A] animate-spin mx-auto mb-2" />
                  <p className="text-xs text-[#8A796B]">Retrieving customer profile &amp; orders...</p>
                </div>
              ) : customerDetail ? (
                <>
                  {/* Account Overview Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF6F0] p-4 rounded-lg border border-[#EBD9C8]">
                    <div>
                      <span className="text-[10.5px] uppercase tracking-wider text-[#8A796B] block">
                        Mobile Phone
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#171717]">
                        {customerDetail.phone || "Not provided"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase tracking-wider text-[#8A796B] block">
                        Role
                      </span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#855D25]/10 text-[#855D25] text-[10.5px] font-bold rounded-sm">
                        {customerDetail.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase tracking-wider text-[#8A796B] block">
                        Total Orders
                      </span>
                      <span className="text-xs font-bold text-[#171717]">
                        {customerDetail.orders.length} Placed
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase tracking-wider text-[#8A796B] block">
                        Lifetime Spend
                      </span>
                      <span className="font-serif font-bold text-xs text-[#6D1A2A]">
                        {customerDetail.totalSpentFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Saved Delivery Addresses */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#855D25] mb-2.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Saved Address Book ({customerDetail.addresses.length})</span>
                    </h4>
                    {customerDetail.addresses.length === 0 ? (
                      <p className="text-xs text-[#8A796B] italic bg-[#FAF6F0] p-3 rounded-md">
                        No saved delivery addresses found for this profile.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {customerDetail.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`p-3 rounded-lg border text-xs relative ${
                              addr.isDefault
                                ? "bg-white border-[#855D25]/40 shadow-xs"
                                : "bg-[#FAF6F0] border-[#EBD9C8]"
                            }`}
                          >
                            {addr.isDefault && (
                              <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#855D25] text-white text-[9px] uppercase font-bold rounded-xs">
                                Default
                              </span>
                            )}
                            <p className="font-semibold text-[#171717]">{addr.fullName}</p>
                            <p className="text-[#4A3E37] text-[11px] mt-0.5">{addr.streetAddress}</p>
                            {addr.apartmentSuite && (
                              <p className="text-[#4A3E37] text-[11px]">{addr.apartmentSuite}</p>
                            )}
                            <p className="text-[#171717] font-medium text-[11px]">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-[#8A796B] text-[10px] font-mono mt-1">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order History */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#855D25] mb-2.5 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order History ({customerDetail.orders.length})</span>
                    </h4>
                    {customerDetail.orders.length === 0 ? (
                      <p className="text-xs text-[#8A796B] italic bg-[#FAF6F0] p-3 rounded-md">
                        No orders recorded yet.
                      </p>
                    ) : (
                      <div className="border border-[#EBD9C8] rounded-lg overflow-hidden divide-y divide-[#F0E5D8]">
                        {customerDetail.orders.map((order) => (
                          <div key={order.id} className="p-3 bg-white hover:bg-[#FAF6F0] text-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="font-mono font-bold text-[#6D1A2A] hover:underline flex items-center gap-1"
                                  >
                                    <span>#{order.orderNumber}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                  <span
                                    className={`px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase ${
                                      order.paymentStatus === "PAID"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {order.paymentStatus}
                                  </span>
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase bg-gray-100 text-gray-800">
                                    {order.fulfilmentStatus}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#8A796B] mt-0.5 font-mono">
                                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div className="text-left sm:text-right">
                                <span className="font-serif font-bold text-sm text-[#171717]">
                                  ₹ {(order.totalInPaise / 100).toLocaleString("en-IN")}
                                </span>
                                {order.discountInPaise && order.discountInPaise > 0 ? (
                                  <span className="text-[10px] text-emerald-700 font-medium block">
                                    Saved -₹ {(order.discountInPaise / 100).toLocaleString("en-IN")} {order.couponCode ? `(${order.couponCode})` : ""}
                                  </span>
                                ) : null}
                                <span className="text-[10.5px] text-[#8A796B] block">
                                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                </span>
                              </div>
                            </div>

                            {/* Line items snippet */}
                            <div className="mt-2 text-[11px] text-[#4A3E37] bg-[#FAF6F0] p-2 rounded-xs">
                              {order.items.map((it, idx) => (
                                <span key={it.id}>
                                  {it.productTitle} (x{it.quantity})
                                  {idx < order.items.length - 1 ? " • " : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#EBD9C8] bg-[#FAF6F0] flex items-center justify-between">
              <button
                onClick={() => {
                  if (customerDetail) {
                    setCustomerToDelete({
                      id: customerDetail.id,
                      name: customerDetail.name || "Patron",
                      email: customerDetail.email,
                      phone: customerDetail.phone || "N/A",
                      totalOrders: customerDetail.orders.length,
                      paidOrdersCount: 0,
                      totalSpentInPaise: customerDetail.totalSpentInPaise,
                      totalSpentFormatted: customerDetail.totalSpentFormatted,
                      addressesCount: customerDetail.addresses.length,
                      defaultCity: "",
                      defaultState: "",
                      recentOrders: [],
                      createdAt: customerDetail.createdAt,
                    });
                  }
                }}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Profile</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCustomerId(null);
                  setCustomerDetail(null);
                }}
                className="px-4 py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#521320] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: CONFIRM PERMANENT DELETE PROFILE ── */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl border border-red-200 shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#171717]">
                  Delete Customer Profile?
                </h3>
                <p className="text-xs text-red-600 font-medium">Irreversible Action</p>
              </div>
            </div>

            <div className="text-xs text-[#4A3E37] space-y-2 bg-[#FAF6F0] p-3.5 rounded-lg border border-[#EBD9C8]">
              <p>
                Are you sure you want to permanently delete the profile for:
              </p>
              <div className="font-semibold text-[#171717] bg-white p-2 rounded-xs border border-[#EBD9C8]">
                <p>{customerToDelete.name}</p>
                <p className="font-mono text-[#8A796B] text-[11px]">{customerToDelete.email}</p>
              </div>
              <ul className="list-disc pl-4 text-[11px] text-[#8A796B] space-y-1">
                <li>Saved addresses &amp; active login sessions will be permanently purged.</li>
                <li>
                  <strong className="text-[#171717]">Past orders &amp; invoices are safely preserved</strong> for tax and accounting records.
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-[#EBD9C8] text-[#4A3E37] hover:bg-[#F3EBE1] text-xs font-semibold rounded-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
