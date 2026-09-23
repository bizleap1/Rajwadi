"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CustomPoshakProps {
  onOpenConsultation: () => void;
}

export default function CustomPoshak({ onOpenConsultation }: CustomPoshakProps) {
  const PILLARS = [
    {
      number: "01",
      title: "Personal Styling",
      description:
        "Dedicated consultation with our poshak stylists to help you curate colors, odhani drapes, and jewelry pairings for your auspicious celebration.",
    },
    {
      number: "02",
      title: "Custom Measurements",
      description:
        "Custom measurements and personalised fitting support to ensure your kanchali, kurti, and ghagra fall with regal poise and complete comfort.",
    },
    {
      number: "03",
      title: "Design Consultation",
      description:
        "Explore bespoke embroidery preferences, magji finishes, and heritage motif placements tailored uniquely to your family traditions.",
    },
  ];

  return (
    <section id="custom" className="py-24 md:py-36 bg-charcoal text-royal-ivory relative overflow-hidden">
      {/* Background Architectural Atmosphere */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/hero_couture.webp"
          alt="Palace Architecture Texture"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-[1px] w-8 bg-antique-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-antique-gold font-medium">
              Bespoke Atelier Service
            </span>
            <span className="h-[1px] w-8 bg-antique-gold" />
          </div>

          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6 leading-tight text-royal-ivory">
            Create Your Custom Royal Look
          </h2>

          <p className="text-sm md:text-base text-royal-ivory/80 font-light leading-relaxed max-w-xl mx-auto font-sans">
            Every celebration is unique. Collaborate with our atelier team to create
            an authentic Rajputi Poshak designed to your personalized measurements
            and cherished occasion.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-16">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="bg-charcoal-light/60 border border-antique-gold/25 p-8 backdrop-blur-sm relative group hover:border-antique-gold transition-colors duration-500"
            >
              <span className="text-xs uppercase tracking-[0.25em] text-antique-gold block mb-4 font-mono">
                {pillar.number}
              </span>
              <h3 className="font-serif text-2xl text-royal-ivory font-normal mb-3">
                {pillar.title}
              </h3>
              <p className="text-xs md:text-sm text-royal-ivory/70 font-light leading-relaxed font-sans">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA: Talk To Designer */}
        <div className="text-center">
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center justify-center px-10 py-4 bg-antique-gold hover:bg-antique-gold-light text-charcoal text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-[0_4px_30px_rgba(198,161,91,0.25)] hover:shadow-[0_4px_40px_rgba(198,161,91,0.4)]"
          >
            <span>Book Bespoke Consultation</span>
          </button>
        </div>
      </div>
    </section>
  );
}
