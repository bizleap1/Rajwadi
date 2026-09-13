"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Collections from "@/components/Collections";
import FeaturedPoshaks from "@/components/FeaturedPoshaks";
import BrandStory from "@/components/BrandStory";
import Craftsmanship from "@/components/Craftsmanship";
import Lookbook from "@/components/Lookbook";
import CustomPoshak from "@/components/CustomPoshak";
import Testimonials from "@/components/Testimonials";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import TalkToDesignerModal from "@/components/TalkToDesignerModal";
import ProductDetailModal from "@/components/ProductDetailModal";
import { PoshakProduct } from "@/data/products";

export default function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PoshakProduct | null>(
    null
  );

  const handleOpenConsultation = () => {
    setIsConsultationOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationOpen(false);
  };

  const handleSelectProduct = (product: PoshakProduct) => {
    setSelectedProduct(product);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  const handleInquireProduct = (product: PoshakProduct) => {
    setSelectedProduct(null);
    setIsConsultationOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-royal-ivory">
      {/* Simple Luxury Navigation */}
      <Navbar onOpenConsultation={handleOpenConsultation} />

      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: Royal Collections */}
      <Collections />

      {/* Section 3: Featured Poshaks */}
      <FeaturedPoshaks onSelectProduct={handleSelectProduct} />

      {/* Section 4: Brand Story */}
      <BrandStory />

      {/* Section 5: Craftsmanship Timeline */}
      <Craftsmanship />

      {/* Section 6: Lookbook */}
      <Lookbook />

      {/* Section 7: Custom Poshak Atelier */}
      <CustomPoshak onOpenConsultation={handleOpenConsultation} />

      {/* Section 8: Testimonials (Customer Stories & Wedding Moments) */}
      <Testimonials />

      {/* Section 9: Instagram Section */}
      <InstagramSection />

      {/* Section 10: Footer */}
      <Footer />

      {/* Interactive Modals */}
      <TalkToDesignerModal
        isOpen={isConsultationOpen}
        onClose={handleCloseConsultation}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseProductModal}
        onInquire={handleInquireProduct}
      />
    </main>
  );
}
