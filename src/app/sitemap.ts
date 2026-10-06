import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { REAL_POSHAKS } from "@/data/products";
import { SITE_URL } from "@/lib/siteUrl";

export const revalidate = 3600; // Cache and revalidate every 1 hour for fast Googlebot crawling

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL;

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
      url: `${siteUrl}/craft`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
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
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic Product routes
  const productRoutes: MetadataRoute.Sitemap = [];
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
        const imageUrl = p.images?.[0]?.secureUrl;
        productRoutes.push({
          url: `${siteUrl}/product/${encodeURIComponent(identifier)}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
          ...(imageUrl ? { images: [imageUrl] } : {}),
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
      const imageUrl = p.image?.startsWith("http")
        ? p.image
        : `${siteUrl}${p.image}`;
      productRoutes.push({
        url: `${siteUrl}/product/${encodeURIComponent(p.id)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      });
    }
  }

  return [...staticRoutes, ...productRoutes];
}
