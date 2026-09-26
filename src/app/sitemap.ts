import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { REAL_POSHAKS } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rajwadirajputiposhak.com";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/our-heritage`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic Product routes
  const productRoutes: MetadataRoute.Sitemap = [];
  const addedIds = new Set<string>();

  try {
    const dbProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, slug: true, updatedAt: true },
    });

    for (const p of dbProducts) {
      const identifier = p.slug || p.id;
      if (!addedIds.has(identifier)) {
        addedIds.add(identifier);
        productRoutes.push({
          url: `${siteUrl}/product/${encodeURIComponent(identifier)}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching db products for sitemap:", error);
  }

  // Include static REAL_POSHAKS fallback catalogue
  for (const p of REAL_POSHAKS) {
    if (!addedIds.has(p.id)) {
      addedIds.add(p.id);
      productRoutes.push({
        url: `${siteUrl}/product/${encodeURIComponent(p.id)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...productRoutes];
}
