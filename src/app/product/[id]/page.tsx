import { notFound } from "next/navigation";
import { REAL_POSHAKS, PoshakProduct, getPoshakDisplayName } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resolvedId =
    id === "sunehri-kesar-rajputi-poshak"
      ? "kesariya-sunehri-rajputi-poshak"
      : id === "kesari-gulab-rajputi-poshak"
      ? "kesariya-gulab-rajputi-poshak"
      : id;

  let product: PoshakProduct | undefined;

  try {
    const dbProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug: id }, { slug: resolvedId }, { id }],
        status: "PUBLISHED",
      },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
      },
    });

    if (dbProduct) {
      const images = dbProduct.images.map((img) => img.secureUrl);
      product = {
        id: dbProduct.slug,
        name: dbProduct.name,
        category: (dbProduct.category as any) || "Bridal",
        type: (dbProduct.type as any) || "Stitched",
        subCategory: dbProduct.subCategory || undefined,
        price: `₹ ${(dbProduct.priceInPaise / 100).toLocaleString("en-IN")}`,
        originalPrice: dbProduct.compareAtPriceInPaise
          ? `₹ ${(dbProduct.compareAtPriceInPaise / 100).toLocaleString("en-IN")}`
          : undefined,
        priceNote: dbProduct.priceNote || undefined,
        fabric: dbProduct.fabric,
        craft: dbProduct.craft,
        color: dbProduct.color,
        image: images[0] || "/placeholder.webp",
        additionalImages: images,
        imagePosition: dbProduct.imagePosition,
        imageScale: dbProduct.imageScale,
        description: dbProduct.description,
        details: Array.isArray(dbProduct.details) ? (dbProduct.details as string[]) : [],
        includes: Array.isArray(dbProduct.includes) ? (dbProduct.includes as string[]) : [],
        size: dbProduct.size || undefined,
        sizes: Array.isArray(dbProduct.sizes) ? (dbProduct.sizes as string[]) : undefined,
        quality: dbProduct.quality || undefined,
        work: dbProduct.work || undefined,
        odhna: dbProduct.odhna || undefined,
        bestFor: dbProduct.bestFor || undefined,
        soldOut: dbProduct.soldOut || false,
        stitchingAvailable: dbProduct.stitchingAvailable,
      };
    }
  } catch (e) {
    console.warn("DB metadata fetch fallback:", e);
  }

  if (!product) {
    product = REAL_POSHAKS.find((p) => p.id === resolvedId || p.id === id);
  }

  if (!product) {
    return {
      title: "Poshak Not Found | Rajwadi Royal Heritage",
    };
  }

  return {
    title: `${getPoshakDisplayName(product)} — Authentic Rajputi Poshak | Rajwadi`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolvedId =
    id === "sunehri-kesar-rajputi-poshak"
      ? "kesariya-sunehri-rajputi-poshak"
      : id === "kesari-gulab-rajputi-poshak"
      ? "kesariya-gulab-rajputi-poshak"
      : id;

  let product: PoshakProduct | undefined;

  try {
    const dbProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug: id }, { slug: resolvedId }, { id }],
        status: "PUBLISHED",
      },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
      },
    });

    if (dbProduct) {
      const images = dbProduct.images.map((img) => img.secureUrl);
      product = {
        id: dbProduct.slug,
        name: dbProduct.name,
        category: (dbProduct.category as any) || "Bridal",
        type: (dbProduct.type as any) || "Stitched",
        subCategory: dbProduct.subCategory || undefined,
        price: `₹ ${(dbProduct.priceInPaise / 100).toLocaleString("en-IN")}`,
        originalPrice: dbProduct.compareAtPriceInPaise
          ? `₹ ${(dbProduct.compareAtPriceInPaise / 100).toLocaleString("en-IN")}`
          : undefined,
        priceNote: dbProduct.priceNote || undefined,
        fabric: dbProduct.fabric,
        craft: dbProduct.craft,
        color: dbProduct.color,
        image: images[0] || "/placeholder.webp",
        additionalImages: images,
        imagePosition: dbProduct.imagePosition,
        imageScale: dbProduct.imageScale,
        description: dbProduct.description,
        details: Array.isArray(dbProduct.details) ? (dbProduct.details as string[]) : [],
        includes: Array.isArray(dbProduct.includes) ? (dbProduct.includes as string[]) : [],
        size: dbProduct.size || undefined,
        sizes: Array.isArray(dbProduct.sizes) ? (dbProduct.sizes as string[]) : undefined,
        quality: dbProduct.quality || undefined,
        work: dbProduct.work || undefined,
        odhna: dbProduct.odhna || undefined,
        bestFor: dbProduct.bestFor || undefined,
        soldOut: dbProduct.soldOut || false,
        stitchingAvailable: dbProduct.stitchingAvailable,
      };
    }
  } catch (e) {
    console.warn("DB product fetch fallback:", e);
  }

  if (!product) {
    product = REAL_POSHAKS.find((p) => p.id === resolvedId || p.id === id);
  }

  if (!product) {
    notFound();
  }

  // Get complementary products for "You May Also Like"
  const sameCategory = REAL_POSHAKS.filter(
    (p) => p.id !== product!.id && p.category.toLowerCase() === product!.category.toLowerCase()
  );
  const otherCategory = REAL_POSHAKS.filter(
    (p) => p.id !== product!.id && p.category.toLowerCase() !== product!.category.toLowerCase()
  );
  const relatedProducts = [...sameCategory, ...otherCategory].slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
