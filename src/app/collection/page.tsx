"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Heart, ShoppingBag, ChevronDown, X, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { REAL_POSHAKS, PoshakProduct } from "@/data/products";

// Dynamically imported components
const Footer = dynamic(() => import("@/components/Footer"));
const TalkToDesignerModal = dynamic(
  () => import("@/components/TalkToDesignerModal"),
  { ssr: false }
);
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
});

type CategoryFilter = "ALL" | "BRIDAL" | "FESTIVE" | "EVERYDAY" | "JEWELLERY";
type ProductTypeFilter = "ALL" | "STITCHED" | "UNSTITCHED" | "JEWELLERY";
type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

interface ColorFilterItem {
  id: string;
  label: string;
  hex: string;
  match: (p: PoshakProduct) => boolean;
}

interface PriceFilterItem {
  id: string;
  label: string;
  match: (price: number) => boolean;
}

// Exact authentic colours matching the 27 products
const COLOR_FILTERS: ColorFilterItem[] = [
  {
    id: "maroon",
    label: "Maroon",
    hex: "#6D1A2A",
    match: (p) => /maroon|crimson/i.test(p.color + " " + p.name),
  },
  {
    id: "pink",
    label: "Pink",
    hex: "#D65A7C",
    match: (p) =>
      /pink|gulabi|blush|rose|rangrez/i.test(p.color + " " + p.name) &&
      !/kesari gulab|kesariya gulab|pista gulab|neelkamal gulab/i.test(p.name),
  },
  {
    id: "kesariya",
    label: "Gold",
    hex: "#C2843A",
    match: (p) => /kesar|kesariya|peach|gold|saffron/i.test(p.color + " " + p.name),
  },
  {
    id: "green",
    label: "Pista",
    hex: "#588E6B",
    match: (p) => /pista|green/i.test(p.color + " " + p.name),
  },
  {
    id: "blue",
    label: "Neelam",
    hex: "#26547C",
    match: (p) => /neelam|turquoise|blue|neel|aqua/i.test(p.color + " " + p.name),
  },
  {
    id: "lavender",
    label: "Lavender",
    hex: "#9685B8",
    match: (p) => /lavender/i.test(p.color + " " + p.name),
  },
];

