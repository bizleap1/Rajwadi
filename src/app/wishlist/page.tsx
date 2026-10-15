"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Heart, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { REAL_POSHAKS, PoshakProduct } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";

const TalkToDesignerModal = dynamic(
  () => import("@/components/TalkToDesignerModal"),
  { ssr: false }
);
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
});

export default function WishlistPage() {
  const { wishlistIds, addToWishlist } = useWishlist();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Undo toast state
  const [removedProduct, setRemovedProduct] = useState<PoshakProduct | null>(
    null
  );
  const undoTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Filter products that exist in wishlist
  const savedProducts = React.useMemo(() => {
    return REAL_POSHAKS.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds]);

  const handleProductRemoved = (product: PoshakProduct) => {
    setRemovedProduct(product);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
      setRemovedProduct(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (removedProduct) {
      addToWishlist(removedProduct.id);
      setRemovedProduct(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#FAF6F0]">
      {/* 1. SOLID NAVBAR */}
      <Navbar
        solidOnTop={true}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* 2. MAIN CONTENT (Controlled, mobile-focused spacing) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-[72px] sm:pt-24 pb-14 sm:pb-20">
        {/* Subtle Minimal Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-3 sm:mb-4 font-sans"
        >
          <Link
            href="/"
            className="hover:text-[#5A1F2B] transition-colors duration-200"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
          <Link
            href="/collection"
            className="hover:text-[#5A1F2B] transition-colors duration-200"
          >
            Collection
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
          <span className="text-[#5A1F2B] font-semibold">Wishlist</span>
        </nav>

        {/* Compact Centered Header */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <h1 className="font-serif text-[26px] sm:text-3xl md:text-4xl text-[#171717] font-normal tracking-[0.06em] uppercase">
            YOUR WISHLIST
          </h1>

          {savedProducts.length > 0 && (
            <p className="font-serif italic text-xs sm:text-[13.5px] text-[#6B635B] mt-1 sm:mt-1.5">
              {savedProducts.length}{" "}
              {savedProducts.length === 1 ? "Poshak" : "Poshaks"} saved
            </p>
          )}

          {/* Hairline Divider */}
          <div className="w-16 sm:w-20 h-[1px] bg-[#E6DCB8]/80 mx-auto mt-2.5 sm:mt-3" />
        </div>

        {/* 3. PRODUCT GRID OR EMPTY STATE */}
        {savedProducts.length > 0 ? (
          <div className="w-full mt-4 sm:mt-6">
            {/* 2-Column Mobile Grid, 3 on Tablet, 4 on Desktop (10-12px col gap, 28-32px row gap) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[11px] sm:gap-x-4 md:gap-x-6 gap-y-7 sm:gap-y-8 md:gap-y-10">
              <AnimatePresence>
                {savedProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard
                      product={product}
                      index={idx}
                      onRemove={handleProductRemoved}
                      showOverlayCTA={true}
                      heartPosition="top-right"
                      showDescription={false}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* 4. CLEAN EMPTY STATE */
          <div className="py-14 sm:py-20 text-center max-w-sm mx-auto px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 rounded-full border border-[#E6DCB8] bg-[#FAF6F0] flex items-center justify-center text-[#855D25]">
              <Heart className="w-5 h-5 stroke-[1.25]" />
            </div>

            <h2 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal mb-2">
              Nothing saved yet.
            </h2>

            <p className="font-serif italic text-xs sm:text-sm text-[#6B635B] leading-relaxed mb-6">
              Explore the collection and save the Poshaks you&apos;d like to
              come back to.
            </p>

            <Link
              href="/collection"
              className="inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium font-sans text-[#FAF6F0] bg-[#5A1F2B] hover:bg-[#855D25] py-3 px-6 sm:px-7 transition-colors duration-300 shadow-xs"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </main>

      {/* 5. SUBTLE REMOVED FEEDBACK TOAST WITH UNDO ACTION */}
      <AnimatePresence>
        {removedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#171717] text-[#FAF6F0] px-4 py-3 shadow-xl border border-[#C6A15B]/40 flex items-center justify-between gap-3 text-xs font-sans rounded-xs"
          >
            <span className="text-[#FAF6F0]/90 truncate">
              Removed <strong className="font-serif font-normal text-[#C6A15B]">{removedProduct.name}</strong>
            </span>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 text-[#C6A15B] hover:text-[#FAF6F0] uppercase tracking-wider font-semibold underline underline-offset-2 transition-colors cursor-pointer flex-shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              UNDO
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. FOOTER */}
      <Footer onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 7. INTERACTIVE MODALS */}
      <TalkToDesignerModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
      <CartDrawer onOpenConsultation={() => setIsConsultationOpen(true)} />
    </div>
  );
}
