"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

interface TalkToDesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TalkToDesignerModal({
  isOpen,
  onClose,
}: TalkToDesignerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    occasion: "Bridal Wedding Ceremony",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // Allow user to see confirmation
    }, 400);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-royal-ivory border border-antique-gold/50 p-8 md:p-12 w-full max-w-xl shadow-2xl relative my-8"
        >
          {/* Close Button */}
          <button
            onClick={handleReset}
            className="absolute top-6 right-6 text-charcoal/60 hover:text-heritage-maroon transition-colors"
          >
            <X className="w-6 h-6 stroke-[1.25]" />
          </button>

          {!isSubmitted ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-[1px] w-6 bg-antique-gold" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-antique-gold font-medium">
                  Atelier Consultation
                </span>
              </div>

              <h3 className="font-serif text-3xl text-heritage-maroon font-light mb-3">
                Talk To Our Couturier
              </h3>

              <p className="text-xs md:text-sm text-charcoal/70 font-light mb-8 leading-relaxed font-sans">
                Schedule a personalized consultation with our styling team for
                custom measurements, authentic poshak selection, and occasion guidance.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-1.5 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                    className="w-full bg-soft-beige/40 border border-soft-beige px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-heritage-maroon"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-1.5 font-medium">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91..."
                      className="w-full bg-soft-beige/40 border border-soft-beige px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-heritage-maroon"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-1.5 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@domain.com"
                      className="w-full bg-soft-beige/40 border border-soft-beige px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-heritage-maroon"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-1.5 font-medium">
                    Celebration Occasion
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) =>
                      setFormData({ ...formData, occasion: e.target.value })
                    }
                    className="w-full bg-soft-beige/40 border border-soft-beige px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-heritage-maroon"
                  >
                    <option>Bridal Wedding Ceremony</option>
                    <option>Pre-Wedding / Sangeet / Haldi</option>
                    <option>Teej / Gangaur / Festival Celebration</option>
                    <option>Family Royal Function</option>
                    <option>Custom Unstitched Poshak Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-1.5 font-medium">
                    Personal Notes or Styling Preference
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Color preference, embroidery requirements, or fitting date..."
                    className="w-full bg-soft-beige/40 border border-soft-beige px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-heritage-maroon"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-heritage-maroon hover:bg-heritage-maroon-dark text-royal-ivory text-xs uppercase tracking-[0.25em] font-medium transition-all shadow-md"
                  >
                    Request Consultation
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-antique-gold mx-auto mb-4 stroke-[1.2]" />
              <h3 className="font-serif text-3xl text-heritage-maroon font-light mb-3">
                Inquiry Received
              </h3>
              <p className="text-sm text-charcoal/80 font-light mb-6 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-medium">{formData.name}</span>.
                Our couture stylist will contact you via phone or WhatsApp shortly
                to discuss your custom Rajputi Poshak.
              </p>
              <button
                onClick={handleReset}
                className="px-8 py-2.5 bg-heritage-maroon text-royal-ivory text-xs uppercase tracking-widest"
              >
                Close Window
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
