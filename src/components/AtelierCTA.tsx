"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface AtelierCTAProps {
  onOpenConsultation?: () => void;
}

export default function AtelierCTA({ onOpenConsultation }: AtelierCTAProps) {
  return (
    <section
      id="collection-cta"
      className="relative w-full min-h-[55vh] md:min-h-[62vh] max-h-[650px] flex items-center justify-center overflow-hidden py-16 sm:py-20 md:py-24 px-5 sm:px-6 md:px-8"
    >
      {/* Full-Width Cinematic Background Image: Quiet Heritage Palace Corridor */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src="/royal_heritage_corridor.webp"
          alt="Rajwadi Heritage Palace Interior Corridor"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.9] contrast-[1.04]"
        />

        {/* Subtle Dark Burgundy & Atmospheric Vignette Overlay */}
        <div className="absolute inset-0 bg-[#2A0C13]/60 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09]/45 via-[#2A0C13]/50 to-[#0C0A09]/80 pointer-events-none" />
      </div>

      {/* Content Container: Centered, Quiet Luxury Typography */}
      <div className="relative z-10 max-w-3xl mx-auto w-full text-center text-[#F8F1E7]">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-3.5 sm:mb-4"
        >
          <span className="h-[1px] w-6 sm:w-8 bg-[#C6A15B]/70" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#E5C384] font-medium font-sans">
            THE RAJWADI COLLECTION
          </span>
          <span className="h-[1px] w-6 sm:w-8 bg-[#C6A15B]/70" />
        </motion.div>

        {/* Heading: Large Serif / Italic */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-[#FAF6F0] font-normal leading-[1.18] tracking-wide mb-4 sm:mb-5"
        >
          Find the Poshak
          <br className="hidden sm:inline" /> that feels like you.
        </motion.h2>

        {/* Description: Small, Restrained Editorial Body */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="font-sans text-[13px] sm:text-[14.5px] text-[#F8F1E7]/85 font-light leading-relaxed max-w-lg mx-auto mb-8 sm:mb-9"
        >
          Explore timeless styles, traditional details,
          <br className="hidden sm:inline" /> and Poshaks made for your most
          meaningful occasions.
        </motion.p>

        {/* One Burgundy / Gold Outlined CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex items-center justify-center"
        >
          <Link
            href="/collection"
            className="group inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#3B121A]/75 hover:bg-[#4A1521] text-[#F8F1E7] hover:text-[#FFFFFF] text-[11px] sm:text-xs uppercase tracking-[0.26em] font-medium border border-[#C6A15B]/70 hover:border-[#E5C384] transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.35)] active:scale-[0.98]"
          >
            <span>EXPLORE THE COLLECTION</span>
            <span className="font-serif text-sm leading-none transition-transform duration-300 ease-out group-hover:translate-x-1 text-[#E5C384]">
              &rarr;
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
