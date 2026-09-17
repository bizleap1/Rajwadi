"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "signin" | "signup";
  initialMode?: "signin" | "signup";
  onSwitchMode?: (mode: "signin" | "signup") => void;
  onBack?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  mode: controlledMode,
  initialMode = "signin",
  onSwitchMode,
  onBack,
}: AuthModalProps) {
  const { loginWithEmail, signup, loginWithGoogle } = useAuth();
  const [internalMode, setInternalMode] = useState<"signin" | "signup">(
    controlledMode || initialMode
  );
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const activeMode = controlledMode || internalMode;

  // Sync mode prop when it changes
  useEffect(() => {
    if (controlledMode) {
      setInternalMode(controlledMode);
      setError("");
    }
  }, [controlledMode]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSwitch = (newMode: "signin" | "signup") => {
    setError("");
    setInternalMode(newMode);
    onSwitchMode?.(newMode);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (activeMode === "signin") {
      if (!emailOrMobile.trim()) {
        setError("Please enter your email or mobile number.");
        return;
      }
      setIsSubmitting(true);
      try {
        await loginWithEmail(emailOrMobile);
        onClose();
      } catch {
        setError("Sign in could not be completed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!mobile.trim() || mobile.replace(/\D/g, "").length < 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }
      setIsSubmitting(true);
      try {
        await signup(name, email, mobile);
        onClose();
      } catch {
        setError("Account creation could not be completed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch {
      setError("Google authentication was not completed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. MOBILE FULL-SCREEN VIEW (< sm)                                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        className="sm:hidden fixed inset-0 z-[60] bg-[#FDFBF7] flex flex-col text-[#171717] animate-in slide-in-from-right duration-200"
      >
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E6DCB8] bg-[#FAF5EE]">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#171717] hover:text-[#5A1F2B] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            <span>{activeMode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 -mr-1 text-[#171717] hover:text-[#5A1F2B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Mobile Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-sm mx-auto space-y-6">
            <div>
              <p className="font-serif italic text-base text-[#6B635B]">
                {activeMode === "signin" ? "Welcome back" : "Create your Rajwadi account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeMode === "signup" ? (
                <>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold mb-1.5">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Prerna Sharma"
                      className="w-full px-3.5 py-3 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold mb-1.5">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="prerna.sharma@gmail.com"
                      className="w-full px-3.5 py-3 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold mb-1.5">
                      MOBILE NUMBER
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-3 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold mb-1.5">
                      EMAIL / MOBILE
                    </label>
                    <input
                      type="text"
                      value={emailOrMobile}
                      onChange={(e) => setEmailOrMobile(e.target.value)}
                      placeholder="prerna.sharma@gmail.com"
                      className="w-full px-3.5 py-3 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold">
                        PASSWORD
                      </label>
                      <button
                        type="button"
                        onClick={() => setError("Password reset link has been sent to your registered email.")}
                        className="text-[10.5px] text-[#855D25] hover:text-[#5A1F2B] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-3 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-[11px] text-[#5A1F2B] font-sans pt-1">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-70 mt-2"
              >
                <span>
                  {isSubmitting
                    ? "PLEASE WAIT..."
                    : activeMode === "signin"
                    ? "SIGN IN →"
                    : "CREATE ACCOUNT →"}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#E6DCB8]"></div>
              <span className="flex-shrink mx-3 text-xs font-serif italic text-[#8C827A]">
                or
              </span>
              <div className="flex-grow border-t border-[#E6DCB8]"></div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleAuth}
              className="w-full py-3 px-4 bg-white hover:bg-[#FAF6F0] border border-[#D8CCB8] text-[#171717] text-xs uppercase tracking-[0.16em] font-medium font-sans flex items-center justify-center gap-2.5 transition-colors shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            {/* Switch Mode Link */}
            <div className="pt-4 text-center text-xs font-sans">
              {activeMode === "signin" ? (
                <p className="text-[#6B635B]">
                  New to Rajwadi?{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitch("signup")}
                    className="text-[#5A1F2B] font-semibold hover:underline cursor-pointer"
                  >
                    CREATE ACCOUNT &rarr;
                  </button>
                </p>
              ) : (
                <p className="text-[#6B635B]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitch("signin")}
                    className="text-[#5A1F2B] font-semibold hover:underline cursor-pointer"
                  >
                    SIGN IN &rarr;
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. DESKTOP CENTERED MODAL (>= sm)                                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
        {/* Click outside backdrop */}
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-md bg-[#FAF5EE] border border-[#E6DCB8] shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200 text-[#171717]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-[#8C827A] hover:text-[#5A1F2B] p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-[10.5px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block mb-1">
              RAJWADI ATELIER
            </span>
            <h2 className="font-serif text-2xl text-[#171717] font-normal tracking-wide uppercase">
              {activeMode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </h2>
            <p className="font-serif italic text-xs text-[#6B635B] mt-1">
              {activeMode === "signin"
                ? "Access your saved poshaks, orders & royal concierge."
                : "Experience bespoke Rajputi craftsmanship."}
            </p>
          </div>

          {/* Google Primary OAuth Option */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleAuth}
            className="w-full py-3 px-4 bg-white hover:bg-[#FAF6F0] border border-[#D8CCB8] text-[#171717] text-xs uppercase tracking-[0.16em] font-medium font-sans flex items-center justify-center gap-2.5 transition-colors shadow-2xs cursor-pointer mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-[#E6DCB8]"></div>
            <span className="flex-shrink mx-3 text-[11px] font-serif italic text-[#8C827A]">
              or with email
            </span>
            <div className="flex-grow border-t border-[#E6DCB8]"></div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {activeMode === "signup" && (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prerna Sharma"
                  className="w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                {activeMode === "signup" ? "EMAIL" : "EMAIL / MOBILE"}
              </label>
              <input
                type="text"
                value={activeMode === "signup" ? email : emailOrMobile}
                onChange={(e) =>
                  activeMode === "signup"
                    ? setEmail(e.target.value)
                    : setEmailOrMobile(e.target.value)
                }
                placeholder="prerna.sharma@gmail.com"
                className="w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
              />
            </div>

            {activeMode === "signup" ? (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                  MOBILE NUMBER
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#8C827A] font-semibold">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => setError("Password reset link has been sent to your registered email.")}
                    className="text-[10px] text-[#855D25] hover:text-[#5A1F2B] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                />
              </div>
            )}

            {error && (
              <p className="text-[11px] text-[#5A1F2B] font-sans pt-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-70 mt-4"
            >
              <span>{isSubmitting ? "PLEASE WAIT..." : activeMode === "signin" ? "SIGN IN →" : "CREATE ACCOUNT →"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="pt-5 mt-4 border-t border-[#E6DCB8] text-center text-xs font-sans">
            {activeMode === "signin" ? (
              <p className="text-[#6B635B]">
                New to Rajwadi?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitch("signup")}
                  className="text-[#5A1F2B] font-semibold hover:underline cursor-pointer"
                >
                  CREATE ACCOUNT &rarr;
                </button>
              </p>
            ) : (
              <p className="text-[#6B635B]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitch("signin")}
                  className="text-[#5A1F2B] font-semibold hover:underline cursor-pointer"
                >
                  SIGN IN &rarr;
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
