"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTIONS_DATA, CollectionItem } from "@/data/products";

export default function Collections() {
  const bridalItem = COLLECTIONS_DATA[0];
  const festiveItem = COLLECTIONS_DATA[1];
  const traditionalItem = COLLECTIONS_DATA[2];

  const renderCard = (
    item: CollectionItem,
    isFeaturedWide = false,
    delay = 0
  ) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, delay }}
        className="w-full"
      >
        <Link
          href="#featured"
          className="group block focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A15B]"
          aria-label={`Explore ${item.title}`}
        >
          {/* Image Container: 80% Visual Dominance with Subtle scale(1.03) Hover */}
          <div
            className={`relative w-full overflow-hidden bg-[#EFE6D8]/60 ${
              isFeaturedWide
                ? "aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/10] md:h-[480px] lg:h-[540px]"
                : "aspect-[4/5] md:aspect-[4/5] lg:aspect-[3/4] md:h-[560px] lg:h-[620px]"
            }`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes={
                isFeaturedWide
                  ? "(max-width: 768px) 100vw, 100vw"
                  : "(max-width: 768px) 100vw, 50vw"
              }
              className={`object-cover ${
                isFeaturedWide
                  ? `${item.imagePositionMobile} md:${item.imagePositionDesktop}`
                  : `${item.imagePositionMobile} md:${item.imagePositionDesktop}`
              } transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
            />
          </div>

          {/* Clean Editorial Caption Below Image: 20% Text, No Dark Box, No Badges */}
          <div className="pt-4 sm:pt-5 pb-1 flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-2xl sm:text-[26px] md:text-3xl text-[#171717] font-normal tracking-wide">
              {item.title}
            </h3>

            <div className="inline-flex items-center text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#171717]/85 group-hover:text-[#5A1F2B] transition-colors shrink-0 font-medium">
              <span>Explore Collection</span>
              <span className="ml-2 text-[#C6A15B] transition-transform duration-300 group-hover:translate-x-1.5 font-sans">
                →
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <section
      id="collections"
      className="pt-7 sm:pt-9 md:pt-12 pb-16 sm:pb-20 md:pb-24 lg:pb-28 bg-[#F8F1E7] border-b border-[#E8D8C4]/60"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14">
          {/* Eyebrow: Antique Gold #C6A15B */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-2.5 sm:mb-3"
          >
            <span className="h-[1px] w-6 bg-[#C6A15B]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-medium font-sans">
              THE COLLECTIONS
            </span>
            <span className="h-[1px] w-6 bg-[#C6A15B]" />
          </motion.div>

          {/* Headline: Charcoal #171717, No Paragraph */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#171717] font-normal tracking-wide leading-[1.15]"
          >
            Timeless Poshaks,
            <br className="hidden sm:inline" />{" "}
            Rooted in Heritage
          </motion.h2>
        </div>

        {/* Asymmetric Editorial Composition */}
        <div className="space-y-10 sm:space-y-12 md:space-y-12 lg:space-y-16">
          {/* Top Row: Bridal + Festive side by side on Desktop; 1 large image at a time on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-10 lg:gap-14">
            {bridalItem && renderCard(bridalItem, false, 0.1)}
            {festiveItem && renderCard(festiveItem, false, 0.2)}
          </div>

          {/* Bottom Row: Traditional as a wider featured image on Desktop; 1 large image at a time on Mobile */}
          {traditionalItem && (
            <div className="w-full">
              {renderCard(traditionalItem, true, 0.25)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
