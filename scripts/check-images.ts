import { prisma } from "../src/lib/prisma";

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      images: {
        select: { id: true, secureUrl: true, displayOrder: true }
      }
    }
  });
  console.log(`Total Products in DB: ${products.length}`);
  for (const p of products) {
    console.log(`[${p.id}] ${p.name}: ${p.images.length} images ->`, p.images.map(i => i.secureUrl));
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
