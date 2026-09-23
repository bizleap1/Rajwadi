"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { signIn, signUp, signOut, getSession, emailOtp } from "@/lib/auth-client";
import { UserProfile, UserAddress } from "@/types/auth";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  addresses: UserAddress[];
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string, phone?: string) => Promise<void>;
  sendOtp: (email: string, type?: "sign-in" | "email-verification" | "forget-password") => Promise<void>;
  verifyOtp: (email: string, otp: string, name?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  saveAddress: (address: Omit<UserAddress, "id"> & { id?: string }) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: "signin" | "signup";
  authModalMessage?: string;
  openAuthModal: (mode?: "signin" | "signup", message?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Global Auth Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
  const [authModalMessage, setAuthModalMessage] = useState<string | undefined>(undefined);

  const openAuthModal = useCallback((mode: "signin" | "signup" = "signin", message?: string) => {
    setAuthModalMode(mode);
    setAuthModalMessage(message);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalMessage(undefined);
  }, []);

  // Fetch current authenticated user and profile from server
  const refreshProfile = useCallback(async () => {
    try {
      const sessionRes = await getSession();
      if (sessionRes?.data?.user) {
        const profileRes = await fetch("/api/account/profile", {
          cache: "no-store",
        });

        if (profileRes.ok) {
          const data = await profileRes.json();
          setUser(data.user);
          setAddresses(data.addresses || []);
        } else {
          setUser({
            id: sessionRes.data.user.id,
            name: sessionRes.data.user.name || "Customer",
            email: sessionRes.data.user.email,
            phone: (sessionRes.data.user as any).phone || "",
            role: (sessionRes.data.user as any).role || "CUSTOMER",
            createdAt: sessionRes.data.user.createdAt?.toISOString() || new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
        setAddresses([]);
      }
    } catch (e) {
      console.warn("Auth check error:", e);
      setUser(null);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Real Email Sign-in
  const loginWithEmail = async (email: string, password: string = "RajwadiUser2026!"): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.error) {
        throw new Error(res.error.message || "Failed to sign in. Please verify your credentials.");
      }

      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  // Real Sign-up
  const signup = async (
    name: string,
    email: string,
    password: string = "RajwadiUser2026!",
    phone: string = ""
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.error) {
        throw new Error(res.error.message || "Failed to create account.");
      }

      // Update phone if provided
      if (phone) {
        await fetch("/api/account/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
      }

      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  // Send Email OTP Code
  const sendOtp = async (
    email: string,
    type: "sign-in" | "email-verification" | "forget-password" = "sign-in"
  ): Promise<void> => {
    const res = await (emailOtp as any).sendVerificationOtp({
      email: email.trim().toLowerCase(),
      type,
    });

    if (res?.error) {
      throw new Error(res.error.message || "Failed to send verification code.");
    }
  };

  // Verify OTP and Sign-in
  const verifyOtp = async (
    email: string,
    otp: string,
    name?: string,
    phone?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await (signIn as any).emailOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      if (res?.error) {
        throw new Error(res.error.message || "Invalid or expired verification code. Please try again.");
      }

      // Update name/phone if provided
      if (name || phone) {
        await fetch("/api/account/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || undefined,
            phone: phone || undefined,
          }),
        });
      }

      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-in
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Only invoke Google OAuth if credentials exist
      alert("Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be configured in your environment. Please use email sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setAddresses([]);
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updates.name,
          phone: updates.phone,
        }),
      });

      if (res.ok) {
        await refreshProfile();
      }
    } catch (e) {
      console.error("Update profile error:", e);
    }
  };

  // Save Address
  const saveAddress = async (addr: Omit<UserAddress, "id"> & { id?: string }) => {
    try {
      let updatedAddresses = [...addresses];
      if (addr.id) {
        updatedAddresses = updatedAddresses.map((a) => (a.id === addr.id ? (addr as UserAddress) : a));
      } else {
        const newAddr = {
          ...addr,
          id: `temp-${Date.now()}`,
          isDefault: addresses.length === 0 ? true : Boolean(addr.isDefault),
        };
        if (newAddr.isDefault) {
          updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
        }
        updatedAddresses.push(newAddr as UserAddress);
      }

      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });

      if (res.ok) {
        await refreshProfile();
      }
    } catch (e) {
      console.error("Save address error:", e);
    }
  };

  // Delete Address
  const deleteAddress = async (id: string) => {
    try {
      const updatedAddresses = addresses.filter((a) => a.id !== id);
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });

      if (res.ok) {
        await refreshProfile();
      }
    } catch (e) {
      console.error("Delete address error:", e);
    }
  };

  // Set Default Address
  const setDefaultAddress = async (id: string) => {
    try {
      const updatedAddresses = addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });

      if (res.ok) {
        await refreshProfile();
      }
    } catch (e) {
      console.error("Set default address error:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        addresses,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        signup,
        sendOtp,
        verifyOtp,
        logout,
        updateProfile,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        refreshProfile,
        isAuthModalOpen,
        authModalMode,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
