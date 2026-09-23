import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        status: "PUBLISHED",
      },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or currently unavailable" },
        { status: 404 }
      );
    }

    const images = (product.images as any[]).map((img: any) => img.secureUrl);
    const mainImage = images[0] || "/placeholder.webp";

    const formatted = {
      id: product.slug,
      internalId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      type: product.type || "Stitched",
      subCategory: product.subCategory || product.category,
      priceInPaise: product.priceInPaise,
      priceFormatted: `₹ ${(product.priceInPaise / 100).toLocaleString("en-IN")}`,
      price: `₹ ${(product.priceInPaise / 100).toLocaleString("en-IN")}`,
      compareAtPriceInPaise: product.compareAtPriceInPaise,
      originalPrice: product.compareAtPriceInPaise
        ? `₹ ${(product.compareAtPriceInPaise / 100).toLocaleString("en-IN")}`
        : undefined,
      priceNote: product.priceNote || undefined,
      fabric: product.fabric,
      craft: product.craft,
      color: product.color,
      quality: product.quality || undefined,
      work: product.work || undefined,
      odhna: product.odhna || undefined,
      bestFor: product.bestFor || undefined,
      description: product.description,
      details: Array.isArray(product.details) ? product.details : [],
      includes: Array.isArray(product.includes) ? product.includes : [],
      size: product.size || undefined,
      sizes: Array.isArray(product.sizes) ? product.sizes : undefined,
      soldOut: product.soldOut || false,
      image: mainImage,
      additionalImages: images,
      imagePosition: product.imagePosition,
      imageScale: product.imageScale,
      inStock: product.inStock && product.stock > 0 && !product.soldOut,
      stock: product.stock,
      stitchingAvailable: product.stitchingAvailable,
      stitchingPriceInPaise: product.stitchingPriceInPaise,
      stitchingPriceFormatted: `₹ ${(product.stitchingPriceInPaise / 100).toLocaleString("en-IN")}`,
      isFeatured: product.isFeatured,
      variants: (product.variants as any[]).map((v: any) => ({
        id: v.id,
        name: v.name,
        priceAdjustmentInPaise: v.priceAdjustmentInPaise,
        stock: v.stock,
      })),
      createdAt: product.createdAt.toISOString(),
    };

    return NextResponse.json(
      { product: formatted },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
