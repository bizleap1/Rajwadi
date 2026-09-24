"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import {
  REAL_POSHAKS,
  PoshakProduct,
  getPoshakDisplayName,
  getCategoryEyebrow,
} from "@/data/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRefDesktop = useRef<HTMLInputElement>(null);
  const inputRefMobile = useRef<HTMLInputElement>(null);

  // 1. Bulletproof Scroll Lock & Scroll Position Restoration
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    // Auto-focus search input with small delay for animation readiness
    const timer = setTimeout(() => {
      if (window.innerWidth >= 640) {
        inputRefDesktop.current?.focus();
      } else {
        inputRefMobile.current?.focus();
      }
    }, 60);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // 2. Escape Key to Close
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

  // 3. Reset query when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  // 4. Real-time Product Search Matching (Name, Color, Category, Type, Style/Craft)
  const filteredResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    const terms = cleanQuery.split(/\s+/).filter(Boolean);

    return REAL_POSHAKS.filter((product: PoshakProduct) => {
      const name = product.name.toLowerCase();
      const category = (product.category || "").toLowerCase();
      const type = (product.type || "").toLowerCase();
      const subCategory = (product.subCategory || "").toLowerCase();
      const color = (product.color || "").toLowerCase();
      const craft = (product.craft || "").toLowerCase();

      // Ensure all terms match at least one relevant attribute
      return terms.every(
        (term) =>
          name.includes(term) ||
          category.includes(term) ||
          type.includes(term) ||
          (term === "material" && type === "unstitched") ||
          subCategory.includes(term) ||
          color.includes(term) ||
          craft.includes(term)
      );
    });
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (productId: string) => {
    onClose();
    router.push(`/product/${productId}`);
  };

  const handleSelectCategory = (cat: string) => {
    setQuery(cat);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
  };

  const handleExploreCollection = () => {
    onClose();
    router.push("/collection");
  };

  const handleViewAllResults = () => {
    onClose();
    router.push(`/collection?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-200">
      {/* ── DESKTOP OVERLAY (Warm Cream Box with Blurred/Darkened Backdrop) ── */}
      <div className="hidden sm:flex fixed inset-0 bg-black/40 backdrop-blur-xs items-start justify-center pt-16 sm:pt-20 lg:pt-24 px-4">
        {/* Backdrop Click Dismiss */}
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window */}
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-2xl lg:max-w-3xl bg-[#FAF5EE] border border-[#E6DCB8] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200"
        >
          {/* Top Bar inside modal */}
          <div className="px-6 sm:px-8 py-4 flex items-center justify-between border-b border-[#E6DCB8]">
            <span className="font-serif text-xs tracking-[0.24em] text-[#855D25] uppercase select-none">
              RAJWADI
            </span>

            <div className="flex items-center gap-4">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#8C827A] select-none">
                SEARCH
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="text-[#171717]/70 hover:text-[#5A1F2B] transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-10 space-y-6 max-h-[calc(85vh-80px)] overflow-y-auto overscroll-contain">
            {/* Serif Heading */}
            <div className="text-center">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal tracking-wide uppercase">
                SEARCH RAJWADI
              </h2>
            </div>

            {/* Search Input with Thin Burgundy Bottom Border */}
            <div className="relative max-w-xl mx-auto pt-2">
              <input
                ref={inputRefDesktop}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a Poshak, colour or style..."
                className="w-full bg-transparent border-b border-[#5A1F2B] pb-2.5 pr-10 text-base sm:text-lg text-[#171717] placeholder:text-[#8C827A]/75 focus:outline-none font-sans"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear input"
                  className="absolute right-1 bottom-3 text-[#8C827A] hover:text-[#5A1F2B] p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <Search className="w-4 h-4 text-[#5A1F2B] absolute right-2 bottom-3 pointer-events-none" />
              )}
            </div>

            {/* INITIAL STATE: TRENDING & CATEGORIES */}
            {!query.trim() && (
              <div className="pt-4 max-w-xl mx-auto space-y-6">
                {/* Trending */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans mb-3">
                    TRENDING
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {["Gulabi Mor", "Pista", "Rajsi"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleTrendingClick(term)}
                        className="px-3.5 py-1.5 bg-white/70 hover:bg-[#5A1F2B] hover:text-[#FAF6F0] border border-[#E6DCB8] text-xs font-sans text-[#171717] transition-all cursor-pointer shadow-2xs"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans mb-2.5">
                    CATEGORIES & TYPES
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-[#171717]/85">
                    {["Bridal", "Everyday", "Festive", "Jewellery"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className="text-[#855D25] hover:text-[#5A1F2B] hover:underline underline-offset-4 transition-colors cursor-pointer font-medium"
                      >
                        {cat}
                      </button>
                    ))}
                    <span className="text-[#8C827A]">·</span>
                    {["Stitched", "Poshak Material"].map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSelectCategory(sub)}
                        className="hover:text-[#5A1F2B] hover:underline underline-offset-4 transition-colors cursor-pointer"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS STATE */}
            {query.trim() && filteredResults.length > 0 && (
              <div className="pt-2 max-w-xl mx-auto space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E6DCB8]">
                  <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans">
                    SEARCH RESULTS FOR “{query.toUpperCase()}”
                  </h3>
                  <span className="text-[11px] font-sans text-[#8C827A]">
                    {filteredResults.length} {filteredResults.length === 1 ? "piece" : "pieces"}
                  </span>
                </div>

                {/* Compact Results List */}
                <div className="divide-y divide-[#E6DCB8]/60 max-h-[320px] overflow-y-auto overscroll-contain pr-1">
                  {filteredResults.slice(0, 5).map((item) => {
                    const isItemSoldOut = Boolean(
                      item.soldOut ||
                        item.price === "Sold Out" ||
                        (typeof item.price === "string" &&
                          item.price.toLowerCase().includes("sold"))
                    );

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectProduct(item.id)}
                        className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-white/50 px-2 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* 3:4 Thumbnail */}
                          <div className="relative w-12 aspect-[3/4] flex-shrink-0 bg-[#F4ECE1] border border-[#E6DCB8]/60 overflow-hidden shadow-2xs">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="50px"
                              style={{
                                objectPosition: item.imagePosition || "center 5%",
                              }}
                              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                                isItemSoldOut ? "grayscale-[15%]" : ""
                              }`}
                            />
                            {isItemSoldOut && (
                              <div className="absolute inset-x-0 bottom-0 bg-[#4A1520]/95 text-white text-[7.5px] uppercase font-bold tracking-wider text-center py-0.5">
                                Sold Out
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="min-w-0">
                            <h4 className="font-serif text-sm text-[#171717] group-hover:text-[#5A1F2B] font-normal leading-snug line-clamp-1 transition-colors">
                              {getPoshakDisplayName(item)}
                            </h4>
                            <span className="text-[10px] uppercase tracking-wider text-[#8C827A] block mt-0.5">
                              {getCategoryEyebrow(item)}
                            </span>
                          </div>
                        </div>

                        {/* Price / Enquiry */}
                        {isItemSoldOut ? (
                          <span className="font-sans font-bold text-xs text-[#8B263E] uppercase tracking-wider flex-shrink-0">
                            Sold Out
                          </span>
                        ) : (item.category || "").toUpperCase() === "JEWELLERY" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#2E5A36] font-medium font-sans flex-shrink-0">
                            <MessageCircle className="w-3.5 h-3.5 stroke-[1.8]" />
                            <span>Enquire</span>
                          </span>
                        ) : (
                          <span className="font-sans font-medium text-xs text-[#171717] flex-shrink-0">
                            {item.price}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* View All Results Action */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleViewAllResults}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium font-sans text-[#5A1F2B] hover:text-[#855D25] transition-colors cursor-pointer"
                  >
                    <span>VIEW ALL RESULTS ({filteredResults.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* NO RESULTS STATE */}
            {query.trim() && filteredResults.length === 0 && (
              <div className="py-8 text-center max-w-md mx-auto">
                <h3 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal tracking-wide uppercase mb-2">
                  NO POSHAKS FOUND
                </h3>
                <p className="font-serif italic text-xs sm:text-sm text-[#6B635B] mb-6 leading-relaxed">
                  We couldn&apos;t find a Poshak matching<br />
                  <span className="font-sans not-italic font-semibold text-[#5A1F2B]">
                    &ldquo;{query}&rdquo;
                  </span>
                </p>

                <button
                  type="button"
                  onClick={handleExploreCollection}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium font-sans text-[#FAF6F0] bg-[#5A1F2B] hover:bg-[#855D25] py-3 px-6 transition-colors shadow-xs cursor-pointer"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FULL-SCREEN SEARCH INTERFACE (Single-column, Clean & Fast) ── */}
      <div
        role="dialog"
        aria-modal="true"
        className="sm:hidden fixed inset-0 bg-[#FDFBF7] flex flex-col z-50 text-[#171717]"
      >
        {/* Top Navigation Bar: ← SEARCH × */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E6DCB8] bg-[#FAF5EE]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="p-1.5 -ml-1.5 text-[#171717] hover:text-[#5A1F2B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
          </button>

          <span className="font-serif text-sm font-normal tracking-[0.2em] text-[#171717] uppercase">
            SEARCH
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 -mr-1.5 text-[#171717] hover:text-[#5A1F2B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="px-4 pt-4 pb-3 border-b border-[#E6DCB8]/60 bg-[#FAF5EE]/60">
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-[#D8CCB8]">
            <Search className="w-4 h-4 text-[#855D25] flex-shrink-0" />
            <input
              ref={inputRefMobile}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Poshaks, colours..."
              className="w-full bg-transparent text-xs text-[#171717] placeholder:text-[#8C827A] focus:outline-none font-sans"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear query"
                className="p-0.5 text-[#8C827A] hover:text-[#5A1F2B] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* MOBILE INITIAL STATE */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Trending */}
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans mb-3">
                  TRENDING
                </h3>
                <div className="space-y-2 font-serif text-base text-[#171717]">
                  {["Gulabi", "Pista", "Rajsi"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleTrendingClick(term)}
                      className="block w-full text-left py-1.5 hover:text-[#5A1F2B] transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-[1px] bg-[#E6DCB8]/60" />

              {/* Explore by Category */}
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans mb-3">
                  EXPLORE BY CATEGORY & TYPE
                </h3>
                <div className="space-y-2 font-serif text-base text-[#171717]">
                  {["Bridal", "Everyday", "Festive", "Jewellery"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className="block w-full text-left py-1 hover:text-[#5A1F2B] transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                  <div className="pt-2 pl-3 border-l-2 border-[#855D25]/30 space-y-1">
                    <span className="text-[9.5px] uppercase tracking-[0.2em] text-[#855D25] font-semibold block font-sans">
                      Product Types
                    </span>
                    {["Stitched", "Poshak Material"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleSelectCategory(type)}
                        className="block w-full text-left py-0.5 text-sm text-[#5A1F2B] hover:text-[#855D25] transition-colors cursor-pointer"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MOBILE SEARCH RESULTS */}
          {query.trim() && filteredResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6DCB8]">
                <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans">
                  SEARCH RESULTS
                </h3>
                <span className="text-[10.5px] font-sans text-[#8C827A]">
                  {filteredResults.length} {filteredResults.length === 1 ? "Product" : "Products"}
                </span>
              </div>

              {/* Compact List */}
              <div className="divide-y divide-[#E6DCB8]/60">
                {filteredResults.map((item) => {
                  const isItemSoldOut = Boolean(
                    item.soldOut ||
                      item.price === "Sold Out" ||
                      (typeof item.price === "string" &&
                        item.price.toLowerCase().includes("sold"))
                  );

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectProduct(item.id)}
                      className="py-3 flex items-center gap-3.5 active:bg-[#FAF5EE] cursor-pointer"
                    >
                      {/* Small Image Thumbnail */}
                      <div className="relative w-12 aspect-[3/4] flex-shrink-0 bg-[#F4ECE1] border border-[#E6DCB8]/60 overflow-hidden shadow-2xs">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="50px"
                          style={{
                            objectPosition: item.imagePosition || "center 5%",
                          }}
                          className={`object-cover ${isItemSoldOut ? "grayscale-[15%]" : ""}`}
                        />
                        {isItemSoldOut && (
                          <div className="absolute inset-x-0 bottom-0 bg-[#4A1520]/95 text-white text-[7.5px] uppercase font-bold tracking-wider text-center py-0.5">
                            Sold Out
                          </div>
                        )}
                      </div>

                      {/* Product Meta */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm text-[#171717] font-normal leading-snug line-clamp-1">
                          {getPoshakDisplayName(item)}
                        </h4>
                        <span className="text-[10px] uppercase tracking-wider text-[#8C827A] block mt-0.5">
                          {getCategoryEyebrow(item)}
                        </span>
                        {isItemSoldOut ? (
                          <span className="font-sans font-bold text-xs text-[#8B263E] uppercase tracking-wider block mt-0.5">
                            Sold Out
                          </span>
                        ) : (item.category || "").toUpperCase() === "JEWELLERY" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#2E5A36] font-medium font-sans mt-0.5">
                            <MessageCircle className="w-3 h-3 stroke-[1.8]" />
                            <span>Enquire on WhatsApp</span>
                          </span>
                        ) : (
                          <span className="font-sans font-medium text-xs text-[#171717] block mt-0.5">
                            {item.price}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All Results Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleViewAllResults}
                  className="w-full py-3 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>VIEW ALL RESULTS ({filteredResults.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* MOBILE NO RESULTS */}
          {query.trim() && filteredResults.length === 0 && (
            <div className="py-12 text-center">
              <h3 className="font-serif text-xl text-[#171717] font-normal tracking-wide uppercase mb-2">
                NO POSHAKS FOUND
              </h3>
              <p className="font-serif italic text-xs text-[#6B635B] mb-6 leading-relaxed">
                We couldn&apos;t find a Poshak matching<br />
                <span className="font-sans not-italic font-semibold text-[#5A1F2B]">
                  &ldquo;{query}&rdquo;
                </span>
              </p>

              <button
                type="button"
                onClick={handleExploreCollection}
                className="w-full py-3.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
