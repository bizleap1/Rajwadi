import React from "react";
import Link from "next/link";

interface ContactSectionProps {
  onOpenConsultation?: () => void;
}

export default function ContactSection({
  onOpenConsultation,
}: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="relative scroll-mt-20 md:scroll-mt-24 pt-7 sm:pt-11 md:pt-18 pb-10 sm:pb-12 md:pb-13 bg-[#F4ECE1] border-t border-[#855D25]/15 border-b border-[#5A1F2B]/35"
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
        {/* Heading: Shorter & Premium */}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-[38px] text-[#171717] font-light tracking-wide leading-tight uppercase mb-2 sm:mb-2.5">
          FIND YOUR POSHAK
        </h2>

        {/* Subtitle: Intentional Editorial 2-Line Cadence */}
        <p className="font-serif italic text-base sm:text-lg md:text-[18px] text-[#171717]/85 font-normal leading-relaxed max-w-lg mx-auto mb-6 sm:mb-7">
          For your next celebration,<br />
          begin with something timeless.
        </p>

        {/* Action Buttons: Clear Hierarchy (Burgundy Primary vs Refined Narrower Secondary) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4.5">
          {/* Primary Action: WHATSAPP US → */}
          <a
            href="https://wa.me/918766667101?text=Hello%20Rajwadi%2C%20I%20would%20like%20to%20inquire%20about%20a%20poshak."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-9 py-3 sm:py-3.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#F8F1E7] text-[11px] sm:text-xs uppercase tracking-[0.24em] font-medium border border-[#C6A15B]/50 transition-all duration-300 shadow-sm active:scale-[0.98] cursor-pointer group"
          >
            <span>WHATSAPP US</span>
            <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 font-serif text-sm leading-none text-[#E5C384]">
              &rarr;
            </span>
          </a>

          {/* Secondary Action: CONTACT US → (Navigates to /contact page) */}
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-transparent hover:bg-[#171717]/5 text-[#171717]/75 hover:text-[#171717] text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.22em] font-medium border border-[#171717]/25 hover:border-[#171717]/50 transition-all duration-300 active:scale-[0.98] cursor-pointer group"
          >
            <span>CONTACT US</span>
            <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 font-serif text-sm leading-none text-[#171717]/55 group-hover:text-[#171717]">
              &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* Subtle Burgundy Transition Divider at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#5A1F2B]/45 to-transparent pointer-events-none" />
    </section>
  );
}
