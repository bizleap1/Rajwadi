"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, ChevronDown } from "lucide-react";

const CATEGORY_LINKS = [
  {
    title: "Bridal Rajputi Poshak",
    desc: "Pure georgette heavy bridal attire with authentic gota patti & zardozi",
    href: "/collection/bridal-rajputi-poshak",
  },
  {
    title: "Festive Rajputi Poshak",
    desc: "Vibrant royal celebrations for Gangaur, Teej, Karwa Chauth & Diwali",
    href: "/collection/festive-rajputi-poshak",
  },
  {
    title: "Classic Rajputi Poshak",
    desc: "Everyday traditional refinement, temple visits & family ceremonies",
    href: "/collection/classic-rajputi-poshak",
  },
  {
    title: "Semi-Stitched Poshak",
    desc: "Pre-embroidered fabric sets with aari-magji & lining for bespoke fitting",
    href: "/collection/semi-stitched-rajputi-poshak",
  },
  {
    title: "Stitched Rajputi Poshak",
    desc: "Ready-to-wear tailored poshaks with inner alteration margins",
    href: "/collection/stitched-rajputi-poshak",
  },
  {
    title: "Rajputi Jewellery",
    desc: "Heirloom Aad necklaces, Rakhdi, Sheeshphool, Nath & Bajuband",
    href: "/collection/rajputi-jewellery",
  },
];

const HOMEPAGE_FAQS = [
  {
    question: "Where can I buy an authentic Rajputi poshak in Nagpur?",
    answer:
      "You can visit Rajwadi's atelier boutique at EWS 41, near Maheshwari Bhawan, Hiwari Layout, Uday Nagar, Nagpur, Maharashtra (Phone: +91 8766667101), or explore and order directly from our online collection with insured delivery across India and worldwide.",
  },
  {
    question: "What is the difference between stitched and semi-stitched Rajputi poshak?",
    answer:
      "A semi-stitched poshak contains pre-embroidered kalis, unstitched kurti-kanchali fabric, matching magji borders, and cotton lining, allowing your personal tailor to customize the flare, waist, and length. A stitched poshak is expertly pre-tailored to standard sizing (with internal margins for easy alteration) ready for immediate wear.",
  },
  {
    question: "What embroidery techniques are used on Rajwadi bridal poshaks?",
    answer:
      "Our master artisans specialize in ancestral royal Rajasthani techniques, including handcrafted Gota Patti (embossed metallic ribbon flowers), authentic kasab zari needlework, hand-cut danka plates, and 3D zardozi wire embroidery, all outlined with delicate hand-stitched gota kiran fringes.",
  },
  {
    question: "What fabrics are used for your Rajputi poshaks?",
    answer:
      "We craft our royal attire using authentic handloom textiles: pure georgette for heavy bridal couture (offering majestic weight and fluid kalidar drape), shimmering tissue silk, high-grade soft chiffon for lightweight festivities, and durable art georgette for classic traditional wear.",
  },
  {
    question: "Do you offer custom bridal tailoring and size consultations?",
    answer:
      "Yes. Our master karigars provide personalized size and measurement consultations via WhatsApp (+91 8766667101). Brides can request custom ghagra flare sweeps (from 4 meters to 6.5 meters), bespoke kurti lengths, and tailored neckline finishes.",
  },
  {
    question: "How long does delivery take across India and worldwide?",
    answer:
      "Ready-to-ship poshaks and jewellery dispatch within 2–4 business days with delivery in 3–7 business days across India. Custom-tailored bridal couture typically dispatches within 10–20 business days with fully insured express delivery worldwide.",
  },
];

