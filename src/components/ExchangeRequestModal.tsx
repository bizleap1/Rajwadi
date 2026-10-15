"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, RefreshCw, AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  category?: string;
  size?: string;
  imageUrl?: string;
  unitPriceFormatted?: string;
  totalFormatted?: string;
  quantity: number;
}

interface ExchangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  items: OrderItem[];
  initialItemId?: string;
  guestToken?: string | null;
  onSuccess: () => void;
}

const EXCHANGE_REASONS = [
  {
    key: "COLOR_PREFERENCE",
    label: "Color / Design Preference",
    desc: "Looking for an alternate colorway or design pattern",
  },
  {
    key: "ALTERATION",
    label: "Bespoke Tailoring Alteration",
    desc: "Custom fitting, kurti/kanchali or lehenga adjustment",
  },
  {
    key: "DAMAGE_DEFECT",
    label: "Fabric / Transit Defect",
    desc: "Poshak arrived with a flaw or damaged packaging",
  },
  {
    key: "OTHER",
    label: "Other Atelier Request",
    desc: "Any other special poshak exchange requirement",
  },
];

export default function ExchangeRequestModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  items,
  initialItemId,
  guestToken,
  onSuccess,
}: ExchangeRequestModalProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>(initialItemId || items[0]?.id || "");
  const [reason, setReason] = useState<string>("COLOR_PREFERENCE");
  const [desiredReplacement, setDesiredReplacement] = useState<string>("");
  const [reasonDetails, setReasonDetails] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      setError("Please select an item to exchange.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const url = guestToken
        ? `/api/orders/${orderId}/exchange?token=${guestToken}`
        : `/api/orders/${orderId}/exchange`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItemId: selectedItemId,
          reason,
          reasonDetails,
          desiredReplacement,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit exchange request.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 1800);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-[#FDFBF7] border border-[#C6A15B]/50 w-full max-w-xl shadow-2xl relative my-4 sm:my-8 p-4 sm:p-6 text-[#171717] rounded-sm max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8C827A] hover:text-[#5A1F2B] transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#171717]">
              Exchange Request Submitted
            </h3>
            <p className="text-xs text-[#6B5E55] max-w-sm mx-auto">
              Our master karigars &amp; atelier team have received your request for Order #{orderNumber}.
              Reverse pickup details will be shared shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="h-[1px] w-5 bg-[#855D25]" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
                  ATELIER SERVICE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-[#171717] mt-1">
                Request Poshak Exchange
              </h2>
              <p className="text-xs text-[#6B5E55] mt-0.5">
                Order #{orderNumber} &bull; Insured reverse pickup &amp; replacement service
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1. Select Ordered Piece */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#855D25]">
                  1. Select Piece to Exchange
                </label>
                <div className="space-y-2">
                  {items.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className={`p-3 rounded border flex items-center gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#FAF5EE] border-[#6D1A2A] ring-1 ring-[#6D1A2A]/40"
                            : "bg-white border-[#EBD9C8] hover:border-[#855D25]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="exchangeItem"
                          checked={isSelected}
                          onChange={() => setSelectedItemId(item.id)}
                          className="text-[#6D1A2A] focus:ring-[#6D1A2A]"
                        />
                        <div className="w-10 h-14 bg-[#F3EBE1] relative rounded overflow-hidden flex-shrink-0 border border-[#EBD9C8]">
                          <Image
                            src={item.imageUrl || "/placeholder.webp"}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="font-serif font-medium text-[#171717] truncate">
                            {item.productName}
                          </div>
                          <div className="text-[11px] text-[#8A796B]">
                            {item.category || "Traditional Poshak"} &bull; Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Reason for Exchange */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#855D25]">
                  2. Reason for Exchange
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXCHANGE_REASONS.map((r) => {
                    const isChecked = reason === r.key;
                    return (
                      <div
                        key={r.key}
                        onClick={() => setReason(r.key)}
                        className={`p-2.5 rounded border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-[#FAF5EE] border-[#6D1A2A] text-[#171717]"
                            : "bg-white border-[#EBD9C8] text-[#6B5E55] hover:border-[#855D25]"
                        }`}
                      >
                        <div className="font-semibold text-[#171717]">{r.label}</div>
                        <div className="text-[10.5px] text-[#8A796B] leading-tight mt-0.5">
                          {r.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Desired Replacement Piece / Color Preference */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#855D25]">
                  3. Desired Replacement Piece / Color Preference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Would like this poshak in Rani Pink / Kesariya shade, or another design"
                  value={desiredReplacement}
                  onChange={(e) => setDesiredReplacement(e.target.value)}
                  className="w-full bg-white border border-[#D9C4B0] p-2.5 text-xs text-[#171717] rounded focus:outline-none focus:ring-1 focus:ring-[#855D25] placeholder:text-[#A09285]"
                />
              </div>

              {/* 4. Notes / Alteration details */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#855D25]">
                  4. Additional Notes / Alteration Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Please describe any specific alteration, lining adjustment, or requirements for the master karigar..."
                  value={reasonDetails}
                  onChange={(e) => setReasonDetails(e.target.value)}
                  className="w-full bg-white border border-[#D9C4B0] p-2.5 text-xs text-[#171717] rounded focus:outline-none focus:ring-1 focus:ring-[#855D25] placeholder:text-[#A09285]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-2 sm:gap-3 border-t border-[#EBD9C8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 text-xs uppercase tracking-wider text-[#6B5E55] hover:text-[#171717] font-medium text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-medium rounded transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Submit Exchange Request</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
