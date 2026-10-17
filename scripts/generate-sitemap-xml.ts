import "dotenv/config";
import fs from "fs";
import path from "path";
import prisma from "../src/lib/prisma";
import { REAL_POSHAKS } from "../src/data/products";
import { CATEGORY_PAGES } from "../src/data/categoryData";
import { BLOG_POSTS } from "../src/data/blogData";
import { SITE_URL } from "../src/lib/siteUrl";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function formatW3CDate(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;
  return d.toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

async function main() {
  const siteUrl = SITE_URL.replace(/\/$/, "");

  // 1. Fetch products from database
  let dbProducts: Array<{
    id: string;
    slug: string | null;
    category: string;
    type: string | null;
    subCategory: string | null;
    updatedAt: Date;
    createdAt: Date;
  }> = [];

  try {
    dbProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        category: true,
        type: true,
        subCategory: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (err) {
    console.warn("Failed to query DB for sitemap products:", err);
  }

  // 2. Build product entries
  const allProductDates: Date[] = [];
  const productEntries: { url: string; lastmod: string | null }[] = [];
  const addedSlugs = new Set<string>();

  for (const p of dbProducts) {
    const slug = p.slug || p.id;
    if (!addedSlugs.has(slug)) {
      addedSlugs.add(slug);
      const d = p.updatedAt || p.createdAt || null;
      if (d) allProductDates.push(d);
      productEntries.push({
        url: `${siteUrl}/product/${encodeURIComponent(slug)}`,
        lastmod: formatW3CDate(d),
      });
    }
  }

  // Fallback static products not present in database
  for (const p of REAL_POSHAKS) {
    const slug = p.id;
    if (!addedSlugs.has(slug)) {
      addedSlugs.add(slug);
      // Records without a reliable DB/CMS date omit lastmod tag per Google sitemap rules
      productEntries.push({
        url: `${siteUrl}/product/${encodeURIComponent(slug)}`,
        lastmod: null,
      });
    }
  }

  // 3. Blog entries
  const allBlogDates: Date[] = [];
  const blogEntries: { url: string; lastmod: string | null }[] = [];

  for (const post of BLOG_POSTS) {
    const rawDate = post.updatedAt || post.publishedAt;
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) allBlogDates.push(d);

    blogEntries.push({
      url: `${siteUrl}/blog/${post.slug}`,
      lastmod: rawDate || null,
    });
  }

  // 4. Collection Category entries (use most recent updatedAt among products in that collection)
  const categoryEntries: { url: string; lastmod: string | null }[] = [];

  for (const cat of Object.values(CATEGORY_PAGES)) {
    const matchingProducts = dbProducts.filter((p) => {
      const pCat = (p.category || "").toLowerCase();
      const pType = (p.type || "").toLowerCase();
      const pSub = (p.subCategory || "").toLowerCase();
      const fVal = cat.filterValue.toLowerCase();

      if (cat.filterType === "category") {
        return pCat === fVal || pSub === fVal;
      } else {
        return pType === fVal || pCat === fVal || pSub === fVal;
      }
    });

    const dates = matchingProducts
      .map((p) => p.updatedAt || p.createdAt)
      .filter((d): d is Date => Boolean(d));

    const maxDate =
      dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : null;

    categoryEntries.push({
      url: `${siteUrl}/collection/${cat.slug}`,
      lastmod: formatW3CDate(maxDate),
    });
  }

  // 5. Core pages
  const allDates = [...allProductDates, ...allBlogDates];
  const maxSiteDate =
    allDates.length > 0 ? new Date(Math.max(...allDates.map((d) => d.getTime()))) : null;
  const maxBlogDate =
    allBlogDates.length > 0
      ? new Date(Math.max(...allBlogDates.map((d) => d.getTime())))
      : null;

  const coreEntries: { url: string; lastmod: string | null }[] = [
    { url: `${siteUrl}`, lastmod: formatW3CDate(maxSiteDate) },
    { url: `${siteUrl}/collection`, lastmod: formatW3CDate(maxSiteDate) },
    { url: `${siteUrl}/our-heritage`, lastmod: "2026-10-15" },
    { url: `${siteUrl}/contact`, lastmod: "2026-10-15" },
    { url: `${siteUrl}/blog`, lastmod: formatW3CDate(maxBlogDate) },
  ];

  const allEntries = [
    ...coreEntries,
    ...categoryEntries,
    ...blogEntries,
    ...productEntries,
  ];

  const xmlUrls = allEntries
    .map((e) => {
      if (e.lastmod) {
        return `  <url>\n    <loc>${escapeXml(e.url)}</loc>\n    <lastmod>${escapeXml(e.lastmod)}</lastmod>\n  </url>`;
      }
      return `  <url>\n    <loc>${escapeXml(e.url)}</loc>\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  console.log(`Generated ${allEntries.length} sitemap URLs successfully.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Failed to build sitemap:", err);
  process.exit(1);
});
