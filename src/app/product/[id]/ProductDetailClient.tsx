"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Check,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Share2,
  Zap,
} from "lucide-react";
import {
  PoshakProduct,
  getPoshakDisplayName,
  getCategoryEyebrow,
  getUnstitchedDisplayName,
} from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

const Footer = dynamic(() => import("@/components/Footer"));
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });
const TalkToDesignerModal = dynamic(() => import("@/components/TalkToDesignerModal"), { ssr: false });

interface ProductDetailClientProps {
  product: PoshakProduct;
  relatedProducts: PoshakProduct[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  return (
    <ProductDetailInner
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

function ProductDetailInner({
  product,
  relatedProducts,
}: {
  product: PoshakProduct;
  relatedProducts: PoshakProduct[];
}) {
  const { addToCart, setIsCartOpen } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  // Check if this product is jewellery (enquiry only)
  const isJewellery = useMemo(() => {
    return (
      (product.category || "").toUpperCase() === "JEWELLERY" ||
      (product.type || "").toUpperCase() === "JEWELLERY"
    );
  }, [product.category, product.type]);

  // Check if unstitched poshak material
  const isUnstitched = useMemo(() => {
    return (
      (product.type || "").toLowerCase() === "unstitched" ||
      (product.category || "").toLowerCase() === "unstitched"
    );
  }, [product.type, product.category]);

  const isStitchedPoshak = useMemo(() => {
    return !isJewellery && !isUnstitched;
  }, [isJewellery, isUnstitched]);

  // Check if product is sold out
  const isSoldOut = useMemo(() => {
    return Boolean(
      product.soldOut ||
      product.price === "Sold Out" ||
      (typeof product.price === "string" && product.price.toLowerCase().includes("sold"))
    );
  }, [product.soldOut, product.price]);

  // Initial stitching option based strictly on verified business model
  const [selectedStitching, setSelectedStitching] = useState<string>(
    isStitchedPoshak ? "Stitched" : "Unstitched"
  );

  useEffect(() => {
    setSelectedStitching(isStitchedPoshak ? "Stitched" : "Unstitched");
  }, [isStitchedPoshak, product.id]);

  // Keep selected image and size in sync if product changes
  useEffect(() => {
    setSelectedImage(product.image);
    setActiveImageIndex(0);
    setSelectedSize(null);
    setSizeError(false);
    window.scrollTo(0, 0);
  }, [product.id, product.image]);

  const allImages = [product.image, ...(product.additionalImages || [])];
  const uniqueImages = Array.from(new Set(allImages));

  const handleThumbnailClick = (img: string, idx: number) => {
    setSelectedImage(img);
    setActiveImageIndex(idx);
  };

  const handleMobileScroll = () => {
    if (mobileCarouselRef.current) {
      const scrollLeft = mobileCarouselRef.current.scrollLeft;
      const width = mobileCarouselRef.current.offsetWidth;
      if (width > 0) {
        const index = Math.round(scrollLeft / width);
        setActiveImageIndex(Math.min(index, uniqueImages.length - 1));
      }
    }
  };

  // Category Eyebrow in uppercase luxury tracking
  const categoryEyebrow = useMemo(() => {
    return getCategoryEyebrow(product);
  }, [product]);

  // Quick Details scannable fields: Type, Fabric, Quality, Work, Odhna, Best For
  const quickDetails = useMemo(() => {
    if (isJewellery) {
      return [
        { label: "Category", value: "Heritage Jewellery" },
        { label: "Material", value: product.fabric || "Kundan, Stones & Metal" },
        { label: "Craft", value: product.craft || "Handcrafted Jadau Kundan" },
        { label: "Includes", value: product.includes?.[0] || product.details?.[0] || "1 Jewellery Piece" },
      ];
    }

    const bestForVal = product.bestFor || product.category;

    return [
      { label: "Type", value: isUnstitched ? "Unstitched" : "Stitched" },
      { label: "Fabric", value: product.fabric || "Pure Georgette & Satin Magji" },
      { label: "Quality", value: product.quality || "Pure Poshak" },
      { label: "Work", value: product.work || product.craft || "Handcrafted Gotapatti & Kasab Zari" },
      { label: "Odhna", value: product.odhna || "Four-side border with Gota Kiran" },
      { label: "Best For", value: bestForVal },
    ];
  }, [product, isUnstitched, isJewellery]);

  // Available sizes for interactive selector (e.g. ["XL", "XXL"])
  const availableSizes = useMemo(() => {
    if (isJewellery) return [];
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    if (product.size) {
      if (product.size.toLowerCase().includes("to")) {
        const parts = product.size.split(/to/i).map((s) => s.trim());
        if (parts.length >= 2) return parts;
      }
      if (product.size.includes(",")) {
        return product.size.split(",").map((s) => s.trim());
      }
      return [product.size.trim()];
    }
    if (!isUnstitched) {
      return ["XL", "XXL"];
    }
    return [];
  }, [product.sizes, product.size, isUnstitched, isJewellery]);

  const router = useRouter();
  const handleAddToBag = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    const finalSize =
      selectedSize ||
      (isStitchedPoshak
        ? "Stitched"
        : selectedStitching || "Unstitched");
    addToCart(product, finalSize, 1);
    setIsAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsAdded(false), 2400);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      openAuthModal("signin", "Please sign in to proceed with your order.");
      return;
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    const finalSize =
      selectedSize ||
      (isStitchedPoshak
        ? "Stitched"
        : selectedStitching || "Unstitched");
    addToCart(product, finalSize, 1);
    router.push("/checkout");
  };

  const handleWhatsAppInquiry = () => {
    const stitchingText = isStitchedPoshak
      ? "Stitched"
      : selectedStitching || "Unstitched";
    const sizePart = selectedSize ? `, Size: ${selectedSize}` : "";
    const message = encodeURIComponent(
      isJewellery
        ? `Pranam Rajwadi! I would like to enquire about your jewellery creation: "${product.name}" (${product.price}). Could you please share catalogue, details, and order options?`
        : `Pranam Rajwadi! I am interested in inquiring about "${product.name}" (${product.price}, ${stitchingText}${sizePart}). Could you please share more details?`
    );
    window.open(`https://wa.me/918766667101?text=${message}`, "_blank");
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#171717]">
      {/* Global Luxury Navigation */}
      <Navbar solidOnTop onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* Main PDP Content */}
      <div className="pt-16 sm:pt-24 md:pt-28 pb-16 sm:pb-20 max-w-7xl mx-auto w-full flex-grow">
        {/* Editorial Breadcrumb Navigation (Desktop & Tablet) */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center justify-between py-2.5 mb-5 sm:mb-8 border-b border-[#E6DCB8]/60 text-[11px] uppercase tracking-[0.2em] font-sans px-3.5 sm:px-6 md:px-12"
        >
          <div className="flex items-center gap-2 text-[#171717]/60 overflow-hidden whitespace-nowrap">
            <Link
              href="/"
              className="hover:text-[#855D25] transition-colors flex-shrink-0"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C6A15B]/70 flex-shrink-0" />
            <Link
              href="/collection"
              className="hover:text-[#855D25] transition-colors flex-shrink-0"
            >
              Collection
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C6A15B]/70 flex-shrink-0" />
            <Link
              href={`/collection?category=${encodeURIComponent(product.category.toLowerCase())}`}
              className="hover:text-[#855D25] transition-colors flex-shrink-0"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C6A15B]/70 flex-shrink-0" />
            <span className="text-[#855D25] font-medium truncate">
              {getPoshakDisplayName(product)}
            </span>
          </div>

