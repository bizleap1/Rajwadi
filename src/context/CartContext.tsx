"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export interface CartItem {
  productId: string;
  internalId?: string;
  name: string;
  category: string;
  size: string;
  stitchingSelected: boolean;
  stitchingPriceInPaise: number;
  unitPriceInPaise: number;
  quantity: number;
  totalInPaise: number;
  image: string;
  inStock?: boolean;
  stock?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number; // in Rupees for UI
  cartTotalInPaise: number; // authoritative integer paise
  subtotalInPaise: number;
  stitchingInPaise: number;
  shippingInPaise: number;
  isCartOpen: boolean;
  warnings: string[];
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    product: {
      id: string;
      slug?: string;
      internalId?: string;
      name: string;
      category: string;
      priceInPaise?: number;
      price?: string;
      image?: string;
      images?: string[];
      stitchingAvailable?: boolean;
      stitchingPriceInPaise?: number;
    },
    size?: string,
    quantity?: number,
    stitchingSelected?: boolean
  ) => void;
  removeFromCart: (productId: string, size: string, stitchingSelected: boolean) => void;
  updateQuantity: (productId: string, size: string, stitchingSelected: boolean, delta: number) => void;
  clearCart: () => void;
  reconcileCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [subtotalInPaise, setSubtotalInPaise] = useState(0);
  const [stitchingInPaise, setStitchingInPaise] = useState(0);
  const [shippingInPaise, setShippingInPaise] = useState(0);
  const [totalInPaise, setTotalInPaise] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);

  const isLoadedRef = useRef(false);

  // 1. Authoritative Cart Validation & Pricing against database
  const reconcileCart = useCallback(async () => {
    try {
      const saved = localStorage.getItem("rajwadi_cart");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setCartItems([]);
        return;
      }

      const payload = {
        items: parsed.map((item: any) => ({
          productId: item.productId || item.product?.id || item.product?.slug || item.id,
          size: item.size || "Standard",
          stitchingSelected: Boolean(item.stitchingSelected),
          quantity: item.quantity || 1,
        })),
      };

      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        setSubtotalInPaise(data.subtotalInPaise || 0);
        setStitchingInPaise(data.stitchingInPaise || 0);
        setShippingInPaise(data.shippingInPaise || 0);
        setTotalInPaise(data.totalInPaise || 0);
        if (data.warnings && data.warnings.length > 0) {
          setWarnings(data.warnings);
        }
      }
    } catch (e) {
      console.warn("Cart reconciliation error:", e);
    }
  }, []);

  // 2. Load and validate on mount and window focus
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rajwadi_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
    } finally {
      isLoadedRef.current = true;
    }

    reconcileCart();

    const onFocus = () => reconcileCart();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [reconcileCart]);

  // 3. Save to localStorage
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem("rajwadi_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (
    product: any,
    size?: string,
    quantity: number = 1,
    stitchingSelected: boolean = false
  ) => {
    const pId = product.slug || product.id;
    const resolvedSize =
      size && size !== "36"
        ? size
        : product.category?.toLowerCase() === "unstitched"
        ? "Unstitched"
        : "Stitched";

    let unitPriceInPaise = product.priceInPaise;
    if (!unitPriceInPaise && product.price) {
      const numeric = product.price.replace(/[^0-9]/g, "");
      unitPriceInPaise = (numeric ? parseInt(numeric, 10) : 0) * 100;
    }

    const stitchingPriceInPaise =
      stitchingSelected && product.stitchingAvailable
        ? product.stitchingPriceInPaise || 250000
        : 0;

    const mainImage =
      product.image || (product.images && product.images[0]) || "/placeholder.webp";

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === pId &&
          item.size === resolvedSize &&
          item.stitchingSelected === stitchingSelected
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalInPaise: (unitPriceInPaise + stitchingPriceInPaise) * newQty,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          productId: pId,
          internalId: product.internalId || product.id,
          name: product.name,
          category: product.category,
          size: resolvedSize,
          stitchingSelected,
          stitchingPriceInPaise,
          unitPriceInPaise: unitPriceInPaise || 0,
          quantity,
          totalInPaise: (unitPriceInPaise + stitchingPriceInPaise) * quantity,
          image: mainImage,
          inStock: true,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
    // Asynchronously validate with server
    setTimeout(() => reconcileCart(), 100);
  };

  const removeFromCart = (productId: string, size: string, stitchingSelected: boolean) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            item.stitchingSelected === stitchingSelected
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    size: string,
    stitchingSelected: boolean,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (
            item.productId === productId &&
            item.size === size &&
            item.stitchingSelected === stitchingSelected
          ) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalInPaise:
                (item.unitPriceInPaise + item.stitchingPriceInPaise) * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setSubtotalInPaise(0);
    setStitchingInPaise(0);
    setShippingInPaise(0);
    setTotalInPaise(0);
    localStorage.removeItem("rajwadi_cart");
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const calculatedSubtotal = cartItems.reduce(
    (acc, item) => acc + item.unitPriceInPaise * item.quantity,
    0
  );
  const calculatedStitching = cartItems.reduce(
    (acc, item) => acc + item.stitchingPriceInPaise * item.quantity,
    0
  );
  const calculatedTotal = calculatedSubtotal + calculatedStitching + shippingInPaise;

  const authoritativeTotalInPaise = totalInPaise || calculatedTotal;
  const cartTotal = authoritativeTotalInPaise / 100; // In INR for UI

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        cartTotalInPaise: authoritativeTotalInPaise,
        subtotalInPaise: subtotalInPaise || calculatedSubtotal,
        stitchingInPaise: stitchingInPaise || calculatedStitching,
        shippingInPaise,
        isCartOpen,
        warnings,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        reconcileCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
