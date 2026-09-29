import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "featured";
    const featuredOnly = searchParams.get("featured") === "true";
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const where: any = {
      status: "PUBLISHED",
    };

    if (featuredOnly) {
      where.isFeatured = true;
    }

    if (category && category !== "ALL") {
      where.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { color: { contains: search, mode: "insensitive" } },
        { craft: { contains: search, mode: "insensitive" } },
        { fabric: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: any = [];
    if (sort === "price-asc") {
      orderBy = [{ priceInPaise: "asc" }, { sequenceNumber: "asc" }, { createdAt: "asc" }];
    } else if (sort === "price-desc") {
      orderBy = [{ priceInPaise: "desc" }, { sequenceNumber: "asc" }, { createdAt: "asc" }];
    } else {
      // Default: stable sequence order internally assigned (#1, #2, #3, ...)
      orderBy = [{ sequenceNumber: "asc" }, { createdAt: "asc" }];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: true,
      },
    });

    const formatted = (products as any[]).map((p: any) => {
      const images = (p.images || []).map((img: any) => img.secureUrl);
      const mainImage = images[0] || "/placeholder.webp";
      return {
        id: p.slug, // Keep slug as id for frontend routing compatibility
        internalId: p.id,
        sequenceNumber: p.sequenceNumber ?? undefined,
        slug: p.slug,
        name: p.name,
        category: p.category,
        subCategory: p.subCategory || undefined,
        type: p.type || "Stitched",
        priceInPaise: p.priceInPaise,
        priceFormatted: `₹ ${(p.priceInPaise / 100).toLocaleString("en-IN")}`,
        price: `₹ ${(p.priceInPaise / 100).toLocaleString("en-IN")}`, // Legacy string field
        originalPrice: p.compareAtPriceInPaise
          ? `₹ ${(p.compareAtPriceInPaise / 100).toLocaleString("en-IN")}`
          : undefined,
        priceNote: p.priceNote || undefined,
        fabric: p.fabric,
        craft: p.craft,
        color: p.color,
        description: p.description,
        details: Array.isArray(p.details) ? p.details : [],
        includes: Array.isArray(p.includes) ? p.includes : [],
        image: mainImage,
        additionalImages: images,
        imagePosition: p.imagePosition,
        imageScale: p.imageScale,
        inStock: p.inStock && p.stock > 0,
        stock: p.stock,
        soldOut: (p as any).soldOut || !p.inStock || p.stock <= 0,
        stitchingAvailable: p.stitchingAvailable,
        stitchingPriceInPaise: p.stitchingPriceInPaise,
        stitchingPriceFormatted: `₹ ${(p.stitchingPriceInPaise / 100).toLocaleString("en-IN")}`,
        isFeatured: p.isFeatured,
        enquiryOnly: (p as any).enquiryOnly ?? ((p.category || "").toLowerCase() === "jewellery" || (p.type || "").toLowerCase() === "jewellery"),
        createdAt: p.createdAt.toISOString(),
      };
    });

    return NextResponse.json(
      {
        products: formatted,
        total: formatted.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
