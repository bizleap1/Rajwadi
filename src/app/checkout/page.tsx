"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Lock,
  ShoppingBag,
  AlertCircle,
  XCircle,
  Clock,
  X,
  CreditCard,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { getEstimatedDeliveryRange } from "@/utils/date";
import { OrderRecord } from "@/types/order";

const INDIAN_STATES = [
  "Rajasthan",
  "Gujarat",
  "Madhya Pradesh",
  "Maharashtra",
  "Delhi",
  "Uttar Pradesh",
  "Haryana",
  "Punjab",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
  "West Bengal",
  "Bihar",
  "Andhra Pradesh",
  "Assam",
  "Chhattisgarh",
  "Goa",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Kerala",
  "Odisha",
  "Uttarakhand",
];

interface FormErrors {
  email?: string;
  mobile?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

type PaymentFlowState = "idle" | "modal_open" | "processing" | "failed" | "cancelled" | "pending";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user, addresses } = useAuth();

  // Form Fields
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
  });

  // Automatically pre-fill contact details and default address if user is logged in
  useEffect(() => {
    if (user) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email || "",
        fullName: prev.fullName || user.name || "",
        mobile: prev.mobile || user.phone || defaultAddr?.phone || "",
        phone: prev.phone || user.phone || defaultAddr?.phone || "",
        address: prev.address || defaultAddr?.address || "",
        city: prev.city || defaultAddr?.city || "",
        state: prev.state || defaultAddr?.state || "Rajasthan",
        pincode: prev.pincode || defaultAddr?.pincode || "",
      }));
    }
  }, [user, addresses]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<"razorpay">("razorpay");
  const [paymentFlowState, setPaymentFlowState] = useState<PaymentFlowState>("idle");
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cartTotal);

  // Form change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "mobile" && !prev.phone) {
        next.phone = value;
      }
      return next;
    });
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Form Validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (!cleanMobile || cleanMobile.length < 10) {
      newErrors.mobile = "Please enter a 10-digit mobile number.";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    if (!formData.address.trim() || formData.address.trim().length < 6) {
      newErrors.address = "Please enter your complete street address.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Please enter your city.";
    }

    if (!formData.state) {
      newErrors.state = "Please select a state.";
    }

    const cleanPin = formData.pincode.replace(/\D/g, "");
    if (!cleanPin || cleanPin.length !== 6) {
      newErrors.pincode = "Please enter a valid 6-digit PIN code.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Trigger Payment Modal when user clicks Place Order
  const handleInitiateOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Open Razorpay gateway modal
    setPaymentFlowState("modal_open");
  };

  // 1. Payment Success Handler
  const handlePaymentSuccess = () => {
    setIsProcessingAction(true);

    setTimeout(() => {
      // Generate clean royal order ID (e.g. RW1024 or RW + random 4 digits)
      const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `RW${randomOrderNum}`;

      const deliveryRange = getEstimatedDeliveryRange(5, 7);

      const newOrder: OrderRecord = {
        orderId,
        items: [...cartItems],
        itemCount: cartCount,
        subtotal: cartTotal,
        shipping: 0,
        total: cartTotal,
        deliveryAddress: {
          ...formData,
        },
        paymentMethod: "Razorpay Secure (UPI / Cards)",
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        createdAt: new Date().toISOString(),
        estimatedDelivery: {
          from: deliveryRange.fromFormatted,
          to: deliveryRange.toFormatted,
          rangeString: deliveryRange.rangeString,
        },
      };

      // Store in OrderContext
      createOrder(newOrder);

      // Clear cart
      clearCart();

      setIsProcessingAction(false);
      setPaymentFlowState("idle");

      // Navigate immediately to dedicated Order Confirmation Page
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 800);
  };

  // 2. Payment Failed Handler
  const handlePaymentFailure = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setPaymentFlowState("failed");
      window.scrollTo({ top: 120, behavior: "smooth" });
    }, 600);
  };

  // 3. Payment Cancelled Handler
  const handlePaymentCancelled = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setPaymentFlowState("cancelled");
      window.scrollTo({ top: 120, behavior: "smooth" });
    }, 400);
  };

  // 4. Payment Pending Handler
  const handlePaymentPending = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setPaymentFlowState("pending");
      window.scrollTo({ top: 120, behavior: "smooth" });
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#171717] selection:bg-[#5A1F2B] selection:text-[#FAF6F0]">
      {/* 1. SOLID NAVBAR */}
      <Navbar solidOnTop={true} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[74px] sm:pt-24 pb-36 sm:pb-24">
        {/* Minimal Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C827A] mb-3 sm:mb-4 font-sans"
        >
          <Link
            href="/cart"
            className="hover:text-[#5A1F2B] transition-colors duration-200"
          >
            Bag
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
          <span className="text-[#5A1F2B] font-semibold">Checkout</span>
        </nav>

        {/* Compact Centered Header */}
        <div className="text-center max-w-xl mx-auto mb-5 sm:mb-7">
          <h1 className="font-serif text-[24px] sm:text-3xl md:text-4xl text-[#171717] font-normal tracking-[0.06em] uppercase">
            CHECKOUT
          </h1>
          <div className="w-16 sm:w-20 h-[1px] bg-[#E6DCB8]/80 mx-auto mt-2 sm:mt-2.5" />
        </div>

        {/* ── SEPARATE PAYMENT RESULT STATES ── */}

        {/* STATE A: PAYMENT FAILED */}
        {paymentFlowState === "failed" && (
          <div className="max-w-xl mx-auto mb-10 p-6 sm:p-8 bg-[#FAF5EE] border border-[#5A1F2B]/30 text-center shadow-xs">
            <div className="w-11 h-11 mx-auto mb-3.5 rounded-full bg-[#5A1F2B]/10 text-[#5A1F2B] flex items-center justify-center">
              <XCircle className="w-6 h-6 stroke-[1.5]" />
            </div>

            <h2 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal tracking-wide uppercase mb-1.5">
              Payment unsuccessful
            </h2>

            <p className="font-serif italic text-xs sm:text-sm text-[#6B635B] mb-5">
              Your order has not been confirmed.
            </p>

            <p className="font-sans text-xs text-[#171717]/80 max-w-md mx-auto mb-6 leading-relaxed">
              The transaction was declined by your bank or payment provider. No funds have been deducted from your account.
            </p>

            <button
              type="button"
              onClick={() => setPaymentFlowState("idle")}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors shadow-xs cursor-pointer"
            >
              <span>TRY PAYMENT AGAIN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STATE B: PAYMENT CANCELLED */}
        {paymentFlowState === "cancelled" && (
          <div className="max-w-xl mx-auto mb-10 p-6 sm:p-8 bg-[#FAF5EE] border border-[#855D25]/30 text-center shadow-xs">
            <div className="w-11 h-11 mx-auto mb-3.5 rounded-full bg-[#855D25]/10 text-[#855D25] flex items-center justify-center">
              <AlertCircle className="w-6 h-6 stroke-[1.5]" />
            </div>

            <h2 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal tracking-wide uppercase mb-1.5">
              Payment was cancelled
            </h2>

            <p className="font-serif italic text-xs sm:text-sm text-[#6B635B] mb-5">
              Your order is still pending.
            </p>

            <p className="font-sans text-xs text-[#171717]/80 max-w-md mx-auto mb-6 leading-relaxed">
              The payment window was dismissed before completion. Your delivery address and poshak selections have been preserved.
            </p>

            <button
              type="button"
              onClick={() => setPaymentFlowState("idle")}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors shadow-xs cursor-pointer"
            >
              <span>RETURN TO CHECKOUT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STATE C: PAYMENT PENDING */}
        {paymentFlowState === "pending" && (
          <div className="max-w-xl mx-auto mb-10 p-6 sm:p-8 bg-[#FAF5EE] border border-[#E6DCB8] text-center shadow-xs">
            <div className="w-11 h-11 mx-auto mb-3.5 rounded-full bg-[#855D25]/10 text-[#855D25] flex items-center justify-center">
              <Clock className="w-6 h-6 stroke-[1.5]" />
            </div>

            <h2 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal tracking-wide uppercase mb-1.5">
              Payment processing
            </h2>

            <p className="font-serif italic text-xs sm:text-sm text-[#6B635B] mb-5">
              We&apos;ll update your order once payment is confirmed.
            </p>

            <p className="font-sans text-xs text-[#171717]/80 max-w-md mx-auto mb-6 leading-relaxed">
              Your bank is verifying the transaction authorization. You will receive an SMS and WhatsApp notification once confirmation is received.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePaymentSuccess}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>CHECK STATUS AGAIN</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentFlowState("idle")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-transparent text-[#5A1F2B] border border-[#5A1F2B]/30 hover:border-[#855D25] text-xs uppercase tracking-[0.2em] font-medium font-sans transition-colors cursor-pointer"
              >
                <span>RETURN TO CHECKOUT</span>
              </button>
            </div>
          </div>
        )}

        {/* CART EMPTY STATE */}
        {cartItems.length === 0 ? (
          <div className="py-14 text-center max-w-sm mx-auto px-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[#E6DCB8] bg-[#FAF6F0] flex items-center justify-center text-[#855D25]">
              <ShoppingBag className="w-5 h-5 stroke-[1.25]" />
            </div>
            <h2 className="font-serif text-xl text-[#171717] font-normal mb-2">
              Your bag is empty
            </h2>
            <p className="font-serif italic text-xs text-[#6B635B] mb-6">
              Add a poshak to proceed with checkout.
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium font-sans text-[#FAF6F0] bg-[#5A1F2B] hover:bg-[#855D25] py-3 px-6 transition-colors"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          /* MAIN CHECKOUT FORM & SUMMARY */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start mt-2 sm:mt-4">
            {/* LEFT COLUMN: CONTACT & DELIVERY FORM */}
            <form
              ref={formRef}
              onSubmit={handleInitiateOrder}
              className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8"
              noValidate
            >
              {/* SECTION 1: CONTACT INFORMATION */}
              <div className="bg-white/60 border border-[#E6DCB8]/80 p-4 sm:p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E6DCB8]/60">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#5A1F2B] text-[#FAF6F0] text-[11px] font-sans font-semibold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="font-serif text-base sm:text-lg text-[#171717] font-normal tracking-wide">
                      CONTACT INFORMATION
                    </h2>
                  </div>
                  <span className="text-[11px] font-sans text-[#8C827A]">
                    Guest Checkout
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-[10.5px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold font-sans mb-1"
                    >
                      Mobile Number <span className="text-[#5A1F2B]">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-[#D8CCB8] bg-[#FAF5EE] text-[#171717] text-xs font-sans font-medium">
                        +91
                      </span>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className={`w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border ${
                          errors.mobile
                            ? "border-[#5A1F2B] ring-1 ring-[#5A1F2B]"
                            : "border-[#D8CCB8]"
                        } focus:outline-none focus:border-[#855D25]`}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-[10.5px] text-[#5A1F2B] font-sans mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[10.5px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold font-sans mb-1"
                    >
                      Email Address <span className="text-[#5A1F2B]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Order confirmation will be sent here"
                      className={`w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border ${
                        errors.email
                          ? "border-[#5A1F2B] ring-1 ring-[#5A1F2B]"
                          : "border-[#D8CCB8]"
                      } focus:outline-none focus:border-[#855D25]`}
                    />
                    {errors.email && (
                      <p className="text-[10.5px] text-[#5A1F2B] font-sans mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: DELIVERY ADDRESS */}
              <div className="bg-white/60 border border-[#E6DCB8]/80 p-4 sm:p-6">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E6DCB8]/60">
                  <span className="w-5 h-5 rounded-full bg-[#5A1F2B] text-[#FAF6F0] text-[11px] font-sans font-semibold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-serif text-base sm:text-lg text-[#171717] font-normal tracking-wide">
                    DELIVERY ADDRESS
                  </h2>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-[10.5px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold font-sans mb-1"
                    >
                      Full Name <span className="text-[#5A1F2B]">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="First and last name"
                      className={`w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border ${
                        errors.fullName
                          ? "border-[#5A1F2B] ring-1 ring-[#5A1F2B]"
                          : "border-[#D8CCB8]"
                      } focus:outline-none focus:border-[#855D25]`}
                    />
                    {errors.fullName && (
                      <p className="text-[10.5px] text-[#5A1F2B] font-sans mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-[10.5px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold font-sans mb-1"
                    >
                      Address <span className="text-[#5A1F2B]">*</span>
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House/Flat No., Street, Landmark, Area"
                      className={`w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border ${
                        errors.address
                          ? "border-[#5A1F2B] ring-1 ring-[#5A1F2B]"
                          : "border-[#D8CCB8]"
                      } focus:outline-none focus:border-[#855D25]`}
                    />
                    {errors.address && (
                      <p className="text-[10.5px] text-[#5A1F2B] font-sans mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-[10.5px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold font-sans mb-1"
                      >
                        City <span className="text-[#5A1F2B]">*</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Jaipur"
                        className={`w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border ${
                          errors.city
                            ? "border-[#5A1F2B] ring-1 ring-[#5A1F2B]"
                            : "border-[#D8CCB8]"
                        } focus:outline-none focus:border-[#855D25]`}
                      />
                      {errors.city && (
                        <p className="text-[10.5px] text-[#5A1F2B] font-sans mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-[10.5px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold font-sans mb-1"
                      >
                        State <span className="text-[#5A1F2B]">*</span>
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border border-[#D8CCB8] focus:outline-none focus:border-[#855D25]"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="pincode"
                        className="block text-[10.5px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold font-sans mb-1"
                      >
                        PIN Code <span className="text-[#5A1F2B]">*</span>
                      </label>
                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6 digits"
                        className={`w-full px-3 py-2.5 text-xs font-sans text-[#171717] bg-white border ${
                          errors.pincode
                            ? "border-[#5A1F2B] ring-1 ring-[#5A1F2B]"
                            : "border-[#D8CCB8]"
                        } focus:outline-none focus:border-[#855D25]`}
                      />
                      {errors.pincode && (
                        <p className="text-[10.5px] text-[#5A1F2B] font-sans mt-1">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: DELIVERY METHOD */}
              <div className="bg-white/60 border border-[#E6DCB8]/80 p-4 sm:p-6">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#E6DCB8]/60">
                  <span className="w-5 h-5 rounded-full bg-[#5A1F2B] text-[#FAF6F0] text-[11px] font-sans font-semibold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-serif text-base sm:text-lg text-[#171717] font-normal tracking-wide">
                    DELIVERY
                  </h2>
                </div>

                <div className="p-3.5 bg-[#FAF5EE] border border-[#E6DCB8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="del-standard"
                      name="delivery"
                      checked
                      readOnly
                      className="accent-[#5A1F2B]"
                    />
                    <div>
                      <span className="font-sans text-xs font-semibold text-[#171717] block">
                        Royal Insured Luxury Delivery
                      </span>
                      <span className="font-sans text-[11px] text-[#8C827A] block">
                        4–7 business days with tamper-proof seal
                      </span>
                    </div>
                  </div>
                  <span className="font-sans text-xs uppercase tracking-wider text-[#2E5A36] font-semibold">
                    FREE
                  </span>
                </div>
              </div>

              {/* SECTION 4: PAYMENT (Razorpay Checkout) */}
              <div className="bg-white/60 border border-[#E6DCB8]/80 p-4 sm:p-6">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6DCB8]/60">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#5A1F2B] text-[#FAF6F0] text-[11px] font-sans font-semibold flex items-center justify-center">
                      4
                    </span>
                    <h2 className="font-serif text-base sm:text-lg text-[#171717] font-normal tracking-wide">
                      PAYMENT
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#8C827A] font-sans">
                    <Lock className="w-3 h-3" />
                    <span>256-bit Encrypted</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label
                    htmlFor="pay-razorpay"
                    className="p-3.5 bg-[#FAF5EE] border border-[#5A1F2B]/60 flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="pay-razorpay"
                      name="payment"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-[#5A1F2B] mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs font-semibold text-[#171717]">
                          Razorpay Secure Checkout
                        </span>
                        <span className="text-[10px] font-sans text-[#855D25] font-medium uppercase tracking-wider">
                          Instant Verification
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-[#6B635B] mt-0.5">
                        UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards & Net Banking.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* DESKTOP PRIMARY SUBMIT BUTTON */}
              <div className="hidden lg:block pt-2">
                <button
                  type="submit"
                  className="w-full h-[50px] bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF5EE] text-xs uppercase tracking-[0.24em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>PLACE ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
            <div className="lg:col-span-5 xl:col-span-5">
              <div className="sticky top-24 bg-[#FAF5EE] border border-[#E6DCB8] p-4 sm:p-6 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E6DCB8]">
                  <h3 className="font-serif text-base sm:text-lg text-[#171717] font-normal tracking-wide">
                    ORDER SUMMARY
                  </h3>
                  <span className="text-xs font-sans text-[#855D25] font-medium">
                    {cartCount} {cartCount === 1 ? "Poshak" : "Poshaks"}
                  </span>
                </div>

                {/* Product List */}
                <div className="py-3 divide-y divide-[#E6DCB8]/60 max-h-[300px] overflow-y-auto overscroll-contain pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="py-3 first:pt-1 last:pb-1 flex gap-3 items-center"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-12 sm:w-14 aspect-[3/4] flex-shrink-0 bg-[#F4ECE1] border border-[#E6DCB8]/60 overflow-hidden">
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

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-[13px] sm:text-[14px] text-[#171717] font-normal leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] font-sans text-[#855D25] block">
                          {item.size} · Qty: {item.quantity}
                        </span>
                      </div>

                      {/* Price */}
                      <span className="font-sans font-medium text-xs sm:text-[13px] text-[#171717] flex-shrink-0">
                        {item.product.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation breakdown */}
                <div className="py-3 space-y-2 border-t border-[#E6DCB8] font-sans text-xs border-b">
                  <div className="flex justify-between items-center text-[#171717]/85">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#171717]">
                      {formattedTotal}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#171717]/85">
                    <span>Shipping</span>
                    <span className="text-[#2E5A36] font-medium">Free</span>
                  </div>
                </div>

                {/* Total */}
                <div className="py-3.5 flex justify-between items-baseline">
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#171717] font-bold">
                    TOTAL
                  </span>
                  <span className="font-serif text-xl sm:text-2xl text-[#171717] font-normal">
                    {formattedTotal}
                  </span>
                </div>

                {/* Mobile Direct Submit button (inside summary) */}
                <div className="pt-1 lg:hidden">
                  <button
                    type="button"
                    onClick={() => handleInitiateOrder()}
                    className="w-full h-[46px] bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF5EE] text-xs uppercase tracking-[0.22em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>PLACE ORDER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E6DCB8]/60 flex items-center gap-1.5 text-[10.5px] text-[#855D25] font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>100% Authentic Handcrafted Rajputi Poshaks</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 5. MOBILE STICKY BOTTOM CHECKOUT BAR */}
      {cartItems.length > 0 && paymentFlowState === "idle" && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF5EE]/95 backdrop-blur-md border-t border-[#E6DCB8] px-4 py-3 flex items-center justify-between shadow-lg lg:hidden">
          <div className="flex flex-col text-left">
            <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#8C827A] font-sans font-semibold">
              TOTAL
            </span>
            <span className="font-serif text-[17px] font-normal text-[#171717] leading-tight">
              {formattedTotal}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleInitiateOrder()}
            className="px-5 py-2.5 bg-[#5A1F2B] hover:bg-[#431520] text-[#FAF5EE] text-[11px] uppercase tracking-[0.2em] font-medium font-sans flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
          >
            <span>PLACE ORDER</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── REALISTIC RAZORPAY PAYMENT GATEWAY MODAL ── */}
      {paymentFlowState === "modal_open" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF5EE] border border-[#E6DCB8] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#5A1F2B] text-[#FAF5EE] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#C6A15B]" />
                <div>
                  <span className="font-serif text-sm font-normal tracking-wider block leading-tight">
                    RAJWADI ATELIER
                  </span>
                  <span className="text-[10px] text-[#FAF5EE]/70 font-sans uppercase tracking-widest block">
                    Razorpay 256-bit Secure Gateway
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePaymentCancelled}
                aria-label="Close payment"
                className="text-[#FAF5EE]/80 hover:text-[#FAF5EE] p-1 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5">
              <div className="text-center pb-4 border-b border-[#E6DCB8]">
                <span className="text-[10.5px] uppercase tracking-[0.22em] text-[#855D25] font-semibold font-sans block mb-1">
                  PAYMENT AUTHORIZATION
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal block">
                  {formattedTotal}
                </span>
                <span className="text-xs font-sans text-[#6B635B] block mt-1">
                  for {cartCount} Rajputi Poshak{cartCount > 1 ? "s" : ""}
                </span>
              </div>

              {/* Payment Methods preview */}
              <div className="space-y-2">
                <div className="p-3 bg-white border border-[#5A1F2B]/40 flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2.5 text-[#171717]">
                    <Smartphone className="w-4 h-4 text-[#5A1F2B]" />
                    <span className="font-medium">UPI / QR (Google Pay, PhonePe, Paytm)</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-[#2E5A36] tracking-wider">
                    Ready
                  </span>
                </div>

                <div className="p-3 bg-white/70 border border-[#E6DCB8] flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2.5 text-[#171717]">
                    <CreditCard className="w-4 h-4 text-[#855D25]" />
                    <span className="font-medium">Cards (Visa, Mastercard, RuPay)</span>
                  </div>
                </div>
              </div>

              {/* Main Pay Now CTA (Success Flow) */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  disabled={isProcessingAction}
                  onClick={handlePaymentSuccess}
                  className="w-full h-12 bg-[#2E5A36] hover:bg-[#234529] text-white text-xs uppercase tracking-[0.22em] font-medium font-sans flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-70"
                >
                  {isProcessingAction ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AUTHORIZING PAYMENT...</span>
                    </>
                  ) : (
                    <>
                      <span>COMPLETE PAYMENT &rarr;</span>
                    </>
                  )}
                </button>

                {/* Developer / Tester Gateway Simulation triggers to test all user requirements */}
                <div className="pt-3 border-t border-[#E6DCB8]/60">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C827A] block mb-2 text-center">
                    Simulate Gateway Responses:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-[10.5px] font-sans">
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={handlePaymentFailure}
                      className="py-1.5 px-2 text-center border border-[#5A1F2B]/40 text-[#5A1F2B] hover:bg-[#5A1F2B]/10 transition-colors cursor-pointer"
                    >
                      Simulate Fail
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={handlePaymentCancelled}
                      className="py-1.5 px-2 text-center border border-[#855D25]/40 text-[#855D25] hover:bg-[#855D25]/10 transition-colors cursor-pointer"
                    >
                      Simulate Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={handlePaymentPending}
                      className="py-1.5 px-2 text-center border border-[#8C827A]/40 text-[#8C827A] hover:bg-[#8C827A]/10 transition-colors cursor-pointer"
                    >
                      Simulate Pending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FOOTER */}
      <Footer />
    </div>
  );
}
