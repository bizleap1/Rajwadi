import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Calendar, Clock, User, ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { BLOG_POSTS, BlogPost } from "@/data/blogData";
import { REAL_POSHAKS } from "@/data/products";
import { SITE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: "Article Not Found | Rajwadi Rajputi Poshak",
    };
  }

  const siteUrl = SITE_URL;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage.startsWith("http")
    ? post.featuredImage
    : `${siteUrl}${post.featuredImage}`;

  return {
    title: {
      absolute: post.metaTitle,
    },
    description: post.metaDescription,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      locale: "en_IN",
      url: postUrl,
      siteName: "Rajwadi Rajputi Poshak",
      title: post.metaTitle,
      description: post.metaDescription,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  const siteUrl = SITE_URL;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage.startsWith("http")
    ? post.featuredImage
    : `${siteUrl}${post.featuredImage}`;

  // Find related products
  const relatedProducts = REAL_POSHAKS.filter((p) =>
    post.relatedProductSlugs.includes(p.id) || post.relatedProductSlugs.includes((p as any).slug)
  ).slice(0, 4);

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    headline: post.title,
    description: post.metaDescription,
    image: [imageUrl],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Rajwadi Rajputi Poshak",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-without-bg.png`,
      },
    },
  };

  // Breadcrumbs JSON-LD Schema
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#171717]">
        <Navbar solidOnTop />

        <article className="pt-24 sm:pt-28 md:pt-32 pb-20 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-grow">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 py-2 mb-6 border-b border-[#E6DCB8]/60 text-[11px] uppercase tracking-[0.2em] font-sans text-[#171717]/60"
          >
            <Link href="/" className="hover:text-[#855D25] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
            <Link href="/blog" className="hover:text-[#855D25] transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C6A15B]" />
            <span className="text-[#855D25] font-medium line-clamp-1">
              {post.title}
            </span>
          </nav>

          {/* Article Header */}
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-[0.26em] text-[#FAF6F0] bg-[#5A1F2B] px-3 py-1 font-sans font-medium rounded-2xs">
                {post.category}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] bg-[#855D25]/10 px-2.5 py-1 font-mono rounded-2xs">
                {post.reviewNotice}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#171717] font-normal leading-tight mb-5">
              {post.h1}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#855D25] font-sans">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {post.author.name}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedAt}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
            <div className="h-0.5 w-16 bg-[#855D25]/40 mx-auto mt-6" />
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xs border border-[#E6DCB8]/80 mb-10 shadow-xs">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Editorial Review Notice Alert */}
          <div className="bg-[#FAF0E1] border-l-4 border-[#855D25] p-4 sm:p-5 rounded-xs mb-10 text-xs sm:text-sm text-[#5A1F2B] font-sans">
            <p className="font-semibold mb-1">Notice for Site Owner:</p>
            <p className="text-[#5A1F2B]/90 font-light leading-relaxed">
              This article is drafted for SEO topical authority and customer guidance. Please review the details (pricing estimates, showroom timings, or rental terms) and edit as appropriate for your Nagpur store policies.
            </p>
          </div>

          {/* Article Body */}
          <div className="prose prose-stone max-w-none space-y-8 text-sm sm:text-base text-[#171717]/85 font-serif font-light leading-relaxed">
            {post.content.map((sec, idx) => (
              <section key={idx} className="space-y-3.5">
                {sec.heading && (
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal pt-4 border-t border-[#E6DCB8]/50 first:border-t-0 first:pt-0">
                    {sec.heading}
                  </h2>
                )}
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
                {sec.bullets && (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#171717]/80 font-sans">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Related Collections Links */}
          <div className="mt-14 pt-8 border-t border-[#E6DCB8]/70">
            <h3 className="font-serif text-xl text-[#171717] font-normal mb-4">
              Explore Related Categories
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {post.relatedCategorySlugs.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  className="bg-[#FDFBF7] border border-[#E6DCB8] hover:border-[#855D25] px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans text-[#5A1F2B] hover:text-[#855D25] transition-colors rounded-2xs shadow-2xs"
                >
                  {cat.label} &rarr;
                </Link>
              ))}
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-14 pt-8 border-t border-[#E6DCB8]/70">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#855D25] font-semibold font-sans block">
                    FEATURED ATTIRE
                  </span>
                  <h3 className="font-serif text-2xl text-[#171717] font-normal">
                    Featured Creations Mentioned in This Guide
                  </h3>
                </div>
                <Link
                  href="/collection"
                  className="text-xs uppercase tracking-[0.16em] text-[#5A1F2B] hover:text-[#855D25] font-sans font-medium"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((prod, idx) => (
                  <ProductCard key={prod.id} product={prod} index={idx} />
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog Button */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#FAF6F0] bg-[#5A1F2B] hover:bg-[#855D25] py-3 px-6 transition-colors font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to All Articles
            </Link>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
