"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Loader2,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  MonthlyReportData,
  downloadMonthlyReportPdf,
  downloadMonthlyCsv,
} from "@/lib/monthlyReportGenerator";

interface AdminMonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AdminMonthlyReportModal({
  isOpen,
  onClose,
}: AdminMonthlyReportModalProps) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<MonthlyReportData | null>(null);
  const [error, setError] = useState("");
  const [downloadFeedback, setDownloadFeedback] = useState("");

  const fetchReport = useCallback(
    async (m: number, y: number) => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/admin/reports/monthly?year=${y}&month=${m}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to aggregate monthly report.");
        }

        const data: MonthlyReportData = await res.json();
        setReportData(data);
      } catch (err: any) {
        setError(err.message || "Could not fetch monthly data.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      fetchReport(selectedMonth, selectedYear);
    }
  }, [isOpen, selectedMonth, selectedYear, fetchReport]);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    if (!reportData) return;
    downloadMonthlyReportPdf(reportData);
    setDownloadFeedback("Official PDF print statement opened!");
    setTimeout(() => setDownloadFeedback(""), 3500);
  };

  const handleDownloadCsv = () => {
    if (!reportData) return;
    downloadMonthlyCsv(reportData);
    setDownloadFeedback("CSV ledger exported successfully!");
    setTimeout(() => setDownloadFeedback(""), 3500);
  };

  const availableYears = [
    currentDate.getFullYear() + 1,
    currentDate.getFullYear(),
    currentDate.getFullYear() - 1,
    currentDate.getFullYear() - 2,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-[#FDFBF7] border border-[#C6A15B]/50 w-full max-w-xl shadow-2xl relative my-4 sm:my-8 p-5 sm:p-7 text-[#171717] rounded-sm max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between pb-3 border-b border-[#EBD9C8]">
            <div>
              <div className="flex items-center gap-1.5 text-[#855D25] text-[10px] uppercase tracking-[0.25em] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ATELIER COMMERCE AUDIT</span>
              </div>
              <h2 className="text-xl font-serif text-[#171717] font-bold mt-0.5">
                Download Monthly Executive Report
              </h2>
              <p className="text-xs text-[#6B5E55] mt-0.5">
                Generate official financial revenue statements and order fulfillment ledgers.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#8C827A] hover:text-[#5A1F2B] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Month & Year Selectors */}
          <div className="pt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#855D25] mb-1">
                Select Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="w-full bg-white border border-[#D9C4B0] p-2.5 rounded-sm text-xs font-semibold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#855D25] mb-1">
                Select Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="w-full bg-white border border-[#D9C4B0] p-2.5 rounded-sm text-xs font-semibold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Data Preview Box */}
          <div className="mt-4 pt-1">
            {isLoading ? (
              <div className="bg-white border border-[#EBD9C8] p-8 rounded-sm text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#6D1A2A]" />
                <span className="text-xs text-[#8A796B] uppercase tracking-wider">
                  Analyzing monthly transactions...
                </span>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : reportData ? (
              <div className="space-y-3">
                <div className="bg-[#FAF5EE] border border-[#855D25]/30 p-4 rounded-sm">
                  <div className="text-[10px] uppercase tracking-wider text-[#855D25] font-semibold flex items-center justify-between pb-2 border-b border-[#EBD9C8]/70">
                    <span>Performance Summary &bull; {reportData.reportPeriod.label}</span>
                    <span className="font-mono text-[9.5px] bg-[#EBD9C8]/50 px-2 py-0.5 rounded">
                      {reportData.reportPeriod.reportReference}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 text-center">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A796B] block">
                        Net Revenue
                      </span>
                      <span className="text-base sm:text-lg font-serif font-bold text-[#6D1A2A]">
                        ₹ {reportData.summary.totalPaidInRupees.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A796B] block">
                        Total Orders
                      </span>
                      <span className="text-base sm:text-lg font-serif font-bold text-[#171717]">
                        {reportData.summary.totalOrders}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A796B] block">
                        Paid / Realized
                      </span>
                      <span className="text-base sm:text-lg font-serif font-bold text-emerald-800">
                        {reportData.summary.paidOrdersCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#6B5E55] px-1 flex items-center justify-between">
                  <span>
                    Custom Stitching: ₹ {reportData.summary.totalStitchingInRupees.toLocaleString("en-IN")}
                  </span>
                  <span>
                    Discounts: ₹ {reportData.summary.totalDiscountInRupees.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {downloadFeedback && (
            <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{downloadFeedback}</span>
            </div>
          )}
        </div>

        {/* Download Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#EBD9C8] flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs uppercase tracking-wider text-[#6B5E55] hover:text-[#171717] font-semibold text-center cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={isLoading || !reportData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAF6F0] text-[#855D25] border border-[#855D25] text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title="Download Excel / CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isLoading || !reportData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6D1A2A] hover:bg-[#581522] text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            title="Open printable official statement / PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official PDF Statement</span>
          </button>
        </div>
      </div>
    </div>
  );
}
