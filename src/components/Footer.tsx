"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface FooterProps {
  onOpenConsultation?: () => void;
}

export default function Footer({ onOpenConsultation }: FooterProps) {
  // Mobile accordion state (all sections collapsed by default)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    explore: false,
    poshaks: false,
    contact: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <footer
      id="footer"
      className="relative bg-[#1F080C] text-[#FAF6F0] pt-10 sm:pt-12 pb-6 sm:pb-7 border-t border-[#855D25]/30 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        {/* Main Footer Container: Logo on Left + 3 Columns on Right Side */}
        <div className="footer-main-grid pb-7 sm:pb-8">
          {/* Left Column: Brand Logo & Tagline (Centered on Mobile, Left-aligned on Desktop) */}
          <div className="footer-brand-col flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="inline-block group focus:outline-none">
              <Image
                src="/logo.webp"
                alt="Rajwadi Rajputi Poshak Logo"
                width={138}
                height={163}
                className="w-[120px] lg:w-[135px] h-auto object-contain mx-auto lg:mx-0"
              />
            </Link>
            <p className="font-serif italic text-xs sm:text-[13px] text-[#FAF6F0]/70 font-light mt-2.5 max-w-[240px] leading-relaxed mx-auto lg:mx-0">
              Rajputi Poshaks, thoughtfully chosen.
            </p>

            {/* Social Links (Instagram, Facebook & WhatsApp) - Centered on Mobile */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-3.5 pt-0.5 w-full">
              <a
                href="https://www.instagram.com/rajwadirajputiposhak/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rajwadi Rajputi Poshak Instagram"
                className="text-[#FAF6F0]/75 hover:text-[#C6A15B] transition-colors duration-200 block"
              >
                <svg
                  className="w-[19px] h-[19px] text-current transition-transform duration-200 hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/p/Rajwadi-Rajputi-Poshak-100075751886924/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rajwadi Rajputi Poshak Facebook"
                className="text-[#FAF6F0]/75 hover:text-[#C6A15B] transition-colors duration-200 block"
              >
                <svg
                  className="w-[19px] h-[19px] text-current transition-transform duration-200 hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.5-.14-2.8-.14-2.8 0-4.7 1.7-4.7 4.8v2.7H7v4h3v9.5h4v-9.5z" />
                </svg>
              </a>

              <a
                href="https://wa.me/918766667101"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rajwadi Rajputi Poshak WhatsApp (+91 8766667101)"
                className="text-[#FAF6F0]/75 hover:text-[#C6A15B] transition-colors duration-200 block"
              >
                <svg
                  className="w-[19px] h-[19px] text-current transition-transform duration-200 hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>

          {/* MOBILE ONLY: Clean Luxury Accordion Rows with + Icon (Collapsed by Default) */}
          <div className="lg:hidden w-full border-t border-b border-[#FAF6F0]/15 divide-y divide-[#FAF6F0]/15 mt-0 mb-0">
            {/* 1. EXPLORE Accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => toggleSection("explore")}
                aria-expanded={openSections.explore}
                className="w-full flex items-center justify-between py-3.5 text-left focus:outline-none cursor-pointer group"
              >
                <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#C6A15B] font-medium font-sans">
                  EXPLORE
                </span>
                <span
                  className={`text-[#C6A15B] text-xl font-light transition-transform duration-300 ease-out select-none leading-none pr-1 ${
                    openSections.explore ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openSections.explore && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2.5 pb-4 pt-1 text-[13px] text-[#FAF6F0]/75 font-light font-sans tracking-wide">
                      <li>
                        <Link
                          href="/"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block"
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block"
                        >
                          Collection
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/our-heritage"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block"
                        >
                          Our Story
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/contact"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block"
                        >
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. POSHAKS Accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => toggleSection("poshaks")}
                aria-expanded={openSections.poshaks}
                className="w-full flex items-center justify-between py-3.5 text-left focus:outline-none cursor-pointer group"
              >
                <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#C6A15B] font-medium font-sans">
                  POSHAKS
                </span>
                <span
                  className={`text-[#C6A15B] text-xl font-light transition-transform duration-300 ease-out select-none leading-none pr-1 ${
                    openSections.poshaks ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openSections.poshaks && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2.5 pb-4 pt-1 text-[13px] text-[#FAF6F0]/75 font-light font-sans tracking-wide">
                      <li>
                        <Link
                          href="/collection?category=bridal"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block"
                        >
                          Heavy Poshaks
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection?category=everyday"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block"
                        >
                          Classic Poshaks
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection?category=festive"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block"
                        >
                          Festive
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection?category=jewellery"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block"
                        >
                          Jewellery
                        </Link>
                      </li>
                      <li className="pt-2 border-t border-[#C6A15B]/20">
                        <Link
                          href="/collection?type=stitched"
                          className="text-xs text-[#C6A15B] hover:text-white transition-colors duration-200 block"
                        >
                          Stitched Poshaks
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection?type=unstitched"
                          className="text-xs text-[#C6A15B] hover:text-white transition-colors duration-200 block"
                        >
                          Semi-Stitched Poshaks
                        </Link>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. CONTACT Accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => toggleSection("contact")}
                aria-expanded={openSections.contact}
                className="w-full flex items-center justify-between py-3.5 text-left focus:outline-none cursor-pointer group"
              >
                <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#C6A15B] font-medium font-sans">
                  CONTACT
                </span>
                <span
                  className={`text-[#C6A15B] text-xl font-light transition-transform duration-300 ease-out select-none leading-none pr-1 ${
                    openSections.contact ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openSections.contact && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pb-4 pt-1 text-[13px] text-[#FAF6F0]/75 font-light font-sans tracking-wide">
                      <div>
                        <a
                          href="tel:+918766667101"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block"
                        >
                          +91 8766667101
                        </a>
                      </div>
                      <div className="pt-0.5 max-w-[280px]">
                        <span className="text-[#C6A15B] font-medium block text-[10px] uppercase tracking-wider mb-1">
                          STORE ADDRESS
                        </span>
                        <a
                          href="https://maps.google.com/?q=Rajwadi+Rajputi+Poshak,+Ews+41,+Hiwari+Lay+Out,+Near+Rajurkar+Bichayat+Kendra,+Wardhaman+Nagar,+Landmark+Inox+Mall,+Nagpur,+Maharashtra+440008"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#C6A15B] transition-colors duration-200 block text-[12px] leading-relaxed text-[#FAF6F0]/70"
                        >
                          Ews 41, Hiwari Lay Out,<br />
                          Near Rajurkar Bichayat Kendra,<br />
                          Wardhaman Nagar, Landmark Inox Mall,<br />
                          Nagpur, Maharashtra - 440008
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* DESKTOP ONLY: Exactly 3 Side-by-Side Columns (Explore, Poshaks, Contact) */}
          <div className="!hidden lg:!flex footer-nav-columns pt-1">
            {/* Column 1: EXPLORE */}
            <div className="footer-col flex flex-col">
              <h4 className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.26em] text-[#C6A15B] font-medium font-sans mb-3 sm:mb-3.5">
                EXPLORE
              </h4>
              <ul className="space-y-2 text-[12.5px] sm:text-[13px] text-[#FAF6F0]/75 font-light font-sans tracking-wide">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/our-heritage"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: COLLECTIONS */}
            <div className="footer-col flex flex-col">
              <h4 className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.26em] text-[#C6A15B] font-medium font-sans mb-3 sm:mb-3.5">
                COLLECTIONS
              </h4>
              <ul className="space-y-2 text-[12.5px] sm:text-[13px] text-[#FAF6F0]/75 font-light font-sans tracking-wide">
                <li>
                  <Link
                    href="/collection?category=bridal"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    Heavy Poshaks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection?category=everyday"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    Classic Poshaks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection?category=festive"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    Festive
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection?category=jewellery"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    Jewellery
                  </Link>
                </li>
                <li className="pt-2 border-t border-[#C6A15B]/20">
                  <span className="text-[10px] uppercase tracking-wider text-[#C6A15B]/80 block mb-1">
                    By Type
                  </span>
                  <ul className="space-y-1 text-xs text-[#FAF6F0]/70">
                    <li>
                      <Link
                        href="/collection?type=stitched"
                        className="hover:text-[#C6A15B] transition-colors duration-200 block"
                      >
                        Stitched Poshaks
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collection?type=unstitched"
                        className="hover:text-[#C6A15B] transition-colors duration-200 block"
                      >
                        Semi-Stitched Poshaks
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Column 3: CONTACT */}
            <div className="footer-col flex flex-col items-start text-left">
              <h4 className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.26em] text-[#C6A15B] font-medium font-sans mb-3 sm:mb-3.5">
                CONTACT
              </h4>
              <ul className="space-y-3 text-[12.5px] sm:text-[13px] text-[#FAF6F0]/75 font-light font-sans tracking-wide">
                <li>
                  <a
                    href="tel:+918766667101"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    +91 8766667101
                  </a>
                </li>
                <li className="pt-0.5 text-[#FAF6F0]/70 text-[11.5px] sm:text-xs leading-relaxed max-w-[260px]">
                  <span className="text-[#C6A15B] font-medium block text-[10px] uppercase tracking-wider mb-1">
                    STORE ADDRESS
                  </span>
                  <a
                    href="https://maps.google.com/?q=Rajwadi+Rajputi+Poshak,+Ews+41,+Hiwari+Lay+Out,+Near+Rajurkar+Bichayat+Kendra,+Wardhaman+Nagar,+Landmark+Inox+Mall,+Nagpur,+Maharashtra+440008"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#C6A15B] transition-colors duration-200 block"
                  >
                    Ews 41, Hiwari Lay Out,<br />
                    Near Rajurkar Bichayat Kendra,<br />
                    Wardhaman Nagar, Landmark Inox Mall,<br />
                    Nagpur, Maharashtra - 440008
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom — Thin Divider & Legal Notice */}
        <div className="pt-4 border-t border-[#FAF6F0]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FAF6F0]/50 font-sans tracking-wide gap-2.5 sm:gap-0 text-center sm:text-left">
          <p>© 2026 Rajwadi. All rights reserved.</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/contact"
              className="hover:text-[#C6A15B] transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              href="/contact"
              className="hover:text-[#C6A15B] transition-colors duration-200"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
