import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale, FileCheck, AlertCircle, Sparkles, CheckCircle2, RotateCcw, ShieldCheck, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Rajwadi Rajputi Poshak",
  description:
    "Read the Terms and Conditions for Rajwadi Rajputi Poshak. Understand our policies regarding handcrafted royal garments, pricing, order processing, and returns.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#140508] text-[#FAF6F0] selection:bg-[#C6A15B] selection:text-[#1F080C]">
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6A15B]/10 border border-[#C6A15B]/25 text-[#C6A15B] text-xs uppercase tracking-[0.2em] font-medium mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Store Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF6F0] font-normal tracking-wide leading-tight">
            Terms & <span className="text-[#C6A15B] italic">Conditions</span>
          </h1>
          <p className="mt-3 text-[#FAF6F0]/70 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Please review these terms carefully before exploring or placing an order with Rajwadi Rajputi Poshak. By using our website, you agree to be bound by these provisions.
          </p>
          <p className="text-xs text-[#FAF6F0]/40 mt-2">
            Last Updated: September 2026
          </p>
        </div>

        {/* Quick Summary Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#1F080C]/80 border border-[#855D25]/30 rounded-xl p-5 text-center">
            <Sparkles className="w-6 h-6 text-[#C6A15B] mx-auto mb-2.5" />
            <h3 className="text-[#FAF6F0] font-medium text-sm mb-1 font-serif">100% Authentic Handcraft</h3>
            <p className="text-[#FAF6F0]/60 text-xs leading-relaxed">Every poshak is created with genuine traditional Rajasthani craftsmanship.</p>
          </div>
          <div className="bg-[#1F080C]/80 border border-[#855D25]/30 rounded-xl p-5 text-center">
            <FileCheck className="w-6 h-6 text-[#C6A15B] mx-auto mb-2.5" />
            <h3 className="text-[#FAF6F0] font-medium text-sm mb-1 font-serif">Transparent Pricing</h3>
            <p className="text-[#FAF6F0]/60 text-xs leading-relaxed">GST and invoice totals are calculated strictly as per Indian statutory tax slabs.</p>
          </div>
          <div className="bg-[#1F080C]/80 border border-[#855D25]/30 rounded-xl p-5 text-center">
            <RotateCcw className="w-6 h-6 text-[#C6A15B] mx-auto mb-2.5" />
            <h3 className="text-[#FAF6F0] font-medium text-sm mb-1 font-serif">Damage Replacement</h3>
            <p className="text-[#FAF6F0]/60 text-xs leading-relaxed">Immediate replacement/alteration support for transit damage or defective items.</p>
          </div>
        </div>

        {/* Terms Content Body */}
        <div className="space-y-10 bg-[#1F080C]/50 border border-[#855D25]/25 rounded-2xl p-6 sm:p-10 text-[#FAF6F0]/85 text-sm sm:text-[15px] leading-relaxed font-light">
          {/* Section 1: Acceptance */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>1. Agreement & Acceptance</span>
            </h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement between you (&quot;User&quot;, &quot;Customer&quot;, &quot;you&quot;) and <strong className="text-[#FAF6F0] font-normal">Rajwadi Rajputi Poshak</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), governing your access to and purchase of items through our website and boutique services.
            </p>
            <p>
              By accessing our catalogue, placing an order, or booking a designer consultation, you confirm that you are at least 18 years of age and agree to comply with all applicable terms and Indian laws.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 2: Handcrafted Character & Color Variations */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>2. Handcrafted Poshak Authenticity & Color Accuracy</span>
            </h2>
            <p>
              Rajputi Poshaks are artisanal garments created using traditional hand embroidery (zardozi, gota patti, danka, kasab, kundan work) and heritage hand-dyeing processes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li><strong className="text-[#FAF6F0]">Handmade Nuances:</strong> Minor variations in embroidery stitch density, zari tone, or bead placement are the hallmark of authentic handcrafting, not manufacturing flaws.</li>
              <li><strong className="text-[#FAF6F0]">Color Representation:</strong> We capture our poshaks under professional daylight studio lighting. However, actual fabric tones (such as rani pink, royal kesariya, emerald green, and peacock blue) may show subtle variations depending on your screen resolution, mobile brightness, and OLED display calibrations.</li>
            </ul>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 3: Pricing & Payments */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>3. Pricing, GST Invoices & Payment Terms</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li>All prices displayed on the website are in Indian National Rupees (INR ₹).</li>
              <li>Official GST Tax Invoices are issued for every order in accordance with Government of India textile slabs:
                <ul className="list-circle pl-5 mt-1 space-y-1 text-xs sm:text-sm text-[#FAF6F0]/70">
                  <li>Poshaks & items above ₹5,000: <strong>18% GST</strong> (9% CGST + 9% SGST).</li>
                  <li>Poshaks & items up to ₹5,000: <strong>5% GST</strong> (2.5% CGST + 2.5% SGST).</li>
                </ul>
              </li>
              <li>We accept payments via UPI, Net Banking, Credit/Debit Cards, and Wallets through secure RBI-approved payment gateways. We reserve the right to decline or cancel transactions suspected of fraudulent activity.</li>
            </ul>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 4: Order Cancellation */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>4. Order Confirmation & Cancellation Policy</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li><strong className="text-[#FAF6F0]">Standard Orders:</strong> You may request order cancellation within <strong>12 hours</strong> of placing the order, provided the parcel has not already been packed and handed over to the courier.</li>
              <li><strong className="text-[#FAF6F0]">Custom Stitched / Bespoke Bridal:</strong> Once fabric cutting and custom karigar tailoring have commenced (typically 24 hours after measurement submission), custom orders cannot be cancelled or refunded.</li>
            </ul>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 5: Returns & Replacements */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>5. Return, Replacement & Alteration Policy</span>
            </h2>
            <p>
              Because each Rajputi Poshak is an intricate piece of luxury ethnic wear, we follow a stringent quality inspection protocol prior to dispatch.
            </p>
            <div className="bg-[#140508]/60 border border-[#855D25]/20 p-4 rounded-xl space-y-2">
              <h4 className="text-[#C6A15B] font-medium text-sm">Defective / Damaged in Transit:</h4>
              <p className="text-xs sm:text-sm text-[#FAF6F0]/75">
                In the rare event that an item is received with transit damage, wrong product, or severe defect, please notify us within <strong>48 hours</strong> of delivery with clear photographs and an <strong>unboxing video</strong>. We will arrange a free replacement or repair at our boutique.
              </p>
            </div>
            <div className="bg-[#140508]/60 border border-[#855D25]/20 p-4 rounded-xl space-y-2">
              <h4 className="text-[#C6A15B] font-medium text-sm">Tailoring Size Alterations:</h4>
              <p className="text-xs sm:text-sm text-[#FAF6F0]/75">
                If your custom stitched poshak requires minor fitting adjustments, our master tailors provide alteration support. Please reach out to our team to coordinate courier routing for alteration.
              </p>
            </div>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 6: Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>6. Intellectual Property Rights</span>
            </h2>
            <p>
              All content on this website—including poshak designs, embroidery motifs, photographs, videos, brand logos, brand names, styling compositions, and text—is the exclusive intellectual property of <strong className="text-[#FAF6F0]">Rajwadi Rajputi Poshak</strong> and protected under Indian Copyright and Trademark laws. Unauthorized reproduction, scraping, or commercial use is strictly prohibited.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 7: Governing Law & Jurisdiction */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>7. Governing Law & Legal Jurisdiction</span>
            </h2>
            <p>
              These Terms and Conditions and any transactions conducted on this website are governed by and construed in accordance with the laws of India. Any legal disputes or claims arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in <strong className="text-[#FAF6F0]">Nagpur, Maharashtra, India</strong>.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 8: Contact */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>8. Contact Information</span>
            </h2>
            <p>For questions regarding these Terms & Conditions or order assistance:</p>
            <div className="bg-[#140508]/70 border border-[#855D25]/30 rounded-xl p-5 space-y-2 text-xs sm:text-sm text-[#FAF6F0]/80">
              <div className="flex items-center gap-3">
                <span className="text-[#C6A15B] font-medium w-24">Boutique:</span>
                <span className="text-[#FAF6F0]">Rajwadi Rajputi Poshak</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C6A15B] font-medium w-24">Phone / WA:</span>
                <a href="tel:+918766667101" className="text-[#FAF6F0] hover:text-[#C6A15B] transition-colors">+91 8766667101</a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C6A15B] font-medium w-24">Address:</span>
                <span>EWS 41, near Maheshwari Bhawan, Hiwari Layout, Uday Nagar, Padole Nagar, Nagpur, Maharashtra 440008</span>
              </div>
            </div>
          </section>
        </div>

        {/* Policy navigation links */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#855D25]/20 text-xs sm:text-sm text-[#FAF6F0]/60">
          <Link href="/privacy-policy" className="hover:text-[#C6A15B] transition-colors underline underline-offset-4">
            ← View Privacy Policy
          </Link>
          <Link href="/shipping-policy" className="hover:text-[#C6A15B] transition-colors underline underline-offset-4">
            View Shipping & Delivery Policy →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
