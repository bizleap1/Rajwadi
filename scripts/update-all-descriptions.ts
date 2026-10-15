import "dotenv/config";
import { prisma } from "../src/backend/db/prisma";
import { generateProductLongDescription } from "../src/lib/seo";

async function main() {
  console.log("Fetching all products from database...");
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${products.length} products in database.`);

  let updatedCount = 0;

  for (const product of products) {
    const newDescription = generateProductLongDescription({
      name: product.name,
      category: product.category,
      type: product.type || undefined,
      subCategory: product.subCategory || undefined,
      fabric: product.fabric,
      craft: product.craft,
      work: product.work || undefined,
      color: product.color,
      odhna: product.odhna || undefined,
      bestFor: product.bestFor || undefined,
      quality: product.quality || undefined,
    });

    // Verify 4 paragraphs
    const paras = newDescription.split("\n\n");
    if (paras.length !== 4) {
      console.warn(`WARNING: Product ${product.slug} has ${paras.length} paragraphs instead of 4!`);
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        description: newDescription,
      },
    });

    updatedCount++;
    console.log(`[${updatedCount}/${products.length}] Updated: ${product.slug} ("${product.name}") - ${paras.length} paras, ${newDescription.length} chars`);
  }

  console.log(`\n Successfully updated all ${updatedCount} products in the database!`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error updating descriptions:", err);
    process.exit(1);
  });
