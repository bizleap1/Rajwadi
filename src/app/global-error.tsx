"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Rajwadi Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#FAF6F0] text-[#171717] font-serif">
        <h2 className="text-3xl sm:text-4xl text-[#5A1F2B] mb-3">
          Something went wrong
        </h2>
        <p className="text-sm text-[#171717]/70 max-w-md mb-6 font-sans">
          An unexpected error occurred. Please try reloading the page.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2.5 bg-[#5A1F2B] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-sans hover:bg-[#855D25] transition-colors cursor-pointer"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
