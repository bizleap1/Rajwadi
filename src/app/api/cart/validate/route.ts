import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CartItemInputSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  stitchingSelected: z.boolean().default(false),
  quantity: z.number().int().min(1).max(10),
});

const ValidateCartSchema = z.object({
  items: z.array(CartItemInputSchema),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ValidateCartSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid cart data", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { items } = validated.data;

    if (items.length === 0) {
      return NextResponse.json({
        items: [],
        subtotalInPaise: 0,
        shippingInPaise: 0,
        stitchingInPaise: 0,
        totalInPaise: 0,
        warnings: [],
      });
    }

    const productIds = items.map((i) => i.productId);

    // Fetch all referenced products from DB
    const dbProducts = await prisma.product.findMany({
      where: {
        OR: [{ id: { in: productIds } }, { slug: { in: productIds } }],
        status: "PUBLISHED",
      },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    const productMap = new Map();
    for (const p of dbProducts) {
      productMap.set(p.id, p);
      productMap.set(p.slug, p);
    }

    const validatedItems = [];
    const warnings: string[] = [];
    let subtotalInPaise = 0;
    let stitchingInPaise = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        warnings.push(
          `An item in your cart is no longer available and was removed.`
        );
        continue;
      }

      if (!product.inStock || product.stock <= 0) {
        warnings.push(`"${product.name}" is currently out of stock.`);
        continue;
      }

      // Check quantity against available stock
      const clampedQty = Math.min(item.quantity, product.stock);
      if (clampedQty < item.quantity) {
        warnings.push(
          `Quantity for "${product.name}" was adjusted to available stock (${clampedQty}).`
        );
      }

      let unitPriceInPaise = product.priceInPaise;
      let variantName = item.size || null;

      if (item.variantId) {
        const variant = product.variants.find((v: any) => v.id === item.variantId);
        if (variant) {
          unitPriceInPaise += variant.priceAdjustmentInPaise;
          variantName = variant.name;
        }
      }

      let itemStitchingPrice = 0;
      let stitchingActive = false;

      if (item.stitchingSelected && product.stitchingAvailable) {
        stitchingActive = true;
        itemStitchingPrice = product.stitchingPriceInPaise;
      }

      const itemTotal = unitPriceInPaise * clampedQty;
      subtotalInPaise += itemTotal;
      stitchingInPaise += itemStitchingPrice * clampedQty;

      const mainImage = product.images[0]?.secureUrl || "/placeholder.webp";

      validatedItems.push({
        productId: product.slug,
        internalId: product.id,
        name: product.name,
        category: product.category,
        size: variantName || (product.category === "Unstitched" ? "Unstitched" : "Stitched"),
        stitchingSelected: stitchingActive,
        stitchingPriceInPaise: itemStitchingPrice,
        unitPriceInPaise,
        quantity: clampedQty,
        totalInPaise: itemTotal + itemStitchingPrice * clampedQty,
        image: mainImage,
        inStock: true,
        stock: product.stock,
      });
    }

    const shippingInPaise = 0; // Explicit free shipping policy
    const totalInPaise = subtotalInPaise + stitchingInPaise + shippingInPaise;

    return NextResponse.json({
      items: validatedItems,
      subtotalInPaise,
      stitchingInPaise,
      shippingInPaise,
      totalInPaise,
      subtotalFormatted: `₹ ${(subtotalInPaise / 100).toLocaleString("en-IN")}`,
      stitchingFormatted: `₹ ${(stitchingInPaise / 100).toLocaleString("en-IN")}`,
      shippingFormatted: "FREE",
      totalFormatted: `₹ ${(totalInPaise / 100).toLocaleString("en-IN")}`,
      warnings,
    });
  } catch (error) {
    console.error("POST /api/cart/validate error:", error);
    return NextResponse.json(
      { error: "Failed to validate cart" },
      { status: 500 }
    );
  }
}
