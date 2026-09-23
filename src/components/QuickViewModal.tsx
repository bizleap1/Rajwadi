"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { PoshakProduct, getPoshakDisplayName, getCategoryEyebrow } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface QuickViewModalProps {
  product: PoshakProduct | null;
  onClose: () => void;
  onViewFullDetails: (product: PoshakProduct) => void;
}

const AVAILABLE_SIZES = ["34", "36", "38", "40", "Custom"];

export default function QuickViewModal({
  product,
  onClose,
  onViewFullDetails,
}: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("36");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isUnstitched =
    (product.type || "").toLowerCase() === "unstitched" ||
    (product.category || "").toLowerCase() === "unstitched";
  const isJewellery =
    (product.type || "").toLowerCase() === "jewellery" ||
    (product.category || "").toLowerCase() === "jewellery";

  const currentImage = selectedImage || product.image;
  const allImages = [product.image, ...(product.additionalImages || [])];
  // Deduplicate images
  const uniqueImages = Array.from(new Set(allImages));

  const handleAddToBag = () => {
    addToCart(product, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0F0F]/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="bg-[#FAF5EE] border border-[#C6A15B]/50 w-full max-w-3xl shadow-2xl relative my-6 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Trigger */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#171717]/60 hover:text-[#5A1F2B] transition-colors z-20 p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[1.4]" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Product Imagery with Head-to-Hem View */}
            <div className="bg-[#EAE0D2] p-4 sm:p-6 flex flex-col justify-between">
              <div className="relative w-full aspect-[2/3] max-h-[460px] overflow-hidden bg-[#EAE0D2] shadow-sm">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {uniqueImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto justify-center">
                  {uniqueImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-12 h-16 flex-shrink-0 border transition-all ${
                        currentImage === img
                          ? "border-[#5A1F2B] ring-1 ring-[#5A1F2B]"
                          : "border-[#D8CCB8] opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="48px"
                        className="object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Add to Bag */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold font-sans block mb-1">
                  {getCategoryEyebrow(product)}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal leading-tight mb-2">
                  {getPoshakDisplayName(product)}
                </h3>

                <div className="flex items-baseline gap-2.5 mb-4">
                  {product.originalPrice && (
                    <span className="font-sans text-sm text-[#8C827A] line-through font-normal">
                      {product.originalPrice}
                    </span>
                  )}
                  <span className="font-serif text-2xl text-[#5A1F2B] font-medium tracking-wide">
                    {product.price}
                  </span>
                </div>

                <p className="text-xs text-[#171717]/75 font-sans font-light leading-relaxed mb-6 border-b border-[#E6DCB8]/80 pb-4">
                  {product.description}
                </p>

                {/* Size Selector (Only if not unstitched and not jewellery) */}
                {!isUnstitched && !isJewellery && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase tracking-wider text-[#171717] font-medium font-sans">
                        Size (Bust / Fit)
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
                            className={`min-w-[44px] px-3.5 py-2 text-xs font-sans font-medium uppercase tracking-wider border transition-all duration-200 ${
                              isSelected
                                ? "bg-[#5A1F2B] text-[#FAF5EE] border-[#5A1F2B] shadow-sm"
                                : "bg-white/60 text-[#171717]/80 border-[#D8CCB8] hover:border-[#855D25]"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[#E6DCB8]/80">
                {/* Note for unstitched products */}
                {isUnstitched && product.stitchingAvailable !== false && (
                  <div className="flex items-center gap-1.5 text-xs text-[#855D25] font-sans tracking-wide pb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] flex-shrink-0" />
                    <span>Stitching service available on request.</span>
                  </div>
                )}

                {/* [ ADD TO BAG ] Button */}
                <button
                  onClick={handleAddToBag}
                  className={`w-full py-3.5 text-xs uppercase tracking-[0.22em] font-medium border border-[#C6A15B] shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
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

                {/* View Full Details → Link */}
                <div className="text-center pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onViewFullDetails(product);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#5A1F2B] hover:text-[#855D25] transition-colors font-medium font-sans border-b border-[#5A1F2B]/30 hover:border-[#855D25] pb-0.5"
                  >
                    <span>View Full Specifications & Fabric Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
