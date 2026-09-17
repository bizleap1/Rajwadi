import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-royal-ivory text-charcoal">
      <h2 className="font-serif text-3xl sm:text-4xl text-heritage-maroon mb-3">
        Page Not Found
      </h2>
      <p className="text-xs sm:text-sm text-charcoal/70 mb-6 font-sans">
        The requested royal creation or page could not be found.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-heritage-maroon text-royal-ivory text-xs uppercase tracking-[0.2em] font-medium border border-antique-gold hover:bg-[#431520] transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
