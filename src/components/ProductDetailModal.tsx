"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShoppingBag, MessageCircle, Sparkles, ShieldCheck } from "lucide-react";
import { PoshakProduct } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductDetailModalProps {
  product: PoshakProduct | null;
  onClose: () => void;
  onInquire: (product: PoshakProduct) => void;
}

const AVAILABLE_SIZES = ["34", "36", "38", "40", "Custom"];

export default function ProductDetailModal({
  product,
  onClose,
  onInquire,
}: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("36");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const currentImage = selectedImage || product.image;
  const allImages = [product.image, ...(product.additionalImages || [])];
  const uniqueImages = Array.from(new Set(allImages));

  const handleAddToBag = () => {
    addToCart(product, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#0E0E0E]/75 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-[#FAF5EE] border border-[#C6A15B]/50 w-full max-w-4xl shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Trigger */}
          <button
            onClick={onClose}
            aria-label="Close Product Detail Page"
            className="absolute top-4 right-4 text-[#171717]/60 hover:text-[#5A1F2B] transition-colors z-20 p-1.5 rounded-full bg-[#FAF5EE]/80 border border-[#D8CCB8]/60 cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Left: Product Imagery & Head-to-Hem View (5 Cols) */}
            <div className="md:col-span-5 bg-[#EAE0D2] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E6DCB8]">
              <div className="relative w-full aspect-[2/3] max-h-[500px] overflow-hidden bg-[#EAE0D2] shadow-sm">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-top transition-all duration-300"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {uniqueImages.length > 1 && (
                <div className="flex gap-2.5 mt-4 overflow-x-auto justify-center pb-1">
                  {uniqueImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-14 h-18 sm:w-16 sm:h-20 flex-shrink-0 border transition-all cursor-pointer ${
                        currentImage === img
                          ? "border-[#5A1F2B] ring-2 ring-[#5A1F2B]/40"
                          : "border-[#D8CCB8] opacity-75 hover:opacity-100 hover:border-[#855D25]"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} angle ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details, Size Selection & Add to Bag (7 Cols) */}
            <div className="md:col-span-7 p-6 sm:p-8 md:p-9 flex flex-col justify-between">
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-[1px] w-4 bg-[#855D25]" />
                  <span className="text-[10px] uppercase tracking-[0.26em] text-[#855D25] font-semibold font-sans">
                    RAJPUTI POSHAK • {product.category.toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal leading-tight mb-2">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-sans text-xl sm:text-2xl text-[#171717] font-medium tracking-wide">
                    {product.price}
                  </span>
                  <span className="text-[11px] text-[#171717]/60 font-sans tracking-wide">
                    Inclusive of all taxes
                  </span>
                </div>

                {/* Short Editorial Description */}
                <p className="text-xs sm:text-[13px] text-[#171717]/75 font-sans font-light leading-relaxed mb-6 border-b border-[#E6DCB8] pb-4">
                  {product.description}
                </p>

                {/* Size Selector */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs uppercase tracking-wider text-[#171717] font-medium font-sans">
                      Select Size (Bust / Fit)
                    </span>
                    <span className="text-[11px] text-[#855D25] font-sans">
                      Standard Rajputi Measurements
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {AVAILABLE_SIZES.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[46px] px-3.5 py-2 text-xs font-sans font-medium uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-[#5A1F2B] text-[#FAF5EE] border-[#5A1F2B] shadow-sm"
                              : "bg-white/70 text-[#171717]/80 border-[#D8CCB8] hover:border-[#855D25] hover:bg-white"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSize === "Custom" && (
                    <div className="mt-2.5 p-2.5 bg-[#F4ECE1] border border-[#C6A15B]/40 text-[11px] text-[#5A1F2B] font-sans flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#855D25] flex-shrink-0 mt-0.5" />
                      <span>
                        Custom sizing includes complimentary virtual measurement consultation by our master atelier.
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions: ADD TO BAG & Inquire */}
                <div className="space-y-2.5 mb-7">
                  {/* [ ADD TO BAG ] Button */}
                  <button
                    onClick={handleAddToBag}
                    className={`w-full py-3.5 sm:py-4 text-xs uppercase tracking-[0.24em] font-medium border border-[#C6A15B] shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans ${
                      isAdded
                        ? "bg-[#2E5A36] text-white border-transparent"
                        : "bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF5EE]"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added To Royal Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 stroke-[1.4]" />
                        <span>Add To Bag</span>
                      </>
                    )}
                  </button>

                  {/* WhatsApp / Custom Consultation CTA */}
                  <button
                    onClick={() => {
                      onClose();
                      onInquire(product);
                    }}
                    className="w-full py-3 bg-transparent hover:bg-[#F4ECE1] text-[#5A1F2B] text-xs uppercase tracking-[0.2em] font-medium border border-[#5A1F2B]/40 hover:border-[#5A1F2B] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    <MessageCircle className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Inquire & Bespoke Tailoring Consultation</span>
                  </button>
                </div>

                {/* Authentic Rajputi Specifications */}
                <div className="space-y-2.5 py-4 border-y border-[#E6DCB8] text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#171717]/60 uppercase tracking-wider">
                      Fabric Composition
                    </span>
                    <span className="font-medium text-[#171717]">
                      {product.fabric}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#171717]/60 uppercase tracking-wider">
                      Embroidery & Work
                    </span>
                    <span className="font-medium text-[#171717]">
                      {product.craft}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#171717]/60 uppercase tracking-wider">
                      Traditional Colorway
                    </span>
                    <span className="font-medium text-[#171717]">
                      {product.color}
                    </span>
                  </div>
                </div>

                {/* Ensemble Includes */}
                <div className="pt-4">
                  <h4 className="font-serif text-sm text-[#5A1F2B] mb-2 font-medium">
                    Ensemble Includes
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#171717]/80 font-sans">
                    {product.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#855D25] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Royal Heritage Assurance */}
                <div className="mt-5 pt-3 border-t border-[#E6DCB8] flex items-center gap-2 text-[11px] text-[#171717]/65 font-sans">
                  <ShieldCheck className="w-4 h-4 text-[#855D25] flex-shrink-0" />
                  <span>
                    100% Authentic Rajputi Craftsmanship • Hand-embroidered in Rajasthan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