          <Link
            href="/collection"
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-[#855D25] hover:text-[#5A1F2B] font-medium transition-colors ml-4 flex-shrink-0"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Collection</span>
          </Link>
        </nav>

        {/* 2-Column Luxury PDP Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-start px-0 sm:px-6 md:px-12">
          {/* ================= LEFT COLUMN: LARGE PRODUCT IMAGE GALLERY ================= */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* 1. Desktop Gallery View with Left Vertical Thumbnail Rail (Hidden on mobile) */}
            <div className="hidden sm:flex items-start gap-3.5 lg:gap-4 w-full">
              {/* Left Vertical Thumbnail Rail (70-80px width, 12px gap, active border) */}
              {uniqueImages.length > 1 && (
                <div className="flex flex-col gap-3 w-18 lg:w-20 flex-shrink-0 max-h-[620px] overflow-y-auto no-scrollbar">
                  {uniqueImages.map((img, idx) => {
                    const isActive = selectedImage === img;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleThumbnailClick(img, idx)}
                        aria-label={`View angle ${idx + 1} of ${product.name}`}
                        className={`relative w-full aspect-[3/4] overflow-hidden bg-[#FAF6F0] transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "border border-[#5A1F2B] ring-1 ring-[#5A1F2B]/40 opacity-100"
                            : "border border-[#E6DCB8]/50 hover:border-[#855D25]/70 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          fill
                          loading="lazy"
                          sizes="80px"
                          style={{
                            objectPosition: product.imagePosition || "center center",
                          }}
                          className="object-contain p-0.5"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Large Product Image (Consistent 3:4 ratio, clean cream backdrop, full poshak visible) */}
              <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-[#FAF6F0] border border-[#E6DCB8]/20 flex items-center justify-center">
                {/* Sold Out Luxury Badge */}
                {isSoldOut && (
                  <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A1520]/95 text-[#FFF6E9] text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.22em] rounded-xs shadow-md border border-[#D4AF37]/60 backdrop-blur-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] animate-pulse" />
                      Sold Out
                    </span>
                  </div>
                )}
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  style={{
                    objectPosition: product.imagePosition || "center center",
                  }}
                  className={`object-contain p-1 sm:p-2.5 transition-all duration-500 ease-out ${
                    isSoldOut ? "opacity-90" : ""
                  }`}
                />
                {isSoldOut && (
                  <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                )}
              </div>
            </div>

            {/* 2. Mobile Full-Width Swipeable Gallery (Visible only on mobile) */}
            <div className="sm:hidden w-full relative">
              {/* Sold Out Luxury Badge (Mobile) */}
              {isSoldOut && (
                <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#4A1520]/95 text-[#FFF6E9] text-[9.5px] font-sans font-bold uppercase tracking-[0.2em] rounded-xs shadow-md border border-[#D4AF37]/60 backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] animate-pulse" />
                    Sold Out
                  </span>
                </div>
              )}

              {/* Floating Wishlist Heart at Top-Right of Image */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={
                  isWishlisted
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
                }
                title={isWishlisted ? "In Wishlist" : "Save to Wishlist"}
                className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md border border-[#E6DCB8]/60 flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-transform"
              >
                <Heart
                  className={`w-4 h-4 stroke-[1.4] transition-colors ${
                    isWishlisted
                      ? "fill-[#5A1F2B] text-[#5A1F2B]"
                      : "text-[#171717]/75"
                  }`}
                />
              </button>

              <div
                ref={mobileCarouselRef}
                onScroll={handleMobileScroll}
                className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {uniqueImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full flex-shrink-0 snap-center aspect-[3/4] relative overflow-hidden bg-[#FAF6F0] border-b border-[#E6DCB8]/25 flex items-center justify-center"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                      sizes="100vw"
                      style={{
                        objectPosition: product.imagePosition || "center center",
                      }}
                      className="object-contain p-1"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile Pagination Dots */}
              {uniqueImages.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {uniqueImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeImageIndex === idx
                          ? "w-5 bg-[#5A1F2B]"
                          : "w-1.5 bg-[#855D25]/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT INFORMATION ================= */}
          <div className="lg:col-span-5 flex flex-col text-left px-3.5 sm:px-0 pt-2 sm:pt-4">
            {/* 1. CATEGORY / SUBCATEGORY */}
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#855D25] font-medium font-sans block mb-3">
              {categoryEyebrow}
            </span>

            {/* 2. PRODUCT NAME: Elegant Cormorant Garamond */}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1C18] font-normal leading-tight mb-4">
              {getPoshakDisplayName(product)}
            </h1>

            {/* 3. PRICE & INCLUSIVE OF STITCHING (Regal luxury pricing hierarchy) */}
            <div className="mb-7">
              {isJewellery ? (
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-[#5A1F2B] font-normal tracking-wide block">
                    Enquire on WhatsApp
                  </span>
                </div>
              ) : isSoldOut ? (
                <div>
                  <div className="flex items-baseline gap-3">
                    {product.originalPrice && (
                      <span className="font-sans text-base sm:text-lg text-[#8C827A] line-through font-normal">
                        {product.originalPrice}
                      </span>
                    )}
                    <span className="font-sans text-2xl sm:text-3xl tracking-wide text-[#7A1D2E] font-bold uppercase">
                      Sold Out
                    </span>
                  </div>
                  <p className="text-xs text-[#855D25] font-sans tracking-wide font-medium mt-1">
                    This exclusive handcrafted piece is currently archived / sold out.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-3">
                    {product.originalPrice && (
                      <span className="font-sans text-base sm:text-lg text-[#8C827A] line-through font-normal">
                        {product.originalPrice}
                      </span>
                    )}
                    <span className="font-serif text-2xl sm:text-3xl tracking-wide text-[#5A1F2B] font-medium">
                      {product.price}
                    </span>
                  </div>
                  {!isUnstitched && (
                    <p className="text-xs text-[#855D25]/90 font-sans tracking-wide font-normal mt-1">
                      {product.priceNote || "Inclusive of stitching"}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* 4. DETAILS: Clean Editorial List with Generous Breathing Room */}
            <div className="mb-8">
              <div className="text-[11px] uppercase tracking-[0.26em] font-medium text-[#855D25] font-sans mb-3">
                DETAILS
              </div>

              {/* Subtle top hairline */}
              <div className="w-full h-px bg-[#E6DCB8]/60" />

              {/* Minimal, spacious details list */}
              <div className="divide-y divide-[#E6DCB8]/25">
                {quickDetails.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2.5 text-xs font-sans"
                  >
                    <span className="text-[#7A7268] font-normal tracking-wider w-28 sm:w-32 flex-shrink-0">
                      {item.label}
                    </span>
                    <span className="text-[#1F1C18] font-normal text-right flex-1 pl-4">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtle bottom hairline */}
              <div className="w-full h-px bg-[#E6DCB8]/60" />
            </div>

            {/* 5. SIZE SELECTOR */}
            {!isJewellery && !isSoldOut && availableSizes.length > 0 && (
              <div className="mb-7">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] uppercase tracking-[0.26em] font-medium text-[#855D25] font-sans">
                    SIZE
                  </span>
                  {sizeError && (
                    <span className="text-xs text-[#9B2C2C] font-sans font-medium tracking-wide">
                      Please select a size.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        aria-label={`Select size ${size}`}
                        aria-pressed={isSelected}
                        className={`min-w-[54px] h-[38px] px-4 text-xs font-sans font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "bg-[#5A1F2B] text-[#FAF6F0] border border-[#5A1F2B] shadow-xs"
                            : sizeError
                            ? "bg-white/70 text-[#1F1C18] border border-[#9B2C2C]/70 hover:border-[#5A1F2B]"
                            : "bg-white/70 text-[#1F1C18] border border-[#E6DCB8] hover:border-[#855D25]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. ACTION BUTTONS (ADD TO BAG + BUY NOW + WISHLIST & WHATSAPP) */}
            <div className="space-y-2.5 mb-8">
              {isJewellery ? (
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="w-full h-[52px] bg-[#5A1F2B] hover:bg-[#855D25] text-[#FAF6F0] text-xs uppercase tracking-[0.24em] font-medium transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer font-sans shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-[#C6A15B]" />
                  <span>WHATSAPP TO ENQUIRE →</span>
                </button>
              ) : isSoldOut ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-[#4A1520]/5 border border-[#4A1520]/20 rounded-xs">
                    <p className="text-xs text-[#4A1520] font-sans font-semibold mb-0.5">
                      Artisanal Piece Currently Sold Out
                    </p>
                    <p className="text-[11px] text-[#7A7268] font-sans">
                      Our master karigars can handcraft a bespoke commission or notify you if restocked.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const message = encodeURIComponent(
                          `Pranam Rajwadi! I am inquiring about bespoke recreation / custom order for the sold out poshak: "${product.name}". Please let me know the availability and timeframe.`
                        );
                        window.open(`https://wa.me/918766667101?text=${message}`, "_blank");
                      }}
                      className="flex-1 h-[48px] sm:h-[50px] px-3 bg-[#2E5A36] hover:bg-[#23472a] text-white text-[11px] sm:text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 text-[#A8D5BA] flex-shrink-0" />
                      <span className="truncate">Enquire Bespoke Order →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={
                        isWishlisted
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      title={isWishlisted ? "In Wishlist" : "Save to Wishlist"}
                      className="w-[48px] h-[48px] sm:w-[50px] sm:h-[50px] flex-shrink-0 flex items-center justify-center border border-[#E6DCB8] hover:border-[#855D25] bg-white transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-colors ${
                          isWishlisted
                            ? "fill-[#5A1F2B] text-[#5A1F2B]"
                            : "text-[#171717]/70 hover:text-[#5A1F2B]"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Single Row: Add to Bag + Buy Now + Wishlist */}
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    {/* 1. Add to Bag */}
                    <button
                      type="button"
                      onClick={handleAddToBag}
                      className={`flex-1 h-[48px] sm:h-[50px] px-2 sm:px-3 text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer font-sans shadow-xs ${
                        isAdded
                          ? "bg-[#2E5A36] text-white"
                          : "bg-[#5A1F2B] hover:bg-[#481822] text-[#FAF6F0]"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="truncate">Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">Add to Bag</span>
                        </>
                      )}
                    </button>

                    {/* 2. Buy Now (Instant Checkout) */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 h-[48px] sm:h-[50px] px-2 sm:px-3 text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] font-semibold bg-[#855D25] hover:bg-[#6D1A2A] text-white transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer font-sans shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white flex-shrink-0" />
                      <span className="truncate">Buy Now</span>
                    </button>

                    {/* 3. Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={
                        isWishlisted
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      title={isWishlisted ? "In Wishlist" : "Save to Wishlist"}
                      className="w-[48px] h-[48px] sm:w-[50px] sm:h-[50px] flex-shrink-0 flex items-center justify-center border border-[#E6DCB8] hover:border-[#855D25] bg-white transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[1.3] transition-colors ${
                          isWishlisted
                            ? "fill-[#5A1F2B] text-[#5A1F2B]"
                            : "text-[#171717]/70 hover:text-[#5A1F2B]"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Note for unstitched products */}
                  {isUnstitched && (
                    <div className="flex items-center gap-2 py-0.5 px-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] flex-shrink-0" />
                      <span className="text-[11px] sm:text-xs text-[#855D25] font-sans font-medium tracking-wide">
                        Stitching service available on request.
                      </span>
                    </div>
                  )}

                  {/* SECONDARY CTA: WHATSAPP CONCIERGE */}
                  <button
                    type="button"
                    onClick={handleWhatsAppInquiry}
                    className="w-full h-[44px] sm:h-[46px] text-xs uppercase tracking-[0.18em] font-medium border border-[#E6DCB8] hover:border-[#855D25] text-[#171717] bg-white/60 hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    <MessageCircle className="w-4 h-4 text-[#855D25]" />
                    <span>Inquire via WhatsApp Concierge</span>
                  </button>
                </>
              )}
            </div>

            {/* 6. EXPANDABLE ACCORDIONS (DESCRIPTION, FEATURES & INCLUDES, SHIPPING) */}
            <div className="border-t border-[#E6DCB8]/50 pt-1 divide-y divide-[#E6DCB8]/30">
              {/* Product Description Accordion */}
              {product.description && (
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("description")}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.22em] font-medium text-[#1F1C18] hover:text-[#855D25] transition-colors cursor-pointer font-sans"
                  >
                    <span>DESCRIPTION & ATELIER NOTES</span>
                    <span className="text-base text-[#855D25] font-light leading-none">
                      {openAccordion === "description" ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openAccordion === "description" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 pb-2 text-xs text-[#4A453E] font-sans leading-relaxed">
                          {product.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Ensemble Includes & Packaging Accordion */}
              {((product.includes && product.includes.length > 0) || (product.details && product.details.length > 0)) && (
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("includes")}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.22em] font-medium text-[#1F1C18] hover:text-[#855D25] transition-colors cursor-pointer font-sans"
                  >
                    <span>ENSEMBLE INCLUDES & CRAFT HIGHLIGHTS</span>
                    <span className="text-base text-[#855D25] font-light leading-none">
                      {openAccordion === "includes" ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openAccordion === "includes" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 pt-3 pb-2 text-xs text-[#4A453E] font-sans">
                          {product.includes && product.includes.length > 0 && (
                            <div>
                              <span className="text-[10.5px] uppercase tracking-wider font-semibold text-[#855D25] block mb-1.5">
                                Package Contains:
                              </span>
                              <ul className="space-y-1 pl-1">
                                {product.includes.map((inc, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-[#855D25] text-sm leading-none mt-0.5">•</span>
                                    <span>{inc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {product.details && product.details.length > 0 && (
                            <div className="pt-2 border-t border-[#E6DCB8]/20">
                              <span className="text-[10.5px] uppercase tracking-wider font-semibold text-[#855D25] block mb-1.5">
                                Highlights:
                              </span>
                              <ul className="space-y-1 pl-1">
                                {product.details.map((det, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-[#855D25] text-sm leading-none mt-0.5">•</span>
                                    <span>{det}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Shipping Accordion */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.22em] font-medium text-[#1F1C18] hover:text-[#855D25] transition-colors cursor-pointer font-sans"
                >
                  <span>SHIPPING & DELIVERY</span>
                  <span className="text-base text-[#855D25] font-light leading-none">
                    {openAccordion === "shipping" ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openAccordion === "shipping" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 pt-3 pb-2 text-xs text-[#4A453E] font-sans">
                        <li className="flex items-start gap-2">
                          <span className="text-[#855D25] text-sm leading-none mt-0.5">•</span>
                          <span>Complimentary insured shipping across India.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#855D25] text-sm leading-none mt-0.5">•</span>
                          <span>Guaranteed delivery within 7 days with live tracking updates.</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ================= YOU MAY ALSO LIKE SECTION ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E6DCB8]/60 px-3.5 sm:px-6 md:px-12">
            <div className="text-center mb-5 sm:mb-7">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="h-[1px] w-6 bg-[#855D25]" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#855D25] font-semibold font-sans">
                  RECOMMENDED PIECES
                </span>
                <span className="h-[1px] w-6 bg-[#855D25]" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#171717] font-normal">
                YOU MAY ALSO LIKE
              </h2>
            </div>

            {/* 2-Column Mobile / 4-Column Desktop Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
              {relatedProducts.slice(0, 4).map((relProduct, idx) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  index={idx}
                  priority={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Designer Consultation Modal */}
      <TalkToDesignerModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* Global Footer */}
      <Footer onOpenConsultation={() => setIsConsultationOpen(true)} />
    </main>
  );
}
