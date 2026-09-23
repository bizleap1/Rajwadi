"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Rajwadi App Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#FAF6F0] text-[#171717]">
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#855D25] font-medium font-sans mb-3">
        Royal Heritage Notice
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl text-[#5A1F2B] mb-3 font-normal">
        Something Went Wrong
      </h2>
      <p className="text-xs sm:text-sm text-[#171717]/70 max-w-md mb-6 font-sans leading-relaxed">
        We encountered a temporary interruption while loading this page. Please try refreshing or return to the collection.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2.5 bg-[#5A1F2B] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#855D25] transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 bg-transparent border border-[#5A1F2B]/30 text-[#5A1F2B] text-xs uppercase tracking-[0.2em] font-medium hover:border-[#855D25] hover:text-[#855D25] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
