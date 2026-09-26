"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  Scissors,
  Download,
  Printer,
  FileText,
  Truck,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { downloadReceipt } from "@/lib/receiptGenerator";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const token = searchParams.get("token");

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadNotification, setDownloadNotification] = useState(false);
  const autoDownloadTriggered = useRef(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setIsLoading(false);
        setError("Missing order reference.");
        return;
      }

      try {
        const url = token
          ? `/api/orders/${orderId}?token=${token}`
          : `/api/orders/${orderId}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load order confirmation.");
        }

        setOrder(data.order);

        // Auto download receipt once order is ready
        if (!autoDownloadTriggered.current && data.order) {
          autoDownloadTriggered.current = true;
          setTimeout(() => {
            try {
              downloadReceipt(data.order);
              setDownloadNotification(true);
              setTimeout(() => setDownloadNotification(false), 6000);
            } catch (err) {
              console.warn("Auto receipt download blocked:", err);
            }
          }, 800);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load order confirmation.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, token]);

  const handleManualDownload = () => {
    if (order) {
      downloadReceipt(order);
      setDownloadNotification(true);
      setTimeout(() => setDownloadNotification(false), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between text-[#171717]">
        <Navbar />
        <div className="py-32 flex flex-col items-center justify-center text-[#8A796B]">
          <Loader2 className="w-8 h-8 animate-spin text-[#6D1A2A] mb-3" />
          <p className="text-xs uppercase tracking-wider">Confirming your royal order...</p>
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
          <h1 className="text-2xl font-serif text-[#171717]">Order Inquiry</h1>
          <p className="text-xs text-[#6B5E55] mt-1 mb-6">
            {error || "Could not retrieve order details. Please check your confirmation link or log in."}
          </p>
          <Link
            href="/collection"
            className="inline-block px-5 py-2.5 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#581522]"
          >
            Explore Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingAddr = order.shippingAddress as any;
  const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#171717] font-sans selection:bg-[#6D1A2A] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-24 sm:pt-28 md:pt-32 pb-16 max-w-4xl mx-auto w-full px-4 sm:px-6">
        {/* Success Header */}
        <div className="text-center pb-8 border-b border-[#EBD9C8]">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-700 mx-auto mb-3 shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-[10.5px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
            PAYMENT CONFIRMED &bull; ORDER DISPATCH QUEUED
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#171717] mt-1">
            Thank you for your order, {shippingAddr?.fullName || "Patron"}
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1.5 font-serif italic">
            Order #{order.orderNumber} placed on {dateStr}
          </p>

          {/* Quick Action Buttons: Download Receipt & Track Order */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-5">
            <button
              type="button"
              onClick={handleManualDownload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-medium rounded-sm shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Receipt (PDF)</span>
            </button>

            <Link
              href={`/order/${order.id}${token ? `?token=${token}` : ""}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#855D25] border border-[#855D25] text-xs uppercase tracking-wider font-semibold rounded-sm shadow-2xs transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status &rarr;</span>
            </Link>
          </div>

          {downloadNotification && (
            <div className="mt-3 p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs inline-flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official Tax Receipt &amp; Royal Invoice generated successfully!</span>
            </div>
          )}

          {order.paymentStatus === "VERIFICATION_PENDING" && (
            <div className="mt-4 p-3.5 bg-amber-50 text-amber-950 border border-amber-200 rounded text-xs text-left max-w-xl mx-auto space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#855D25] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>UPI Payment Verification in Progress</span>
              </div>
              <p className="text-[#6B5E55] leading-relaxed">
                Your UPI payment reference has been received. Our atelier team will verify your bank transaction and confirm your crafting timeline. Your provisional receipt has been downloaded.
              </p>
            </div>
          )}
        </div>

        {/* Order Details & Summary Card */}
        <div className="mt-8 bg-white border border-[#EBD9C8] rounded-sm shadow-sm p-4 sm:p-8 space-y-6">
          {/* Ordered Items */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E5D8]">
              <h2 className="text-sm font-serif text-[#171717]">
                Ordered Ensembles ({order.items.length})
              </h2>
              <button
                type="button"
                onClick={handleManualDownload}
                className="text-[11px] text-[#855D25] hover:text-[#6D1A2A] font-medium inline-flex items-center gap-1"
              >
                <Printer className="w-3 h-3" />
                <span>Print Invoice</span>
              </button>
            </div>

            <div className="divide-y divide-[#F0E5D8]">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-4 flex gap-4 first:pt-3 last:pb-0">
                  <div className="w-14 h-20 bg-[#F3EBE1] relative rounded overflow-hidden flex-shrink-0 border border-[#EBD9C8]">
                    <Image
                      src={item.imageUrl || "/placeholder.webp"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-serif text-[#171717] font-medium text-sm">
                          {item.productName}
                        </h3>
                        <p className="text-[11px] text-[#8A796B] mt-0.5">
                          {item.category || "Traditional Poshak"}
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
                      Qty: {item.quantity} &bull; {item.unitPriceFormatted} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Financial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#EBD9C8] text-xs">
            {/* Delivery Destination */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[#855D25] font-semibold text-[10.5px] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shipping Address</span>
              </div>
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

            {/* Price Summary */}
            <div className="space-y-2 bg-[#FAF6F0] p-4 rounded-sm border border-[#EBD9C8]">
              <div className="flex justify-between text-[#6B5E55]">
                <span>Items Subtotal</span>
                <span className="font-medium text-[#171717]">
                  {order.subtotalFormatted}
                </span>
              </div>

              {order.stitchingInPaise > 0 && (
                <div className="flex justify-between text-[#6B5E55]">
                  <span>Bespoke Stitching Services</span>
                  <span className="font-medium text-[#171717]">
                    {order.stitchingFormatted}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[#6B5E55]">
                <span>Insured Express Shipping</span>
                <span className="font-medium text-emerald-700">
                  {order.shippingFormatted}
                </span>
              </div>

              <div className="pt-2 border-t border-[#EBD9C8] flex justify-between text-sm font-serif font-semibold text-[#171717]">
                <span>Amount Paid</span>
                <span className="text-[#6D1A2A]">
                  {order.totalFormatted || (order.totalInPaise != null ? `₹ ${(order.totalInPaise / 100).toLocaleString("en-IN")}` : "—")}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A796B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#855D25]" />
              <span>Razorpay Verified Payment &bull; Insured Delivery</span>
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleManualDownload}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-[#855D25] text-[#855D25] hover:bg-[#FAF5EE] text-xs font-medium rounded-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Receipt</span>
              </button>

              <Link
                href="/collection"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#581522] rounded-sm transition-colors text-center"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6D1A2A]" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
