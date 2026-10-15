"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface WorldOfRajwadiProps {
  onOpenConsultation?: () => void;
}

export default function WorldOfRajwadi({
  onOpenConsultation,
}: WorldOfRajwadiProps) {
  return (
    <section
      id="about"
      className="scroll-mt-20 md:scroll-mt-24 py-16 sm:py-20 md:py-28 lg:py-32 bg-[#F4ECE1] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 items-center">
          {/* Left Visual: Tall Editorial Composition */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="lg:col-span-6 relative"
          >
            <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] overflow-hidden bg-[#EAE0D2] shadow-[0_12px_45px_rgba(90,31,43,0.07)] border border-[#E6DCB8]">
              <Image
                src="/hero_couture.webp"
                alt="The World of Rajwadi - Authentic Royal Rajputi Poshaks"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[80%_20%] sm:object-[82%_25%]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/35 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Subtle Heritage Stamp */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 px-5 py-3 bg-[#FAF6F0] border border-[#C6A15B]/40 shadow-md flex-col items-center">
              <span className="font-serif text-lg text-[#5A1F2B] tracking-wider block">
                Rajwadi
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.26em] text-[#855D25] font-sans">
                Ancestral Atelier
              </span>
            </div>
          </motion.div>

          {/* Right Editorial Text Column: Open Composition */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-6 lg:pl-4 text-left"
          >
            {/* Symmetrical Eyebrow */}
            <div className="flex items-center gap-2.5 mb-3 sm:mb-3.5">
              <span className="h-[1px] w-5 bg-[#855D25]" />
              <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.3em] text-[#855D25] font-medium font-sans">
                THE WORLD OF RAJWADI
              </span>
              <span className="h-[1px] w-5 bg-[#855D25]" />
            </div>

            {/* Headline */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[44px] text-[#171717] font-light leading-[1.16] tracking-wide mb-6">
              Rooted in Heritage,
              <br />
              Tailored for Majesty
            </h2>

            {/* Narrative Body */}
            <div className="space-y-4 text-[13px] sm:text-[14px] text-[#171717]/80 font-light leading-[1.75] font-sans">
              <p className="font-serif italic text-base sm:text-lg text-[#171717] font-normal leading-relaxed">
                Rajwadi was born from an unwavering reverence for the regal
                traditions of Rajputana, where every poshak is an heirloom of
                dignity, ceremony, and grace.
              </p>

              <p>
                From the sweeping twelve-kali flare of the Ghagra to the
                sculpted fit of the Kurti-Kanchali and the ceremonial brilliance
                of the gold-fringed Odhani, each creation bridges historic royal
                splendor with contemporary luxury tailoring.
              </p>

              <p>
                Our master artisans continue generational techniques—embroidery
                that takes weeks of devoted handcrafting, using pure metallic
                kasab zari, hand-cut gota motifs, and authentic Rajasthani magji
                finishes.
              </p>
            </div>

            {/* Interactive Atelier Consultation Link */}
            <div className="mt-8 sm:mt-9">
              <button
                onClick={onOpenConsultation}
                className="group inline-flex flex-col items-start cursor-pointer text-left"
              >
                <span className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.24em] font-medium font-sans text-[#5A1F2B] group-hover:text-[#431520] transition-colors">
                  DISCOVER THE ATELIER
                </span>

                <div className="relative w-full h-[1px] mt-1.5 bg-[#5A1F2B]/25 overflow-hidden">
                  <span className="absolute inset-0 bg-[#5A1F2B] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
