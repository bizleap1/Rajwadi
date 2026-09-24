"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { REAL_POSHAKS, PoshakProduct } from "@/data/products";

interface FeaturedPoshaksProps {
  onSelectProduct: (product: PoshakProduct) => void;
}

export default function FeaturedPoshaks({ onSelectProduct }: FeaturedPoshaksProps) {
  return (
    <section id="featured" className="pt-8 sm:pt-12 md:pt-28 pb-16 md:pb-32 bg-soft-beige/30 border-y border-soft-beige">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-6 bg-antique-gold" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium">
                Heirloom Creations
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-heritage-maroon font-light tracking-wide">
              Featured Poshaks
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-xs md:text-sm text-charcoal/60 max-w-sm uppercase tracking-wider font-light">
            Authentic craftsmanship, pure fabrics, and timeless Rajasthani silhouettes
          </p>
        </div>

        {/* Large Clean Product Grid - Luxury Boutique Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {REAL_POSHAKS.map((product, index) => {
            const isSoldOut = Boolean(
              product.soldOut ||
                product.price === "Sold Out" ||
                (typeof product.price === "string" &&
                  product.price.toLowerCase().includes("sold"))
            );

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex flex-col bg-royal-ivory border border-soft-beige hover:border-antique-gold/60 transition-colors duration-500 shadow-[0_4px_25px_rgba(0,0,0,0.02)]"
              >
                {/* Large Product Image with Minimalistic Framing */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative w-full aspect-[3/4] overflow-hidden bg-soft-beige/40 cursor-pointer"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
                      isSoldOut ? "grayscale-[15%]" : ""
                    }`}
                  />

                  {/* Top-Left Sold Out Badge */}
                  {isSoldOut && (
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#4A1520]/95 text-[#FFF6E9] text-[9.5px] sm:text-[10.5px] font-sans font-bold uppercase tracking-[0.2em] rounded-xs shadow-md border border-[#D4AF37]/60 backdrop-blur-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] animate-pulse" />
                        Sold Out
                      </span>
                    </div>
                  )}

                  {/* Soft dark tint for sold out piece */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/15 pointer-events-none z-10" />
                  )}

                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="px-6 py-2.5 bg-royal-ivory text-heritage-maroon text-xs uppercase tracking-[0.2em] font-medium shadow-lg hover:bg-heritage-maroon hover:text-royal-ivory transition-all duration-300"
                    >
                      {isSoldOut ? "View Archived Piece" : "View Details"}
                    </button>
                  </div>
                </div>

              {/* Clean Minimal Typography (No Badges, No Stars) */}
              <div className="p-6 flex flex-col flex-1 justify-between text-center bg-royal-ivory">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-antique-gold block mb-1.5 font-medium">
                    {product.category}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl text-charcoal font-normal mb-2 leading-snug group-hover:text-heritage-maroon transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-charcoal/60 font-light mb-4 line-clamp-1 font-sans">
                    {product.fabric}
                  </p>
                </div>

                {/* View Details Action Link */}
                <div className="pt-3 border-t border-soft-beige/80 flex items-center justify-center">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="text-xs uppercase tracking-[0.2em] text-heritage-maroon hover:text-antique-gold transition-colors inline-flex items-center gap-1.5 font-medium"
                  >
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
