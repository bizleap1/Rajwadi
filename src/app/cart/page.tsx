"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Minus, Plus, ShoppingBag, Trash2, Scissors, ShieldCheck } from "lucide-react";
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
    cartTotalInPaise,
    subtotalInPaise,
    stitchingInPaise,
    shippingInPaise,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const formattedTotal = `₹ ${(cartTotalInPaise / 100).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#FAF6F0]">
      <Navbar
        solidOnTop={true}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[74px] sm:pt-24 pb-32 sm:pb-20">
        {/* Breadcrumb */}
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

          <div className="w-16 sm:w-20 h-[1px] bg-[#E6DCB8]/80 mx-auto mt-2 sm:mt-2.5" />
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start mt-3 sm:mt-6">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="hidden sm:flex items-center justify-between pb-2.5 border-b border-[#E6DCB8] text-[10.5px] uppercase tracking-[0.22em] text-[#8C827A] font-semibold font-sans">
                <span>PRODUCT</span>
                <span>PRICE</span>
              </div>

              <div className="divide-y divide-[#E6DCB8]/70">
                <AnimatePresence initial={false}>
                  {cartItems.map((item, idx) => (
                    <motion.div
                      key={`${item.productId}-${item.size}-${item.stitchingSelected}-${idx}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.2 }}
                      className="py-4 sm:py-5 flex gap-3.5 sm:gap-5 items-start"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/product/${item.productId}`}
                        className="relative w-[100px] min-[375px]:w-[110px] sm:w-28 md:w-32 aspect-[3/4] flex-shrink-0 bg-[#F4ECE1] border border-[#E6DCB8]/60 overflow-hidden group shadow-2xs rounded-xs"
                      >
                        <Image
                          src={item.image || "/placeholder.webp"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 110px, 128px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between self-stretch min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={`/product/${item.productId}`}
                                className="font-serif text-[17px] sm:text-lg text-[#171717] hover:text-[#5A1F2B] transition-colors leading-tight"
                              >
                                {item.name}
                              </Link>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-[11px] font-sans text-[#855D25] uppercase tracking-wider font-medium">
                                  {item.size}
                                </span>
                                {item.stitchingSelected && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-[#855D25] bg-[#EAE0D2] px-1.5 py-0.5 rounded">
                                    <Scissors className="w-2.5 h-2.5" />
                                    <span>Bespoke Stitching</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                removeFromCart(item.productId, item.size, item.stitchingSelected)
                              }
                              className="text-[#171717]/40 hover:text-red-700 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Quantity & Item Total */}
                        <div className="flex items-center justify-between pt-3">
                          <div className="inline-flex items-center border border-[#D8CCB8] bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.size, item.stitchingSelected, -1)
                              }
                              className="p-1.5 hover:bg-[#EAE0D2] text-[#171717]/70 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-medium font-sans">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.size, item.stitchingSelected, 1)
                              }
                              className="p-1.5 hover:bg-[#EAE0D2] text-[#171717]/70 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-semibold text-sm text-[#171717]">
                            ₹ {(item.totalInPaise / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-4">
              <h3 className="font-serif text-base text-[#171717] pb-3 border-b border-[#F0E5D8]">
                Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#6B5E55]">
                  <span>Items Subtotal</span>
                  <span className="font-medium text-[#171717]">
                    ₹ {(subtotalInPaise / 100).toLocaleString("en-IN")}
                  </span>
                </div>

                {stitchingInPaise > 0 && (
                  <div className="flex justify-between text-[#6B5E55]">
                    <span>Bespoke Stitching</span>
                    <span className="font-medium text-[#171717]">
                      ₹ {(stitchingInPaise / 100).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#6B5E55]">
                  <span>Domestic Insured Shipping</span>
                  <span className="font-medium text-emerald-700">
                    {shippingInPaise === 0
                      ? "Complimentary"
                      : `₹ ${(shippingInPaise / 100).toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#EBD9C8] flex justify-between text-base font-serif font-semibold text-[#171717]">
                  <span>Grand Total</span>
                  <span className="text-[#6D1A2A]">{formattedTotal}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-3.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 shadow-sm rounded-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#8A796B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
                <span>256-bit Encrypted Checkout</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EAE0D2] flex items-center justify-center mx-auto mb-4 text-[#855D25]">
              <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
            </div>
            <h2 className="font-serif text-2xl text-[#171717] mb-2 font-normal">
              Your bag is empty
            </h2>
            <p className="text-xs text-[#6B5E55] max-w-xs mx-auto mb-6 font-light">
              Explore our heirloom Rajputi poshak creations and select your bespoke attire.
            </p>
            <Link
              href="/collection"
              className="inline-block px-6 py-2.5 bg-[#5A1F2B] text-[#FAF5EE] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#431520] transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <TalkToDesignerModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
}
