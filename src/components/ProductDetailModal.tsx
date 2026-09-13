"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { PoshakProduct } from "@/data/products";

interface ProductDetailModalProps {
  product: PoshakProduct | null;
  onClose: () => void;
  onInquire: (product: PoshakProduct) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onInquire,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!product) return null;

  const currentImage = selectedImage || product.image;
  const allImages = [product.image, ...(product.additionalImages || [])];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="bg-royal-ivory border border-antique-gold/50 p-6 md:p-10 w-full max-w-4xl shadow-2xl relative my-8"
        >
          {/* Close Trigger */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-charcoal/60 hover:text-heritage-maroon transition-colors z-10"
          >
            <X className="w-6 h-6 stroke-[1.25]" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left: Product Imagery & Gallery */}
            <div>
              <div className="relative w-full aspect-[3/4] bg-soft-beige overflow-hidden border border-soft-beige">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-20 flex-shrink-0 border transition-all ${
                        currentImage === img
                          ? "border-heritage-maroon ring-1 ring-heritage-maroon"
                          : "border-soft-beige hover:border-antique-gold"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`View ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Authentic Specifications */}
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-antique-gold block mb-1 font-medium">
                  {product.category}
                </span>

                <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-heritage-maroon font-light mb-3 leading-tight">
                  {product.name}
                </h3>

                <p className="text-xs md:text-sm text-charcoal/80 font-light mb-6 leading-relaxed font-sans">
                  {product.description}
                </p>

                {/* Fabric & Craft Meta */}
                <div className="space-y-3 py-4 border-y border-soft-beige mb-6 text-xs text-charcoal font-sans">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60 uppercase tracking-wider">
                      Fabric Composition
                    </span>
                    <span className="font-medium text-charcoal">
                      {product.fabric}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60 uppercase tracking-wider">
                      Embroidery & Work
                    </span>
                    <span className="font-medium text-charcoal">
                      {product.craft}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60 uppercase tracking-wider">
                      Traditional Colorway
                    </span>
                    <span className="font-medium text-charcoal">
                      {product.color}
                    </span>
                  </div>
                </div>

                {/* What Ensemble Includes */}
                <div className="mb-6">
                  <h4 className="font-serif text-base text-heritage-maroon mb-2">
                    Ensemble Includes
                  </h4>
                  <ul className="space-y-1.5 text-xs text-charcoal/75 font-sans">
                    {product.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-antique-gold flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Inquiry & Consultation CTA */}
              <div className="pt-4 border-t border-soft-beige">
                <button
                  onClick={() => {
                    onClose();
                    onInquire(product);
                  }}
                  className="w-full py-3.5 bg-heritage-maroon hover:bg-heritage-maroon-dark text-royal-ivory text-xs uppercase tracking-[0.25em] font-medium transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Inquire & Customize This Poshak</span>
                  <span>→</span>
                </button>
                <p className="text-[10px] text-charcoal/50 text-center mt-2 font-sans tracking-wider">
                  Custom measurements and personalised fitting support available
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
