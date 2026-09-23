import { z } from "zod";

export const ProductImageSchema = z.object({
  id: z.string().optional(),
  publicId: z.string().nullable().optional(),
  secureUrl: z.string().min(1, "Image URL is required"),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  format: z.string().nullable().optional(),
  displayOrder: z.number().int().default(0),
  altText: z.string().nullable().optional(),
});

export const ProductVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().nullable().optional(),
  priceAdjustmentInPaise: z.number().int().default(0),
  stock: z.number().int().min(0, "Stock cannot be negative").default(10),
});

export const ProductFormSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters").max(150),
    slug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      ),
    category: z.string().min(1, "Category is required"),
    type: z.string().optional().default("Stitched"),
    subCategory: z.string().nullable().optional(),
    priceInPaise: z
      .number()
      .int("Price must be an integer in paise")
      .min(100, "Price must be at least ₹1 (100 paise)"),
    compareAtPriceInPaise: z
      .number()
      .int()
      .min(0)
      .nullable()
      .optional(),
    priceNote: z.string().nullable().optional(),
    fabric: z.string().min(2, "Fabric description is required"),
    craft: z.string().min(2, "Craft description is required"),
    color: z.string().min(2, "Color is required"),
    quality: z.string().nullable().optional(),
    work: z.string().nullable().optional(),
    odhna: z.string().nullable().optional(),
    bestFor: z.string().nullable().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    details: z.array(z.string()).min(1, "At least one detail item is required"),
    includes: z.array(z.string()).min(1, "At least one included item is required"),
    size: z.string().nullable().optional(),
    sizes: z.array(z.string()).optional(),
    soldOut: z.boolean().optional().default(false),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
    isFeatured: z.boolean().default(false),
    featuredOrder: z.number().int().default(0),
    stock: z.number().int().min(0, "Stock cannot be negative").default(10),
    inStock: z.boolean().default(true),
    stitchingAvailable: z.boolean().default(false),
    stitchingPriceInPaise: z.number().int().min(0).default(0),
    imagePosition: z.string().default("center 5%"),
    imageScale: z.number().min(0.5).max(2.0).default(1.0),
    version: z.number().int().optional(),
    images: z.array(ProductImageSchema).default([]),
    variants: z.array(ProductVariantSchema).default([]),
  })
  .refine(
    (data) => {
      if (data.status === "PUBLISHED") {
        return data.images.length > 0;
      }
      return true;
    },
    {
      message: "A published product must have at least one image",
      path: ["images"],
    }
  )
  .refine(
    (data) => {
      if (data.stitchingAvailable) {
        return data.stitchingPriceInPaise >= 0;
      }
      return true;
    },
    {
      message: "Stitching price must be 0 or greater when stitching is available",
      path: ["stitchingPriceInPaise"],
    }
  );

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
