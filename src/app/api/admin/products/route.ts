import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { ProductFormSchema } from "@/lib/validations/product";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { color: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { displayOrder: "asc" },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products: (products as any[]).map((p: any) => ({
        ...p,
        images: (p.images as any[]).map((img: any) => ({
          id: img.id,
          publicId: img.publicId,
          secureUrl: img.secureUrl,
          displayOrder: img.displayOrder,
        })),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = ProductFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A product with slug "${data.slug}" already exists.` },
        { status: 409 }
      );
    }

    const created = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        category: data.category,
        type: data.type || "Stitched",
        subCategory: data.subCategory || null,
        priceInPaise: data.priceInPaise,
        compareAtPriceInPaise: data.compareAtPriceInPaise || null,
        priceNote: data.priceNote || null,
        fabric: data.fabric,
        craft: data.craft,
        color: data.color,
        quality: data.quality || null,
        work: data.work || null,
        odhna: data.odhna || null,
        bestFor: data.bestFor || null,
        description: data.description,
        details: data.details,
        includes: data.includes,
        size: data.size || null,
        sizes: data.sizes ? (data.sizes as any) : undefined,
        soldOut: data.soldOut || false,
        status: data.status,
        isFeatured: data.isFeatured,
        featuredOrder: data.featuredOrder,
        stock: data.stock,
        inStock: data.inStock,
        stitchingAvailable: data.stitchingAvailable,
        stitchingPriceInPaise: data.stitchingPriceInPaise,
        imagePosition: data.imagePosition,
        imageScale: data.imageScale,
        version: 1,
        images: {
          create: data.images.map((img, idx) => ({
            publicId: img.publicId || null,
            secureUrl: img.secureUrl,
            width: img.width || null,
            height: img.height || null,
            format: img.format || null,
            displayOrder: img.displayOrder ?? idx,
            altText: img.altText || null,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
