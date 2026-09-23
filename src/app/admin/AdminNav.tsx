"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  ShoppingBag,
  ArrowRightLeft,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

export default function AdminNav({ user }: { user: { name?: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If on login page, don't render navigation bar contents
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
      window.location.href = "/admin/login";
    }
  };

  const navItems = [
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
      active: pathname.startsWith("/admin/products"),
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      active: pathname.startsWith("/admin/orders"),
    },
    {
      label: "Exchanges",
      href: "/admin/exchanges",
      icon: ArrowRightLeft,
      active: pathname.startsWith("/admin/exchanges"),
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 sm:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-all rounded-sm ${
                item.active
                  ? "bg-[#6D1A2A] text-white shadow-sm"
                  : "text-[#4A3E37] hover:bg-[#F3EBE1] hover:text-[#171717]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="h-4 w-[1px] bg-[#EBD9C8] mx-2" />

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider text-[#855D25] hover:text-[#6D1A2A] hover:bg-[#F3EBE1] font-medium transition-colors rounded-sm"
        >
          <span>View Website</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider text-[#A24857] hover:text-[#6D1A2A] hover:bg-red-50 font-medium transition-colors rounded-sm ml-1 disabled:opacity-50"
          title="Sign Out"
        >
          {isLoggingOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
          <span>Logout</span>
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#4A3E37] hover:bg-[#F3EBE1] rounded-sm focus:outline-none"
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#EBD9C8] p-4 shadow-lg z-50 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs uppercase tracking-wider font-medium rounded-sm ${
                  item.active
                    ? "bg-[#6D1A2A] text-white"
                    : "text-[#4A3E37] hover:bg-[#F3EBE1]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="h-[1px] bg-[#EBD9C8] my-1" />

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wider text-[#855D25] hover:bg-[#F3EBE1] font-medium rounded-sm"
          >
            <span>View Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider text-red-700 hover:bg-red-50 font-medium rounded-sm disabled:opacity-50 text-left"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>Logout</span>
          </button>
        </div>
      )}
    </>
  );
}
