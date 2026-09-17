"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CraftBehindThePoshakProps {
  onOpenConsultation?: () => void;
}

export default function CraftBehindThePoshak({
  onOpenConsultation,
}: CraftBehindThePoshakProps) {
  return (
    <section
      id="craft"
      className="scroll-mt-20 md:scroll-mt-24 pt-6 sm:pt-7 md:pt-8 lg:pt-10 pb-10 sm:pb-12 md:pb-16 lg:pb-20 bg-[#F8F1E7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Mobile: Vertical Single Column | Desktop: 12-Col Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 lg:gap-8 xl:gap-10 items-center">
          {/* Top/Left Column: Dominant Craftsmanship Close-Up Visual (4:5 on Mobile, 14:10 on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:col-span-7 relative group"
          >
            {/* Main Editorial Macro Visual Container: Prominent 4:5 ratio on mobile */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[14/10] overflow-hidden bg-[#EAE0D2] shadow-[0_10px_35px_rgba(90,31,43,0.06)] border border-[#E6DCB8]/80">
              <Image
                src="/craft_poshak_detail.webp"
                alt="Intricate Handcrafted Gota Patti and Zari Needlework on Royal Rajputi Poshak"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                priority
              />

              {/* Gentle Warm Luxury Lighting Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/25 via-transparent to-transparent pointer-events-none" />

              {/* Small Overlaid Label */}
              <div className="absolute bottom-3.5 left-3.5 sm:bottom-5 sm:left-5 px-3 sm:px-3.5 py-1.5 bg-[#FAF6F0]/95 backdrop-blur-sm border border-[#C6A15B]/35 pointer-events-none">
                <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.26em] text-[#5A1F2B] font-medium font-sans">
                  HANDCRAFTED GOTAPATTI &amp; KASAB ZARI
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bottom/Right Column: Refined Editorial Typography */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-center text-left mt-1 sm:mt-2 lg:mt-0"
          >
            {/* Small Gold Eyebrow */}
            <div className="flex items-center gap-2.5 mb-3 sm:mb-3.5 lg:mb-5">
              <span className="h-[1px] w-5 bg-[#855D25]" />
              <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.3em] text-[#855D25] font-medium font-sans">
                THE CRAFT BEHIND THE POSHAK
              </span>
            </div>

            {/* Large Serif Headline: Intentional 2-Line Editorial Break */}
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] xl:text-[48px] text-[#171717] font-light leading-[1.14] tracking-wide mb-4 sm:mb-5 lg:mb-6 max-w-[420px]">
              Every thread<br />
              carries a story.
            </h2>

            {/* 2-Line Editorial Description */}
            <p className="font-sans text-[13.5px] sm:text-[14.5px] lg:text-[15.5px] text-[#171717]/75 font-light leading-[1.75] tracking-normal mb-6 sm:mb-7 lg:mb-9 max-w-lg">
              From intricate embroidery to delicate borders, every Poshak is
              created with an eye for detail and a deep respect for tradition.
            </p>

            {/* Premium Editorial CTA: Understated, Lighter, Refined */}
            <div className="inline-flex">
              <Link
                href="/our-heritage"
                className="group inline-flex flex-col items-start cursor-pointer text-left focus:outline-none"
                aria-label="Discover Our Heritage"
              >
                <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.28em] font-normal font-sans text-[#5A1F2B] group-hover:text-[#3D141C] transition-colors">
                  DISCOVER OUR HERITAGE
                </span>

                {/* Left-to-Right Animated Underline: Refined & Subtle */}
                <div className="relative w-full h-[1px] mt-1.5 bg-[#5A1F2B]/15 overflow-hidden">
                  <span className="absolute inset-0 bg-[#5A1F2B]/85 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
