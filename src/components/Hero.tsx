"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full h-[80svh] min-h-[580px] max-h-[740px] md:h-screen md:min-h-[100dvh] md:max-h-none flex items-end md:items-center overflow-hidden bg-charcoal">
      {/* Background Image: Mobile focuses vertically on the majestic model and poshak embroidery; Desktop shows full couture composition */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src="/hero_couture.jpg"
          alt="Royal Indian Rajputi Poshak Couture Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[83%_16%] sm:object-[82%_24%] md:object-[84%_42%] lg:object-[85%_42%] filter contrast-[1.05] saturate-[1.08] brightness-[1.02]"
        />

        {/* Top Navbar Vignette on Mobile (Protects top logo & icons) */}
        <div className="absolute inset-x-0 top-0 h-28 md:hidden bg-gradient-to-b from-[#0F0C0B]/75 via-[#0F0C0B]/25 to-transparent pointer-events-none" />

        {/* Mobile Lower Editorial Gradient: Warm/dark wash toward lower portion for effortless typography readability */}
        <div className="absolute inset-x-0 bottom-0 h-[68%] md:hidden bg-gradient-to-t from-[#0F0C0B]/95 via-[#0F0C0B]/60 via-40% to-transparent pointer-events-none" />

        {/* Desktop Localized Gradient: Left text area only, fading to transparent well before model */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-[52%] lg:w-[46%] bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent pointer-events-none" />
        <div className="hidden md:block absolute inset-y-0 left-0 w-[45%] pointer-events-none bg-[radial-gradient(ellipse_at_20%_48%,rgba(18,14,13,0.65)_0%,rgba(18,14,13,0.25)_50%,transparent_80%)]" />
      </div>

      {/* Hero Content with Independent Responsive Architecture */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 min-[375px]:px-6 md:px-14 lg:pl-[110px] lg:pr-12 w-full pb-8 min-[375px]:pb-10 sm:pb-12 md:pb-0 md:pt-10">
        <div className="max-w-xl text-royal-ivory">
          {/* Small Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-2.5 sm:mb-4 md:mb-5"
          >
            <span className="text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.32em] sm:tracking-[0.35em] text-[#F7D596] font-medium font-sans [text-shadow:_0_1px_3px_rgba(0,0,0,0.85)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              RAJWADI RAJPUTI POSHAK
            </span>
          </motion.div>

          {/* Main Headline: Minimal, Authoritative Couture Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="font-serif text-[34px] min-[375px]:text-[38px] min-[414px]:text-[43px] sm:text-5xl lg:text-[54px] font-normal leading-[1.08] tracking-wide mb-5 sm:mb-7 md:mb-8 text-royal-ivory [text-shadow:_0_2px_12px_rgba(15,12,11,0.85),_0_1px_3px_rgba(15,12,11,0.95)]"
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
              className="inline-flex items-center justify-center px-6 py-3 min-[375px]:px-7 min-[375px]:py-3.5 bg-heritage-maroon hover:bg-[#431520] text-royal-ivory text-[11px] min-[375px]:text-xs tracking-[0.18em] font-medium border border-antique-gold hover:border-antique-gold-light transition-all duration-300 shadow-[0_4px_20px_rgba(90,31,43,0.4)] group active:scale-[0.98]"
            >
              <span>Explore Collection</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-2 text-antique-gold">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

