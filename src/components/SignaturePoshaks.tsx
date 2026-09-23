"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import {
  REAL_POSHAKS,
  PoshakProduct,
  getPoshakDisplayName,
  getCategoryEyebrow,
} from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";

interface SignaturePoshaksProps {
  onSelectProduct: (product: PoshakProduct) => void;
}

export default function SignaturePoshaks({
  onSelectProduct,
}: SignaturePoshaksProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  // 4 distinct signature creations (indices 4 to 8 of REAL_POSHAKS)
  const signatureProducts = REAL_POSHAKS.slice(4, 8);

  return (
    <section
      id="signature-poshaks"
      className="scroll-mt-20 md:scroll-mt-24 py-16 sm:py-20 md:py-24 lg:py-28 bg-[#F8F1E7]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-14">
          <div className="flex items-center justify-center gap-2.5 mb-2.5 sm:mb-3">
            <span className="h-[1px] w-5 bg-[#855D25]" />
            <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.3em] text-[#855D25] font-medium font-sans">
              EXCLUSIVE ATELIER
            </span>
            <span className="h-[1px] w-5 bg-[#855D25]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] text-[#171717] font-light tracking-wide leading-[1.15]">
            Signature Poshaks
          </h2>

          <p className="font-serif italic text-sm sm:text-base text-[#171717]/70 mt-2 font-normal">
            Heirloom ensembles handcrafted in pure georgette and fine zari
          </p>
        </div>

        {/* 4 Products Large Editorial Cards Grid (2 cols on mobile, 4 cols on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
          {signatureProducts.map((product, index) => {
            const isWishlisted = isInWishlist(product.id);
            const displayName = getPoshakDisplayName(product);
            const categoryLine = getCategoryEyebrow(product);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group flex flex-col cursor-pointer select-none"
                onClick={() => onSelectProduct(product)}
              >
                {/* Image Container: Tall 2:3 Aspect Ratio */}
                <div className="relative w-full aspect-[2/3] overflow-hidden bg-[#EAE0D2] shadow-sm border border-[#E6DCB8]/50">
                  <Image
                    src={product.image}
                    alt={displayName}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Subtle Vignette on Hover */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Product Info: Name, Price, and Action Icons */}
                <div className="pt-2.5 sm:pt-3.5 flex items-start justify-between gap-2">
                  <div className="text-left flex-1 min-w-0">
                    {/* Line 1: Category line → small uppercase, letter spacing, muted gold/brown */}
                    <span className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.22em] text-[#855D25] font-medium font-sans block mb-1 leading-none">
                      {categoryLine}
                    </span>

                    {/* Line 2: Product Name → serif, readable, slightly larger */}
                    <h3 className="font-serif text-[14.5px] sm:text-[16px] text-[#1F1C18] font-normal leading-snug group-hover:text-[#855D25] transition-colors mb-1">
                      {displayName}
                    </h3>

                    {/* Line 3: Price & Note */}
                    <div className="flex items-baseline gap-2 mt-0.5">
                      {product.originalPrice && (
                        <span className="text-xs text-[#8C827A] line-through font-sans font-normal">
                          {product.originalPrice}
                        </span>
                      )}
                      <span
                        className={`text-[13px] sm:text-[14px] font-sans font-semibold tracking-wide ${
                          product.originalPrice ? "text-[#5A1F2B]" : "text-[#2B2723]"
                        }`}
                      >
                        {product.price}
                      </span>
                    </div>
                  </div>

                  {/* Subtle Action Icons: Bag & Wishlist */}
                  <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 pt-0.5">
                    {/* Shopping Bag: Opens PDP */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      aria-label={`View poshak details for ${product.name}`}
                      title="View Details"
                      className="p-1 text-[#171717]/35 hover:text-[#5A1F2B] transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.2]" />
                    </button>

                    {/* Wishlist Heart */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      aria-label={`Add ${product.name} to wishlist`}
                      title="Save to Wishlist"
                      className="p-1 text-[#171717]/35 hover:text-[#5A1F2B] transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.2] transition-colors duration-300 ${
                          isWishlisted
                            ? "fill-[#5A1F2B] text-[#5A1F2B]"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
