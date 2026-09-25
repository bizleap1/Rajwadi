import { prisma } from "../src/lib/prisma";

async function verifyDb() {
  console.log("=== Checking Neon PostgreSQL Database ===");
  
  const productCount = await prisma.product.count();
  console.log(`Total Products in DB: ${productCount}`);

  const sampleProducts = await prisma.product.findMany({
    take: 3,
    select: {
      id: true,
      name: true,
      priceInPaise: true,
      compareAtPriceInPaise: true,
      fabric: true,
      quality: true,
      work: true,
      odhna: true,
      bestFor: true,
      sizes: true,
    },
  });
  console.log("Sample Products details saved in DB:\n", JSON.stringify(sampleProducts, null, 2));

  const couponCount = await prisma.coupon.count();
  console.log(`\nTotal Coupons in DB: ${couponCount}`);

  const coupons = await prisma.coupon.findMany({
    select: {
      id: true,
      code: true,
      discountType: true,
      discountValue: true,
      applicableScope: true,
      applicableProducts: true,
      applicableCategories: true,
      usedCount: true,
      isActive: true,
    },
  });
  console.log("Coupons & Specific Scopes saved in DB:\n", JSON.stringify(coupons, null, 2));

  // Test creating and updating a dummy test coupon to prove live DB write capability
  console.log("\n--- Testing Live DB Write & Update ---");
  const testCode = "TEST_" + Date.now().toString().slice(-4);
  const createdCoupon = await prisma.coupon.create({
    data: {
      code: testCode,
      discountType: "PERCENTAGE",
      discountValue: 20,
      applicableScope: "SPECIFIC_PRODUCTS",
      applicableProducts: [sampleProducts[0]?.id || "sample-id"],
      minOrderValueInPaise: 100000,
      isActive: true,
    },
  });
  console.log(`Successfully Created live test coupon in DB: ${createdCoupon.code} (ID: ${createdCoupon.id})`);

  // Clean up the test coupon
  await prisma.coupon.delete({ where: { id: createdCoupon.id } });
  console.log(`Successfully Deleted test coupon from DB.`);
  console.log("=== DB Write & Read Verified Successfully! ===");
}

verifyDb()
  .catch((e) => {
    console.error("DB Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
