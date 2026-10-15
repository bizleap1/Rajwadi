import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../src/lib/prisma';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = Boolean(
  cloudName &&
  apiKey &&
  apiSecret &&
  apiKey !== 'placeholder_api_key' &&
  apiSecret !== 'placeholder_api_secret'
);

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (/\.webp$/i.test(file)) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadLocalImages() {
  console.log('===========================================================');
  console.log(' Rajwadi: Bulk Upload Catalog Images to Cloudinary');
  console.log('===========================================================');

  if (!isConfigured) {
    console.error('\n✗ Cloudinary is not configured in .env!');
    process.exit(1);
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const productsDir = path.join(process.cwd(), 'public', 'products');
  if (!fs.existsSync(productsDir)) {
    console.error(`✗ Public products directory not found: ${productsDir}`);
    process.exit(1);
  }

  const allWebpFiles = getAllFiles(productsDir);
  console.log(`Found ${allWebpFiles.length} WebP images in public/products.`);

  // Find all ProductImage records in database
  const dbImages = await prisma.productImage.findMany({
    include: { product: true },
  });
  console.log(`Found ${dbImages.length} image records in Neon PostgreSQL.\n`);

  let uploadedCount = 0;
  let updatedDbCount = 0;

  for (let i = 0; i < allWebpFiles.length; i++) {
    const filePath = allWebpFiles[i];
    // Convert to relative web path e.g. /products/Morbagh Poshak/1.webp
    const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath).replace(/\\/g, '/');
    const localUrlPath = `/${relativePath}`;

    // Extract product folder name for Cloudinary folder organization
    const parentFolder = path.basename(path.dirname(filePath));
    const filename = path.basename(filePath, path.extname(filePath));
    const publicId = `rajwadi/products/${parentFolder.replace(/[^a-zA-Z0-9_-]/g, '_')}_${filename}`;

    try {
      console.log(`[${i + 1}/${allWebpFiles.length}] Uploading "${relativePath}" to Cloudinary...`);

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });

      uploadedCount++;
      const secureUrl = uploadResult.secure_url;

      // Update matching database records that have this local path
      const matchingImages = dbImages.filter(
        (img) =>
          img.secureUrl === localUrlPath ||
          img.secureUrl === encodeURI(localUrlPath) ||
          decodeURIComponent(img.secureUrl) === localUrlPath
      );

      for (const img of matchingImages) {
        await prisma.productImage.update({
          where: { id: img.id },
          data: {
            secureUrl,
            publicId: uploadResult.public_id,
            format: uploadResult.format,
            width: uploadResult.width,
            height: uploadResult.height,
          },
        });
        updatedDbCount++;
      }

      console.log(`  ✓ Cloudinary URL: ${secureUrl}`);
    } catch (err: any) {
      console.error(`  ✗ Error uploading ${relativePath}:`, err.message || err);
    }
  }

  console.log('\n===========================================================');
  console.log(`✓ Completed: ${uploadedCount} images uploaded to Cloudinary.`);
  console.log(`✓ Updated ${updatedDbCount} database image records in Neon PostgreSQL.`);
  console.log('===========================================================');
}

uploadLocalImages()
  .catch((err) => {
    console.error('Fatal error during image migration:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
