"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchModal from "@/components/SearchModal";
import AccountPopover from "@/components/AccountPopover";
import AuthModal from "@/components/AuthModal";

interface NavbarProps {
  onOpenConsultation?: () => void;
  solidOnTop?: boolean;
}

type AccountOverlayState = "none" | "popover" | "signin" | "signup";

export default function Navbar({
  onOpenConsultation,
  solidOnTop = false,
}: NavbarProps) {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [accountOverlay, setAccountOverlay] = useState<AccountOverlayState>("none");

  const isScrolled = !isAtTop;
  const lastScrollY = useRef(0);

  // Active theme style: when scrolled, when mobile menu is open, or when solidOnTop is requested (e.g. on PDP)
  const useSolidStyle = solidOnTop || isScrolled || isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);

      // 1. At the very top of the homepage: transparent hero navbar, always visible
      if (currentScrollY <= 30) {
        setIsAtTop(true);
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      setIsAtTop(false);

      // If mobile menu, search drawer, or account overlay is active, keep navbar in place
      if (isMobileMenuOpen || isSearchOpen || accountOverlay !== "none") {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // 2. Ignore micro-scrolls to prevent jitter (< 8px delta)
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < 8) {
        return;
      }

      // 3. Directional scroll behavior:
      // Scrolling DOWN -> hide navbar completely
      // Scrolling UP -> reveal navbar smoothly
      if (delta > 0) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen, isSearchOpen, accountOverlay]);

  return (
    <>
      {/* Main Luxury Header: Present when needed, invisible during immersive content consumption */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out border-none ${
          isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
        } ${
          !useSolidStyle
            ? "bg-gradient-to-b from-charcoal/60 via-charcoal/20 to-transparent py-4 md:py-4.5"
            : "bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E6DCB8]/70 shadow-[0_2px_15px_rgba(23,23,23,0.05)] py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-12 flex items-center justify-between lg:grid lg:grid-cols-3">
          {/* Left Navigation: Collection, Our Heritage, Contact */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs tracking-[0.24em] xl:tracking-[0.28em] uppercase font-medium whitespace-nowrap">
            {[
              { name: "Collection", href: "/collection" },
              { name: "Our Heritage", href: "/our-heritage" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  useSolidStyle ? "text-charcoal" : "text-royal-ivory"
                } hover:text-[#C6A15B] transition-colors duration-300 relative group py-1.5 whitespace-nowrap`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#C6A15B] transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Trigger (Mobile only) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
              className={`${
                useSolidStyle ? "text-charcoal" : "text-royal-ivory"
              } hover:text-[#C6A15B] transition-colors duration-300 p-1.5 -ml-1`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.35]" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.35]" />
              )}
            </button>
          </div>

          {/* Center Brand Logo (Clean, Proportioned & Readable on all screens) */}
          <div className="flex justify-center items-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-3.5 lg:gap-4 flex-shrink-0">
              <div className="relative w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[64px] lg:h-[64px] flex-shrink-0">
                <Image
                  src="/logo without bg.png"
                  alt="Rajwadi Rajputi Poshak Royal Logo"
                  fill
                  priority
                  sizes="(max-width: 640px) 36px, (max-width: 1024px) 56px, 64px"
                  className={`object-contain transition-all ${
                    useSolidStyle ? "" : "filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  }`}
                />
              </div>
              <div className="flex flex-col text-left justify-center select-none">
                <span className={`font-serif text-[18px] min-[375px]:text-[20px] sm:text-[24px] lg:text-[32px] tracking-[0.2em] ${
                  useSolidStyle ? "text-charcoal" : "text-royal-ivory drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
                } font-light leading-none transition-colors duration-300`}>
                  RAJWADI
                </span>
                <span className={`text-[7px] min-[375px]:text-[8px] sm:text-[9.5px] lg:text-[11px] uppercase tracking-[0.26em] min-[375px]:tracking-[0.3em] font-medium mt-0.5 sm:mt-1 transition-colors duration-300 leading-normal whitespace-nowrap ${
                  useSolidStyle
                    ? "text-[#855D25]"
                    : "text-[#F8F1E7]/95 drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)]"
                }`}>
                  RAJPUTI POSHAK
                </span>
              </div>
            </Link>
          </div>

          {/* Right Navigation: Wishlist | Bag on mobile; Search | Wishlist | Bag | Account on desktop */}
          <div className="flex items-center justify-end space-x-2.5 min-[375px]:space-x-3 sm:space-x-5 lg:space-x-6 xl:space-x-7">
            {/* 1. Search Icon (Accessible on all screens) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className={`${
                useSolidStyle ? "text-charcoal" : "text-royal-ivory"
              } hover:text-[#C6A15B] transition-colors duration-300 p-1.5 cursor-pointer`}
            >
              <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.35]" />
            </button>

            {/* 2. Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label={wishlistCount > 0 ? `Wishlist (${wishlistCount} pieces)` : "Wishlist"}
              className={`${
                useSolidStyle ? "text-charcoal" : "text-royal-ivory"
              } hover:text-[#C6A15B] transition-colors duration-300 p-1.5 relative`}
            >
              <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.35]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#5A1F2B] text-royal-ivory text-[9px] flex items-center justify-center font-sans font-semibold border border-antique-gold/60">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* 3. Shopping Bag Icon */}
            <Link
              href="/cart"
              aria-label={cartCount > 0 ? `Shopping Bag (${cartCount} items)` : "Shopping Bag"}
              className={`${
                useSolidStyle ? "text-charcoal" : "text-royal-ivory"
              } hover:text-[#C6A15B] transition-colors duration-300 p-1.5 relative`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.35]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#5A1F2B] text-royal-ivory text-[9px] flex items-center justify-center font-sans font-semibold border border-antique-gold/60">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 4. Account Icon (Accessible on desktop & mobile) */}
            <div className="relative">
              <button
                onClick={() =>
                  setAccountOverlay((prev) => (prev === "popover" ? "none" : "popover"))
                }
                aria-label="Account"
                className={`${
                  useSolidStyle ? "text-charcoal" : "text-royal-ivory"
                } hover:text-[#C6A15B] transition-colors duration-300 p-1.5 cursor-pointer flex items-center justify-center`}
              >
                <User className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.35]" />
              </button>

              {/* Desktop Popover (Only on desktop, anchored below User button) */}
              <AccountPopover
                isOpen={accountOverlay === "popover"}
                onClose={() => setAccountOverlay("none")}
                onOpenSignIn={() => setAccountOverlay("signin")}
                onOpenSignUp={() => setAccountOverlay("signup")}
                view="desktop"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Account Drawer (Fixed to Viewport, Outside Transformed Header) */}
      <AccountPopover
        isOpen={accountOverlay === "popover"}
        onClose={() => setAccountOverlay("none")}
        onOpenSignIn={() => setAccountOverlay("signin")}
        onOpenSignUp={() => setAccountOverlay("signup")}
        view="mobile"
      />

      {/* Global Luxury Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Auth Modal: Sign In & Create Account (Mutually exclusive with Popover) */}
      <AuthModal
        isOpen={accountOverlay === "signin" || accountOverlay === "signup"}
        onClose={() => setAccountOverlay("none")}
        mode={accountOverlay === "signup" ? "signup" : "signin"}
        onSwitchMode={(nextMode) => setAccountOverlay(nextMode)}
        onBack={() => setAccountOverlay("popover")}
      />

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-[56px] sm:top-[64px] left-0 w-full z-40 bg-royal-ivory border-b border-antique-gold/30 px-6 py-7 shadow-2xl max-h-[calc(100dvh-64px)] overflow-y-auto"
          >
            <div className="flex flex-col space-y-5 text-center">
              {/* Quick Search Button on Mobile */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-sm border border-charcoal/15 bg-soft-beige/50 text-charcoal/70 text-xs tracking-wider uppercase hover:border-antique-gold transition-colors"
              >
                <span>Search collections...</span>
                <Search className="w-4 h-4 text-charcoal/50" />
              </button>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-4 py-2">
                {[
                  { name: "Collection", href: "/collection" },
                  {
                    name: wishlistCount > 0 ? `Wishlist (${wishlistCount})` : "Wishlist",
                    href: "/wishlist",
                  },
                  { name: "Our Heritage", href: "/our-heritage" },
                  { name: "Contact", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-2xl text-charcoal hover:text-[#C6A15B] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Actions: Book Consultation + Account */}
              <div className="pt-4 border-t border-soft-beige flex flex-col items-center gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenConsultation?.();
                  }}
                  className="w-full py-3 bg-heritage-maroon text-royal-ivory text-xs uppercase tracking-widest hover:bg-[#431520] transition-colors shadow-sm"
                >
                  Book Royal Consultation
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAccountOverlay("popover");
                  }}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-charcoal/70 hover:text-charcoal pt-1 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>My Account</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
