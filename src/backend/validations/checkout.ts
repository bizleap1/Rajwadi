import { z } from "zod";

export const CartCheckoutItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  stitchingSelected: z.boolean().default(false),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Maximum 10 items per product"),
});

export const DeliveryAddressSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  address: z.string().min(6, "Please enter your complete street address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please select a state"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Please enter a valid 6-digit Indian PIN code"),
});

export const CreateCheckoutOrderSchema = z.object({
  items: z
    .array(CartCheckoutItemSchema)
    .min(1, "Your cart must contain at least one item"),
  deliveryAddress: DeliveryAddressSchema,
  notes: z.string().max(500).optional().nullable(),
  paymentScreenshotUrl: z.string().optional().nullable(),
  utrNumber: z.string().max(100).optional().nullable(),
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
