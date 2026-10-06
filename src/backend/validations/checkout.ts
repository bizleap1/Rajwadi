import { z } from "zod";

export const CartCheckoutItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().nullish(),
  size: z.string().nullish(),
  stitchingSelected: z.boolean().nullish().default(false),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Maximum 10 items per product"),
});

export const DeliveryAddressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, "").slice(-10))
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message: "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)",
    }),
  address: z.string().trim().min(5, "Please enter your complete street address"),
  city: z.string().trim().min(2, "Please enter your city"),
  state: z.string().trim().min(2, "Please select a state"),
  pincode: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, "").slice(-6))
    .refine((val) => /^\d{6}$/.test(val), {
      message: "Please enter a valid 6-digit Indian PIN code",
    }),
});

export const CreateCheckoutOrderSchema = z.object({
  items: z
    .array(CartCheckoutItemSchema)
    .min(1, "Your cart must contain at least one item"),
  deliveryAddress: DeliveryAddressSchema,
  paymentMethod: z.enum(["RAZORPAY", "UPI_SCANNER"]).default("RAZORPAY").optional(),
  notes: z.string().max(500).nullish(),
  paymentScreenshotUrl: z.string().nullish(),
  utrNumber: z.string().max(100).nullish(),
  couponCode: z.string().nullish(),
});

export const VerifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Internal order ID is required"),
  razorpayOrderId: z.string().min(1, "Razorpay order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay payment ID is required"),
  razorpaySignature: z.string().min(1, "Razorpay signature is required"),
});

export type DeliveryAddressValues = z.infer<typeof DeliveryAddressSchema>;
export type CreateCheckoutOrderInput = z.infer<typeof CreateCheckoutOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
