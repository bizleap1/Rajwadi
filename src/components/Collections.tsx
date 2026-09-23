"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTIONS_DATA, CollectionItem } from "@/data/products";

export default function Collections() {
  const getFramingClass = (id: string) => {
    if (id === "jewellery") return "object-center";
    return "object-top";
  };

  const getCategoryHref = (id: string) => {
    if (id === "bridal-poshaks") return "/collection?category=bridal";
    if (id === "festive-poshaks") return "/collection?category=festive";
    if (id === "everyday-poshaks") return "/collection?category=everyday";
    if (id === "jewellery") return "/collection?category=jewellery";
    return "/collection";
  };

  const renderCard = (
    item: CollectionItem,
    isFeaturedWide = false,
    delay = 0
  ) => {
    const mainHref = getCategoryHref(item.id);

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="w-full group relative overflow-hidden"
      >
        {/* Image Container: Controlled Scale with Subtle scale(1.02) Hover */}
        <div
          className={`relative w-full overflow-hidden bg-[#EFE6D8]/60 ${
            isFeaturedWide
              ? "h-[330px] sm:h-[370px] md:h-[405px] lg:h-[435px]"
              : "h-[380px] sm:h-[420px] md:h-[455px] lg:h-[480px]"
          }`}
        >
          {/* Main Clickable Backdrop */}
          <Link
            href={mainHref}
            className="absolute inset-0 z-0"
            aria-label={`Explore ${item.title}`}
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
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] ${getFramingClass(
                item.id
              )} ${item.imagePositionMobile} ${item.imagePositionDesktop}`}
            />

            {/* Subtle Localized Lower Gradient behind Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/85 via-[#0C0A09]/30 via-35% to-transparent pointer-events-none transition-opacity duration-500" />
          </Link>

          {/* Editorial On-Image Text Overlay */}
          <div className="absolute inset-0 p-6 sm:p-7 md:p-8 flex flex-col justify-end pointer-events-none z-10">
            <div className="max-w-md text-left">
              {/* Collection Title */}
              <Link href={mainHref} className="pointer-events-auto block">
                <h3 className="font-serif text-[24px] sm:text-[27px] md:text-[30px] lg:text-[33px] text-[#F8F1E7] font-normal tracking-[0.015em] leading-[1.15] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] mb-2 sm:mb-2.5 transition-colors duration-500 group-hover:text-white">
                  {item.title}
                </h3>
              </Link>

              {/* Subcategories / Types (Stitched, Poshak Material) */}
              {item.subCategories && item.subCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-3 pointer-events-auto">
                  {item.subCategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={sub.href}
                      className="px-2.5 py-1 text-[10px] sm:text-[10.5px] uppercase tracking-[0.16em] font-sans text-[#FAF6F0] bg-black/45 hover:bg-[#5A1F2B] hover:text-white border border-[#C6A15B]/40 hover:border-[#C6A15B] transition-all backdrop-blur-xs rounded-xs"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Supporting CTA */}
              <Link
                href={mainHref}
                className="inline-flex flex-col items-start pointer-events-auto group/cta"
              >
                <span className="text-[10.5px] sm:text-[11px] md:text-[11.5px] uppercase tracking-[0.22em] font-medium font-sans text-[#F8F1E7] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] group-hover/cta:text-[#C6A15B] transition-colors">
                  Explore Collection
                </span>

                {/* Underline */}
                <div className="relative w-full h-[1px] mt-1 bg-white/35 overflow-hidden">
                  <span className="absolute inset-0 bg-white origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </div>
              </Link>
            </div>
          </div>
        </div>
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

        {/* 2x2 Luxury Grid for the 4 Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
          {COLLECTIONS_DATA.map((item, index) =>
            renderCard(item, false, index * 0.08)
          )}
        </div>
      </div>
    </section>
  );
}
