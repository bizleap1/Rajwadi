"use client";

import React from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderProvider } from "@/context/OrderContext";
import AuthModal from "@/components/AuthModal";

function GlobalAuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, authModalMessage, openAuthModal } = useAuth();

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "signin") {
      const isDenied = params.get("denied") === "admin";
      openAuthModal(
        "signin",
        isDenied
          ? "Owner authentication required to access Admin Atelier."
          : undefined
      );
    }
  }, [openAuthModal]);

  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      mode={authModalMode}
      promptMessage={authModalMessage}
    />
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            {children}
            <GlobalAuthModal />
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

