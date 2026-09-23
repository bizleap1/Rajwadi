"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  QrCode,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Smartphone,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface UpiScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmountInPaise: number;
  customerName: string;
  onPaymentConfirmed: (utrNumber?: string) => Promise<void>;
  isProcessing: boolean;
}

export default function UpiScannerModal({
  isOpen,
  onClose,
  totalAmountInPaise,
  customerName,
  onPaymentConfirmed,
  isProcessing,
}: UpiScannerModalProps) {
  const [utrNumber, setUtrNumber] = useState("");

  // Handle escape key and body scroll lock
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const amountInRupees = (totalAmountInPaise / 100).toFixed(2);
  const formattedAmount = (totalAmountInPaise / 100).toLocaleString("en-IN");
  const upiId = process.env.NEXT_PUBLIC_STORE_UPI_ID || "vyasshalu03@oksbi";
  const payeeName = "Rajwadi Rajputi Poshak";

  // Standard UPI URI format accepted by all Indian UPI apps
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amountInRupees}&cu=INR&tn=${encodeURIComponent(`Rajwadi Poshak Order for ${customerName || "Patron"}`)}`;

  // High-resolution QR Code generator
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiUri)}`;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    await onPaymentConfirmed(utrNumber.trim() || undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
    >
      <div
        className="bg-[#FAF5EE] border-2 border-[#855D25] w-full max-w-lg rounded-sm shadow-2xl overflow-hidden relative text-[#171717]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#6D1A2A] text-white px-6 py-4 flex items-center justify-between border-b border-[#855D25]">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-[#E6DCB8]" />
            <div>
              <h3 className="font-serif text-base tracking-wide uppercase">
                UPI QR Payment Scanner
              </h3>
              <p className="text-[10.5px] text-[#E6DCB8]/80 font-sans">
                Scan with GPay, PhonePe, Paytm, BHIM or Cred
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            disabled={isProcessing}
            className="p-1.5 rounded text-[#E6DCB8] hover:text-white hover:bg-white/15 transition-colors disabled:opacity-50 cursor-pointer relative z-20"
            title="Close Scanner"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Amount Callout */}
          <div className="bg-white p-4 rounded border border-[#EBD9C8] text-center shadow-2xs">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#855D25] font-semibold block">
              Total Amount Payable
            </span>
            <div className="text-3xl font-serif font-bold text-[#6D1A2A] mt-1 font-mono">
              ₹ {formattedAmount}
            </div>
            <p className="text-[11px] text-[#8A796B] mt-0.5">
              Exact order total auto-embedded in QR code
            </p>
          </div>

          {/* QR Code Container with Royal Gold Frame */}
          <div className="flex flex-col items-center justify-center">
            <div className="p-3 bg-white border-2 border-[#855D25] rounded-sm shadow-md flex flex-col items-center relative">
              <div className="relative w-56 h-56">
                <Image
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  width={224}
                  height={224}
                  unoptimized
                  className="rounded-sm object-contain"
                  priority
                />
              </div>

              <div className="mt-2 text-[11px] text-[#855D25] font-semibold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rajwadi Rajputi Poshak Official</span>
              </div>
            </div>

            <p className="text-xs text-[#6B5E55] mt-2.5 text-center font-medium">
              Point your camera or any UPI app scanner at this QR code
            </p>
          </div>



          {/* Mobile Direct UPI Intent Button */}
          <div className="sm:hidden">
            <a
              href={upiUri}
              className="w-full py-2.5 bg-[#FAF5EE] hover:bg-[#F3EBE1] text-[#6D1A2A] border border-[#855D25] text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tap to Pay via Installed UPI App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Optional UTR / Reference Input */}
          <form onSubmit={handleConfirm} className="space-y-3 pt-2 border-t border-[#EBD9C8]">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[#171717] mb-1">
                UPI Reference / UTR Number <span className="text-[#8A796B] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 423589123456 or last 4 digits"
                className="w-full px-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25] font-mono"
              />
            </div>

            {/* Confirm Payment Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-[#6D1A2A] hover:bg-[#581522] text-[#FAF5EE] text-xs uppercase tracking-[0.2em] font-medium transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting for Verification...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>I Have Paid &bull; Submit for Verification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Cancel / Edit Address Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full py-2 bg-transparent hover:bg-[#FAF5EE] text-[#855D25] border border-[#D9C4B0] text-xs uppercase tracking-wider font-medium rounded-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel &bull; Edit Delivery Address
            </button>
          </form>

          {/* Guarantee Security Note */}
          <p className="text-[10.5px] text-center text-[#8A796B] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#855D25]" />
            <span>Official Rajwadi Couture Payment &bull; Instant Receipt Download</span>
          </p>
        </div>
      </div>
    </div>
  );
}
