"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contact" className="bg-charcoal text-royal-ivory pt-20 pb-12 border-t border-antique-gold/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-royal-ivory/10">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3.5 mb-4 group">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/logo without bg.png"
                  alt="Rajwadi Royal Emblem"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-widest text-royal-ivory block font-normal leading-none">
                  RAJWADI
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-antique-gold font-medium mt-1">
                  Authentic Rajputi Poshaks
                </span>
              </div>
            </Link>
            <p className="text-xs md:text-sm text-royal-ivory/70 font-light leading-relaxed max-w-sm font-sans mb-6">
              Specializing exclusively in authentic Rajputi Poshaks for weddings,
              sacred festivals, and royal celebrations. Preserving ancestral
              Rajasthani craftsmanship.
            </p>
            <div className="text-xs text-antique-gold tracking-widest uppercase font-medium">
              Handcrafted With Devotion
            </div>
          </div>

          {/* Collections Column */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-lg text-royal-ivory mb-5 tracking-wide">
              Collections
            </h4>
            <ul className="space-y-3 text-xs text-royal-ivory/70 font-light font-sans tracking-wider">
              <li>
                <Link href="#collections" className="hover:text-antique-gold transition-colors">
                  Bridal Rajputi Poshaks
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-antique-gold transition-colors">
                  Festive Collection
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-antique-gold transition-colors">
                  Traditional Rajputi Wear
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-antique-gold transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-lg text-royal-ivory mb-5 tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-3 text-xs text-royal-ivory/70 font-light font-sans tracking-wider">
              <li>
                <Link href="#custom" className="hover:text-antique-gold transition-colors">
                  Custom Measurements & Fitting
                </Link>
              </li>
              <li>
                <Link href="#custom" className="hover:text-antique-gold transition-colors">
                  Talk To Designer
                </Link>
              </li>
              <li>
                <Link href="#story" className="hover:text-antique-gold transition-colors">
                  Fabric & Embroidery Details
                </Link>
              </li>
              <li>
                <Link href="#lookbook" className="hover:text-antique-gold transition-colors">
                  Lookbook & Styling Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Showroom Details (Client-Safe) */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-lg text-royal-ivory mb-5 tracking-wide">
              Contact & Showroom
            </h4>
            <div className="space-y-3 text-xs text-royal-ivory/70 font-light font-sans leading-relaxed">
              <p>
                Showroom and appointment information provided directly by the
                brand concierge.
              </p>
              <p className="pt-2 text-antique-gold font-medium">
                Email: concierge@rajwadi.in
              </p>
              <p className="text-antique-gold font-medium">
                Concierge Hours: Mon – Sat, 10:00 AM – 7:00 PM IST
              </p>
              <div className="pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs uppercase tracking-widest text-royal-ivory hover:text-antique-gold underline underline-offset-4 transition-colors"
                >
                  Instagram • @rajwadi_poshaks
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-royal-ivory/50 font-sans tracking-wider">
          <p>© {new Date().getFullYear()} Rajwadi. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span>Authentic Rajputi Couture</span>
            <span>•</span>
            <span>Heritage Preserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
