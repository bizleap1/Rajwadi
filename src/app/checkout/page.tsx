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
  QrCode,
  Sparkles,
  Check,
  Edit2,
  MapPin,
  Upload,
  Image as ImageIcon,
  Copy,
  Smartphone,
  ExternalLink,
  User,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { getUnstitchedDisplayName } from "@/data/products";
import { getEstimatedDeliveryRange } from "@/utils/date";

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
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  screenshot?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user, isAuthenticated, addresses, openAuthModal } = useAuth();

  // Multi-step state: "address" | "payment" (matching old folder stage design)
  const [currentStep, setCurrentStep] = useState<"address" | "payment">("address");

  // Address form data
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
  });

  const [savedAddress, setSavedAddress] = useState<typeof formData | null>(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  // Payment proof states
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deliveryRange = getEstimatedDeliveryRange(5, 7);

  const storeUpiId =
    process.env.NEXT_PUBLIC_STORE_UPI_ID || "vyasshalu03@oksbi";
  const payeeName = "Rajwadi Rajputi Poshak";
  const amountInRupees = cartTotal.toFixed(2);
  const formattedAmount = cartTotal.toLocaleString("en-IN");

  // Dynamic UPI URI format accepted by all Indian UPI apps
  const upiUri = `upi://pay?pa=${encodeURIComponent(
    storeUpiId
  )}&pn=${encodeURIComponent(payeeName)}&am=${amountInRupees}&cu=INR&tn=${encodeURIComponent(
    `Rajwadi Poshak Order for ${formData.fullName || "Patron"}`
  )}`;

  // High-resolution Dynamic QR Code generator
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(
    upiUri
  )}`;

  // Load and pre-fill saved address from database (if logged in) or localStorage (for repeat patrons)
  useEffect(() => {
    if (user) {
      const defaultAddr = addresses && addresses.length > 0
        ? addresses.find((a) => a.isDefault) || addresses[0]
        : null;

      const addrData = {
        email: user.email || "",
        fullName: defaultAddr?.name || user.name || "",
        phone: defaultAddr?.phone || user.phone || "",
        address: defaultAddr?.address || "",
        city: defaultAddr?.city || "",
        state: defaultAddr?.state || "Rajasthan",
        pincode: defaultAddr?.pincode || "",
      };

      if (addrData.fullName && addrData.address && addrData.pincode) {
        setSavedAddress(addrData);
        setFormData(addrData);
        setUseSavedAddress(true);
      } else {
        setFormData((prev) => ({
          ...prev,
          email: addrData.email || prev.email,
          fullName: addrData.fullName || prev.fullName,
          phone: addrData.phone || prev.phone,
        }));
      }
      return;
    }

    try {
      const localSaved = localStorage.getItem("rajwadi_saved_delivery_address");
      if (localSaved) {
        const parsed = JSON.parse(localSaved);
        if (parsed && parsed.fullName && parsed.address && parsed.pincode) {
          setSavedAddress(parsed);
          setFormData(parsed);
          setUseSavedAddress(true);
        }
      }
    } catch {
      // ignore
    }
  }, [user, addresses]);

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

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
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

    // Persist delivery address locally
    try {
      localStorage.setItem(
        "rajwadi_saved_delivery_address",
        JSON.stringify(formData)
      );
    } catch {
      // ignore
    }

    setCurrentStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // File handling for screenshot
  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
      setErrors((prev) => ({
        ...prev,
        screenshot: "Please upload an image file (PNG, JPG, WEBP).",
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        screenshot: "Image size should be under 10MB.",
      }));
      return;
    }

    setScreenshotFile(file);
    setErrors((prev) => ({ ...prev, screenshot: undefined }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(storeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  // Step 2: Upload Screenshot & Submit Order
  const handleSubmitPaymentOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    if (!screenshotFile && !screenshotPreview) {
      setErrors((prev) => ({
        ...prev,
        screenshot:
          "Please upload your UPI payment screenshot proof before confirming.",
      }));
      return;
    }

    setIsProcessing(true);

    try {
      let uploadedScreenshotUrl = "";

      // 1. Upload screenshot image to server/Cloudinary
      if (screenshotFile) {
        const uploadData = new FormData();
        uploadData.append("screenshot", screenshotFile);

        const uploadRes = await fetch("/api/checkout/upload-screenshot", {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(
            uploadJson.error || "Failed to upload payment screenshot."
          );
        }

        uploadedScreenshotUrl = uploadJson.url;
      }

      // 2. Prepare Order Payload
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
          productId: item.product.id,
          size: item.size || "Standard",
          stitchingSelected:
            item.size?.toLowerCase() === "stitched" ||
            item.product.category?.toLowerCase() !== "unstitched",
          quantity: item.quantity,
        })),
        deliveryAddress,
        paymentScreenshotUrl: uploadedScreenshotUrl || null,
        utrNumber: utrNumber.trim() || null,
        notes: utrNumber.trim() ? `UPI Ref/UTR: ${utrNumber.trim()}` : null,
      };

      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(
          orderData.error ||
            "Failed to confirm order. Please verify your details."
        );
      }

      // Record in local state for seamless client-side order flow
      createOrder({
        orderId: orderData.orderId,
        items: [...cartItems],
        itemCount: cartCount,
        subtotal: cartTotal,
        shipping: 0,
        total: cartTotal,
        deliveryAddress: {
          fullName: formData.fullName,
          mobile: formData.phone,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: "UPI QR Code Payment",
        paymentStatus: "Pending Verification",
        orderStatus: "Order Received",
        paymentScreenshot: uploadedScreenshotUrl || screenshotPreview || undefined,
        utrNumber: utrNumber.trim() || undefined,
        createdAt: new Date().toISOString(),
        estimatedDelivery: {
          from: deliveryRange.fromFormatted,
          to: deliveryRange.toFormatted,
          rangeString: deliveryRange.rangeString,
        },
      });

      clearCart();
      const tokenParam = orderData.guestAccessToken ? `&token=${orderData.guestAccessToken}` : "";
      router.push(
        `/order-confirmation?orderId=${orderData.orderId}${tokenParam}`
      );
    } catch (err: any) {
      console.error("Payment & Order submission error:", err);
      setErrorMessage(err.message || "Failed to confirm payment.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between text-[#171717]">
        <Navbar />
        <main className="pt-32 pb-20 max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto bg-[#F8F1E7] border border-[#EBD9C8] rounded-full flex items-center justify-center text-[#855D25] mb-5 shadow-2xs">
            <Lock className="w-8 h-8 stroke-[1.5]" />
          </div>
          <span className="text-[10.5px] uppercase tracking-[0.25em] text-[#855D25] font-semibold block mb-1">
            PATRON CHECKOUT
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#171717]">Sign In Required</h1>
          <p className="text-xs text-[#6B5E55] mt-2 mb-8 font-serif italic max-w-sm mx-auto leading-relaxed">
            Please sign in with your mobile number or email to complete your bespoke poshak order and receive tailoring updates.
          </p>

          <div className="space-y-3 bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-xs mb-6">
            <button
              type="button"
              onClick={() => openAuthModal("signin", "Sign in to complete your checkout.")}
              className="w-full py-3 px-4 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-[0.16em] font-medium rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Sign In to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => openAuthModal("signup", "Create an account to complete your checkout.")}
              className="w-full py-2.5 px-4 bg-[#FAF5EE] hover:bg-[#F3EBE1] border border-[#D9C4B0] text-[#171717] text-xs uppercase tracking-[0.16em] font-medium rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create New Account</span>
            </button>
          </div>

          <Link
            href="/cart"
            className="text-xs text-[#6D1A2A] hover:underline font-medium uppercase tracking-wider inline-flex items-center gap-1"
          >
            &larr; Return to Shopping Bag
          </Link>
        </main>
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep("address")}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-1.5 ${
                currentStep === "payment"
                  ? "bg-[#6D1A2A] text-white"
                  : "bg-[#FAF5EE] text-[#8A796B] border border-[#EBD9C8] cursor-pointer"
              }`}
            >
              <QrCode className="w-3 h-3" />
              <span>2. UPI Payment &amp; Proof</span>
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
              <div className="bg-white p-6 sm:p-8 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-6">
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

                {savedAddress && useSavedAddress ? (
                  /* Saved Address Card */
                  <div className="space-y-5">
                    <div className="bg-[#FAF5EE] border-2 border-[#855D25] p-5 rounded-sm shadow-xs relative">
                      <div className="flex items-center justify-between pb-3 border-b border-[#EBD9C8]">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#855D25]" />
                          <span className="text-xs font-semibold text-[#855D25] uppercase tracking-wider">
                            Deliver to this saved address?
                          </span>
                        </div>
                        <span className="text-[10px] bg-[#6D1A2A] text-white px-2.5 py-0.5 rounded-xs uppercase tracking-wider font-semibold">
                          Saved Patron Address
                        </span>
                      </div>

                      <div className="mt-3.5 space-y-1.5 text-xs text-[#171717]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#6D1A2A] flex-shrink-0" />
                          <span className="font-serif font-bold text-base text-[#6D1A2A]">
                            {savedAddress.fullName}
                          </span>
                        </div>
                        <p className="text-[#4A3E37] font-medium pl-6 leading-relaxed">
                          {savedAddress.address}
                        </p>
                        <p className="text-[#4A3E37] font-medium pl-6">
                          {savedAddress.city}, {savedAddress.state} &ndash;{" "}
                          <span className="font-mono font-bold text-[#171717]">
                            {savedAddress.pincode}
                          </span>
                        </p>
                        <div className="pt-2 pl-6 text-[11px] text-[#8A796B] flex flex-wrap gap-x-4 gap-y-1">
                          <span>
                            <strong>Mobile:</strong>{" "}
                            <span className="font-mono text-[#171717]">
                              {savedAddress.phone}
                            </span>
                          </span>
                          <span>
                            <strong>Email:</strong> {savedAddress.email}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EBD9C8] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#047857] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-[#047857]">
                            Selected for Delivery
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setUseSavedAddress(false);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-[#6D1A2A] hover:text-[#855D25] font-semibold underline cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Deliver to a Different Address</span>
                        </button>
                      </div>
                    </div>

                    {/* Proceed Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleProceedToPayment()}
                        className="w-full py-3.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <QrCode className="w-4 h-4 text-[#E6DCB8]" />
                        <span>
                          Continue to UPI Payment (₹ {formattedAmount})
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <p className="mt-2.5 text-center text-[10.5px] text-[#8A796B] flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
                        <span>
                          Delivering to {savedAddress.fullName}, {savedAddress.city} &bull; Next: UPI QR &amp; Screenshot Upload
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Editable Address Form */
                  <form
                    ref={formRef}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleProceedToPayment();
                    }}
                    className="space-y-4"
                  >
                    {savedAddress && (
                      <div className="p-3 bg-[#FAF5EE] border border-[#EBD9C8] rounded-sm flex items-center justify-between text-xs mb-2">
                        <span className="text-[#6B5E55]">
                          Saved address available ({savedAddress.fullName},{" "}
                          {savedAddress.city})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(savedAddress);
                            setUseSavedAddress(true);
                          }}
                          className="text-[#6D1A2A] font-semibold underline cursor-pointer hover:text-[#855D25]"
                        >
                          Use Saved Address
                        </button>
                      </div>
                    )}

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
                          placeholder="Jaipur"
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
                        <QrCode className="w-4 h-4 text-[#E6DCB8]" />
                        <span>
                          Continue to UPI Payment (₹ {formattedAmount})
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <p className="mt-2.5 text-center text-[10.5px] text-[#8A796B] flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
                        <span>Instant UPI QR Scanner &bull; GPay, PhonePe, Paytm, BHIM</span>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* ── STEP 2: FULL PAGE UPI PAYMENT & SCREENSHOT PROOF UPLOAD ── */
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
                <div className="bg-white p-6 sm:p-8 border border-[#EBD9C8] rounded-sm shadow-2xs space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-[1px] w-5 bg-[#855D25]" />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
                        STEP 2 OF 2 &bull; DIRECT UPI SCAN &amp; PROOF
                      </span>
                    </div>
                    <h2 className="text-xl font-serif text-[#171717] mt-1">
                      UPI Payment &amp; Screenshot Proof
                    </h2>
                    <p className="text-xs text-[#6B5E55] mt-0.5">
                      Scan the QR code below with any UPI App, complete the payment of{" "}
                      <strong>₹ {formattedAmount}</strong>, and upload your payment screenshot.
                    </p>
                  </div>

                  {/* 1. Payable Amount Header */}
                  <div className="bg-[#FAF5EE] p-4 rounded-sm border border-[#EBD9C8] text-center shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-left">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] font-bold block">
                        Total Amount Payable
                      </span>
                      <span className="text-xs text-[#6B5E55]">
                        Auto-embedded into QR code
                      </span>
                    </div>
                    <div className="text-3xl font-serif font-bold text-[#6D1A2A] font-mono">
                      ₹ {formattedAmount}
                    </div>
                  </div>

                  {/* 2. QR Code Box */}
                  <div className="p-6 bg-[#FCFAF6] border-2 border-[#855D25]/30 rounded-sm flex flex-col items-center justify-center space-y-4">
                    <div className="p-3.5 bg-white border-2 border-[#855D25] rounded-sm shadow-md flex flex-col items-center">
                      <div className="relative w-60 h-60">
                        <Image
                          src={qrCodeUrl}
                          alt="Rajwadi UPI QR Code"
                          width={240}
                          height={240}
                          unoptimized
                          className="rounded-sm object-contain"
                          priority
                        />
                      </div>
                      <div className="mt-2.5 text-[11px] text-[#855D25] font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Rajwadi Rajputi Poshak Official</span>
                      </div>
                    </div>

                    {/* Copy UPI ID */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <span className="text-xs text-[#6B5E55]">UPI ID:</span>
                      <code className="px-2.5 py-1 bg-white border border-[#D9C4B0] text-xs font-mono font-bold text-[#171717] rounded select-all">
                        {storeUpiId}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2.5 py-1 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#855D25] border border-[#EBD9C8] rounded text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Mobile Direct UPI Intent Button */}
                    <div className="w-full pt-1">
                      <a
                        href={upiUri}
                        className="w-full py-2.5 bg-white hover:bg-[#FAF5EE] text-[#6D1A2A] border border-[#855D25] text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Tap to Pay via UPI App (GPay / PhonePe / Paytm / BHIM)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* 3. SCREENSHOT PROOF UPLOAD (CRITICAL REQUIREMENT) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#171717] flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#855D25]" />
                        <span>Upload Payment Screenshot Proof *</span>
                      </label>
                      <span className="text-[10.5px] text-[#855D25] font-semibold uppercase tracking-wider">
                        Required for verification
                      </span>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelected(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {screenshotPreview ? (
                      /* File Preview State */
                      <div className="p-4 bg-[#FAF5EE] border-2 border-emerald-600/40 rounded-sm relative space-y-3">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-28 bg-white border border-[#D9C4B0] rounded relative overflow-hidden flex-shrink-0 shadow-xs">
                            <img
                              src={screenshotPreview}
                              alt="Payment Screenshot Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 text-xs">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Screenshot Selected</span>
                            </div>
                            <p className="font-mono text-[#171717] truncate font-medium">
                              {screenshotFile?.name || "payment_proof.jpg"}
                            </p>
                            {screenshotFile && (
                              <p className="text-[11px] text-[#8A796B] mt-0.5">
                                {(screenshotFile.size / 1024).toFixed(1)} KB
                              </p>
                            )}

                            <div className="mt-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-2.5 py-1 bg-white hover:bg-[#F3EBE1] text-[#855D25] border border-[#D9C4B0] rounded text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Change Screenshot
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setScreenshotFile(null);
                                  setScreenshotPreview("");
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop Upload Zone */
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingFile(true);
                        }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 border-2 border-dashed rounded-sm text-center cursor-pointer transition-all ${
                          isDraggingFile
                            ? "border-[#6D1A2A] bg-[#F8F1E7]"
                            : errors.screenshot
                            ? "border-red-400 bg-red-50/50 hover:bg-red-50"
                            : "border-[#D9C4B0] bg-[#FCFAF6] hover:bg-[#FAF5EE] hover:border-[#855D25]"
                        }`}
                      >
                        <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF5EE] border border-[#EBD9C8] flex items-center justify-center text-[#855D25] mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-semibold text-[#171717]">
                          Click to select or drag &amp; drop payment screenshot
                        </h4>
                        <p className="text-[11px] text-[#8A796B] mt-1">
                          PNG, JPG, or WEBP up to 10MB (Take a screenshot of your successful UPI transfer screen)
                        </p>
                      </div>
                    )}

                    {errors.screenshot && (
                      <span className="text-[11px] text-red-600 block font-medium">
                        {errors.screenshot}
                      </span>
                    )}
                  </div>

                  {/* 4. UTR / REFERENCE NUMBER (OPTIONAL/RECOMMENDED) */}
                  <div className="pt-2">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#171717] mb-1">
                      UPI Reference / UTR Number{" "}
                      <span className="text-[#8A796B] font-normal">(Optional &bull; 12-digit transaction ID)</span>
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 423589123456"
                      className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25] font-mono"
                    />
                    <p className="text-[10.5px] text-[#8A796B] mt-1">
                      Found in your Google Pay, PhonePe, or Paytm receipt details.
                    </p>
                  </div>

                  {/* 5. CONFIRMATION SUBMIT BUTTON */}
                  <div className="pt-4 border-t border-[#EBD9C8] space-y-3">
                    <button
                      type="button"
                      onClick={handleSubmitPaymentOrder}
                      disabled={isProcessing}
                      className="w-full py-4 bg-[#6D1A2A] hover:bg-[#581522] text-[#FAF5EE] text-xs uppercase tracking-[0.2em] font-semibold transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading Proof &amp; Confirming Order...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-[#E6DCB8]" />
                          <span>Submit Payment Proof &amp; Confirm Order</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <p className="text-[10.5px] text-center text-[#8A796B] flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
                      <span>
                        Official Rajwadi Atelier Order Verification &bull; Instant GST Invoice &amp; Live Tracking
                      </span>
                    </p>
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
                        src={item.product.image || "/products/kesariya-1.webp"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-serif text-[#171717] font-medium truncate">
                        {getUnstitchedDisplayName(item.product)}
                      </h4>
                      <p className="text-[11px] text-[#8A796B] mt-0.5">
                        {item.size}
                      </p>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-[#6B5E55]">Qty: {item.quantity}</span>
                        <span className="font-medium text-[#171717]">
                          {item.product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#EBD9C8] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B5E55]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#171717]">
                    ₹ {formattedAmount}
                  </span>
                </div>

                <div className="flex justify-between text-[#6B5E55]">
                  <span>Insured Shipping</span>
                  <span className="font-medium text-emerald-700">
                    FREE
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
                  Estimated delivery: <strong>Within 5–7 Days ({deliveryRange.rangeString})</strong>
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
