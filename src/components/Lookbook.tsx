"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LOOKBOOK_ITEMS } from "@/data/products";

const CATEGORIES = [
  "All Looks",
  "Bridal Portraits",
  "Festival Styling",
  "Royal Traditional",
];

export default function Lookbook() {
  const [activeCategory, setActiveCategory] = useState("All Looks");

  const filteredItems =
    activeCategory === "All Looks"
      ? LOOKBOOK_ITEMS
      : LOOKBOOK_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="lookbook" className="py-24 md:py-36 bg-royal-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-[1px] w-6 bg-antique-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium">
              Editorial Showcase
            </span>
            <span className="h-[1px] w-6 bg-antique-gold" />
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-heritage-maroon font-light tracking-wide mb-4">
            The Royal Lookbook
          </h2>

          <p className="text-xs md:text-sm text-charcoal/70 uppercase tracking-widest">
            A visual anthology of bridal portraits, festival styling, and royal heritage
          </p>
        </div>

        {/* Minimal Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 mb-16">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                activeCategory === category
                  ? "bg-heritage-maroon text-royal-ivory shadow-md"
                  : "bg-transparent text-charcoal/70 hover:text-heritage-maroon border border-transparent hover:border-soft-beige"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Fashion Magazine Style Gallery Grid (Asymmetric Layout) */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group relative overflow-hidden bg-soft-beige/30 border border-soft-beige"
              >
                {/* Large Magazine Image */}
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />
                </div>

                {/* Minimal Magazine Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-royal-ivory">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-antique-gold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl text-royal-ivory font-normal leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-royal-ivory/80 font-light font-sans line-clamp-1">
                    {item.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
