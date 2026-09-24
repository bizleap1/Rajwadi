"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ArrowRight,
  Loader2,
  AlertCircle,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "signin" | "signup";
  initialMode?: "signin" | "signup";
  promptMessage?: string;
  onSwitchMode?: (mode: "signin" | "signup") => void;
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  mode: controlledMode,
  initialMode = "signin",
  promptMessage,
  onSwitchMode,
  onSuccess,
}: AuthModalProps) {
  const { loginWithEmail, signup, authModalMessage } = useAuth();

  const [internalMode, setInternalMode] = useState<"signin" | "signup">(
    controlledMode || initialMode
  );

  // Form Fields
  const [identifier, setIdentifier] = useState(""); // Email or Mobile for Sign In
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up Specific Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const activeMode = controlledMode || internalMode;

  // Sync mode when prop changes
  useEffect(() => {
    if (controlledMode) {
      setInternalMode(controlledMode);
      setError("");
    }
  }, [controlledMode]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSwitchMode = (newMode: "signin" | "signup") => {
    setError("");
    setInternalMode(newMode);
    onSwitchMode?.(newMode);
  };

  // Sign In Handler (Email or Mobile + Password)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setError("Please enter your mobile number or email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithEmail(trimmedId, password);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "Invalid credentials. Please verify your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Up Handler (Name, Email, Mobile, Password, Confirm)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim().replace(/\D/g, "");

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (!trimmedPhone || trimmedPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-check.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(trimmedName, trimmedEmail, password, trimmedPhone);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FDFBF7] border border-[#EBD9C8] rounded-none sm:rounded-sm shadow-2xl p-6 sm:p-8 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#6B5E55] hover:text-[#171717] rounded-sm transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="h-[1px] w-5 bg-[#855D25]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
              RAJWADI COUTURE
            </span>
            <span className="h-[1px] w-5 bg-[#855D25]" />
          </div>
          <h2 className="text-2xl font-serif text-[#171717] flex items-center justify-center gap-1.5">
            <span>{activeMode === "signin" ? "Patron Sign In" : "Create Patron Account"}</span>
            <Sparkles className="w-4 h-4 text-[#855D25]" />
          </h2>
          <p className="text-xs text-[#6B5E55] font-serif italic mt-1">
            {activeMode === "signin"
              ? "Access your royal wardrobe, orders, and saved poshaks"
              : "Register to enjoy bespoke Rajputi poshak atelier services"}
          </p>
        </div>

        {/* Global Prompt Message (e.g. from checkout) */}
        {(promptMessage || authModalMessage) && (
          <div className="mb-4 p-2.5 bg-[#FAF3E8] border border-[#EBD9C8] text-[#855D25] text-xs text-center rounded-sm font-medium">
            {promptMessage || authModalMessage}
          </div>
        )}

        {/* Tabs: Sign In / Create Account */}
        <div className="flex border-b border-[#EBD9C8] mb-5">
          <button
            type="button"
            onClick={() => handleSwitchMode("signin")}
            className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold text-center transition-colors border-b-2 cursor-pointer ${
              activeMode === "signin"
                ? "border-[#6D1A2A] text-[#6D1A2A]"
                : "border-transparent text-[#8A796B] hover:text-[#171717]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode("signup")}
            className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold text-center transition-colors border-b-2 cursor-pointer ${
              activeMode === "signup"
                ? "border-[#6D1A2A] text-[#6D1A2A]"
                : "border-transparent text-[#8A796B] hover:text-[#171717]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 rounded-sm">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SIGN IN FORM                                                  */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeMode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="auth-identifier"
                className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1.5"
              >
                Mobile Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#855D25]">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="auth-identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or your@email.com"
                  className="block w-full pl-9 pr-3 py-2.5 bg-white border border-[#D9C4B0] text-[#171717] text-xs sm:text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] focus:border-[#855D25] placeholder:text-[#A09285]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="auth-password"
                  className="block text-xs uppercase tracking-wider font-medium text-[#171717]"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#855D25]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2.5 bg-white border border-[#D9C4B0] text-[#171717] text-xs sm:text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] focus:border-[#855D25] placeholder:text-[#A09285]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A796B] hover:text-[#171717] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-[0.15em] font-medium transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ───────────────────────────────────────────────────────────── */
          /* SIGN UP FORM                                                  */
          /* ───────────────────────────────────────────────────────────── */
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#855D25]">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Rathore"
                  className="block w-full pl-9 pr-3 py-2 bg-white border border-[#D9C4B0] text-[#171717] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] focus:border-[#855D25] placeholder:text-[#A09285]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-phone"
                className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1"
              >
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#855D25]">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6B5E55]">
                  +91
                </span>
                <input
                  id="signup-phone"
                  type="tel"
                  maxLength={10}
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  className="block w-full pl-16 pr-3 py-2 bg-white border border-[#D9C4B0] text-[#171717] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] focus:border-[#855D25] placeholder:text-[#A09285]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#855D25]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@example.com"
                  className="block w-full pl-9 pr-3 py-2 bg-white border border-[#D9C4B0] text-[#171717] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] focus:border-[#855D25] placeholder:text-[#A09285]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1"
              >
                Create Password (min. 6 chars) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#855D25]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2 bg-white border border-[#D9C4B0] text-[#171717] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] focus:border-[#855D25] placeholder:text-[#A09285]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A796B] hover:text-[#171717] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#855D25]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2 bg-white border border-[#D9C4B0] text-[#171717] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] focus:border-[#855D25] placeholder:text-[#A09285]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A796B] hover:text-[#171717] cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-[0.15em] font-medium transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Patron Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer Switcher */}
        <div className="mt-5 pt-4 border-t border-[#EBD9C8] flex items-center justify-between text-xs text-[#6B5E55]">
          <span className="flex items-center gap-1.5 text-[11px] text-[#855D25]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Patron Session</span>
          </span>

          {activeMode === "signin" ? (
            <p>
              New here?{" "}
              <button
                type="button"
                onClick={() => handleSwitchMode("signup")}
                className="text-[#6D1A2A] font-semibold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => handleSwitchMode("signin")}
                className="text-[#6D1A2A] font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
