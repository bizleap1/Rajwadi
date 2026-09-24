"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { signIn, signUp, signOut, getSession } from "@/lib/auth-client";
import { UserProfile, UserAddress } from "@/types/auth";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  addresses: UserAddress[];
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password?: string) => Promise<UserProfile | null>;
  signup: (name: string, email: string, password?: string, phone?: string) => Promise<void>;
  sendOtp: (email: string, type?: "sign-in" | "email-verification" | "forget-password") => Promise<void>;
  verifyOtp: (email: string, otp: string, name?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  saveAddress: (address: Omit<UserAddress, "id"> & { id?: string }) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
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
  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const sessionRes = await getSession();
      if (sessionRes?.data?.user) {
        const profileRes = await fetch("/api/account/profile", {
          cache: "no-store",
        });

        if (profileRes.ok) {
          const data = await profileRes.json();
          setUser(data.user);
          const rawAddresses: UserAddress[] = data.addresses || [];
          const seen = new Set<string>();
          const deduped: UserAddress[] = [];
          for (const a of rawAddresses) {
            const key = `${(a.address || "").trim().toLowerCase()}|${(a.pincode || "").trim()}|${(a.city || "").trim().toLowerCase()}`;
            if (!seen.has(key)) {
              seen.add(key);
              deduped.push(a);
            }
          }
          setAddresses(deduped);
          return data.user as UserProfile;
        } else {
          const fallbackUser: UserProfile = {
            id: sessionRes.data.user.id,
            name: sessionRes.data.user.name || "Customer",
            email: sessionRes.data.user.email,
            phone: (sessionRes.data.user as any).phone || "",
            role: (sessionRes.data.user as any).role || "CUSTOMER",
            createdAt: sessionRes.data.user.createdAt?.toISOString() || new Date().toISOString(),
          };
          setUser(fallbackUser);
          return fallbackUser;
        }
      } else {
        setUser(null);
        setAddresses([]);
        return null;
      }
    } catch (e) {
      console.warn("Auth check error:", e);
      setUser(null);
      setAddresses([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Real Email / Mobile Sign-in with Password
  const loginWithEmail = async (identifier: string, password?: string): Promise<UserProfile | null> => {
    setIsLoading(true);
    try {
      if (!identifier.trim()) {
        throw new Error("Please enter your email or mobile number.");
      }
      if (!password) {
        throw new Error("Please enter your password.");
      }

      let emailToUse = identifier.trim().toLowerCase();

      // If user provided a phone number or non-email, resolve email first
      if (!emailToUse.includes("@")) {
        const lookupRes = await fetch("/api/auth/lookup-identifier", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier }),
        });
        const lookupData = await lookupRes.json();
        if (!lookupRes.ok || !lookupData.email) {
          throw new Error(lookupData.error || "No account found with this mobile number. Please check or create an account.");
        }
        emailToUse = lookupData.email;
      }

      const res = await signIn.email({
        email: emailToUse,
        password,
      });

      if (res.error) {
        throw new Error(res.error.message || "Invalid credentials. Please verify your email/phone and password.");
      }

      return await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  // Real Sign-up
  const signup = async (
    name: string,
    email: string,
    password?: string,
    phone: string = ""
  ): Promise<void> => {
    setIsLoading(true);
    try {
      if (!password) {
        throw new Error("Please create a password with at least 6 characters.");
      }
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
          body: JSON.stringify({ phone: phone.trim() }),
        });
      }

      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  // Backward-compatibility no-op stubs for OTP
  const sendOtp = async (
    _email: string,
    _type: "sign-in" | "email-verification" | "forget-password" = "sign-in"
  ): Promise<void> => {
    // OTP deprecated in favor of standard credentials
  };

  const verifyOtp = async (
    _email: string,
    _otp: string,
    _name?: string,
    _phone?: string
  ): Promise<void> => {
    // OTP deprecated in favor of standard credentials
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

  // Normalize string for address comparison
  const normalizeAddr = (s?: string) => (s || "").trim().toLowerCase().replace(/\s+/g, " ");

  // Save Address (Intelligent deduplication - updates in place if address exists)
  const saveAddress = async (addr: Omit<UserAddress, "id"> & { id?: string }) => {
    try {
      let updatedAddresses = [...addresses];
      const incomingKey = `${normalizeAddr(addr.address)}|${normalizeAddr(addr.pincode)}|${normalizeAddr(addr.city)}`;

      // Check if address already exists in patron's address book
      const existingIndex = updatedAddresses.findIndex((a) => {
        if (addr.id && a.id === addr.id) return true;
        const aKey = `${normalizeAddr(a.address)}|${normalizeAddr(a.pincode)}|${normalizeAddr(a.city)}`;
        return aKey === incomingKey;
      });

      const shouldBeDefault = addr.isDefault ?? (addresses.length === 0);

      if (existingIndex >= 0) {
        const existing = updatedAddresses[existingIndex];
        const isIdentical =
          existing.name.trim() === addr.name.trim() &&
          existing.phone.trim() === addr.phone.trim() &&
          normalizeAddr(existing.address) === normalizeAddr(addr.address) &&
          normalizeAddr(existing.city) === normalizeAddr(addr.city) &&
          normalizeAddr(existing.state) === normalizeAddr(addr.state) &&
          normalizeAddr(existing.pincode) === normalizeAddr(addr.pincode) &&
          Boolean(existing.isDefault) === Boolean(shouldBeDefault);

        // If exact same record already exists and is default, no need to make duplicate API request
        if (isIdentical && (!shouldBeDefault || updatedAddresses.filter((a) => a.isDefault).length === 1)) {
          return;
        }

        const updatedItem: UserAddress = {
          ...existing,
          name: addr.name.trim() || existing.name,
          phone: addr.phone.trim() || existing.phone,
          address: addr.address.trim() || existing.address,
          city: addr.city.trim() || existing.city,
          state: addr.state.trim() || existing.state,
          pincode: addr.pincode.trim() || existing.pincode,
          isDefault: shouldBeDefault,
        };

        if (shouldBeDefault) {
          updatedAddresses = updatedAddresses.map((a, idx) => ({
            ...a,
            isDefault: idx === existingIndex,
          }));
        }
        updatedAddresses[existingIndex] = updatedItem;
      } else {
        const newAddr: UserAddress = {
          ...addr,
          name: addr.name.trim(),
          phone: addr.phone.trim(),
          address: addr.address.trim(),
          city: addr.city.trim(),
          state: addr.state.trim(),
          pincode: addr.pincode.trim(),
          id: addr.id || `temp-${Date.now()}`,
          isDefault: shouldBeDefault,
        };
        if (shouldBeDefault) {
          updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
        }
        updatedAddresses.push(newAddr);
      }

      // Deduplicate the list to ensure no duplicate addresses are ever saved
      const seen = new Set<string>();
      const dedupedAddresses: UserAddress[] = [];
      for (const a of updatedAddresses) {
        const key = `${normalizeAddr(a.address)}|${normalizeAddr(a.pincode)}|${normalizeAddr(a.city)}`;
        if (!seen.has(key)) {
          seen.add(key);
          dedupedAddresses.push(a);
        }
      }

      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: dedupedAddresses }),
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
