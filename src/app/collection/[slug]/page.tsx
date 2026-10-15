import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles, ShieldCheck, Truck, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { CATEGORY_PAGES } from "@/data/categoryData";
import { REAL_POSHAKS } from "@/data/products";
import { SITE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

export async function generateStaticParams() {
  return Object.keys(CATEGORY_PAGES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORY_PAGES[slug];
  if (!category) {
    return {
      title: "Collection Not Found | Rajwadi Rajputi Poshak",
    };
  }

  const siteUrl = SITE_URL;
  const pageUrl = `${siteUrl}/collection/${category.slug}`;

  return {
    title: {
      absolute: category.metaTitle,
    },
    description: category.metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: pageUrl,
      siteName: "Rajwadi Rajputi Poshak",
      title: category.metaTitle,
      description: category.metaDescription,
      images: [
        {
          url: `${siteUrl}/bridal.webp`,
          width: 800,
          height: 1067,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: category.metaTitle,
      description: category.metaDescription,
      images: [`${siteUrl}/bridal.webp`],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORY_PAGES[slug];
  if (!category) {
    notFound();
  }

  const siteUrl = SITE_URL;
  const pageUrl = `${siteUrl}/collection/${category.slug}`;

  // Filter products matching this category or type
  const products = REAL_POSHAKS.filter((p) => {
    if (category.slug === "bridal-rajputi-poshak") {
      return (
        (p.category || "").toLowerCase() === "bridal" ||
        (p.subCategory || "").toLowerCase() === "bridal"
      );
    }
    if (category.slug === "festive-rajputi-poshak") {
      return (
        (p.category || "").toLowerCase() === "festive" ||
        (p.subCategory || "").toLowerCase() === "festive"
      );
    }
    if (category.slug === "classic-rajputi-poshak") {
      return (
        (p.category || "").toLowerCase() === "classic poshak" ||
        (p.subCategory || "").toLowerCase() === "classic poshak" ||
        (p.category || "").toLowerCase() === "everyday"
      );
    }
    if (category.slug === "semi-stitched-rajputi-poshak") {
      return (
        (p.type || "").toLowerCase() === "unstitched" ||
        (p.type || "").toLowerCase() === "semi-stitched" ||
        (p.type || "").toLowerCase() === "semi stitched" ||
        (p.category || "").toLowerCase() === "unstitched"
      );
    }
    if (category.slug === "stitched-rajputi-poshak") {
      return (
        (p.type || "").toLowerCase() === "stitched" ||
        (p.category || "").toLowerCase() === "stitched"
      );
    }
    if (category.slug === "rajputi-jewellery") {
      return (
        (p.category || "").toLowerCase() === "jewellery" ||
        (p.type || "").toLowerCase() === "jewellery"
      );
    }
    return false;
  });

  // Breadcrumbs Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collection",
        item: `${siteUrl}/collection`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: pageUrl,
      },
    ],
  };

  // ItemList Schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    description: category.metaDescription,
    url: pageUrl,
    numberOfItems: products.length,
    itemListElement: products.map((prod, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: prod.name,
      url: `${siteUrl}/product/${prod.id}`,
      image: prod.image?.startsWith("http") ? prod.image : `${siteUrl}${prod.image}`,
    })),
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const otherCategories = Object.values(CATEGORY_PAGES).filter(
    (c) => c.slug !== category.slug
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#171717]">
        <Navbar solidOnTop />

        <div className="pt-24 sm:pt-28 md:pt-32 pb-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-grow">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 py-2 mb-6 border-b border-[#E6DCB8]/60 text-[11px] uppercase tracking-[0.2em] font-sans text-[#171717]/60"
          >
            <Link href="/" className="hover:text-[#855D25] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
            <Link href="/collection" className="hover:text-[#855D25] transition-colors">
              Collection
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
            <span className="text-[#855D25] font-medium">{category.name}</span>
          </nav>

          {/* Category Header */}
          <header className="mb-10 text-center max-w-4xl mx-auto">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-semibold block mb-2 font-sans">
              RAJWADI RAJPUTI POSHAK &bull; NAGPUR
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#171717] font-normal tracking-wide leading-tight mb-4">
              {category.h1}
            </h1>
            <div className="h-0.5 w-16 bg-[#855D25]/40 mx-auto mb-6" />

            {/* 250-400 Word Intro (Flagged for Review) */}
            <div className="bg-white/70 border border-[#E6DCB8]/70 rounded-md p-6 sm:p-8 text-left space-y-3.5 text-xs sm:text-sm text-[#171717]/85 font-serif font-light leading-relaxed shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E6DCB8]/40 pb-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#855D25] font-semibold font-sans">
                  Curated Heritage Guide
                </span>
                <span className="text-[10px] uppercase tracking-wider bg-[#855D25]/10 text-[#855D25] px-2 py-0.5 rounded font-sans">
                  DRAFT &bull; NEEDS OWNER REVIEW
                </span>
              </div>
              {category.introParagraphs.map((para, idx) => (
                <p key={idx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </header>

          {/* Products Grid */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6 border-b border-[#E6DCB8]/60 pb-3">
              <h2 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal">
                {category.name} Catalog{" "}
                <span className="text-sm font-sans text-[#8A796B]">
                  ({products.length} {products.length === 1 ? "design" : "designs"})
                </span>
              </h2>
              <span className="text-xs text-[#855D25] font-sans">
                Complimentary Insured Shipping
              </span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
                {products.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white/50 border border-[#E6DCB8]/50 rounded">
                <p className="font-serif text-lg text-[#171717]/70">
                  New designs in this collection are currently being handcrafted.
                </p>
                <Link
                  href="/collection"
                  className="mt-4 inline-block text-xs uppercase tracking-widest text-[#855D25] underline font-medium"
                >
                  Explore All Collections &rarr;
                </Link>
              </div>
            )}
          </section>

          {/* Category FAQ Section */}
          <section className="mb-16 bg-white/80 border border-[#E6DCB8]/70 rounded-md p-6 sm:p-10 shadow-2xs">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[10.5px] uppercase tracking-[0.25em] text-[#855D25] font-semibold block mb-1 font-sans">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal">
                About {category.name}
              </h2>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-[#E6DCB8]/60 space-y-0">
              {category.faq.map((item, idx) => (
                <div key={idx} className="py-4">
                  <h3 className="font-sans font-medium text-sm sm:text-base text-[#171717] flex items-start gap-2.5 mb-2">
                    <HelpCircle className="w-4 h-4 text-[#855D25] flex-shrink-0 mt-0.5" />
                    <span>{item.question}</span>
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#171717]/75 leading-relaxed pl-6.5">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Explore Other Collections */}
          <section className="border-t border-[#E6DCB8]/70 pt-10">
            <h3 className="text-center font-serif text-xl sm:text-2xl text-[#171717] mb-6">
              Explore Related Royal Collections
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {otherCategories.map((other) => (
                <Link
                  key={other.slug}
                  href={`/collection/${other.slug}`}
                  className="p-3 text-center bg-white/60 hover:bg-white border border-[#E6DCB8]/60 hover:border-[#855D25] transition-all rounded text-xs font-serif text-[#171717] hover:text-[#855D25] shadow-2xs"
                >
                  <span className="block font-medium truncate">{other.name}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
