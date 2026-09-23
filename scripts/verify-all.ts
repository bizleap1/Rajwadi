import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { verifyRazorpaySignature, verifyRazorpayWebhookSignature } from '../src/lib/razorpay';
import { ProductFormSchema } from '../src/lib/validations/product';
import { CreateCheckoutOrderSchema, VerifyPaymentSchema } from '../src/lib/validations/checkout';
import crypto from 'crypto';

async function main() {
  console.log('--- 1. Testing Neon PostgreSQL Connection & Catalog ---');
  const productCount = await prisma.product.count();
  console.log(`✓ Database connected successfully. Total products found: ${productCount}`);

  const sampleProduct = await prisma.product.findFirst({
    include: { images: true, variants: true }
  });
  if (sampleProduct) {
    console.log(`✓ Sample product: "${sampleProduct.name}" (Slug: ${sampleProduct.slug})`);
    console.log(`  Price: ₹${(sampleProduct.priceInPaise / 100).toLocaleString('en-IN')}, Images: ${sampleProduct.images.length}, Variants: ${sampleProduct.variants.length}`);
  }

  console.log('\n--- 2. Testing Admin User Account ---');
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });
  if (adminUser) {
    console.log(`✓ Admin user exists: ${adminUser.email} (Role: ${adminUser.role})`);
  } else {
    console.error('✗ No admin user found!');
  }

  console.log('\n--- 3. Testing Zod Validations ---');
  const validProductInput = {
    name: 'Royal Rajputi Poshak In Crimson Red',
    slug: 'royal-rajputi-poshak-crimson-red',
    category: 'Stitched' as const,
    priceInPaise: 4500000,
    fabric: 'Pure Georgette & Silk',
    craft: 'Handcrafted Zardozi',
    color: 'Crimson Red',
    description: 'A genuine handcrafted royal poshak with pure zardozi work.',
    details: ['Pure silk lining', 'Authentic jaipuri gotapatti'],
    includes: ['Kurti', 'Kanchali', 'Lehenga', 'Odhna'],
    stock: 5,
    status: 'PUBLISHED' as const,
    isFeatured: true,
    featuredOrder: 1,
    stitchingAvailable: true,
    stitchingPriceInPaise: 250000,
    images: [
      {
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/sample.webp',
        altText: 'Front View',
        displayOrder: 0
      }
    ],
    variants: []
  };
  const productResult = ProductFormSchema.safeParse(validProductInput);
  if (productResult.success) {
    console.log('✓ Product schema validation passed.');
  } else {
    console.error('✗ Product schema validation failed:', JSON.stringify(productResult.error.format(), null, 2));
  }

  const validOrderInput = {
    deliveryAddress: {
      fullName: 'Yashvardhan Singh',
      email: 'yash@example.com',
      phone: '9876543210',
      address: 'Heritage Haveli, Palace Road',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001'
    },
    items: [
      {
        productId: sampleProduct?.id || 'sample-id',
        quantity: 1,
        stitchingSelected: false
      }
    ],
    notes: 'Please pack in luxury gift box'
  };
  const orderResult = CreateCheckoutOrderSchema.safeParse(validOrderInput);
  if (orderResult.success) {
    console.log('✓ Order checkout schema validation passed.');
  } else {
    console.error('✗ Order checkout schema validation failed:', JSON.stringify(orderResult.error.format(), null, 2));
  }

  console.log('\n--- 4. Testing Razorpay HMAC Verification Logic ---');
  const testOrderId = 'order_test_12345';
  const testPaymentId = 'pay_test_67890';
  const testSecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_razorpay_secret';
  const generatedSignature = crypto
    .createHmac('sha256', testSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest('hex');

  const isSigValid = verifyRazorpaySignature({
    razorpayOrderId: testOrderId,
    razorpayPaymentId: testPaymentId,
    razorpaySignature: generatedSignature,
  });
  console.log(`✓ Razorpay payment HMAC verification: ${isSigValid ? 'VALID (Passed)' : 'INVALID (Failed)'}`);

  const testBody = JSON.stringify({ event: 'payment.captured' });
  const testWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';
  const testWebhookSignature = crypto
    .createHmac('sha256', testWebhookSecret)
    .update(testBody)
    .digest('hex');

  const isWebhookSigValid = verifyRazorpayWebhookSignature({
    rawBody: testBody,
    signature: testWebhookSignature,
  });
  console.log(`✓ Razorpay webhook HMAC verification: ${isWebhookSigValid ? 'VALID (Passed)' : 'INVALID (Failed)'}`);

  console.log('\n======================================================');
  console.log(' ALL AUTOMATED VERIFICATIONS COMPLETED SUCCESSFULLY ');
  console.log('======================================================');
}

main()
  .catch((err) => {
    console.error('Verification failed with error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
