"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, MessageCircle } from "lucide-react";
import { PoshakProduct, getPoshakDisplayName, getCategoryEyebrow } from "@/data/products";
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
  showDescription = false,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const isJewellery = React.useMemo(() => {
    return (product.category || "").toUpperCase() === "JEWELLERY" || (product.type || "").toUpperCase() === "JEWELLERY";
  }, [product.category, product.type]);

  const isUnstitched = React.useMemo(() => {
    return (product.type || "").toLowerCase() === "unstitched" || (product.category || "").toLowerCase() === "unstitched";
  }, [product.type, product.category]);

  const categoryLine = React.useMemo(() => {
    return getCategoryEyebrow(product);
  }, [product]);

  const isSoldOut = React.useMemo(() => {
    return Boolean(
      product.soldOut ||
        product.price === "Sold Out" ||
        (typeof product.price === "string" &&
          product.price.toLowerCase().includes("sold"))
    );
  }, [product.soldOut, product.price]);

  const secondaryImage =
    product.additionalImages && product.additionalImages.length > 1
      ? product.additionalImages[1]
      : null;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    if (isWishlisted && onRemove) {
      onRemove(product);
    }
    toggleWishlist(product.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Pranam Rajwadi! I would like to enquire about your jewellery creation: "${product.name}". Could you please share more details and pricing?`
    );
    window.open(`https://wa.me/918766667101?text=${msg}`, "_blank");
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
              isSoldOut ? "grayscale-[15%]" : ""
            }`}
          />
        </div>

        {/* Top-Left Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-[#4A1520]/95 text-[#FFF6E9] text-[9.5px] sm:text-[10.5px] font-sans font-bold uppercase tracking-[0.2em] rounded-xs shadow-md border border-[#D4AF37]/60 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] animate-pulse" />
              Sold Out
            </span>
          </div>
        )}

        {/* Soft dark tint for sold out piece */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/15 pointer-events-none z-10" />
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
            title={isSoldOut ? "Sold Out" : isWishlisted ? "In Wishlist (Click to remove)" : "Save to Wishlist"}
            disabled={isSoldOut}
            className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 backdrop-blur-xs border border-[#E6DCB8]/70 flex items-center justify-center shadow-xs transition-all ${
              isSoldOut ? "cursor-not-allowed opacity-50" : "cursor-pointer active:scale-90 text-[#171717] hover:text-[#5A1F2B]"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.35] transition-colors duration-300 ${
                isWishlisted
                  ? "fill-[#5A1F2B] text-[#5A1F2B]"
                  : isSoldOut ? "text-gray-400" : "text-[#171717]/75 hover:text-[#5A1F2B]"
              }`}
            />
          </button>
        )}

        {/* VIEW POSHAK → Subtle Overlay CTA */}
        {showOverlayCTA && (
          <div className="absolute inset-x-0 bottom-0 py-2 sm:py-2.5 px-2.5 bg-gradient-to-t from-black/75 via-black/35 to-transparent flex items-center justify-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            <span className="text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.2em] text-[#FAF6F0] font-sans font-medium">
              {isSoldOut
                ? "SOLD OUT · VIEW PIECE"
                : isJewellery
                ? "ENQUIRE ON WHATSAPP"
                : "VIEW POSHAK"}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#FAF6F0] transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Information below image */}
      <div className="pt-2 sm:pt-2.5 flex flex-col flex-grow text-left">
        {/* Top meta row: Name & Category on Left, Heart & Bag on Right */}
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            {/* Category line */}
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#855D25] font-medium font-sans block mb-1 leading-none truncate w-full">
              {categoryLine}
            </span>

            {/* Product Name */}
            <h3 className="font-serif text-[14.5px] sm:text-[16px] text-[#1F1C18] font-normal leading-snug group-hover:text-[#855D25] transition-colors duration-300 truncate mb-1 w-full">
              {getPoshakDisplayName(product)}
            </h3>
          </div>

          {/* Original Heart & Bag / WhatsApp buttons side-by-side */}
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
                title={product.soldOut ? "Sold Out" : isWishlisted ? "In Wishlist (Click to remove)" : "Save to Wishlist"}
                disabled={product.soldOut}
                className={`p-1 transition-colors ${
                  product.soldOut ? "text-gray-300 cursor-not-allowed" : "text-[#333333] hover:text-[#5A1F2B] cursor-pointer"
                }`}
              >
                <Heart
                  className={`w-[17px] h-[17px] stroke-[1.25] transition-colors duration-300 ${
                    isWishlisted
                      ? "fill-[#5A1F2B] text-[#5A1F2B]"
                      : product.soldOut ? "text-gray-300" : "text-[#333333] hover:text-[#5A1F2B]"
                  }`}
                />
              </button>
              {isJewellery ? (
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  aria-label={`Enquire about ${product.name} on WhatsApp`}
                  title="Enquire on WhatsApp"
                  className="p-1 transition-colors text-[#2E5A36] hover:text-[#5A1F2B] cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-[17px] h-[17px] stroke-[1.4]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  disabled={isSoldOut}
                  aria-label={isSoldOut ? "Sold Out" : `Add ${product.name} to royal bag`}
                  title={isSoldOut ? "Sold Out" : "Add to Royal Bag"}
                  className={`p-1 transition-colors ${
                    isSoldOut ? "text-gray-300 cursor-not-allowed" : "text-[#333333] hover:text-[#5A1F2B] cursor-pointer"
                  }`}
                >
                  <ShoppingBag className="w-[17px] h-[17px] stroke-[1.25]" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Price & Note */}
        <div className="mt-0.5">
          {isJewellery ? (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="inline-flex items-center gap-1.5 text-xs text-[#2E5A36] hover:text-[#5A1F2B] font-sans font-medium tracking-wide transition-colors cursor-pointer group/wa"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#2E5A36] stroke-[1.8]" />
                <span className="group-hover/wa:underline underline-offset-2">Enquire on WhatsApp</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                {product.originalPrice && (
                  <span className="text-xs text-[#8C827A] line-through font-sans font-normal">
                    {product.originalPrice}
                  </span>
                )}
                <span
                  className={`text-[13.5px] sm:text-[14.5px] font-sans tracking-wide ${
                    isSoldOut
                      ? "text-[#8B263E] font-bold uppercase tracking-wider"
                      : isUnstitched || product.originalPrice
                      ? "text-[#5A1F2B] font-semibold"
                      : "text-[#2B2723] font-semibold"
                  }`}
                >
                  {product.price}
                </span>
              </div>

              {/* When heart is top-right, show bag icon here */}
              {heartPosition === "top-right" && (
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  disabled={isSoldOut}
                  aria-label={isSoldOut ? "Sold Out" : `Add ${product.name} to royal bag`}
                  title={isSoldOut ? "Sold Out" : "Add to Royal Bag"}
                  className={`p-1 -mr-1 transition-colors ${
                    isSoldOut ? "text-gray-300 cursor-not-allowed" : "text-[#333333] hover:text-[#5A1F2B] cursor-pointer active:scale-95"
                  }`}
                >
                  <ShoppingBag className="w-[17px] h-[17px] stroke-[1.25]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
