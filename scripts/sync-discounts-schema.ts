import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function syncSchema() {
  console.log("Connecting to PostgreSQL...");
  const client = await pool.connect();

  try {
    console.log("Creating 'coupons' table if it doesn't exist...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "coupons" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "code" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "discountType" TEXT NOT NULL DEFAULT 'PERCENTAGE',
        "discountValue" INTEGER NOT NULL,
        "maxDiscountInPaise" INTEGER,
        "minOrderValueInPaise" INTEGER NOT NULL DEFAULT 0,
        "usageLimit" INTEGER,
        "usedCount" INTEGER NOT NULL DEFAULT 0,
        "perUserLimit" INTEGER NOT NULL DEFAULT 1,
        "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "endDate" TIMESTAMP(3),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "applicableCategories" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating indices for 'coupons'...");
    await client.query(`
      CREATE INDEX IF NOT EXISTS "coupons_code_idx" ON "coupons"("code");
      CREATE INDEX IF NOT EXISTS "coupons_isActive_idx" ON "coupons"("isActive");
    `);

    console.log("Adding discount columns to 'orders' table if missing...");
    await client.query(`
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "couponId" TEXT;
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "couponCode" TEXT;
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discountInPaise" INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discountDetails" JSONB;
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS "orders_couponCode_idx" ON "orders"("couponCode");
    `);

    // Insert sample starter coupons if table is empty
    const checkCount = await client.query(`SELECT COUNT(*) FROM "coupons";`);
    const count = parseInt(checkCount.rows[0].count, 10);

    if (count === 0) {
      console.log("Seeding default starter coupons: ROYAL10, WELCOME500, FESTIVE15...");
      await client.query(`
        INSERT INTO "coupons" (
          "id", "code", "description", "discountType", "discountValue",
          "maxDiscountInPaise", "minOrderValueInPaise", "usageLimit", "usedCount",
          "perUserLimit", "startDate", "endDate", "isActive", "createdAt", "updatedAt"
        ) VALUES 
        (
          'cuid_royal10', 'ROYAL10', 'Exclusive 10% Royal Heritage discount for our patrons',
          'PERCENTAGE', 10, 150000, 300000, 500, 0, 1, NOW(), NOW() + INTERVAL '90 days', true, NOW(), NOW()
        ),
        (
          'cuid_welcome500', 'WELCOME500', 'Flat ₹500 off on your royal poshak purchase',
          'FIXED_AMOUNT', 50000, NULL, 250000, 1000, 0, 1, NOW(), NOW() + INTERVAL '180 days', true, NOW(), NOW()
        ),
        (
          'cuid_festive15', 'FESTIVE15', 'Festive Season special 15% discount',
          'PERCENTAGE', 15, 250000, 500000, 250, 0, 2, NOW(), NOW() + INTERVAL '60 days', true, NOW(), NOW()
        )
        ON CONFLICT ("code") DO NOTHING;
      `);
      console.log("✅ Seeded starter coupons successfully!");
    } else {
      console.log(`Found ${count} existing coupons in database.`);
    }

    console.log("✅ Schema sync completed successfully!");
  } catch (err) {
    console.error("❌ Schema sync error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

syncSchema();
