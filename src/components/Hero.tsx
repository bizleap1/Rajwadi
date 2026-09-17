"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full h-[100svh] min-h-[100svh] max-h-none md:h-screen md:min-h-[100dvh] flex items-end md:items-center overflow-hidden bg-charcoal">
      {/* Background Image: Mobile focuses vertically on model at center-right with full poshak flare and palace background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src="/hero_bg.webp"
          alt="Royal Indian Rajputi Poshak Couture Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[80%_18%] sm:object-[80%_20%] md:object-[79%_22%] lg:object-[79%_22%] filter contrast-[1.02] saturate-[1.04]"
        />

        {/* Subtle Overall Vignette: Soft natural peripheral darkening */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.18) 100%)",
          }}
        />

        {/* Top Navbar Vignette on Mobile (Protects top logo & icons) */}
        <div className="absolute inset-x-0 top-0 h-24 md:hidden bg-gradient-to-b from-[#0F0F0F]/65 to-transparent pointer-events-none" />

        {/* Mobile Bottom-Left Editorial Gradient: Soft natural darkening toward bottom-left text, keeping model center-right clear */}
        <div
          className="absolute inset-0 md:hidden pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(10, 8, 7, 0.92) 0%, rgba(10, 8, 7, 0.65) 26%, rgba(10, 8, 7, 0.25) 45%, transparent 68%), linear-gradient(to right, rgba(10, 8, 7, 0.60) 0%, rgba(10, 8, 7, 0.20) 40%, transparent 65%)",
          }}
        />

        {/* Desktop Left-to-Right Cinematic Gradient: Darker left 35-40% for typography readability, smoothly blending to complete transparency on the right */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(15, 15, 15, 0.78) 0%, rgba(15, 15, 15, 0.58) 22%, rgba(15, 15, 15, 0.25) 45%, rgba(15, 15, 15, 0.05) 68%, rgba(15, 15, 15, 0) 100%)",
          }}
        />

        {/* Very Subtle Bottom Vignette (Soft grounding transition into Collections section) */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0F0F0F]/20 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content with Exact Same Left Alignment as Navbar */}
      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 md:px-12 w-full pb-9 sm:pb-12 md:pb-0 md:pt-10">
        <div className="max-w-xl text-royal-ivory text-left">
          {/* Small Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-2 sm:mb-3.5 md:mb-5"
          >
            <span className="text-[9.5px] min-[375px]:text-[10.5px] md:text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-[#F7D596] font-medium font-sans [text-shadow:_0_1px_3px_rgba(0,0,0,0.85)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              RAJWADI RAJPUTI POSHAK
            </span>
          </motion.div>

          {/* Main Headline: Compact & Editorial on Mobile, Royal Font Light */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="font-serif text-[30px] min-[375px]:text-[34px] min-[414px]:text-[38px] sm:text-5xl lg:text-[54px] font-light leading-[1.12] tracking-wide mb-4 sm:mb-6 md:mb-8 text-royal-ivory drop-shadow-sm"
          >
            The Art Of<br />
            Rajputi Elegance
          </motion.h1>

          {/* Luxury Editorial Fashion CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="flex items-center"
          >
            <Link
              href="#collections"
              className="inline-flex items-center justify-center px-6 py-2.5 min-[375px]:px-7 min-[375px]:py-3 bg-heritage-maroon hover:bg-[#431520] text-royal-ivory text-[10.5px] min-[375px]:text-[11px] md:text-xs tracking-[0.2em] font-medium border border-antique-gold hover:border-antique-gold-light transition-all duration-300 shadow-[0_4px_20px_rgba(90,31,43,0.4)] group active:scale-[0.98]"
            >
              <span>Explore Collection</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

