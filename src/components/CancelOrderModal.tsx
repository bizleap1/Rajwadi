"use client";

import React, { useState } from "react";
import { X, AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  guestToken?: string | null;
  onSuccess: () => void;
}

const CANCELLATION_REASONS = [
  {
    key: "ORDERED_BY_MISTAKE",
    label: "Ordered by mistake",
    desc: "Placed duplicate order or accidental purchase",
  },
  {
    key: "CHANGE_SIZE_OR_COLOR",
    label: "Need to change size or color",
    desc: "Want to select a different poshak size or colorway",
  },
  {
    key: "CHANGE_ADDRESS",
    label: "Need to change delivery address",
    desc: "Incorrect recipient name or destination pincode entered",
  },
  {
    key: "DELIVERY_TIME",
    label: "Delivery timeframe does not suit occasion",
    desc: "Needed for an urgent event or earlier date",
  },
  {
    key: "FOUND_ANOTHER_PIECE",
    label: "Decided on another Rajputi Poshak",
    desc: "Prefer an alternate royal collection design",
  },
  {
    key: "OTHER",
    label: "Other reason",
    desc: "Any other personal reason",
  },
];

export default function CancelOrderModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  guestToken,
  onSuccess,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0].label);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const url = guestToken
        ? `/api/orders/${orderId}/cancel?token=${guestToken}`
        : `/api/orders/${orderId}/cancel`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: selectedReason,
          comments: comments.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel order.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not process order cancellation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans animate-fade-in">
      <div
        className="bg-[#FDFBF7] border border-[#EBD9C8] rounded-sm max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden text-[#171717]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 text-[#8A796B] hover:text-[#6D1A2A] transition-colors rounded-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#171717]">Order Cancelled</h3>
            <p className="text-xs text-[#6B5E55] max-w-sm mx-auto">
              Order #{orderNumber} has been successfully cancelled. If payment was made, your refund will be credited to the original source.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
                  ORDER CANCELLATION
                </span>
              </div>
              <h2 className="font-serif text-xl text-[#171717] mt-0.5">
                Cancel Order <span className="font-mono font-bold">#{orderNumber}</span>
              </h2>
              <p className="text-xs text-[#6B5E55] mt-1 leading-relaxed">
                Please let us know the reason for cancellation. Orders can only be cancelled before dispatch.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 rounded-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#855D25]">
                Select Reason for Cancellation *
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {CANCELLATION_REASONS.map((r) => {
                  const isChecked = selectedReason === r.label;
                  return (
                    <label
                      key={r.key}
                      onClick={() => setSelectedReason(r.label)}
                      className={`flex items-start gap-3 p-3 rounded border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? "bg-white border-[#6D1A2A] shadow-xs ring-1 ring-[#6D1A2A]/20"
                          : "bg-white/60 border-[#EBD9C8] hover:border-[#D9C4B0]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancellationReason"
                        checked={isChecked}
                        onChange={() => setSelectedReason(r.label)}
                        className="mt-0.5 text-[#6D1A2A] focus:ring-[#6D1A2A]"
                      />
                      <div>
                        <div className="font-medium text-[#171717]">{r.label}</div>
                        <div className="text-[11px] text-[#8A796B] mt-0.5">{r.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Additional comments */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#855D25] mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Let us know how we can improve our collection..."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F0E5D8]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs uppercase tracking-wider text-[#6B5E55] hover:text-[#171717] border border-[#D9C4B0] rounded-sm font-medium cursor-pointer"
              >
                Keep Order
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs uppercase tracking-wider font-semibold rounded-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
