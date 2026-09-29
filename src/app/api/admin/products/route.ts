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

    const andConditions: any[] = [];

    if (search && search.trim()) {
      const q = search.trim();
      const numMatch = q.replace(/^#/, "");
      const parsedNum = parseInt(numMatch, 10);
      const searchOr: any[] = [
        { name: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { color: { contains: q, mode: "insensitive" } },
        { fabric: { contains: q, mode: "insensitive" } },
        { craft: { contains: q, mode: "insensitive" } },
      ];
      if (!isNaN(parsedNum) && String(parsedNum) === numMatch) {
        searchOr.push({ sequenceNumber: parsedNum });
      }
      andConditions.push({
        OR: searchOr,
      });
    }

    if (category && category !== "ALL") {
      const catTrim = category.trim();
      const catLower = catTrim.toLowerCase();

      if (catLower === "stitched" || catLower === "unstitched") {
        andConditions.push({
          OR: [
            { category: { equals: catTrim, mode: "insensitive" } },
            { type: { equals: catTrim, mode: "insensitive" } },
            { subCategory: { equals: catTrim, mode: "insensitive" } },
          ],
        });
      } else if (catLower === "jewellery") {
        andConditions.push({
          OR: [
            { category: { equals: "Jewellery", mode: "insensitive" } },
            { type: { equals: "Jewellery", mode: "insensitive" } },
          ],
        });
      } else if (catLower === "traditional") {
        andConditions.push({
          OR: [
            { category: { equals: "Traditional", mode: "insensitive" } },
            { subCategory: { equals: "Traditional", mode: "insensitive" } },
            { craft: { contains: "traditional", mode: "insensitive" } },
            { description: { contains: "traditional", mode: "insensitive" } },
          ],
        });
      } else {
        andConditions.push({
          OR: [
            { category: { equals: catTrim, mode: "insensitive" } },
            { subCategory: { equals: catTrim, mode: "insensitive" } },
          ],
        });
      }
    }

    if (status && status !== "ALL") {
      andConditions.push({
        status: status,
      });
    }

    const where: any = andConditions.length > 0 ? { AND: andConditions } : {};

    const [products, total, distinctCats] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [{ sequenceNumber: "asc" }, { createdAt: "asc" }],
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { displayOrder: "asc" },
          },
        },
      }),
      prisma.product.count({ where }),
      prisma.product.findMany({
        select: { category: true },
        distinct: ["category"],
      }),
    ]);

    const standardCategories = [
      "Bridal",
      "Festive",
      "Everyday",
      "Jewellery",
      "Stitched",
      "Unstitched",
      "Traditional",
    ];

    const categorySet = new Set<string>();
    const allCategories: string[] = [];

    // Add standard preset categories first
    for (const cat of standardCategories) {
      const key = cat.toLowerCase();
      if (!categorySet.has(key)) {
        categorySet.add(key);
        allCategories.push(cat);
      }
    }

    // Add any categories discovered from products in database
    for (const item of distinctCats) {
      if (item.category && item.category.trim()) {
        const cat = item.category.trim();
        const key = cat.toLowerCase();
        if (!categorySet.has(key)) {
          categorySet.add(key);
          allCategories.push(cat);
        }
      }
    }

    return NextResponse.json({
      products: products.map((p) => ({
        ...p,
        images: p.images.map((img) => ({
          id: img.id,
          publicId: img.publicId,
          secureUrl: img.secureUrl,
          displayOrder: img.displayOrder,
        })),
      })),
      categories: allCategories,
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

    const maxSeq = await prisma.product.aggregate({
      _max: { sequenceNumber: true },
    });
    const nextSequenceNumber = (maxSeq._max.sequenceNumber || 0) + 1;

    const created = await prisma.product.create({
      data: {
        sequenceNumber: nextSequenceNumber,
        name: data.name,
        slug: data.slug,
        category: data.category,
        subCategory: data.subCategory || null,
        type: data.type || null,
        priceInPaise: data.priceInPaise,
        compareAtPriceInPaise: data.compareAtPriceInPaise || null,
        priceNote: data.priceNote || null,
        fabric: data.fabric,
        craft: data.craft,
        work: data.work || data.craft || null,
        quality: data.quality || null,
        odhna: data.odhna || null,
        bestFor: data.bestFor || null,
        size: data.size || (data.sizes && data.sizes.length > 0 ? data.sizes.join(", ") : null),
        sizes: data.sizes || [],
        color: data.color,
        description: data.description,
        details: data.details,
        includes: data.includes,
        status: data.status,
        soldOut: data.soldOut ?? false,
        enquiryOnly: data.enquiryOnly ?? false,
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

    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/collection");
      revalidatePath("/api/products");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
