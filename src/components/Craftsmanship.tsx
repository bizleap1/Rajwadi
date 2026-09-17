"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CRAFTSMANSHIP_STEPS } from "@/data/products";

export default function Craftsmanship() {
  return (
    <section id="craftsmanship" className="py-24 md:py-36 bg-soft-beige/20 border-t border-soft-beige">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-[1px] w-6 bg-[#855D25]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-semibold">
              The Journey Of A Poshak
            </span>
            <span className="h-[1px] w-6 bg-[#855D25]" />
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-heritage-maroon font-light tracking-wide mb-4">
            Artisanal Craftsmanship
          </h2>

          <p className="text-xs md:text-sm text-charcoal/70 uppercase tracking-widest">
            From ancestral inspirations to ceremonial perfection
          </p>
        </div>

        {/* Storytelling Timeline Steps with Elegant Visuals */}
        <div className="relative">
          {/* Subtle Connecting Line on Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-antique-gold/30 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 relative z-10">
            {CRAFTSMANSHIP_STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.18 }}
                className="flex flex-col bg-royal-ivory border border-soft-beige p-5 group hover:border-antique-gold/60 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                {/* Step Number & Visual Container */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-soft-beige/50 mb-6 border border-soft-beige/60">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-heritage-maroon text-royal-ivory text-[10px] font-sans px-2.5 py-1 uppercase tracking-widest">
                    Step {step.step}
                  </div>
                </div>

                {/* Step Title & Details */}
                <h3 className="font-serif text-xl md:text-2xl text-heritage-maroon font-normal mb-2 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs md:text-sm text-charcoal/70 font-light leading-relaxed font-sans">
                  {step.description}
                </p>

                {/* Subtle Arrow Indicator between steps */}
                {index < CRAFTSMANSHIP_STEPS.length - 1 && (
                  <div className="mt-4 pt-4 border-t border-soft-beige/60 flex items-center justify-between text-[11px] text-antique-gold uppercase tracking-wider">
                    <span>Next Phase</span>
                    <span>↓</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
