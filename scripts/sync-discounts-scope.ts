import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function syncDiscountScope() {
  console.log("Connecting to PostgreSQL...");
  const client = await pool.connect();

  try {
    console.log("Adding applicableScope and applicableProducts to coupons table...");
    await client.query(`
      ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "applicableScope" TEXT NOT NULL DEFAULT 'ALL';
      ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "applicableProducts" JSONB;
    `);

    console.log("Columns added successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

syncDiscountScope();
