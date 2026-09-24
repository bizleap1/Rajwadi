"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Package, Heart, ShoppingBag, MessageCircle, ShieldCheck, Sparkles, Search } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface AccountPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  view?: "all" | "desktop" | "mobile";
}

export default function AccountPopover({
  isOpen,
  onClose,
  view = "all",
}: AccountPopoverProps) {
  const router = useRouter();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [orderQuery, setOrderQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Mobile background scroll lock (only for mobile drawer < 640px)
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    if (isMobile) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    onClose();
    router.push(`/order/${encodeURIComponent(orderQuery.trim().toUpperCase())}`);
  };

  const showDesktop = view === "all" || view === "desktop";
  const showMobile = view === "all" || view === "mobile";

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. DESKTOP POPOVER (~340px wide, positioned top-right below navbar) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showDesktop && (
        <div className="hidden sm:block">
          {/* Backdrop to dismiss on clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          <div
            ref={popoverRef}
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-full mt-3 w-[340px] bg-[#FAF5EE] border border-[#E6DCB8] shadow-2xl z-50 p-6 text-[#171717] animate-in fade-in zoom-in-95 duration-150 rounded-sm"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-[#8C827A] hover:text-[#5A1F2B] transition-colors p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-left space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block mb-0.5">
                  PATRON SERVICES
                </span>
                <h3 className="font-serif text-xl text-[#171717] font-normal tracking-wide flex items-center gap-2">
                  <span>My Account</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                </h3>
                <p className="font-serif italic text-xs text-[#6B635B] mt-0.5">
                  Track orders, wishlist &amp; royal concierge
                </p>
              </div>

              {/* Quick Order Lookup Form */}
              <form onSubmit={handleTrackOrder} className="pt-1">
                <label className="text-[10px] uppercase tracking-wider text-[#855D25] font-semibold block mb-1.5">
                  Track Your Order
                </label>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. RW1024"
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      className="w-full bg-white border border-[#D8CCB8] focus:border-[#855D25] px-3 py-2 text-xs uppercase tracking-wider text-[#171717] outline-none rounded-xs placeholder:normal-case placeholder:tracking-normal placeholder:text-[#A89F95]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#5A1F2B] hover:bg-[#431520] text-white text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
                  >
                    Track
                  </button>
                </div>
              </form>

              {/* Hairline Divider */}
              <div className="w-full h-[1px] bg-[#E6DCB8]" />

              {/* Menu items */}
              <div className="space-y-2.5 font-sans text-xs">
                {/* 1. Track / My Orders */}
                <button
                  type="button"
                  onClick={() => handleNavigate("/account?tab=orders")}
                  className="w-full text-left group py-1.5 px-2 hover:bg-white/60 rounded-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-[#855D25]" />
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-[#5A1F2B] transition-colors">
                        My Orders
                      </span>
                      <span className="text-[11px] text-[#6B635B]">Order status &amp; receipts</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#8C827A] group-hover:text-[#5A1F2B]">&rarr;</span>
                </button>

                {/* 2. Wishlist */}
                <button
                  type="button"
                  onClick={() => handleNavigate("/wishlist")}
                  className="w-full text-left group py-1.5 px-2 hover:bg-white/60 rounded-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-[#855D25]" />
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-[#5A1F2B] transition-colors">
                        Saved Poshaks
                      </span>
                      <span className="text-[11px] text-[#6B635B]">
                        {wishlistCount > 0 ? `${wishlistCount} items saved` : "Your curated wishlist"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#8C827A] group-hover:text-[#5A1F2B]">&rarr;</span>
                </button>

                {/* 3. Shopping Bag */}
                <button
                  type="button"
                  onClick={() => handleNavigate("/cart")}
                  className="w-full text-left group py-1.5 px-2 hover:bg-white/60 rounded-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-[#855D25]" />
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-[#5A1F2B] transition-colors">
                        Royal Shopping Bag
                      </span>
                      <span className="text-[11px] text-[#6B635B]">
                        {cartCount > 0 ? `${cartCount} items in bag` : "Ready for checkout"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#8C827A] group-hover:text-[#5A1F2B]">&rarr;</span>
                </button>

                {/* 4. WhatsApp Concierge */}
                <a
                  href="https://wa.me/918766667101?text=Hello%20Rajwadi%20Couture%2C%20I%20need%20assistance%20with%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left group py-1.5 px-2 hover:bg-white/60 rounded-xs transition-colors flex items-center justify-between block cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-emerald-800 transition-colors">
                        Royal Concierge
                      </span>
                      <span className="text-[11px] text-[#6B635B]">WhatsApp live assistance</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#8C827A] group-hover:text-emerald-800">&rarr;</span>
                </a>
              </div>

              {/* Hairline Divider */}
              <div className="w-full h-[1px] bg-[#E6DCB8] pt-1" />

              {/* Store Admin Link */}
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => handleNavigate("/admin/login")}
                  className="text-[#855D25] hover:text-[#5A1F2B] uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Store Owner Portal &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. MOBILE FULL-SCREEN ACCOUNT DRAWER                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showMobile && (
        <div
          role="dialog"
          aria-modal="true"
          className="sm:hidden fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col text-[#171717] w-full h-full min-h-[100dvh] overflow-hidden animate-in slide-in-from-right duration-200"
        >
          {/* Top Bar: Title left, Close × right */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E6DCB8] bg-[#FAF5EE] flex-shrink-0">
            <span className="font-serif text-sm tracking-[0.2em] text-[#171717] uppercase font-normal">
              MY ACCOUNT &amp; SERVICES
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 -mr-1.5 text-[#171717] hover:text-[#5A1F2B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Body: Clean vertical navigation */}
          <div className="flex-1 overflow-y-auto px-6 py-8 bg-[#FDFBF7]">
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans block mb-1">
                  PATRON SERVICES
                </span>
                <h3 className="font-serif text-2xl text-[#171717] font-normal tracking-wide">
                  Welcome to Rajwadi
                </h3>
                <p className="font-serif italic text-xs text-[#6B635B] mt-1">
                  Manage your orders, saved poshak pieces and royal concierge.
                </p>
              </div>

              {/* Quick Order Lookup Form on Mobile */}
              <form onSubmit={handleTrackOrder} className="bg-[#FAF5EE] p-4 border border-[#E6DCB8] rounded-xs space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-[#855D25] font-semibold block">
                  Track Your Order Status
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Order ID (e.g. RW1024)"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    className="flex-1 bg-white border border-[#D8CCB8] focus:border-[#855D25] px-3 py-2.5 text-xs uppercase tracking-wider text-[#171717] outline-none rounded-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#5A1F2B] text-white text-xs uppercase tracking-wider font-medium rounded-xs"
                  >
                    Track
                  </button>
                </div>
              </form>

              {/* Hairline Divider */}
              <div className="w-full h-[1px] bg-[#E6DCB8]" />

              {/* Vertical Links */}
              <div className="divide-y divide-[#E6DCB8]/60 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => handleNavigate("/account?tab=orders")}
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-[#855D25]" />
                    <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B]">
                      MY ORDERS &amp; RECEIPTS
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/wishlist")}
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-[#855D25]" />
                    <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B]">
                      SAVED POSHAKS ({wishlistCount})
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/cart")}
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#855D25]" />
                    <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B]">
                      ROYAL BAG &amp; CHECKOUT ({cartCount})
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                </button>

                <a
                  href="https://wa.me/918766667101?text=Hello%20Rajwadi%20Couture%2C%20I%20need%20assistance%20with%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer block"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-emerald-800">
                      ROYAL CONCIERGE (WHATSAPP)
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-emerald-800" />
                </a>

                <button
                  type="button"
                  onClick={() => handleNavigate("/admin/login")}
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#855D25]" />
                    <span className="font-semibold uppercase tracking-[0.16em] text-[#855D25] group-active:text-[#5A1F2B]">
                      STORE OWNER PORTAL
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C827A]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
