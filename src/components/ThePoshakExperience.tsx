"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ThePoshakExperienceProps {
  onOpenConsultation?: () => void;
}

export default function ThePoshakExperience({
  onOpenConsultation,
}: ThePoshakExperienceProps) {
  const points = [
    {
      number: "01",
      title: "Thoughtfully Crafted",
      desc: "Details that honour tradition.",
    },
    {
      number: "02",
      title: "Made to Adorn",
      desc: "Silhouettes designed for the moment.",
    },
    {
      number: "03",
      title: "Rooted in Tradition",
      desc: "A timeless expression of Indian craftsmanship.",
    },
  ];

  return (
    <section
      id="experience"
      className="relative w-full h-auto min-h-0 flex flex-col items-center justify-center overflow-hidden bg-[#0C0A09] pt-[58px] pb-[52px] sm:pt-16 sm:pb-14 md:pt-14 md:pb-20 lg:pt-16 lg:pb-20 px-5 sm:px-6 md:px-10"
    >
      {/* Full-Bleed Cinematic Background Visual: Quiet Heritage Haveli Courtyard at Dusk */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src="/poshak_experience_haveli.webp"
          alt="The Poshak Experience - Quiet Heritage Indian Haveli Courtyard at Dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.86] contrast-[1.03] saturate-[1.06]"
        />

        {/* Desktop Atmospheric Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09]/55 via-[#0C0A09]/35 to-[#0C0A09]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(12,10,9,0.45)_0%,rgba(12,10,9,0.22)_50%,rgba(12,10,9,0.52)_100%)] pointer-events-none" />

        {/* Mobile-Specific Calm Darkening: Slightly darker background behind narrow text column ensures text-first editorial clarity */}
        <div className="absolute inset-0 bg-[#0C0A09]/35 md:hidden pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09]/70 via-transparent to-[#0C0A09]/75 md:hidden pointer-events-none" />
      </div>

      {/* Editorial Content Container: Text-first luxury couture composition */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center text-[#F8F1E7]">
        {/* Delicate Gold Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-2 sm:mb-2.5"
        >
          <span className="h-[1px] w-6 sm:w-8 bg-[#C6A15B]/70" />
          <span className="text-[9.5px] sm:text-[10px] uppercase tracking-[0.34em] text-[#E5C384] font-medium font-sans">
            THE POSHAK EXPERIENCE
          </span>
          <span className="h-[1px] w-6 sm:w-8 bg-[#C6A15B]/70" />
        </motion.div>

        {/* Large Serif Headline: Soft, Warm Regal Tone (Natural 2-line break on mobile) */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="font-serif italic text-[29px] min-[375px]:text-[33px] sm:text-4xl md:text-[40px] lg:text-[46px] text-[#F8F1E7] font-light leading-[1.14] tracking-wide mb-5 sm:mb-5 md:mb-3 max-w-[260px] min-[375px]:max-w-[300px] sm:max-w-none mx-auto [text-shadow:_0_2px_12px_rgba(0,0,0,0.6)]"
        >
          Made to be remembered.
        </motion.h2>

        {/* Editorial Subtext: 2-3 lines with 40-50px spacing to the first point */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-sans text-[13px] sm:text-[13.5px] md:text-[14px] text-[#F8F1E7]/85 font-light leading-[1.7] max-w-[290px] min-[375px]:max-w-[330px] sm:max-w-md md:max-w-lg mx-auto mb-11 sm:mb-11 md:mb-7 [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)]"
        >
          From the first detail to the final drape, every Poshak is created to
          make the occasion feel extraordinary.
        </motion.p>

        {/* Points: Mobile Vertically Stacked with Thin Dividers; Desktop 3 Columns */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.22 }}
          className="max-w-xs sm:max-w-sm md:max-w-4xl mx-auto flex flex-col md:grid md:grid-cols-3 md:gap-9 lg:gap-12 text-center md:text-left"
        >
          {points.map((point, idx) => (
            <React.Fragment key={point.number}>
              <div className="flex flex-col items-center md:items-start md:pt-3.5 md:border-t md:border-[#C6A15B]/30 transition-colors duration-300 md:hover:border-[#C6A15B]/60 group">
                {/* Number Label */}
                <span className="text-[10px] sm:text-[10.5px] text-[#E5C384] tracking-[0.28em] font-sans font-medium mb-1 sm:mb-1.5 uppercase [text-shadow:_0_1px_6px_rgba(0,0,0,0.6)]">
                  {point.number}
                </span>

                {/* Editorial Serif Title */}
                <h3 className="font-serif italic text-lg sm:text-[19px] md:text-[21px] text-[#F8F1E7] font-normal leading-snug mb-1 tracking-wide [text-shadow:_0_2px_8px_rgba(0,0,0,0.6)]">
                  {point.title}
                </h3>

                {/* Poetic Description: Soft & Legible */}
                <p className="font-sans text-[12px] sm:text-[12.5px] md:text-[13px] text-[#F8F1E7]/80 font-light leading-[1.65] tracking-normal max-w-[260px] sm:max-w-[280px] md:max-w-none mx-auto [text-shadow:_0_1px_6px_rgba(0,0,0,0.5)]">
                  {point.desc}
                </p>
              </div>

              {/* Mobile Subtle Thin Divider between points (hidden on desktop) */}
              {idx < points.length - 1 && (
                <div className="w-20 sm:w-24 h-[1px] bg-[#C6A15B]/30 mx-auto my-6 sm:my-6 md:hidden" />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
