import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Eye, FileText, Bell, HelpCircle, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Rajwadi Rajputi Poshak",
  description:
    "Read the Privacy Policy of Rajwadi Rajputi Poshak. Learn how we collect, protect, and handle your personal information with absolute royal discretion.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#140508] text-[#FAF6F0] selection:bg-[#C6A15B] selection:text-[#1F080C]">
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6A15B]/10 border border-[#C6A15B]/25 text-[#C6A15B] text-xs uppercase tracking-[0.2em] font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF6F0] font-normal tracking-wide leading-tight">
            Privacy <span className="text-[#C6A15B] italic">Policy</span>
          </h1>
          <p className="mt-3 text-[#FAF6F0]/70 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Your trust is our royal heritage. We are dedicated to safeguarding your personal data with complete transparency, integrity, and strict security protocols.
          </p>
          <p className="text-xs text-[#FAF6F0]/40 mt-2">
            Last Updated: September 2026
          </p>
        </div>

        {/* Quick Summary Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#1F080C]/80 border border-[#855D25]/30 rounded-xl p-5 text-center">
            <Lock className="w-6 h-6 text-[#C6A15B] mx-auto mb-2.5" />
            <h3 className="text-[#FAF6F0] font-medium text-sm mb-1 font-serif">100% Encrypted</h3>
            <p className="text-[#FAF6F0]/60 text-xs leading-relaxed">All transactions and personal details are encrypted via SSL protocols.</p>
          </div>
          <div className="bg-[#1F080C]/80 border border-[#855D25]/30 rounded-xl p-5 text-center">
            <Eye className="w-6 h-6 text-[#C6A15B] mx-auto mb-2.5" />
            <h3 className="text-[#FAF6F0] font-medium text-sm mb-1 font-serif">No Data Selling</h3>
            <p className="text-[#FAF6F0]/60 text-xs leading-relaxed">We never sell, rent, or lease your personal information to any third party.</p>
          </div>
          <div className="bg-[#1F080C]/80 border border-[#855D25]/30 rounded-xl p-5 text-center">
            <ShieldCheck className="w-6 h-6 text-[#C6A15B] mx-auto mb-2.5" />
            <h3 className="text-[#FAF6F0] font-medium text-sm mb-1 font-serif">Secure Gateways</h3>
            <p className="text-[#FAF6F0]/60 text-xs leading-relaxed">Payments are processed through RBI-compliant, PCI-DSS certified partners.</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-10 bg-[#1F080C]/50 border border-[#855D25]/25 rounded-2xl p-6 sm:p-10 text-[#FAF6F0]/85 text-sm sm:text-[15px] leading-relaxed font-light">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>1. Introduction</span>
            </h2>
            <p>
              Welcome to <strong className="text-[#FAF6F0] font-normal">Rajwadi Rajputi Poshak</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We value your privacy and are committed to protecting the personal information you share with us while browsing our boutique website, ordering custom or ready-to-wear Rajputi poshaks, or interacting with our concierge.
            </p>
            <p>
              This Privacy Policy explains what information we collect, how it is used, stored, and protected in compliance with the Information Technology Act, 2000 and applicable digital privacy regulations in India.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>2. Information We Collect</span>
            </h2>
            <p>When you visit or place an order through our store, we collect the following categories of information:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li><strong className="text-[#FAF6F0]">Contact & Delivery Information:</strong> Full name, shipping and billing address, email address, mobile phone number, and postal code.</li>
              <li><strong className="text-[#FAF6F0]">Order & Customization Details:</strong> Items purchased, custom bespoke tailoring measurements (if provided), order notes, and transaction history.</li>
              <li><strong className="text-[#FAF6F0]">Payment Transaction Data:</strong> Transaction reference IDs, payment status, and chosen payment method. <em>(Please note: We do NOT store your credit card numbers, CVVs, or bank PINs on our servers. All financial transactions are securely handled by certified payment gateways like Razorpay).</em></li>
              <li><strong className="text-[#FAF6F0]">Technical & Device Data:</strong> IP address, browser type, operating system, pages viewed, and referral URLs to optimize website speed and mobile responsiveness.</li>
            </ul>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>3. How We Use Your Information</span>
            </h2>
            <p>We use your personal data strictly for legitimate business and fulfillment purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li>Processing, packing, and dispatching your poshak orders.</li>
              <li>Sending automated order confirmation emails, invoices, and real-time courier tracking links.</li>
              <li>Providing customer support and designer consultation via WhatsApp or phone call.</li>
              <li>Facilitating exchanges or size alterations as per our store policy.</li>
              <li>Preventing fraudulent orders and maintaining platform security.</li>
            </ul>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>4. Sharing & Disclosure of Information</span>
            </h2>
            <p>We do not sell or monetize your personal information. We only share necessary details with trusted partners who help us deliver your poshak safely:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li><strong className="text-[#FAF6F0]">Logistics & Courier Partners:</strong> Third-party couriers (e.g., Shiprocket, Delhivery, BlueDart, DTDC) receive your name, delivery address, and phone number solely for package delivery.</li>
              <li><strong className="text-[#FAF6F0]">Payment Gateways:</strong> PCI-DSS compliant payment aggregators (e.g., Razorpay) to authorize transactions securely.</li>
              <li><strong className="text-[#FAF6F0]">Legal Authorities:</strong> We may disclose information if mandated by Indian law, court summons, or to protect the legal rights and safety of our customers and brand.</li>
            </ul>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>5. Data Security & Retention</span>
            </h2>
            <p>
              We implement industry-standard 256-bit SSL encryption, firewalls, and restricted database access to safeguard your data against unauthorized access, alteration, or theft.
            </p>
            <p>
              We retain transaction records only as long as necessary for tax compliance, accounting audits, GST reporting, and order history support.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>6. Cookies & Tracking Technologies</span>
            </h2>
            <p>
              Our website uses essential cookies to remember your bag items, active session, and preferences during checkout. You can disable cookies in your browser settings, though some shopping features may not function seamlessly.
            </p>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>7. Your Rights</span>
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#FAF6F0]/75">
              <li>Request a copy of the personal information we hold about you.</li>
              <li>Request correction or updating of inaccurate delivery information.</li>
              <li>Opt-out of any promotional messages or email communications at any time.</li>
            </ul>
          </section>

          <div className="h-px bg-[#855D25]/20 w-full" />

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-serif text-[#C6A15B] font-medium flex items-center gap-2">
              <span>8. Grievance Officer & Contact Us</span>
            </h2>
            <p>
              If you have any questions, concerns, or grievances regarding this Privacy Policy or the handling of your personal data, please contact our support team:
            </p>
            
            <div className="bg-[#140508]/70 border border-[#855D25]/30 rounded-xl p-5 space-y-2.5 text-xs sm:text-sm text-[#FAF6F0]/80">
              <div className="flex items-center gap-3">
                <span className="text-[#C6A15B] font-medium w-24">Brand:</span>
                <span className="text-[#FAF6F0]">Rajwadi Rajputi Poshak</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C6A15B] font-medium w-24">Phone / WA:</span>
                <a href="tel:+918766667101" className="text-[#FAF6F0] hover:text-[#C6A15B] transition-colors">+91 8766667101</a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C6A15B] font-medium w-24">Boutique:</span>
                <span>EWS 41, near Maheshwari Bhawan, Hiwari Layout, Uday Nagar, Padole Nagar, Nagpur, Maharashtra 440008</span>
              </div>
            </div>
          </section>
        </div>

        {/* Policy navigation links */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#855D25]/20 text-xs sm:text-sm text-[#FAF6F0]/60">
          <Link href="/terms-and-conditions" className="hover:text-[#C6A15B] transition-colors underline underline-offset-4">
            View Terms & Conditions →
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
