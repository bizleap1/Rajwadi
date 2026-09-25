"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { PoshakProduct } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export interface ProductCardProps {
  product: PoshakProduct;
  index?: number;
  priority?: boolean;
  onRemove?: (product: PoshakProduct) => void;
  showOverlayCTA?: boolean;
  heartPosition?: "top-right" | "bottom";
  showDescription?: boolean;
}

export default function ProductCard({
  product,
  index = 0,
  priority,
  onRemove,
  showOverlayCTA = true,
  heartPosition = "bottom",
  showDescription = true,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const secondaryImage =
    product.additionalImages && product.additionalImages.length > 1
      ? product.additionalImages[1]
      : null;

  // Calculate discount percentage if original price is provided
  const discountPercent = React.useMemo(() => {
    if (!product.price || !product.originalPrice) return null;
    const currentNum = parseInt(product.price.replace(/[^0-9]/g, ""), 10);
    const originalNum = parseInt(product.originalPrice.replace(/[^0-9]/g, ""), 10);
    if (originalNum > currentNum && originalNum > 0) {
      return Math.round(((originalNum - currentNum) / originalNum) * 100);
    }
    return null;
  }, [product.price, product.originalPrice]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted && onRemove) {
      onRemove(product);
    }
    toggleWishlist(product.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col h-full text-left cursor-pointer focus:outline-none select-none relative"
    >
      {/* 1. Clean Image Container (Exact 3:4 ratio with normalized subject scaling) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4ECE1] border border-[#E6DCB8]/50 shadow-xs transition-shadow duration-500 group-hover:shadow-md">
        <div
          className="w-full h-full relative transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            transform: product.imageScale
              ? `scale(${product.imageScale})`
              : undefined,
            transformOrigin: product.imagePosition || "center 10%",
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority !== undefined ? priority : index < 4}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
            style={{
              objectPosition: product.imagePosition || "center 5%",
            }}
            className={`object-cover transition-opacity duration-700 ease-out ${
              secondaryImage ? "group-hover:opacity-0" : ""
            }`}
          />

          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
              style={{
                objectPosition: product.imagePosition || "center 5%",
              }}
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
            />
          )}
        </div>

        {/* Top-Left Discount Badge */}
        {discountPercent !== null && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20 px-2 py-0.5 bg-[#6D1A2A] text-[#FAF6F0] text-[9px] sm:text-[10px] uppercase font-bold tracking-wider rounded-xs shadow-xs flex items-center gap-1">
            <span>{discountPercent}% OFF</span>
          </div>
        )}

        {/* Top-Right Heart Icon if heartPosition === "top-right" */}
        {heartPosition === "top-right" && (
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            title={isWishlisted ? "In Wishlist (Click to remove)" : "Save to Wishlist"}
            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 backdrop-blur-xs border border-[#E6DCB8]/70 flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-all text-[#171717] hover:text-[#5A1F2B]"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.35] transition-colors duration-300 ${
                isWishlisted
                  ? "fill-[#5A1F2B] text-[#5A1F2B]"
                  : "text-[#171717]/75 hover:text-[#5A1F2B]"
              }`}
            />
          </button>
        )}

        {/* VIEW POSHAK → Subtle Overlay CTA */}
        {showOverlayCTA && (
          <div className="absolute inset-x-0 bottom-0 py-2 sm:py-2.5 px-2.5 bg-gradient-to-t from-black/75 via-black/35 to-transparent flex items-center justify-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            <span className="text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.2em] text-[#FAF6F0] font-sans font-medium">
              VIEW POSHAK
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#FAF6F0] transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Information below image */}
      <div className="pt-2 sm:pt-2.5 flex flex-col flex-grow text-left">
        {/* Top meta row: Name & Category (with bottom heart if heartPosition === "bottom") */}
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            {/* Category in Small Uppercase */}
            <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.22em] text-[#8C827A] font-semibold font-sans block leading-none mb-1">
              {product.category}
            </span>

            {/* Product Name */}
            <h3 className="font-serif text-[13.5px] sm:text-[15.5px] text-[#5A1F2B] font-normal leading-snug group-hover:text-[#C6A15B] transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
          </div>

          {/* If heart is at bottom, show side-by-side with bag icon */}
          {heartPosition === "bottom" && (
            <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
              <button
                type="button"
                onClick={handleWishlistClick}
                aria-label={
                  isWishlisted
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
                }
                title={isWishlisted ? "In Wishlist (Click to remove)" : "Save to Wishlist"}
                className="p-1 text-[#333333] hover:text-[#5A1F2B] transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-[17px] h-[17px] stroke-[1.25] transition-colors duration-300 ${
                    isWishlisted
                      ? "fill-[#5A1F2B] text-[#5A1F2B]"
                      : "text-[#333333] hover:text-[#5A1F2B]"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={handleAddToCartClick}
                aria-label={`Add ${product.name} to royal bag`}
                title="Add to Royal Bag"
                className="p-1 text-[#333333] hover:text-[#5A1F2B] transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-[17px] h-[17px] stroke-[1.25]" />
              </button>
            </div>
          )}
        </div>

        {/* Optional Description / Craft (hidden when showDescription === false) */}
        {showDescription && (
          <p className="font-serif italic text-[11.5px] sm:text-[12px] text-[#6B635B] mt-0.5 line-clamp-1">
            {product.craft || product.fabric}
          </p>
        )}

        {/* Price & Bag Row (when heart is top-right) */}
        {heartPosition === "top-right" && (
          <div className="flex items-center justify-between mt-1 pt-0.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-sans font-medium text-[13px] sm:text-[14px] text-[#171717] tracking-wide">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] sm:text-[12px] text-[#8A796B] line-through font-sans">
                  {product.originalPrice}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddToCartClick}
              aria-label={`Add ${product.name} to royal bag`}
              title="Add to Royal Bag"
              className="p-1 -mr-1 text-[#333333] hover:text-[#5A1F2B] transition-colors cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-[17px] h-[17px] stroke-[1.25]" />
            </button>
          </div>
        )}

        {/* Price only (when heart is bottom) */}
        {heartPosition === "bottom" && (
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-sans font-medium text-[13px] sm:text-[14px] text-[#171717] tracking-wide">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] sm:text-[12px] text-[#8A796B] line-through font-sans">
                {product.originalPrice}
              </span>
            )}
            {discountPercent !== null && (
              <span className="text-[10px] font-semibold text-[#6D1A2A] uppercase tracking-wider font-sans">
                ({discountPercent}% off)
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
