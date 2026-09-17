"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { PoshakProduct } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import TalkToDesignerModal from "@/components/TalkToDesignerModal";

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
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  // Check if this specific poshak is pre-stitched (Stitched Poshak) or unstitched fabric
  const isStitchedPoshak = useMemo(() => {
    const cat = product.category.toLowerCase();
    if (cat === "stitched") return true;
    if (cat === "unstitched") return false;
    // For "Traditional" or other categories, check if details or includes specify pre-stitched
    const hasStitchedDetail = product.details.some((d) =>
      /pre-stitched|ready-to-wear|stitched and tailored/i.test(d)
    );
    const hasStitchedInclude = product.includes.some(
      (inc) => /stitched|ready-to-wear/i.test(inc) && !/unstitched/i.test(inc)
    );
    return hasStitchedDetail || hasStitchedInclude;
  }, [product]);

  // Initial stitching option based strictly on verified business model
  const [selectedStitching, setSelectedStitching] = useState<string>(
    isStitchedPoshak ? "Stitched" : "Unstitched"
  );

  useEffect(() => {
    setSelectedStitching(isStitchedPoshak ? "Stitched" : "Unstitched");
  }, [isStitchedPoshak, product.id]);

  // Keep selected image in sync if product changes
  useEffect(() => {
    setSelectedImage(product.image);
    setActiveImageIndex(0);
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

  const handleAddToBag = () => {
    const stitchingFormat = isStitchedPoshak
      ? "Stitched"
      : selectedStitching || "Unstitched";
    addToCart(product, stitchingFormat, 1);
    setIsAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsAdded(false), 2400);
  };

  const handleWhatsAppInquiry = () => {
    const stitchingText = isStitchedPoshak
      ? "Stitched"
      : selectedStitching || "Unstitched";
    const message = encodeURIComponent(
      `Pranam Rajwadi! I am interested in inquiring about "${product.name}" (${product.price}, ${stitchingText}). Could you please share more details?`
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
            {/* 1. Desktop Gallery View (Hidden on mobile, visible on sm and up) */}
            <div className="hidden sm:flex flex-col items-center w-full">
              {/* Main Large Product Image (3:4 ratio, clean cream backdrop, no excessive borders) */}
              <div className="relative w-full aspect-[3/4] max-w-[580px] overflow-hidden bg-[#F4ECE1] border border-[#E6DCB8]/60 shadow-xs">
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

              {/* Desktop Thumbnails: 2–4 smaller thumbnails (Only render if multiple images exist, no fake thumbnails) */}
              {uniqueImages.length > 1 && (
                <div className="flex items-center gap-3 mt-4 w-full max-w-[580px] overflow-x-auto pb-1">
                  {uniqueImages.map((img, idx) => {
                    const isActive = selectedImage === img;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleThumbnailClick(img, idx)}
                        aria-label={`View angle ${idx + 1} of ${product.name}`}
                        className={`relative w-20 aspect-[3/4] flex-shrink-0 overflow-hidden bg-[#F4ECE1] border transition-all cursor-pointer ${
                          isActive
                            ? "border-[#855D25] ring-1 ring-[#855D25]"
                            : "border-[#E6DCB8]/70 hover:border-[#855D25]/60 opacity-70 hover:opacity-100"
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
            </div>

            {/* 2. Mobile Full-Width Swipeable Gallery (Visible only on mobile) */}
            <div className="sm:hidden w-full relative">
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
          <div className="lg:col-span-5 flex flex-col text-left px-4 sm:px-0 pt-4 sm:pt-0">
            {/* 1. CATEGORY: Small uppercase */}
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans block mb-1">
              {product.category}
            </span>

            {/* 2. PRODUCT NAME: Large elegant serif */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[40px] text-[#171717] font-normal leading-tight mb-2">
              {product.name}
            </h1>

            {/* 3. PRICE */}
            <div className="mb-2.5">
              <span className="font-sans text-xl sm:text-2xl lg:text-[26px] text-[#171717] font-medium tracking-wide">
                {product.price}
              </span>
            </div>

            {/* 4. SHORT PRODUCT DESCRIPTION (1–2 line concise description on mobile) */}
            <p className="font-serif italic text-[13.5px] sm:text-[15.5px] text-[#171717]/85 leading-relaxed font-light line-clamp-2 sm:line-clamp-none mb-5">
              {product.description}
            </p>

            {/* 5. STITCHING / AVAILABILITY OPTIONS */}
            <div className="border-t border-[#E6DCB8]/60 pt-4 pb-4 mb-3">
              {isStitchedPoshak ? (
                /* Stitched Poshak */
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans mb-1.5 block">
                    STITCHING
                  </span>
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-semibold text-[#171717] uppercase tracking-wider">
                      STITCHED
                    </span>
                    <span className="font-sans text-xs text-[#855D25] mt-0.5">
                      Ready to wear
                    </span>
                  </div>
                </div>
              ) : (
                /* Unstitched Poshak */
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans text-xs font-semibold text-[#171717] uppercase tracking-wider">
                      UNSTITCHED
                    </span>
                    <span className="font-sans text-[11px] text-[#855D25] italic">
                      Stitching service available
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStitching("Unstitched")}
                      className={`flex-1 py-2.5 px-3 text-xs font-sans font-medium tracking-wider transition-all duration-200 cursor-pointer border rounded-xs ${
                        selectedStitching === "Unstitched"
                          ? "bg-[#5A1F2B] text-[#FAF6F0] border-[#5A1F2B] shadow-xs font-semibold"
                          : "bg-white/80 text-[#171717]/80 border-[#E6DCB8]/80 hover:border-[#855D25] hover:bg-white"
                      }`}
                    >
                      Unstitched
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStitching("With Stitching Service")}
                      className={`flex-1 py-2.5 px-3 text-xs font-sans font-medium tracking-wider transition-all duration-200 cursor-pointer border rounded-xs ${
                        selectedStitching === "With Stitching Service"
                          ? "bg-[#5A1F2B] text-[#FAF6F0] border-[#5A1F2B] shadow-xs font-semibold"
                          : "bg-white/80 text-[#171717]/80 border-[#E6DCB8]/80 hover:border-[#855D25] hover:bg-white"
                      }`}
                    >
                      With Stitching Service
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. PRIMARY & SECONDARY ACTIONS + WISHLIST */}
            <div className="space-y-2.5 mb-6">
              {/* Row with ADD TO BAG and (Desktop only) Wishlist */}
              <div className="flex items-center gap-2.5">
                {/* PRIMARY CTA: ADD TO BAG → */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className={`w-full flex-1 h-[48px] sm:h-[50px] text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans shadow-xs ${
                    isAdded
                      ? "bg-[#2E5A36] text-white"
                      : "bg-[#5A1F2B] hover:bg-[#855D25] text-[#FAF6F0]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added To Royal Bag!</span>
                    </>
                  ) : (
                    <>
                      <span>ADD TO BAG</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {/* Desktop-only Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={
                    isWishlisted
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  title={isWishlisted ? "In Wishlist" : "Save to Wishlist"}
                  className="hidden sm:flex h-[50px] w-[50px] flex-shrink-0 border border-[#E6DCB8] hover:border-[#855D25] bg-white/70 items-center justify-center cursor-pointer transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 stroke-[1.5] transition-colors ${
                      isWishlisted
                        ? "fill-[#5A1F2B] text-[#5A1F2B]"
                        : "text-[#171717]/80 hover:text-[#5A1F2B]"
                    }`}
                  />
                </button>
              </div>

              {/* SECONDARY CTA: WHATSAPP TO ENQUIRE → */}
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full h-[46px] sm:h-[48px] bg-transparent hover:bg-[#855D25]/10 text-[#5A1F2B] hover:text-[#855D25] text-xs uppercase tracking-[0.2em] font-medium border border-[#5A1F2B]/40 hover:border-[#855D25] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <MessageCircle className="w-4 h-4 text-[#2E5A36] stroke-[1.8]" />
                <span>WHATSAPP TO ENQUIRE →</span>
              </button>
            </div>

            {/* 7. DETAILS ACCORDIONS */}
            <div className="border-t border-[#E6DCB8]/70 divide-y divide-[#E6DCB8]/50">
              {/* Accordion 1: DESCRIPTION */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("description")}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-[#171717] hover:text-[#855D25] transition-colors cursor-pointer font-sans"
                >
                  <span>DESCRIPTION</span>
                  <span className="text-xs text-[#855D25] font-light">
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
                      <div className="pt-3 text-xs text-[#171717]/80 font-sans leading-relaxed space-y-2">
                        <p>{product.description}</p>
                        <p className="text-[#855D25]">
                          Colour Palette: <strong>{product.color}</strong>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 2: CRAFT & DETAILS */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("craft")}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-[#171717] hover:text-[#855D25] transition-colors cursor-pointer font-sans"
                >
                  <span>CRAFT & DETAILS</span>
                  <span className="text-xs text-[#855D25] font-light">
                    {openAccordion === "craft" ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openAccordion === "craft" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 space-y-2">
                        <p className="text-xs font-semibold text-[#855D25] uppercase tracking-wider font-sans">
                          {product.craft}
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#171717]/80 font-sans">
                          {product.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#855D25] mt-0.5">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 3: FABRIC & CARE */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("fabric")}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-[#171717] hover:text-[#855D25] transition-colors cursor-pointer font-sans"
                >
                  <span>FABRIC & CARE</span>
                  <span className="text-xs text-[#855D25] font-light">
                    {openAccordion === "fabric" ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openAccordion === "fabric" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 text-xs text-[#171717]/80 font-sans leading-relaxed space-y-2">
                        <p>
                          <strong>Fabric Composition:</strong> {product.fabric}
                        </p>
                        <p>
                          <strong>Care Instructions:</strong> Dry clean only by heritage garment specialists.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 4: DELIVERY & RETURNS */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("delivery")}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-[#171717] hover:text-[#855D25] transition-colors cursor-pointer font-sans"
                >
                  <span>DELIVERY & RETURNS</span>
                  <span className="text-xs text-[#855D25] font-light">
                    {openAccordion === "delivery" ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openAccordion === "delivery" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 text-xs text-[#171717]/80 font-sans leading-relaxed space-y-2">
                        <p>
                          Standard domestic express delivery across India in protective heritage packaging.
                        </p>
                        <p>
                          Each ensemble is thoroughly inspected by our artisans prior to dispatch. For order updates, bespoke timelines, or delivery inquiries, please connect directly with us via WhatsApp.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ================= YOU MAY ALSO LIKE SECTION ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E6DCB8]/60 px-4 sm:px-6 lg:px-8">
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
