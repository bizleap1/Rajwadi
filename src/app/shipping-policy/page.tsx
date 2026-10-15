import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Truck, Clock, PackageCheck, MapPin, ShieldAlert, Sparkles, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Rajwadi Rajputi Poshak",
  description:
    "Explore the Shipping and Delivery Policy of Rajwadi Rajputi Poshak. Free delivery across India with insured luxury courier packaging and real-time order tracking.",
  alternates: {
    canonical: "/shipping-policy",
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#140508] text-[#FAF6F0] selection:bg-[#C6A15B] selection:text-[#1F080C]">
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6A15B]/10 border border-[#C6A15B]/25 text-[#C6A15B] text-xs uppercase tracking-[0.2em] font-medium mb-4">
            <Truck className="w-3.5 h-3.5" />
            <span>Royal Dispatch & Delivery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF6F0] font-normal tracking-wide leading-tight">
            Shipping & <span className="text-[#C6A15B] italic">Delivery Policy</span>
          </h1>
          <p className="mt-3 text-[#FAF6F0]/70 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Every Rajwadi Poshak is an embodiment of royal craftsmanship. We ensure your heritage attire is delivered with exceptional care, security, and promptness.
          </p>
          <p className="text-xs text-[#FAF6F0]/40 mt-2">
            Last Updated: September 2026
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#1F080C]/80 border border-[#855D25]/30 rounded-xl p-5 text-center">
            <Sparkles className="w-6 h-6 text-[#C6A15B] mx-auto mb-2.5" />
            <h3 className="text-[#FAF6F0] font-medium text-sm mb-1 font-serif">Free Shipping</h3>
            <p className="text-[#FAF6F0]/60 text-xs leading-relaxed">Complimentary standard delivery across all PIN codes in India.</p>
          </div>
          <div className="bg-[#1F080C]/80 border border-[#855D25]/30 rounded-xl p-5 text-center">
            <Clock className="w-6 h-6 text-[#C6A15B] mx-auto mb-2.5" />
            <h3 className="text-[#FAF6F0] font-medium text-sm mb-1 font-serif">4 - 7 Days Delivery</h3>
            <p className="text-[#FAF6F0]/60 text-xs leading-relaxed">Swift transit with premium express air and surface couriers.</p>
          </div>
          <div className="bg-[#1F080C]/80 border border-[#855D25]/30 rounded-xl p-5 text-center">
            <PackageCheck className="w-6 h-6 text-[#C6A15B] mx-auto mb-2.5" />
            <h3 className="text-[#FAF6F0] font-medium text-sm mb-1 font-serif">Tamper-Proof Box</h3>
            <p className="text-[#FAF6F0]/60 text-xs leading-relaxed">Luxury moisture-barrier box protecting pure zari and delicate fabrics.</p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 bg-[#1F080C]/50 border border-[#855D25]/25 rounded-2xl p-6 sm:p-10 text-[#FAF6F0]/85 text-sm sm:text-[15px] leading-relaxed font-light">
          {/* 1. Order Processing & Dispatch Timelines */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>1. Order Processing & Dispatch Timelines</span>
            </h2>
            <p>
              Once your order is placed and confirmed on our portal, dispatch timelines vary depending on whether the poshak is ready-to-ship or bespoke:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#140508]/60 border border-[#855D25]/20 p-4 rounded-xl">
                <h4 className="text-[#C6A15B] font-medium text-sm mb-1">Ready-to-Ship / Unstitched Fabric:</h4>
                <p className="text-xs text-[#FAF6F0]/70">
                  Dispatched within <strong>24 to 48 hours</strong> from our Nagpur boutique after passing multi-point quality inspection.
                </p>
              </div>
              <div className="bg-[#140508]/60 border border-[#855D25]/20 p-4 rounded-xl">
                <h4 className="text-[#C6A15B] font-medium text-sm mb-1">Custom Stitched & Bridal Trousseau:</h4>
                <p className="text-xs text-[#FAF6F0]/70">
                  Tailored by master karigars based on your specific measurements. Dispatched within <strong>7 to 12 working days</strong>.
                </p>
              </div>
            </div>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* 2. Delivery Timelines Across India */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>2. Estimated Delivery Timelines</span>
            </h2>
            <p>
              We partner with India&apos;s leading logistics networks (BlueDart, Delhivery, DTDC, and Express Air) to ensure swift door-to-door delivery:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li><strong className="text-[#FAF6F0]">Metro Cities (Delhi NCR, Mumbai, Bengaluru, Jaipur, Hyderabad, Chennai, Kolkata):</strong> Estimated 3 to 5 business days post-dispatch.</li>
              <li><strong className="text-[#FAF6F0]">Tier-2 & Tier-3 Cities / Rest of India:</strong> Estimated 4 to 7 business days post-dispatch.</li>
              <li><strong className="text-[#FAF6F0]">Remote / North-East / Island Locations:</strong> Estimated 6 to 9 business days depending on local pin code logistics.</li>
            </ul>
            <p className="text-xs text-[#C6A15B] italic pt-1">
              * Note: Delivery times may experience slight delays during major national festive periods (Diwali, Teej, Rakhi, Wedding peak seasons) or due to natural weather disruptions.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* 3. Shipping Charges */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>3. Shipping Charges</span>
            </h2>
            <p>
              We are proud to offer <strong className="text-[#C6A15B]">Complimentary Free Standard Shipping</strong> on all poshak orders across India. There are no hidden courier charges added at checkout.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* 4. Real-Time Order Tracking */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>4. Order Tracking & Notifications</span>
            </h2>
            <p>
              As soon as your package is handed over to our courier partner, you will receive an automatic dispatch notification containing:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li>Your unique Courier Tracking AWB number.</li>
              <li>The assigned Courier Partner name (e.g., Delhivery, BlueDart).</li>
              <li>A direct 1-click live tracking link to monitor your shipment from origin to your doorstep.</li>
            </ul>
            <p>
              You can also track your order anytime directly on our website using your Order ID and Phone Number.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* 5. Luxury Packaging & Transit Safety */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>5. Luxury Packaging & Transit Security</span>
            </h2>
            <p>
              Rajputi Poshaks feature exquisite hand-embroidery (zari, gota patti, danka, and kundan work). To ensure your garment reaches you in pristine condition:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li>Garments are wrapped in protective breathable covers and enclosed inside a rigid Rajwadi signature box.</li>
              <li>The exterior carton is sealed with heavy-duty tamper-evident security tape.</li>
            </ul>
            <div className="bg-[#C6A15B]/10 border border-[#C6A15B]/30 rounded-xl p-4 flex items-start gap-3 mt-3">
              <ShieldAlert className="w-5 h-5 text-[#C6A15B] flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#FAF6F0]/80">
                <strong>Important Inspection Note:</strong> If the outer parcel appears torn, opened, or heavily tampered with at the time of delivery, please refuse delivery and immediately notify us at +91 8766667101.
              </p>
            </div>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* 6. Address Modifications */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>6. Address Changes & Delivery Attempts</span>
            </h2>
            <p>
              If you made a typo in your shipping address, please contact our concierge team within <strong>6 hours</strong> of placing your order. Once a parcel is dispatched with an active AWB, rerouting may cause additional transit delays.
            </p>
            <p>
              Couriers typically attempt delivery up to 3 times before returning the package to our boutique. Please ensure your mobile number is reachable during delivery days.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* 7. International Orders */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>7. International Shipping (Worldwide)</span>
            </h2>
            <p>
              We ship authentic Rajputi attire to clients across the USA, UK, UAE, Canada, Australia, and worldwide via DHL / FedEx Express.
            </p>
            <p>
              For worldwide deliveries, customs duties/import taxes (if applicable in your destination country) are determined by local customs authorities and are borne by the recipient. Contact our WhatsApp concierge (+91 8766667101) for international quotes.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* 8. Help & Inquiries */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>8. Need Assistance with Your Shipment?</span>
            </h2>
            <p>Our dedicated boutique desk is always available to help expedite your delivery:</p>
            <div className="bg-[#140508]/70 border border-[#855D25]/30 rounded-xl p-5 space-y-2 text-xs sm:text-sm text-[#FAF6F0]/80">
              <div className="flex items-center gap-3">
                <span className="text-[#C6A15B] font-medium w-24">Phone / WA:</span>
                <a href="https://wa.me/918766667101" target="_blank" rel="noopener noreferrer" className="text-[#FAF6F0] hover:text-[#C6A15B] transition-colors">+91 8766667101</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C6A15B] font-medium w-24">Working Hours:</span>
                <span>Monday to Saturday (10:30 AM – 8:00 PM IST)</span>
              </div>
            </div>
          </section>
        </div>

        {/* Policy navigation links */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#855D25]/20 text-xs sm:text-sm text-[#FAF6F0]/60">
          <Link href="/privacy-policy" className="hover:text-[#C6A15B] transition-colors underline underline-offset-4">
            ← View Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-[#C6A15B] transition-colors underline underline-offset-4">
            View Terms & Conditions →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
