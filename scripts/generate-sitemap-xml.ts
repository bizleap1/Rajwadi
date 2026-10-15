import "dotenv/config";
import fs from "fs";
import path from "path";
import prisma from "../src/lib/prisma";
import { REAL_POSHAKS } from "../src/data/products";
import { CATEGORY_PAGES } from "../src/data/categoryData";
import { BLOG_POSTS } from "../src/data/blogData";
import { SITE_URL } from "../src/lib/siteUrl";

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}

function formatSitemapImageUrl(rawUrl: string | undefined | null, siteUrl: string): string | undefined {
  if (!rawUrl || typeof rawUrl !== "string") return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;
  try {
    let finalUrl: string;
    if (/^https?:\/\//i.test(trimmed)) {
      finalUrl = new URL(trimmed).href;
    } else {
      const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
      finalUrl = new URL(normalizedPath, siteUrl).href;
    }
    // Ensure URL has no raw spaces
    return escapeXml(finalUrl.replace(/\s+/g, "-"));
  } catch {
    return undefined;
  }
}

async function main() {
  const siteUrl = SITE_URL;
  const today = new Date().toISOString().split("T")[0];

  const xmlEntries: string[] = [];

  // 1. Static Pages (Excluding legacy redirecting /craft and /terms)
  const staticRoutes = [
    { url: `${siteUrl}`, lastmod: "2026-04-05" },
    { url: `${siteUrl}/collection`, lastmod: "2026-04-05" },
    { url: `${siteUrl}/our-heritage`, lastmod: "2026-03-25" },
    { url: `${siteUrl}/contact`, lastmod: "2026-03-25" },
    { url: `${siteUrl}/privacy-policy`, lastmod: "2026-01-15" },
    { url: `${siteUrl}/shipping-policy`, lastmod: "2026-01-15" },
    { url: `${siteUrl}/terms-and-conditions`, lastmod: "2026-01-15" },
  ];

  for (const r of staticRoutes) {
    xmlEntries.push(`  <url>
    <loc>${escapeXml(r.url)}</loc>
    <lastmod>${r.lastmod}</lastmod>
  </url>`);
  }

  // 2. Category Pages
  for (const cat of Object.values(CATEGORY_PAGES)) {
    xmlEntries.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/collection/${cat.slug}`)}</loc>
    <lastmod>2026-04-05</lastmod>
  </url>`);
  }

  // 3. Blog Index and Posts
  xmlEntries.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/blog`)}</loc>
    <lastmod>2026-04-05</lastmod>
  </url>`);

  for (const post of BLOG_POSTS) {
    xmlEntries.push(`  <url>
    <loc>${escapeXml(`${siteUrl}/blog/${post.slug}`)}</loc>
    <lastmod>${post.updatedAt || post.publishedAt}</lastmod>
  </url>`);
  }

  // 4. Products (clean standard sitemap with loc and lastmod)
  const addedIds = new Set<string>();

  try {
    const dbProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    for (const p of dbProducts) {
      const identifier = p.slug || p.id;
      if (!addedIds.has(identifier)) {
        addedIds.add(identifier);
        const lastmod = p.updatedAt
          ? new Date(p.updatedAt).toISOString().split("T")[0]
          : (p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : today);
        xmlEntries.push(`  <url>\n    <loc>${escapeXml(`${siteUrl}/product/${encodeURIComponent(identifier)}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`);
      }
    }
  } catch (error) {
    console.warn("Could not query DB products, falling back to static catalogue:", error);
  }

  for (const p of REAL_POSHAKS) {
    const identifier = p.id;
    if (!addedIds.has(identifier)) {
      addedIds.add(identifier);
      const lastmod = (p as any).updatedAt
        ? new Date((p as any).updatedAt).toISOString().split("T")[0]
        : (p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : "2026-03-20");
      xmlEntries.push(`  <url>\n    <loc>${escapeXml(`${siteUrl}/product/${encodeURIComponent(identifier)}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries.join("\n")}\n</urlset>\n`;

  const outputPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf-8");
  console.log(`Generated public/sitemap.xml with ${xmlEntries.length} URLs (clean standard sitemap protocol, no image schema)`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to build sitemap.xml:", err);
  process.exit(1);
});
