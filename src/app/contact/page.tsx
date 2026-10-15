"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Crown,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  Calendar,
  Send,
  ExternalLink,
} from "lucide-react";
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
  occasion: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  message?: string;
}

const OCCASIONS = [
  "Bridal Poshak (Trousseau)",
  "Royal Sangeet & Reception",
  "Heritage Festive Ceremony",
  "Custom Sizing & Tailoring",
  "Fabric & Zari Needlework",
  "General Inquiry",
];

const FAQS = [
  {
    q: "How does custom bridal poshak tailoring work?",
    a: "Every poshak can be ordered unstitched, semi-stitched, or fully custom-tailored to your exact measurements. Our master karigars hand-stitch the kalis, magji, and kanchali lining with heritage precision.",
  },
  {
    q: "Can I inspect fabric swatches and hand embroidery via video call?",
    a: "Yes. Our concierge team regularly arranges live one-on-one video calls over WhatsApp (+91 8766667101) so you can examine the zari sparkle, gota patti detailing, and fabric drape in real time.",
  },
  {
    q: "What are your delivery timelines across India?",
    a: "Ready-to-wear poshaks are dispatched from our Nagpur atelier within 24-48 hours via insured express air courier (3-5 business days delivery across India). Bespoke bridal orders with intricate hand zardozi take 12-18 days.",
  },
  {
    q: "Do I need an appointment to visit the Nagpur atelier?",
    a: "Walk-ins are always welcome during our store hours (11:00 AM – 8:30 PM daily). For private bridal trousseau viewings and custom designer fittings, we recommend booking in advance via our concierge or WhatsApp.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    mobile: "",
    occasion: OCCASIONS[0],
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mapMode, setMapMode] = useState<"roadmap" | "satellite">("roadmap");

  const STORE_ADDRESS =
    "EWS 41, near Maheshwari Bhawan, Hiwari Layout, Uday Nagar, Padole Nagar, Nagpur, Maharashtra 440008";

  const GOOGLE_MAPS_URL =
    "https://maps.google.com/?q=Rajwadi+Rajputi+Poshak,+EWS+41,+near+Maheshwari+bhawan,+Hiwari+Layout,+Uday+Nagar,+Padole+Nagar,+Nagpur,+Maharashtra+440008";

  const GOOGLE_MAPS_DIRECTIONS_URL =
    "https://www.google.com/maps/dir/?api=1&destination=Rajwadi+Rajputi+Poshak,+EWS+41,+near+Maheshwari+bhawan,+Hiwari+Layout,+Nagpur,+Maharashtra+440008";

  const googleMapsEmbedUrl =
    mapMode === "satellite"
      ? "https://maps.google.com/maps?q=Rajwadi+Rajputi+Poshak,+EWS+41,+near+Maheshwari+Bhawan,+Hiwari+Layout,+Nagpur,+Maharashtra+440008&t=k&z=17&ie=UTF8&iwloc=&output=embed"
      : "https://maps.google.com/maps?q=Rajwadi+Rajputi+Poshak,+EWS+41,+near+Maheshwari+Bhawan,+Hiwari+Layout,+Nagpur,+Maharashtra+440008&t=m&z=16&ie=UTF8&iwloc=&output=embed";

  const WHATSAPP_URL =
    "https://wa.me/918766667101?text=Hello%20Rajwadi%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20your%20poshak%20collection%20and%20tailoring.";

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        `Rajwadi Rajputi Poshak, ${STORE_ADDRESS}`
      );
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    } catch {
      // Fallback
    }
  };

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
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = "Please share a brief message regarding your requirements.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setApiError(err.message || "Something went wrong. Please try again or reach out on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      occasion: OCCASIONS[0],
      message: "",
    });
    setErrors({});
    setApiError("");
    setIsSubmitted(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#581522] selection:text-[#FAF5EE]">
      {/* Top Header Navigation */}
      <Navbar
        solidOnTop
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO HEADER                                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-12 bg-gradient-to-b from-[#FAF4EA] to-[#FDFBF7] border-b border-[#E6DCB8]/60 text-center">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#581522]/5 border border-[#855D25]/25 mb-3.5">
            <Crown className="w-3.5 h-3.5 text-[#855D25]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans">
              ATELIER CONCIERGE
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#171717] font-normal tracking-tight leading-tight mb-3">
            Connect With Rajwadi
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#6B5E55] font-light max-w-xl mx-auto leading-relaxed">
            For bespoke bridal inquiries, custom tailoring, or an atelier appointment in Nagpur, our concierge is here to assist you.
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN CONTENT: ATELIER INFORMATION (LEFT) + ENQUIRY FORM (RIGHT)   */}
      {/* (Everything is stated once cleanly, without redundant duplicate cards)  */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ───── LEFT: SINGLE UNIFIED ATELIER DETAILS (5 cols) ───── */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans block mb-1">
                FLAGSHIP STORE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal leading-snug">
                Rajwadi Rajputi Poshak
              </h2>
            </div>

            {/* Address Block */}
            <div className="p-5 bg-[#FAF6F0] border border-[#E6DCB8] rounded-xs space-y-3 font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#855D25] flex-shrink-0 mt-1" />
                <div className="text-xs text-[#4A423B] leading-relaxed">
                  <p className="font-serif text-sm text-[#171717] font-medium mb-0.5">
                    Nagpur Atelier
                  </p>
                  <p>{STORE_ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#E6DCB8]/60">
                <a
                  href={GOOGLE_MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#855D25] hover:bg-[#704C1C] text-white text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Get Directions</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F5EFE6] text-[#581522] border border-[#E6DCB8] text-[11px] uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#855D25]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Store Hours */}
            <div className="flex items-center gap-3 p-4 bg-white border border-[#E6DCB8] rounded-xs text-xs font-sans text-[#4A423B]">
              <Clock className="w-4 h-4 text-[#855D25] flex-shrink-0" />
              <div>
                <span className="font-semibold text-[#171717] block">Store Timings</span>
                <span>Monday – Sunday: 11:00 AM – 8:30 PM IST</span>
              </div>
            </div>

            {/* Direct Contact Points */}
            <div className="space-y-3 pt-1 font-sans">
              {/* Phone */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-[#E6DCB8] rounded-xs">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#855D25]" />
                  <span className="text-xs text-[#6B5E55]">Phone</span>
                </div>
                <a
                  href="tel:+918766667101"
                  className="text-xs font-semibold text-[#581522] hover:text-[#855D25] transition-colors"
                >
                  +91 8766667101
                </a>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-[#25D366]/40 rounded-xs">
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#128C7E]" />
                  <span className="text-xs text-[#6B5E55]">WhatsApp</span>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#128C7E] hover:text-[#075E54] transition-colors"
                >
                  Chat with Concierge &rarr;
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-[#E6DCB8] rounded-xs">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#855D25]" />
                  <span className="text-xs text-[#6B5E55]">Email</span>
                </div>
                <a
                  href="mailto:support@rajwadirajputiposhak.com"
                  className="text-xs font-semibold text-[#581522] hover:text-[#855D25] transition-colors truncate max-w-[200px]"
                >
                  support@rajwadirajputiposhak.com
                </a>
              </div>
            </div>

            {/* Designer Consultation Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="w-full py-2.5 px-4 bg-[#FAF6F0] hover:bg-[#F2ECE1] border border-[#C6A15B] text-[#581522] text-xs uppercase tracking-wider font-semibold font-sans rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#855D25]" />
                <span>Book Designer Consultation</span>
              </button>
            </div>
          </div>

          {/* ───── RIGHT: CLEAN BESPOKE ENQUIRY FORM (7 cols) ───── */}
          <div className="lg:col-span-7 bg-white border border-[#E6DCB8] p-6 sm:p-8 lg:p-10 shadow-xs text-left">
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans block mb-1">
                ONLINE ENQUIRY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal">
                Send an Atelier Enquiry
              </h2>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-3.5"
              >
                <div className="w-12 h-12 rounded-full bg-[#581522]/10 text-[#581522] flex items-center justify-center mx-auto mb-2 border border-[#581522]/20">
                  <CheckCircle2 className="w-7 h-7 stroke-[1.8]" />
                </div>
                <h3 className="font-serif text-2xl text-[#171717] font-normal">
                  Enquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-[#5A4F46] font-light max-w-md mx-auto leading-relaxed font-sans">
                  Thank you, <strong>{formData.name}</strong>. Our bridal stylist will reach out on <strong>{formData.mobile}</strong> and your email regarding <em>{formData.occasion}</em>.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs uppercase tracking-wider text-[#581522] hover:text-[#855D25] font-medium underline font-sans cursor-pointer"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                {apiError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-xs">
                    {apiError}
                  </div>
                )}

                {/* Occasion / Requirement Selection */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-2 font-medium font-sans">
                    Category / Occasion <span className="text-[#855D25]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {OCCASIONS.map((occ) => {
                      const isSelected = formData.occasion === occ;
                      return (
                        <button
                          key={occ}
                          type="button"
                          onClick={() => setFormData({ ...formData, occasion: occ })}
                          className={`px-3 py-2 text-left text-xs font-sans rounded-xs border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#581522] text-[#FAF5EE] border-[#581522] font-medium"
                              : "bg-white text-[#4A423B] border-[#E6DCB8] hover:border-[#855D25]"
                          }`}
                        >
                          <span className="truncate block">{occ}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                    >
                      Full Name <span className="text-[#855D25]">*</span>
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
                      className={`w-full px-3.5 py-2.5 bg-white border ${
                        errors.name ? "border-red-500" : "border-[#E6DCB8]"
                      } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-xs transition-colors font-sans`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-600 mt-1 font-sans">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-mobile"
                      className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                    >
                      Phone Number <span className="text-[#855D25]">*</span>
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
                      className={`w-full px-3.5 py-2.5 bg-white border ${
                        errors.mobile ? "border-red-500" : "border-[#E6DCB8]"
                      } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-xs transition-colors font-sans`}
                    />
                    {errors.mobile && (
                      <p className="text-[11px] text-red-600 mt-1 font-sans">{errors.mobile}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="enquiry-email"
                    className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                  >
                    Email Address <span className="text-[#855D25]">*</span>
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
                    className={`w-full px-3.5 py-2.5 bg-white border ${
                      errors.email ? "border-red-500" : "border-[#E6DCB8]"
                    } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-xs transition-colors font-sans`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 mt-1 font-sans">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="enquiry-message"
                    className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                  >
                    Enquiry Details <span className="text-[#855D25]">*</span>
                  </label>
                  <textarea
                    id="enquiry-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="Please mention poshak colour preferences, wedding date, or any specific questions..."
                    className={`w-full px-3.5 py-2.5 bg-white border ${
                      errors.message ? "border-red-500" : "border-[#E6DCB8]"
                    } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-xs transition-colors font-sans resize-none`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-600 mt-1 font-sans">{errors.message}</p>
                  )}
                </div>

                {/* Single Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3.5 bg-[#581522] hover:bg-[#431520] active:scale-[0.99] text-[#FAF5EE] text-xs uppercase tracking-[0.2em] font-semibold font-sans rounded-xs transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "TRANSMITTING..." : "SUBMIT ENQUIRY"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. NAGPUR ATELIER GOOGLE MAP (CLEAN, NO DUPLICATE ADDRESS CARDS)      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 bg-[#FAF6F0] border-t border-[#E6DCB8]/70">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block">
                LOCATION MAP
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal">
                Find Our Atelier
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center p-0.5 bg-white border border-[#E6DCB8] rounded-xs text-[11px] font-sans">
                <button
                  type="button"
                  onClick={() => setMapMode("roadmap")}
                  className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                    mapMode === "roadmap"
                      ? "bg-[#855D25] text-white font-semibold"
                      : "text-[#6B5E55] hover:text-[#171717]"
                  }`}
                >
                  Map
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode("satellite")}
                  className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                    mapMode === "satellite"
                      ? "bg-[#855D25] text-white font-semibold"
                      : "text-[#6B635B] hover:text-[#171717]"
                  }`}
                >
                  Satellite
                </button>
              </div>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#FAF6F0] text-[#581522] border border-[#E6DCB8] text-[11px] font-sans font-medium rounded-xs transition-colors cursor-pointer"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#EAE0D2] border border-[#E6DCB8] rounded-xs overflow-hidden shadow-xs">
            <iframe
              key={mapMode}
              title="Rajwadi Rajputi Poshak Nagpur Location Map"
              src={googleMapsEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. CONCIERGE FAQ ACCORDION                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-5 sm:px-8 w-full">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block mb-1">
            FREQUENT QUESTIONS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal">
            Atelier &amp; Ordering Guide
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E6DCB8] rounded-xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF6F0]/40 transition-colors"
                >
                  <span className="font-serif text-sm sm:text-base text-[#171717] font-medium leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#855D25] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#5A4F46] font-sans leading-relaxed border-t border-[#E6DCB8]/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
