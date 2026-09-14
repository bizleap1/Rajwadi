"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenConsultation?: () => void;
}

export default function Navbar({ onOpenConsultation }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Luxury Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-none ${isScrolled
            ? "bg-royal-ivory/95 backdrop-blur-md shadow-[0_4px_25px_rgba(23,23,23,0.05)] py-3"
            : "bg-gradient-to-b from-charcoal/60 via-charcoal/20 to-transparent py-4 md:py-4.5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-12 flex items-center justify-between lg:grid lg:grid-cols-3">
          {/* Left Navigation: Collections, Our Story, Contact */}
          <nav className="hidden lg:flex items-center space-x-7 xl:space-x-9 text-xs tracking-[0.25em] uppercase font-medium whitespace-nowrap">
            {[
              { name: "Collections", href: "#collections" },
              { name: "Our Story", href: "#story" },
              { name: "Contact", href: "#contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isScrolled ? "text-charcoal" : "text-royal-ivory"
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
                isScrolled ? "text-charcoal" : "text-royal-ivory"
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
                  className="object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                />
              </div>
              <div className="flex flex-col text-left justify-center select-none">
                <span className={`font-serif text-[18px] min-[375px]:text-[20px] sm:text-[24px] lg:text-[32px] tracking-[0.2em] ${
                  isScrolled ? "text-charcoal" : "text-royal-ivory"
                } font-light leading-none transition-colors duration-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]`}>
                  RAJWADI
                </span>
                <span className={`text-[7px] min-[375px]:text-[8px] sm:text-[9.5px] lg:text-[11px] uppercase tracking-[0.26em] min-[375px]:tracking-[0.3em] font-medium mt-0.5 sm:mt-1 transition-colors duration-300 leading-normal whitespace-nowrap ${
                  isScrolled
                    ? "text-[#855D25]"
                    : "text-[#F8F1E7]/95 drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)]"
                }`}>
                  RAJPUTI POSHAK
                </span>
              </div>
            </Link>
          </div>

          {/* Right Navigation: Search | Wishlist | Bag (compact & touch-friendly) */}
          <div className="flex items-center justify-end space-x-2.5 min-[375px]:space-x-3 sm:space-x-5 lg:space-x-6 xl:space-x-7">
            {/* 1. Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className={`${
                isScrolled ? "text-charcoal" : "text-royal-ivory"
              } hover:text-[#C6A15B] transition-colors duration-300 p-1.5`}
            >
              <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.35]" />
            </button>

            {/* 2. Wishlist Icon */}
            <Link
              href="#featured"
              aria-label="Wishlist"
              className={`${
                isScrolled ? "text-charcoal" : "text-royal-ivory"
              } hover:text-[#C6A15B] transition-colors duration-300 p-1.5`}
            >
              <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.35]" />
            </Link>

            {/* 3. Shopping Bag Icon */}
            <Link
              href="#featured"
              aria-label="Shopping Bag"
              className={`${
                isScrolled ? "text-charcoal" : "text-royal-ivory"
              } hover:text-[#C6A15B] transition-colors duration-300 p-1.5 relative`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.35]" />
              {cartCount > 0 && (
                <span className="absolute 0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-antique-gold text-charcoal text-[9px] flex items-center justify-center font-sans font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 4. Account Icon (Desktop & Tablet) */}
            <button
              onClick={onOpenConsultation}
              aria-label="Account"
              className={`hidden sm:block ${
                isScrolled ? "text-charcoal" : "text-royal-ivory"
              } hover:text-[#C6A15B] transition-colors duration-300 p-1.5`}
            >
              <User className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.35]" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Drawer Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-royal-ivory border border-antique-gold/40 p-8 w-full max-w-2xl shadow-2xl relative"
            >
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-5 right-5 text-charcoal hover:text-heritage-maroon"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-serif text-2xl text-heritage-maroon mb-2">
                Search Rajputi Poshaks
              </h3>
              <p className="text-xs text-charcoal/60 mb-6 uppercase tracking-wider">
                Discover bridal, festive, or handcrafted pure poshak creations
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Bridal Poshak, Gota Patti, Georgette..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-charcoal/30 py-3 pr-10 text-charcoal text-base focus:outline-none focus:border-heritage-maroon placeholder:text-charcoal/40"
                  autoFocus
                />
                <Search className="w-5 h-5 text-charcoal/50 absolute right-2 top-3" />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-xs text-charcoal/60 self-center mr-2">
                  Popular:
                </span>
                {["Bridal Poshak", "Hand Gota Patti", "Pure Georgette", "Festive Rani Pink"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="text-xs px-3 py-1 bg-soft-beige/50 text-charcoal hover:bg-heritage-maroon hover:text-royal-ivory transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-royal-ivory border-b border-antique-gold/30 px-6 py-8 shadow-xl"
          >
            <div className="flex flex-col space-y-6 text-center">
              {[
                { name: "Collections", href: "#collections" },
                { name: "Our Story", href: "#story" },
                { name: "Contact", href: "#contact" },
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

              <div className="pt-4 border-t border-soft-beige flex justify-center">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenConsultation?.();
                  }}
                  className="px-6 py-2.5 bg-heritage-maroon text-royal-ivory text-xs uppercase tracking-widest"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
