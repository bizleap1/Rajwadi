"use client";

import React from "react";
import Image from "next/image";

interface StitchedWithPrecisionProps {
  onOpenConsultation?: () => void;
}

const POSHAK_OPTIONS = [
  {
    step: "01",
    label: "STITCHED",
    headline: "Ready to wear.",
    description: "Finished poshaks, ready for your celebrations.",
    image: "/stitching_finished_detail.webp",
    alt: "Ready-to-wear stitched Rajputi poshak with flared kalidar ghagra and borders",
  },
  {
    step: "02",
    label: "UNSTITCHED",
    headline: "Choose it your way.",
    description: "Select your preferred poshak and receive it unstitched.",
    image: "/unstitched_fabric_closeup.webp",
    alt: "Curated unstitched poshak fabric with gota borders and zari motifs",
  },
  {
    step: "03",
    label: "STITCHING SERVICE",
    headline: "Tailored for you.",
    description: "Have your unstitched poshak stitched to your measurements.",
    image: "/stitching_needlework.webp",
    alt: "Precision stitching service for custom poshak tailoring",
  },
];

export default function StitchedWithPrecision({
  onOpenConsultation,
}: StitchedWithPrecisionProps) {
  return (
    <section
      id="poshak-your-way"
      className="scroll-mt-20 md:scroll-mt-24 pt-10 sm:pt-12 md:pt-13 pb-6 sm:pb-10 md:pb-11 bg-[#F8F1E7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-12">
        {/* Section Header: The Poshak, Your Way */}
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8 md:mb-9">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <span className="h-[1px] w-5 bg-[#855D25]" />
            <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.28em] text-[#855D25] font-semibold font-sans">
              HOW YOU WEAR IT
            </span>
            <span className="h-[1px] w-5 bg-[#855D25]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl md:text-[38px] text-[#171717] font-light tracking-wide leading-tight whitespace-nowrap">
            The Poshak, Your Way
          </h2>

          <p className="font-serif italic text-base sm:text-lg md:text-[19px] text-[#171717] mt-1.5 font-normal">
            Stitched, unstitched,<br className="sm:hidden" /> or tailored to you.
          </p>
        </div>

        {/* Desktop & Tablet: Balanced Visual Strip & Sharper Typography Hierarchy */}
        <div className="hidden md:block">
          {/* Visual Strip: Pure Clean Imagery without text overlays */}
          <div className="grid grid-cols-3 gap-2.5 lg:gap-3">
            {POSHAK_OPTIONS.map((item) => (
              <div
                key={item.step}
                className="group relative aspect-[4/4.6] overflow-hidden bg-[#EAE0D2]"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 33vw, 340px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>

          {/* Typography: Sharper, Compact Luxury Hierarchy */}
          <div className="grid grid-cols-3 gap-5 lg:gap-6 pt-3.5 sm:pt-4">
            {POSHAK_OPTIONS.map((item) => (
              <div
                key={item.step}
                className="text-center px-1 sm:px-2"
              >
                {/* 01 — STITCHED (small uppercase) */}
                <span className="font-sans text-[11px] lg:text-[11.5px] uppercase tracking-[0.24em] text-[#855D25] font-semibold block leading-none mb-1.5">
                  {item.step} — {item.label}
                </span>

                {/* Ready to wear. (larger serif/italic heading) */}
                <h3 className="font-serif italic text-xl sm:text-2xl lg:text-[24px] text-[#171717] font-normal leading-snug tracking-normal">
                  {item.headline}
                </h3>

                {/* Short 1–2 line description */}
                <p className="font-sans text-[14px] sm:text-[15px] lg:text-[15.5px] text-[#171717]/90 font-light leading-relaxed mt-1.5 max-w-[280px] mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View: Single Vertical Flow (50–65px spacing between cards) */}
        <div className="md:hidden flex flex-col space-y-14 sm:space-y-16">
          {POSHAK_OPTIONS.map((item) => (
            <article
              key={item.step}
              className="flex flex-col items-center text-center"
            >
              {/* 1. Image: ~100% content width, controlled height ~290px, clean without badges */}
              <div className="relative w-full h-[290px] sm:h-[330px] overflow-hidden bg-[#EAE0D2]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>

              {/* 2. Label: 01 — STITCHED */}
              <span className="font-sans text-[11px] sm:text-[11.5px] uppercase tracking-[0.24em] text-[#855D25] font-semibold block leading-none mt-4 sm:mt-4.5 mb-1.5">
                {item.step} — {item.label}
              </span>

              {/* 3. Subheading: Ready to wear. */}
              <h3 className="font-serif italic text-2xl sm:text-[26px] text-[#171717] font-normal leading-snug">
                {item.headline}
              </h3>

              {/* 4. Description: Finished poshaks, ready for your celebrations. */}
              <p className="font-sans text-[14.5px] sm:text-[15px] text-[#171717]/90 font-light leading-relaxed mt-1.5 max-w-[290px] mx-auto">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
