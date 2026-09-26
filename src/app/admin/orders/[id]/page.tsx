"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  MapPin,
  User,
  CreditCard,
  ShieldCheck,
  Scissors,
  Calendar,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
  Save,
  Sparkles,
  Download,
  Printer,
  FileText,
  Eye,
  X,
  Maximize2,
  Trash2,
} from "lucide-react";
import { downloadReceipt } from "@/lib/receiptGenerator";

const ATELIER_STAGES = [
  {
    key: "PENDING",
    label: "Order Confirmed",
    desc: "Payment verified, order received by Atelier",
    icon: CheckCircle2,
  },
  {
    key: "IN_ATELIER",
    label: "In Atelier (Crafting)",
    desc: "Fabric cutting, Karigari embroidery & bespoke stitching",
    icon: Scissors,
  },
  {
    key: "READY_TO_DISPATCH",
    label: "Quality Check & Pack",
    desc: "Finishing, quality inspection & royal gift box packaging",
    icon: Sparkles,
  },
  {
    key: "DISPATCHED",
    label: "Dispatched",
    desc: "Handed over to insured courier partner with tracking",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    desc: "Successfully delivered to patron's destination",
    icon: PackageCheck,
  },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states for fulfillment and tracking
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [courierPartner, setCourierPartner] = useState("BlueDart");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to fetch order details.");
      }

      const data = await res.json();
      const o = data.order;
      setOrder(o);
      setSelectedStatus(o.fulfilmentStatus || "PENDING");
      setCourierPartner(o.courierPartner || "BlueDart");
      setTrackingNumber(o.trackingNumber || "");
      setTrackingUrl(o.trackingUrl || "");
      setAdminNotes(o.notes || "");
      if (o.estimatedDeliveryDate) {
        const d = new Date(o.estimatedDeliveryDate);
        setEstimatedDeliveryDate(d.toISOString().split("T")[0]);
      } else {
        // Default to 7 days from creation if not set
        const defaultDate = new Date(o.createdAt);
        defaultDate.setDate(defaultDate.getDate() + 7);
        setEstimatedDeliveryDate(defaultDate.toISOString().split("T")[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load order.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const handleApprovePayment = async () => {
    if (!confirm(`Confirm approval of ₹ ${(order.totalInPaise / 100).toLocaleString("en-IN")} payment for Order #${order.orderNumber}?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: "PAID",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve payment");
      setOrder(data.order);
      setSaveSuccessMsg("Payment verified and approved as PAID!");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to approve payment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!confirm(`Are you sure you want to REJECT this payment and cancel Order #${order.orderNumber}?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: "FAILED",
          fulfilmentStatus: "CANCELLED",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject payment");
      setOrder(data.order);
      setSelectedStatus("CANCELLED");
      setSaveSuccessMsg("Payment rejected and order cancelled.");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to reject payment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (
      !confirm(
        `Are you sure you want to PERMANENTLY DELETE Order #${order.orderNumber}?\n\nThis will completely erase all items, payment screenshot proofs, and transactions from the database to optimize storage space.\n\nThis action CANNOT be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete order");
      }

      alert(`Order #${order.orderNumber} has been permanently deleted from the database.`);
      router.push("/admin/orders");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete order");
      setIsDeleting(false);
    }
  };

  const handleSaveProgressAndTracking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMsg("");
    try {
      // If courier tracking url is empty but partner and tracking number exist, auto-generate standard tracking URL
      let finalTrackingUrl = trackingUrl.trim();
      if (!finalTrackingUrl && trackingNumber.trim()) {
        const partner = courierPartner.toLowerCase();
        if (partner.includes("bluedart")) {
          finalTrackingUrl = `https://www.bluedart.com/tracking?track=${encodeURIComponent(trackingNumber.trim())}`;
        } else if (partner.includes("delhivery")) {
          finalTrackingUrl = `https://www.delhivery.com/track/package/${encodeURIComponent(trackingNumber.trim())}`;
        } else if (partner.includes("dtdc")) {
          finalTrackingUrl = `https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${encodeURIComponent(trackingNumber.trim())}`;
        } else if (partner.includes("speed post") || partner.includes("india post")) {
          finalTrackingUrl = `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
        }
      }

      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfilmentStatus: selectedStatus,
          courierPartner: courierPartner.trim() || null,
          trackingNumber: trackingNumber.trim() || null,
          trackingUrl: finalTrackingUrl || null,
          estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate).toISOString() : null,
          notes: adminNotes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save order details.");
      }

      setOrder(data.order);
      setTrackingUrl(data.order.trackingUrl || "");
      setSaveSuccessMsg("Order progress and tracking updated successfully!");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err.message || "Error saving progress");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStageClick = (stageKey: string) => {
    setSelectedStatus(stageKey);
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-[#8A796B]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6D1A2A] mb-3" />
        <p className="text-xs uppercase tracking-wider">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white p-8 border border-[#EBD9C8] rounded-sm text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <h2 className="font-serif text-lg text-[#171717]">Order Not Found</h2>
        <p className="text-xs text-[#6B5E55] mt-1 mb-4">{error || "Could not find order record."}</p>
        <Link
          href="/admin/orders"
          className="inline-block px-4 py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider rounded-sm font-medium"
        >
          Return to Orders
        </Link>
      </div>
    );
  }

  const shippingAddr = order.shippingAddress as any;
  const customerName = shippingAddr?.fullName || order.user?.name || "Patron";
  const customerEmail = order.guestEmail || order.user?.email || shippingAddr?.email || "N/A";
  const rawPhone = shippingAddr?.phone || shippingAddr?.mobile || order.user?.phone || "";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");

  const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentStageIndex = ATELIER_STAGES.findIndex((s) => s.key === order.fulfilmentStatus);
  const selectedStageIndex = ATELIER_STAGES.findIndex((s) => s.key === selectedStatus);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EBD9C8]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 text-[#4A3E37] hover:text-[#6D1A2A] hover:bg-[#F3EBE1] rounded-sm transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] font-semibold">
                ORDER MANAGEMENT &amp; ATELIER FULFILLMENT
              </span>
              <span className="text-[11px] text-[#8A796B]">Placed {dateStr}</span>
            </div>
            <h1 className="text-2xl font-serif text-[#171717] flex items-center gap-2.5 mt-0.5">
              <span>Order #{order.orderNumber}</span>
              {order.paymentStatus === "PAID" ? (
                <span className="text-[10.5px] font-sans px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold uppercase tracking-wider">
                  PAID
                </span>
              ) : (
                <span className="text-[10.5px] font-sans px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold uppercase tracking-wider">
                  {order.paymentStatus}
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Quick Save Indicator / Action & Invoice Print & Delete */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {saveSuccessMsg && (
            <span className="w-full sm:w-auto text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1 rounded text-center">
              {saveSuccessMsg}
            </span>
          )}
          <button
            type="button"
            onClick={() => downloadReceipt(order)}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 bg-white hover:bg-[#FAF5EE] text-[#855D25] border border-[#EBD9C8] text-xs uppercase tracking-[0.16em] font-medium transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
            title="Generate & Download Official GST Invoice"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Invoice</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveProgressAndTracking()}
            disabled={isSaving || isDeleting}
            className="flex-1 sm:flex-initial justify-center px-4 py-2 bg-[#6D1A2A] hover:bg-[#581522] text-[#FAF5EE] text-xs uppercase tracking-[0.16em] font-medium transition-colors rounded-sm flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 whitespace-nowrap"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Progress</span>
          </button>
          <button
            type="button"
            onClick={handleDeleteOrder}
            disabled={isSaving || isDeleting}
            className="w-full sm:w-auto justify-center px-3.5 py-2 bg-white hover:bg-red-50 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 text-xs uppercase tracking-[0.16em] font-medium transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50 whitespace-nowrap"
            title="Permanently Delete Order from Database (Free Storage)"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-700" />
            ) : (
              <Trash2 className="w-3.5 h-3.5 text-red-700" />
            )}
            <span>Delete Order</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 0. DIRECT UPI QR PAYMENT VERIFICATION CARD (ANTI-FRAUD PROTECTION)  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {order.paymentStatus !== "PAID" && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-sm p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-amber-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold text-amber-950 uppercase tracking-wide">
                  UPI Payment Verification Required
                </h3>
                <p className="text-xs text-amber-900 mt-0.5">
                  Patron submitted payment via UPI QR. Cross-check screenshot proof and your Bank/PhonePe statement before crafting.
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold block">Expected Credit</span>
              <span className="text-base font-serif font-bold text-[#6D1A2A]">₹ {(order.totalInPaise / 100).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/90 p-3.5 rounded border border-amber-200">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold block">Customer Claimed Ref / UTR</span>
              <span className="font-mono font-bold text-[#171717] select-all">{order.utrNumber || order.notes || "Direct UPI Scan"}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold block">Patron Contact</span>
              <span className="font-medium text-[#171717]">{order.user?.phone || (order.shippingAddress as any)?.phone || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold block">Payment Status</span>
              <span className="font-semibold text-amber-900 uppercase">{order.paymentStatus}</span>
            </div>
          </div>

          {/* Uploaded Payment Screenshot Section */}
          {order.paymentScreenshotUrl && (
            <div className="p-3.5 bg-white rounded border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#855D25] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Patron Uploaded Payment Screenshot Proof</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsScreenshotModalOpen(true)}
                  className="text-xs text-[#6D1A2A] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Screenshot</span>
                </button>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div
                  onClick={() => setIsScreenshotModalOpen(true)}
                  className="w-24 h-32 bg-[#FAF5EE] border border-[#D9C4B0] rounded relative overflow-hidden flex-shrink-0 cursor-pointer group shadow-xs hover:border-[#855D25] transition-all"
                >
                  <Image
                    src={order.paymentScreenshotUrl}
                    alt="Payment Screenshot Proof"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 text-xs space-y-1.5 text-[#4A3E37]">
                  <p className="font-medium text-[#171717]">
                    Proof screenshot uploaded by customer during checkout.
                  </p>
                  <p className="text-[11px] text-[#8A796B]">
                    Click thumbnail to zoom in and verify timestamp, amount paid, and sender UPI ID.
                  </p>
                  <div className="pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsScreenshotModalOpen(true)}
                      className="px-2.5 py-1 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#855D25] border border-[#EBD9C8] rounded text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect Proof</span>
                    </button>
                    <a
                      href={order.paymentScreenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[#171717] border border-[#D9C4B0] rounded text-[11px] font-medium inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open Original Tab</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleRejectPayment}
              disabled={isSaving}
              className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-700 border border-red-300 text-xs uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer"
            >
              ✕ Reject Fake / Unreceived
            </button>
            <button
              type="button"
              onClick={handleApprovePayment}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>✔ Verify &amp; Mark as PAID</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. INTERACTIVE ATELIER PRODUCTION & FULFILLMENT PROGRESS STEPPER    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#F0E5D8] pb-3">
          <div>
            <h2 className="font-serif text-base text-[#171717] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#855D25]" />
              <span>Production &amp; Delivery Progress Tracker</span>
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Click any stage below or select from the dropdown to update customer order status in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B5E55] font-medium">Stage:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#FCFAF6] border border-[#D9C4B0] text-xs py-1.5 px-2.5 rounded-sm text-[#171717] font-semibold focus:outline-none focus:ring-1 focus:ring-[#855D25]"
            >
              {ATELIER_STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
              <option value="CANCELLED">Cancelled / Refunded</option>
            </select>
          </div>
        </div>

        {/* Visual Stepper Bar */}
        {selectedStatus !== "CANCELLED" ? (
          <div className="pt-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {ATELIER_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isPassed = idx <= selectedStageIndex;
                const isCurrent = idx === selectedStageIndex;

                return (
                  <button
                    key={stage.key}
                    type="button"
                    onClick={() => handleStageClick(stage.key)}
                    className={`text-left p-3.5 rounded border transition-all duration-200 cursor-pointer relative flex flex-col justify-between gap-3 ${
                      isCurrent
                        ? "bg-[#6D1A2A] text-white border-[#6D1A2A] shadow-md ring-2 ring-[#855D25]/30"
                        : isPassed
                        ? "bg-[#FAF5EE] text-[#171717] border-[#855D25]/40 hover:bg-[#F3EBE1]"
                        : "bg-[#FCFAF6] text-[#8A796B] border-[#EBD9C8] hover:border-[#D9C4B0]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-full text-[11px] font-mono font-bold flex items-center justify-center ${
                          isCurrent
                            ? "bg-[#855D25] text-white"
                            : isPassed
                            ? "bg-[#855D25] text-white"
                            : "bg-[#EBD9C8] text-[#6B5E55]"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <Icon
                        className={`w-4 h-4 ${
                          isCurrent
                            ? "text-[#FAF5EE]"
                            : isPassed
                            ? "text-[#855D25]"
                            : "text-[#A09285]"
                        }`}
                      />
                    </div>

                    <div>
                      <div
                        className={`text-xs uppercase tracking-wider font-semibold ${
                          isCurrent
                            ? "text-white"
                            : isPassed
                            ? "text-[#5A1F2B]"
                            : "text-[#6B5E55]"
                        }`}
                      >
                        {stage.label}
                      </div>
                      <div
                        className={`text-[10.5px] mt-1 leading-snug line-clamp-2 ${
                          isCurrent
                            ? "text-[#FAF5EE]/90"
                            : isPassed
                            ? "text-[#6B5E55]"
                            : "text-[#A09285]"
                        }`}
                      >
                        {stage.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>This order is currently marked as <strong>CANCELLED</strong>.</span>
          </div>
        )}

        {/* ── COURIER PARTNER & DISPATCH SETTINGS ── */}
        <div className="bg-[#FAF5EE] p-5 rounded border border-[#EBD9C8] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#855D25] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Courier Partner, Tracking Number &amp; Delivery Date</span>
            </h3>
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#6D1A2A] hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>Live Tracking Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Courier Partner */}
            <div>
              <label className="block text-[#4A3E37] font-medium mb-1">
                Courier Partner
              </label>
              <select
                value={courierPartner}
                onChange={(e) => setCourierPartner(e.target.value)}
                className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
              >
                <option value="BlueDart">BlueDart Express</option>
                <option value="Delhivery">Delhivery Surface/Air</option>
                <option value="DTDC">DTDC Courier</option>
                <option value="India Post">India Post (Speed Post)</option>
                <option value="FedEx">FedEx Express</option>
                <option value="Shadowfax">Shadowfax</option>
                <option value="Royal Atelier Special Delivery">Royal Atelier Hand Delivery</option>
              </select>
            </div>

            {/* Tracking / AWB Number */}
            <div>
              <label className="block text-[#4A3E37] font-medium mb-1">
                Tracking / AWB Number
              </label>
              <input
                type="text"
                placeholder="e.g. BD789123456IN"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs font-mono text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25] placeholder:text-[#A09285]"
              />
            </div>

            {/* Estimated Delivery Date */}
            <div>
              <label className="block text-[#4A3E37] font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#855D25]" />
                <span>Estimated Delivery Date</span>
              </label>
              <input
                type="date"
                value={estimatedDeliveryDate}
                onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
              />
            </div>
          </div>

          {/* Custom Tracking Link & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="block text-[#4A3E37] font-medium mb-1">
                Custom Tracking URL (Optional override)
              </label>
              <input
                type="url"
                placeholder="https://track.courier.com/..."
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25] placeholder:text-[#A09285]"
              />
            </div>

            <div>
              <label className="block text-[#4A3E37] font-medium mb-1">
                Atelier Internal Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Special Zardozi stitching instructions followed"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25] placeholder:text-[#A09285]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveProgressAndTracking()}
              disabled={isSaving}
              className="px-4 py-2 bg-[#855D25] hover:bg-[#6e4a1a] text-white text-xs uppercase tracking-wider font-medium rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Update Tracking &amp; Stage</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. ORDERED ITEMS & CUSTOMER / PAYMENT DETAILS                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ordered Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-4">
            <h2 className="text-sm font-serif text-[#171717] pb-2 border-b border-[#F0E5D8] flex items-center justify-between">
              <span>Ordered Items ({order.items.length})</span>
              <span className="text-xs text-[#6B5E55] font-sans font-normal">
                {order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} total pieces
              </span>
            </h2>

            <div className="divide-y divide-[#F0E5D8]">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-22 bg-[#F3EBE1] relative rounded overflow-hidden flex-shrink-0 border border-[#EBD9C8]">
                    <Image
                      src={item.imageUrl || "/placeholder.webp"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-sm font-medium text-[#171717]">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-[#8A796B] mt-0.5">
                          Category: <span className="text-[#171717]">{item.category || "Traditional"}</span> | Size:{" "}
                          <span className="text-[#171717] font-medium">{item.size || "Standard"}</span>
                        </p>
                      </div>
                      <span className="font-semibold text-xs text-[#171717]">
                        ₹ {(item.totalInPaise / 100).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {item.stitchingSelected && (
                      <div className="mt-2 p-2 bg-[#FAF6F0] border border-[#EBD9C8] rounded text-[11px] text-[#855D25] flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5" />
                        <span>
                          Bespoke Stitching Service (+₹{" "}
                          {(item.stitchingPriceInPaise / 100).toLocaleString("en-IN")})
                        </span>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-[#6B5E55]">
                      Qty: <span className="font-medium text-[#171717]">{item.quantity}</span> × ₹{" "}
                      {(item.unitPriceInPaise / 100).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Transaction Details */}
          <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-4">
            <h2 className="text-sm font-serif text-[#171717] pb-2 border-b border-[#F0E5D8] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#855D25]" />
              <span>Payment &amp; Gateway Verification</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-[#8A796B] block mb-0.5">Payment Method</span>
                <span className="font-medium text-[#171717]">{order.paymentMethod || "UPI_SCANNER"}</span>
              </div>
              <div>
                <span className="text-[#8A796B] block mb-0.5">Payment Status</span>
                <span className={`font-semibold ${order.paymentStatus === "PAID" ? "text-emerald-800" : "text-amber-800"}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div>
                <span className="text-[#8A796B] block mb-0.5">Customer Claimed UTR / Ref</span>
                <span className="font-mono text-[#171717] select-all bg-[#FCFAF6] px-2 py-1 border border-[#EBD9C8] rounded block truncate font-bold">
                  {order.utrNumber || order.notes || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[#8A796B] block mb-0.5">Razorpay Order ID</span>
                <span className="font-mono text-[#171717] select-all bg-[#FCFAF6] px-2 py-1 border border-[#EBD9C8] rounded block truncate">
                  {order.razorpayOrderId || "Direct UPI"}
                </span>
              </div>
            </div>

            {/* Permanent Screenshot Proof Row */}
            {order.paymentScreenshotUrl && (
              <div className="pt-3 border-t border-[#F0E5D8] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setIsScreenshotModalOpen(true)}
                    className="w-12 h-14 bg-[#FAF5EE] border border-[#D9C4B0] rounded relative overflow-hidden flex-shrink-0 cursor-pointer hover:border-[#855D25]"
                  >
                    <Image
                      src={order.paymentScreenshotUrl}
                      alt="Payment Proof"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#171717] block">
                      Payment Screenshot Attached
                    </span>
                    <span className="text-[11px] text-[#8A796B]">
                      Saved in database with order record
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsScreenshotModalOpen(true)}
                    className="px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#855D25] border border-[#EBD9C8] rounded text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <a
                    href={order.paymentScreenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#171717] border border-[#D9C4B0] rounded text-xs font-medium inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 3. PATRON SIZE & PRODUCT EXCHANGE REQUEST MANAGEMENT           */}
          {/* ───────────────────────────────────────────────────────────── */}
          {order.exchangeRequests && order.exchangeRequests.length > 0 && (
            <div className="bg-white p-6 border-2 border-[#855D25]/40 rounded-sm shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBD9C8]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#855D25]/15 text-[#855D25] flex items-center justify-center font-bold text-xs">
                    ⇄
                  </div>
                  <div>
                    <h2 className="text-sm font-serif font-bold text-[#171717]">
                      Patron Exchange Requests ({order.exchangeRequests.length})
                    </h2>
                    <p className="text-[11px] text-[#8A796B]">
                      Manage reverse pickup scheduling, atelier karigari, and replacement dispatch
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {order.exchangeRequests.map((ex: any) => {
                  const targetItem = order.items.find((i: any) => i.id === ex.orderItemId);
                  return (
                    <AdminExchangeItemCard
                      key={ex.id}
                      exchange={ex}
                      targetItem={targetItem}
                      onUpdate={() => loadOrder()}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Customer Details & Financial Summary */}
        <div className="space-y-6">
          {/* Customer Profile & Instant Action Links */}
          <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-4">
            <h2 className="text-sm font-serif text-[#171717] pb-2 border-b border-[#F0E5D8] flex items-center gap-2">
              <User className="w-4 h-4 text-[#855D25]" />
              <span>Customer Details</span>
            </h2>

            <div className="text-xs space-y-2">
              <div className="font-semibold text-sm text-[#171717]">
                {customerName}
              </div>
              <div className="text-[#6B5E55]">
                Email: <span className="text-[#171717] font-medium">{customerEmail}</span>
              </div>
              <div className="text-[#6B5E55]">
                Phone: <span className="text-[#171717] font-mono font-medium">{rawPhone || "N/A"}</span>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                {cleanPhone && (
                  <>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-2.5 py-1.5 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#6D1A2A] border border-[#EBD9C8] rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                      title="Call Patron"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${customerName}, this is regarding your Rajwadi Couture Order #${order.orderNumber}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                      title="WhatsApp Customer"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                )}
                {customerEmail && customerEmail !== "N/A" && (
                  <a
                    href={`mailto:${customerEmail}?subject=${encodeURIComponent(`Update on your Rajwadi Order #${order.orderNumber}`)}`}
                    className="px-2.5 py-1.5 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#855D25] border border-[#EBD9C8] rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                    title="Email Customer"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Shipping Destination */}
            <div className="pt-3 border-t border-[#F0E5D8]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#855D25] mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Delivery Address</span>
              </div>
              <p className="text-xs text-[#4A3E37] leading-relaxed bg-[#FCFAF6] p-3 border border-[#EBD9C8] rounded">
                <strong>{shippingAddr?.fullName}</strong>
                <br />
                {shippingAddr?.address}
                <br />
                {shippingAddr?.city}, {shippingAddr?.state} - <span className="font-mono font-medium">{shippingAddr?.pincode}</span>
                <br />
                India
              </p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-3">
            <h2 className="text-sm font-serif text-[#171717] pb-2 border-b border-[#F0E5D8]">
              Financial Summary
            </h2>

            <div className="text-xs space-y-2">
              <div className="flex justify-between text-[#6B5E55]">
                <span>Items Subtotal</span>
                <span className="font-medium text-[#171717]">
                  ₹ {(order.subtotalInPaise / 100).toLocaleString("en-IN")}
                </span>
              </div>

              {order.stitchingInPaise > 0 && (
                <div className="flex justify-between text-[#6B5E55]">
                  <span>Bespoke Stitching</span>
                  <span className="font-medium text-[#171717]">
                    ₹ {(order.stitchingInPaise / 100).toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[#6B5E55]">
                <span>Insured Shipping</span>
                <span className="font-medium text-emerald-700">
                  {order.shippingInPaise === 0
                    ? "FREE"
                    : `₹ ${(order.shippingInPaise / 100).toLocaleString("en-IN")}`}
                </span>
              </div>

              <div className="pt-2 border-t border-[#EBD9C8] flex justify-between text-sm font-serif font-semibold text-[#171717]">
                <span>Total Amount</span>
                <span className="text-base text-[#6D1A2A]">
                  ₹ {(order.totalInPaise / 100).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. LIGHTBOX MODAL FOR HIGH-RES PAYMENT SCREENSHOT INSPECTION        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isScreenshotModalOpen && order.paymentScreenshotUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsScreenshotModalOpen(false)}
        >
          <div
            className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#6D1A2A] text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-sm font-semibold tracking-wide uppercase">
                  Payment Proof Screenshot &bull; Order #{order.orderNumber}
                </h3>
                <p className="text-[10.5px] text-[#E6DCB8]">
                  Uploaded by {customerName} &bull; Expected: ₹ {(order.totalInPaise / 100).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScreenshotModalOpen(false)}
                className="p-1 rounded text-[#E6DCB8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 bg-[#171717] flex-1 overflow-auto flex items-center justify-center min-h-[350px]">
              <div className="relative max-w-full max-h-[70vh] w-auto h-auto">
                <img
                  src={order.paymentScreenshotUrl}
                  alt="Full Payment Screenshot Proof"
                  className="max-h-[70vh] max-w-full object-contain rounded"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#FAF5EE] px-5 py-3 border-t border-[#EBD9C8] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-[#4A3E37]">
                <strong>UTR / Reference:</strong>{" "}
                <span className="font-mono text-[#171717] font-bold">
                  {order.utrNumber || order.notes || "Not provided"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={order.paymentScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white hover:bg-[#F3EBE1] text-[#855D25] border border-[#D9C4B0] rounded text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Resolution</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsScreenshotModalOpen(false)}
                  className="px-4 py-1.5 bg-[#6D1A2A] hover:bg-[#581522] text-white rounded text-xs font-medium cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminExchangeItemCard({
  exchange,
  targetItem,
  onUpdate,
}: {
  exchange: any;
  targetItem?: any;
  onUpdate: () => void;
}) {
  const [status, setStatus] = useState(exchange.status);
  const [reverseCourierPartner, setReverseCourierPartner] = useState(
    exchange.reverseCourierPartner || "BlueDart"
  );
  const [reverseTrackingNumber, setReverseTrackingNumber] = useState(
    exchange.reverseTrackingNumber || ""
  );
  const [replacementTrackingNumber, setReplacementTrackingNumber] = useState(
    exchange.replacementTrackingNumber || ""
  );
  const [adminNotes, setAdminNotes] = useState(exchange.adminNotes || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSave = async () => {
    setIsUpdating(true);
    setFeedback("");
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

      setFeedback("Exchange updated successfully!");
      setTimeout(() => setFeedback(""), 3000);
      onUpdate();
    } catch (err: any) {
      alert(err.message || "Error updating exchange");
    } finally {
      setIsUpdating(false);
    }
  };

  const getReasonLabel = (r: string) => {
    switch (r) {
      case "COLOR_PREFERENCE":
        return "Color / Design Preference";
      case "ALTERATION":
        return "Custom Alteration / Fitting";
      case "DAMAGE_DEFECT":
        return "Fabric or Embroidery Defect";
      default:
        return r;
    }
  };

  return (
    <div className="p-4 bg-[#FCFAF6] border border-[#EBD9C8] rounded-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#EBD9C8]">
        <div>
          <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#855D25]">
            Target Piece
          </div>
          <h3 className="text-sm font-serif font-bold text-[#171717]">
            {targetItem?.productName || "Ordered Item"}
          </h3>
          <div className="text-xs text-[#8A796B] mt-1">
            Reason: <span className="text-[#4A3E37] font-semibold">{getReasonLabel(exchange.reason)}</span>
            {exchange.desiredReplacement && (
              <div className="text-xs text-[#6D1A2A] font-medium mt-0.5">
                Replacement Preference: {exchange.desiredReplacement}
              </div>
            )}
            {exchange.reasonDetails && (
              <span className="italic text-[#6B5E55] block mt-1 bg-white p-2 border border-[#EBD9C8] rounded">
                &ldquo;{exchange.reasonDetails}&rdquo;
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`px-3 py-1 text-xs uppercase tracking-wider font-bold rounded ${
              status === "COMPLETED"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : status === "REJECTED"
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-[#855D25]/15 text-[#855D25] border border-[#855D25]/30"
            }`}
          >
            {status.replace(/_/g, " ")}
          </span>
          <span className="text-[10px] text-[#8A796B]">
            Requested {new Date(exchange.createdAt).toLocaleDateString("en-IN")}
          </span>
        </div>
      </div>

      {/* Admin Action Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
            <option value="PICKUP_SCHEDULED">3. PICKUP_SCHEDULED (Reverse AWB Assigned)</option>
            <option value="RECEIVED_AT_ATELIER">4. RECEIVED_AT_ATELIER (Tailoring Replacement)</option>
            <option value="REPLACEMENT_DISPATCHED">5. REPLACEMENT_DISPATCHED (In Transit)</option>
            <option value="COMPLETED">6. COMPLETED (Delivered &amp; Resolved)</option>
            <option value="REJECTED">7. REJECTED</option>
          </select>
        </div>

        <div>
          <label className="block text-[#4A3E37] font-medium mb-1">
            Reverse Pickup Courier Partner
          </label>
          <input
            type="text"
            value={reverseCourierPartner}
            onChange={(e) => setReverseCourierPartner(e.target.value)}
            placeholder="e.g. BlueDart / Delhivery Reverse"
            className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          />
        </div>

        <div>
          <label className="block text-[#4A3E37] font-medium mb-1">
            Reverse Pickup AWB / Waybill #
          </label>
          <input
            type="text"
            value={reverseTrackingNumber}
            onChange={(e) => setReverseTrackingNumber(e.target.value)}
            placeholder="e.g. BD-REV-987654321"
            className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] font-mono focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          />
        </div>

        <div>
          <label className="block text-[#4A3E37] font-medium mb-1">
            Replacement Dispatch AWB / Tracking #
          </label>
          <input
            type="text"
            value={replacementTrackingNumber}
            onChange={(e) => setReplacementTrackingNumber(e.target.value)}
            placeholder="e.g. BD-REP-123456789"
            className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] font-mono focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[#4A3E37] font-medium mb-1">
            Atelier Note to Patron (Visible on Patron Tracking Page)
          </label>
          <input
            type="text"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="e.g. Reverse pickup scheduled for tomorrow. Replacement is being prepared in 38 size."
            className="w-full bg-white border border-[#D9C4B0] p-2 rounded text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          {feedback && (
            <span className="text-xs text-emerald-700 font-medium">
              {feedback}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating}
          className="px-4 py-2 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-medium rounded transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
        >
          {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Save Exchange Status</span>
        </button>
      </div>
    </div>
  );
}

