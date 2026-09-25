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
  // Full backwards & legacy compatibility for components accessing item.product
  product: {
    id: string;
    slug?: string;
    name: string;
    price: string;
    category?: string;
    image: string;
    images?: string[];
    imagePosition?: string;
    imageScale?: number;
    stitchingAvailable?: boolean;
    stitchingPriceInPaise?: number;
    [key: string]: any;
  };
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
      [key: string]: any;
    },
    size?: string,
    quantity?: number,
    stitchingSelected?: boolean
  ) => void;
  removeFromCart: (productId: string, size?: string, stitchingSelected?: boolean) => void;
  updateQuantity: (
    productId: string,
    size?: string,
    stitchingSelectedOrDelta?: boolean | number,
    delta?: number
  ) => void;
  clearCart: () => void;
  reconcileCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to guarantee `product` sub-object is always present and robust on every CartItem
function ensureProduct(item: any): CartItem {
  const pId = item.productId || item.product?.id || item.product?.slug || item.id || "";
  const name = item.name || item.product?.name || "Rajputi Poshak";
  const category = item.category || item.product?.category || "Semi-Stitched";
  const image =
    item.image ||
    item.product?.image ||
    (item.product?.images && item.product.images[0]) ||
    "/placeholder.webp";
  const priceInPaise = item.unitPriceInPaise || item.totalInPaise || 0;
  const priceStr =
    item.product?.price ||
    (priceInPaise
      ? `₹ ${(priceInPaise / 100).toLocaleString("en-IN")}`
      : "₹ 0");

  const productObj = {
    id: pId,
    slug: pId,
    name,
    category,
    price: priceStr,
    image,
    images: item.product?.images || [image],
    imagePosition: item.product?.imagePosition || "center 5%",
    imageScale: item.product?.imageScale || 1,
    stitchingAvailable: item.product?.stitchingAvailable ?? true,
    stitchingPriceInPaise: item.stitchingPriceInPaise || 0,
    ...(item.product || {}),
  };

  return {
    productId: pId,
    internalId: item.internalId || productObj.id,
    name,
    category,
    size: item.size || "Standard",
    stitchingSelected: Boolean(item.stitchingSelected),
    stitchingPriceInPaise: item.stitchingPriceInPaise || 0,
    unitPriceInPaise: item.unitPriceInPaise || priceInPaise,
    quantity: item.quantity || 1,
    totalInPaise: item.totalInPaise || priceInPaise * (item.quantity || 1),
    image,
    inStock: item.inStock ?? true,
    stock: item.stock,
    product: productObj,
  };
}

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
        setCartItems((data.items || []).map(ensureProduct));
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
          setCartItems(parsed.map(ensureProduct));
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
      const numeric = String(product.price).replace(/[^0-9]/g, "");
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
        updated[existingIdx] = ensureProduct({
          ...updated[existingIdx],
          quantity: newQty,
          totalInPaise: (unitPriceInPaise + stitchingPriceInPaise) * newQty,
        });
        return updated;
      } else {
        const newItem = ensureProduct({
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
          product,
        });
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
    // Asynchronously validate with server
    setTimeout(() => reconcileCart(), 100);
  };

  // Supports both (productId, size) and (productId, size, stitchingSelected)
  const removeFromCart = (
    productId: string,
    size?: string,
    stitchingSelected?: boolean
  ) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        const idMatches = item.productId === productId || item.product?.id === productId;
        if (!idMatches) return true;
        if (size !== undefined && item.size !== size) return true;
        if (stitchingSelected !== undefined && item.stitchingSelected !== stitchingSelected) return true;
        return false;
      })
    );
  };

  // Supports both (productId, size, delta) and (productId, size, stitchingSelected, delta)
  const updateQuantity = (
    productId: string,
    size?: string,
    stitchingSelectedOrDelta?: boolean | number,
    deltaArg?: number
  ) => {
    const isThreeArgs = typeof stitchingSelectedOrDelta === "number";
    const delta = isThreeArgs ? stitchingSelectedOrDelta : (deltaArg ?? 0);
    const checkStitching = !isThreeArgs && stitchingSelectedOrDelta !== undefined;

    setCartItems((prev) =>
      prev
        .map((item) => {
          const matchId = item.productId === productId || item.product?.id === productId;
          const matchSize = size === undefined || item.size === size;
          const matchStitching = !checkStitching || item.stitchingSelected === stitchingSelectedOrDelta;

          if (matchId && matchSize && matchStitching) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const singleUnitPrice = item.unitPriceInPaise || (item.totalInPaise / item.quantity);
            const singleStitching = item.stitchingPriceInPaise || 0;
            return ensureProduct({
              ...item,
              quantity: newQty,
              totalInPaise: (singleUnitPrice + singleStitching) * newQty,
            });
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
