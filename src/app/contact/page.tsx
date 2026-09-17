"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TalkToDesignerModal = dynamic(
  () => import("@/components/TalkToDesignerModal"),
  { ssr: false }
);

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
});

interface FormState {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    const cleanedPhone = formData.mobile.replace(/[\s\-()]/g, "");
    if (!cleanedPhone || cleanedPhone.length < 10) {
      newErrors.mobile = "Please enter a valid mobile number (min 10 digits).";
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = "Please share a brief message regarding your enquiry.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate brief submission dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", mobile: "", message: "" });
    setErrors({});
    setIsSubmitted(false);
  };

  const GOOGLE_MAPS_URL =
    "https://maps.google.com/?q=Rajwadi+Rajputi+Poshak,+EWS+41,+near+Maheshwari+bhawan,+Hiwari+Layout,+Uday+Nagar,+Padole+Nagar,+Nagpur,+Maharashtra+440008";

  const WHATSAPP_URL =
    "https://wa.me/918766667101?text=Hello%20Rajwadi%2C%20I%20would%20like%20to%20inquire%20about%20a%20poshak.";

  return (
    <main className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#F8F1E7]">
      {/* Navigation */}
      <Navbar
        solidOnTop
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. COMPACT HERO                                                       */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 border-b border-[#E6DCB8]/60 bg-[#FAF6F0]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2.5 mb-2.5 sm:mb-3"
          >
            <span className="h-[1px] w-6 bg-[#855D25]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#855D25] font-semibold font-sans">
              GET IN TOUCH
            </span>
            <span className="h-[1px] w-6 bg-[#855D25]" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#171717] font-normal tracking-wide leading-[1.15] mb-2.5 sm:mb-3"
          >
            We'd love to hear from you.
          </motion.h1>

          {/* Short Supporting Line */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif italic text-sm sm:text-base text-[#6B635B] font-light max-w-lg mx-auto leading-relaxed"
          >
            For Poshak enquiries, styling assistance or anything else, we're here to help.
          </motion.p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN CONTACT SECTION                                               */}
      {/* (Desktop: 2-column layout | Mobile: cleanly stacked vertically)       */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* ───── LEFT: CONTACT INFORMATION (Concierge Style) ───── */}
            <div className="lg:col-span-5 space-y-7 sm:space-y-8 text-left">
              
              {/* Phone / Direct Call */}
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans block mb-1.5">
                  CONTACT
                </span>
                <a
                  href="tel:+918766667101"
                  className="font-serif text-2xl sm:text-[26px] text-[#171717] hover:text-[#855D25] font-light transition-colors block leading-tight"
                >
                  +91 8766667101
                </a>
              </div>

              {/* WhatsApp Concierge */}
              <div className="pt-1">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans block mb-1.5">
                  WHATSAPP
                </span>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm sm:text-[15px] text-[#5A1F2B] hover:text-[#855D25] font-medium font-sans transition-colors group cursor-pointer"
                >
                  <span>Connect with us</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
              </div>

              {/* Thin Divider */}
              <div className="h-[1px] bg-[#E6DCB8]/70 w-full" />

              {/* Store Address */}
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans block mb-2">
                  STORE ADDRESS
                </span>
                <address className="not-italic text-[13px] sm:text-[14px] text-[#4A423B] font-light leading-relaxed font-sans space-y-0.5 mb-3">
                  <p className="font-serif text-[15px] sm:text-base text-[#171717] font-normal mb-1">
                    Rajwadi Rajputi Poshak
                  </p>
                  <p>EWS 41, near Maheshwari Bhawan,</p>
                  <p>Hiwari Layout, Uday Nagar,</p>
                  <p>Padole Nagar, Nagpur,</p>
                  <p>Maharashtra 440008</p>
                </address>

                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#855D25] hover:text-[#5A1F2B] font-medium uppercase tracking-[0.2em] font-sans transition-colors group"
                >
                  <span>GET DIRECTIONS</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
              </div>

              {/* Thin Divider for Desktop */}
              <div className="h-[1px] bg-[#E6DCB8]/70 w-full hidden lg:block" />

              {/* Social Channels (Desktop) */}
              <div className="hidden lg:block">
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans block mb-2">
                  FOLLOW RAJWADI
                </span>
                <div className="flex items-center gap-4 text-xs tracking-wider uppercase font-sans font-medium text-[#5A1F2B]">
                  <a
                    href="https://www.instagram.com/rajwadirajputiposhak/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#855D25] transition-colors"
                  >
                    Instagram
                  </a>
                  <span className="text-[#855D25]/40 font-light">·</span>
                  <a
                    href="https://www.facebook.com/p/Rajwadi-Rajputi-Poshak-100075751886924/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#855D25] transition-colors"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>

            {/* ───── RIGHT: ENQUIRY FORM (Clean Luxury Concierge) ───── */}
            <div className="lg:col-span-7 bg-[#FAF6F0] border border-[#E6DCB8]/80 p-6 sm:p-8 lg:p-10 text-left">
              <div className="mb-6">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#855D25] font-semibold font-sans block mb-1">
                  SEND AN ENQUIRY
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-light">
                  How can we assist you?
                </h2>
              </div>

              {isSubmitted ? (
                <div className="py-8 sm:py-12 text-center space-y-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#5A1F2B]/10 text-[#5A1F2B] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal">
                    Enquiry Received
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#4A423B] font-light max-w-sm mx-auto leading-relaxed font-sans">
                    Thank you for contacting Rajwadi. Our bridal styling concierge will reach out to you directly on your provided phone number and email.
                  </p>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs uppercase tracking-[0.2em] text-[#5A1F2B] hover:text-[#855D25] font-medium underline font-sans cursor-pointer transition-colors"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                    >
                      Name <span className="text-[#855D25]">*</span>
                    </label>
                    <input
                      id="enquiry-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="Your full name"
                      className={`w-full px-3.5 py-3 bg-white border ${
                        errors.name ? "border-[#A32020]" : "border-[#E6DCB8]"
                      } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-none transition-colors font-sans`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-[#A32020] mt-1 font-sans">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="enquiry-email"
                      className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                    >
                      Email <span className="text-[#855D25]">*</span>
                    </label>
                    <input
                      id="enquiry-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="name@example.com"
                      className={`w-full px-3.5 py-3 bg-white border ${
                        errors.email ? "border-[#A32020]" : "border-[#E6DCB8]"
                      } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-none transition-colors font-sans`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-[#A32020] mt-1 font-sans">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label
                      htmlFor="enquiry-mobile"
                      className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                    >
                      Mobile Number <span className="text-[#855D25]">*</span>
                    </label>
                    <input
                      id="enquiry-mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => {
                        setFormData({ ...formData, mobile: e.target.value });
                        if (errors.mobile) setErrors({ ...errors, mobile: undefined });
                      }}
                      placeholder="+91 98765 43210"
                      className={`w-full px-3.5 py-3 bg-white border ${
                        errors.mobile ? "border-[#A32020]" : "border-[#E6DCB8]"
                      } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-none transition-colors font-sans`}
                    />
                    {errors.mobile && (
                      <p className="text-[11px] text-[#A32020] mt-1 font-sans">
                        {errors.mobile}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="enquiry-message"
                      className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                    >
                      Message <span className="text-[#855D25]">*</span>
                    </label>
                    <textarea
                      id="enquiry-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Please share details of the poshak design, occasion date, or styling queries you have..."
                      className={`w-full px-3.5 py-3 bg-white border ${
                        errors.message ? "border-[#A32020]" : "border-[#E6DCB8]"
                      } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-none transition-colors font-sans resize-none`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-[#A32020] mt-1 font-sans">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#5A1F2B] hover:bg-[#431520] active:scale-[0.99] text-[#FAF6F0] text-xs uppercase tracking-[0.24em] font-medium font-sans transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
                    >
                      <span>{isSubmitting ? "SENDING..." : "SEND ENQUIRY"}</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. COMPACT WHATSAPP SECTION                                           */}
      {/* (Prominent consultation-oriented band below main contact section)      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF4EB] border-y border-[#E6DCB8]/80 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8">
          <div>
            <h3 className="font-serif text-2xl sm:text-[26px] text-[#171717] font-light leading-snug mb-1">
              Prefer a conversation?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#6B635B] font-light">
              Speak with us directly about your Poshak.
            </p>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.22em] font-medium font-sans transition-all duration-200 shadow-sm group cursor-pointer"
          >
            <span>WHATSAPP US</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. STORE LOCATION & MAP                                               */}
      {/* (40–50% width clean map + address layout, not full-screen giant map)  */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left: Store Visit Editorial Details (5 cols) */}
            <div className="lg:col-span-5 text-left space-y-4">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="h-[1px] w-5 bg-[#855D25]" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#855D25] font-semibold font-sans">
                  STORE LOCATION
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light tracking-wide leading-tight">
                VISIT US
              </h2>

              <address className="not-italic text-[13px] sm:text-[14px] text-[#4A423B] font-light leading-relaxed font-sans space-y-0.5 pt-1">
                <p className="font-serif text-base text-[#171717] font-normal mb-1">
                  Rajwadi Rajputi Poshak
                </p>
                <p>EWS 41, near Maheshwari Bhawan,</p>
                <p>Hiwari Layout, Uday Nagar,</p>
                <p>Padole Nagar, Nagpur,</p>
                <p>Maharashtra 440008</p>
              </address>

              <p className="text-xs text-[#6B635B] font-light leading-relaxed font-sans pt-1">
                Private bridal viewings and fabric draping consultations. For personal concierge attention, we encourage connecting via WhatsApp prior to your visit.
              </p>

              <div className="pt-2">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#855D25] text-[#855D25] hover:bg-[#855D25] hover:text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-all duration-300 group cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>GET DIRECTIONS</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
              </div>
            </div>

            {/* Right: Clean Map Display (~45-50% width on desktop) */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] overflow-hidden bg-[#FAF5EE] border border-[#E6DCB8] shadow-xs">
                <iframe
                  title="Rajwadi Boutique Nagpur Location Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=79.1100%2C21.1270%2C79.1250%2C21.1380&layer=mapnik&marker=21.1326%2C79.1172"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
                
                {/* Overlay link banner directly to Google Maps */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs border border-[#E6DCB8] px-3 py-1.5 text-[11px] font-sans font-medium text-[#5A1F2B] hover:text-[#855D25] shadow-xs transition-colors">
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <span>Open in Google Maps</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Social Channels (Mobile Only) */}
          <div className="pt-10 border-t border-[#E6DCB8]/60 mt-10 text-center lg:hidden">
            <div className="flex items-center justify-center gap-4 text-xs tracking-wider uppercase font-sans font-medium text-[#5A1F2B]">
              <a
                href="https://www.instagram.com/rajwadirajputiposhak/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#855D25] transition-colors"
              >
                Instagram
              </a>
              <span className="text-[#855D25]/40 font-light">·</span>
              <a
                href="https://www.facebook.com/p/Rajwadi-Rajputi-Poshak-100075751886924/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#855D25] transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Shopping Bag Drawer */}
      <CartDrawer onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* Designer Consultation Modal */}
      <TalkToDesignerModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {/* Global Footer */}
      <Footer onOpenConsultation={() => setIsConsultationOpen(true)} />
    </main>
  );
}
