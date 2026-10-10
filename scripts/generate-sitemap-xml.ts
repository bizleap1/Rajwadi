import "dotenv/config";
import fs from "fs";
import path from "path";
import prisma from "../src/lib/prisma";
import { ALL_COLLECTION_PRODUCTS } from "../src/data/collections";
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
    return escapeXml(finalUrl);
  } catch {
    return undefined;
  }
}

async function main() {
  const siteUrl = SITE_URL;
  const today = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    { url: `${siteUrl}`, priority: "1.0", changefreq: "daily" },
    { url: `${siteUrl}/collection`, priority: "0.9", changefreq: "daily" },
    { url: `${siteUrl}/our-heritage`, priority: "0.7", changefreq: "monthly" },
    { url: `${siteUrl}/contact`, priority: "0.7", changefreq: "monthly" },
    { url: `${siteUrl}/privacy-policy`, priority: "0.5", changefreq: "monthly" },
    { url: `${siteUrl}/shipping-policy`, priority: "0.5", changefreq: "monthly" },
    { url: `${siteUrl}/terms-and-conditions`, priority: "0.5", changefreq: "monthly" },
  ];

  const xmlEntries: string[] = [];

  for (const r of staticRoutes) {
    xmlEntries.push(`  <url>
    <loc>${escapeXml(r.url)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`);
  }

  const addedIds = new Set<string>();

  try {
    const dbProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
        images: {
          take: 1,
          orderBy: { displayOrder: "asc" },
          select: { secureUrl: true },
        },
      },
    });

    for (const p of dbProducts) {
      const identifier = p.slug || p.id;
      if (!addedIds.has(identifier)) {
        addedIds.add(identifier);
        const imageUrl = formatSitemapImageUrl(p.images?.[0]?.secureUrl, siteUrl);
        const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString().split("T")[0] : today;
        let entry = `  <url>\n    <loc>${escapeXml(`${siteUrl}/product/${encodeURIComponent(identifier)}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>`;
        if (imageUrl) {
          entry += `\n    <image:image>\n      <image:loc>${imageUrl}</image:loc>\n    </image:image>`;
        }
        entry += `\n  </url>`;
        xmlEntries.push(entry);
      }
    }
  } catch (error) {
    console.warn("Could not query DB products, falling back to static catalogue:", error);
  }

  for (const p of ALL_COLLECTION_PRODUCTS) {
    if (!addedIds.has(p.id)) {
      addedIds.add(p.id);
      const imageUrl = formatSitemapImageUrl(p.image, siteUrl);
      let entry = `  <url>\n    <loc>${escapeXml(`${siteUrl}/product/${encodeURIComponent(p.id)}`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>`;
      if (imageUrl) {
        entry += `\n    <image:image>\n      <image:loc>${imageUrl}</image:loc>\n    </image:image>`;
      }
      entry += `\n  </url>`;
      xmlEntries.push(entry);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${xmlEntries.join("\n")}\n</urlset>\n`;

  const outputPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf-8");
  console.log(`Generated public/sitemap.xml with ${xmlEntries.length} URLs`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to build sitemap.xml:", err);
  process.exit(1);
});
