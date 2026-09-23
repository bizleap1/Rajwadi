"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { INSTAGRAM_POSTS } from "@/data/products";

export default function InstagramSection() {
  return (
    <section className="py-20 md:py-28 bg-soft-beige/30 border-t border-soft-beige">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-3 mb-2 sm:mb-2.5">
            <span className="h-[1px] w-6 bg-[#855D25]" />
            <span className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-semibold font-sans">
              Social Anthology
            </span>
            <span className="h-[1px] w-6 bg-[#855D25]" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-heritage-maroon font-light tracking-wide mb-3">
            Follow The Royal Journey
          </h2>
          <a
            href="https://www.instagram.com/rajwadirajputiposhak/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.25em] text-charcoal/70 hover:text-heritage-maroon transition-colors"
          >
            @rajwadirajputiposhak
          </a>
        </div>

        {/* Gallery Grid (5 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {INSTAGRAM_POSTS.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden bg-soft-beige border border-soft-beige"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Minimal Luxury Hover Overlay */}
              <div className="absolute inset-0 bg-heritage-maroon/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-royal-ivory">
                <span className="text-[10px] text-antique-gold uppercase tracking-wider block mb-1">
                  {post.tag}
                </span>
                <p className="text-[11px] text-royal-ivory/90 line-clamp-2 font-light leading-snug">
                  {post.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
