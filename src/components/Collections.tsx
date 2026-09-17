"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTIONS_DATA, CollectionItem } from "@/data/products";

export default function Collections() {
  const stitchedItem = COLLECTIONS_DATA[0];
  const unstitchedItem = COLLECTIONS_DATA[1];
  const traditionalItem = COLLECTIONS_DATA[2];

  const getFramingClass = (id: string) => {
    if (id === "traditional-poshaks") return "poshak-img-traditional";
    if (id === "stitched-poshaks") return "poshak-img-stitched";
    if (id === "unstitched-poshaks") return "poshak-img-unstitched";
    return "object-center";
  };

  const renderCard = (
    item: CollectionItem,
    isFeaturedWide = false,
    delay = 0
  ) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="w-full"
      >
        <Link
          href="#featured"
          className="group block relative overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A15B]"
          aria-label={`Explore ${item.title}`}
        >
          {/* Image Container: Controlled Scale with Subtle scale(1.035) Hover */}
          <div
            className={`relative w-full overflow-hidden bg-[#EFE6D8]/60 ${isFeaturedWide
                ? "h-[330px] sm:h-[370px] md:h-[405px] lg:h-[435px]"
                : "h-[380px] sm:h-[420px] md:h-[455px] lg:h-[480px]"
              }`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes={
                isFeaturedWide
                  ? "(max-width: 768px) 100vw, 1200px"
                  : "(max-width: 768px) 100vw, 600px"
              }
              className={`object-cover ${getFramingClass(item.id)} ${item.imagePositionMobile} ${item.imagePositionDesktop}`}
            />

            {/* Subtle Localized Lower Gradient behind Text — Preserves Original Photography */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/75 via-[#0C0A09]/25 via-30% to-transparent pointer-events-none transition-opacity duration-500" />

            {/* Editorial On-Image Text Overlay: Exact Consistent 24px Mobile / 32px Desktop Margins */}
            <div className="absolute inset-0 p-6 sm:p-7 md:p-8 flex flex-col justify-end pointer-events-none">
              <div className="max-w-md text-left">
                {/* Collection Title: Cormorant Garamond, Elegant Font Normal */}
                <h3 className="font-serif text-[24px] sm:text-[27px] md:text-[30px] lg:text-[33px] text-[#F8F1E7] font-normal tracking-[0.015em] leading-[1.15] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] mb-2 sm:mb-2.5 transition-colors duration-500 group-hover:text-white">
                  {item.title}
                </h3>

                {/* Supporting CTA: Clean Text + Left-to-Right Filling White Underline (No Arrow) */}
                <div className="inline-flex flex-col items-start">
                  <span className="text-[10.5px] sm:text-[11px] md:text-[11.5px] uppercase tracking-[0.22em] font-medium font-sans text-[#F8F1E7] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                    Explore Collection
                  </span>

                  {/* Underline: Default subtle white, fills solid white left-to-right on hover */}
                  <div className="relative w-full h-[1px] mt-1 bg-white/35 overflow-hidden">
                    <span className="absolute inset-0 bg-white origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <section
      id="collections"
      className="scroll-mt-20 md:scroll-mt-24 pt-8 sm:pt-10 md:pt-12 pb-5 sm:pb-6 md:pb-7 bg-[#F8F1E7]"
    >
      <div className="max-w-7xl mx-auto px-[18px] sm:px-6 md:px-12">
        {/* Section Header: Compact, Instantly Visible */}
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8 md:mb-9">
          {/* Eyebrow: Rich Deep Royal Gold #855D25 for High Contrast & Readability */}
          <div className="flex items-center justify-center gap-3 mb-2 sm:mb-2.5">
            <span className="h-[1px] w-6 bg-[#855D25]" />
            <span className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-medium font-sans">
              THE COLLECTIONS
            </span>
            <span className="h-[1px] w-6 bg-[#855D25]" />
          </div>

          {/* Headline: Royal Font Light */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] text-[#171717] font-light tracking-wide leading-[1.15]">
            Explore The Poshak Collection
          </h2>
        </div>

        {/* Asymmetric Editorial Composition: Ultra-Slim Seamless Gap */}
        <div className="space-y-3.5 sm:space-y-4">
          {/* Top Row: Stitched + Unstitched side by side with ultra-slim 10-12px gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 md:gap-3 lg:gap-3.5">
            {stitchedItem && renderCard(stitchedItem, false, 0.05)}
            {unstitchedItem && renderCard(unstitchedItem, false, 0.1)}
          </div>

          {/* Bottom Row: Traditional as a wider, shorter featured image */}
          {traditionalItem && (
            <div className="w-full">
              {renderCard(traditionalItem, true, 0.15)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
