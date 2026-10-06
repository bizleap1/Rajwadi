"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  AlertCircle,
  Clock,
  Loader2,
  CheckCircle2,
  Sparkles,
  Check,
  Edit2,
  MapPin,
  X,
  Tag,
  CreditCard,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getEstimatedDeliveryRange } from "@/utils/date";

const INDIAN_STATES = [
  "Maharashtra",
  "Rajasthan",
  "Gujarat",
  "Madhya Pradesh",
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
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    cartCount,
    clearCart,
    subtotalInPaise,
    stitchingInPaise,
    shippingInPaise,
    cartTotalInPaise,
  } = useCart();
  const { user, addresses } = useAuth();

  // Multi-step state: "address" | "payment"
  const [currentStep, setCurrentStep] = useState<"address" | "payment">("address");

  // Address form data
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  const [savedAddress, setSavedAddress] = useState<typeof formData | null>(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  // Coupon / Discount states
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountInPaise, setDiscountInPaise] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState<Array<{ code: string; discountType: string; discountValue: number }>>([]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const deliveryRange = getEstimatedDeliveryRange(7);

  // Dynamic final total with discount deduction
  const finalPayableInPaise = Math.max(0, cartTotalInPaise - discountInPaise);
  const formattedAmount = (finalPayableInPaise / 100).toLocaleString("en-IN");

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponError("");
    setCouponSuccess("");
    setIsValidatingCoupon(true);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          subtotalInPaise,
          shippingInPaise,
          categories: cartItems.map((i) => i.category || ""),
          items: cartItems.map((i) => ({
            productId: i.productId,
            name: i.name,
            category: i.category,
            priceInPaise: i.unitPriceInPaise || i.totalInPaise,
            quantity: i.quantity,
          })),
          email: formData.email || user?.email || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        throw new Error(data.error || "Invalid coupon code.");
      }

      setAppliedCoupon(data.coupon);
      setDiscountInPaise(data.discountInPaise);
      setCouponSuccess(data.message || `Coupon "${code}" applied! You saved ₹${(data.discountInPaise / 100).toLocaleString("en-IN")}`);
      setCouponCodeInput(code);
    } catch (err: any) {
      setCouponError(err.message || "Failed to apply coupon.");
      setAppliedCoupon(null);
      setDiscountInPaise(0);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountInPaise(0);
    setCouponCodeInput("");
    setCouponError("");
    setCouponSuccess("");
  };


  // ponytail: saved address pre-fill disabled in guest checkout mode
  useEffect(() => {
    try {
      localStorage.removeItem("rajwadi_saved_delivery_address");
    } catch {
      // ignore
    }
  }, []);

  // Load only currently active coupons from database (automatically hides deactivated coupons)
  useEffect(() => {
    fetch("/api/coupons/active", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.coupons)) {
          setActiveCoupons(data.coupons);
        }
      })
      .catch((err) => console.error("Failed to load active coupons", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateAddress = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name.";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = "Please enter your complete street address.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Please enter your city.";
    }

    if (!formData.state) {
      newErrors.state = "Please select a state.";
    }

    const cleanPin = formData.pincode.replace(/\D/g, "").slice(-6);
    if (!cleanPin || cleanPin.length !== 6) {
      newErrors.pincode = "Please enter a valid 6-digit PIN code.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1 -> Step 2 transition
  const handleProceedToPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    if (!validateAddress()) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage("Your royal bag is empty.");
      return;
    }

    // ponytail: address localStorage persistence removed in guest checkout mode

    setCurrentStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // Dynamic Razorpay Script Loader
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Razorpay Gateway Checkout Handler
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error(
          "Unable to load Razorpay payment gateway. Please check your internet connection."
        );
      }

      const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
      const cleanPin = formData.pincode.replace(/\D/g, "").slice(-6);

      const deliveryAddress = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: cleanPhone,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: cleanPin,
      };

      const orderPayload = {
        items: cartItems.map((item) => ({
          productId:
            item.productId ||
            (item as any).product?.id ||
            (item as any).product?.slug ||
            (item as any).id ||
            "",
          size: item.size || "Standard",
          stitchingSelected: Boolean(item.stitchingSelected),
          quantity: Math.max(1, Number(item.quantity) || 1),
        })),
        deliveryAddress,
        paymentMethod: "RAZORPAY",
        couponCode: appliedCoupon ? appliedCoupon.code : null,
      };

      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await createRes.json();

      if (!createRes.ok) {
        const fieldErrorMsg =
          orderData.details?.fieldErrors &&
          Object.values(orderData.details.fieldErrors).flat()[0];
        throw new Error(
          (typeof fieldErrorMsg === "string" ? fieldErrorMsg : null) ||
            orderData.error ||
            "Failed to initiate Razorpay order. Please try again."
        );
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amountInPaise,
        currency: orderData.currency || "INR",
        name: "Rajwadi Rajputi Poshak",
        description: `Order #${orderData.orderNumber}`,
        image: "/logo without bg.png",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: deliveryAddress.fullName,
          email: deliveryAddress.email,
          contact: deliveryAddress.phone,
        },
        theme: {
          color: "#6D1A2A",
        },
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            clearCart();
            router.push(
              `/order-confirmation?orderId=${orderData.orderId}&token=${orderData.guestAccessToken}`
            );
          } catch (vErr: any) {
            console.error("Verification error:", vErr);
            setErrorMessage(
              vErr.message ||
                "Payment verification failed. Please contact Rajwadi Atelier support."
            );
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Razorpay failed:", response.error);
        setErrorMessage(
          response.error?.description || "Payment failed or cancelled. Please try again."
        );
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to open Razorpay payment gateway.");
      setIsProcessing(false);
    }
  };


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between text-[#171717]">
        <Navbar />
        <div className="pt-32 pb-20 max-w-lg mx-auto px-4 text-center">
          <div className="w-14 h-14 mx-auto bg-[#F8F1E7] rounded-full flex items-center justify-center text-[#855D25] mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif text-[#171717]">
            Your Royal Bag is Empty
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1 mb-6 font-serif italic">
            Please add an authentic poshak ensemble to your bag before proceeding
            to checkout.
          </p>
          <Link
            href="/collection"
            className="inline-block px-6 py-3 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#581522] transition-colors"
          >
            Explore Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#171717] font-sans selection:bg-[#6D1A2A] selection:text-white">
      <Navbar />

      <main className="pt-24 sm:pt-28 md:pt-32 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Step Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-[#EBD9C8]">
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#8A796B]">
            <Link href="/cart" className="hover:text-[#6D1A2A]">
              Bag ({cartCount})
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span
              className={
                currentStep === "address"
                  ? "text-[#855D25] font-semibold"
                  : "text-[#6B5E55]"
              }
            >
              1. Delivery Details
            </span>
            <ChevronRight className="w-3 h-3" />
            <span
              className={
                currentStep === "payment"
                  ? "text-[#855D25] font-semibold"
                  : "text-[#A09285]"
              }
            >
              2. UPI Payment &amp; Proof
            </span>
          </nav>

          {/* Stepper Pills */}
          <div className="flex items-center flex-wrap gap-2 text-[10px] sm:text-[11px]">
            <button
              type="button"
              onClick={() => setCurrentStep("address")}
              className={`px-3 py-1 uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentStep === "address"
                  ? "bg-[#6D1A2A] text-white"
                  : "bg-[#FAF5EE] text-[#855D25] border border-[#EBD9C8] hover:bg-[#F3EBE1]"
              }`}
            >
              <span>1. Address</span>
              {currentStep === "payment" && <Check className="w-3 h-3 text-emerald-600" />}
            </button>

            <span className="text-[#D9C4B0]">&rarr;</span>

            <button
              type="button"
              onClick={() => {
                if (validateAddress()) setCurrentStep("payment");
              }}
              className={`px-3 py-1 uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5 ${
                currentStep === "payment"
                  ? "bg-[#6D1A2A] text-white"
                  : "bg-[#FAF5EE] text-[#8A796B] border border-[#EBD9C8] cursor-pointer"
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>2. Razorpay Payment</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 rounded-sm shadow-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Payment &amp; Order Error</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: STEP 1 (ADDRESS) OR STEP 2 (FULL PAGE PAYMENT & PROOF)    */}
          {/* ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">
            {currentStep === "address" ? (
              /* ── STEP 1: DELIVERY DESTINATION FORM ── */
              <div className="bg-white p-4 sm:p-8 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-[1px] w-5 bg-[#855D25]" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
                      STEP 1 OF 2 &bull; DELIVERY DESTINATION
                    </span>
                  </div>
                  <h2 className="text-xl font-serif text-[#171717] mt-1">
                    Shipping &amp; Contact Details
                  </h2>
                </div>

                {/* ponytail: in guest checkout mode, display direct address form without saved address cards */}
                <form
                  ref={formRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProceedToPayment();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Prerna Sharma"
                          className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                        />
                        {errors.fullName && (
                          <span className="text-[10.5px] text-red-600 mt-1 block">
                            {errors.fullName}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                        />
                        {errors.phone && (
                          <span className="text-[10.5px] text-red-600 mt-1 block">
                            {errors.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                        Email Address (for order receipts &amp; tracking) *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="prerna.sharma@example.com"
                        className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                      />
                      {errors.email && (
                        <span className="text-[10.5px] text-red-600 mt-1 block">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                        Complete Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House / Flat No., Street, Landmark"
                        className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                      />
                      {errors.address && (
                        <span className="text-[10.5px] text-red-600 mt-1 block">
                          {errors.address}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Nagpur"
                          className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                        />
                        {errors.city && (
                          <span className="text-[10.5px] text-red-600 mt-1 block">
                            {errors.city}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                          State *
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          maxLength={6}
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="302001"
                          className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                        />
                        {errors.pincode && (
                          <span className="text-[10.5px] text-red-600 mt-1 block">
                            {errors.pincode}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#F0E5D8]">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 text-[#E6DCB8]" />
                        <span>
                          Continue to Payment (₹ {formattedAmount})
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <p className="mt-2.5 text-center text-[10.5px] text-[#8A796B] flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
                        <span>100% Secure Checkout via Razorpay &bull; UPI, Cards, NetBanking</span>
                      </p>
                    </div>
                  </form>
              </div>
            ) : (
              /* ── STEP 2: RAZORPAY PAYMENT ── */
              <div className="space-y-6">
                {/* Back to Step 1 Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep("address")}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 text-xs text-[#6D1A2A] hover:text-[#855D25] font-semibold cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>&larr; Edit Delivery Address &amp; Contact Details</span>
                </button>

                {/* Main Payment Container */}
                <div className="bg-white p-4 sm:p-8 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-[1px] w-5 bg-[#855D25]" />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
                        STEP 2 OF 2 &bull; SECURE PAYMENT
                      </span>
                    </div>
                    <h2 className="text-xl font-serif text-[#171717] mt-1">
                      Online Payment via Razorpay
                    </h2>
                    <p className="text-xs text-[#6B5E55] mt-0.5">
                      Pay securely using UPI, Credit/Debit Cards, NetBanking, or Wallets for{" "}
                      <strong>₹ {formattedAmount}</strong>.
                    </p>
                  </div>

                  {/* 1. Payable Amount Header */}
                  <div className="bg-[#FAF5EE] p-4 rounded-sm border border-[#EBD9C8] text-center shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-left">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] font-bold block">
                        Total Amount Payable
                      </span>
                      <span className="text-xs text-[#6B5E55]">
                        Secure 256-bit SSL encrypted transaction
                      </span>
                    </div>
                    <div className="text-3xl font-serif font-bold text-[#6D1A2A] font-mono">
                      ₹ {formattedAmount}
                    </div>
                  </div>

                  {/* 2. Payment Methods Feature Grid */}
                  <div className="p-5 sm:p-6 bg-[#FCFAF6] border border-[#EBD9C8] rounded-sm space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171717]">
                      <ShieldCheck className="w-4 h-4 text-[#855D25]" />
                      <span>Instant &amp; 100% Encrypted Checkout by Razorpay</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      <div className="p-3 bg-white border border-[#EBD9C8] rounded text-center">
                        <span className="text-xs font-bold text-[#171717] block">UPI</span>
                        <span className="text-[10px] text-[#8A796B]">GPay, PhonePe, Paytm, CRED</span>
                      </div>
                      <div className="p-3 bg-white border border-[#EBD9C8] rounded text-center">
                        <span className="text-xs font-bold text-[#171717] block">Cards</span>
                        <span className="text-[10px] text-[#8A796B]">Visa, Mastercard, RuPay</span>
                      </div>
                      <div className="p-3 bg-white border border-[#EBD9C8] rounded text-center">
                        <span className="text-xs font-bold text-[#171717] block">NetBanking</span>
                        <span className="text-[10px] text-[#8A796B]">50+ Major Indian Banks</span>
                      </div>
                      <div className="p-3 bg-white border border-[#EBD9C8] rounded text-center">
                        <span className="text-xs font-bold text-[#171717] block">Wallets</span>
                        <span className="text-[10px] text-[#8A796B]">Paytm, Mobikwik &amp; more</span>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 border border-[#EBD9C8] rounded flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-[#6B5E55]">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>PCI-DSS Level 1 Compliant &bull; 256-bit Encryption</span>
                      </div>
                      <span className="text-[10.5px] text-emerald-700 font-semibold uppercase tracking-wider">
                        Verified Merchant
                      </span>
                    </div>
                  </div>

                  {/* 3. Pay via Razorpay Button */}
                  <div className="pt-2 border-t border-[#EBD9C8] space-y-3">
                    <button
                      type="button"
                      onClick={handleRazorpayPayment}
                      disabled={isProcessing}
                      className="w-full py-4 bg-[#6D1A2A] hover:bg-[#581522] text-[#FAF5EE] text-xs uppercase tracking-[0.2em] font-semibold transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                    >
                      {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                      {!isProcessing && <Lock className="w-4 h-4 text-[#E6DCB8]" />}
                      <span>
                        {isProcessing
                          ? "Opening Razorpay Secure Gateway..."
                          : `Pay ₹ ${formattedAmount} via Razorpay`}
                      </span>
                      {!isProcessing && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1.5 text-center">
                      <p className="text-[10.5px] text-[#8A796B] flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
                        <span>
                          Official Rajwadi Atelier Order Verification &bull; Instant GST Invoice &amp; Live Tracking
                        </span>
                      </p>
                      <p className="text-[10px] text-[#8A796B] leading-relaxed">
                        By placing your order, you agree to our{" "}
                        <Link href="/terms-and-conditions" target="_blank" className="text-[#855D25] underline hover:text-[#6D1A2A]">
                          Terms &amp; Conditions
                        </Link>
                        ,{" "}
                        <Link href="/privacy-policy" target="_blank" className="text-[#855D25] underline hover:text-[#6D1A2A]">
                          Privacy Policy
                        </Link>
                        , and{" "}
                        <Link href="/shipping-policy" target="_blank" className="text-[#855D25] underline hover:text-[#6D1A2A]">
                          Shipping Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: ORDER SUMMARY & DESTINATION INFO                         */}
          {/* ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-4">
              <h3 className="font-serif text-base text-[#171717] pb-3 border-b border-[#F0E5D8]">
                Order Summary ({cartCount})
              </h3>

              <div className="divide-y divide-[#F0E5D8] max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="py-3 flex gap-3 first:pt-0 last:pb-0">
                    <div className="w-12 h-16 bg-[#F3EBE1] relative rounded overflow-hidden flex-shrink-0 border border-[#EBD9C8]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-serif text-[#171717] font-medium truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#8A796B] mt-0.5">
                        {item.size} {item.stitchingSelected ? "(+Stitching)" : ""}
                      </p>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-[#6B5E55]">Qty: {item.quantity}</span>
                        <span className="font-medium text-[#171717]">
                          ₹ {(item.totalInPaise / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code / Coupon Section */}
              <div className="pt-3 border-t border-[#F0E5D8] space-y-2">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#855D25] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Promo Code / Gift Voucher</span>
                </label>

                {appliedCoupon ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="text-xs font-mono font-bold text-emerald-900">
                          {appliedCoupon.code}
                        </div>
                        <div className="text-[10.5px] text-emerald-700">
                          Saved ₹{(discountInPaise / 100).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-white border border-red-200 rounded-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => {
                          setCouponCodeInput(e.target.value.toUpperCase());
                          if (couponError) setCouponError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="ENTER PROMO CODE"
                        className="flex-1 px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs font-mono uppercase font-semibold text-[#171717] rounded-sm focus:outline-none focus:border-[#6D1A2A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={isValidatingCoupon || !couponCodeInput.trim()}
                        className="px-3.5 py-2 bg-[#855D25] hover:bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        {isValidatingCoupon ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{couponError}</span>
                      </p>
                    )}

                    {/* Quick Suggestion Chips - Dynamically loaded only from active DB coupons */}
                    {activeCoupons.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[10px] text-[#8A796B]">Available:</span>
                        {activeCoupons.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleApplyCoupon(c.code)}
                            className="px-2 py-0.5 bg-[#FAF6F0] hover:bg-[#F3EBE1] text-[#855D25] border border-[#EBD9C8] text-[10px] font-mono font-bold rounded-xs transition-colors cursor-pointer"
                          >
                            {c.code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#EBD9C8] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B5E55]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#171717]">
                    ₹ {(subtotalInPaise / 100).toLocaleString("en-IN")}
                  </span>
                </div>

                {stitchingInPaise > 0 && (
                  <div className="flex justify-between text-[#6B5E55]">
                    <span>Bespoke Stitching</span>
                    <span className="font-medium text-[#171717]">
                      ₹ {(stitchingInPaise / 100).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {discountInPaise > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium bg-emerald-50/70 px-2 py-1 rounded-xs">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-700" />
                      <span>Discount ({appliedCoupon?.code || "Coupon"})</span>
                    </span>
                    <span>- ₹ {(discountInPaise / 100).toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#6B5E55]">
                  <span>Insured Shipping</span>
                  <span className="font-medium text-emerald-700">
                    {shippingInPaise === 0
                      ? "FREE"
                      : `₹ ${(shippingInPaise / 100).toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#EBD9C8] flex justify-between text-sm font-serif font-semibold text-[#171717]">
                  <span>Grand Total</span>
                  <span className="text-base text-[#6D1A2A]">
                    ₹ {formattedAmount}
                  </span>
                </div>
              </div>

              {/* Delivery Estimated */}
              <div className="p-3 bg-[#FAF5EE] border border-[#EBD9C8] rounded text-[11px] text-[#855D25] flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  Estimated delivery: <strong>{deliveryRange.rangeString}</strong>
                </span>
              </div>

              {/* Shipping Address Summary (if in Payment step) */}
              {currentStep === "payment" && formData.fullName && (
                <div className="p-3.5 bg-[#FCFAF6] border border-[#EBD9C8] rounded text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#855D25] uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6D1A2A]" />
                      <span>Shipping Destination</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep("address")}
                      className="text-[#6D1A2A] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-[#171717] font-medium">{formData.fullName}</p>
                  <p className="text-[#4A3E37] text-[11px] leading-relaxed">
                    {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
                  </p>
                  <p className="text-[#8A796B] text-[10.5px]">
                    Phone: {formData.phone} &bull; Email: {formData.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
