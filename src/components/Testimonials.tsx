"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CUSTOMER_STORIES } from "@/data/products";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CUSTOMER_STORIES.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + CUSTOMER_STORIES.length) % CUSTOMER_STORIES.length
    );
  };

  const current = CUSTOMER_STORIES[currentIndex];

  return (
    <section className="py-24 md:py-36 bg-royal-ivory border-t border-soft-beige overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-[1px] w-6 bg-antique-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium">
              Cherished Words
            </span>
            <span className="h-[1px] w-6 bg-antique-gold" />
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-heritage-maroon font-light tracking-wide">
            Customer Stories & Wedding Moments
          </h2>
        </div>

        {/* Editorial Luxury Testimonial Display */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
            >
              {/* Customer Image with Refined Framing */}
              <div className="relative w-48 h-60 sm:w-56 sm:h-72 flex-shrink-0 border-2 border-antique-gold/40 shadow-xl overflow-hidden bg-soft-beige">
                <Image
                  src={current.image}
                  alt={current.author}
                  fill
                  sizes="250px"
                  className="object-cover object-center"
                />
              </div>

              {/* Large Quote Content */}
              <div className="flex-1 text-center md:text-left">
                <span className="font-serif text-5xl md:text-6xl text-antique-gold/60 block leading-none -mb-3 font-normal">
                  “
                </span>
                <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-charcoal font-light italic leading-relaxed mb-6">
                  {current.quote}
                </blockquote>

                <div className="pt-4 border-t border-soft-beige">
                  <span className="font-serif text-xl text-heritage-maroon block">
                    {current.author}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-antique-gold font-sans">
                    {current.occasion}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center md:justify-end gap-4 mt-12">
            <button
              onClick={handlePrev}
              aria-label="Previous story"
              className="w-10 h-10 border border-charcoal/20 hover:border-heritage-maroon text-charcoal hover:text-heritage-maroon flex items-center justify-center transition-colors"
            >
              ←
            </button>
            <div className="text-xs text-charcoal/60 uppercase tracking-widest font-mono">
              {currentIndex + 1} / {CUSTOMER_STORIES.length}
            </div>
            <button
              onClick={handleNext}
              aria-label="Next story"
              className="w-10 h-10 border border-charcoal/20 hover:border-heritage-maroon text-charcoal hover:text-heritage-maroon flex items-center justify-center transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
