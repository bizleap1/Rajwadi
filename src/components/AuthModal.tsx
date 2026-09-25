"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ArrowRight, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Lock, Mail, User as UserIcon, Phone, KeyRound, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "signin" | "signup";
  initialMode?: "signin" | "signup";
  onSwitchMode?: (mode: "signin" | "signup") => void;
  onBack?: () => void;
}

type AuthMethod = "otp" | "password";

export default function AuthModal({
  isOpen,
  onClose,
  mode: controlledMode,
  initialMode = "signin",
  onSwitchMode,
  onBack,
}: AuthModalProps) {
  const { loginWithEmail, signup, sendOtp, verifyOtp } = useAuth();
  
  const [internalMode, setInternalMode] = useState<"signin" | "signup">(
    controlledMode || initialMode
  );
  const [authMethod, setAuthMethod] = useState<AuthMethod>("otp");
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  
  // OTP flow state
  const [otpStep, setOtpStep] = useState<"input-email" | "verify-code">("input-email");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const activeMode = controlledMode || internalMode;

  // Sync mode prop when it changes
  useEffect(() => {
    if (controlledMode) {
      setInternalMode(controlledMode);
      setError("");
      setInfoMessage("");
      setOtpStep("input-email");
      setOtpCode(["", "", "", "", "", ""]);
    }
  }, [controlledMode]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

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

  const handleSwitch = (newMode: "signin" | "signup") => {
    setError("");
    setInfoMessage("");
    setInternalMode(newMode);
    setOtpStep("input-email");
    setOtpCode(["", "", "", "", "", ""]);
    onSwitchMode?.(newMode);
  };

  // Handle sending OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setInfoMessage("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (activeMode === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendOtp(email, "sign-in");
      setOtpStep("verify-code");
      setResendCountdown(60);
      setInfoMessage(`A 6-digit access code has been sent to ${email}`);
      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || "Could not send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP digit change & auto-focus next
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newCode = [...otpCode];
    newCode[index] = digit;
    setOtpCode(newCode);

    // Auto move to next input
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (digit && index === 5 && newCode.every((d) => d !== "")) {
      const fullCode = newCode.join("");
      executeOtpVerify(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newCode = [...otpCode];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setOtpCode(newCode);

    if (pasted.length === 6) {
      executeOtpVerify(pasted);
    } else if (pasted.length < 6) {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  // Verify OTP submission
  const executeOtpVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otpCode.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await verifyOtp(
        email,
        code,
        activeMode === "signup" ? name : undefined,
        mobile || undefined
      );
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid or expired access code. Please verify and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (activeMode === "signin") {
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!password || password.length < 6) {
        setError("Please enter your password (minimum 6 characters).");
        return;
      }
      setIsSubmitting(true);
      try {
        await loginWithEmail(email, password);
        onClose();
      } catch (err: any) {
        setError(err.message || "Invalid credentials. Please verify and try again.");
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
      if (!password || password.length < 6) {
        setError("Please choose a password with at least 6 characters.");
        return;
      }
      setIsSubmitting(true);
      try {
        await signup(name, email, password, mobile);
        onClose();
      } catch (err: any) {
        setError(err.message || "Account creation could not be completed.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FDFBF7] border border-[#EBD9C8] rounded-none sm:rounded-sm shadow-2xl p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#4A3E37] hover:text-[#171717] rounded-sm transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="h-[1px] w-5 bg-[#855D25]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
              {activeMode === "signin" ? "PATRON LOGIN" : "JOIN THE RAJWADI ATELIER"}
            </span>
            <span className="h-[1px] w-5 bg-[#855D25]" />
          </div>
          <h2 className="text-2xl font-serif text-[#171717]">
            {activeMode === "signin" ? "Welcome Back" : "Create Patron Account"}
          </h2>
        </div>

        {/* Tab switch between OTP and Password */}
        <div className="flex border-b border-[#EBD9C8] mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("otp");
              setError("");
              setInfoMessage("");
            }}
            className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              authMethod === "otp"
                ? "border-[#6D1A2A] text-[#6D1A2A] font-semibold"
                : "border-transparent text-[#6B5E55] hover:text-[#171717]"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>One-Time Code (OTP)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("password");
              setError("");
              setInfoMessage("");
            }}
            className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              authMethod === "password"
                ? "border-[#6D1A2A] text-[#6D1A2A] font-semibold"
                : "border-transparent text-[#6B5E55] hover:text-[#171717]"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Password</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 rounded-sm">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Notification */}
        {infoMessage && (
          <div className="mb-4 p-3 bg-[#FAF3E8] border border-[#EBD9C8] text-[#855D25] text-xs flex items-start gap-2 rounded-sm">
            <CheckCircle2 className="w-4 h-4 text-[#855D25] flex-shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* -------------------- OTP AUTHENTICATION FLOW -------------------- */}
        {authMethod === "otp" ? (
          otpStep === "input-email" ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              {activeMode === "signup" && (
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Prerna Sharma"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="prerna.sharma@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#7A6D63]">
                  We will send a 6-digit access code to this email.
                </p>
              </div>

              {activeMode === "signup" && (
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-[#555555]">
                  Enter the 6-digit code sent to <br />
                  <strong className="text-[#171717] font-semibold">{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setOtpStep("input-email")}
                  className="text-[11px] text-[#6D1A2A] hover:underline mt-1 inline-block"
                >
                  Change Email Address
                </button>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 sm:gap-2.5 my-3" onPaste={handleOtpPaste}>
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-bold font-mono bg-white border border-[#D9C4B0] rounded-sm focus:border-[#6D1A2A] focus:ring-1 focus:ring-[#6D1A2A] text-[#171717]"
                  />
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => executeOtpVerify()}
                  disabled={isSubmitting || otpCode.some((d) => !d)}
                  className="w-full py-2.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Enter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  {resendCountdown > 0 ? (
                    <p className="text-[11px] text-[#7A6D63]">
                      Resend code in <strong className="text-[#171717] font-semibold">{resendCountdown}s</strong>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={isSubmitting}
                      className="text-xs text-[#6D1A2A] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend 6-Digit Code</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          /* -------------------- PASSWORD AUTHENTICATION FLOW -------------------- */
          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            {activeMode === "signup" && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prerna Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prerna.sharma@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>
            </div>

            {activeMode === "signup" && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{activeMode === "signin" ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Bottom Mode Switch */}
        <div className="mt-5 pt-4 border-t border-[#EBD9C8] text-center text-xs text-[#6B5E55]">
          {activeMode === "signin" ? (
            <p>
              New to Rajwadi?{" "}
              <button
                type="button"
                onClick={() => handleSwitch("signup")}
                className="text-[#6D1A2A] font-semibold hover:underline"
              >
                Create an Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => handleSwitch("signin")}
                className="text-[#6D1A2A] font-semibold hover:underline"
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
