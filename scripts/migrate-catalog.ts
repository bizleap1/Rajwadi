import "dotenv/config";
import fs from "fs";
import path from "path";
import prisma from "../src/lib/prisma";
import { REAL_POSHAKS } from "../src/data/products";
import { isCloudinaryConfigured, cloudinary } from "../src/lib/cloudinary";

const MIGRATION_MAP_FILE = path.join(process.cwd(), ".migration-map.json");

function parsePriceToPaise(priceStr: string): number {
  const numeric = priceStr.replace(/[^0-9]/g, "");
  const inRupees = numeric ? parseInt(numeric, 10) : 0;
  return inRupees * 100; // Convert to paise
}

interface MigrationMap {
  uploadedImages: Record<string, { publicId: string; secureUrl: string }>;
  migratedProducts: string[];
}

function loadMigrationMap(): MigrationMap {
  if (fs.existsSync(MIGRATION_MAP_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(MIGRATION_MAP_FILE, "utf-8"));
    } catch {
      // ignore
    }
  }
  return { uploadedImages: {}, migratedProducts: [] };
}

function saveMigrationMap(map: MigrationMap) {
  fs.writeFileSync(MIGRATION_MAP_FILE, JSON.stringify(map, null, 2), "utf-8");
}

async function uploadLocalImageToCloudinary(
  relativePath: string,
  dryRun: boolean,
  map: MigrationMap
): Promise<{ secureUrl: string; publicId: string | null }> {
  // Check cache first
  if (map.uploadedImages[relativePath]) {
    return map.uploadedImages[relativePath];
  }

  const localAbsolutePath = path.join(process.cwd(), "public", relativePath.replace(/^\//, ""));

  if (!fs.existsSync(localAbsolutePath)) {
    console.warn(`⚠️ Warning: Local image file not found: ${localAbsolutePath}`);
    return { secureUrl: relativePath, publicId: null };
  }

  if (dryRun || !isCloudinaryConfigured) {
    // If dry run or Cloudinary not configured, use local public path
    return { secureUrl: relativePath, publicId: null };
  }

  try {
    const result = await cloudinary.uploader.upload(localAbsolutePath, {
      folder: "rajwadi/products",
      use_filename: true,
      unique_filename: true,
      resource_type: "image",
    });

    const entry = {
      publicId: result.public_id,
      secureUrl: result.secure_url,
    };

    map.uploadedImages[relativePath] = entry;
    return entry;
  } catch (err) {
    console.error(`❌ Failed to upload ${relativePath} to Cloudinary:`, err);
    return { secureUrl: relativePath, publicId: null };
  }
}

async function runMigration() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const isForce = args.includes("--force");

  console.log(`\n======================================================`);
  console.log(`  RAJWADI CATALOG & MEDIA MIGRATION`);
  console.log(`======================================================`);
  console.log(`Mode:           ${isDryRun ? "DRY RUN (No database/upload writes)" : "LIVE EXECUTION"}`);
  console.log(`Cloudinary:     ${isCloudinaryConfigured ? "CONFIGURED (Uploading assets)" : "LOCAL ASSET FALLBACK"}`);
  console.log(`Force Overwrite:${isForce ? "YES" : "NO"}`);
  console.log(`Total Products: ${REAL_POSHAKS.length}`);
  console.log(`======================================================\n`);

  const migrationMap = loadMigrationMap();
  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let totalImagesProcessed = 0;

  for (let index = 0; index < REAL_POSHAKS.length; index++) {
    const p = REAL_POSHAKS[index];
    const slug = p.id;
    const priceInPaise = parsePriceToPaise(p.price);
    const isFeatured = index < 4; // First 4 items featured on homepage
    const featuredOrder = index < 4 ? index + 1 : 0;

    console.log(`[${index + 1}/${REAL_POSHAKS.length}] Processing "${p.name}" (${slug})...`);

    // Collect and deduplicate unique image paths
    const rawImagePaths = [p.image, ...(p.additionalImages || [])];
    const uniqueImagePaths = Array.from(new Set(rawImagePaths.filter(Boolean)));

    const processedImages: { secureUrl: string; publicId: string | null; displayOrder: number }[] = [];

    for (let imgIdx = 0; imgIdx < uniqueImagePaths.length; imgIdx++) {
      const imgPath = uniqueImagePaths[imgIdx];
      const uploaded = await uploadLocalImageToCloudinary(imgPath, isDryRun, migrationMap);
      processedImages.push({
        secureUrl: uploaded.secureUrl,
        publicId: uploaded.publicId,
        displayOrder: imgIdx,
      });
      totalImagesProcessed++;
    }

    if (isDryRun) {
      console.log(`  -> [Dry Run] Would insert "${p.name}" with ${processedImages.length} images at ₹${priceInPaise / 100}`);
      continue;
    }

    // Check if product exists in DB
    const existing = await prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (existing && !isForce) {
      console.log(`  -> Product "${slug}" already exists in DB. Skipping (use --force to overwrite).`);
      skippedCount++;
      continue;
    }

    if (existing && isForce) {
      // Update existing
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: p.name,
          category: p.category,
          priceInPaise,
          fabric: p.fabric,
          craft: p.craft,
          color: p.color,
          description: p.description,
          details: p.details,
          includes: p.includes,
          status: "PUBLISHED",
          isFeatured,
          featuredOrder,
          stock: 10,
          inStock: true,
          stitchingAvailable: (p.category as string) === "Unstitched" || (p.category as string) === "Traditional",
          stitchingPriceInPaise: (p.category as string) === "Unstitched" ? 250000 : 0, // ₹2,500 if unstitched
          imagePosition: p.imagePosition || "center 5%",
          imageScale: p.imageScale || 1.0,
          images: {
            deleteMany: {},
            create: processedImages.map((img) => ({
              publicId: img.publicId,
              secureUrl: img.secureUrl,
              displayOrder: img.displayOrder,
            })),
          },
        },
      });
      updatedCount++;
      console.log(`  -> ✅ Updated "${p.name}".`);
    } else {
      // Create new
      await prisma.product.create({
        data: {
          slug,
          name: p.name,
          category: p.category,
          priceInPaise,
          fabric: p.fabric,
          craft: p.craft,
          color: p.color,
          description: p.description,
          details: p.details,
          includes: p.includes,
          status: "PUBLISHED",
          isFeatured,
          featuredOrder,
          stock: 10,
          inStock: true,
          stitchingAvailable: (p.category as string) === "Unstitched" || (p.category as string) === "Traditional",
          stitchingPriceInPaise: (p.category as string) === "Unstitched" ? 250000 : 0,
          imagePosition: p.imagePosition || "center 5%",
          imageScale: p.imageScale || 1.0,
          images: {
            create: processedImages.map((img) => ({
              publicId: img.publicId,
              secureUrl: img.secureUrl,
              displayOrder: img.displayOrder,
            })),
          },
        },
      });
      createdCount++;
      console.log(`  -> ✅ Created "${p.name}".`);
    }

    if (!migrationMap.migratedProducts.includes(slug)) {
      migrationMap.migratedProducts.push(slug);
    }
  }

  if (!isDryRun) {
    saveMigrationMap(migrationMap);
  }

  console.log(`\n======================================================`);
  console.log(`  MIGRATION SUMMARY`);
  console.log(`======================================================`);
  console.log(`Created:        ${createdCount}`);
  console.log(`Updated:        ${updatedCount}`);
  console.log(`Skipped:        ${skippedCount}`);
  console.log(`Images Tracked: ${totalImagesProcessed}`);
  console.log(`======================================================\n`);
}

runMigration()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
