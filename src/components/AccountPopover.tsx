"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ArrowRight,
  Package,
  Heart,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  LogOut,
  User,
  MapPin,
  Lock,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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

  const handleAuthAction = (mode: "signin" | "signup") => {
    onClose();
    openAuthModal(mode);
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
              {/* Header */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6D1A2A] text-white flex items-center justify-center font-serif text-sm font-semibold tracking-wider">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "PA"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block">
                      PATRON MEMBER
                    </span>
                    <h3 className="font-serif text-base text-[#171717] truncate font-medium">
                      {user.name || "Royal Patron"}
                    </h3>
                    <p className="text-[11px] text-[#6B635B] truncate font-sans">
                      {user.phone ? `+91 ${user.phone}` : user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block mb-0.5">
                    PATRON SERVICES
                  </span>
                  <h3 className="font-serif text-xl text-[#171717] font-normal tracking-wide flex items-center gap-2">
                    <span>Welcome to Rajwadi</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                  </h3>
                  <p className="font-serif italic text-xs text-[#6B635B] mt-0.5">
                    Sign in to access your orders, saved pieces and bespoke atelier services.
                  </p>
                </div>
              )}

              {/* Unauthenticated Quick Action Buttons */}
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAuthAction("signin")}
                    className="py-2.5 px-3 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAuthAction("signup")}
                    className="py-2.5 px-3 bg-white hover:bg-[#F3EBE1] border border-[#D9C4B0] text-[#171717] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <UserPlus className="w-3 h-3 text-[#855D25]" />
                    <span>Register</span>
                  </button>
                </div>
              )}

              {/* Hairline Divider */}
              <div className="w-full h-[1px] bg-[#E6DCB8]" />

              {/* Menu items */}
              <div className="space-y-1 font-sans text-xs">
                {/* 1. My Orders */}
                <button
                  type="button"
                  onClick={() => handleNavigate("/account?tab=orders")}
                  className="w-full text-left group py-2 px-2.5 hover:bg-white/70 rounded-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-[#855D25]" />
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-[#5A1F2B] transition-colors">
                        My Orders
                      </span>
                      <span className="text-[11px] text-[#6B635B]">Order status &amp; tax receipts</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#8C827A] group-hover:text-[#5A1F2B]">&rarr;</span>
                </button>

                {/* 2. Addresses (only if logged in) */}
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => handleNavigate("/account?tab=addresses")}
                    className="w-full text-left group py-2 px-2.5 hover:bg-white/70 rounded-xs transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#855D25]" />
                      <div>
                        <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-[#5A1F2B] transition-colors">
                          Delivery Addresses
                        </span>
                        <span className="text-[11px] text-[#6B635B]">Saved shipping destinations</span>
                      </div>
                    </div>
                    <span className="text-xs text-[#8C827A] group-hover:text-[#5A1F2B]">&rarr;</span>
                  </button>
                )}

                {/* 3. Wishlist */}
                <button
                  type="button"
                  onClick={() => handleNavigate("/wishlist")}
                  className="w-full text-left group py-2 px-2.5 hover:bg-white/70 rounded-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
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

                {/* 4. Shopping Bag */}
                <button
                  type="button"
                  onClick={() => handleNavigate("/cart")}
                  className="w-full text-left group py-2 px-2.5 hover:bg-white/70 rounded-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
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

                {/* 5. WhatsApp Concierge */}
                <a
                  href="https://wa.me/918766667101?text=Hello%20Rajwadi%20Couture%2C%20I%20need%20assistance%20with%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left group py-2 px-2.5 hover:bg-white/70 rounded-xs transition-colors flex items-center justify-between block cursor-pointer"
                >
                  <div className="flex items-center gap-3">
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

              {/* Logout Button (if logged in) */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-[#E6DCB8]">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      logout();
                    }}
                    className="w-full py-2 px-2.5 text-left text-xs uppercase tracking-wider font-semibold text-red-700 hover:bg-red-50 rounded-xs transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-700" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
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
              {/* Header */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3.5 pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#6D1A2A] text-white flex items-center justify-center font-serif text-base font-semibold tracking-wider">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "PA"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans block">
                      PATRON MEMBER
                    </span>
                    <h3 className="font-serif text-xl text-[#171717] truncate font-medium">
                      {user.name || "Royal Patron"}
                    </h3>
                    <p className="text-xs text-[#6B635B] truncate font-sans">
                      {user.phone ? `+91 ${user.phone}` : user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans block mb-1">
                      PATRON SERVICES
                    </span>
                    <h3 className="font-serif text-2xl text-[#171717] font-normal tracking-wide">
                      Welcome to Rajwadi
                    </h3>
                    <p className="font-serif italic text-xs text-[#6B635B] mt-1">
                      Sign in with your mobile number or email to access your royal orders and saved pieces.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAuthAction("signin")}
                      className="py-3 px-4 bg-[#6D1A2A] active:bg-[#581522] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAuthAction("signup")}
                      className="py-3 px-4 bg-white active:bg-[#F3EBE1] border border-[#D9C4B0] text-[#171717] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#855D25]" />
                      <span>Register</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Hairline Divider */}
              <div className="w-full h-[1px] bg-[#E6DCB8]" />

              {/* Vertical Links */}
              <div className="divide-y divide-[#E6DCB8]/60 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => handleNavigate("/account?tab=orders")}
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <Package className="w-4 h-4 text-[#855D25]" />
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B] block">
                        MY ORDERS &amp; RECEIPTS
                      </span>
                      <span className="text-[11px] text-[#6B635B]">View past orders &amp; status</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => handleNavigate("/account?tab=addresses")}
                    className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <MapPin className="w-4 h-4 text-[#855D25]" />
                      <div>
                        <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B] block">
                          DELIVERY ADDRESSES
                        </span>
                        <span className="text-[11px] text-[#6B635B]">Saved shipping locations</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleNavigate("/wishlist")}
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <Heart className="w-4 h-4 text-[#855D25]" />
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B] block">
                        SAVED POSHAKS ({wishlistCount})
                      </span>
                      <span className="text-[11px] text-[#6B635B]">Your selected collection</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/cart")}
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <ShoppingBag className="w-4 h-4 text-[#855D25]" />
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B] block">
                        ROYAL BAG &amp; CHECKOUT ({cartCount})
                      </span>
                      <span className="text-[11px] text-[#6B635B]">Items ready for purchase</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                </button>

                <a
                  href="https://wa.me/918766667101?text=Hello%20Rajwadi%20Couture%2C%20I%20need%20assistance%20with%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer block"
                >
                  <div className="flex items-center gap-3.5">
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-emerald-800 block">
                        ROYAL CONCIERGE (WHATSAPP)
                      </span>
                      <span className="text-[11px] text-[#6B635B]">Live expert sizing &amp; guidance</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-emerald-800" />
                </a>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      logout();
                    }}
                    className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <LogOut className="w-4 h-4 text-red-700" />
                      <div>
                        <span className="font-semibold uppercase tracking-[0.16em] text-red-700 block">
                          SIGN OUT
                        </span>
                        <span className="text-[11px] text-[#8A796B]">End active patron session</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-red-700" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
