"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTIONS_DATA } from "@/data/products";

export default function Collections() {
  return (
    <section id="collections" className="pt-10 md:pt-12 pb-24 md:pb-32 bg-royal-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="h-[1px] w-6 bg-antique-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium">
              Curated Royal Ensembles
            </span>
            <span className="h-[1px] w-6 bg-antique-gold" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl md:text-5xl text-heritage-maroon font-light tracking-wide mb-4"
          >
            Royal Collections
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs md:text-sm text-charcoal/70 uppercase tracking-widest"
          >
            Handcrafted for ceremonies, weddings, and traditional royal splendor
          </motion.p>
        </div>

        {/* Large Visual Blocks Grid (2x2 Asymmetric Editorial Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {COLLECTIONS_DATA.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden bg-charcoal border border-soft-beige/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              <Link href="#featured" className="block relative">
                {/* Large Visual Block Image with Smooth Zoom */}
                <div className="relative w-full h-[450px] md:h-[540px] overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute inset-0 border border-antique-gold/0 group-hover:border-antique-gold/40 transition-colors duration-500 m-3" />
                </div>

                {/* Floating Content within the Block */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-royal-ivory">
                  <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-antique-gold mb-2 font-medium">
                    {collection.badge}
                  </span>

                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-royal-ivory font-normal mb-2 leading-snug">
                    {collection.title}
                  </h3>

                  <p className="text-xs md:text-sm text-royal-ivory/80 font-light max-w-md line-clamp-2 mb-6 font-sans">
                    {collection.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-antique-gold group-hover:text-royal-ivory transition-colors">
                    <span>Explore Collection</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
