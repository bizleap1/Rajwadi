"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AccountPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  view?: "all" | "desktop" | "mobile";
}

export default function AccountPopover({
  isOpen,
  onClose,
  onOpenSignIn,
  onOpenSignUp,
  view = "all",
}: AccountPopoverProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout, loginWithGoogle } = useAuth();
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

  // Mobile background scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleClick = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    onClose();
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
          {/* Invisible backdrop to dismiss on clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          <div
            ref={popoverRef}
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-full mt-3 w-[340px] bg-[#FAF5EE] border border-[#E6DCB8] shadow-xl z-50 p-6 text-[#171717] animate-in fade-in zoom-in-95 duration-150"
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

            {/* DESKTOP: LOGGED OUT STATE */}
            {!isAuthenticated ? (
              <div className="space-y-4 text-center">
                <h2 className="font-serif text-lg tracking-[0.16em] uppercase text-[#171717] font-normal">
                  MY ACCOUNT
                </h2>

                <p className="font-serif italic text-xs text-[#6B635B] leading-relaxed px-2">
                  Sign in to manage your orders,<br />
                  wishlist and saved details.
                </p>

                <div className="pt-2 space-y-2.5">
                  {/* Genuine Google OAuth Button */}
                  <button
                    type="button"
                    onClick={handleGoogleClick}
                    className="w-full py-2.5 px-3 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-[11px] uppercase tracking-[0.18em] font-medium font-sans flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>CONTINUE WITH GOOGLE</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <span className="font-serif italic text-[11px] text-[#8C827A] block">
                    or
                  </span>

                  {/* Email Sign In */}
                  <button
                    type="button"
                    onClick={onOpenSignIn}
                    className="w-full py-2.5 px-3 bg-white hover:bg-[#FAF6F0] text-[#171717] border border-[#D8CCB8] text-[11px] uppercase tracking-[0.18em] font-medium font-sans transition-colors cursor-pointer"
                  >
                    SIGN IN
                  </button>
                </div>

                {/* Hairline Divider */}
                <div className="w-full h-[1px] bg-[#E6DCB8] my-4" />

                {/* Create Account Link */}
                <div className="text-xs font-sans">
                  <span className="text-[#8C827A] block mb-1">New to Rajwadi?</span>
                  <button
                    type="button"
                    onClick={onOpenSignUp}
                    className="text-[#5A1F2B] hover:text-[#855D25] uppercase tracking-wider font-semibold text-[11px] hover:underline transition-colors cursor-pointer"
                  >
                    CREATE ACCOUNT &rarr;
                  </button>
                </div>
              </div>
            ) : (
              /* DESKTOP: LOGGED IN STATE */
              <div className="text-left space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans block mb-0.5">
                    MY ACCOUNT
                  </span>
                  <h3 className="font-serif text-lg text-[#171717] font-normal tracking-wide">
                    Hello, {user?.name || "Patron"}
                  </h3>
                </div>

                {/* Hairline Divider */}
                <div className="w-full h-[1px] bg-[#E6DCB8]" />

                {/* Menu items */}
                <div className="space-y-3 font-sans text-xs">
                  {/* 1. ORDERS */}
                  <button
                    type="button"
                    onClick={() => handleNavigate("/account?tab=orders")}
                    className="w-full text-left group py-1 block cursor-pointer"
                  >
                    <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-[#5A1F2B] transition-colors">
                      ORDERS
                    </span>
                    <span className="text-[11px] text-[#6B635B] group-hover:text-[#855D25] transition-colors flex items-center justify-between">
                      <span>View your orders</span>
                      <span className="text-[10px]">&rarr;</span>
                    </span>
                  </button>

                  {/* 2. WISHLIST */}
                  <button
                    type="button"
                    onClick={() => handleNavigate("/wishlist")}
                    className="w-full text-left group py-1 block cursor-pointer"
                  >
                    <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-[#5A1F2B] transition-colors">
                      WISHLIST
                    </span>
                    <span className="text-[11px] text-[#6B635B] group-hover:text-[#855D25] transition-colors flex items-center justify-between">
                      <span>Saved Poshaks</span>
                      <span className="text-[10px]">&rarr;</span>
                    </span>
                  </button>

                  {/* 3. ACCOUNT DETAILS */}
                  <button
                    type="button"
                    onClick={() => handleNavigate("/account?tab=profile")}
                    className="w-full text-left group py-1 block cursor-pointer"
                  >
                    <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-[#5A1F2B] transition-colors">
                      ACCOUNT DETAILS
                    </span>
                    <span className="text-[11px] text-[#6B635B] group-hover:text-[#855D25] transition-colors flex items-center justify-between">
                      <span>Personal information</span>
                      <span className="text-[10px]">&rarr;</span>
                    </span>
                  </button>

                  {/* 4. ADDRESSES */}
                  <button
                    type="button"
                    onClick={() => handleNavigate("/account?tab=addresses")}
                    className="w-full text-left group py-1 block cursor-pointer"
                  >
                    <span className="font-semibold uppercase tracking-wider text-[#171717] block group-hover:text-[#5A1F2B] transition-colors">
                      ADDRESSES
                    </span>
                    <span className="text-[11px] text-[#6B635B] group-hover:text-[#855D25] transition-colors flex items-center justify-between">
                      <span>Manage addresses</span>
                      <span className="text-[10px]">&rarr;</span>
                    </span>
                  </button>
                </div>

                {/* Hairline Divider */}
                <div className="w-full h-[1px] bg-[#E6DCB8] pt-1" />

                {/* LOG OUT */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs uppercase tracking-wider font-semibold text-[#5A1F2B] hover:text-[#431520] transition-colors cursor-pointer"
                  >
                    LOG OUT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. MOBILE FULL-SCREEN ACCOUNT DRAWER / SCREEN                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showMobile && (
        <div
          role="dialog"
          aria-modal="true"
          className="sm:hidden fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col text-[#171717] w-full h-full min-h-[100dvh] overflow-hidden animate-in slide-in-from-right duration-200"
        >
          {!isAuthenticated ? (
            /* ── MOBILE: LOGGED OUT ── */
            <div className="flex flex-col h-full w-full bg-[#FDFBF7]">
              {/* Top Bar: Brand left, Close × right */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E6DCB8] bg-[#FAF5EE] flex-shrink-0">
                <span className="font-serif text-lg tracking-[0.2em] text-[#171717] uppercase font-light">
                  RAJWADI
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

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col justify-center max-w-sm mx-auto w-full text-center bg-[#FDFBF7]">
                <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.16em] uppercase text-[#171717] font-normal mb-2.5">
                  MY ACCOUNT
                </h2>

                <p className="font-serif italic text-xs sm:text-sm text-[#6B635B] leading-relaxed mb-8">
                  Sign in to manage your<br />orders, wishlist &amp; details
                </p>

                <div className="space-y-3.5 w-full">
                  {/* Continue with Google */}
                  <button
                    type="button"
                    onClick={handleGoogleClick}
                    className="w-full py-3.5 px-4 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>CONTINUE WITH GOOGLE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-serif italic text-xs text-[#8C827A] block py-0.5">
                    or
                  </span>

                  {/* Sign In button */}
                  <button
                    type="button"
                    onClick={onOpenSignIn}
                    className="w-full py-3.5 px-4 bg-white hover:bg-[#FAF6F0] text-[#171717] border border-[#D8CCB8] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors cursor-pointer"
                  >
                    SIGN IN
                  </button>
                </div>

                {/* Create Account link */}
                <div className="pt-8 mt-6 border-t border-[#E6DCB8] text-xs font-sans">
                  <span className="text-[#8C827A] block mb-1">New to Rajwadi?</span>
                  <button
                    type="button"
                    onClick={onOpenSignUp}
                    className="text-[#5A1F2B] uppercase tracking-wider font-semibold text-xs hover:underline transition-colors cursor-pointer"
                  >
                    CREATE ACCOUNT &rarr;
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── MOBILE: LOGGED IN (Clean Vertical List) ── */
            <div className="flex flex-col h-full w-full bg-[#FDFBF7]">
              {/* Top Bar: Title left, Close × right */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E6DCB8] bg-[#FAF5EE] flex-shrink-0">
                <span className="font-serif text-sm tracking-[0.2em] text-[#171717] uppercase font-normal">
                  MY ACCOUNT
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
                  <h3 className="font-serif text-2xl text-[#171717] font-normal tracking-wide">
                    Hello, {user?.name || "Patron"}
                  </h3>

                  {/* Hairline Divider */}
                  <div className="w-full h-[1px] bg-[#E6DCB8]" />

                  {/* Vertical Links */}
                  <div className="divide-y divide-[#E6DCB8]/60 font-sans text-xs">
                    <button
                      type="button"
                      onClick={() => handleNavigate("/account?tab=orders")}
                      className="w-full py-4.5 flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B]">
                        MY ORDERS
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate("/wishlist")}
                      className="w-full py-4.5 flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B]">
                        WISHLIST
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate("/account?tab=profile")}
                      className="w-full py-4.5 flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B]">
                        ACCOUNT DETAILS
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate("/account?tab=addresses")}
                      className="w-full py-4.5 flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span className="font-semibold uppercase tracking-[0.16em] text-[#171717] group-active:text-[#5A1F2B]">
                        SAVED ADDRESSES
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#8C827A] group-active:text-[#5A1F2B]" />
                    </button>
                  </div>

                  {/* Hairline Divider */}
                  <div className="w-full h-[1px] bg-[#E6DCB8]" />

                  {/* LOG OUT */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full py-3 text-center border border-[#5A1F2B]/30 text-[#5A1F2B] uppercase tracking-[0.2em] font-medium text-xs font-sans transition-colors cursor-pointer"
                    >
                      LOG OUT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
