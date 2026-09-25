"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface ThePoshakEditProps {
  onSelectProduct?: (product: any) => void;
}

export default function ThePoshakEdit({ onSelectProduct }: ThePoshakEditProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  const fetchFeatured = useCallback(async () => {
    try {
      const res = await fetch("/api/products?featured=true&limit=4", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setFeaturedProducts(data.products.slice(0, 4));
        } else {
          // Fallback to latest 4 products if none explicitly marked featured
          const fallbackRes = await fetch("/api/products?limit=4", { cache: "no-store" });
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            setFeaturedProducts((fallbackData.products || []).slice(0, 4));
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch featured products:", e);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();

    // Re-fetch on window focus & poll every 30s
    const interval = setInterval(fetchFeatured, 30000);
    window.addEventListener("focus", fetchFeatured);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", fetchFeatured);
    };
  }, [fetchFeatured]);

  // Preload second images to guarantee zero flash or blank during desktop hover crossfade
  useEffect(() => {
    featuredProducts.forEach((product) => {
      if (product.additionalImages && product.additionalImages.length > 1) {
        const img = new window.Image();
        img.src = product.additionalImages[1];
      }
    });
  }, [featuredProducts]);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <>
      <section
        id="poshak-edit"
        className="scroll-mt-20 md:scroll-mt-24 pt-5 sm:pt-6 md:pt-8 pb-4 sm:pb-5 md:pb-6 bg-[#F8F1E7] transition-colors"
      >
        {/* Anchor alias so any legacy #featured links scroll smoothly here */}
        <span id="featured" className="sr-only" />

        <div className="max-w-7xl mx-auto px-[18px] sm:px-6 md:px-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-14">
            <div className="flex items-center justify-center gap-3 mb-2 sm:mb-2.5">
              <span className="h-[1px] w-6 bg-[#855D25]" />
              <span className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-medium font-sans">
                THE POSHAK EDIT
              </span>
              <span className="h-[1px] w-6 bg-[#855D25]" />
            </div>
            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-[#171717] font-light tracking-wide">
              Selected pieces from Rajwadi
            </h2>
          </div>

          {/* Product Cards */}
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {featuredProducts.map((product, index) => {
                const isWishlisted = isInWishlist(product.id || product.slug);
                const secondImage =
                  product.additionalImages && product.additionalImages.length > 1
                    ? product.additionalImages[1]
                    : null;

                return (
                  <motion.div
                    key={product.id || product.slug}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                  >
                    <Link
                      href={`/product/${product.slug || product.id}`}
                      className="group flex flex-col cursor-pointer select-none"
                    >
                      {/* Image Container */}
                      <div className="relative w-full aspect-[2/3] overflow-hidden bg-[#EAE0D2] shadow-sm">
                        <div className="absolute inset-0 transition-transform duration-500 ease-in-out sm:group-hover:scale-[1.02]">
                          {/* Default Front Image */}
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                            className={`object-cover transition-opacity duration-500 ease-in-out ${
                              secondImage ? "sm:group-hover:opacity-0" : ""
                            }`}
                            style={{
                              objectPosition: product.imagePosition || "center 5%",
                              transform: `scale(${product.imageScale || 1})`,
                            }}
                            priority={index < 4}
                          />

                          {/* Second/Back/Side Image on Desktop Hover */}
                          {secondImage && (
                            <Image
                              src={secondImage}
                              alt={`${product.name} alternate view`}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover opacity-0 transition-opacity duration-500 ease-in-out sm:group-hover:opacity-100"
                              style={{
                                objectPosition: product.imagePosition || "center 5%",
                                transform: `scale(${product.imageScale || 1})`,
                              }}
                              loading="eager"
                            />
                          )}
                        </div>

                        {/* Lower Gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-black/45 via-black/15 to-transparent pointer-events-none transition-opacity duration-300" />

                        {/* VIEW SET CTA */}
                        <div className="absolute inset-x-0 bottom-3.5 sm:bottom-4 flex justify-center px-3 pointer-events-none z-10">
                          <div className="pointer-events-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-[#222222] hover:bg-black text-white text-[10px] sm:text-[10.5px] uppercase tracking-[0.2em] font-medium font-sans shadow-md backdrop-blur-xs transition-all duration-300 flex items-center justify-center gap-1.5 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 active:scale-[0.98]">
                            <span>VIEW SET</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                              →
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="pt-2.5 sm:pt-3.5 flex items-start justify-between gap-2">
                        <div className="text-left flex-1 min-w-0">
                          <h3 className="font-serif text-[15px] sm:text-[16.5px] text-[#5A1F2B] font-normal leading-snug group-hover:text-[#C6A15B] transition-colors duration-300 line-clamp-1">
                            {product.name}
                          </h3>

                          <span className="text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-medium font-sans mt-0.5 block">
                            {product.category}
                          </span>

                          <p className="font-serif italic text-[12px] sm:text-[12.5px] text-[#6B635B] mt-0.5 line-clamp-1">
                            {product.craft || product.fabric}
                          </p>

                          <p className="font-sans font-medium text-[13px] sm:text-[14px] text-[#171717] tracking-wide mt-1">
                            {product.priceFormatted || product.price}
                          </p>
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 pt-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(product.id || product.slug);
                            }}
                            aria-label={
                              isWishlisted
                                ? `Remove ${product.name} from wishlist`
                                : `Add ${product.name} to wishlist`
                            }
                            title={isWishlisted ? "In Wishlist" : "Save to Wishlist"}
                            className="p-1 text-[#333333] hover:text-[#5A1F2B] transition-colors cursor-pointer"
                          >
                            <Heart
                              className={`w-[18px] h-[18px] stroke-[1.25] transition-colors duration-300 ${
                                isWishlisted
                                  ? "fill-[#5A1F2B] text-[#5A1F2B]"
                                  : "text-[#333333] hover:text-[#5A1F2B]"
                              }`}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product);
                              setIsCartOpen(true);
                            }}
                            aria-label={`Add ${product.name} to royal bag`}
                            title="Add to Royal Bag"
                            className="p-1 text-[#333333] hover:text-[#5A1F2B] transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.25]" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Section Bottom CTA */}
          <div className="mt-4 sm:mt-5 text-center">
            <Link
              href="/collection"
              className="group inline-flex flex-col items-center cursor-pointer"
            >
              <span className="text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.24em] font-medium font-sans text-[#5A1F2B] group-hover:text-[#431520] transition-colors">
                View All Poshaks
              </span>

              <div className="relative w-full h-[1px] mt-1.5 bg-[#5A1F2B]/25 overflow-hidden">
                <span className="absolute inset-0 bg-[#5A1F2B] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
