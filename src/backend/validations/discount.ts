import { z } from "zod";

export const DiscountTypeEnum = z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]);
export type DiscountType = z.infer<typeof DiscountTypeEnum>;

export const CouponFormSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(25, "Coupon code cannot exceed 25 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code can only contain uppercase letters, numbers, hyphens, and underscores")
    .transform((val) => val.trim().toUpperCase()),
  description: z.string().max(200, "Description cannot exceed 200 characters").optional().nullable(),
  discountType: DiscountTypeEnum.default("PERCENTAGE"),
  discountValue: z.coerce
    .number()
    .min(1, "Discount value must be greater than 0"),
  maxDiscountInRupees: z.coerce
    .number()
    .min(0, "Max discount must be 0 or positive")
    .optional()
    .nullable(),
  minOrderValueInRupees: z.coerce
    .number()
    .min(0, "Minimum order value must be 0 or positive")
    .default(0),
  usageLimit: z.coerce
    .number()
    .int()
    .min(1, "Usage limit must be at least 1")
    .optional()
    .nullable(),
  perUserLimit: z.coerce
    .number()
    .int()
    .min(1, "Per user limit must be at least 1")
    .default(1),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  applicableScope: z.enum(["ALL", "SPECIFIC_PRODUCTS", "SPECIFIC_CATEGORIES"]).default("ALL"),
  applicableProducts: z.array(z.string()).optional().nullable(),
  applicableCategories: z.array(z.string()).optional().nullable(),
});

export type CouponFormValues = z.infer<typeof CouponFormSchema>;

export const CartItemCouponSchema = z.object({
  productId: z.string(),
  slug: z.string().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  priceInPaise: z.number().int().optional(),
  unitPriceInPaise: z.number().int().optional(),
  quantity: z.number().int().default(1),
});

export const ValidateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").transform((val) => val.trim().toUpperCase()),
  subtotalInPaise: z.number().int().min(0, "Subtotal must be positive"),
  shippingInPaise: z.number().int().min(0).default(0),
  categories: z.array(z.string()).optional().default([]),
  items: z.array(CartItemCouponSchema).optional().default([]),
  email: z.string().email("Invalid email").optional().nullable(),
});

export type ValidateCouponInput = z.infer<typeof ValidateCouponSchema>;
