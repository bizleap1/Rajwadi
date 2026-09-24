"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getUnstitchedDisplayName } from "@/data/products";

interface CartDrawerProps {
  onOpenConsultation?: () => void;
}

export default function CartDrawer({ onOpenConsultation }: CartDrawerProps) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cartTotal);

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
            className="fixed inset-0 z-50 bg-[#0F0F0F]/60 backdrop-blur-sm"
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
                cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-4 pb-5 border-b border-[#E6DCB8]/60"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-28 flex-shrink-0 bg-[#EAE0D2] overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
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
                            {getUnstitchedDisplayName(item.product)}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="text-[#171717]/40 hover:text-[#5A1F2B] transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.3]" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-sans text-[#855D25] uppercase tracking-wider font-medium">
                            {item.size.toLowerCase().includes("size")
                              ? item.size
                              : ["XS", "S", "M", "L", "XL", "XXL", "3XL"].includes(item.size.toUpperCase()) || item.size.match(/^\d+$/)
                              ? `Size: ${item.size}`
                              : item.size}
                          </span>
                        </div>
                        <p className="text-sm font-sans font-medium text-[#171717] mt-1.5">
                          {item.product.price}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="inline-flex items-center border border-[#D8CCB8] bg-white/60">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, -1)}
                            className="p-1 hover:bg-[#EAE0D2] text-[#171717]/70 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-sans font-medium text-[#171717]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, 1)}
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

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-[#E6DCB8]/80 bg-[#F4ECE1] space-y-3.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#171717]/70 font-sans">
                    Estimated Subtotal
                  </span>
                  <span className="font-serif text-2xl text-[#171717] font-normal">
                    {formattedTotal}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#855D25] font-sans">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Complimentary Royal Insured Shipping Across India</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF5EE] text-xs uppercase tracking-[0.22em] font-medium border border-[#C6A15B] shadow-md transition-colors text-center block"
                >
                  VIEW BAG & CHECKOUT →
                </Link>

                <div className="text-center pt-1">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      onOpenConsultation?.();
                    }}
                    className="text-[11px] uppercase tracking-wider text-[#5A1F2B] hover:text-[#855D25] transition-colors border-b border-[#5A1F2B]/30 pb-0.5"
                  >
                    Have questions? Book Royal Consultation
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
