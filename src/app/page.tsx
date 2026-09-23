"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Collections from "@/components/Collections";
import ThePoshakEdit from "@/components/ThePoshakEdit";

// Dynamically import below-the-fold components to reduce initial compile module count & speed up compilation
const CraftBehindThePoshak = dynamic(
  () => import("@/components/CraftBehindThePoshak")
);
const GoogleReviews = dynamic(() => import("@/components/GoogleReviews"));
const StitchedWithPrecision = dynamic(
  () => import("@/components/StitchedWithPrecision")
);
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/Footer"));

const TalkToDesignerModal = dynamic(
  () => import("@/components/TalkToDesignerModal"),
  { ssr: false }
);
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
});

export default function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const handleOpenConsultation = () => {
    setIsConsultationOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationOpen(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-royal-ivory">
      {/* Navigation */}
      <Navbar onOpenConsultation={handleOpenConsultation} />

      {/* 01 — HERO */}
      <Hero />

      {/* 02 — THE COLLECTION */}
      <Collections />

      {/* 03 — THE POSHAK EDIT */}
      <ThePoshakEdit />

      {/* 04 — THE CRAFT BEHIND THE POSHAK */}
      <CraftBehindThePoshak onOpenConsultation={handleOpenConsultation} />

      {/* 05 — GOOGLE REVIEWS */}
      <GoogleReviews />

      {/* 06 — STITCHED WITH PRECISION / THE ART OF STITCHING */}
      <StitchedWithPrecision onOpenConsultation={handleOpenConsultation} />

      {/* 07 — CONTACT / ENQUIRY */}
      <ContactSection onOpenConsultation={handleOpenConsultation} />

      {/* 08 — FOOTER */}
      <Footer onOpenConsultation={handleOpenConsultation} />

      {/* Interactive Modals */}
      <TalkToDesignerModal
        isOpen={isConsultationOpen}
        onClose={handleCloseConsultation}
      />

      {/* Luxury Shopping Bag Drawer */}
      <CartDrawer onOpenConsultation={handleOpenConsultation} />
    </main>
  );
}
