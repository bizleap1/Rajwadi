"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import {
  REAL_POSHAKS,
  PoshakProduct,
  getPoshakDisplayName,
  getCategoryEyebrow,
} from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface ThePoshakEditProps {
  onSelectProduct?: (product: PoshakProduct) => void;
}

export default function ThePoshakEdit({ onSelectProduct }: ThePoshakEditProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  // Exactly 4 featured products for the clean horizontal row (4–6 products)
  const featuredProducts = REAL_POSHAKS.slice(0, 4);

  return (
    <>
      <section
        id="poshak-edit"
        className="scroll-mt-20 md:scroll-mt-24 pt-5 sm:pt-6 md:pt-8 pb-4 sm:pb-5 md:pb-6 bg-[#F8F1E7] transition-colors"
      >
        {/* Anchor alias so any legacy #featured links scroll smoothly here */}
        <span id="featured" className="sr-only" />

        <div className="max-w-7xl mx-auto px-[18px] sm:px-6 md:px-12">
          {/* Section Header: Focused, Visual-Heavy, Symmetrical Gold Eyebrow */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-14">
            <div className="flex items-center justify-center gap-3 mb-2 sm:mb-2.5">
              <span className="h-[1px] w-6 bg-[#855D25]" />
              <span className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-medium font-sans">
                THE POSHAK EDIT
              </span>
              <span className="h-[1px] w-6 bg-[#855D25]" />
            </div>
            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-[#171717] font-light tracking-wide">
              Selected pieces from Rajwadi
            </h2>
          </div>

          {/* Product Cards: 2 Columns on Mobile; Exactly 4 in One Row on Desktop */}
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {featuredProducts.map((product, index) => {
                const isWishlisted = isInWishlist(product.id);
                const isSoldOut = Boolean(
                  product.soldOut ||
                    product.price === "Sold Out" ||
                    (typeof product.price === "string" &&
                      product.price.toLowerCase().includes("sold"))
                );
                const secondImage =
                  product.additionalImages && product.additionalImages.length > 1
                    ? product.additionalImages[1]
                    : null;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="group flex flex-col cursor-pointer select-none relative"
                    >
                      {/* Image Container: Consistent 2:3 Aspect Ratio Across Mobile & Desktop */}
                      <div className="relative w-full aspect-[2/3] overflow-hidden bg-[#EAE0D2] shadow-sm">
                        {/* Image Zoom & Crossfade Wrapper: 1.02x scale maximum, 500ms ease-in-out */}
                        <div className="absolute inset-0 transition-transform duration-500 ease-in-out sm:group-hover:scale-[1.02]">
                          {/* Default Front Image */}
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                            className={`object-cover object-top transition-opacity duration-500 ease-in-out ${
                              isSoldOut ? "grayscale-[15%]" : ""
                            } ${
                              secondImage ? "sm:group-hover:opacity-0" : ""
                            }`}
                          />

                          {/* Second/Back/Side Image: Smooth 500ms ease-in-out crossfade on desktop hover */}
                          {secondImage && (
                            <Image
                              src={secondImage}
                              alt={`${product.name} alternate view`}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover object-top opacity-0 transition-opacity duration-500 ease-in-out sm:group-hover:opacity-100"
                              loading="eager"
                            />
                          )}
                        </div>

                        {/* Top-Left Sold Out Badge */}
                        {isSoldOut && (
                          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 pointer-events-none">
                            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#4A1520]/95 text-[#FFF6E9] text-[9.5px] sm:text-[10.5px] font-sans font-bold uppercase tracking-[0.2em] rounded-xs shadow-md border border-[#D4AF37]/60 backdrop-blur-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] animate-pulse" />
                              Sold Out
                            </span>
                          </div>
                        )}

                        {/* Soft dark tint for sold out piece */}
                        {isSoldOut && (
                          <div className="absolute inset-0 bg-black/15 pointer-events-none z-10" />
                        )}

                        {/* Subtle Lower Image Gradient for Button Contrast */}
                        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-black/45 via-black/15 to-transparent pointer-events-none transition-opacity duration-300" />

                        {/* VIEW SET → CTA: Refined dark black overlay CTA */}
                        <div className="absolute inset-x-0 bottom-3.5 sm:bottom-4 flex justify-center px-3 pointer-events-none z-10">
                          <div className="pointer-events-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-[#222222] hover:bg-black text-white text-[10px] sm:text-[10.5px] uppercase tracking-[0.2em] font-medium font-sans shadow-md backdrop-blur-xs transition-all duration-300 flex items-center justify-center gap-1.5 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 active:scale-[0.98]">
                            <span>{isSoldOut ? "VIEW ARCHIVED PIECE" : "VIEW SET"}</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                              →
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Product Info: Name, Category, Description & Price on Left; Heart & Bag on Right */}
                      <div className="pt-2.5 sm:pt-3.5 flex items-start justify-between gap-2">
                        <div className="text-left flex-1 min-w-0">
                          {/* Line 1: Category line → small uppercase, letter spacing, muted gold/brown */}
                          <span className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.22em] text-[#855D25] font-medium font-sans block mb-1 leading-none truncate w-full">
                            {getCategoryEyebrow(product)}
                          </span>

                          {/* Line 2: Product Name → serif, readable, slightly larger */}
                          <h3 className="font-serif text-[15px] sm:text-[16.5px] text-[#1F1C18] font-normal leading-snug group-hover:text-[#855D25] transition-colors duration-300 truncate w-full mb-1">
                            {getPoshakDisplayName(product)}
                          </h3>

                          {/* Line 3: Price & Note */}
                          <div className="flex items-baseline gap-2 mt-0.5">
                            {product.originalPrice && (
                              <span className="text-xs text-[#8C827A] line-through font-sans font-normal">
                                {product.originalPrice}
                              </span>
                            )}
                            <span
                              className={`text-[13px] sm:text-[14px] font-sans tracking-wide ${
                                isSoldOut
                                  ? "text-[#8B263E] font-bold uppercase tracking-wider"
                                  : product.originalPrice
                                  ? "text-[#5A1F2B] font-semibold"
                                  : "text-[#2B2723] font-semibold"
                              }`}
                            >
                              {product.price}
                            </span>
                          </div>
                        </div>

                        {/* Action Icons: Wishlist Heart & Shopping Bag */}
                        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 pt-0.5">
                          {/* Wishlist Heart */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isSoldOut) return;
                              toggleWishlist(product.id);
                            }}
                            disabled={isSoldOut}
                            aria-label={
                              isWishlisted
                                ? `Remove ${product.name} from wishlist`
                                : `Add ${product.name} to wishlist`
                            }
                            title={isSoldOut ? "Sold Out" : isWishlisted ? "In Wishlist" : "Save to Wishlist"}
                            className={`p-1 transition-colors ${
                              isSoldOut ? "text-gray-300 cursor-not-allowed" : "text-[#333333] hover:text-[#5A1F2B] cursor-pointer"
                            }`}
                          >
                            <Heart
                              className={`w-[18px] h-[18px] stroke-[1.25] transition-colors duration-300 ${
                                isWishlisted
                                  ? "fill-[#5A1F2B] text-[#5A1F2B]"
                                  : isSoldOut ? "text-gray-300" : "text-[#333333] hover:text-[#5A1F2B]"
                              }`}
                            />
                          </button>

                          {/* Shopping Bag: Add to Bag */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isSoldOut) return;
                              addToCart(product);
                              setIsCartOpen(true);
                            }}
                            disabled={isSoldOut}
                            aria-label={isSoldOut ? "Sold Out" : `Add ${product.name} to royal bag`}
                            title={isSoldOut ? "Sold Out" : "Add to Royal Bag"}
                            className={`p-1 transition-colors ${
                              isSoldOut ? "text-gray-300 cursor-not-allowed" : "text-[#333333] hover:text-[#5A1F2B] cursor-pointer"
                            }`}
                          >
                            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.25]" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Section Bottom CTA: View All Poshaks with Left-to-Right Filling Underline (Tightened Spacing, No Arrow) */}
          <div className="mt-4 sm:mt-5 text-center">
            <Link
              href="/collection"
              className="group inline-flex flex-col items-center cursor-pointer"
            >
              <span className="text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.24em] font-medium font-sans text-[#5A1F2B] group-hover:text-[#431520] transition-colors">
                View All Poshaks
              </span>

              {/* Underline: Default subtle maroon, fills solid maroon left-to-right on hover */}
              <div className="relative w-full h-[1px] mt-1.5 bg-[#5A1F2B]/25 overflow-hidden">
                <span className="absolute inset-0 bg-[#5A1F2B] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
