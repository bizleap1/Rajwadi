"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
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
  Loader2,
  ShoppingBag,
  Scissors,
  Download,
  Truck,
  Sparkles,
  XCircle,
  Clock,
  ArrowRightLeft,
  FileText,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import AuthModal from "@/components/AuthModal";
import CancelOrderModal from "@/components/CancelOrderModal";
import { downloadReceipt } from "@/lib/receiptGenerator";

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
    isLoading: authLoading,
    openAuthModal,
  } = useAuth();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");

  // Orders from real database API
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState<any | null>(null);

  // Profile Form state
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  // New Address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
  });

  const fetchCustomerOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setIsOrdersLoading(false);
      return;
    }

    setIsOrdersLoading(true);
    try {
      const res = await fetch("/api/account/orders", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.warn("Could not fetch customer orders:", err);
    } finally {
      setIsOrdersLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCustomerOrders();
  }, [fetchCustomerOrders]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone(user.phone || "");
      setNewAddr((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
      });
      setProfileSavedSuccess(true);
      setTimeout(() => setProfileSavedSuccess(false), 3000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.address || !newAddr.city || !newAddr.pincode) {
      alert("Please fill in all address fields.");
      return;
    }

    await saveAddress({
      name: newAddr.name.trim(),
      phone: newAddr.phone.trim(),
      address: newAddr.address.trim(),
      city: newAddr.city.trim(),
      state: newAddr.state,
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6D1A2A]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between text-[#171717]">
        <Navbar solidOnTop={true} />
        <main className="pt-32 pb-20 max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto bg-[#F8F1E7] border border-[#EBD9C8] rounded-full flex items-center justify-center text-[#855D25] mb-5 shadow-2xs">
            <User className="w-8 h-8 stroke-[1.5]" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#855D25] font-semibold block mb-1">
            PATRON SERVICES
          </span>
          <h1 className="text-3xl font-serif text-[#171717]">Patron Sign In</h1>
          <p className="text-xs text-[#6B5E55] mt-2 mb-6 font-serif italic max-w-sm mx-auto leading-relaxed">
            Please sign in with your mobile number or email to view your order history, delivery addresses, and bespoke poshak details.
          </p>

          {/* Action Buttons: Sign In / Create Account */}
          <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-xs space-y-3 mb-6">
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              className="w-full py-3 px-4 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-[0.16em] font-medium rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Sign In with Mobile / Email</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => openAuthModal("signup")}
              className="w-full py-2.5 px-4 bg-[#FAF5EE] hover:bg-[#F3EBE1] border border-[#D9C4B0] text-[#171717] text-xs uppercase tracking-[0.16em] font-medium rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create New Account</span>
            </button>
          </div>

          {/* Guest Order Lookup Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EBD9C8]"></div>
            </div>
            <span className="relative bg-[#FDFBF7] px-3 text-[11px] uppercase tracking-wider text-[#8A796B]">
              Or Track Guest Order
            </span>
          </div>

          {/* Direct Order Lookup Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.currentTarget.elements.namedItem("orderId") as HTMLInputElement;
              if (target?.value?.trim()) {
                window.location.href = `/order/${encodeURIComponent(target.value.trim().toUpperCase())}`;
              }
            }}
            className="bg-white p-4 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-2.5 text-left mb-6"
          >
            <label className="text-[11px] uppercase tracking-wider text-[#855D25] font-semibold block">
              Order Number (e.g. RW1024)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="orderId"
                required
                placeholder="RW..."
                className="flex-1 bg-[#FAF5EE] border border-[#D8CCB8] focus:border-[#855D25] px-3.5 py-2 text-xs uppercase tracking-wider text-[#171717] outline-none rounded-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#5A1F2B] hover:bg-[#431520] text-white text-xs uppercase tracking-widest font-medium rounded-xs transition-colors cursor-pointer"
              >
                Track &rarr;
              </button>
            </div>
          </form>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-3 text-xs font-sans">
            <Link
              href="/wishlist"
              className="p-3 bg-white border border-[#EBD9C8] hover:border-[#855D25] rounded-xs text-center transition-colors block"
            >
              <Heart className="w-4 h-4 text-[#855D25] mx-auto mb-1" />
              <span className="font-semibold uppercase tracking-wider block text-[11px]">Wishlist</span>
              <span className="text-[10px] text-[#8C827A]">Saved pieces</span>
            </Link>
            <Link
              href="/cart"
              className="p-3 bg-white border border-[#EBD9C8] hover:border-[#855D25] rounded-xs text-center transition-colors block"
            >
              <ShoppingBag className="w-4 h-4 text-[#855D25] mx-auto mb-1" />
              <span className="font-semibold uppercase tracking-wider block text-[11px]">Shopping Bag</span>
              <span className="text-[10px] text-[#8C827A]">Ready to checkout</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#171717] font-sans selection:bg-[#6D1A2A] selection:text-white flex flex-col justify-between">
      <Navbar solidOnTop={true} />

      <main className="pt-24 sm:pt-28 md:pt-32 pb-16 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 border border-[#EBD9C8] rounded-sm shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-5 bg-[#855D25]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
                PATRON ACCOUNT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#171717] mt-1">
              Welcome, {user?.name || "Patron"}
            </h1>
            <p className="text-xs text-[#6B5E55] mt-0.5 font-mono">{user?.email}</p>
          </div>

          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#D9C4B0] hover:bg-red-50 hover:text-red-700 text-xs uppercase tracking-wider font-medium text-[#4A3E37] transition-colors rounded-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#EBD9C8] gap-4 sm:gap-8 mb-8 text-xs uppercase tracking-wider font-medium">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "border-[#6D1A2A] text-[#6D1A2A] font-semibold"
                : "border-transparent text-[#8A796B] hover:text-[#171717]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "addresses"
                ? "border-[#6D1A2A] text-[#6D1A2A] font-semibold"
                : "border-transparent text-[#8A796B] hover:text-[#171717]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "profile"
                ? "border-[#6D1A2A] text-[#6D1A2A] font-semibold"
                : "border-transparent text-[#8A796B] hover:text-[#171717]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {isOrdersLoading ? (
              <div className="py-20 bg-white border border-[#EBD9C8] rounded-sm flex flex-col items-center justify-center text-[#8A796B]">
                <Loader2 className="w-7 h-7 animate-spin text-[#6D1A2A] mb-2" />
                <p className="text-xs uppercase tracking-wider">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-[#EBD9C8] rounded-sm py-16 text-center px-4">
                <div className="w-12 h-12 mx-auto bg-[#F8F1E7] rounded-full flex items-center justify-center text-[#855D25] mb-3">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base text-[#171717]">No Orders Placed Yet</h3>
                <p className="text-xs text-[#6B5E55] max-w-sm mx-auto mt-1 mb-5">
                  Your placed orders with payment verification and tracking details will appear here.
                </p>
                <Link
                  href="/collection"
                  className="inline-block px-5 py-2.5 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#581522] rounded-sm"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isDelivered = order.fulfilmentStatus === "DELIVERED";
                  const isDispatched = order.fulfilmentStatus === "DISPATCHED";
                  const isInAtelier = order.fulfilmentStatus === "IN_ATELIER" || order.fulfilmentStatus === "READY_TO_DISPATCH";
                  const isCancelled = order.fulfilmentStatus === "CANCELLED";

                  const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });

                  const fallbackDeliveryDate = new Date(order.createdAt);
                  fallbackDeliveryDate.setDate(fallbackDeliveryDate.getDate() + 7);
                  const deliveryDateStr = (order.estimatedDeliveryDate
                    ? new Date(order.estimatedDeliveryDate)
                    : fallbackDeliveryDate
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  const activeExchange =
                    order.exchangeRequests && order.exchangeRequests.length > 0
                      ? order.exchangeRequests[0]
                      : null;

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-[#EBD9C8] rounded-sm p-5 sm:p-6 shadow-2xs space-y-4 transition-all hover:border-[#855D25]/40"
                    >
                      {/* Top Bar: Order ID, Date, Badges & Actions */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3.5 border-b border-[#F0E5D8]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] font-semibold">
                              ORDER RECEIPT
                            </span>
                            <span className="text-xs text-[#8A796B]">Placed {dateStr}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-[#171717] text-base tracking-tight">
                              #{order.orderNumber}
                            </span>
                            <span className="text-sm font-semibold text-[#6D1A2A] font-serif ml-1">
                              {order.totalFormatted}
                            </span>
                          </div>
                        </div>

                        {/* Status Pills & Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 text-[10.5px] uppercase tracking-wider font-semibold rounded border ${
                              order.paymentStatus === "PAID"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : order.paymentStatus === "VERIFICATION_PENDING"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-red-50 text-red-800 border-red-200"
                            }`}
                          >
                            {order.paymentStatus.replace(/_/g, " ")}
                          </span>

                          {isDelivered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10.5px] uppercase tracking-wider font-semibold rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Delivered</span>
                            </span>
                          ) : isDispatched ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10.5px] uppercase tracking-wider font-semibold rounded bg-amber-50 text-amber-900 border border-amber-300">
                              <Truck className="w-3 h-3 text-[#855D25]" />
                              <span>Dispatched</span>
                            </span>
                          ) : isInAtelier ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10.5px] uppercase tracking-wider font-medium rounded bg-[#F3EBE1] text-[#6D1A2A] border border-[#EBD9C8]">
                              <Scissors className="w-3 h-3" />
                              <span>In Atelier</span>
                            </span>
                          ) : isCancelled ? (
                            <span className="px-2.5 py-0.5 text-[10.5px] uppercase tracking-wider font-semibold rounded bg-red-50 text-red-800 border border-red-200">
                              Cancelled
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 text-[10.5px] uppercase tracking-wider font-medium rounded bg-[#F3EBE1] text-[#4A3E37]">
                              {(order.fulfilmentStatus || "CONFIRMED").replace(/_/g, " ")}
                            </span>
                          )}

                          {activeExchange && (
                            <span
                              className={`px-2.5 py-0.5 text-[10.5px] uppercase tracking-wider font-semibold rounded border ${
                                activeExchange.status === "REJECTED"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : activeExchange.status === "COMPLETED" || activeExchange.status === "APPROVED"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              ⇄ Exchange: {activeExchange.status.replace(/_/g, " ")}
                            </span>
                          )}

                          {/* Cancel Order (before dispatch) */}
                          {order.fulfilmentStatus === "PENDING" && order.paymentStatus !== "CANCELLED" && (
                            <button
                              type="button"
                              onClick={() => setCancellingOrder(order)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-2xs"
                              title="Cancel Order"
                            >
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              <span>Cancel</span>
                            </button>
                          )}

                          {/* Download Invoice Button */}
                          <button
                            type="button"
                            onClick={() => downloadReceipt(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#855D25] hover:text-[#6D1A2A] border border-[#EBD9C8] rounded text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ml-1"
                            title="Download Tax Invoice"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>

                          {/* Track / Details Button */}
                          <Link
                            href={`/order/${order.id}`}
                            className="inline-flex items-center gap-1 text-xs bg-[#6D1A2A] hover:bg-[#581522] text-white px-3 py-1 rounded font-medium transition-colors cursor-pointer"
                          >
                            <span>{isDelivered ? "Details & Exchange" : "Track Order"}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Delivery Status Banner */}
                      {isDelivered ? (
                        <div className="text-xs text-emerald-900 bg-emerald-50/90 p-3 rounded border border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                          <span className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                            <span>
                              Delivered successfully on <strong>{deliveryDateStr}</strong>
                            </span>
                          </span>
                          {order.courierPartner && (
                            <span className="text-emerald-800 text-[11px]">
                              Handed over via {order.courierPartner} {order.trackingNumber ? `(AWB: ${order.trackingNumber})` : ""}
                            </span>
                          )}
                        </div>
                      ) : isDispatched ? (
                        <div className="text-xs text-[#855D25] bg-[#FAF5EE] p-3 rounded border border-[#EBD9C8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                          <span className="flex items-center gap-2 font-medium">
                            <Truck className="w-4 h-4 text-[#855D25] flex-shrink-0" />
                            <span>
                              In Transit &bull; Arriving by <strong>{deliveryDateStr}</strong>
                            </span>
                          </span>
                          {order.courierPartner && (
                            <span className="text-[#6B5E55] text-[11px]">
                              Courier: {order.courierPartner} {order.trackingNumber ? `(${order.trackingNumber})` : ""}
                            </span>
                          )}
                        </div>
                      ) : isInAtelier ? (
                        <div className="text-xs text-[#855D25] bg-[#FAF5EE] p-3 rounded border border-[#EBD9C8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                          <span className="flex items-center gap-2 font-medium">
                            <Scissors className="w-4 h-4 text-[#855D25] flex-shrink-0" />
                            <span>
                              In Atelier &bull; Handcrafted embroidery in progress. Expected Delivery:{" "}
                              <strong>{deliveryDateStr}</strong>
                            </span>
                          </span>
                        </div>
                      ) : isCancelled ? (
                        <div className="text-xs text-red-800 bg-red-50 p-2.5 rounded border border-red-200 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-medium">
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span>Order Cancelled</span>
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-[#855D25] bg-[#FAF5EE] p-3 rounded border border-[#EBD9C8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                          <span className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#855D25] flex-shrink-0" />
                            <span>
                              Order Confirmed &bull; Preparing for Atelier. Expected Delivery:{" "}
                              <strong>{deliveryDateStr}</strong>
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Purchased Ensemble Pieces */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex gap-3 items-center bg-[#FCFAF6] p-2.5 rounded border border-[#F0E5D8]">
                            <div className="w-12 h-14 bg-[#F3EBE1] relative rounded overflow-hidden flex-shrink-0 border border-[#EBD9C8]">
                              <Image
                                src={item.imageUrl || "/placeholder.webp"}
                                alt={item.productName}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="text-xs min-w-0 flex-1">
                              <h4 className="font-serif text-[#171717] truncate font-medium text-xs">
                                {item.productName}
                              </h4>
                              <p className="text-[11px] text-[#8A796B] mt-0.5">
                                Qty: {item.quantity} {item.stitchingSelected ? "• Bespoke Tailored" : "• Traditional Fabric Set"}
                              </p>
                              <p className="text-[11px] font-semibold text-[#855D25] mt-0.5">
                                {item.unitPriceFormatted || item.totalFormatted}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-[#171717]">Delivery Addresses</h2>
              {!isAddingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#581522] rounded-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {isAddingAddress && (
              <form onSubmit={handleSaveNewAddress} className="bg-white p-6 border border-[#EBD9C8] rounded-sm space-y-4">
                <h3 className="font-serif text-sm text-[#171717] pb-2 border-b border-[#F0E5D8]">
                  New Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddr.address}
                    onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 border border-[#D9C4B0] text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-medium cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white p-5 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-2 relative"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-serif font-medium text-sm text-[#171717]">
                      {addr.name}
                    </span>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-[#8A796B] hover:text-red-700 p-1 cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#4A3E37] leading-relaxed">
                    {addr.address}
                    <br />
                    {addr.city}, {addr.state} - {addr.pincode}
                    <br />
                    Phone: {addr.phone}
                  </p>
                  {addr.isDefault && (
                    <span className="inline-block mt-2 text-[9.5px] uppercase tracking-wider bg-[#F3EBE1] text-[#855D25] px-2 py-0.5 rounded font-medium">
                      Default Address
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === "profile" && (
          <div className="max-w-xl bg-white p-6 sm:p-8 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-5">
            <h2 className="font-serif text-lg text-[#171717] pb-2 border-b border-[#F0E5D8]">
              Personal Information
            </h2>

            {profileSavedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 rounded-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-3.5 py-2.5 bg-[#F3EBE1]/60 border border-[#D9C4B0] text-xs text-[#8A796B] rounded-sm cursor-not-allowed"
                />
                <span className="text-[10px] text-[#8A796B] mt-0.5 block">
                  Email is locked to your authenticated session.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-medium shadow-sm transition-colors rounded-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSavingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Cancel Order Modal */}
      {cancellingOrder && (
        <CancelOrderModal
          isOpen={Boolean(cancellingOrder)}
          onClose={() => setCancellingOrder(null)}
          orderId={cancellingOrder.id}
          orderNumber={cancellingOrder.orderNumber}
          onSuccess={() => {
            fetchCustomerOrders();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6D1A2A]" />
        </div>
      }
    >
      <AccountPageContent />
    </Suspense>
  );
}
