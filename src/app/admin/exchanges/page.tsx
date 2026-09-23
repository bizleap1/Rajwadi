"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  Clock,
  Truck,
  PackageCheck,
  CheckCircle2,
  XCircle,
  Scissors,
  Sparkles,
  ExternalLink,
  Phone,
  MessageCircle,
  Mail,
  RefreshCw,
  Save,
} from "lucide-react";

interface AdminExchangeRow {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  productImage: string | null;
  originalSize: string | null;
  desiredSize: string | null;
  desiredReplacement: string | null;
  reason: string;
  reasonDetails: string | null;
  status: string;
  adminNotes: string | null;
  reverseCourierPartner: string | null;
  reverseTrackingNumber: string | null;
  replacementTrackingNumber: string | null;
  createdAt: string;
}

const STATUS_FILTERS = [
  { key: "ALL", label: "All Exchanges" },
  { key: "REQUESTED", label: "1. Requested" },
  { key: "APPROVED", label: "2. Approved" },
  { key: "PICKUP_SCHEDULED", label: "3. Reverse Pickup" },
  { key: "RECEIVED_AT_ATELIER", label: "4. In Atelier" },
  { key: "REPLACEMENT_DISPATCHED", label: "5. Dispatched" },
  { key: "COMPLETED", label: "6. Completed" },
  { key: "REJECTED", label: "Rejected" },
];