export default function HomepageSeoContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOMEPAGE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. Keyword-Rich Intro Section (200-300 words) */}
      <section className="bg-[#FAF6F0] py-16 sm:py-20 md:py-24 border-t border-[#E6DCB8]/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-semibold font-sans block mb-2">
              ROYAL RAJASTHANI ATELIER &bull; NAGPUR
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal leading-tight mb-4">
              Authentic Rajputi Poshak & Royal Bridal Couture in Nagpur
            </h2>
            <div className="h-0.5 w-16 bg-[#855D25]/40 mx-auto mb-6" />
          </div>

          <div className="bg-[#FDFBF7] border border-[#E6DCB8]/80 rounded-xs p-6 sm:p-10 shadow-xs text-xs sm:text-sm text-[#171717]/85 font-serif font-light leading-relaxed space-y-4">
            <p>
              Welcome to <strong>Rajwadi Rajputi Poshak</strong>, Nagpur&apos;s premier boutique destination for authentic royal Rajasthani attire. We preserve centuries of Marwar courtly heritage by bringing generational karigari directly to discerning women across Vidarbha, Maharashtra, and across the globe. Each <strong>Rajputi poshak</strong> in our collection is an heirloom work of art, honouring the iconic four-piece royal ensemble comprising the expansive kalidar ghagra, the fitted kurti, the traditional kanchali, and the majestic 2.5-meter odhna bordered with shimmering gota kiran.
            </p>
            <p>
              Whether you are seeking an opulent <strong>bridal poshak</strong> for your royal wedding, vibrant festive couture for Gangaur, Teej, and Karwa Chauth, or an understated classic design for auspicious family poojas, our Nagpur atelier offers unparalleled craftsmanship. We work exclusively with hand-selected pure georgette, tissue silk, and luxurious brocades, enriched with ancestral <strong>gota patti</strong> hand-folding, lustrous kasab <strong>zari</strong>, three-dimensional zardozi wirework, and delicate danka motifs.
            </p>
            <p>
              Understanding that perfection lies in the drape, we provide both pristine ready-to-wear stitched sets and flexible <strong>semi-stitched poshak</strong> fabric sets complete with matching aari-magji and pure cotton lining packs. Visit our Nagpur boutique at Hiwari Layout or consult with our master artisans online for customized 4-to-6-meter ghagra flare tailoring, personalized styling advice, and insured worldwide delivery.
            </p>
          </div>

          {/* 2. Category Navigation Links */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold font-sans">
                EXPLORE BY CATEGORY
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal mt-1">
                Curated Collections for Every Royal Occasion
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {CATEGORY_LINKS.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  className="group bg-[#FDFBF7] border border-[#E6DCB8]/70 hover:border-[#855D25] p-5 rounded-xs transition-all duration-300 shadow-2xs hover:shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-serif text-base text-[#171717] group-hover:text-[#5A1F2B] font-medium transition-colors">
                        {cat.title}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-[#855D25] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-[#171717]/70 font-sans font-light leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#855D25] font-semibold font-sans mt-4 flex items-center gap-1 group-hover:underline">
                    View Collection &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Homepage FAQ Block (5-6 Questions with Accordions) */}
      <section className="bg-[#F4ECE1] py-16 sm:py-20 md:py-24 border-t border-[#E6DCB8]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-semibold font-sans block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal mb-3">
              Everything You Need to Know About Rajwadi Poshaks
            </h2>
            <div className="h-0.5 w-16 bg-[#855D25]/40 mx-auto mb-4" />
            <p className="text-xs sm:text-sm text-[#171717]/75 font-serif font-light leading-relaxed">
              Find detailed answers about our traditional stitching services, bespoke bridal fittings, boutique appointments in Nagpur, and insured delivery options.
            </p>
          </div>

          <div className="space-y-3.5">
            {HOMEPAGE_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#FDFBF7] border border-[#E6DCB8]/80 rounded-xs overflow-hidden shadow-2xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer group"
                  >
                    <span className="font-serif text-sm sm:text-base text-[#171717] group-hover:text-[#5A1F2B] font-medium pr-4 leading-snug transition-colors">
                      {faq.question}
                    </span>
                    <span
                      className={`text-[#855D25] text-lg font-light transition-transform duration-200 shrink-0 select-none ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#171717]/80 font-serif font-light leading-relaxed border-t border-[#E6DCB8]/40">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-[#171717]/70 font-sans mb-3">
              Have a custom bridal enquiry or need size consultation?
            </p>
            <a
              href="https://wa.me/918766667101?text=Hello%20Rajwadi,%20I%20have%20a%20question%20about%20your%20Rajputi%20Poshaks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#5A1F2B] hover:bg-[#855D25] text-[#FAF6F0] py-3 px-6 text-xs uppercase tracking-[0.16em] font-sans transition-colors duration-200 shadow-xs"
            >
              Chat on WhatsApp (+91 8766667101)
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
