"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.error) {
        setError(res.error.message || "Invalid credentials. Please verify your email and password.");
        setIsLoading(false);
        return;
      }

      // Check admin status on server
      const checkRes = await fetch("/api/admin/products?limit=1");
      if (checkRes.status === 401 || checkRes.status === 403) {
        setError("Access denied. This account does not have owner/admin privileges.");
        setIsLoading(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Admin login error:", err);
      setError(err.message || "An unexpected error occurred during login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#6D1A2A] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block transition-opacity hover:opacity-85">
          <Image
            src="/logo without bg.png"
            alt="Rajwadi"
            width={160}
            height={55}
            className="h-12 w-auto mx-auto object-contain brightness-90"
            priority
          />
        </Link>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="h-[1px] w-6 bg-[#855D25]" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#855D25] font-medium">
            ATELIER OWNER PORTAL
          </span>
          <span className="h-[1px] w-6 bg-[#855D25]" />
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-serif text-[#171717] tracking-tight">
          Admin Authentication
        </h2>
        <p className="mt-2 text-xs text-[#6B5E55]">
          Secure administrative access for Rajwadi catalog & orders
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-10 shadow-sm border border-[#EBD9C8] rounded-sm">
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 rounded-sm">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1.5"
              >
                Owner Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#855D25]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@rajwadi.com"
                  className="block w-full pl-9 pr-3 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-[#171717] text-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] focus:border-[#855D25] placeholder:text-[#A09285]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1.5"
              >
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#855D25]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-[#171717] text-sm focus:outline-none focus:ring-1 focus:ring-[#855D25] focus:border-[#855D25] placeholder:text-[#A09285]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-[0.15em] font-medium transition-colors shadow-sm disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#F0E5D8] flex items-center justify-between text-xs text-[#8A796B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
              Encrypted Session
            </span>
            <Link
              href="/"
              className="text-[#6D1A2A] hover:underline font-medium"
            >
              Return to Website
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-[#A09285]">
          New admin accounts can be bootstrapped via <code className="bg-[#EFE8DD] px-1 py-0.5 rounded text-[#4A3E37]">npm run bootstrap:admin</code>.
        </p>
      </div>
    </div>
  );
}
