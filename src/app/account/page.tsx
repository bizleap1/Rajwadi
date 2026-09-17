"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ArrowRight,
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useWishlist } from "@/context/WishlistContext";
import { REAL_POSHAKS } from "@/data/products";
import AuthModal from "@/components/AuthModal";

type AccountTab = "orders" | "addresses" | "profile";

function AccountPageContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as AccountTab) || "orders";

  const {
    user,
    isAuthenticated,
    logout,
    addresses,
    saveAddress,
    deleteAddress,
    updateProfile,
    loginWithGoogle,
  } = useAuth();
  const { orders } = useOrders();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  // New Address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
  });

  // Display orders (use real placed orders, or display the authentic demo order #RW1024 if empty)
  const displayOrders = useMemo(() => {
    if (orders.length > 0) return orders;

    // Default demonstration order matching user prompt
    const demoProduct =
      REAL_POSHAKS.find((p) => p.name.includes("Gulabi Mor")) ||
      REAL_POSHAKS[0];

    return [
      {
        orderId: "RW1024",
        itemCount: 1,
        subtotal: 28500,
        shipping: 0,
        total: 28500,
        paymentMethod: "Razorpay Secure",
        paymentStatus: "PAID" as const,
        orderStatus: "CONFIRMED" as const,
        createdAt: "2026-09-12T10:30:00.000Z",
        estimatedDelivery: {
          from: "18 Sep",
          to: "21 Sep 2026",
          rangeString: "18 Sep – 21 Sep 2026",
        },
        deliveryAddress: {
          fullName: user?.name || "Prerna Sharma",
          mobile: "9876543210",
          phone: "9876543210",
          email: user?.email || "prerna.sharma@gmail.com",
          address: "42 Heritage Boulevard, Civil Lines",
          city: "Nagpur",
          state: "Maharashtra",
          pincode: "4400XX",
        },
        items: [
          {
            product: demoProduct,
            size: "Stitched",
            quantity: 1,
          },
        ],
      },
    ];
  }, [orders, user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
      });
      setIsSavingProfile(false);
      setProfileSavedSuccess(true);
      setTimeout(() => setProfileSavedSuccess(false), 3000);
    }, 400);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.address.trim() || !newAddr.city.trim() || !newAddr.pincode.trim()) {
      return;
    }
    saveAddress({
      name: newAddr.name.trim() || user?.name || "Home",
      phone: newAddr.phone.trim() || user?.phone || "",
      address: newAddr.address.trim(),
      city: newAddr.city.trim(),
      state: newAddr.state.trim(),
      pincode: newAddr.pincode.trim(),
      isDefault: addresses.length === 0,
    });
    setIsAddingAddress(false);
    setNewAddr({
      name: user?.name || "",
      phone: user?.phone || "",
      address: "",
      city: "",
      state: "Rajasthan",
      pincode: "",
    });
  };

  // LOGGED OUT VIEW
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 sm:py-20 px-4 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal tracking-wide uppercase mb-2">
          MY ACCOUNT
        </h1>
        <p className="font-serif italic text-xs sm:text-sm text-[#6B635B] mb-8">
          Sign in to manage your orders, wishlist and saved details.
        </p>

        <div className="space-y-3 bg-[#FAF5EE] border border-[#E6DCB8] p-6 sm:p-8">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-3.5 px-4 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span>CONTINUE WITH GOOGLE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <span className="font-serif italic text-xs text-[#8C827A] block py-1">
            or
          </span>

          <button
            type="button"
            onClick={() => {
              setAuthModalMode("signin");
              setAuthModalOpen(true);
            }}
            className="w-full py-3 px-4 bg-white hover:bg-[#FAF6F0] text-[#171717] border border-[#D8CCB8] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors cursor-pointer"
          >
            SIGN IN WITH EMAIL
          </button>

          <div className="pt-4 mt-4 border-t border-[#E6DCB8] text-xs font-sans">
            <span className="text-[#8C827A] block mb-1">New to Rajwadi?</span>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode("signup");
                setAuthModalOpen(true);
              }}
              className="text-[#5A1F2B] uppercase tracking-wider font-semibold text-xs hover:underline cursor-pointer"
            >
              CREATE ACCOUNT &rarr;
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      </div>
    );
  }

  // LOGGED IN VIEW
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 text-[#171717]">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-4 sm:mb-6 font-sans"
      >
        <Link
          href="/"
          className="hover:text-[#5A1F2B] transition-colors duration-200"
        >
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
        <span className="text-[#5A1F2B] font-semibold">My Account</span>
      </nav>

      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-[#E6DCB8] mb-8">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block mb-1">
            ROYAL PATRON DASHBOARD
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal tracking-wide uppercase">
            MY ACCOUNT
          </h1>
          <p className="font-serif italic text-xs sm:text-sm text-[#6B635B] mt-1">
            Hello, {user?.name || "Patron"}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#5A1F2B] hover:text-[#431520] transition-colors self-start cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>LOG OUT</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E6DCB8] mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "orders"
              ? "border-[#5A1F2B] text-[#5A1F2B] font-semibold"
              : "border-transparent text-[#8C827A] hover:text-[#171717]"
          }`}
        >
          MY ORDERS ({displayOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("addresses")}
          className={`pb-3 px-4 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "addresses"
              ? "border-[#5A1F2B] text-[#5A1F2B] font-semibold"
              : "border-transparent text-[#8C827A] hover:text-[#171717]"
          }`}
        >
          SAVED ADDRESSES ({addresses.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-4 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "profile"
              ? "border-[#5A1F2B] text-[#5A1F2B] font-semibold"
              : "border-transparent text-[#8C827A] hover:text-[#171717]"
          }`}
        >
          ACCOUNT DETAILS
        </button>
      </div>

      {/* ── TAB 1: MY ORDERS ── */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="space-y-5">
            {displayOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              );

              const formattedTotal = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(order.total);

              return (
                <div
                  key={order.orderId}
                  className="bg-[#FAF5EE] border border-[#E6DCB8] p-5 sm:p-6 shadow-2xs text-[#171717]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6DCB8]/60 gap-2 mb-4 font-sans text-xs">
                    <div>
                      <span className="text-[#8C827A] uppercase tracking-wider block text-[10.5px]">
                        ORDER #{order.orderId.replace(/^#/, "")}
                      </span>
                      <span className="text-[#6B635B] block mt-0.5">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#2E5A36]/30 text-[#2E5A36] text-[11px] font-medium font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E5A36]" />
                        <span>Confirmed</span>
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-4 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.size}`}
                        className="flex gap-4 items-center"
                      >
                        <div className="relative w-14 aspect-[3/4] flex-shrink-0 bg-[#F4ECE1] border border-[#E6DCB8]/60 overflow-hidden shadow-2xs">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="60px"
                            style={{
                              objectPosition:
                                item.product.imagePosition || "center 5%",
                            }}
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm sm:text-base text-[#171717] font-normal leading-snug">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-[#855D25] block mt-0.5 font-sans">
                            {item.size} · Qty: {item.quantity}
                          </span>
                          <span className="text-xs font-sans font-medium text-[#171717] block mt-1">
                            {item.product.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer of Order Card */}
                  <div className="pt-4 border-t border-[#E6DCB8]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-xs">
                    <div>
                      <span className="text-[#8C827A] text-[11px] uppercase tracking-wider block">
                        TOTAL
                      </span>
                      <span className="font-serif text-lg text-[#171717] font-normal block">
                        {formattedTotal}
                      </span>
                    </div>

                    <Link
                      href={`/order/${order.orderId.replace(/^#/, "")}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-[11px] uppercase tracking-[0.2em] font-medium transition-colors shadow-xs"
                    >
                      <span>VIEW ORDER</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: SAVED ADDRESSES ── */}
      {activeTab === "addresses" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-[#E6DCB8]">
            <h3 className="font-serif text-lg text-[#171717] font-normal tracking-wide uppercase">
              MANAGE ADDRESSES
            </h3>

            {!isAddingAddress && (
              <button
                type="button"
                onClick={() => setIsAddingAddress(true)}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#5A1F2B] hover:text-[#855D25] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW ADDRESS</span>
              </button>
            )}
          </div>

          {/* Add Address Form */}
          {isAddingAddress && (
            <form
              onSubmit={handleAddAddress}
              className="bg-[#FAF5EE] border border-[#E6DCB8] p-6 space-y-4 font-sans text-xs"
            >
              <h4 className="font-serif text-base uppercase tracking-wide text-[#171717]">
                New Delivery Address
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    required
                    placeholder="Full name"
                    className="w-full px-3 py-2 bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    required
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={newAddr.address}
                  onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  required
                  placeholder="House/Apartment, Area, Landmark"
                  className="w-full px-3 py-2 bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    required
                    placeholder="e.g. Nagpur"
                    className="w-full px-3 py-2 bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    required
                    placeholder="6 digits"
                    maxLength={6}
                    className="w-full px-3 py-2 bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#5A1F2B] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#431520] transition-colors"
                >
                  SAVE ADDRESS
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="py-2.5 px-6 border border-[#D8CCB8] text-[#171717] text-xs uppercase tracking-wider font-medium hover:bg-white transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-5 bg-[#FAF5EE] border border-[#E6DCB8] flex flex-col justify-between font-sans text-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-[#171717]">
                      {addr.name}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] uppercase font-semibold text-[#855D25] tracking-wider px-2 py-0.5 bg-white border border-[#855D25]/30">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[#6B635B] leading-relaxed">{addr.address}</p>
                  <p className="text-[#6B635B] leading-relaxed">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-[#8C827A] mt-2">Phone: {addr.phone}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E6DCB8]/60 flex items-center justify-between">
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="text-[#5A1F2B] hover:text-[#431520] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: ACCOUNT DETAILS ── */}
      {activeTab === "profile" && (
        <div className="max-w-md space-y-6">
          <h3 className="font-serif text-lg text-[#171717] font-normal tracking-wide uppercase pb-3 border-b border-[#E6DCB8]">
            PERSONAL INFORMATION
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block text-[10.5px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
              />
            </div>

            <div>
              <label className="block text-[10.5px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                Email Address (Primary)
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3.5 py-2.5 bg-[#FAF5EE] border border-[#D8CCB8] text-[#8C827A] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#8C827A] block mt-1">
                Linked with Google Authentication.
              </span>
            </div>

            <div>
              <label className="block text-[10.5px] uppercase tracking-wider text-[#8C827A] font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
              />
            </div>

            {profileSavedSuccess && (
              <p className="text-[11px] text-[#2E5A36] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Personal details updated successfully.</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isSavingProfile}
              className="py-3 px-7 bg-[#5A1F2B] hover:bg-[#431520] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-75"
            >
              <span>{isSavingProfile ? "SAVING..." : "SAVE CHANGES"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#FAF6F0]">
      <Navbar solidOnTop={true} />
      <main className="flex-1 w-full pt-[72px] sm:pt-20 pb-20">
        <Suspense
          fallback={
            <div className="py-20 text-center font-sans text-xs text-[#8C827A]">
              Loading account...
            </div>
          }
        >
          <AccountPageContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
