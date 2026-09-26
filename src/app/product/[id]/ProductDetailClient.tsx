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
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import TalkToDesignerModal from "@/components/TalkToDesignerModal";

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
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
  product: any;
  relatedProducts: any[];
}) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id || product.slug);

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const isStitchedPoshak = useMemo(() => {
    return (product.category || "").toLowerCase() === "stitched" || (product.type || "").toLowerCase() === "stitched";
  }, [product]);

  const isJewellery = useMemo(() => {
    return (
      (product.category || "").toLowerCase() === "jewellery" ||
      (product.type || "").toLowerCase() === "jewellery"
    );
  }, [product]);

  const availableSizes = useMemo(() => {
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      return product.sizes;
    }
    if (typeof product.size === "string" && product.size.trim()) {
      return product.size.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (isJewellery) {
      return ["Free Size"];
    }
    return ["XL", "XXL"];
  }, [product, isJewellery]);

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      return product.sizes[0];
    }
    if (typeof product.size === "string" && product.size.trim()) {
      return product.size.split(",")[0].trim();
    }
    return isJewellery ? "Free Size" : "XL";
  });

  // Keep selected image & size in sync if product changes
  useEffect(() => {
    setSelectedImage(product.image);
    setActiveImageIndex(0);
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else if (typeof product.size === "string" && product.size.trim()) {
      setSelectedSize(product.size.split(",")[0].trim());
    } else {
      setSelectedSize(isJewellery ? "Free Size" : "XL");
    }
    window.scrollTo(0, 0);
  }, [product.id, product.image, product.sizes, product.size, isJewellery]);

  // Monitor scroll for mobile sticky action bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allImages = [product.image, ...(product.additionalImages || [])];
  const uniqueImages = Array.from(new Set(allImages.filter(Boolean)));

  const handleThumbnailClick = (img: string, idx: number) => {
    setSelectedImage(img);
    setActiveImageIndex(idx);
  };

  const scrollToMobileImage = (idx: number) => {
    if (mobileCarouselRef.current) {
      const width = mobileCarouselRef.current.offsetWidth;
      mobileCarouselRef.current.scrollTo({
        left: width * idx,
        behavior: "smooth",
      });
      setActiveImageIndex(idx);
    }
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

  const handleAddToBag = () => {
    if (!product.inStock) return;
    const formatLabel = isJewellery ? "Standard" : `Size: ${selectedSize}`;

    addToCart(product, selectedSize || formatLabel, 1, false);
    setIsAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsAdded(false), 2400);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    const formatLabel = isJewellery ? "Standard" : `Size: ${selectedSize}`;

    addToCart(product, selectedSize || formatLabel, 1, false);
    router.push("/checkout");
  };

  const handleWhatsAppInquiry = () => {
    const sizeNote = isJewellery ? "" : ` (Size: ${selectedSize})`;
    const message = encodeURIComponent(
      `Pranam Rajwadi! I am interested in inquiring about "${product.name}" (${product.price || product.priceFormatted}${sizeNote}). Could you please share more details?`
    );
    window.open(`https://wa.me/918766667101?text=${message}`, "_blank");
  };

  const handleShareProduct = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on Rajwadi`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#171717]">
      {/* Global Luxury Navigation */}
      <Navbar solidOnTop onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* Main PDP Content */}
      <div className="pt-14 sm:pt-24 md:pt-28 pb-24 sm:pb-20 max-w-7xl mx-auto w-full flex-grow">
        {/* Editorial Breadcrumb Navigation (Desktop / Tablet) */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center justify-between py-2.5 mb-5 sm:mb-8 border-b border-[#E6DCB8]/60 text-[11px] uppercase tracking-[0.2em] font-sans px-4 sm:px-6 lg:px-8"
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
            <span className="text-[#855D25] font-medium truncate">
              {product.name}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-start px-0 sm:px-6 lg:px-8">
          {/* ================= LEFT COLUMN: LARGE PRODUCT IMAGE GALLERY ================= */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Desktop Gallery View with Left Vertical Thumbnail Rail */}
            <div className="hidden sm:flex items-start gap-3.5 lg:gap-4 w-full">
              {/* Left Vertical Thumbnail Rail */}
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
                        className={`relative w-full aspect-[3/4] overflow-hidden bg-[#F4ECE1] transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "border-2 border-[#855D25] shadow-xs opacity-100"
                            : "border border-[#E6DCB8]/70 hover:border-[#855D25]/70 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          fill
                          loading="lazy"
                          sizes="80px"
                          style={{
                            objectPosition: product.imagePosition || "center 5%",
                          }}
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Large Product Image */}
              <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-[#F4ECE1] border border-[#E6DCB8]/60 shadow-xs flex items-center justify-center">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 580px"
                  style={{
                    objectPosition: product.imagePosition || "center 5%",
                    transform: product.imageScale
                      ? `scale(${product.imageScale})`
                      : undefined,
                    transformOrigin: product.imagePosition || "center 10%",
                  }}
                  className="object-cover transition-all duration-500 ease-out"
                />
              </div>
            </div>

            {/* Mobile Full-Width Swipeable Gallery with Edge-to-Edge Experience */}
            <div className="sm:hidden w-full relative">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="Go back"
                className="absolute top-3.5 left-3.5 z-20 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md border border-[#E6DCB8]/60 flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft className="w-4 h-4 text-[#171717]" />
              </button>

              {/* Mobile Wishlist Floating Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id || product.slug)}
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

              {/* Mobile Image Counter Pill */}
              {uniqueImages.length > 1 && (
                <div className="absolute bottom-3.5 right-3.5 z-20 px-2.5 py-0.5 rounded-full bg-[#171717]/65 backdrop-blur-md text-[#FAF6F0] text-[10px] tracking-widest font-mono font-medium border border-white/20 pointer-events-none">
                  {activeImageIndex + 1} / {uniqueImages.length}
                </div>
              )}

              {/* Swipeable Carousel */}
              <div
                ref={mobileCarouselRef}
                onScroll={handleMobileScroll}
                className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {uniqueImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full flex-shrink-0 snap-center aspect-[3/4] relative overflow-hidden bg-[#F4ECE1] border-b border-[#E6DCB8]/60"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                      sizes="100vw"
                      style={{
                        objectPosition: product.imagePosition || "center 5%",
                        transform: product.imageScale
                          ? `scale(${product.imageScale})`
                          : undefined,
                        transformOrigin: product.imagePosition || "center 10%",
                      }}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile Thumbnail Strip & Clickable Pagination Dots */}
              {uniqueImages.length > 1 && (
                <div className="pt-3 px-4">
                  {/* Clickable Dots */}
                  <div className="flex items-center justify-center gap-1.5 mb-2.5">
                    {uniqueImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToMobileImage(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer p-0 border-none ${
                          activeImageIndex === idx
                            ? "w-6 bg-[#5A1F2B]"
                            : "w-1.5 bg-[#855D25]/30 hover:bg-[#855D25]/60"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Horizontal Mini Thumbnails */}
                  <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {uniqueImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToMobileImage(idx)}
                        className={`relative w-12 aspect-[3/4] rounded-xs overflow-hidden flex-shrink-0 transition-all duration-200 cursor-pointer ${
                          activeImageIndex === idx
                            ? "border-2 border-[#855D25] shadow-xs scale-105 opacity-100"
                            : "border border-[#E6DCB8]/80 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT INFORMATION ================= */}
          <div className="lg:col-span-5 flex flex-col text-left px-4 sm:px-0 pt-4 sm:pt-0">
            {/* 1. CATEGORY */}
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans block mb-1">
              {product.category}
            </span>

            {/* 2. PRODUCT NAME */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[40px] text-[#171717] font-normal leading-tight mb-2">
              {product.name}
            </h1>

            {/* 3. PRICE & DISCOUNT */}
            {(() => {
              const originalPriceStr =
                product.originalPrice ||
                (product.compareAtPriceInPaise
                  ? `₹ ${(product.compareAtPriceInPaise / 100).toLocaleString("en-IN")}`
                  : null);

              let discountPercent: number | null = null;
              let savingsInRupees: number | null = null;

              if (originalPriceStr && (product.priceFormatted || product.price)) {
                const currentNum = parseInt(
                  (product.priceFormatted || product.price).replace(/[^0-9]/g, ""),
                  10
                );
                const origNum = parseInt(
                  originalPriceStr.replace(/[^0-9]/g, ""),
                  10
                );
                if (origNum > currentNum && origNum > 0) {
                  discountPercent = Math.round(((origNum - currentNum) / origNum) * 100);
                  savingsInRupees = origNum - currentNum;
                }
              }

              return (
                <div className="mb-3 space-y-1">
                  <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                    <span className="font-sans text-xl sm:text-2xl lg:text-[26px] text-[#171717] font-medium tracking-wide">
                      {product.priceFormatted || product.price}
                    </span>

                    {originalPriceStr && (
                      <span className="text-sm sm:text-base text-[#8A796B] line-through font-sans">
                        {originalPriceStr}
                      </span>
                    )}

                    {discountPercent !== null && (
                      <span className="px-2 py-0.5 bg-[#6D1A2A]/10 text-[#6D1A2A] text-xs font-semibold uppercase tracking-wider rounded-xs border border-[#6D1A2A]/25">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {savingsInRupees !== null && savingsInRupees > 0 && (
                    <p className="text-[11px] text-[#2E5A36] font-medium font-sans">
                      You save ₹{savingsInRupees.toLocaleString("en-IN")} on this royal ensemble
                    </p>
                  )}
                </div>
              );
            })()}

            {/* 4. SHORT DESCRIPTION (With Mobile Read More Toggle) */}
            <div className="mb-4">
              <p
                className={`font-serif italic text-[13.5px] sm:text-[15.5px] text-[#171717]/85 leading-relaxed font-light ${
                  !isDescriptionExpanded ? "line-clamp-2 sm:line-clamp-none" : ""
                }`}
              >
                {product.description}
              </p>
              {product.description && product.description.length > 120 && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="sm:hidden mt-1 text-[11px] uppercase tracking-wider text-[#855D25] font-semibold hover:text-[#5A1F2B] transition-colors"
                >
                  {isDescriptionExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>

            {/* 5. DETAILS TABLE (Responsive layout with safe spacing) */}
            <div className="py-4 border-t border-[#E6DCB8]/60 space-y-0">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#855D25] font-semibold block mb-2.5 font-sans">
                DETAILS
              </span>
              <div className="divide-y divide-[#E6DCB8]/50 text-xs sm:text-[13px] font-sans">
                <div className="py-2.5 flex justify-between items-center gap-3">
                  <span className="text-[#8A796B] flex-shrink-0">Type</span>
                  <span className="text-[#171717] font-medium text-right">
                    {product.type || (isStitchedPoshak ? "Stitched" : "Stitched")}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-start gap-3">
                  <span className="text-[#8A796B] flex-shrink-0">Fabric</span>
                  <span className="text-[#171717] font-medium text-right">
                    {product.fabric || "Pure Georgette & Satin Magji"}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-3">
                  <span className="text-[#8A796B] flex-shrink-0">Quality</span>
                  <span className="text-[#171717] font-medium text-right">
                    {product.quality || "Pure Poshak"}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-start gap-3">
                  <span className="text-[#8A796B] flex-shrink-0">Work</span>
                  <span className="text-[#171717] font-medium text-right">
                    {product.work || product.craft || "Handcrafted Peacock Gotapatti, Kasab Zari & Dabka"}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-start gap-3">
                  <span className="text-[#8A796B] flex-shrink-0">Odhna</span>
                  <span className="text-[#171717] font-medium text-right">
                    {product.odhna || "Four-side border with Gota Kiran"}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center gap-3">
                  <span className="text-[#8A796B] flex-shrink-0">Best For</span>
                  <span className="text-[#171717] font-medium text-right">
                    {product.bestFor || product.subCategory || product.category || "Bridal"}
                  </span>
                </div>
              </div>
            </div>

            {/* 6. SIZE SELECTOR (Mobile wrap-safe) */}
            {!isJewellery && (
              <div className="pt-2 pb-5">
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#855D25] font-semibold block mb-2.5 font-sans">
                  SIZE
                </span>
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  {availableSizes.map((sz: string) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`w-13 sm:w-14 h-10 sm:h-11 flex items-center justify-center text-xs font-semibold uppercase tracking-wider border rounded-xs transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#5A1F2B] bg-[#5A1F2B] text-white shadow-xs"
                            : "border-[#E6DCB8] bg-white text-[#171717] hover:border-[#855D25]"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 7. PRIMARY & SECONDARY ACTIONS */}
            <div className="space-y-2.5 mb-6">
              {/* Single Row: Add to Bag + Buy Now + Wishlist */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* 1. Add to Royal Bag */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  disabled={!product.inStock}
                  className={`flex-1 h-[48px] sm:h-[50px] px-2 sm:px-3 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.18em] font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer font-sans shadow-xs whitespace-nowrap active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAdded
                      ? "bg-[#2E5A36] text-white"
                      : "bg-[#5A1F2B] hover:bg-[#481822] text-[#FAF6F0]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Added to Bag</span>
                    </>
                  ) : !product.inStock ? (
                    <span>Out of Stock</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {/* 2. Buy Now (Instant Checkout - Royal Antique Gold) */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 h-[48px] sm:h-[50px] px-2 sm:px-3 text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.22em] font-semibold bg-[#855D25] hover:bg-[#704C1C] text-[#FAF6F0] transition-all duration-300 flex items-center justify-center cursor-pointer font-sans shadow-xs whitespace-nowrap active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed border border-[#704C1C]/30"
                >
                  <span>Buy Now</span>
                </button>

                {/* 3. Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id || product.slug)}
                  aria-label={
                    isWishlisted
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  title={isWishlisted ? "In Wishlist" : "Save to Wishlist"}
                  className="w-[44px] h-[48px] sm:w-[50px] sm:h-[50px] flex-shrink-0 flex items-center justify-center border border-[#E6DCB8] hover:border-[#855D25] bg-white transition-colors cursor-pointer active:scale-95"
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

              {/* Secondary Row: WhatsApp Concierge + Share */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 h-[44px] sm:h-[46px] text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] font-medium border border-[#E6DCB8] hover:border-[#855D25] text-[#171717] bg-white/60 hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 text-[#855D25] flex-shrink-0" />
                  <span className="truncate">Inquire via WhatsApp Concierge</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareProduct}
                  title="Share this ensemble"
                  aria-label="Share this ensemble"
                  className="w-[44px] h-[44px] sm:h-[46px] flex-shrink-0 flex items-center justify-center border border-[#E6DCB8] hover:border-[#855D25] bg-white/60 hover:bg-white text-[#171717]/70 hover:text-[#855D25] transition-colors cursor-pointer active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 8. ACCORDIONS */}
            <div className="border-t border-[#E6DCB8]/60 divide-y divide-[#E6DCB8]/60">
              {/* Ensemble Details */}
              {product.details && product.details.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion("details")}
                    className="w-full py-3.5 flex items-center justify-between text-xs uppercase tracking-[0.2em] font-semibold text-[#171717] hover:text-[#855D25] transition-colors text-left"
                  >
                    <span>Artisanal Details & Motifs</span>
                    <span className="text-sm font-serif">
                      {openAccordion === "details" ? "−" : "+"}
                    </span>
                  </button>
                  {openAccordion === "details" && (
                    <ul className="pb-4 space-y-1.5 text-xs text-[#171717]/80 list-disc list-inside">
                      {product.details.map((d: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Package Includes */}
              {product.includes && product.includes.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion("includes")}
                    className="w-full py-3.5 flex items-center justify-between text-xs uppercase tracking-[0.2em] font-semibold text-[#171717] hover:text-[#855D25] transition-colors text-left"
                  >
                    <span>What the Ensemble Includes</span>
                    <span className="text-sm font-serif">
                      {openAccordion === "includes" ? "−" : "+"}
                    </span>
                  </button>
                  {openAccordion === "includes" && (
                    <ul className="pb-4 space-y-1.5 text-xs text-[#171717]/80 list-disc list-inside">
                      {product.includes.map((inc: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">
                          {inc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* You May Also Admire */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 border-t border-[#E6DCB8]/60 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-[10.5px] uppercase tracking-[0.25em] text-[#855D25] font-semibold block mb-1">
                COMPLEMENTARY CREATIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#171717]">
                You May Also Admire
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id || p.slug} product={p} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Floating Sticky Purchase Bar (Appears when scrolled past top hero/actions) */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-[#E6DCB8] px-3.5 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out ${
          showStickyBar
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-2.5">
          {/* Price & Size preview */}
          <div className="flex flex-col min-w-0 pr-1">
            <span className="font-sans text-sm font-semibold text-[#171717] tracking-tight leading-tight truncate">
              {product.priceFormatted || product.price}
            </span>
            <span className="text-[10px] text-[#855D25] font-medium uppercase tracking-wider truncate">
              {isJewellery ? "Free Size" : `Size: ${selectedSize}`}
            </span>
          </div>

          {/* Action Buttons in Sticky Bar */}
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={handleAddToBag}
              disabled={!product.inStock}
              className={`flex-1 h-10 px-2 text-[10px] uppercase tracking-[0.12em] font-medium transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer font-sans whitespace-nowrap active:scale-95 disabled:opacity-50 ${
                isAdded
                  ? "bg-[#2E5A36] text-white"
                  : "bg-[#5A1F2B] text-[#FAF6F0]"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3 h-3 flex-shrink-0" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 flex-shrink-0" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 h-10 px-2 text-[10px] uppercase tracking-[0.14em] font-semibold bg-[#855D25] active:bg-[#704C1C] text-[#FAF6F0] transition-all duration-200 flex items-center justify-center cursor-pointer font-sans whitespace-nowrap active:scale-95 disabled:opacity-50 border border-[#704C1C]/30"
            >
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
      <CartDrawer />
      <TalkToDesignerModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
