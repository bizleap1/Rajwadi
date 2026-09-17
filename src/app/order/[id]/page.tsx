"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Clock,
  Truck,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders } from "@/context/OrderContext";
import { OrderRecord } from "@/types/order";
import { getEstimatedDeliveryRange } from "@/utils/date";
import { REAL_POSHAKS } from "@/data/products";

export default function OrderDetailPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "";
  const cleanId = rawId.replace(/^#/, "").trim();

  const { getOrderById, getLatestOrder } = useOrders();

  // Find order in context, or provide a realistic demonstration fallback if visiting /order/RW1024 directly
  const order: OrderRecord = useMemo(() => {
    const found = getOrderById(cleanId);
    if (found) return found;

    // Check latest order
    const latest = getLatestOrder();
    if (latest && (latest.orderId.toLowerCase() === cleanId.toLowerCase() || !cleanId)) {
      return latest;
    }

    // High fidelity fallback for demoing order #RW1024
    const est = getEstimatedDeliveryRange(5, 7);
    const demoProduct =
      REAL_POSHAKS.find((p) => p.name.includes("Gulabi Mor")) ||
      REAL_POSHAKS[0] || {
        id: "gulabi-mor-poshak",
        name: "Gulabi Mor Poshak",
        category: "Traditional",
        price: "₹28,500",
        fabric: "Pure Georgette & Satin Magji",
        craft: "Handcrafted Gotapatti & Zardozi",
        color: "Gulabi Pink",
        image: "/products/Gulabi Mor Poshak/1.webp",
        description: "Handcrafted Rajputi poshak with authentic peacock motifs.",
        details: ["Handcrafted gotapatti and zardozi"],
        includes: ["Flared Ghagra", "Kurti & Kanchali", "Odhani with Kiran"],
      };

    return {
      orderId: cleanId || "RW1024",
      itemCount: 1,
      subtotal: 28500,
      shipping: 0,
      total: 28500,
      paymentMethod: "Razorpay Secure (UPI / Cards)",
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
        pincode: "440001",
      },
      items: [
        {
          product: demoProduct,
          size: "Stitched",
          quantity: 1,
        },
      ],
    };
  }, [cleanId, getOrderById, getLatestOrder]);

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(order.total);

  const formattedSubtotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(order.subtotal);

  const formattedDate = useMemo(() => {
    try {
      const d = new Date(order.createdAt);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  }, [order.createdAt]);

  const whatsappInquiryUrl = useMemo(() => {
    const itemList = order.items
      .map((i) => `${i.product.name} (${i.size}) × ${i.quantity}`)
      .join(", ");

    const text = `Hello Rajwadi Concierge, I am inquiring regarding my Order #${order.orderId.replace(
      /^#/,
      ""
    )} (${itemList}). Could you please update me on the atelier dispatch schedule?`;

    return `https://wa.me/918766667101?text=${encodeURIComponent(text)}`;
  }, [order]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#FAF6F0]">
      {/* 1. SOLID NAVBAR */}
      <Navbar solidOnTop={true} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[74px] sm:pt-24 pb-24">
        {/* Minimal Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-4 sm:mb-6 font-sans"
        >
          <Link
            href="/"
            className="hover:text-[#5A1F2B] transition-colors duration-200"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
          <Link
            href="/collection"
            className="hover:text-[#5A1F2B] transition-colors duration-200"
          >
            Orders
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
          <span className="text-[#5A1F2B] font-semibold">
            #{order.orderId.replace(/^#/, "")}
          </span>
        </nav>

        {/* ORDER HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-5 border-b border-[#E6DCB8] mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal tracking-wide uppercase">
                ORDER #{order.orderId.replace(/^#/, "")}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#2E5A36]/10 text-[#2E5A36] border border-[#2E5A36]/20 text-[10.5px] uppercase tracking-wider font-semibold font-sans">
                <CheckCircle2 className="w-3 h-3" />
                <span>Confirmed</span>
              </span>
            </div>

            <p className="font-sans text-xs text-[#8C827A]">
              Placed on {formattedDate} · Payment via Razorpay (Paid)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-sans font-medium text-[#2E5A36] hover:text-[#24472b] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WHATSAPP CONCIERGE &rarr;</span>
            </a>
          </div>
        </div>

        {/* MAIN 2-COLUMN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: PRODUCTS LIST & ATELIER TRACKING */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* 1. ORDERED PRODUCTS */}
            <div className="bg-white/60 border border-[#E6DCB8]/80 p-5 sm:p-6">
              <h2 className="font-serif text-base sm:text-lg text-[#171717] font-normal tracking-wide mb-4 pb-3 border-b border-[#E6DCB8]/60">
                PIECES IN THIS ORDER
              </h2>

              <div className="divide-y divide-[#E6DCB8]/60">
                {order.items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start"
                  >
                    {/* 3:4 Thumbnail */}
                    <Link
                      href={`/product/${item.product.id}`}
                      className="relative w-20 sm:w-24 aspect-[3/4] flex-shrink-0 bg-[#F4ECE1] border border-[#E6DCB8]/60 overflow-hidden group shadow-2xs"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        style={{
                          objectPosition:
                            item.product.imagePosition || "center 5%",
                        }}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Product Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="font-serif text-base text-[#171717] hover:text-[#5A1F2B] font-normal leading-snug transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <span className="font-sans font-medium text-sm text-[#171717]">
                          {item.product.price}
                        </span>
                      </div>

                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold font-sans block mt-1">
                        {item.product.category}
                      </span>

                      <div className="mt-1 flex items-center gap-3 text-xs font-sans text-[#855D25]">
                        <span className="font-medium">{item.size}</span>
                        <span className="text-[#8C827A]">·</span>
                        <span className="text-[#8C827A]">
                          Qty: {item.quantity}
                        </span>
                      </div>

                      <p className="text-[11px] font-serif italic text-[#6B635B] mt-2 line-clamp-1">
                        Pure handcrafted silk with royal Rajasthani marodi work
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. ATELIER PREPARATION & DISPATCH TIMELINE */}
            <div className="bg-[#FAF5EE] border border-[#E6DCB8] p-5 sm:p-6">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#E6DCB8]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#855D25]" />
                  <h3 className="font-serif text-base sm:text-lg text-[#171717] font-normal tracking-wide">
                    ROYAL ATELIER TRACKING
                  </h3>
                </div>
                <span className="text-[10.5px] uppercase tracking-wider font-sans font-semibold text-[#855D25]">
                  Step 2 of 4
                </span>
              </div>

              {/* Progress Steps */}
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#D8CCB8]">
                {/* Step 1: Confirmed */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#2E5A36] text-white flex items-center justify-center z-10 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#171717]">
                      Order Confirmed & Payment Received
                    </h4>
                    <p className="text-[11px] font-sans text-[#6B635B] mt-0.5">
                      Transaction verified via 256-bit encrypted Razorpay gateway.
                    </p>
                  </div>
                </div>

                {/* Step 2: In Atelier (Active) */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#5A1F2B] text-white flex items-center justify-center z-10 flex-shrink-0 ring-4 ring-[#5A1F2B]/20">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#5A1F2B]">
                        In Atelier Preparation
                      </h4>
                      <span className="px-1.5 py-0.5 bg-[#5A1F2B]/10 text-[#5A1F2B] text-[9.5px] font-semibold uppercase tracking-wider">
                        Current Status
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-[#6B635B] mt-0.5">
                      Master artisans are inspecting hand embroidery and tailoring measurements.
                    </p>
                  </div>
                </div>

                {/* Step 3: Dispatched */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-white border border-[#D8CCB8] text-[#8C827A] flex items-center justify-center z-10 flex-shrink-0">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
                      Insured Royal Dispatch
                    </h4>
                    <p className="text-[11px] font-sans text-[#8C827A] mt-0.5">
                      Air courier with wax seal tamper-proof luxury packaging.
                    </p>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-white border border-[#D8CCB8] text-[#8C827A] flex items-center justify-center z-10 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
                      Delivered to Doorstep
                    </h4>
                    <p className="text-[11px] font-sans text-[#8C827A] mt-0.5">
                      Expected window:{" "}
                      <strong className="text-[#171717] font-semibold">
                        {order.estimatedDelivery.rangeString ||
                          `${order.estimatedDelivery.from} – ${order.estimatedDelivery.to}`}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E6DCB8]/60 text-[11px] font-sans text-[#6B635B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#855D25] flex-shrink-0" />
                <span>
                  Airway bill & live tracking links will be delivered directly via SMS and WhatsApp once dispatched.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DELIVERY INFO & SUMMARY */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* 1. DELIVERY ADDRESS */}
            <div className="bg-[#FAF5EE] border border-[#E6DCB8] p-5 sm:p-6 text-xs font-sans">
              <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans pb-2.5 border-b border-[#E6DCB8] mb-3">
                DELIVERY INFORMATION
              </h3>

              <div className="space-y-1.5 leading-relaxed">
                <p className="text-[#171717] font-semibold text-[13px]">
                  {order.deliveryAddress.fullName}
                </p>
                {order.deliveryAddress.address && (
                  <p className="text-[#6B635B]">{order.deliveryAddress.address}</p>
                )}
                <p className="text-[#6B635B]">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}
                </p>
                <p className="text-[#6B635B]">{order.deliveryAddress.pincode}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6DCB8]/70 space-y-1 text-[#8C827A]">
                <p>Phone: +91 {order.deliveryAddress.mobile || order.deliveryAddress.phone}</p>
                <p>Email: {order.deliveryAddress.email}</p>
              </div>
            </div>

            {/* 2. ORDER FINANCIAL SUMMARY */}
            <div className="bg-[#FAF5EE] border border-[#E6DCB8] p-5 sm:p-6 text-xs font-sans">
              <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans pb-2.5 border-b border-[#E6DCB8] mb-3">
                PAYMENT SUMMARY
              </h3>

              <div className="space-y-2 py-2 border-b border-[#E6DCB8]/70">
                <div className="flex justify-between text-[#171717]/85">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#171717]">
                    {formattedSubtotal}
                  </span>
                </div>
                <div className="flex justify-between text-[#171717]/85">
                  <span>Royal Insured Shipping</span>
                  <span className="text-[#2E5A36] font-semibold">Complimentary</span>
                </div>
                <div className="flex justify-between text-[#171717]/85">
                  <span>Payment Method</span>
                  <span className="text-[#855D25] font-medium">Razorpay Secure</span>
                </div>
              </div>

              <div className="pt-3 pb-1 flex justify-between items-baseline">
                <span className="font-semibold uppercase tracking-wider text-[#171717]">
                  Total Paid
                </span>
                <span className="font-serif text-xl text-[#171717] font-normal">
                  {formattedTotal}
                </span>
              </div>
            </div>

            {/* 3. QUICK ACTIONS */}
            <div className="space-y-3">
              <Link
                href="/collection"
                className="w-full h-11 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF5EE] text-xs uppercase tracking-[0.2em] font-medium font-sans flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>CONTINUE SHOPPING</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/order-confirmation"
                className="w-full h-11 bg-white hover:bg-[#FAF5EE] text-[#5A1F2B] border border-[#5A1F2B]/30 hover:border-[#855D25] text-xs uppercase tracking-[0.2em] font-medium font-sans flex items-center justify-center gap-2 transition-colors"
              >
                <span>VIEW RECEIPT</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
