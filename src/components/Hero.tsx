"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[100dvh] flex items-center overflow-hidden bg-charcoal">
      {/* Background Image: Complete model face, jewelry, and Rajputi Poshak silhouette fully visible */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src="/hero_couture.jpg"
          alt="Royal Indian Rajputi Poshak Couture Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_35%] sm:object-[80%_38%] md:object-[84%_42%] lg:object-[85%_42%] filter contrast-[1.05] saturate-[1.08] brightness-[1.02]"
        />

        {/* Warm Luxury Editorial Lighting: Architectural corridor visible on left with soft contrast for typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/20 to-transparent md:from-charcoal/45 md:via-charcoal/10 md:to-transparent" />
      </div>

      {/* Hero Content with Generous Editorial Negative Space */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 lg:pl-[110px] lg:pr-12 w-full pt-14 md:pt-10">
        <div className="max-w-xl text-royal-ivory">
          {/* Small Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-4 sm:mb-5"
          >
            <span className="text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#E5C384] font-medium font-sans drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
              RAJWADI RAJPUTI POSHAK
            </span>
          </motion.div>

          {/* Main Headline: Minimal, Authoritative Couture Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-light leading-[1.08] tracking-wide mb-8 text-royal-ivory drop-shadow-sm"
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
              className="inline-flex items-center justify-center px-7 py-3 bg-heritage-maroon hover:bg-[#431520] text-royal-ivory text-xs tracking-[0.18em] font-medium border border-antique-gold hover:border-antique-gold-light transition-all duration-300 shadow-[0_4px_20px_rgba(90,31,43,0.3)] group"
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

