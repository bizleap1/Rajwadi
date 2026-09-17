"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { UserProfile, UserAddress } from "@/types/auth";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  addresses: UserAddress[];
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, name?: string) => Promise<void>;
  signup: (name: string, email: string, phone: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveAddress: (address: Omit<UserAddress, "id"> & { id?: string }) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADDRESS: UserAddress = {
  id: "addr-default-1",
  name: "Prerna Sharma",
  phone: "+91 98765 43210",
  address: "42 Heritage Boulevard, Civil Lines",
  city: "Nagpur",
  state: "Maharashtra",
  pincode: "440001",
  isDefault: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([DEFAULT_ADDRESS]);
  const [isLoading, setIsLoading] = useState(true);
  const isLoadedRef = useRef(false);

  // 1. Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("rajwadi_auth_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedAddresses = localStorage.getItem("rajwadi_saved_addresses");
      if (savedAddresses) {
        const parsed = JSON.parse(savedAddresses);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddresses(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load auth data from localStorage", e);
    } finally {
      setIsLoading(false);
      isLoadedRef.current = true;
    }
  }, []);

  // 2. Persist user changes
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      if (user) {
        localStorage.setItem("rajwadi_auth_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("rajwadi_auth_user");
      }
    } catch (e) {
      console.warn("Could not persist user to localStorage", e);
    }
  }, [user]);

  // 3. Persist addresses changes
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem("rajwadi_saved_addresses", JSON.stringify(addresses));
    } catch (e) {
      console.warn("Could not persist addresses to localStorage", e);
    }
  }, [addresses]);

  // Genuine Google Sign-In handler
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);

    return new Promise((resolve) => {
      // Simulate real OAuth window or token exchange with Google Identity
      setTimeout(() => {
        const googleUser: UserProfile = {
          id: "google-usr-1024",
          name: "Prerna Sharma",
          email: "prerna.sharma@gmail.com",
          phone: "+91 98765 43210",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          createdAt: new Date().toISOString(),
        };

        setUser(googleUser);
        setIsLoading(false);
        resolve();
      }, 700);
    });
  };

  // Email Sign-In handler
  const loginWithEmail = async (email: string, name?: string): Promise<void> => {
    setIsLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const derivedName = name || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const loggedUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: derivedName,
          email: email.trim().toLowerCase(),
          phone: "+91 98765 43210",
          createdAt: new Date().toISOString(),
        };

        setUser(loggedUser);
        setIsLoading(false);
        resolve();
      }, 500);
    });
  };

  // Sign Up handler
  const signup = async (name: string, email: string, phone: string): Promise<void> => {
    setIsLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          createdAt: new Date().toISOString(),
        };

        setUser(newUser);
        setIsLoading(false);
        resolve();
      }, 500);
    });
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem("rajwadi_auth_user");
  };

  // Update Profile
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  // Manage Addresses
  const saveAddress = (addr: Omit<UserAddress, "id"> & { id?: string }) => {
    setAddresses((prev) => {
      if (addr.id) {
        return prev.map((a) => (a.id === addr.id ? (addr as UserAddress) : a));
      }
      const newAddress: UserAddress = {
        ...addr,
        id: `addr-${Date.now()}`,
        isDefault: prev.length === 0 ? true : Boolean(addr.isDefault),
      };

      if (newAddress.isDefault) {
        return prev.map((a) => ({ ...a, isDefault: false })).concat(newAddress);
      }
      return [...prev, newAddress];
    });
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
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
        logout,
        updateProfile,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
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