// Price brackets reflecting actual product catalog
const PRICE_FILTERS: PriceFilterItem[] = [
  {
    id: "under-3k",
    label: "Under ₹3,000",
    match: (price) => price <= 3000,
  },
  {
    id: "3k-6k",
    label: "₹3,000 – ₹6,000",
    match: (price) => price >= 3000 && price <= 6000,
  },
  {
    id: "6k-8k",
    label: "₹6,000 – ₹8,000",
    match: (price) => price >= 6000 && price <= 8000,
  },
  {
    id: "above-8k",
    label: "Above ₹8,000",
    match: (price) => price > 8000,
  },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

function CollectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search");
  const categoryQuery = searchParams.get("category");
  const subQuery = searchParams.get("sub") || searchParams.get("subcategory");

  const typeQuery = searchParams.get("type");

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [activeType, setActiveType] = useState<ProductTypeFilter>("ALL");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    if (categoryQuery) {
      const upper = categoryQuery.toUpperCase();
      if (["BRIDAL", "FESTIVE", "EVERYDAY", "JEWELLERY"].includes(upper)) {
        setActiveCategory(upper as CategoryFilter);
      } else if (upper === "HEAVY" || upper === "HEAVY-POSHAK" || upper === "HEAVY_POSHAK" || upper === "HEAVY-POSHAKS") {
        setActiveCategory("BRIDAL");
      } else if (upper === "CLASSIC" || upper === "CLASSIC-POSHAK" || upper === "CLASSIC_POSHAK" || upper === "CLASSIC-POSHAKS") {
        setActiveCategory("EVERYDAY");
      } else if (upper === "STITCHED") {
        setActiveType("STITCHED");
      } else if (upper === "UNSTITCHED") {
        setActiveType("UNSTITCHED");
      }
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
    }
    if (subQuery) {
      const upperSub = subQuery.toUpperCase();
      if (["BRIDAL", "FESTIVE", "EVERYDAY"].includes(upperSub)) {
        setActiveCategory(upperSub as CategoryFilter);
      } else if (upperSub === "HEAVY" || upperSub === "HEAVY-POSHAK") {
        setActiveCategory("BRIDAL");
      } else if (upperSub === "CLASSIC" || upperSub === "CLASSIC-POSHAK") {
        setActiveCategory("EVERYDAY");
      }
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
    }
    if (typeQuery) {
      const upperType = typeQuery.toUpperCase();
      if (upperType === "STITCHED") {
        setActiveType("STITCHED");
      } else if (upperType === "UNSTITCHED" || upperType === "POSHAK-MATERIAL") {
        setActiveType("UNSTITCHED");
      } else if (upperType === "JEWELLERY") {
        setActiveType("JEWELLERY");
      }
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
    }
  }, [categoryQuery, subQuery, typeQuery]);

  // Accordions for compact sidebar height (Colour and Price collapsed by default)
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = React.useRef<HTMLDivElement>(null);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [isMobileColorOpen, setIsMobileColorOpen] = useState(false);
  const [isMobilePriceOpen, setIsMobilePriceOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  // Close Sort By dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync sticky top offset with navbar hide/show state on directional scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);

      if (currentScrollY <= 30) {
        setIsNavbarVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < 8) return;

      if (delta > 0) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Primary Categories: Heavy Poshak, Festive, Classic Poshak, Jewellery
  const categories: { key: CategoryFilter; label: string; count: number }[] =
    useMemo(
      () => [
        { key: "ALL", label: "All", count: REAL_POSHAKS.length },
        {
          key: "BRIDAL",
          label: "Heavy Poshak",
          count: REAL_POSHAKS.filter(
            (p) => p.category.toUpperCase() === "BRIDAL"
          ).length,
        },
        {
          key: "EVERYDAY",
          label: "Classic Poshak",
          count: REAL_POSHAKS.filter(
            (p) => p.category.toUpperCase() === "EVERYDAY"
          ).length,
        },
        {
          key: "FESTIVE",
          label: "Festive",
          count: REAL_POSHAKS.filter(
            (p) => p.category.toUpperCase() === "FESTIVE"
          ).length,
        },
        {
          key: "JEWELLERY",
          label: "Jewellery",
          count: REAL_POSHAKS.filter(
            (p) => p.category.toUpperCase() === "JEWELLERY"
          ).length,
        },
      ],
      []
    );

  // Product Type Filter: Stitched, Poshak Material, Jewellery
  const productTypes: { key: ProductTypeFilter; label: string; count: number }[] =
    useMemo(() => {
      const baseList =
        activeCategory === "ALL"
          ? REAL_POSHAKS
          : REAL_POSHAKS.filter((p) => p.category.toUpperCase() === activeCategory);

      return [
        {
          key: "STITCHED",
          label: "Stitched",
          count: baseList.filter((p) => p.type.toUpperCase() === "STITCHED").length,
        },
        {
          key: "UNSTITCHED",
          label: "Semi-Stitched",
          count: baseList.filter((p) => p.type.toUpperCase() === "UNSTITCHED").length,
        },
        {
          key: "JEWELLERY",
          label: "Jewellery",
          count: baseList.filter((p) => p.type.toUpperCase() === "JEWELLERY").length,
        },
      ];
    }, [activeCategory]);

  const parsePrice = (priceStr: string, origPriceStr?: string): number => {
    const num = priceStr.replace(/[^0-9]/g, "");
    if (num) return parseInt(num, 10);
    if (origPriceStr) {
      const origNum = origPriceStr.replace(/[^0-9]/g, "");
      if (origNum) return parseInt(origNum, 10);
    }
    return 0;
  };

  // Filter and sort products strictly according to criteria
  const filteredAndSortedProducts = useMemo(() => {
    let list = REAL_POSHAKS;

    // 0. Search Query Filter
    if (searchQuery) {
      const cleanQ = searchQuery.trim().toLowerCase();
      const terms = cleanQ.split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const name = p.name.toLowerCase();
        const cat = p.category.toLowerCase();
        const sub = (p.subCategory || "").toLowerCase();
        const col = (p.color || "").toLowerCase();
        const crf = (p.craft || "").toLowerCase();
        return terms.every(
          (t) =>
            name.includes(t) ||
            cat.includes(t) ||
            sub.includes(t) ||
            col.includes(t) ||
            crf.includes(t)
        );
      });
    }

    // 1. Category Filter
    if (activeCategory !== "ALL") {
      list = list.filter((p) => p.category.toUpperCase() === activeCategory);
    }

    // 2. Product Type Filter
    if (activeType !== "ALL") {
      list = list.filter((p) => p.type.toUpperCase() === activeType);
    }

    // 2. Colour Filter
    if (selectedColor) {
      const colorOpt = COLOR_FILTERS.find((c) => c.id === selectedColor);
      if (colorOpt) {
        list = list.filter(colorOpt.match);
      }
    }

    // 3. Price Filter
    if (selectedPriceRange) {
      const priceOpt = PRICE_FILTERS.find((pr) => pr.id === selectedPriceRange);
      if (priceOpt) {
        list = list.filter((p) => priceOpt.match(parsePrice(p.price, p.originalPrice)));
      }
    }

    // 4. Sorting
    const sorted = [...list];
    switch (sortBy) {
      case "newest":
        sorted.reverse();
        break;
      case "price-asc":
        sorted.sort((a, b) => parsePrice(a.price, a.originalPrice) - parsePrice(b.price, b.originalPrice));
        break;
      case "price-desc":
        sorted.sort((a, b) => parsePrice(b.price, b.originalPrice) - parsePrice(a.price, a.originalPrice));
        break;
      case "featured":
      default:
        break;
    }

    return sorted;
  }, [activeCategory, activeType, selectedColor, selectedPriceRange, sortBy, searchQuery]);

  const handleCategorySelect = (cat: CategoryFilter) => {
    setActiveCategory(cat);
  };

  const hasActiveFilters = Boolean(
    activeCategory !== "ALL" ||
    activeType !== "ALL" ||
    selectedColor !== null ||
    selectedPriceRange !== null ||
    Boolean(searchQuery)
  );

  const clearFilters = () => {
    setActiveCategory("ALL");
    setActiveType("ALL");
    setSelectedColor(null);
    setSelectedPriceRange(null);
    if (searchQuery || categoryQuery || typeQuery) {
      router.push("/collection");
    }
  };

  const handleOpenConsultation = () => setIsConsultationOpen(true);
  const handleCloseConsultation = () => setIsConsultationOpen(false);

  return (
    <main className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#FAF6F0]">
          {/* Navigation */}
        <Navbar onOpenConsultation={handleOpenConsultation} />

        {/* 1. COLLECTION HERO (Tightened vertical spacing, no dead space) */}
        <section className="relative pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-12 md:pb-14 overflow-hidden bg-[#1A070B] text-[#FAF6F0]">
          {/* Subtle Fabric Detail Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/unstitched_fabric_closeup.webp"
              alt="Rajputi Poshak Fabric Detail"
              fill
              priority
              className="object-cover object-center opacity-30 mix-blend-luminosity scale-105"
            />
            {/* Royal Burgundy Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A070B]/85 via-[#1A070B]/75 to-[#1A070B]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#1A070B]/50 to-[#1A070B]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 text-center">
            {/* Small Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              aria-label="Breadcrumb"
              className="flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#FAF6F0]/60 mb-3.5 font-sans"
            >
              <Link
                href="/"
                className="hover:text-[#C6A15B] transition-colors duration-200"
              >
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-[#C6A15B]/70" />
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("ALL");
                  setActiveType("ALL");
                }}
                className={`uppercase transition-colors duration-200 cursor-pointer ${
                  activeCategory === "ALL"
                    ? "text-[#C6A15B] font-medium"
                    : "hover:text-[#C6A15B]"
                }`}
              >
                Collection
              </button>
              {activeCategory !== "ALL" && (
                <>
                  <ChevronRight className="w-3 h-3 text-[#C6A15B]/70" />
                  <span className="text-[#C6A15B] font-medium uppercase">
                    {categories.find((c) => c.key === activeCategory)?.label}
                  </span>
                </>
              )}
            </motion.nav>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal tracking-[0.08em] text-[#FAF6F0] mb-2.5 uppercase"
            >
              Collection
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-serif italic text-sm sm:text-base md:text-[16.5px] text-[#FAF6F0]/80 font-light max-w-xl mx-auto leading-relaxed"
            >
              Poshaks chosen for celebrations, traditions, and moments that matter.
            </motion.p>
          </div>
        </section>

        {/* Dedicated Mobile Sticky Filter/Sort Navigation Bar (Full Width, Solid Cream, 48-52px) */}
        <div
          className={`lg:hidden sticky z-20 w-full bg-[#FAF6F0] border-y border-[#E6DCB8]/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-[top] duration-300 ease-in-out ${
            isNavbarVisible ? "top-[62px]" : "top-0"
          }`}
        >
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 h-[48px] sm:h-[52px] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#171717] font-medium font-sans hover:text-[#855D25] transition-colors py-2 cursor-pointer select-none active:opacity-70"
            >
              <span>FILTER</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A1F2B]" />
              )}
            </button>

            {/* Subtle Middle Hairline Divider */}
            <span className="h-4 w-px bg-[#E6DCB8]/80" />

            <button
              type="button"
              onClick={() => setIsMobileSortOpen(true)}
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.24em] text-[#171717] font-medium font-sans hover:text-[#855D25] transition-colors py-2 cursor-pointer select-none active:opacity-70"
            >
              <span>SORT</span>
              <span className="text-[10px] text-[#855D25] font-light">↓</span>
            </button>
          </div>
        </div>

        {/* 2. MAIN CATALOGUE LAYOUT: STICKY LEFT-SIDE FILTERS (16-18%) + PROMINENT PRODUCTS GRID (82-84%) */}
        <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 sm:pt-6 pb-16 sm:pb-24 w-full flex-grow">

          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 xl:gap-10 w-full">
            {/* Desktop Left-Side Sticky Filter (~16-18% width, compact with independent scrolling) */}
            <aside
              className={`hidden lg:block w-[185px] xl:w-[205px] flex-shrink-0 sticky self-start pt-0 transition-[top] duration-300 ease-in-out ${
                isNavbarVisible ? "top-[82px]" : "top-5"
              }`}
            >
              <div
                className={`border-r border-[#E6DCB8]/25 pr-3.5 xl:pr-5 pb-10 overflow-y-auto overscroll-contain filter-scrollbar transition-[max-height] duration-300 ${
                  isNavbarVisible
                    ? "max-h-[calc(100vh-98px)]"
                    : "max-h-[calc(100vh-36px)]"
                }`}
              >
                {/* 1. Header */}
                <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans mb-3 pb-2 border-b border-[#E6DCB8]/25">
                  EXPLORE POSHAKS
                </h3>

                {/* 2. CATEGORY */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25]/90 font-medium block mb-2">
                    CATEGORY
                  </span>
                  <nav className="flex flex-col space-y-1">
                    {categories.map((cat) => {
                      const isActive = activeCategory === cat.key;
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => handleCategorySelect(cat.key)}
                          className={`text-left text-[12px] uppercase tracking-[0.18em] transition-all duration-200 py-1 cursor-pointer select-none font-sans flex items-center justify-between group ${
                            isActive
                              ? "text-[#5A1F2B] font-semibold pl-2 border-l-2 border-[#5A1F2B]"
                              : "text-[#171717]/65 hover:text-[#855D25] pl-0"
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span
                            className={`text-[10.5px] font-mono transition-opacity ${
                              isActive
                                ? "text-[#855D25] opacity-100 font-medium"
                                : "text-[#171717]/40 opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* 2B. PRODUCT TYPE */}
                <div className="mb-4 pt-3 border-t border-[#E6DCB8]/25">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25]/90 font-medium block">
                      PRODUCT TYPE
                    </span>
                    {activeType !== "ALL" && (
                      <button
                        type="button"
                        onClick={() => setActiveType("ALL")}
                        className="text-[9.5px] uppercase tracking-[0.14em] text-[#5A1F2B] hover:text-[#855D25] transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <nav className="flex flex-col space-y-1">
                    {productTypes.map((t) => {
                      const isActive = activeType === t.key;
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setActiveType(isActive ? "ALL" : t.key)}
                          className={`text-left text-[11.5px] uppercase tracking-[0.16em] transition-all duration-200 py-1 cursor-pointer select-none font-sans flex items-center justify-between group ${
                            isActive
                              ? "text-[#5A1F2B] font-semibold pl-2 border-l-2 border-[#5A1F2B]"
                              : "text-[#171717]/65 hover:text-[#855D25] pl-0"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`w-1 h-1 rounded-full transition-all ${
                                isActive
                                  ? "bg-[#5A1F2B] scale-125"
                                  : "bg-[#855D25]/30 group-hover:bg-[#855D25]"
                              }`}
                            />
                            <span>{t.label}</span>
                          </span>
                          <span
                            className={`text-[10px] font-mono transition-opacity ${
                              isActive
                                ? "text-[#855D25] opacity-100 font-medium"
                                : "text-[#171717]/40 opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            {t.count}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* 3. FILTER BY (Collapsible Accordions) */}
                <div className="pt-3 border-t border-[#E6DCB8]/25 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25]/90 font-medium">
                      FILTER BY
                    </span>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-[9.5px] uppercase tracking-[0.14em] text-[#5A1F2B] hover:text-[#855D25] transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* A. Colour Accordion (Subtle Swatches) */}
                  <div className="border-b border-[#E6DCB8]/20 py-2">
                    <button
                      type="button"
                      onClick={() => setIsColorOpen(!isColorOpen)}
                      className="w-full flex items-center justify-between text-[11.5px] uppercase tracking-[0.16em] text-[#171717]/85 hover:text-[#855D25] transition-colors font-sans py-0.5"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>Colour</span>
                        {selectedColor && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5A1F2B]" />
                        )}
                      </span>
                      <span className="text-xs text-[#855D25] font-light">
                        {isColorOpen ? "−" : "+"}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isColorOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 pb-1">
                            {COLOR_FILTERS.map((c) => {
                              const isSelected = selectedColor === c.id;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedColor(isSelected ? null : c.id)
                                  }
                                  className={`flex items-center gap-1.5 py-1 px-1 text-left font-sans rounded-xs transition-all ${
                                    isSelected
                                      ? "text-[#5A1F2B] font-semibold bg-[#855D25]/10"
                                      : "text-[#171717]/70 hover:text-[#855D25]"
                                  }`}
                                >
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform ${
                                      isSelected
                                        ? "ring-1.5 ring-[#5A1F2B] scale-110"
                                        : "border border-black/20"
                                    }`}
                                    style={{ backgroundColor: c.hex }}
                                  />
                                  <span className="text-[10px] uppercase tracking-[0.14em] whitespace-nowrap">
                                    {c.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* B. Price Accordion */}
                  <div className="py-2">
                    <button
                      type="button"
                      onClick={() => setIsPriceOpen(!isPriceOpen)}
                      className="w-full flex items-center justify-between text-[11.5px] uppercase tracking-[0.16em] text-[#171717]/85 hover:text-[#855D25] transition-colors font-sans py-0.5"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>Price</span>
                        {selectedPriceRange && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5A1F2B]" />
                        )}
                      </span>
                      <span className="text-xs text-[#855D25] font-light">
                        {isPriceOpen ? "−" : "+"}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isPriceOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col space-y-1 pt-2 pb-1">
                            {PRICE_FILTERS.map((pr) => {
                              const isSelected = selectedPriceRange === pr.id;
                              return (
                                <button
                                  key={pr.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedPriceRange(
                                      isSelected ? null : pr.id
                                    )
                                  }
                                  className={`text-left text-[11px] tracking-wide font-sans py-1 transition-colors ${
                                    isSelected
                                      ? "text-[#5A1F2B] font-semibold pl-2 border-l-2 border-[#5A1F2B]"
                                      : "text-[#171717]/70 hover:text-[#855D25]"
                                  }`}
                                >
                                  <span>{pr.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 4. SORT BY (Luxury Custom Dropdown) */}
                <div className="pt-3 border-t border-[#E6DCB8]/25">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25]/90 font-medium block mb-2 font-sans">
                    SORT BY
                  </span>
                  <div ref={sortDropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="w-full flex items-center justify-between text-left text-[11px] uppercase tracking-[0.16em] text-[#171717] font-sans py-1.5 px-2 border border-[#E6DCB8]/50 bg-[#FAF6F0]/60 hover:border-[#855D25]/50 transition-colors cursor-pointer select-none"
                    >
                      <span className="truncate font-medium">
                        {SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Featured"}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#855D25] flex-shrink-0 transition-transform duration-200 ${
                          isSortOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isSortOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="mt-1 w-full bg-[#FAF6F0] border border-[#E6DCB8]/70 shadow-xs z-20"
                        >
                          <div className="max-h-[140px] overflow-y-auto overscroll-contain filter-scrollbar py-0.5">
                            {SORT_OPTIONS.map((opt) => {
                              const isSelected = sortBy === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setSortBy(opt.id);
                                    setIsSortOpen(false);
                                  }}
                                  className={`w-full text-left text-[10.5px] uppercase tracking-[0.14em] font-sans py-2 px-2 transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? "text-[#5A1F2B] font-semibold bg-[#855D25]/10 border-l-2 border-[#5A1F2B]"
                                      : "text-[#171717]/70 hover:text-[#855D25] hover:bg-[#855D25]/5"
                                  }`}
                                >
                                  <span className="truncate">{opt.label}</span>
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A1F2B] flex-shrink-0 ml-1" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Product Grid Area (~82-84% width) */}
            <div className="flex-1 min-w-0 w-full">
              {/* Product Type Quick Filter Tabs (Stitched, Semi-Stitched) */}
              {activeCategory !== "JEWELLERY" && (
                <div className="mb-5 sm:mb-6 pb-3 border-b border-[#E6DCB8]/60 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans mr-1 sm:mr-2">
                    TYPE:
                  </span>
                  {[
                    { key: "ALL", label: "All" },
                    { key: "STITCHED", label: "Stitched" },
                    { key: "UNSTITCHED", label: "Semi-Stitched" },
                  ].map((t) => {
                    const isTypeActive = activeType === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setActiveType(t.key as ProductTypeFilter | "ALL")}
                        className={`px-3 sm:px-3.5 py-1.5 text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] font-sans transition-all duration-200 cursor-pointer rounded-xs flex items-center gap-1.5 border ${
                          isTypeActive
                            ? "bg-[#5A1F2B] text-[#FAF6F0] border-[#5A1F2B] shadow-2xs font-semibold"
                            : "bg-[#FAF6F0] text-[#171717]/75 border-[#E6DCB8]/80 hover:border-[#855D25] hover:text-[#5A1F2B]"
                        }`}
                      >
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <AnimatePresence mode="wait">
                {filteredAndSortedProducts.length > 0 ? (
                  <motion.div
                    key={`${activeCategory}-${selectedColor}-${selectedPriceRange}-${sortBy}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-3 sm:gap-x-4 md:gap-x-6 lg:gap-x-7 xl:gap-x-8 gap-y-7 sm:gap-y-8 md:gap-y-10 lg:gap-y-12"
                  >
                    {filteredAndSortedProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={idx}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="py-20 text-center max-w-md mx-auto">
                    <p className="font-serif text-xl text-[#171717] mb-2 font-normal">
                      No Poshaks Found
                    </p>
                    <p className="text-sm text-[#171717]/60 mb-6 font-sans">
                      We couldn't find any creations matching your selected
                      filter criteria.
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FAF6F0] bg-[#5A1F2B] hover:bg-[#855D25] py-2.5 px-6 transition-colors duration-300 font-medium"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Dedicated Mobile FILTER Bottom Sheet / Drawer */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
              {/* Subtle Dark Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              />

              {/* Slide-Up Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 320 }}
                className="relative z-10 w-full max-h-[88vh] bg-[#FDFBF7] border-t border-[#C6A15B]/50 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Pull Handle */}
                <div className="w-10 h-1 bg-[#855D25]/25 rounded-full mx-auto mt-3 mb-1" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-[#E6DCB8]/60">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans">
                      FILTER
                    </h3>
                    {hasActiveFilters && (
                      <span className="text-[10px] text-[#5A1F2B] font-mono font-medium">
                        (Active)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    aria-label="Close Filter"
                    className="text-[#171717]/60 hover:text-[#5A1F2B] p-1 text-xl font-light leading-none cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Scrollable Filter Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 overscroll-contain filter-scrollbar divide-y divide-[#E6DCB8]/40 space-y-4">
                  {/* 1. Category */}
                  <div className="pt-1 first:pt-0">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25]/90 font-medium block mb-3 font-sans">
                      CATEGORY
                    </span>
                    <div className="space-y-2">
                      {categories.map((cat) => {
                        const isActive = activeCategory === cat.key;
                        return (
                          <div key={cat.key} className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => handleCategorySelect(cat.key)}
                              className={`w-full flex items-center justify-between py-2 text-left font-sans text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                                isActive
                                  ? "text-[#5A1F2B] font-semibold"
                                  : "text-[#171717]/75 hover:text-[#855D25]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                    isActive
                                      ? "border-[#5A1F2B] bg-[#5A1F2B]"
                                      : "border-[#171717]/30 bg-transparent"
                                  }`}
                                >
                                  {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FAF6F0]" />
                                  )}
                                </span>
                                <span>{cat.label}</span>
                              </div>
                              <span
                                className={`text-[11px] font-mono ${
                                  isActive
                                    ? "text-[#855D25] font-semibold"
                                    : "text-[#171717]/40"
                                }`}
                              >
                                {cat.count}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 1B. Product Type */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25]/90 font-medium font-sans">
                        PRODUCT TYPE
                      </span>
                      {activeType !== "ALL" && (
                        <button
                          type="button"
                          onClick={() => setActiveType("ALL")}
                          className="text-[9.5px] uppercase tracking-[0.14em] text-[#5A1F2B] hover:text-[#855D25] transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {productTypes.map((t) => {
                        const isActive = activeType === t.key;
                        return (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => setActiveType(isActive ? "ALL" : t.key)}
                            className={`w-full flex items-center justify-between py-1.5 text-left font-sans text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                              isActive
                                ? "text-[#5A1F2B] font-semibold"
                                : "text-[#171717]/75 hover:text-[#855D25]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                  isActive
                                    ? "border-[#5A1F2B] bg-[#5A1F2B]"
                                    : "border-[#171717]/30 bg-transparent"
                                }`}
                              >
                                {isActive && (
                                  <span className="w-1 h-1 rounded-full bg-[#FAF6F0]" />
                                )}
                              </span>
                              <span>{t.label}</span>
                            </div>
                            <span
                              className={`text-[11px] font-mono ${
                                isActive
                                  ? "text-[#855D25] font-semibold"
                                  : "text-[#171717]/40"
                              }`}
                            >
                              {t.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Colour (Expandable Accordion) */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setIsMobileColorOpen(!isMobileColorOpen)}
                      className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] text-[#171717]/90 hover:text-[#855D25] font-sans font-medium py-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25]/90 font-medium font-sans">
                          COLOUR
                        </span>
                        {selectedColor && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5A1F2B]" />
                        )}
                      </div>
                      <span className="text-xs text-[#855D25] font-light">
                        {isMobileColorOpen ? "−" : "+"}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isMobileColorOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-2 pt-3 pb-1">
                            {COLOR_FILTERS.map((c) => {
                              const isSelected = selectedColor === c.id;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedColor(isSelected ? null : c.id)
                                  }
                                  className={`flex items-center gap-2.5 py-2 px-2.5 text-left text-xs uppercase tracking-[0.14em] font-sans rounded-xs border transition-all cursor-pointer ${
                                    isSelected
                                      ? "text-[#5A1F2B] font-semibold bg-[#855D25]/10 border-[#5A1F2B]"
                                      : "text-[#171717]/75 border-[#E6DCB8]/50 bg-white/40 hover:border-[#855D25]/50"
                                  }`}
                                >
                                  <span
                                    className={`w-3.5 h-3.5 rounded-full flex-shrink-0 transition-transform ${
                                      isSelected
                                        ? "ring-1.5 ring-[#5A1F2B] scale-110"
                                        : "border border-black/20"
                                    }`}
                                    style={{ backgroundColor: c.hex }}
                                  />
                                  <span className="truncate">{c.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Price (Expandable Accordion) */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setIsMobilePriceOpen(!isMobilePriceOpen)}
                      className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] text-[#171717]/90 hover:text-[#855D25] font-sans font-medium py-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25]/90 font-medium font-sans">
                          PRICE
                        </span>
                        {selectedPriceRange && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5A1F2B]" />
                        )}
                      </div>
                      <span className="text-xs text-[#855D25] font-light">
                        {isMobilePriceOpen ? "−" : "+"}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isMobilePriceOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1.5 pt-3 pb-1">
                            {PRICE_FILTERS.map((pr) => {
                              const isSelected = selectedPriceRange === pr.id;
                              return (
                                <button
                                  key={pr.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedPriceRange(
                                      isSelected ? null : pr.id
                                    )
                                  }
                                  className={`w-full flex items-center justify-between py-2 px-3 text-left text-xs font-sans rounded-xs border transition-colors cursor-pointer ${
                                    isSelected
                                      ? "text-[#5A1F2B] font-semibold bg-[#855D25]/10 border-[#5A1F2B]"
                                      : "text-[#171717]/75 border-[#E6DCB8]/50 bg-white/40 hover:border-[#855D25]/50"
                                  }`}
                                >
                                  <span className="tracking-wide">
                                    {pr.label}
                                  </span>
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A1F2B]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Fixed Footer: APPLY FILTERS */}
                <div className="p-4 border-t border-[#E6DCB8]/60 bg-[#FDFBF7] flex items-center gap-3">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="py-3 px-4 text-xs uppercase tracking-[0.16em] text-[#5A1F2B] border border-[#5A1F2B]/40 hover:bg-[#5A1F2B]/5 font-medium transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 py-3.5 px-4 text-xs uppercase tracking-[0.22em] text-[#FAF6F0] bg-[#5A1F2B] hover:bg-[#855D25] font-medium text-center transition-colors shadow-xs cursor-pointer"
                  >
                    APPLY FILTERS ({filteredAndSortedProducts.length})
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dedicated Mobile SORT Bottom Sheet */}
        <AnimatePresence>
          {isMobileSortOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
              {/* Subtle Dark Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileSortOpen(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              />

              {/* Slide-Up Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 320 }}
                className="relative z-10 w-full bg-[#FDFBF7] border-t border-[#C6A15B]/50 rounded-t-2xl shadow-2xl p-5 pb-7 flex flex-col overflow-hidden"
              >
                {/* Pull Handle */}
                <div className="w-10 h-1 bg-[#855D25]/25 rounded-full mx-auto mb-3" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E6DCB8]/60 pb-3 mb-3">
                  <h3 className="text-xs uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans">
                    SORT BY
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileSortOpen(false)}
                    aria-label="Close Sort"
                    className="text-[#171717]/60 hover:text-[#5A1F2B] p-1 text-xl font-light leading-none cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Sort Options */}
                <div className="space-y-1">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sortBy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsMobileSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between py-3 px-3 rounded-xs text-left text-xs uppercase tracking-[0.16em] font-sans transition-colors cursor-pointer ${
                          isSelected
                            ? "text-[#5A1F2B] font-semibold bg-[#855D25]/10 border-l-2 border-[#5A1F2B]"
                            : "text-[#171717]/75 hover:text-[#855D25] hover:bg-[#855D25]/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-[#5A1F2B] bg-[#5A1F2B]"
                                : "border-[#171717]/30 bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FAF6F0]" />
                            )}
                          </span>
                          <span>{opt.label}</span>
                        </div>
                        {isSelected && (
                          <span className="text-xs text-[#5A1F2B] font-semibold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <Footer onOpenConsultation={handleOpenConsultation} />

        {/* Interactive Modals */}
        <TalkToDesignerModal
          isOpen={isConsultationOpen}
          onClose={handleCloseConsultation}
        />

        <CartDrawer onOpenConsultation={handleOpenConsultation} />
      </main>
  );
}

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-sans text-xs text-[#8C827A]">
          Loading collection...
        </div>
      }
    >
      <CollectionContent />
    </Suspense>
  );
}

