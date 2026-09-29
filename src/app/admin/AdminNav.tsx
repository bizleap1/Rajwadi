"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Loader2,
  MoreHorizontal,
  Store,
  UserCheck,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

export default function AdminNav({ user }: { user?: { name?: string; email?: string } } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

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
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      active: pathname.startsWith("/admin/orders"),
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
      active: pathname.startsWith("/admin/products"),
    },
    {
      label: "Discounts",
      href: "/admin/discounts",
      icon: Tag,
      active: pathname.startsWith("/admin/discounts"),
    },
  ];

  return (
    <>
      {/* ── DESKTOP NAVIGATION (Hidden on mobile) ── */}
      <nav className="hidden md:flex items-center gap-1 sm:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-all rounded-sm ${
                item.active
                  ? "bg-[#6D1A2A] text-white shadow-xs"
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
          className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider text-[#A24857] hover:text-[#6D1A2A] hover:bg-red-50 font-medium transition-colors rounded-sm ml-1 disabled:opacity-50 cursor-pointer"
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

      {/* ── TOP RIGHT QUICK ACTIONS ON MOBILE (Live site + Menu) ── */}
      <div className="md:hidden flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-[#855D25] hover:bg-[#F3EBE1] rounded-full transition-colors flex items-center gap-1 text-xs font-medium"
          title="View Live Store"
        >
          <Store className="w-4 h-4" />
          <span className="text-[10.5px] font-semibold uppercase tracking-wider">Store</span>
        </Link>
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className="p-2 text-[#4A3E37] hover:bg-[#F3EBE1] rounded-full transition-colors"
          aria-label="Open menu"
        >
          <MoreHorizontal className="w-5 h-5 text-[#6D1A2A]" />
        </button>
      </div>

      {/* ── MOBILE BOTTOM STICKY NAVIGATION BAR (Fixed at bottom) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EBD9C8] px-2 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md transition-colors ${
                  item.active
                    ? "text-[#6D1A2A] font-bold"
                    : "text-[#8A796B] hover:text-[#171717]"
                }`}
              >
                <div
                  className={`p-1 rounded-full transition-all ${
                    item.active ? "bg-[#6D1A2A]/10" : ""
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? "stroke-[2.5]" : ""}`} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              </Link>
            );
          })}

          {/* 5th Tab: More / Account */}
          <button
            type="button"
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md transition-colors ${
              isMoreMenuOpen ? "text-[#6D1A2A] font-bold" : "text-[#8A796B] hover:text-[#171717]"
            }`}
          >
            <div className="p-1 rounded-full">
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">More</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE SLIDE-UP DRAWER / SHEET ── */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMoreMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative bg-white rounded-t-2xl border-t border-[#EBD9C8] p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Drawer Handle */}
            <div className="w-10 h-1 bg-[#D9C4B0] rounded-full mx-auto mb-2" />

            <div className="flex items-center justify-between pb-3 border-b border-[#F0E5D8]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#6D1A2A]/10 flex items-center justify-center text-[#6D1A2A]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#171717]">
                    {user?.name || "Atelier Owner"}
                  </h4>
                  <p className="text-[11px] text-[#8A796B] font-mono truncate max-w-[200px]">
                    {user?.email || "admin@rajwadi.com"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 text-[#8A796B] hover:bg-[#F3EBE1] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions in Drawer */}
            <div className="space-y-1.5">
              <Link
                href="/admin"
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FCFAF6] hover:bg-[#F3EBE1] text-xs font-semibold text-[#171717] border border-[#EBD9C8]/60"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-[#855D25]" />
                  <span>Dashboard Overview</span>
                </div>
              </Link>

              <Link
                href="/admin/orders"
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FCFAF6] hover:bg-[#F3EBE1] text-xs font-semibold text-[#171717] border border-[#EBD9C8]/60"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#855D25]" />
                  <span>Orders &amp; Shipments</span>
                </div>
              </Link>

              <Link
                href="/admin/products"
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FCFAF6] hover:bg-[#F3EBE1] text-xs font-semibold text-[#171717] border border-[#EBD9C8]/60"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#855D25]" />
                  <span>Product Catalog</span>
                </div>
              </Link>

              <Link
                href="/admin/discounts"
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FCFAF6] hover:bg-[#F3EBE1] text-xs font-semibold text-[#171717] border border-[#EBD9C8]/60"
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-[#855D25]" />
                  <span>Discount Vouchers</span>
                </div>
              </Link>

              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FAF5EE] hover:bg-[#F3EBE1] text-xs font-semibold text-[#855D25] border border-[#855D25]/30"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-[#855D25]" />
                  <span>Visit Customer Storefront</span>
                </div>
              </Link>
            </div>

            {/* Sign Out Button */}
            <div className="pt-2 border-t border-[#F0E5D8]">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-700" />
                ) : (
                  <LogOut className="w-4 h-4 text-red-700" />
                )}
                <span>Sign Out from Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
