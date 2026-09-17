"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const TalkToDesignerModal = dynamic(
  () => import("@/components/TalkToDesignerModal"),
  { ssr: false }
);

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cartTotal);

  // Generate WhatsApp inquiry text
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    const itemList = cartItems
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} (${item.size}) × ${
            item.quantity
          } - ${item.product.price}`
      )
      .join("%0A");

    const message = `Hello Rajwadi, I would like to enquire / checkout with my Bag:%0A%0A${itemList}%0A%0ATotal: ${encodeURIComponent(
      formattedTotal
    )}%0APlease assist with my order.`;

    window.open(`https://wa.me/918766667101?text=${message}`, "_blank");
  };

  const handleCheckout = () => {
    alert(
      `Proceeding to Secure Checkout with ${cartCount} piece(s) for ${formattedTotal}. Order ID generated.`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#FAF6F0]">
      {/* 1. SOLID NAVBAR */}
      <Navbar
        solidOnTop={true}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* 2. MAIN BAG CONTENT (Shopping-focused, fast and clean) */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[74px] sm:pt-24 pb-32 sm:pb-20">
        {/* Minimal Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-2.5 sm:mb-4 font-sans"
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
            Collection
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
          <span className="text-[#5A1F2B] font-semibold">Your Bag</span>
        </nav>

        {/* Compact Centered Header */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <h1 className="font-serif text-[24px] sm:text-3xl md:text-4xl text-[#171717] font-normal tracking-[0.06em] uppercase">
            YOUR BAG
          </h1>

          {cartItems.length > 0 && (
            <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.24em] text-[#855D25] mt-1 font-semibold">
              {cartCount} {cartCount === 1 ? "POSHAK" : "POSHAKS"}
            </p>
          )}

          {/* Hairline Divider */}
          <div className="w-16 sm:w-20 h-[1px] bg-[#E6DCB8]/80 mx-auto mt-2 sm:mt-2.5" />
        </div>

        {cartItems.length > 0 ? (
          /* 3. DESKTOP 2-COLUMN / MOBILE SINGLE COLUMN LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start mt-3 sm:mt-6">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 xl:col-span-8">
              {/* Header row on desktop */}
              <div className="hidden sm:flex items-center justify-between pb-2.5 border-b border-[#E6DCB8] text-[10.5px] uppercase tracking-[0.22em] text-[#8C827A] font-semibold font-sans">
                <span>PRODUCT</span>
                <span>PRICE</span>
              </div>

              {/* Items List with Hairline Dividers */}
              <div className="divide-y divide-[#E6DCB8]/70">
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => {
                    const linePrice = item.product.price;
                    return (
                      <motion.div
                        key={`${item.product.id}-${item.size}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                        transition={{ duration: 0.2 }}
                        className="py-4 sm:py-5 flex gap-3.5 sm:gap-5 items-start"
                      >
                        {/* 3:4 Thumbnail (~100-120px wide) */}
                        <Link
                          href={`/product/${item.product.id}`}
                          className="relative w-[100px] min-[375px]:w-[110px] sm:w-28 md:w-32 aspect-[3/4] flex-shrink-0 bg-[#F4ECE1] border border-[#E6DCB8]/60 overflow-hidden group shadow-2xs"
                        >
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="(max-width: 640px) 110px, 130px"
                            style={{
                              objectPosition:
                                item.product.imagePosition || "center 5%",
                              transform: item.product.imageScale
                                ? `scale(${item.product.imageScale})`
                                : undefined,
                              transformOrigin:
                                item.product.imagePosition || "center 10%",
                            }}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between min-w-0 self-stretch py-0.5">
                          <div>
                            {/* Product Name */}
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/product/${item.product.id}`}
                                className="font-serif text-[15px] sm:text-[17px] text-[#171717] hover:text-[#5A1F2B] font-normal leading-snug transition-colors line-clamp-1"
                              >
                                {item.product.name}
                              </Link>

                              {/* Desktop Price */}
                              <span className="hidden sm:block font-sans font-medium text-base text-[#171717] flex-shrink-0 text-right">
                                {linePrice}
                              </span>
                            </div>

                            {/* Category in small uppercase */}
                            <span className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold font-sans block mt-0.5">
                              {item.product.category}
                            </span>

                            {/* Applicable Stitching Status */}
                            <span className="text-[11.5px] sm:text-xs font-sans text-[#855D25] tracking-wide block mt-0.5 font-medium">
                              {item.size.match(/^\d+$/)
                                ? `Size: ${item.size}`
                                : item.size}
                            </span>

                            {/* Mobile Price */}
                            <span className="sm:hidden font-sans font-medium text-[13.5px] text-[#171717] block mt-1">
                              {linePrice}
                            </span>
                          </div>

                          {/* Controls: Understated Quantity Stepper & Remove Action */}
                          <div className="flex items-center gap-3 mt-2.5 sm:mt-3 pt-0.5">
                            {/* Small & Understated Quantity Stepper */}
                            <div className="inline-flex items-center border border-[#D8CCB8] bg-white/80">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.size,
                                    -1
                                  )
                                }
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#171717]/70 hover:text-[#5A1F2B] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-6 sm:w-7 text-center text-xs font-sans font-medium text-[#171717]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.size, 1)
                                }
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#171717]/70 hover:text-[#5A1F2B] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            {/* Remove Action */}
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(item.product.id, item.size)
                              }
                              className="text-[10.5px] sm:text-[11px] uppercase tracking-wider text-[#8C827A] hover:text-[#5A1F2B] underline underline-offset-3 font-sans transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 mt-6 lg:mt-0">
              <div className="sticky top-24 bg-[#FAF5EE] border border-[#E6DCB8]/80 p-5 sm:p-6 shadow-2xs">
                <h3 className="font-serif text-base sm:text-lg text-[#171717] font-normal tracking-wider pb-2.5 border-b border-[#E6DCB8]">
                  ORDER SUMMARY
                </h3>

                <div className="py-3.5 space-y-2.5 font-sans text-xs sm:text-[13px] border-b border-[#E6DCB8]">
                  <div className="flex justify-between items-center text-[#171717]/85">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#171717]">
                      {formattedTotal}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#171717]/85">
                    <span>Shipping</span>
                    <span className="text-[#855D25] font-medium">—</span>
                  </div>
                </div>

                {/* Total Row */}
                <div className="py-3.5 flex justify-between items-baseline">
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#171717] font-bold">
                    TOTAL
                  </span>
                  <span className="font-serif text-xl sm:text-2xl text-[#171717] font-normal">
                    {formattedTotal}
                  </span>
                </div>

                {/* Checkout Button */}
                <div className="pt-2 space-y-2.5">
                  <Link
                    href="/checkout"
                    className="w-full h-[46px] sm:h-[48px] bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF5EE] text-xs uppercase tracking-[0.22em] font-medium transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <span>CHECKOUT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* WhatsApp Secondary Link (Understated text link below CTA, not equal-size button) */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={handleWhatsAppCheckout}
                      className="text-[11px] uppercase tracking-wider text-[#5A1F2B] hover:text-[#855D25] underline underline-offset-3 font-medium transition-colors cursor-pointer"
                    >
                      WHATSAPP ENQUIRE →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 4. EXACT EMPTY STATE */
          <div className="py-14 sm:py-20 text-center max-w-sm mx-auto px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 rounded-full border border-[#E6DCB8] bg-[#FAF6F0] flex items-center justify-center text-[#855D25]">
              <ShoppingBag className="w-5 h-5 stroke-[1.25]" />
            </div>

            <h2 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal mb-2">
              YOUR BAG
            </h2>

            <p className="font-serif italic text-xs sm:text-sm text-[#6B635B] leading-relaxed mb-6">
              Your bag is waiting for something timeless.
            </p>

            <Link
              href="/collection"
              className="inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium font-sans text-[#FAF6F0] bg-[#5A1F2B] hover:bg-[#855D25] py-3 px-6 sm:px-7 transition-colors duration-300 shadow-xs"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </main>

      {/* 5. MOBILE STICKY BOTTOM CHECKOUT BAR (Shown only on mobile when items exist) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF5EE]/95 backdrop-blur-md border-t border-[#E6DCB8] px-4 py-3 flex items-center justify-between shadow-lg sm:hidden">
          <div className="flex flex-col text-left">
            <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#8C827A] font-sans font-semibold">
              TOTAL
            </span>
            <span className="font-serif text-[17px] font-normal text-[#171717] leading-tight">
              {formattedTotal}
            </span>
          </div>

          <Link
            href="/checkout"
            className="px-6 py-2.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF5EE] text-[11px] uppercase tracking-[0.2em] font-medium font-sans flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
          >
            <span>CHECKOUT</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* 6. FOOTER */}
      <Footer onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 7. CONSULTATION MODAL */}
      <TalkToDesignerModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
}
