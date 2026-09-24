"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TalkToDesignerModal = dynamic(
  () => import("@/components/TalkToDesignerModal"),
  { ssr: false }
);

export default function OurHeritagePage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const handleOpenConsultation = () => setIsConsultationOpen(true);
  const handleCloseConsultation = () => setIsConsultationOpen(false);

  return (
    <main className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#F8F1E7]">
      {/* Navigation with solid light background and dark crisp text */}
      <Navbar onOpenConsultation={handleOpenConsultation} solidOnTop />

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. HERITAGE HERO                                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 md:pb-8 overflow-hidden bg-[#FAF6F0]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-2.5 sm:mb-3"
          >
            <span className="h-[1px] w-6 bg-[#855D25]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#855D25] font-semibold font-sans">
              OUR HERITAGE
            </span>
            <span className="h-[1px] w-6 bg-[#855D25]" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#171717] font-light tracking-wide leading-[1.12] mb-2.5 sm:mb-3"
          >
            Rooted in tradition.<br />
            <span className="italic font-normal text-[#5A1F2B]">Made for today.</span>
          </motion.h1>

          {/* Short Supporting Line */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif italic text-base sm:text-lg text-[#6B635B] font-light max-w-lg mx-auto leading-relaxed"
          >
            Discover the story, spirit and traditions behind Rajwadi.
          </motion.p>
        </div>

        {/* Full-width Cinematic Heritage Visual (Authentic Haveli Courtyard) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 sm:mt-7 max-w-6xl mx-auto px-4 sm:px-6 md:px-8"
        >
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-[#EAE0D2] shadow-[0_12px_32px_rgba(23,23,23,0.06)] border border-[#E6DCB8]">
            <Image
              src="/heritage_haveli_courtyard.webp"
              alt="Rajasthani Heritage Palace Courtyard Architecture"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/25 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. THE RAJWADI STORY & FOUNDER CURATION                               */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-14 md:py-16 bg-[#FDFBF7] border-b border-[#E6DCB8]/60">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left: Founder Portrait (owner.png) */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative p-2 bg-[#FAF5EE] border border-[#E6DCB8] shadow-xl rounded-xs group">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#EAE0D2]">
                  <Image
                    src="/owner.png"
                    alt="Shalu Vyas - Founder & Master Curator of Rajwadi Rajputi Poshak"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F080C]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Luxury Plaque on Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-center px-3 py-2.5 bg-[#1F080C]/90 backdrop-blur-xs border border-[#C6A15B]/50 rounded-xs shadow-md">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#C6A15B] font-semibold font-sans">
                      FOUNDER &amp; MASTER CURATOR
                    </p>
                    <p className="font-serif text-sm sm:text-base text-[#FAF6F0] font-normal tracking-wide mt-0.5">
                      Shalu Vyas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Story & Founder Editorial */}
            <div className="lg:col-span-7 order-1 lg:order-2 text-left">
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="h-[1px] w-5 bg-[#855D25]" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-semibold font-sans">
                  THE RAJWADI STORY
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-[38px] text-[#171717] font-light leading-[1.18] tracking-wide mb-2 sm:mb-2.5">
                A tradition worth carrying forward.
              </h2>

              <p className="font-serif italic text-sm text-[#855D25] mb-4">
                Curated with devotion by Founder Shalu Vyas
              </p>

              <div className="space-y-3.5 text-[14px] sm:text-[15px] text-[#4A423B] font-light leading-[1.75] font-sans">
                <p>
                  Rajwadi was created by <strong className="font-medium text-[#171717]">Shalu Vyas</strong> with a singular devotion: to honor the dignity,
                  form and ceremonial purity of the Rajputi Poshak. In a world of fleeting trends,
                  we believe ceremonial attire deserves reverence—preserving its sacred role in
                  weddings, auspicious festivals, and life’s defining milestones.
                </p>

                <p>
                  Our purpose is to bring authentic Poshaks to those who cherish heritage:
                  hand-selected pure fabrics, genuine festive colorways, and timeless Gotapatti &amp; Kasab Zari needlework,
                  curated with personal care so that tradition continues to be worn with quiet pride.
                </p>
              </div>

              {/* Founder Heritage Quote Card */}
              <div className="mt-5 p-4 sm:p-4.5 bg-[#FAF5EE] border-l-2 border-[#5A1F2B] border-y border-r border-[#E6DCB8]/80 rounded-r-xs shadow-2xs">
                <p className="font-serif italic text-xs sm:text-[13px] text-[#5A1F2B] leading-relaxed">
                  &ldquo;A Rajputi Poshak is not simply ceremonial attire—it is an unbroken lineage of grace, poise, and Rajasthani pride woven into every thread.&rdquo;
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#855D25] font-semibold uppercase tracking-wider font-sans">
                  <span>— SHALU VYAS • FOUNDER &amp; CURATOR</span>
                  <span className="text-[#8C827A] normal-case tracking-normal font-serif italic font-normal">Jaipur, Rajasthan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. MORE THAN AN OUTFIT. A PART OF TRADITION.                          */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-12 md:py-14 bg-[#431520] text-[#FAF6F0] relative overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#855D25]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left: Tightened Typography */}
            <div className="lg:col-span-7 text-left">
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="h-[1px] w-5 bg-[#D4AF37]" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium font-sans">
                  MORE THAN AN OUTFIT
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#FAF6F0] font-light leading-[1.15] tracking-wide mb-4 sm:mb-5">
                More than an outfit.<br />
                <span className="italic font-normal text-[#E6DCB8]">A part of tradition.</span>
              </h2>

              <div className="space-y-3.5 text-[14px] sm:text-[15px] text-[#FAF6F0]/85 font-light leading-[1.75] font-sans">
                <p>
                  Defined by its historic four-piece architecture—the Kurti, Kanchali,
                  Ghagra, and the ceremonial Odhani—the Rajputi Poshak is far more than
                  clothing. It is an enduring symbol of grace and cultural identity rooted
                  in the royal courts of Rajasthan.
                </p>

                <p>
                  From the sweeping flare of the kalis to the disciplined drape of the odhani,
                  every element creates a regal silhouette. To wear a Poshak is to step into an
                  unbroken lineage of celebration, poise, and dignity.
                </p>
              </div>
            </div>

            {/* Right: Close-up Embroidery / Odhani Visual Detail */}
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#2D0D14] shadow-2xl border border-[#D4AF37]/30">
                <Image
                  src="/heritage_odhani_embroidery.webp"
                  alt="Close-up Detail of Traditional Rajputi Poshak Odhani Embroidery"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D0D14]/25 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. THE DETAILS MATTER                                                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-12 md:py-14 bg-[#FAF6F0] border-b border-[#E6DCB8]/60">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="mb-7 sm:mb-9 text-left sm:text-center">
            <div className="flex items-center sm:justify-center gap-3 mb-2.5">
              <span className="h-[1px] w-6 bg-[#855D25]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#855D25] font-semibold font-sans">
                THE DETAILS MATTER
              </span>
              <span className="h-[1px] w-6 bg-[#855D25] hidden sm:block" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[40px] text-[#171717] font-light leading-[1.18] tracking-wide">
              The details matter.
            </h2>
          </div>

          {/* 3 Large Typographic Editorial Sections (No cards, no boxes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-left">
            {/* 01 — COLOUR */}
            <div className="pt-4 border-t border-[#855D25]/30">
              <span className="font-serif text-2xl sm:text-3xl text-[#855D25] font-light block mb-1.5">
                01
              </span>
              <h3 className="font-sans text-[13px] sm:text-[14px] uppercase tracking-[0.24em] text-[#171717] font-medium mb-2">
                COLOUR
              </h3>
              <p className="font-serif italic text-sm text-[#5A1F2B] mb-1.5 leading-snug">
                Traditional palettes and considered combinations.
              </p>
              <p className="text-[13px] sm:text-[14px] text-[#5A524A] font-light leading-[1.65] font-sans">
                Kasumal red, royal Gulabi, and Kesariya saffron—hues chosen in harmony with Rajasthani ceremonial occasions.
              </p>
            </div>

            {/* 02 — EMBELLISHMENT */}
            <div className="pt-4 border-t border-[#855D25]/30">
              <span className="font-serif text-2xl sm:text-3xl text-[#855D25] font-light block mb-1.5">
                02
              </span>
              <h3 className="font-sans text-[13px] sm:text-[14px] uppercase tracking-[0.24em] text-[#171717] font-medium mb-2">
                EMBELLISHMENT
              </h3>
              <p className="font-serif italic text-sm text-[#5A1F2B] mb-1.5 leading-snug">
                Decorative details that give each Poshak its character.
              </p>
              <p className="text-[13px] sm:text-[14px] text-[#5A524A] font-light leading-[1.65] font-sans">
                Gotapatti ribbon motifs, fine Kasab metallic zari outlines, and delicate mukaish dusting that catch ambient light with quiet radiance.
              </p>
            </div>

            {/* 03 — SILHOUETTE */}
            <div className="pt-4 border-t border-[#855D25]/30">
              <span className="font-serif text-2xl sm:text-3xl text-[#855D25] font-light block mb-1.5">
                03
              </span>
              <h3 className="font-sans text-[13px] sm:text-[14px] uppercase tracking-[0.24em] text-[#171717] font-medium mb-2">
                SILHOUETTE
              </h3>
              <p className="font-serif italic text-sm text-[#5A1F2B] mb-1.5 leading-snug">
                The distinctive form and drape of a Poshak.
              </p>
              <p className="text-[13px] sm:text-[14px] text-[#5A524A] font-light leading-[1.65] font-sans">
                The architectural flare of the kalis, the structured Magji hemline, and the disciplined drape of the odhani framing the silhouette in regal dignity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 5. CHOSEN WITH CARE. MADE FOR THE OCCASION.                           */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-12 md:py-14 bg-[#FDFBF7] border-b border-[#E6DCB8]/60">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <span className="h-[1px] w-6 bg-[#855D25]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#855D25] font-semibold font-sans">
              BRAND PHILOSOPHY
            </span>
            <span className="h-[1px] w-6 bg-[#855D25]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#171717] font-light leading-[1.15] tracking-wide mb-3">
            Chosen with care.<br />
            <span className="italic font-normal text-[#5A1F2B]">Made for the occasion.</span>
          </h2>

          <p className="font-sans text-[14px] sm:text-[15px] text-[#5A524A] font-light leading-[1.75] max-w-xl mx-auto">
            Every Poshak is curated with reverence for traditional proportions and fine craftsmanship—designed to feel effortless, dignified, and memorable for your most sacred moments.
          </p>
        </div>

        {/* Full-width Fabric & Craftsmanship Visual (Pure visual, no service repeat badges) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-[#EAE0D2] shadow-[0_12px_32px_rgba(23,23,23,0.06)] border border-[#E6DCB8]">
            <Image
              src="/heritage_poshak_fabric_drape.webp"
              alt="Pure Poshak Silks and Fine Fabrics Draped in Heritage Atelier"
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/25 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 6. FINAL CTA                                                          */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#37121B] text-[#FAF6F0] text-center">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FAF6F0] font-light tracking-[0.16em] uppercase mb-2">
            FIND YOUR POSHAK
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-[#E6DCB8] font-light mb-6">
            Explore the collection.
          </p>

          <Link
            href="/collection"
            className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 bg-[#FAF6F0] hover:bg-[#FAF5EE] text-[#431520] text-xs uppercase tracking-[0.24em] font-medium font-sans transition-all duration-300 shadow-md group cursor-pointer"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenConsultation={handleOpenConsultation} />

      {/* Consultation Modal */}
      <TalkToDesignerModal
        isOpen={isConsultationOpen}
        onClose={handleCloseConsultation}
      />
    </main>
  );
}
