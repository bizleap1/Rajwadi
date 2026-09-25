"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowLeft, ArrowRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const inputRefDesktop = useRef<HTMLInputElement>(null);
  const inputRefMobile = useRef<HTMLInputElement>(null);

  // Fetch all published products for instant client search
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/products", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => setProducts(data.products || []))
      .catch((e) => console.warn("SearchModal fetch error:", e));
  }, [isOpen]);

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
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
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

  // 4. Real-time Product Search Matching
  const filteredResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    const terms = cleanQuery.split(/\s+/).filter(Boolean);

    return products.filter((product: any) => {
      const name = (product.name || "").toLowerCase();
      const category = (product.category || "").toLowerCase();
      const color = (product.color || "").toLowerCase();
      const craft = (product.craft || "").toLowerCase();
      const fabric = (product.fabric || "").toLowerCase();

      return terms.every(
        (term) =>
          name.includes(term) ||
          category.includes(term) ||
          color.includes(term) ||
          craft.includes(term) ||
          fabric.includes(term)
      );
    });
  }, [query, products]);

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
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex flex-col justify-start"
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
    >
      {/* Background Click Barrier */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Search Panel Container */}
      <div className="relative w-full bg-[#FAF5EE] border-b border-[#EBD9C8] shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[82vh] transition-all duration-300 ease-out animate-in slide-in-from-top-4">
        {/* --- Top Search Bar Container --- */}
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col gap-2">
          {/* Top Row: Back/Close & Title for Mobile */}
          <div className="flex sm:hidden items-center justify-between pb-2 border-b border-[#EBD9C8]">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#8A796B] font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="font-serif italic text-xs text-[#171717]">
              Search Collection
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#4A3E37]"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center w-full">
            <Search className="w-5 h-5 absolute left-3.5 text-[#855D25] pointer-events-none" />
            <input
              ref={inputRefDesktop}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by poshak, color, gota work, or craft..."
              className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-white border border-[#D9C4B0] focus:border-[#855D25] text-sm sm:text-base text-[#171717] placeholder:text-[#A09285] rounded-none sm:rounded-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] transition-all shadow-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 p-1 text-[#8A796B] hover:text-[#171717]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* --- Search Results & Discovery Section --- */}
        <div className="overflow-y-auto flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 pb-6">
          {query.trim() ? (
            /* Results Available */
            filteredResults.length > 0 ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs text-[#8A796B] border-b border-[#EBD9C8] pb-2">
                  <span>
                    Found {filteredResults.length} {filteredResults.length === 1 ? "poshak" : "poshaks"}
                  </span>
                  <button
                    onClick={handleViewAllResults}
                    className="text-[#6D1A2A] hover:underline font-medium flex items-center gap-1"
                  >
                    <span>View in Full Collection</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {filteredResults.slice(0, 8).map((product) => (
                    <div
                      key={product.id || product.slug}
                      onClick={() => handleSelectProduct(product.slug || product.id)}
                      className="group cursor-pointer bg-white border border-[#EBD9C8] p-2 rounded-sm hover:border-[#855D25] transition-all shadow-2xs"
                    >
                      <div className="relative aspect-[3/4] w-full bg-[#F3EBE1] overflow-hidden rounded-xs mb-2">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-serif text-xs sm:text-sm text-[#171717] group-hover:text-[#6D1A2A] transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-[#8A796B] uppercase tracking-wider mt-0.5">
                        {product.category}
                      </p>
                      <p className="text-xs font-semibold text-[#171717] mt-1">
                        {product.priceFormatted || product.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* No matching items */
              <div className="text-center py-12">
                <p className="font-serif text-base text-[#171717]">
                  No matching poshaks found for &quot;{query}&quot;
                </p>
                <p className="text-xs text-[#6B5E55] mt-1 max-w-sm mx-auto">
                  Try searching with broader keywords like &quot;Turquoise&quot;, &quot;Maroon&quot;, &quot;Zari&quot;, or browse our full collection.
                </p>
                <button
                  type="button"
                  onClick={handleExploreCollection}
                  className="mt-4 px-4 py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#581522] transition-colors"
                >
                  Explore All Poshaks
                </button>
              </div>
            )
          ) : (
            /* Search Suggestions / Trending */
            <div className="py-4 space-y-6">
              {/* Category Quick Pills */}
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.2em] text-[#855D25] font-semibold block mb-2.5">
                  Browse by Category
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Traditional", "Unstitched", "Stitched"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className="px-3 py-1.5 bg-white border border-[#D9C4B0] hover:border-[#855D25] text-xs text-[#171717] rounded-sm transition-colors"
                    >
                      {cat} Poshaks
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Colors & Crafts */}
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.2em] text-[#855D25] font-semibold block mb-2.5">
                  Trending Colors & Crafts
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Morbagh",
                    "Turquoise",
                    "Maroon",
                    "Gulabi",
                    "Pista",
                    "Gotapatti",
                    "Zardozi",
                    "Kesariya",
                  ].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleTrendingClick(term)}
                      className="px-3 py-1.5 bg-[#F3EBE1] hover:bg-[#EAE0D2] text-xs text-[#4A3E37] rounded-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
