import { prisma } from "../src/lib/prisma";

async function clearDummyDiscounts() {
  console.log("Clearing dummy compareAtPrice from all products in Neon DB...");
  const res = await prisma.product.updateMany({
    data: {
      compareAtPriceInPaise: null,
    },
  });
  console.log(`Updated ${res.count} products. All dummy discount badges removed!`);
}

clearDummyDiscounts()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
