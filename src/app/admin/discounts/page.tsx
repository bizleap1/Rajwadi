"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Tag,
  Plus,
  Percent,
  IndianRupee,
  Truck,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  ShoppingBag,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

interface CouponItem {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number;
  maxDiscountInPaise: number | null;
  minOrderValueInPaise: number;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { orders: number };
}

interface StatsSummary {
  totalCoupons: number;
  activeCoupons: number;
  totalRedemptions: number;
  totalDiscountGivenInPaise: number;
}

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [stats, setStats] = useState<StatsSummary>({
    totalCoupons: 0,
    activeCoupons: 0,
    totalRedemptions: 0,
    totalDiscountGivenInPaise: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [formError, setFormError] = useState("");

  // Deletion modal
  const [deletingCoupon, setDeletingCoupon] = useState<CouponItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
    discountValue: 10,
    maxDiscountInRupees: "",
    minOrderValueInRupees: "0",
    usageLimit: "",
    perUserLimit: "1",
    hasEndDate: true,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    isActive: true,
  });

  // Fetch Discounts
  const fetchDiscounts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        type: typeFilter,
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`/api/admin/discounts?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to load discounts.");
      }

      const data = await res.json();
      setCoupons(data.coupons || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load discounts.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, typeFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDiscounts();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchDiscounts]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async (coupon: CouponItem) => {
    try {
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
      );

      const res = await fetch(`/api/admin/discounts/${coupon.id}/toggle`, {
        method: "PATCH",
      });

      if (!res.ok) {
        fetchDiscounts();
      } else {
        const data = await res.json();
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, isActive: data.isActive } : c))
        );
      }
    } catch (err) {
      fetchDiscounts();
    }
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormError("");
    setFormData({
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 10,
      maxDiscountInRupees: "",
      minOrderValueInRupees: "0",
      usageLimit: "",
      perUserLimit: "1",
      hasEndDate: true,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setFormError("");

    let discountValue = coupon.discountValue;
    if (coupon.discountType === "FIXED_AMOUNT") {
      discountValue = coupon.discountValue / 100;
    }

    const maxDiscountInRupees = coupon.maxDiscountInPaise
      ? (coupon.maxDiscountInPaise / 100).toString()
      : "";

    const minOrderValueInRupees = (coupon.minOrderValueInPaise / 100).toString();

    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue,
      maxDiscountInRupees,
      minOrderValueInRupees,
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : "",
      perUserLimit: coupon.perUserLimit ? coupon.perUserLimit.toString() : "1",
      hasEndDate: Boolean(coupon.endDate),
      startDate: coupon.startDate
        ? new Date(coupon.startDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      endDate: coupon.endDate
        ? new Date(coupon.endDate).toISOString().slice(0, 10)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      isActive: coupon.isActive,
    });

    setIsModalOpen(true);
  };

  const handleGenerateCode = () => {
    const prefixes = ["ROYAL", "FESTIVE", "RAJPUTI", "SPECIAL", "VIP"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const val = formData.discountValue || 15;
    const code = `${prefix}${val}`;
    setFormData((prev) => ({ ...prev, code }));
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.code.trim()) {
      setFormError("Coupon code is required");
      return;
    }

    if (
      formData.discountType === "PERCENTAGE" &&
      (formData.discountValue <= 0 || formData.discountValue > 100)
    ) {
      setFormError("Percentage discount must be between 1% and 100%");
      return;
    }

    if (formData.discountType === "FIXED_AMOUNT" && formData.discountValue <= 0) {
      setFormError("Flat discount amount must be greater than ₹0");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim() || undefined,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        maxDiscountInRupees: formData.maxDiscountInRupees
          ? Number(formData.maxDiscountInRupees)
          : undefined,
        minOrderValueInRupees: formData.minOrderValueInRupees
          ? Number(formData.minOrderValueInRupees)
          : 0,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : 1,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate:
          formData.hasEndDate && formData.endDate
            ? new Date(formData.endDate).toISOString()
            : undefined,
        isActive: formData.isActive,
        applicableScope: "ALL",
      };

      const url = editingCoupon
        ? `/api/admin/discounts/${editingCoupon.id}`
        : "/api/admin/discounts";
      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save discount offer.");
      }

      setIsModalOpen(false);
      fetchDiscounts();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Failed to save coupon.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deletingCoupon) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/discounts/${deletingCoupon.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete coupon.");
      }
      setDeletingCoupon(null);
      fetchDiscounts();
    } catch (err: any) {
      alert(err.message || "Could not delete coupon.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSeedStarters = async () => {
    try {
      const starters = [
        {
          code: "ROYAL10",
          description: "Exclusive 10% Royal Heritage discount for our patrons",
          discountType: "PERCENTAGE",
          discountValue: 10,
          maxDiscountInRupees: 1500,
          minOrderValueInRupees: 3000,
          perUserLimit: 1,
          applicableScope: "ALL",
        },
        {
          code: "WELCOME500",
          description: "Flat ₹500 off on your royal poshak purchase",
          discountType: "FIXED_AMOUNT",
          discountValue: 500,
          minOrderValueInRupees: 2500,
          perUserLimit: 1,
          applicableScope: "ALL",
        },
      ];

      for (const st of starters) {
        await fetch("/api/admin/discounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(st),
        });
      }
      fetchDiscounts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EBD9C8]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold block">
            ROYAL COMMERCE ENGINE
          </span>
          <h1 className="text-2xl font-serif text-[#171717] mt-0.5">
            Discount & Coupon Management
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1">
            Create promotional discount codes and storewide checkout vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {coupons.length === 0 && !isLoading && (
            <button
              onClick={handleSeedStarters}
              className="px-3.5 py-2 bg-white border border-[#855D25]/40 text-[#855D25] hover:bg-[#855D25]/10 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Starter Royal Offers</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#6D1A2A] hover:bg-[#551320] text-white text-xs uppercase tracking-wider font-semibold shadow-xs rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discount Offer</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white border border-[#EBD9C8] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#855D25] mb-2">
            <span className="text-[10.5px] uppercase tracking-wider font-semibold">
              Active Offers
            </span>
            <Tag className="w-4 h-4" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#171717]">
            {stats.activeCoupons}
          </div>
          <span className="text-[11px] text-[#8A796B] mt-0.5 block">
            {stats.totalCoupons} total coupons configured
          </span>
        </div>

        <div className="p-4 bg-white border border-[#EBD9C8] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#855D25] mb-2">
            <span className="text-[10.5px] uppercase tracking-wider font-semibold">
              Total Redemptions
            </span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#171717]">
            {stats.totalRedemptions}
          </div>
          <span className="text-[11px] text-[#8A796B] mt-0.5 block">
            Redeemed at checkout
          </span>
        </div>

        <div className="p-4 bg-white border border-[#EBD9C8] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#855D25] mb-2">
            <span className="text-[10.5px] uppercase tracking-wider font-semibold">
              Discount Granted
            </span>
            <IndianRupee className="w-4 h-4" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#6D1A2A]">
            ₹ {(stats.totalDiscountGivenInPaise / 100).toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-[#8A796B] mt-0.5 block">
            Saved by patrons
          </span>
        </div>

        <div className="p-4 bg-white border border-[#EBD9C8] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#855D25] mb-2">
            <span className="text-[10.5px] uppercase tracking-wider font-semibold">
              Conversion Boost
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-800">
            {stats.totalRedemptions > 0 ? "100%" : "Ready"}
          </div>
          <span className="text-[11px] text-[#8A796B] mt-0.5 block">
            Real-time verification active
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 border border-[#EBD9C8] rounded-sm shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A796B]" />
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:outline-none focus:border-[#855D25]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#FCFAF6] border border-[#D9C4B0] rounded-sm p-0.5 text-xs">
            {["ALL", "ACTIVE", "DISABLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 font-medium rounded-xs transition-colors cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#6D1A2A] text-white shadow-2xs"
                    : "text-[#4A3E37] hover:bg-[#EBD9C8]/60"
                }`}
              >
                {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#4A3E37] rounded-sm focus:outline-none focus:border-[#855D25]"
          >
            <option value="ALL">All Types</option>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED_AMOUNT">Flat Rupee (₹)</option>
            <option value="FREE_SHIPPING">Free Shipping</option>
          </select>
        </div>
      </div>

      {/* Coupons List / Grid */}
      {isLoading ? (
        <div className="bg-white border border-[#EBD9C8] rounded-sm p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#6D1A2A] animate-spin" />
          <span className="text-xs uppercase tracking-wider text-[#8A796B]">
            Loading coupons & offers...
          </span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-sm text-center">
          <AlertCircle className="w-6 h-6 mx-auto text-red-600 mb-2" />
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={fetchDiscounts}
            className="mt-3 px-4 py-1.5 bg-red-700 text-white text-xs rounded-sm hover:bg-red-800 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white border border-[#EBD9C8] rounded-sm p-12 text-center">
          <div className="w-14 h-14 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto text-[#855D25] mb-3">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif text-[#171717]">No Discounts Found</h3>
          <p className="text-xs text-[#8A796B] max-w-md mx-auto mt-1 mb-5">
            {search || statusFilter !== "ALL" || typeFilter !== "ALL"
              ? "No coupons matched your filters. Try clearing your search query."
              : "You haven't created any promotional discounts or coupon codes yet."}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#581421] cursor-pointer"
            >
              + Create First Discount
            </button>
            <button
              onClick={handleSeedStarters}
              className="px-4 py-2 bg-[#FAF6F0] border border-[#EBD9C8] text-[#4A3E37] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#EBD9C8] cursor-pointer"
            >
              Add Starter Royal Coupons
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => {
            const isExpired = coupon.endDate && new Date(coupon.endDate) < new Date();
            const isLimitReached =
              coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
            const isScheduled =
              coupon.startDate && new Date(coupon.startDate) > new Date();

            return (
              <div
                key={coupon.id}
                className={`bg-white border transition-all rounded-sm shadow-2xs hover:shadow-md flex flex-col justify-between overflow-hidden relative ${
                  !coupon.isActive || isExpired
                    ? "border-[#EBD9C8] opacity-75 bg-[#FAF8F5]"
                    : "border-[#DCC8B5] hover:border-[#855D25]"
                }`}
              >
                {/* Top Banner */}
                <div className="p-4 sm:p-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {!coupon.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] uppercase tracking-wider font-semibold rounded-xs">
                          Disabled
                        </span>
                      ) : isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] uppercase tracking-wider font-semibold rounded-xs border border-rose-200">
                          Expired
                        </span>
                      ) : isLimitReached ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] uppercase tracking-wider font-semibold rounded-xs border border-amber-200">
                          Limit Reached
                        </span>
                      ) : isScheduled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] uppercase tracking-wider font-semibold rounded-xs border border-blue-200">
                          Scheduled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] uppercase tracking-wider font-semibold rounded-xs border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Active
                        </span>
                      )}
                    </div>

                    {/* Active Switch */}
                    <button
                      onClick={() => handleToggleStatus(coupon)}
                      className="text-[#8A796B] hover:text-[#6D1A2A] transition-colors p-1 cursor-pointer"
                      title={coupon.isActive ? "Deactivate Offer" : "Activate Offer"}
                    >
                      {coupon.isActive ? (
                        <ToggleRight className="w-6 h-6 text-emerald-700" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Coupon Code Pill */}
                  <div className="flex items-center justify-between bg-[#FAF6F0] border-2 border-dashed border-[#DCC8B5] p-2.5 rounded-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#855D25]" />
                      <span className="font-mono font-bold tracking-wider text-sm text-[#171717]">
                        {coupon.code}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="text-xs text-[#855D25] hover:text-[#6D1A2A] font-medium flex items-center gap-1 px-2 py-1 bg-white border border-[#EBD9C8] rounded-xs shadow-2xs cursor-pointer"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-[10px] text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Discount Value Headline */}
                  <div className="mb-2">
                    <div className="text-xl font-serif text-[#6D1A2A] font-bold">
                      {coupon.discountType === "PERCENTAGE" && (
                        <span>{coupon.discountValue}% OFF</span>
                      )}
                      {coupon.discountType === "FIXED_AMOUNT" && (
                        <span>
                          Flat ₹{(coupon.discountValue / 100).toLocaleString("en-IN")} OFF
                        </span>
                      )}
                      {coupon.discountType === "FREE_SHIPPING" && (
                        <span>Free Express Shipping</span>
                      )}
                    </div>
                    {coupon.discountType === "PERCENTAGE" && coupon.maxDiscountInPaise && (
                      <div className="text-[11px] text-[#8A796B]">
                        Capped up to ₹
                        {(coupon.maxDiscountInPaise / 100).toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {coupon.description && (
                    <p className="text-xs text-[#4A3E37] line-clamp-2 mb-3">
                      {coupon.description}
                    </p>
                  )}

                  {/* Conditions List */}
                  <div className="space-y-1 text-[11px] text-[#8A796B] border-t border-[#F3EBE1] pt-2.5">
                    <div className="flex items-center justify-between">
                      <span>Min Order:</span>
                      <span className="font-medium text-[#171717]">
                        {coupon.minOrderValueInPaise > 0
                          ? `₹${(coupon.minOrderValueInPaise / 100).toLocaleString("en-IN")}`
                          : "No minimum"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Per User:</span>
                      <span className="font-medium text-[#171717]">
                        {coupon.perUserLimit}x per customer
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span>Valid Until:</span>
                      <span className="font-medium text-[#171717] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#855D25]" />
                        {coupon.endDate
                          ? new Date(coupon.endDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "No Expiration"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Usage & Actions */}
                <div className="bg-[#FAF6F0] p-3 sm:px-5 sm:py-3 border-t border-[#EBD9C8] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#4A3E37]">
                    <span className="font-semibold text-[#171717]">{coupon.usedCount}</span>
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " used"}
                    {coupon.usageLimit && (
                      <div className="w-20 bg-[#EBD9C8] h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-[#6D1A2A] h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              (coupon.usedCount / coupon.usageLimit) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(coupon)}
                      className="p-1.5 text-[#4A3E37] hover:text-[#6D1A2A] hover:bg-[#EBD9C8] rounded-xs transition-colors cursor-pointer"
                      title="Edit Coupon"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingCoupon(coupon)}
                      className="p-1.5 text-[#A24857] hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= CREATE / EDIT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white border border-[#EBD9C8] rounded-sm max-w-2xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAF6F0] border-b border-[#EBD9C8] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-[#171717] font-semibold">
                  {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create New Discount Offer"}
                </h2>
                <p className="text-xs text-[#8A796B] mt-0.5">
                  Set promo discount amounts, validity, and minimum checkout conditions.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#8A796B] hover:text-[#171717] rounded-sm hover:bg-[#EBD9C8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCoupon} className="flex-1 overflow-y-auto p-6 space-y-5">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Promo Code & Auto Generate */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E37] mb-1">
                  Coupon Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g. FESTIVE20, ROYAL10"
                    className="flex-1 px-3 py-2 border border-[#EBD9C8] text-sm uppercase font-mono font-bold tracking-wider rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="px-3 py-2 bg-[#FAF6F0] border border-[#EBD9C8] text-[#855D25] hover:bg-[#EBD9C8] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto Generate</span>
                  </button>
                </div>
              </div>

              {/* Discount Type Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E37] mb-1.5">
                  Discount Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      type: "PERCENTAGE",
                      label: "Percentage (%)",
                      desc: "e.g. 10% or 20% off",
                      icon: Percent,
                    },
                    {
                      type: "FIXED_AMOUNT",
                      label: "Flat Amount (₹)",
                      desc: "e.g. Flat ₹500 off",
                      icon: IndianRupee,
                    },
                    {
                      type: "FREE_SHIPPING",
                      label: "Free Shipping",
                      desc: "100% delivery waiver",
                      icon: Truck,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = formData.discountType === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            discountType: item.type as any,
                            discountValue:
                              item.type === "PERCENTAGE"
                                ? 10
                                : item.type === "FIXED_AMOUNT"
                                ? 500
                                : 0,
                          })
                        }
                        className={`p-3 text-left border rounded-sm transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "border-[#6D1A2A] bg-[#FAF4F5] shadow-xs"
                            : "border-[#EBD9C8] bg-[#FAF6F0] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Icon
                            className={`w-4 h-4 ${
                              isSelected ? "text-[#6D1A2A]" : "text-[#855D25]"
                            }`}
                          />
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#6D1A2A]" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#171717]">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-[#8A796B]">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discount Value & Max Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.discountType !== "FREE_SHIPPING" && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E37] mb-1">
                      {formData.discountType === "PERCENTAGE"
                        ? "Discount Percentage (%) *"
                        : "Discount Amount (₹) *"}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountValue: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-[#EBD9C8] text-sm rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                    />
                  </div>
                )}

                {formData.discountType === "PERCENTAGE" && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E37] mb-1">
                      Max Discount Cap (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 1500 (leave blank if no cap)"
                      value={formData.maxDiscountInRupees}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDiscountInRupees: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-[#EBD9C8] text-sm rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                    />
                  </div>
                )}
              </div>

              {/* Min Order Value & Per-User Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E37] mb-1">
                    Minimum Order Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderValueInRupees}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderValueInRupees: e.target.value,
                      })
                    }
                    placeholder="0 for no minimum"
                    className="w-full px-3 py-2 border border-[#EBD9C8] text-sm rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                  />
                  <span className="text-[10px] text-[#8A796B]">
                    Coupon only applies if cart meets this subtotal.
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E37] mb-1">
                    Redemption Limit Per Customer
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.perUserLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, perUserLimit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#EBD9C8] text-sm rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                  />
                </div>
              </div>

              {/* Total Usage Limit & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E37] mb-1">
                    Total Global Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Unlimited if empty"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#EBD9C8] text-sm rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E37] mb-1">
                    Internal Campaign Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Heritage Special"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#EBD9C8] text-sm rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                  />
                </div>
              </div>

              {/* Validity Dates */}
              <div className="p-4 bg-[#FAF6F0] border border-[#EBD9C8] rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#4A3E37]">
                    Validity Period
                  </span>
                  <label className="flex items-center gap-2 text-xs text-[#4A3E37] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!formData.hasEndDate}
                      onChange={(e) =>
                        setFormData({ ...formData, hasEndDate: !e.target.checked })
                      }
                      className="rounded-xs text-[#6D1A2A] focus:ring-[#6D1A2A]"
                    />
                    <span>Never Expire (Continuous)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[11px] text-[#8A796B] mb-1">
                      Start Date
                    </span>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#EBD9C8] text-xs rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                    />
                  </div>

                  {formData.hasEndDate && (
                    <div>
                      <span className="block text-[11px] text-[#8A796B] mb-1">
                        Expiry Date
                      </span>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#EBD9C8] text-xs rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Live Card Preview */}
              <div className="p-4 bg-[#FAF6F0] border-2 border-dashed border-[#DCC8B5] rounded-sm">
                <div className="text-[10px] uppercase tracking-wider text-[#855D25] font-bold mb-2">
                  Shopper Preview Ticket
                </div>
                <div className="bg-white p-3 border border-[#EBD9C8] rounded-sm shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-base font-serif text-[#6D1A2A] font-bold">
                      {formData.discountType === "PERCENTAGE"
                        ? `${formData.discountValue || 0}% OFF`
                        : formData.discountType === "FIXED_AMOUNT"
                        ? `Flat ₹${formData.discountValue || 0} OFF`
                        : "Free Shipping"}
                    </div>
                    <div className="text-[11px] text-[#8A796B]">
                      Use code{" "}
                      <span className="font-mono font-bold text-[#171717]">
                        {formData.code || "CODE"}
                      </span>
                      {Number(formData.minOrderValueInRupees) > 0 &&
                        ` · Min order ₹${formData.minOrderValueInRupees}`}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-[#FAF6F0] border border-[#EBD9C8] text-[#855D25] text-xs font-mono font-bold rounded-xs">
                    {formData.code || "PREVIEW"}
                  </span>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#FAF6F0] border-t border-[#EBD9C8] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-[#EBD9C8] text-[#4A3E37] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCoupon}
                disabled={isSaving}
                className="px-5 py-2 bg-[#6D1A2A] hover:bg-[#581421] text-white text-xs uppercase tracking-wider font-semibold shadow-sm transition-all rounded-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingCoupon ? "Update Discount" : "Save Discount"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCoupon && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#EBD9C8] rounded-sm max-w-md w-full p-6 shadow-xl">
            <div className="w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif text-[#171717] text-center font-bold">
              Delete Coupon &ldquo;{deletingCoupon.code}&rdquo;?
            </h3>
            <p className="text-xs text-[#8A796B] text-center mt-1 mb-5">
              Are you sure you want to permanently delete this discount offer? Shoppers
              will no longer be able to apply it at checkout.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingCoupon(null)}
                className="px-4 py-2 border border-[#EBD9C8] text-[#4A3E37] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#FAF6F0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCoupon}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
