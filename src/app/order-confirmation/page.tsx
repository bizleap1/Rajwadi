"use client";

import React, { Suspense, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Check,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  Package,
  Truck,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders } from "@/context/OrderContext";
import { getEstimatedDeliveryRange } from "@/utils/date";
import { REAL_POSHAKS } from "@/data/products";
import { OrderRecord } from "@/types/order";
import { downloadReceipt } from "@/lib/receiptGenerator";

/* ─── tiny keyframe animations via style tag ─── */
const AnimStyles = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes scalePop {
      0%   { transform: scale(0.6); opacity: 0; }
      70%  { transform: scale(1.12); }
      100% { transform: scale(1);   opacity: 1; }
    }
    @keyframes ringPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(133,93,37,0.18); }
      50%       { box-shadow: 0 0 0 12px rgba(133,93,37,0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    .anim-fade-up   { animation: fadeUp 0.55s cubic-bezier(.22,.68,0,1.2) both; }
    .anim-scale-pop { animation: scalePop 0.55s cubic-bezier(.22,.68,0,1.2) both; }
    .anim-ring      { animation: ringPulse 2.4s ease-in-out infinite; }
    .anim-shimmer   {
      background: linear-gradient(90deg,#e8d9b0 0%,#f7f0e3 50%,#e8d9b0 100%);
      background-size: 200% auto;
      animation: shimmer 2.2s linear infinite;
    }
    .delay-1 { animation-delay: 0.10s; }
    .delay-2 { animation-delay: 0.20s; }
    .delay-3 { animation-delay: 0.32s; }
    .delay-4 { animation-delay: 0.44s; }
    .delay-5 { animation-delay: 0.56s; }
  `}</style>
);

/* ─── Order Steps Tracker ─── */
const STEPS = ["Order Received", "Verifying Payment", "Preparing", "Dispatched", "Delivered"];

function OrderTracker({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full py-5 anim-fade-up delay-3">
      <div className="relative flex items-start justify-between">
        {/* connector line */}
        <div className="absolute top-[18px] left-0 right-0 h-px bg-[#E6DCB8] z-0" />
        <div
          className="absolute top-[18px] left-0 h-px bg-gradient-to-r from-[#855D25] to-[#C4921F] z-0 transition-all duration-700"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={label} className="flex flex-col items-center gap-1.5 z-10" style={{ flex: 1 }}>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500
                  ${done   ? "bg-[#5A1F2B] border-[#5A1F2B] text-[#FAF6F0]" : ""}
                  ${active ? "bg-[#FAF5EE] border-[#855D25] text-[#855D25] anim-ring" : ""}
                  ${!done && !active ? "bg-[#FDFBF7] border-[#D8CCB8] text-[#C4B49A]" : ""}
                `}
              >
                {done ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <span className="text-[10px] font-semibold font-sans">{i + 1}</span>
                )}
              </div>
              <span
                className={`text-[9px] uppercase tracking-[0.15em] font-sans text-center leading-tight
                  ${active ? "text-[#855D25] font-semibold" : done ? "text-[#5A1F2B] font-medium" : "text-[#BDB0A0]"}
                `}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Info Row ─── */
function InfoBlock({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <div className="w-8 h-8 rounded-full bg-[#F4ECE1] border border-[#E6DCB8] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[#855D25] stroke-[1.75]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] font-semibold font-sans mb-0.5">{label}</p>
        <div className="text-xs text-[#171717] font-sans leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ─── Simple status pages (failed / cancelled / pending) ─── */
function SimpleStatus({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  body,
  actions,
}: {
  icon: any;
  iconColor: string;
  title: string;
  subtitle: string;
  body: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto py-12 sm:py-20 px-6 text-center">
      <AnimStyles />
      <div className={`w-14 h-14 mx-auto mb-4 rounded-full border ${iconColor} flex items-center justify-center anim-scale-pop`}>
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h1 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal tracking-widest uppercase anim-fade-up delay-1">
        {title}
      </h1>
      <p className="font-serif italic text-sm text-[#6B635B] mt-2 anim-fade-up delay-2">{subtitle}</p>
      <p className="font-sans text-xs text-[#171717]/75 leading-relaxed mt-3 mb-8 anim-fade-up delay-3">{body}</p>
      <div className="w-full h-px bg-[#E6DCB8] mb-6" />
      <div className="flex flex-col gap-3 anim-fade-up delay-4">{actions}</div>
    </div>
  );
}

/* ─── Main Content ─── */
function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const token = searchParams.get("token");
  const statusParam = searchParams.get("status");
  const { getOrderById, getLatestOrder } = useOrders();
  const [dbOrder, setDbOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const url = token ? `/api/orders/${orderId}?token=${token}` : `/api/orders/${orderId}`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.order) setDbOrder(data.order); })
      .catch((e) => console.warn("Could not fetch order from DB:", e));
  }, [orderId, token]);

  const order: OrderRecord = useMemo(() => {
    const found = orderId ? getOrderById(orderId) : getLatestOrder();
    if (found) return found;
    const est = getEstimatedDeliveryRange(5, 7);
    const demoProduct =
      REAL_POSHAKS.find((p) => p.name.includes("Gulabi Mor")) ||
      REAL_POSHAKS[0] || {
        id: "gulabi-mor-poshak",
        name: "Gulabi Mor Poshak",
        category: "Festive",
        type: "Stitched",
        price: "₹28,500",
        fabric: "Pure Georgette & Satin Magji",
        craft: "Handcrafted Gotapatti & Zardozi",
        color: "Gulabi Pink",
        image: "/products/Gulabi Mor Poshak/1.webp",
        description: "Handcrafted Rajputi poshak.",
        details: ["Handcrafted gotapatti and zardozi"],
        includes: ["Flared Ghagra", "Kurti & Kanchali", "Odhani with Kiran"],
      };
    return {
      orderId: orderId || "RW1024",
      itemCount: 1,
      subtotal: 28500,
      shipping: 0,
      total: 28500,
      paymentMethod: "UPI QR Code Payment",
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
      estimatedDelivery: {
        from: est.fromFormatted,
        to: est.toFormatted,
        rangeString: est.rangeString,
      },
      deliveryAddress: {
        fullName: "Prerna Sharma",
        mobile: "9876543210",
        phone: "9876543210",
        email: "prerna.sharma@example.com",
        address: "42 Heritage Boulevard, Civil Lines",
        city: "Nagpur",
        state: "Maharashtra",
        pincode: "4400XX",
      },
      items: [{ product: demoProduct, size: "Stitched", quantity: 1 }],
    };
  }, [orderId, getOrderById, getLatestOrder]);

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(order.total);

  const shortId = order.orderId.replace(/^#/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(shortId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── FAILED ──
  if (statusParam === "failed" || order.paymentStatus === "FAILED") {
    return (
      <SimpleStatus
        icon={XCircle}
        iconColor="border-[#5A1F2B]/25 bg-[#FDF5F5] text-[#5A1F2B]"
        title="Payment Unsuccessful"
        subtitle="Your order has not been confirmed."
        body="The transaction was declined by your payment provider. No funds have been deducted from your account."
        actions={
          <>
            <Link href="/checkout" className="w-full py-3.5 px-6 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors flex items-center justify-center gap-2">
              Try Payment Again <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/cart" className="w-full py-3.5 px-6 border border-[#5A1F2B]/35 hover:border-[#855D25] text-[#5A1F2B] hover:text-[#855D25] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors flex items-center justify-center gap-2">
              Return to Bag <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </>
        }
      />
    );
  }

  // ── CANCELLED ──
  if (statusParam === "cancelled" || order.paymentStatus === "CANCELLED") {
    return (
      <SimpleStatus
        icon={AlertCircle}
        iconColor="border-[#855D25]/25 bg-[#FAF5EE] text-[#855D25]"
        title="Payment Cancelled"
        subtitle="Your order is still pending."
        body="The payment window was dismissed before authorization. Your selections and address have been preserved."
        actions={
          <Link href="/checkout" className="w-full py-3.5 px-6 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors flex items-center justify-center gap-2">
            Return to Checkout <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      />
    );
  }

  // ── PROCESSING ──
  if (statusParam === "pending" || order.paymentStatus === "PENDING") {
    return (
      <SimpleStatus
        icon={Clock}
        iconColor="border-[#855D25]/25 bg-[#FAF5EE] text-[#855D25]"
        title="Payment Processing"
        subtitle="We'll update your order once payment is confirmed."
        body="Your bank is currently verifying the transaction. You will receive an SMS confirmation once completed."
        actions={
          <Link href="/checkout" className="w-full py-3.5 px-6 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors flex items-center justify-center gap-2">
            Return to Checkout <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      />
    );
  }

  const isPendingVerification =
    order.paymentStatus === "Pending Verification" ||
    order.orderStatus === "Order Received" ||
    order.paymentMethod === "UPI QR";

  // Current step for tracker
  const trackerStep = isPendingVerification ? 1 : 2;

  // ── SUCCESS / PENDING VERIFICATION ──
  return (
    <div className="max-w-lg mx-auto py-8 sm:py-12 px-5 sm:px-6">
      <AnimStyles />

      {/* ── HERO STATUS BADGE ── */}
      <div className="text-center mb-6">
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center anim-scale-pop
            ${isPendingVerification
              ? "bg-[#FAF5EE] border-2 border-[#C4921F]/40 text-[#855D25]"
              : "bg-[#5A1F2B] border-2 border-[#5A1F2B] text-[#FAF6F0]"
            }
            ${isPendingVerification ? "anim-ring" : ""}
          `}
        >
          {isPendingVerification ? (
            <Clock className="w-6 h-6 stroke-[1.75]" />
          ) : (
            <Check className="w-6 h-6 stroke-[2.5]" />
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal tracking-widest uppercase anim-fade-up delay-1">
          {isPendingVerification ? "Order Received" : "Order Confirmed"}
        </h1>

        <p className="font-serif italic text-sm mt-1.5 anim-fade-up delay-2" style={{ color: "#855D25" }}>
          {isPendingVerification
            ? "Payment verification is in progress."
            : "Your poshak is being lovingly prepared."}
        </p>

        {/* Order ID chip */}
        <button
          onClick={handleCopy}
          className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D8CCB8] bg-[#FAF5EE] hover:bg-[#F3EBE1] transition-colors cursor-pointer anim-fade-up delay-3"
        >
          <Sparkles className="w-3 h-3 text-[#855D25]" />
          <span className="font-mono text-xs font-semibold text-[#5A1F2B] tracking-wider">
            #{shortId}
          </span>
          <span className="text-[10px] text-[#8C827A] font-sans">
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>
      </div>

      {/* ── ORDER TRACKER ── */}
      <div className="px-1 mb-6">
        <OrderTracker currentStep={trackerStep} />
      </div>

      {/* ── PRODUCT CARD(S) ── */}
      <div className="border border-[#E6DCB8] bg-[#FDFBF7] anim-fade-up delay-3 mb-5">
        <div className="px-4 pt-3.5 pb-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans">
            Order Summary
          </p>
        </div>
        <div className="divide-y divide-[#EDE6D6]">
          {order.items.map((item) => (
            <div key={`${item.product.id}-${item.size}`} className="px-4 py-3.5 flex gap-3.5 items-center">
              <div className="relative w-14 aspect-[3/4] flex-shrink-0 bg-[#F4ECE1] border border-[#E6DCB8]/70 overflow-hidden shadow-sm">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  style={{ objectPosition: (item.product as any).imagePosition || "center 5%" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm text-[#171717] leading-snug line-clamp-1">{item.product.name}</p>
                <p className="text-[11px] text-[#855D25] mt-0.5">
                  {["XS","S","M","L","XL","XXL","3XL"].includes(item.size.toUpperCase())
                    ? `Size: ${item.size}`
                    : item.size}{" "}
                  · Qty {item.quantity}
                </p>
                <p className="text-xs font-semibold text-[#171717] mt-0.5">{item.product.price}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Total row */}
        <div className="border-t border-[#E6DCB8] px-4 py-3 flex justify-between items-center bg-[#FAF5EE]">
          <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#8C827A]">Total</span>
          <span className="font-serif text-xl text-[#171717]">{formattedTotal}</span>
        </div>
      </div>

      {/* ── INFO BLOCKS ── */}
      <div className="space-y-4 anim-fade-up delay-4 mb-6">
        <InfoBlock icon={MapPin} label="Delivery Address">
          <p className="font-medium">{order.deliveryAddress.fullName}</p>
          <p className="text-[#6B635B]">
            {order.deliveryAddress.address && <>{order.deliveryAddress.address},<br /></>}
            {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
          </p>
        </InfoBlock>

        <div className="w-full h-px bg-[#EDE6D6]" />

        <InfoBlock icon={Truck} label="Estimated Delivery">
          <p className="font-serif text-sm text-[#171717]">
            {order.estimatedDelivery.rangeString ||
              `${order.estimatedDelivery.from} – ${order.estimatedDelivery.to}`}
          </p>
        </InfoBlock>

        <div className="w-full h-px bg-[#EDE6D6]" />

        <InfoBlock icon={Package} label="Payment">
          <p className="font-medium">{order.paymentMethod || "UPI QR Code Payment"}</p>
          {(order as any).utrNumber && (
            <p className="text-[#6B635B] text-[11px] mt-0.5">
              UTR: <span className="font-mono text-[#171717] font-semibold">{(order as any).utrNumber}</span>
            </p>
          )}
          {(order as any).paymentScreenshot && (
            <div className="mt-2 p-2 bg-[#F4ECE1] border border-[#E6DCB8] flex items-center gap-2 rounded-xs inline-flex">
              <Check className="w-3 h-3 text-[#2E5A36]" />
              <span className="text-[11px] text-[#2E5A36] font-medium">Receipt attached</span>
            </div>
          )}
        </InfoBlock>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="flex flex-col gap-3 anim-fade-up delay-5">
        <button
          type="button"
          onClick={() => downloadReceipt(dbOrder || order)}
          className="w-full py-3.5 px-6 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#855D25] border border-[#D8CCB8] hover:border-[#C4921F] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Download Receipt
        </button>

        <Link
          href={`/order/${shortId}`}
          className="w-full py-3.5 px-6 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors flex items-center justify-center gap-2"
        >
          Track My Order
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/collection"
          className="w-full py-3.5 px-6 border border-[#5A1F2B]/35 hover:border-[#855D25] text-[#5A1F2B] hover:text-[#855D25] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-all flex items-center justify-center gap-2"
        >
          Continue Shopping
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#FAF6F0]">
      <Navbar solidOnTop={true} />
      <main className="flex-1 w-full pt-[72px] sm:pt-20 pb-14 sm:pb-20">
        <Suspense
          fallback={
            <div className="py-20 text-center font-sans text-xs text-[#8C827A] tracking-widest">
              Loading…
            </div>
          }
        >
          <OrderConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
