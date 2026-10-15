import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Calendar, Clock, User, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/data/blogData";
import { SITE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

const siteUrl = SITE_URL;
const blogTitle = "Rajputi Poshak Heritage Journal & Guides | Rajwadi Nagpur";
const blogDesc =
  "Expert guides on royal Rajputi poshaks: wedding occasion styling, bridal vs festive selection, draping techniques, price guides, and Nagpur atelier visits.";

export const metadata: Metadata = {
  title: {
    absolute: blogTitle,
  },
  description: blogDesc,
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${siteUrl}/blog`,
    siteName: "Rajwadi Rajputi Poshak",
    title: blogTitle,
    description: blogDesc,
    images: [
      {
        url: `${siteUrl}/bridal.webp`,
        width: 1200,
        height: 630,
        alt: "Rajwadi Heritage Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: blogTitle,
    description: blogDesc,
    images: [`${siteUrl}/bridal.webp`],
  },
};

export default function BlogIndexPage() {
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
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
    ],
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Rajwadi Rajputi Poshak Journal",
    description: blogDesc,
    url: `${siteUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Rajwadi Rajputi Poshak",
      logo: `${siteUrl}/logo-without-bg.png`,
    },
    blogPost: BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: {
        "@type": "Organization",
        name: post.author.name,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
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
            <span className="text-[#855D25] font-medium">Blog</span>
          </nav>

          {/* Blog Header */}
          <header className="mb-12 text-center max-w-3xl mx-auto">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#855D25] font-semibold block mb-2 font-sans">
              HERITAGE EDITORIAL &bull; NAGPUR ATELIER
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#171717] font-normal tracking-wide leading-tight mb-4">
              Rajputi Poshak Journal & Guides
            </h1>
            <div className="h-0.5 w-16 bg-[#855D25]/40 mx-auto mb-4" />
            <p className="text-xs sm:text-sm text-[#171717]/75 font-serif font-light leading-relaxed">
              Authoritative styling guides, bridal planning advice, traditional draping tutorials, and fabric insights curated by Rajwadi&apos;s master artisans in Nagpur.
            </p>
          </header>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="group bg-[#FDFBF7] border border-[#E6DCB8]/80 rounded-xs overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Article Featured Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F4ECE1]">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#5A1F2B] text-[#FAF6F0] text-[9.5px] uppercase tracking-wider font-sans font-medium px-2.5 py-1 rounded-2xs">
                      {post.category}
                    </div>
                  </div>

                  {/* Article Metadata */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[10.5px] text-[#855D25] font-sans mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="font-serif text-lg sm:text-xl text-[#171717] group-hover:text-[#5A1F2B] font-normal leading-snug mb-3 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-[#171717]/70 font-serif font-light leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#E6DCB8]/40 mt-4 flex items-center justify-between">
                  <span className="text-[9.5px] uppercase tracking-wider text-[#855D25] font-mono bg-[#855D25]/10 px-2 py-0.5 rounded-2xs">
                    {post.reviewNotice}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs uppercase tracking-[0.16em] text-[#5A1F2B] hover:text-[#855D25] font-medium font-sans flex items-center gap-1"
                  >
                    Read Guide &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Atelier Consultation Banner */}
          <section className="bg-white/80 border border-[#C6A15B]/50 p-6 sm:p-8 rounded-xs text-center max-w-3xl mx-auto shadow-xs">
            <h3 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal mb-2">
              Have Questions About Choosing Your Poshak?
            </h3>
            <p className="text-xs sm:text-sm text-[#171717]/75 font-serif font-light max-w-xl mx-auto mb-5 leading-relaxed">
              Connect directly with our master designers in Nagpur via WhatsApp for bespoke bridal measurement consultations or visit our showroom at Hiwari Layout.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-sans tracking-[0.14em] uppercase">
              <Link
                href="/collection"
                className="bg-[#5A1F2B] hover:bg-[#855D25] text-[#FAF6F0] py-3 px-6 transition-colors duration-200"
              >
                Browse Catalog
              </Link>
              <a
                href="https://wa.me/918766667101?text=Hello%20Rajwadi,%20I%20have%20read%20your%20blog%20and%20would%20like%20to%20consult%20about%20a%20Rajputi%20Poshak"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#855D25] text-[#855D25] hover:bg-[#855D25]/10 py-3 px-6 transition-colors duration-200"
              >
                WhatsApp Stylist (+91 8766667101)
              </a>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