export default function AdminExchangesPage() {
  const [exchanges, setExchanges] = useState<AdminExchangeRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchExchanges = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        status: statusFilter,
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`/api/admin/exchanges?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to load exchange requests.");
      }

      const data = await res.json();
      setExchanges(data.exchanges || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load exchange records.");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExchanges();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchExchanges]);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case "REQUESTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            Requested
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case "PICKUP_SCHEDULED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Truck className="w-3 h-3" />
            Pickup Scheduled
          </span>
        );
      case "RECEIVED_AT_ATELIER":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-[#FAF5EE] text-[#855D25] border border-[#855D25]/30">
            <Scissors className="w-3 h-3" />
            In Atelier
          </span>
        );
      case "REPLACEMENT_DISPATCHED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-purple-50 text-purple-800 border border-purple-200">
            <Sparkles className="w-3 h-3" />
            Dispatched
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-gray-100 text-gray-700">
            {st}
          </span>
        );
    }
  };

  const getReasonLabel = (r: string) => {
    switch (r) {
      case "SIZE_FITTING":
        return "Size / Fit Adjustment";
      case "ALTERATION":
        return "Custom Atelier Alteration";
      case "COLOR_PREFERENCE":
        return "Color / Shade Preference";
      case "DAMAGE_DEFECT":
        return "Transit Defect / Flaw";
      default:
        return r;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ── HEADER & METRICS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EBD9C8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] font-semibold">
              ATELIER SERVICE &amp; CUSTOMER EXCHANGES
            </span>
          </div>
          <h1 className="text-2xl font-serif text-[#171717] mt-0.5 flex items-center gap-2">
            <span>Size &amp; Product Exchanges</span>
            <span className="text-xs font-sans font-normal px-2.5 py-0.5 bg-[#FAF5EE] border border-[#EBD9C8] rounded text-[#855D25]">
              {totalCount} Total Requests
            </span>
          </h1>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#855D25] text-[#855D25] hover:bg-[#855D25] hover:text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors shadow-2xs"
        >
          <span>View All Orders</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-white p-4 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
            <input
              type="text"
              placeholder="Search by Order #, customer name, email or product..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25] rounded-sm placeholder:text-[#A09285]"
            />
          </div>

          <span className="text-xs text-[#8A796B] hidden md:block">
            Showing Page {page} of {totalPages || 1}
          </span>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#F0E5D8]">
          {STATUS_FILTERS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded transition-colors ${
                statusFilter === tab.key
                  ? "bg-[#6D1A2A] text-white shadow-2xs"
                  : "bg-[#FCFAF6] text-[#4A3E37] border border-[#EBD9C8] hover:bg-[#F3EBE1]"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
          <p className="text-xs uppercase tracking-wider">Loading exchange records...</p>
        </div>
      ) : exchanges.length === 0 ? (
        <div className="bg-white border border-[#EBD9C8] rounded-sm py-16 text-center px-4">
          <div className="w-12 h-12 mx-auto bg-[#F8F1E7] flex items-center justify-center rounded-full text-[#855D25] mb-3">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif text-[#171717]">No exchange requests found</h3>
          <p className="text-xs text-[#6B5E55] max-w-sm mx-auto mt-1">
            {search || statusFilter !== "ALL"
              ? "No exchange requests match the selected filters."
              : "When patrons request size or poshak exchanges, they will appear here for reverse pickup & replacement dispatch."}
          </p>
        </div>
      ) : (
        /* Exchanges List */
        <div className="space-y-4">
          {exchanges.map((ex) => (
            <ExchangeCard
              key={ex.id}
              exchange={ex}
              onUpdate={() => fetchExchanges()}
              getStatusBadge={getStatusBadge}
              getReasonLabel={getReasonLabel}
            />
          ))}
        </div>
      )}

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#D9C4B0] text-xs uppercase tracking-wider text-[#4A3E37] hover:bg-[#FAF6F0] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-[#6B5E55]">
            Page <strong className="text-[#171717]">{page}</strong> of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#D9C4B0] text-xs uppercase tracking-wider text-[#4A3E37] hover:bg-[#FAF6F0] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function ExchangeCard({
  exchange,
  onUpdate,
  getStatusBadge,
  getReasonLabel,
}: {
  exchange: AdminExchangeRow;
  onUpdate: () => void;
  getStatusBadge: (st: string) => React.ReactNode;
  getReasonLabel: (r: string) => string;
}) {
  const [status, setStatus] = useState(exchange.status);
  const [reverseCourierPartner, setReverseCourierPartner] = useState(
    exchange.reverseCourierPartner || "BlueDart Reverse"
  );
  const [reverseTrackingNumber, setReverseTrackingNumber] = useState(
    exchange.reverseTrackingNumber || ""
  );
  const [replacementTrackingNumber, setReplacementTrackingNumber] = useState(
    exchange.replacementTrackingNumber || ""
  );
  const [adminNotes, setAdminNotes] = useState(exchange.adminNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState("");

  const cleanPhone = exchange.customerPhone?.replace(/[^0-9]/g, "") || "";

  const handleSave = async () => {
    setIsSaving(true);
    setSavedFeedback("");
    try {
      const res = await fetch(`/api/admin/exchanges/${exchange.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          reverseCourierPartner: reverseCourierPartner.trim() || null,
          reverseTrackingNumber: reverseTrackingNumber.trim() || null,
          replacementTrackingNumber: replacementTrackingNumber.trim() || null,
          adminNotes: adminNotes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update exchange request.");
      }

      setSavedFeedback("Exchange updated successfully!");
      setTimeout(() => setSavedFeedback(""), 3000);
      onUpdate();
    } catch (err: any) {
      alert(err.message || "Error updating exchange");
    } finally {
      setIsSaving(false);
    }
  };

  const dateStr = new Date(exchange.createdAt).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white border border-[#EBD9C8] rounded-sm shadow-2xs p-5 space-y-4">
      {/* Card Header: Order #, Customer Info, Current Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E5D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#855D25] font-bold">
              ORDER
            </span>
            <Link
              href={`/admin/orders/${exchange.orderId}`}
              className="font-mono font-bold text-[#6D1A2A] hover:underline text-sm"
            >
              #{exchange.orderNumber}
            </Link>
            <span className="text-[11px] text-[#8A796B]">Requested {dateStr}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#4A3E37]">
            <span className="font-semibold text-[#171717]">{exchange.customerName}</span>
            <span className="text-[#8A796B]">|</span>
            <span className="text-[#6B5E55]">{exchange.customerEmail}</span>
            {exchange.customerPhone && (
              <>
                <span className="text-[#8A796B]">|</span>
                <span className="font-mono">{exchange.customerPhone}</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Contact & Current Badge */}
        <div className="flex items-center gap-2">
          {cleanPhone && (
            <a
              href={`https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${exchange.customerName}, regarding your Rajwadi Exchange for Order #${exchange.orderNumber}...`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded transition-colors"
              title="WhatsApp Customer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          )}
          {getStatusBadge(exchange.status)}
        </div>
      </div>

      {/* Target Item Details & Requested Fitting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FCFAF6] p-4 rounded border border-[#EBD9C8]">
        <div className="flex gap-3">
          <div className="w-14 h-18 bg-[#F3EBE1] relative rounded overflow-hidden flex-shrink-0 border border-[#EBD9C8]">
            <Image
              src={exchange.productImage || "/placeholder.webp"}
              alt={exchange.productName}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="text-xs min-w-0">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#855D25]">
              Target Piece
            </div>
            <h4 className="font-serif font-bold text-[#171717] text-xs">
              {exchange.productName}
            </h4>
            {exchange.desiredReplacement && (
              <div className="text-xs text-[#6D1A2A] font-semibold mt-1">
                Preference: {exchange.desiredReplacement}
              </div>
            )}
          </div>
        </div>

        {/* Reason Details */}
        <div className="text-xs space-y-1 md:border-l md:border-[#EBD9C8] md:pl-4">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#855D25]">
            Exchange Reason
          </div>
          <div className="font-semibold text-[#171717]">
            {getReasonLabel(exchange.reason)}
          </div>
          {exchange.reasonDetails ? (
            <p className="text-[11px] text-[#6B5E55] italic bg-white p-2 border border-[#EBD9C8] rounded">
              &ldquo;{exchange.reasonDetails}&rdquo;
            </p>
          ) : (
            <p className="text-[11px] text-[#8A796B]">No custom notes provided by patron.</p>
          )}
        </div>

        {/* Action Link to Order */}
        <div className="flex flex-col justify-between items-start md:items-end text-xs md:border-l md:border-[#EBD9C8] md:pl-4">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#855D25]">
            Actions
          </div>
          <Link
            href={`/admin/orders/${exchange.orderId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#6D1A2A] border border-[#EBD9C8] rounded text-xs font-medium transition-colors mt-2"
          >
            <span>Open Order Receipt</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Admin Inline Action & Logistics Form */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
        <div>
          <label className="block text-[#4A3E37] font-medium mb-1">
            Exchange Workflow Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] font-medium focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          >
            <option value="REQUESTED">1. REQUESTED (Under Review)</option>
            <option value="APPROVED">2. APPROVED (Exchange Accepted)</option>
            <option value="PICKUP_SCHEDULED">3. PICKUP_SCHEDULED (Reverse AWB)</option>
            <option value="RECEIVED_AT_ATELIER">4. RECEIVED_AT_ATELIER (Crafting)</option>
            <option value="REPLACEMENT_DISPATCHED">5. REPLACEMENT_DISPATCHED (In Transit)</option>
            <option value="COMPLETED">6. COMPLETED (Delivered)</option>
            <option value="REJECTED">7. REJECTED</option>
          </select>
        </div>

        <div>
          <label className="block text-[#4A3E37] font-medium mb-1">
            Reverse Pickup Courier
          </label>
          <input
            type="text"
            value={reverseCourierPartner}
            onChange={(e) => setReverseCourierPartner(e.target.value)}
            placeholder="e.g. BlueDart / Delhivery"
            className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          />
        </div>

        <div>
          <label className="block text-[#4A3E37] font-medium mb-1">
            Reverse Pickup AWB #
          </label>
          <input
            type="text"
            value={reverseTrackingNumber}
            onChange={(e) => setReverseTrackingNumber(e.target.value)}
            placeholder="e.g. BD-REV-987654"
            className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] font-mono focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          />
        </div>

        <div>
          <label className="block text-[#4A3E37] font-medium mb-1">
            Replacement Dispatch AWB #
          </label>
          <input
            type="text"
            value={replacementTrackingNumber}
            onChange={(e) => setReplacementTrackingNumber(e.target.value)}
            placeholder="e.g. BD-REP-123456"
            className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] font-mono focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[#4A3E37] font-medium mb-1">
            Atelier Note to Patron (Visible on Live Tracking Page)
          </label>
          <input
            type="text"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="e.g. Reverse pickup scheduled for tomorrow. Replacement is being prepared in size 38."
            className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-medium rounded transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Details</span>
          </button>
        </div>
      </div>

      {savedFeedback && (
        <div className="text-xs text-emerald-700 font-medium pt-1">
          {savedFeedback}
        </div>
      )}
    </div>
  );
}
