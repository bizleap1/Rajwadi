/**
 * Master Backend Hub for Rajwadi Rajputi Poshak
 * Centralized, organized access to DB, Auth, Services, Validations & Security.
 */

// 1. Database
export { prisma, default as db } from "./db/prisma";

// 2. Auth & Session Management
export {
  auth,
  getServerSession,
  requireAdminSession,
} from "./auth/auth";

export {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  emailOtp,
} from "./auth/auth-client";

// 3. Backend Services
export {
  sendOtpEmail,
  isResendConfigured,
  isSmtpConfigured,
} from "./services/email";

export {
  cloudinary,
  isCloudinaryConfigured,
  generateSignedUploadParams,
  deleteCloudinaryAsset,
  type CloudinarySignedParams,
} from "./services/cloudinary";

export {
  razorpayInstance,
  isRazorpayConfigured,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
  fetchRazorpayPayment,
} from "./services/razorpay";

export {
  generateReceiptHtml,
  downloadReceipt,
  type ReceiptOrderData,
} from "./services/receipt";

// 4. Validations
export {
  CartCheckoutItemSchema,
  DeliveryAddressSchema,
  CreateCheckoutOrderSchema,
  VerifyPaymentSchema,
  type DeliveryAddressValues,
  type CreateCheckoutOrderInput,
  type VerifyPaymentInput,
} from "./validations/checkout";

export {
  ProductImageSchema,
  ProductVariantSchema,
  ProductFormSchema,
  type ProductFormValues,
} from "./validations/product";

// 5. Security & Rate Limiting
export {
  checkRateLimit,
  getClientIp,
  type RateLimitOptions,
} from "./security/rate-limit";
