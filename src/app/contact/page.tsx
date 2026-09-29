"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Clock,
  Phone,
  PhoneCall,
  MessageCircle,
  Mail,
  Crown,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ShieldCheck,
  Calendar,
  Send,
  ArrowRight,
  HeartHandshake,
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
  "General Concierge Inquiry",
];

const FAQS = [
  {
    q: "How can I book a personal bridal styling consultation?",
    a: "You can book directly by filling the enquiry form above, messaging our VIP WhatsApp concierge at +91 8766667101, or calling our Nagpur atelier. We offer both private in-person appointments and live high-definition video walkthroughs.",
  },
  {
    q: "Where is the Rajwadi flagship store located?",
    a: "Our flagship atelier is located at EWS 41, near Maheshwari Bhawan, Hiwari Layout, Uday Nagar, Padole Nagar, Nagpur, Maharashtra 440008. We are open daily from 11:00 AM to 8:30 PM with dedicated customer valet parking.",
  },
  {
    q: "Do you offer bespoke custom tailoring and sizing?",
    a: "Yes. Every Rajputi poshak can be ordered as unstitched fabric, semi-stitched, or fully bespoke tailored by our master karigars with authentic magji, kurti-kanchali lining, and custom kalis tailored to your precise measurements.",
  },
  {
    q: "What are your delivery timelines across India and worldwide?",
    a: "Ready-to-ship poshaks are dispatched from our Nagpur atelier within 24-48 hours via insured express air courier (delivery in 3-5 business days across India). Bespoke bridal orders with intricate hand zardozi typically take 12-18 days.",
  },
  {
    q: "How can I inspect fabric swatches and hand needlework before buying?",
    a: "Our master stylist will share high-resolution close-up videos and photos of the zari, gota patti, and pure silk fabrics over WhatsApp (+91 8766667101) so you can inspect every intricate detail prior to dispatch.",
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

  const WHATSAPP_BASE = "https://wa.me/918766667101";

  const getDynamicWhatsAppUrl = () => {
    const text = `👑 *Rajwadi Royal Poshak Enquiry*\n\n` +
      `*Name:* ${formData.name.trim() || "Patron"}\n` +
      `*Occasion:* ${formData.occasion}\n` +
      (formData.email.trim() ? `*Email:* ${formData.email.trim()}\n` : "") +
      (formData.mobile.trim() ? `*Phone:* ${formData.mobile.trim()}\n` : "") +
      (formData.message.trim() ? `*Enquiry:* ${formData.message.trim()}\n\n` : "\n") +
      `Hello Rajwadi Concierge, I would like to inquire about this poshak collection and bespoke tailoring.`;
    return `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
  };

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
      setApiError(err.message || "Something went wrong. You can also reach us directly via WhatsApp.");
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
      {/* 1. ROYAL ATELIER HERO SECTION                                         */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 bg-gradient-to-b from-[#FAF4EA] via-[#FDFBF7] to-[#FDFBF7] border-b border-[#E6DCB8]/60 overflow-hidden">
        {/* Subtle Decorative Background Filigree */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center">
          {/* Eyebrow Royal Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#581522]/5 border border-[#855D25]/30 mb-4 sm:mb-5"
          >
            <Crown className="w-3.5 h-3.5 text-[#855D25]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans">
              ROYAL RAJPUTI ATELIER CONCIERGE
            </span>
          </motion.div>

          {/* Majestic Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#171717] font-normal tracking-tight leading-[1.12] mb-3.5"
          >
            Experience Royal Hospitality.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif italic text-base sm:text-lg md:text-xl text-[#6B5E55] font-light max-w-2xl mx-auto leading-relaxed mb-6"
          >
            Whether seeking bespoke bridal poshak tailoring, pure zardozi craftsmanship, or an in-person viewing at our Nagpur atelier, our royal concierge is at your service.
          </motion.p>

          {/* Key Trust Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap text-xs text-[#5A4F46] font-sans"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#855D25]" />
              <span>Nagpur Atelier &amp; Tailoring</span>
            </div>
            <span className="hidden sm:inline text-[#C6A15B]/50">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
              <span>100% Handcrafted Authenticity</span>
            </div>
            <span className="hidden sm:inline text-[#C6A15B]/50">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#855D25]" />
              <span>Open Daily 11:00 AM – 8:30 PM</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. FOUR LUXURY CONCIERGE CHANNELS                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Direct Phone Call */}
          <div className="bg-[#FAF6F0] border border-[#E6DCB8] p-5 sm:p-6 rounded-xs relative group hover:border-[#855D25] hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#581522]/10 border border-[#581522]/20 flex items-center justify-center text-[#581522] mb-3 group-hover:bg-[#581522] group-hover:text-[#FAF5EE] transition-colors">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block mb-1">
                INSTANT CALL
              </span>
              <h3 className="font-serif text-lg text-[#171717] font-medium mb-1">
                Atelier Concierge
              </h3>
              <p className="text-xs text-[#6B5E55] font-sans leading-relaxed mb-4">
                Speak directly with our concierge team for immediate order or poshak assistance.
              </p>
            </div>
            <a
              href="tel:+918766667101"
              className="inline-flex items-center justify-between w-full pt-3 border-t border-[#E6DCB8] text-xs font-semibold text-[#581522] hover:text-[#855D25] font-sans transition-colors"
            >
              <span>+91 8766667101</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Card 2: VIP WhatsApp */}
          <div className="bg-[#FAF6F0] border border-[#25D366]/40 p-5 sm:p-6 rounded-xs relative group hover:border-[#25D366] hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#128C7E] mb-3 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#128C7E] font-semibold font-sans block mb-1">
                WHATSAPP CHAT
              </span>
              <h3 className="font-serif text-lg text-[#171717] font-medium mb-1">
                Stylist on WhatsApp
              </h3>
              <p className="text-xs text-[#6B5E55] font-sans leading-relaxed mb-4">
                Request fabric videos, custom bridal colourways, and real-time design advice.
              </p>
            </div>
            <a
              href={WHATSAPP_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full pt-3 border-t border-[#E6DCB8] text-xs font-semibold text-[#128C7E] hover:text-[#075E54] font-sans transition-colors"
            >
              <span>Chat Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Card 3: Email Concierge */}
          <div className="bg-[#FAF6F0] border border-[#E6DCB8] p-5 sm:p-6 rounded-xs relative group hover:border-[#855D25] hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#855D25]/10 border border-[#855D25]/20 flex items-center justify-center text-[#855D25] mb-3 group-hover:bg-[#855D25] group-hover:text-[#FAF5EE] transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block mb-1">
                OFFICIAL INBOX
              </span>
              <h3 className="font-serif text-lg text-[#171717] font-medium mb-1">
                Bespoke Inquiries
              </h3>
              <p className="text-xs text-[#6B5E55] font-sans leading-relaxed mb-4">
                Send design sketches, international trousseau orders, or press inquiries.
              </p>
            </div>
            <a
              href="mailto:support@rajwadirajputiposhak.com"
              className="inline-flex items-center justify-between w-full pt-3 border-t border-[#E6DCB8] text-xs font-semibold text-[#581522] hover:text-[#855D25] font-sans transition-colors truncate"
            >
              <span className="truncate">support@rajwadirajputiposhak.com</span>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Card 4: Nagpur Atelier Visit */}
          <div className="bg-[#FAF6F0] border border-[#E6DCB8] p-5 sm:p-6 rounded-xs relative group hover:border-[#855D25] hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#581522]/10 border border-[#581522]/20 flex items-center justify-center text-[#581522] mb-3 group-hover:bg-[#581522] group-hover:text-[#FAF5EE] transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block mb-1">
                FLAGSHIP STORE
              </span>
              <h3 className="font-serif text-lg text-[#171717] font-medium mb-1">
                Visit in Nagpur
              </h3>
              <p className="text-xs text-[#6B5E55] font-sans leading-relaxed mb-4">
                Hiwari Layout, Uday Nagar, Nagpur (Open Daily 11:00 AM – 8:30 PM).
              </p>
            </div>
            <a
              href={GOOGLE_MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full pt-3 border-t border-[#E6DCB8] text-xs font-semibold text-[#581522] hover:text-[#855D25] font-sans transition-colors"
            >
              <span>Get Directions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. MAIN FORM & ATELIER EXPERIENCE (2-COL)                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 bg-[#FAF6F0] border-y border-[#E6DCB8]/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* ───── LEFT: ROYAL EDITORIAL & BESPOKE PROMISE (5 Cols) ───── */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-[1px] w-6 bg-[#855D25]" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#855D25] font-semibold font-sans">
                    ROYAL ATELIER CONCIERGE
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal leading-tight mb-3">
                  Tailored to Perfection.
                </h2>
                <p className="text-sm text-[#5A4F46] font-light leading-relaxed font-serif italic">
                  &ldquo;A Rajputi Poshak is an heirloom of dignity and grace. Every cut, kali, and kasab stitch is consecrated to ensure an imperial aura for your ceremonial milestone.&rdquo;
                </p>
              </div>

              {/* Atelier Pillars Card */}
              <div className="bg-white border border-[#E6DCB8] p-5 rounded-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5EE] border border-[#E6DCB8] flex items-center justify-center text-[#855D25] flex-shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-[#171717] font-medium">
                      One-on-One Stylist Assistance
                    </h4>
                    <p className="text-xs text-[#6B5E55] font-sans leading-relaxed">
                      Assistance with authentic colour combinations (Kesariya, Kasumal, Morpankhi) and jewellery matching.
                    </p>
                  </div>
                </div>

                <div className="h-[1px] bg-[#E6DCB8]/60 w-full" />

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5EE] border border-[#E6DCB8] flex items-center justify-center text-[#855D25] flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-[#171717] font-medium">
                      Prompt 2-Hour Response Window
                    </h4>
                    <p className="text-xs text-[#6B5E55] font-sans leading-relaxed">
                      Every enquiry is attended to by our senior styling concierge within 2 business hours.
                    </p>
                  </div>
                </div>

                <div className="h-[1px] bg-[#E6DCB8]/60 w-full" />

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5EE] border border-[#E6DCB8] flex items-center justify-center text-[#855D25] flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-[#171717] font-medium">
                      Private Video Consultation
                    </h4>
                    <p className="text-xs text-[#6B5E55] font-sans leading-relaxed">
                      Schedule a live video viewing to examine fabric texture, zari sparkle, and drape before finalizing your order.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout Banner */}
              <div className="p-4 bg-gradient-to-r from-[#581522] to-[#431520] text-[#FAF5EE] rounded-xs flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium block">
                    NEED AN URGENT ORDER?
                  </span>
                  <p className="font-serif text-sm font-light text-[#FAF5EE]">
                    Connect on VIP WhatsApp directly.
                  </p>
                </div>
                <a
                  href={WHATSAPP_BASE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#C6A15B] text-[#171717] text-[11px] uppercase tracking-wider font-semibold font-sans rounded-xs flex items-center gap-1.5 flex-shrink-0 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* ───── RIGHT: INTERACTIVE BESPOKE ENQUIRY FORM (7 Cols) ───── */}
            <div className="lg:col-span-7 bg-white border border-[#E6DCB8] p-6 sm:p-8 lg:p-10 shadow-xs text-left relative">
              <div className="mb-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#855D25] font-semibold font-sans">
                    ONLINE ENQUIRY DESK
                  </span>
                  <span className="text-[10px] text-[#6B5E55] font-sans">
                    All inquiries kept strictly confidential
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal mt-1">
                  How may our atelier assist you?
                </h3>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#581522]/10 text-[#581522] flex items-center justify-center mx-auto mb-2 border border-[#581522]/20">
                    <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <h4 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal">
                    Enquiry Registered with Atelier
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5A4F46] font-light max-w-md mx-auto leading-relaxed font-sans">
                    Thank you, <strong>{formData.name}</strong>. Your enquiry regarding <em>{formData.occasion}</em> has been forwarded to our master bridal stylist. We will connect with you on <strong>{formData.mobile}</strong> and your email shortly.
                  </p>

                  <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
                    <a
                      href={getDynamicWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs uppercase tracking-wider font-semibold font-sans rounded-xs shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Continue to WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#E6DCB8] hover:bg-[#FAF6F0] text-xs uppercase tracking-wider font-medium text-[#581522] font-sans rounded-xs transition-colors cursor-pointer"
                    >
                      <span>New Enquiry</span>
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

                  {/* Occasion / Requirement Selection Pills */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-2 font-medium font-sans">
                      Select Occasion / Styling Category <span className="text-[#855D25]">*</span>
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
                                ? "bg-[#581522] text-[#FAF5EE] border-[#581522] font-medium shadow-xs"
                                : "bg-white text-[#4A423B] border-[#E6DCB8] hover:border-[#855D25]"
                            }`}
                          >
                            <span className="truncate block">{occ}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Mobile Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
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
                        placeholder="e.g. Maharani Devika"
                        className={`w-full px-3.5 py-2.5 bg-white border ${
                          errors.name ? "border-red-500" : "border-[#E6DCB8]"
                        } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-xs transition-colors font-sans`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-600 mt-1 font-sans">{errors.name}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label
                        htmlFor="enquiry-mobile"
                        className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                      >
                        WhatsApp / Phone <span className="text-[#855D25]">*</span>
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
                      placeholder="devika@example.com"
                      className={`w-full px-3.5 py-2.5 bg-white border ${
                        errors.email ? "border-red-500" : "border-[#E6DCB8]"
                      } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-xs transition-colors font-sans`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 mt-1 font-sans">{errors.email}</p>
                    )}
                  </div>

                  {/* Detailed Message */}
                  <div>
                    <label
                      htmlFor="enquiry-message"
                      className="block text-[11px] uppercase tracking-wider text-[#171717]/80 mb-1.5 font-medium font-sans"
                    >
                      Enquiry &amp; Styling Details <span className="text-[#855D25]">*</span>
                    </label>
                    <textarea
                      id="enquiry-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Please mention poshak colour preferences, wedding/occasion dates, sizing requirements, or questions for our master stylist..."
                      className={`w-full px-3.5 py-2.5 bg-white border ${
                        errors.message ? "border-red-500" : "border-[#E6DCB8]"
                      } text-xs sm:text-sm text-[#171717] placeholder-[#171717]/35 focus:outline-none focus:border-[#855D25] rounded-xs transition-colors font-sans resize-none`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-red-600 mt-1 font-sans">{errors.message}</p>
                    )}
                  </div>

                  {/* Action CTAs: Dual Choice */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 px-6 py-3 bg-[#581522] hover:bg-[#431520] active:scale-[0.99] text-[#FAF5EE] text-xs uppercase tracking-[0.2em] font-semibold font-sans rounded-xs transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "TRANSMITTING..." : "SUBMIT ENQUIRY"}</span>
                    </button>

                    <a
                      href={getDynamicWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 active:scale-[0.99] text-xs uppercase tracking-[0.16em] font-semibold font-sans rounded-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>DIRECT WHATSAPP</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. NAGPUR FLAGSHIP ATELIER & INTERACTIVE MAP                          */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Store Visit Editorial Details (5 cols) */}
            <div className="lg:col-span-5 text-left space-y-4">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="h-[1px] w-5 bg-[#855D25]" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#855D25] font-semibold font-sans">
                  NAGPUR FLAGSHIP STORE
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal tracking-wide leading-tight">
                Visit Our Atelier in Nagpur
              </h2>

              <p className="text-xs sm:text-sm text-[#5A4F46] font-light leading-relaxed font-sans">
                Experience the royal craftsmanship firsthand. Walk through our showroom displaying authentic Rajputi bridal poshaks, gota patti borders, pure fabrics, and heritage jewellery.
              </p>

              {/* Complete Address Details */}
              <div className="p-4 bg-[#FAF6F0] border border-[#E6DCB8] rounded-xs space-y-2 text-xs text-[#5A4F46] font-sans">
                <div className="flex items-start gap-2 text-[#171717] font-medium font-serif text-sm">
                  <MapPin className="w-4 h-4 text-[#855D25] flex-shrink-0 mt-0.5" />
                  <span>Rajwadi Rajputi Poshak</span>
                </div>
                <p className="pl-6 text-[12px] text-[#4A423B] leading-relaxed">
                  {STORE_ADDRESS}
                </p>
                <div className="pl-6 pt-1 flex items-center gap-2 text-[#855D25] font-medium">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Monday – Sunday: 11:00 AM – 8:30 PM IST</span>
                </div>
              </div>

              {/* Action Buttons: Copy Address & Get Directions */}
              <div className="pt-2 flex items-center gap-2.5 flex-wrap">
                <a
                  href={GOOGLE_MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#855D25] hover:bg-[#704C1C] text-[#FAF5EE] text-xs uppercase tracking-[0.16em] font-semibold font-sans rounded-xs transition-all duration-300 shadow-xs cursor-pointer active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>GET DIRECTIONS</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E6DCB8] hover:bg-[#FAF6F0] text-[#581522] text-xs uppercase tracking-[0.14em] font-medium font-sans rounded-xs transition-all duration-300 cursor-pointer active:scale-95"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#855D25]" />
                      <span>COPY ADDRESS</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Modern High-Definition Google Maps Experience (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative w-full rounded-xs overflow-hidden bg-[#FAF5EE] border border-[#C6A15B]/50 shadow-md">
                
                {/* 1. Header Bar with View Toggle */}
                <div className="px-3.5 sm:px-4 py-2.5 bg-[#FAF6F0] border-b border-[#E6DCB8] flex items-center justify-between gap-2.5 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-[#855D25]/15 border border-[#855D25]/30 flex items-center justify-center text-[#855D25] flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="font-serif text-[13px] sm:text-[14px] text-[#171717] font-medium block leading-tight truncate">
                        Rajwadi Rajputi Poshak Atelier
                      </span>
                      <span className="text-[9.5px] sm:text-[10px] text-[#855D25] font-sans font-medium uppercase tracking-wider block">
                        Nagpur, Maharashtra · Google Maps Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Map / Satellite Mode Toggle */}
                    <div className="inline-flex items-center p-0.5 bg-white border border-[#E6DCB8] rounded-xs text-[10px] font-sans font-medium">
                      <button
                        type="button"
                        onClick={() => setMapMode("roadmap")}
                        className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                          mapMode === "roadmap"
                            ? "bg-[#855D25] text-white font-semibold"
                            : "text-[#6B635B] hover:text-[#171717]"
                        }`}
                      >
                        Map
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapMode("satellite")}
                        className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                          mapMode === "satellite"
                            ? "bg-[#855D25] text-white font-semibold"
                            : "text-[#6B635B] hover:text-[#171717]"
                        }`}
                      >
                        Satellite
                      </button>
                    </div>

                    {/* Open Live Badge */}
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-[10px] font-sans font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Open Today</span>
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Map Container */}
                <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] bg-[#EAE0D2]">
                  <iframe
                    key={mapMode}
                    title="Rajwadi Rajputi Poshak Nagpur Google Maps Location"
                    src={googleMapsEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* 3. Floating Bottom Navigation Banner */}
                  <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3 pointer-events-none z-10">
                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#C6A15B]/40 px-3.5 py-2.5 rounded-xs shadow-md flex items-center justify-between gap-3 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] sm:text-xs text-[#171717] font-medium font-sans truncate">
                          EWS 41, near Maheshwari Bhawan, Hiwari Layout, Nagpur
                        </p>
                        <p className="text-[9.5px] sm:text-[10px] text-[#6B635B] font-sans">
                          Free customer parking · Near Great Nag Road
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a
                          href={GOOGLE_MAPS_DIRECTIONS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#855D25] hover:bg-[#704C1C] text-white text-[10.5px] uppercase tracking-wider font-semibold font-sans rounded-xs shadow-xs transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Directions</span>
                        </a>

                        <a
                          href={GOOGLE_MAPS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-[#FAF6F0] text-[#581522] border border-[#E6DCB8] text-[10.5px] font-sans font-medium rounded-xs transition-colors cursor-pointer"
                          title="Open Full Google Maps"
                        >
                          <span>Full Map</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 5. CONCIERGE FAQ ACCORDION                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#FAF6F0] border-t border-[#E6DCB8]/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#855D25] font-semibold font-sans block mb-1.5">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#171717] font-normal">
              Atelier &amp; Ordering Guide
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E6DCB8] rounded-xs overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF6F0]/50 transition-colors"
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
                        transition={{ duration: 0.25 }}
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

          {/* Still Have Questions Box */}
          <div className="mt-8 text-center p-6 bg-[#FDFBF7] border border-[#E6DCB8] rounded-xs">
            <p className="font-serif text-lg text-[#171717] mb-1">
              Have a specific bridal or heirloom requirement?
            </p>
            <p className="text-xs text-[#6B5E55] font-sans mb-3.5">
              Our master stylist Shalu Vyas is available for personal appointments and consultation.
            </p>
            <button
              type="button"
              onClick={() => setIsConsultationOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#581522] hover:bg-[#431520] text-[#FAF5EE] text-xs uppercase tracking-wider font-semibold font-sans rounded-xs transition-colors shadow-xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Talk to Designer</span>
            </button>
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
