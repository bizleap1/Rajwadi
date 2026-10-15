"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string, e?: React.MouseEvent) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const isLoadedRef = useRef(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rajwadi_wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load wishlist from localStorage", e);
    } finally {
      isLoadedRef.current = true;
    }
  }, []);

  // Save wishlist to localStorage only after initial load
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem("rajwadi_wishlist", JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn("Could not save wishlist to localStorage", e);
    }
  }, [wishlistIds]);

  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addToWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev : [...prev, productId]
    );
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

const defaultWishlistContext: WishlistContextType = {
  wishlistIds: [],
  toggleWishlist: () => {},
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  wishlistCount: 0,
};

export function useWishlist() {
  const context = useContext(WishlistContext);
  return context || defaultWishlistContext;
}
