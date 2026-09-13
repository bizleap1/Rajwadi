"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section id="story" className="py-24 md:py-36 bg-royal-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Visual Column: Close-up embroidery and fabric details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 relative"
          >
            {/* Primary Fabric Detail Image */}
            <div className="relative w-full h-[460px] md:h-[560px] border border-soft-beige shadow-[0_10px_40px_rgba(90,31,43,0.05)]">
              <Image
                src="/hero_couture.jpg"
                alt="Rajputi Poshak Fabric and Embroidery Close-Up"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-heritage-maroon/10 mix-blend-multiply" />
            </div>

            {/* Secondary Macro Inset Image: Royal poshak details */}
            <div className="hidden sm:block absolute -bottom-10 -right-8 w-52 h-64 border-4 border-royal-ivory shadow-xl overflow-hidden bg-soft-beige">
              <Image
                src="/hero_couture.jpg"
                alt="Royal Rajputi Couture Details"
                fill
                sizes="200px"
                className="object-cover object-top"
              />
            </div>

            {/* Decorative Heritage Stamp */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border border-antique-gold/40 flex items-center justify-center p-2 text-center bg-royal-ivory/90 backdrop-blur-sm hidden sm:flex">
              <span className="text-[9px] uppercase tracking-widest text-antique-gold font-serif">
                Authentic Heritage
              </span>
            </div>
          </motion.div>

          {/* Right Editorial Storytelling Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-6 lg:pl-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-antique-gold" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium">
                The Rajwadi Heritage
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl lg:text-5xl text-heritage-maroon font-light tracking-wide mb-8 leading-[1.15]">
              Crafted From Heritage, Designed For Royal Moments
            </h2>

            <div className="space-y-6 text-charcoal/80 text-sm md:text-base font-light leading-relaxed font-sans">
              <p className="text-base md:text-lg text-charcoal font-serif italic">
                Rajwadi celebrates traditional Rajputi craftsmanship by bringing
                timeless Poshaks created for weddings, festivals and unforgettable
                celebrations.
              </p>

              <p>
                Every Rajputi Poshak represents an unbroken lineage of ceremonial
                grace. From the flared Ghagra to the structured Kurti-Kanchali and
                the sweeping Odhani, our silhouettes honor ancestral royal attire
                while ensuring graceful comfort.
              </p>

              {/* Client-Safe Highlight Box */}
              <div className="p-6 bg-soft-beige/40 border-l-2 border-antique-gold mt-6">
                <h4 className="font-serif text-lg text-heritage-maroon mb-1.5">
                  Premium Fabric Details & Embroidery Close-ups
                </h4>
                <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-light">
                  Hand-placed Gota Patti borders, traditional Kasab zari, fine
                  magji edgings, and delicate kiran tassels tailored exclusively
                  for auspicious family celebrations.
                </p>
              </div>
            </div>

            {/* Quote Signature / Monogram */}
            <div className="mt-10 pt-6 border-t border-soft-beige flex items-center justify-between">
              <div>
                <span className="font-serif text-2xl text-heritage-maroon tracking-wider block">
                  Rajwadi
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-antique-gold">
                  Rajputi Poshak Couture
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-charcoal/50 uppercase tracking-widest block font-sans">
                  Occasion Wear
                </span>
                <span className="text-xs text-charcoal/70 font-medium">
                  Weddings & Festivals
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
