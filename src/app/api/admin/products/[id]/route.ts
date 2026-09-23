import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { ProductFormSchema } from "@/lib/validations/product";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const validated = ProductFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Find current product
    const current = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { images: true },
    });

    if (!current) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Optimistic concurrency check
    if (data.version !== undefined && data.version !== current.version) {
      return NextResponse.json(
        {
          error:
            "Conflict: This product was modified by another session. Please refresh and re-apply your changes.",
        },
        { status: 409 }
      );
    }

    // Check slug collision if changed
    if (data.slug !== current.slug) {
      const slugCollision = await prisma.product.findUnique({
        where: { slug: data.slug },
      });
      if (slugCollision && slugCollision.id !== current.id) {
        return NextResponse.json(
          { error: `Slug "${data.slug}" is already in use by another product.` },
          { status: 409 }
        );
      }
    }

    // Identify deleted images to safely clean up Cloudinary assets if not referenced elsewhere
    const currentPublicIds = (current.images as any[])
      .map((img: any) => img.publicId)
      .filter((pid: any): pid is string => Boolean(pid));
    const newPublicIds = new Set(
      data.images.map((img: any) => img.publicId).filter(Boolean)
    );
    const removedPublicIds = currentPublicIds.filter(
      (pid: any) => !newPublicIds.has(pid)
    );

    // Perform atomic update
    const updated = await prisma.$transaction(async (tx: any) => {
      // Remove old image records
      await tx.productImage.deleteMany({
        where: { productId: current.id },
      });

      // Update product and create new images
      return await tx.product.update({
        where: { id: current.id },
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
          version: current.version + 1,
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
          images: {
            orderBy: { displayOrder: "asc" },
          },
        },
      });
    }, {
      maxWait: 15000,
      timeout: 30000,
    });

    // Schedule remote asset cleanup for removed images asynchronously
    if (removedPublicIds.length > 0) {
      for (const pid of removedPublicIds) {
        deleteCloudinaryAsset(pid).catch((err) =>
          console.warn("Async Cloudinary cleanup error:", err)
        );
      }
    }

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        images: true,
        orderItems: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product is referenced in historical orders
    if (product.orderItems.length > 0) {
      // Archive to preserve historical order references
      await prisma.product.update({
        where: { id: product.id },
        data: {
          status: "ARCHIVED",
          isFeatured: false,
          inStock: false,
        },
      });

      return NextResponse.json({
        message:
          "Product has historical order records. It has been securely archived and hidden from the storefront.",
        archived: true,
      });
    }

    // No historical orders: permanent deletion allowed
    const publicIdsToDelete = (product.images as any[])
      .map((img: any) => img.publicId)
      .filter((pid: any): pid is string => Boolean(pid));

    await prisma.product.delete({
      where: { id: product.id },
    });

    // Clean up Cloudinary assets
    for (const pid of publicIdsToDelete) {
      deleteCloudinaryAsset(pid).catch((err) =>
        console.warn("Cloudinary asset cleanup error:", err)
      );
    }

    return NextResponse.json({
      message: "Product permanently deleted.",
      deleted: true,
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
