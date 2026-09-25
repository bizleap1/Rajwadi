"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, Scissors, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  onOpenConsultation?: () => void;
}

export default function CartDrawer({ onOpenConsultation }: CartDrawerProps) {
  const {
    cartItems,
    cartCount,
    cartTotal,
    cartTotalInPaise,
    isCartOpen,
    warnings,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const formattedTotal = `₹ ${(cartTotalInPaise / 100).toLocaleString("en-IN")}`;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-[#0F0F0F]/60 backdrop-blur-xs"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FAF5EE] shadow-2xl flex flex-col border-l border-[#E6DCB8]/60"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#E6DCB8]/80 flex items-center justify-between bg-[#F4ECE1]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#855D25] stroke-[1.4]" />
                <h3 className="font-serif text-xl text-[#171717] font-normal tracking-wide">
                  Your Royal Bag
                </h3>
                <span className="text-xs font-sans text-[#855D25] bg-[#E8DCB8]/50 px-2 py-0.5 rounded-full font-medium">
                  {cartCount} {cartCount === 1 ? "piece" : "pieces"}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-[#171717]/60 hover:text-[#5A1F2B] transition-colors"
                aria-label="Close Bag"
              >
                <X className="w-5 h-5 stroke-[1.4]" />
              </button>
            </div>

            {/* Warnings banner */}
            {warnings && warnings.length > 0 && (
              <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs space-y-1">
                {warnings.map((w, idx) => (
                  <p key={idx}>{w}</p>
                ))}
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#EAE0D2] flex items-center justify-center mb-4 text-[#855D25]">
                    <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
                  </div>
                  <h4 className="font-serif text-2xl text-[#171717] mb-2 font-normal">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-[#171717]/60 max-w-xs font-sans mb-6 font-light">
                    Explore our heirloom Rajputi poshak creations and select your bespoke attire.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 bg-[#5A1F2B] text-[#FAF5EE] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#431520] transition-colors"
                  >
                    Explore Collections
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.stitchingSelected}-${idx}`}
                    className="flex gap-4 pb-5 border-b border-[#E6DCB8]/60"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-28 flex-shrink-0 bg-[#EAE0D2] overflow-hidden rounded-xs border border-[#EBD9C8]">
                      <Image
                        src={item.image || "/placeholder.webp"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-[17px] text-[#171717] leading-tight font-normal">
                            {item.name}
                          </h4>
                          <button
                            onClick={() =>
                              removeFromCart(item.productId, item.size, item.stitchingSelected)
                            }
                            className="text-[#171717]/40 hover:text-[#5A1F2B] transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.3]" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] font-sans text-[#855D25] uppercase tracking-wider font-medium">
                            {item.size}
                          </span>
                          {item.stitchingSelected && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#855D25] bg-[#EAE0D2] px-1.5 py-0.5 rounded">
                              <Scissors className="w-2.5 h-2.5" />
                              <span>Stitching included</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-sans font-medium text-[#171717] mt-1.5">
                          ₹ {(item.totalInPaise / 100).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="inline-flex items-center border border-[#D8CCB8] bg-white/60">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.size, item.stitchingSelected, -1)
                            }
                            className="p-1 hover:bg-[#EAE0D2] text-[#171717]/70 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-medium font-sans">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.size, item.stitchingSelected, 1)
                            }
                            className="p-1 hover:bg-[#EAE0D2] text-[#171717]/70 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Total & Checkout CTA */}
            {cartItems.length > 0 && (
              <div className="p-5 sm:p-6 bg-[#F4ECE1] border-t border-[#E6DCB8]/80 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#171717]/70">
                    <span>Shipping</span>
                    <span className="font-medium text-[#2E5A36]">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-base font-serif text-[#171717] pt-2 border-t border-[#E6DCB8]/60">
                    <span>Grand Total</span>
                    <span className="font-semibold text-[#5A1F2B] font-sans">
                      {formattedTotal}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF5EE] text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#171717]/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
                  <span>Insured Domestic Delivery & Secure Payments</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
