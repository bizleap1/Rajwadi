"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface OccasionItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const OCCASIONS: OccasionItem[] = [
  {
    id: "bridal",
    title: "Heavy Poshak",
    subtitle: "For the most cherished beginnings.",
    image: "/bridal.webp",
    link: "/collection?category=bridal",
  },
  {
    id: "everyday",
    title: "Classic Poshak",
    subtitle: "For timeless grace and effortless poise.",
    image: "/traditonal.webp",
    link: "/collection?category=everyday",
  },
  {
    id: "festive",
    title: "Festive",
    subtitle: "For celebrations steeped in tradition.",
    image: "/festive.webp",
    link: "/collection?category=festive",
  },
];

export default function ShopByOccasion() {
  return (
    <section
      id="occasions"
      className="scroll-mt-20 md:scroll-mt-24 py-16 sm:py-20 md:py-24 lg:py-28 bg-[#F4ECE1]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header: Symmetrical, Minimalist Luxury */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-14">
          <div className="flex items-center justify-center gap-2.5 mb-2.5 sm:mb-3">
            <span className="h-[1px] w-5 bg-[#855D25]" />
            <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.3em] text-[#855D25] font-medium font-sans">
              CURATED EDITIONS
            </span>
            <span className="h-[1px] w-5 bg-[#855D25]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] text-[#171717] font-light tracking-wide leading-[1.15]">
            Shop By Occasion
          </h2>
        </div>

        {/* 3 Visual Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {OCCASIONS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: index * 0.12 }}
              className="group flex flex-col cursor-pointer"
            >
              <Link href={item.link} className="block group">
                {/* Visual Container: Tall Portrait Ratio */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EAE0D2] shadow-sm border border-[#E6DCB8]/60">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Gentle Gradient Wash for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/25 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                </div>

                {/* Editorial Caption Below Image */}
                <div className="pt-3.5 sm:pt-4 text-left">
                  <h3 className="font-serif text-[22px] sm:text-[24px] lg:text-[26px] text-[#171717] font-normal leading-snug group-hover:text-[#5A1F2B] transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-serif italic text-[14px] sm:text-[15px] text-[#171717]/75 font-normal mt-1 leading-normal">
                    {item.subtitle}
                  </p>

                  {/* Supporting Animated Underline CTA */}
                  <div className="mt-2.5 inline-flex flex-col items-start">
                    <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.22em] text-[#5A1F2B] font-medium font-sans group-hover:text-[#855D25] transition-colors">
                      View Occasion
                    </span>
                    <div className="relative w-full h-[1px] mt-1 bg-[#5A1F2B]/25 overflow-hidden">
                      <span className="absolute inset-0 bg-[#5A1F2B] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                    </div>
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
