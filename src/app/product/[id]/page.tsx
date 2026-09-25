import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";
import { REAL_POSHAKS } from "@/data/products";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

function parsePriceToPaise(priceStr: string): number {
  const numeric = priceStr.replace(/[^0-9]/g, "");
  const inRupees = numeric ? parseInt(numeric, 10) : 0;
  return inRupees * 100;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  let product: any = null;
  try {
    product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
        status: "PUBLISHED",
      },
    });
  } catch {}

  if (!product) {
    product = REAL_POSHAKS.find((p) => p.id === id || p.id === decodeURIComponent(id));
  }

  if (!product) {
    return {
      title: "Poshak Not Found | Rajwadi Royal Heritage",
    };
  }

  return {
    title: `${product.name} — Authentic Rajputi Poshak | Rajwadi`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  let dbProduct: any = null;
  try {
    dbProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug: id }, { slug: decodedId }, { id }],
        status: "PUBLISHED",
      },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: true,
      },
    });
  } catch {}

  const fallbackProduct = REAL_POSHAKS.find(
    (p) => p.id === id || p.id === decodedId || p.name.toLowerCase() === decodedId.toLowerCase()
  );

  if (!dbProduct && !fallbackProduct) {
    notFound();
  }

  // Complementary related products
  let relatedProducts: any[] = [];
  try {
    const relatedDbProducts = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(dbProduct ? { id: { not: dbProduct.id } } : {}),
      },
      take: 4,
      orderBy: { isFeatured: "desc" },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (relatedDbProducts && relatedDbProducts.length > 0) {
      relatedProducts = relatedDbProducts.map((p) => {
        const pImages = p.images.map((img) => img.secureUrl);
        return {
          id: p.slug,
          slug: p.slug,
          name: p.name,
          category: p.category,
          priceInPaise: p.priceInPaise,
          price: `₹ ${(p.priceInPaise / 100).toLocaleString("en-IN")}`,
          image: pImages[0] || "/placeholder.webp",
          additionalImages: pImages,
          fabric: p.fabric,
          craft: p.craft,
          color: p.color,
          description: p.description,
          details: Array.isArray(p.details) ? (p.details as string[]) : [],
          includes: Array.isArray(p.includes) ? (p.includes as string[]) : [],
          imagePosition: p.imagePosition,
          imageScale: p.imageScale,
          inStock: p.inStock && p.stock > 0,
        };
      });
    }
  } catch {}

  if (relatedProducts.length === 0) {
    relatedProducts = REAL_POSHAKS.filter((p) => p.id !== (dbProduct?.slug || fallbackProduct?.id)).slice(0, 4);
  }

  let formattedProduct: any;

  if (dbProduct) {
    const formattedImages = dbProduct.images.map((img: any) => img.secureUrl);
    const mainImage = formattedImages[0] || "/placeholder.webp";

    formattedProduct = {
      id: dbProduct.slug,
      internalId: dbProduct.id,
      slug: dbProduct.slug,
      name: dbProduct.name,
      category: dbProduct.category,
      priceInPaise: dbProduct.priceInPaise,
      priceFormatted: `₹ ${(dbProduct.priceInPaise / 100).toLocaleString("en-IN")}`,
      price: `₹ ${(dbProduct.priceInPaise / 100).toLocaleString("en-IN")}`,
      compareAtPriceInPaise: dbProduct.compareAtPriceInPaise,
      fabric: dbProduct.fabric,
      craft: dbProduct.craft,
      color: dbProduct.color,
      description: dbProduct.description,
      details: Array.isArray(dbProduct.details) ? (dbProduct.details as string[]) : [],
      includes: Array.isArray(dbProduct.includes) ? (dbProduct.includes as string[]) : [],
      image: mainImage,
      additionalImages: formattedImages,
      imagePosition: dbProduct.imagePosition,
      imageScale: dbProduct.imageScale,
      inStock: dbProduct.inStock && dbProduct.stock > 0,
      stock: dbProduct.stock,
      stitchingAvailable: dbProduct.stitchingAvailable,
      stitchingPriceInPaise: dbProduct.stitchingPriceInPaise,
      stitchingPriceFormatted: `₹ ${(dbProduct.stitchingPriceInPaise / 100).toLocaleString("en-IN")}`,
      isFeatured: dbProduct.isFeatured,
    };
  } else if (fallbackProduct) {
    const priceInPaise = parsePriceToPaise(fallbackProduct.price);
    const compareAtPaise = fallbackProduct.originalPrice
      ? parsePriceToPaise(fallbackProduct.originalPrice)
      : null;

    formattedProduct = {
      ...fallbackProduct,
      priceInPaise,
      priceFormatted: fallbackProduct.price,
      compareAtPriceInPaise: compareAtPaise,
      inStock: !fallbackProduct.soldOut,
      stitchingPriceInPaise: 250000,
      stitchingPriceFormatted: "₹ 2,500",
    };
  }

  return (
    <ProductDetailClient
      product={formattedProduct}
      relatedProducts={relatedProducts}
    />
  );
}
