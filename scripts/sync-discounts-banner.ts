import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function syncDiscountBanner() {
  console.log("Connecting to PostgreSQL...");
  const client = await pool.connect();

  try {
    console.log("Adding showOnCollection to coupons table...");
    await client.query(`
      ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "showOnCollection" BOOLEAN NOT NULL DEFAULT false;
      CREATE INDEX IF NOT EXISTS "coupons_showOnCollection_idx" ON "coupons"("showOnCollection");
    `);

    console.log("showOnCollection column added successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

syncDiscountBanner();
