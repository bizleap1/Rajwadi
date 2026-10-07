"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Calendar,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Scissors,
  Truck,
  CheckCircle2,
  PackageCheck,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRightLeft,
  XCircle,
  HelpCircle,
  Download,
  FileText,
  CreditCard,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExchangeRequestModal from "@/components/ExchangeRequestModal";
import { downloadReceipt } from "@/lib/receiptGenerator";

const STAGES = [
  {
    key: "PENDING",
    label: "Order Confirmed",
    desc: "Order verified & queued for crafting",
    icon: CheckCircle2,
  },
  {
    key: "IN_ATELIER",
    label: "In Atelier",
    desc: "Bespoke Karigari & Tailoring",
    icon: Scissors,
  },
  {
    key: "READY_TO_DISPATCH",
    label: "Quality & Pack",
    desc: "Finishing & Gift Boxed",
    icon: Sparkles,
  },
  {
    key: "DISPATCHED",
    label: "Dispatched",
    desc: "In Transit with Insured Courier",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    desc: "Safely Handed to Patron",
    icon: PackageCheck,
  },
];

const EXCHANGE_STAGES = [
  { key: "REQUESTED", label: "Requested", desc: "Under atelier review" },
  { key: "APPROVED", label: "Approved", desc: "Exchange accepted" },
  { key: "PICKUP_SCHEDULED", label: "Reverse Pickup", desc: "Courier partner assigned" },
  { key: "RECEIVED_AT_ATELIER", label: "In Atelier", desc: "Inspecting & fitting replacement" },
  { key: "REPLACEMENT_DISPATCHED", label: "Dispatched", desc: "New piece on the way" },
  { key: "COMPLETED", label: "Delivered", desc: "Replacement received" },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const token = searchParams.get("token");

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Exchange modal state
  const [selectedExchangeItem, setSelectedExchangeItem] = useState<any>(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  async function loadOrder() {
    if (!id) return;
    try {
      const url = token
        ? `/api/orders/${id}?token=${token}`
        : `/api/orders/${id}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load order details.");
      }

      setOrder(data.order);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch order.");
    } finally {
      setIsLoading(false);
    }
  }

  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    if (!order) return;
    setIsPaying(true);
    setPayError("");
    setPaySuccess(false);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error(
          "Unable to load Razorpay payment gateway. Please check your internet connection."
        );
      }

      const payRes = await fetch(`/api/orders/${order.id}/pay?token=${token || ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) {
        throw new Error(payData.error || "Failed to initiate payment retry.");
      }

      const options = {
        key: payData.keyId,
        amount: payData.amountInPaise,
        currency: payData.currency || "INR",
        name: "Rajwadi Rajputi Poshak",
        description: `Order #${payData.orderNumber}`,
        image: "/logo without bg.png",
        order_id: payData.razorpayOrderId,
        prefill: {
          name: payData.customerName,
          email: payData.customerEmail,
          contact: payData.customerPhone,
        },
        theme: {
          color: "#6D1A2A",
        },
        handler: async function (response: any) {
          try {
            setIsPaying(true);
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: payData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(
                verifyData.error || "Payment verification failed."
              );
            }

            setPaySuccess(true);
            await loadOrder();
          } catch (vErr: any) {
            console.error("Verification error:", vErr);
            setPayError(
              vErr.message ||
                "Payment was completed, but verification is processing. Please reload in a moment."
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Razorpay failed:", response.error);
        setPayError(
          response.error?.description || "Payment failed or was cancelled."
        );
        setIsPaying(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setPayError(err.message || "Failed to launch Razorpay gateway.");
      setIsPaying(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between text-[#171717]">
        <Navbar />
        <div className="py-32 flex flex-col items-center justify-center text-[#8A796B]">
          <Loader2 className="w-8 h-8 animate-spin text-[#6D1A2A] mb-3" />
          <p className="text-xs uppercase tracking-wider">Retrieving order records...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between text-[#171717]">
        <Navbar />
        <div className="pt-32 pb-20 max-w-md mx-auto px-4 text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h1 className="text-2xl font-serif text-[#171717]">Access Restricted</h1>
          <p className="text-xs text-[#6B5E55] mt-1 mb-6">
            {error || "Could not retrieve order. Please verify your access token or log in with the associated account."}
          </p>
          <Link
            href="/collection"
            className="inline-block px-5 py-2.5 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#581522]"
          >
            Return to Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingAddr =
    typeof order?.shippingAddress === "string"
      ? (() => {
          try {
            return JSON.parse(order.shippingAddress);
          } catch {
            return {};
          }
        })()
      : order?.shippingAddress || {};
  const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const estimatedDeliveryStr = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const isDelivered = order.fulfilmentStatus === "DELIVERED";
  const currentStageIndex = STAGES.findIndex((s) => s.key === order.fulfilmentStatus);
  const exchangeRequests = order.exchangeRequests || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#171717] font-sans selection:bg-[#6D1A2A] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-20 sm:pt-28 md:pt-32 pb-20 max-w-4xl mx-auto w-full px-3.5 sm:px-6 space-y-5 sm:space-y-6">
        <div>
          <Link
            href="/collection"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#855D25] hover:text-[#6D1A2A] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </Link>
        </div>

        {/* ── 1. REAL-TIME DELIVERY TIMELINE STEPPER ── */}
        <div className="bg-white p-4 sm:p-6 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F0E5D8]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] font-semibold">
                  ORDER &amp; DELIVERY STATUS
                </span>
                <span className="text-[11px] text-[#8A796B]">Placed {dateStr}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif text-[#171717] mt-0.5">
                Order <span className="font-mono font-bold tracking-tight">#{order.orderNumber}</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {order.paymentStatus === "PAID" ? (
                <button
                  type="button"
                  onClick={() => downloadReceipt(order)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#855D25] hover:text-[#6D1A2A] border border-[#EBD9C8] rounded text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                  title="Download Official Tax Invoice / Receipt"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
              ) : (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-500 border border-gray-200 rounded text-xs uppercase tracking-wider font-medium cursor-not-allowed"
                  title="Receipt is issued once payment is completed"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Receipt Pending Payment</span>
                </span>
              )}

              {order.paymentStatus === "PAID" ? (
                <span className="px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  PAID
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded bg-amber-50 text-amber-800 border border-amber-300">
                  PAYMENT PENDING
                </span>
              )}

              {order.fulfilmentStatus === "DELIVERED" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Delivered</span>
                </span>
              ) : order.paymentStatus !== "PAID" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
                  <span>Awaiting Payment</span>
                </span>
              ) : order.fulfilmentStatus === "PENDING" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold rounded bg-[#F3EBE1] text-[#6D1A2A] border border-[#EBD9C8]">
                  <span>Order Confirmed &bull; In Queue</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs uppercase tracking-wider font-medium rounded bg-[#F3EBE1] text-[#4A3E37]">
                  {order.fulfilmentStatus.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>

          {/* Unpaid Action Banner & Razorpay Pay Now Button */}
          {order.paymentStatus !== "PAID" && (
            <div className="bg-gradient-to-r from-amber-50 to-[#FAF5EE] border-2 border-amber-300 p-4 sm:p-5 rounded-sm shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 flex-shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4 text-[#6D1A2A]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs uppercase tracking-wider text-[#6D1A2A] font-bold">
                        Payment Incomplete &bull; Action Required
                      </strong>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-200 text-amber-900 uppercase">
                        Pending
                      </span>
                    </div>
                    <p className="text-xs text-[#5C4A3E] mt-0.5 leading-relaxed">
                      This royal order is awaiting payment confirmation. Complete payment to start atelier karigari, bespoke tailoring, and priority dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 sm:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#8A796B] font-semibold block">Total Payable</span>
                  <span className="text-lg font-serif font-bold text-[#6D1A2A]">
                    {order.totalFormatted}
                  </span>
                </div>
              </div>

              {payError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{payError}</span>
                </div>
              )}

              {paySuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>Payment captured successfully! Updating royal order records...</span>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-amber-200/80">
                <div className="flex items-center gap-2 text-[11px] text-[#855D25]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>100% Encrypted &bull; Razorpay Secure (UPI, GPay, PhonePe, Cards, NetBanking)</span>
                </div>

                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isPaying}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-[0.15em] font-bold rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#E6DCB8]" />
                      <span>Opening Secure Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-[#E6DCB8]" />
                      <span>Complete Payment Now ({order.totalFormatted})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Estimated Delivery & Tracking Banner */}
          {order.fulfilmentStatus === "DELIVERED" ? (
            <div className="bg-emerald-50/90 p-4.5 rounded border border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-emerald-900">
                    Delivered to Patron Destination
                  </div>
                  <div className="text-xs text-emerald-800 mt-0.5">
                    {order.courierPartner ? (
                      <span>
                        Handed over safely via <strong>{order.courierPartner}</strong>
                        {order.trackingNumber ? ` (AWB: ${order.trackingNumber})` : ""}
                      </span>
                    ) : (
                      <span>Handcrafted with precision &amp; delivered safely</span>
                    )}
                  </div>
                </div>
              </div>

              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs uppercase tracking-wider font-medium rounded transition-colors shadow-xs"
                >
                  <span>Courier Tracking</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="bg-[#FAF5EE] p-4.5 rounded border border-[#EBD9C8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#855D25]/15 flex items-center justify-center text-[#855D25] flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-[#855D25]">
                    {estimatedDeliveryStr
                      ? `Estimated Delivery: ${estimatedDeliveryStr}`
                      : "Estimated Delivery: Guaranteed Within 7 Days"}
                  </div>
                  <div className="text-xs text-[#6B5E55] mt-0.5">
                    {order.courierPartner ? (
                      <span>
                        Courier: <strong>{order.courierPartner}</strong>
                        {order.trackingNumber ? ` (AWB: ${order.trackingNumber})` : ""}
                      </span>
                    ) : (
                      <span>Handcrafted with precision in Nagpur Atelier</span>
                    )}
                  </div>
                </div>
              </div>

              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#6D1A2A] hover:bg-[#581522] text-[#FAF5EE] text-xs uppercase tracking-wider font-medium rounded transition-colors shadow-xs"
                >
                  <span>Live Tracking</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Visual Step-by-Step Progress Timeline */}
          {order.fulfilmentStatus !== "CANCELLED" ? (
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {STAGES.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isPassed = currentStageIndex >= 0 && idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div
                      key={stage.key}
                      className={`p-3.5 rounded border transition-all ${
                        isCurrent
                          ? "bg-[#6D1A2A] text-white border-[#6D1A2A] shadow-md ring-1 ring-[#855D25]/40"
                          : isPassed
                          ? "bg-[#FAF5EE] text-[#171717] border-[#855D25]/40"
                          : "bg-[#FCFAF6] text-[#8A796B] border-[#EBD9C8]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
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
                              ? "text-white"
                              : isPassed
                              ? "text-[#855D25]"
                              : "text-[#A09285]"
                          }`}
                        />
                      </div>
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
                        className={`text-[10.5px] mt-0.5 leading-tight ${
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
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded">
              Order has been cancelled.
            </div>
          )}
        </div>

        {/* ── 2. ACTIVE EXCHANGE REQUESTS TIMELINE (IF ANY) ── */}
        {/* ponytail: exchange tracker hidden as requested, preserve for future enablement */}
        {false && exchangeRequests.length > 0 && (
          <div className="bg-white p-6 border-2 border-[#855D25]/30 rounded-sm shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#F0E5D8]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#855D25]/10 text-[#855D25] flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-semibold text-[#171717]">
                    Product &amp; Poshak Exchange Tracker
                  </h2>
                  <p className="text-[11px] text-[#8A796B]">
                    Live status of your exchange request &amp; atelier replacement
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {exchangeRequests.map((ex: any) => {
                const targetItem = order.items.find((i: any) => i.id === ex.orderItemId);
                const isRejected = ex.status === "REJECTED";
                const stageIndex = EXCHANGE_STAGES.findIndex((s) => s.key === ex.status);

                return (
                  <div
                    key={ex.id}
                    className="p-4 bg-[#FAF5EE] rounded-sm border border-[#EBD9C8] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBD9C8]/60 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#855D25]">
                          Exchange For:
                        </span>
                        <h3 className="text-sm font-serif font-semibold text-[#171717]">
                          {targetItem?.productName || "Ordered Piece"}
                        </h3>
                        {ex.desiredReplacement && (
                          <p className="text-xs text-[#6D1A2A] font-medium mt-0.5">
                            Replacement Preference: {ex.desiredReplacement}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded ${
                            ex.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : isRejected
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-[#855D25]/15 text-[#855D25] border border-[#855D25]/30"
                          }`}
                        >
                          {ex.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>

                    {/* Stepper for active exchange */}
                    {!isRejected ? (
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
                        {EXCHANGE_STAGES.map((stg, sIdx) => {
                          const isPassed = stageIndex >= 0 && sIdx <= stageIndex;
                          const isCurrent = sIdx === stageIndex;

                          return (
                            <div
                              key={stg.key}
                              className={`p-2 rounded text-center border transition-all ${
                                isCurrent
                                  ? "bg-[#6D1A2A] text-white border-[#6D1A2A] shadow-xs"
                                  : isPassed
                                  ? "bg-white text-[#171717] border-[#855D25]/40"
                                  : "bg-white/50 text-[#A09285] border-[#EBD9C8]"
                              }`}
                            >
                              <div
                                className={`text-[10px] font-mono font-bold mb-1 mx-auto w-4 h-4 rounded-full flex items-center justify-center ${
                                  isCurrent
                                    ? "bg-[#855D25] text-white"
                                    : isPassed
                                    ? "bg-[#855D25] text-white"
                                    : "bg-[#EBD9C8] text-[#8A796B]"
                                }`}
                              >
                                {sIdx + 1}
                              </div>
                              <div className="text-[11px] font-semibold uppercase tracking-wider truncate">
                                {stg.label}
                              </div>
                              <div className="text-[9.5px] opacity-80 leading-tight truncate mt-0.5">
                                {stg.desc}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs rounded">
                        This exchange request was reviewed and could not be accommodated.
                      </div>
                    )}

                    {/* Logistics details for reverse pickup & replacement dispatch */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      {ex.reverseCourierPartner && (
                        <div className="bg-white p-3 rounded border border-[#EBD9C8]">
                          <div className="text-[10px] uppercase tracking-wider font-bold text-[#855D25] flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5" />
                            <span>Reverse Pickup Details</span>
                          </div>
                          <p className="text-[#4A3E37] mt-1">
                            Courier Partner: <strong>{ex.reverseCourierPartner}</strong>
                            {ex.reverseTrackingNumber && (
                              <>
                                <br />
                                Pickup AWB / Waybill:{" "}
                                <span className="font-mono font-medium">{ex.reverseTrackingNumber}</span>
                              </>
                            )}
                          </p>
                        </div>
                      )}

                      {ex.replacementTrackingNumber && (
                        <div className="bg-white p-3 rounded border border-[#EBD9C8]">
                          <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1.5">
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Replacement Dispatch AWB</span>
                          </div>
                          <p className="text-[#4A3E37] mt-1 font-mono font-medium">
                            {ex.replacementTrackingNumber}
                          </p>
                        </div>
                      )}
                    </div>

                    {ex.adminNotes && (
                      <div className="bg-white/80 p-3 rounded border border-[#EBD9C8] text-xs">
                        <span className="font-semibold text-[#855D25] uppercase tracking-wider text-[10px] block mb-0.5">
                          Atelier Message:
                        </span>
                        <p className="text-[#4A3E37] italic">&ldquo;{ex.adminNotes}&rdquo;</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 3. ORDERED ITEMS & DETAILS ── */}
        <div className="bg-white p-4 sm:p-6 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0E5D8]">
            <h2 className="text-sm font-serif text-[#171717]">
              Ordered Pieces ({order.items.length})
            </h2>
            {/* ponytail: exchange guarantee badge hidden as requested */}
            {false && (
              <span className="text-[11px] text-[#8A796B]">
                7-Day Size &amp; Fit Exchange Guaranteed
              </span>
            )}
          </div>

          <div className="divide-y divide-[#F0E5D8]">
            {order.items.map((item: any) => {
              const activeExchange = exchangeRequests.find(
                (ex: any) => ex.orderItemId === item.id && ex.status !== "COMPLETED" && ex.status !== "REJECTED"
              );

              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row gap-4 first:pt-2 last:pb-0">
                  <div className="flex gap-4 flex-1">
                    <div className="w-16 h-20 bg-[#F3EBE1] relative rounded overflow-hidden flex-shrink-0 border border-[#EBD9C8]">
                      <Image
                        src={item.imageUrl || "/placeholder.webp"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-serif text-[#171717] font-medium text-sm">
                            {item.productName}
                          </h3>
                          <p className="text-[11px] text-[#8A796B] mt-0.5">
                            {item.category} | Size: <strong className="text-[#171717]">{item.size}</strong>
                          </p>
                          {item.stitchingSelected && (
                            <span className="inline-flex items-center gap-1 text-[10.5px] text-[#855D25] mt-1">
                              <Scissors className="w-3 h-3" />
                              <span>Bespoke Stitching Included</span>
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-xs text-[#171717]">
                          {item.totalFormatted}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-[#6B5E55]">
                        Qty: {item.quantity} × {item.unitPriceFormatted}
                      </div>
                    </div>
                  </div>

                  {/* Exchange Button Action (Available only after order is delivered or exchange is active) */}
                  {/* ponytail: exchange button hidden as requested, preserve for future enablement */}
                  {false && (activeExchange || isDelivered) && (
                    <div className="flex sm:flex-col justify-end items-end gap-2 pt-2 sm:pt-0">
                      {activeExchange ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF5EE] border border-[#855D25]/30 text-[#855D25] rounded text-[11px] font-medium">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Exchange {activeExchange.status.replace(/_/g, " ")}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedExchangeItem(item);
                            setIsExchangeModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#855D25] text-[#855D25] hover:bg-[#855D25] hover:text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors shadow-2xs"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Request Exchange</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Shipping & Financial Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#EBD9C8] text-xs">
            <div className="space-y-1.5">
              <span className="text-[10.5px] uppercase tracking-wider text-[#855D25] font-semibold block">
                Shipping Destination
              </span>
              <p className="text-[#4A3E37] leading-relaxed">
                <strong>{shippingAddr?.fullName}</strong>
                <br />
                {shippingAddr?.address}
                <br />
                {shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.pincode}
                <br />
                Mobile: {shippingAddr?.phone}
              </p>
            </div>

            <div className="bg-[#FAF6F0] p-4 rounded-sm border border-[#EBD9C8] space-y-2">
              <div className="flex justify-between text-[#6B5E55]">
                <span>Items Subtotal</span>
                <span className="font-medium text-[#171717]">
                  {order.subtotalFormatted || (order.subtotalInPaise != null ? `₹ ${(order.subtotalInPaise / 100).toLocaleString("en-IN")}` : "—")}
                </span>
              </div>
              {order.stitchingInPaise > 0 && (
                <div className="flex justify-between text-[#6B5E55]">
                  <span>Stitching Service</span>
                  <span className="font-medium text-[#171717]">
                    {order.stitchingFormatted || `₹ ${(order.stitchingInPaise / 100).toLocaleString("en-IN")}`}
                  </span>
                </div>
              )}
              {order.discountInPaise > 0 && (
                <div className="flex justify-between text-[#6B5E55]">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span className="font-medium text-emerald-700">
                    -{order.discountFormatted || `₹ ${(order.discountInPaise / 100).toLocaleString("en-IN")}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#6B5E55]">
                <span>Shipping</span>
                <span className="font-medium text-emerald-700">{order.shippingFormatted || "FREE"}</span>
              </div>
              {(() => {
                const netGoods = Math.max(0, (order.totalInPaise || 0) - (order.shippingInPaise || 0));
                const isAbove5k = (netGoods / 100) > 5000;
                const gstRate = isAbove5k ? 18 : 5;
                const gstDivisor = isAbove5k ? 1.18 : 1.05;
                const taxablePaise = Math.round(netGoods / gstDivisor);
                const gstPaise = netGoods - taxablePaise;
                return (
                  <div className="flex justify-between text-[11px] text-[#8A796B] pt-0.5">
                    <span>GST ({gstRate}% Included in Total)</span>
                    <span className="font-mono">₹ {(gstPaise / 100).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                  </div>
                );
              })()}
              <div className="pt-2 border-t border-[#EBD9C8] flex justify-between text-sm font-serif font-semibold text-[#171717]">
                <span>Total Amount</span>
                <span className="text-[#6D1A2A]">
                  {order.totalFormatted || (order.totalInPaise != null ? `₹ ${(order.totalInPaise / 100).toLocaleString("en-IN")}` : "—")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Exchange Request Modal */}
      {selectedExchangeItem && isDelivered && (
        <ExchangeRequestModal
          isOpen={isExchangeModalOpen}
          onClose={() => {
            setIsExchangeModalOpen(false);
            setSelectedExchangeItem(null);
          }}
          orderId={order.id}
          orderNumber={order.orderNumber}
          items={order.items}
          initialItemId={selectedExchangeItem.id}
          guestToken={token || undefined}
          onSuccess={() => {
            loadOrder();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

