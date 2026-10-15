import { prisma } from "../src/lib/prisma";

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      priceInPaise: true,
      compareAtPriceInPaise: true,
    },
  });

  const withCompareAt = products.filter(
    (p) => p.compareAtPriceInPaise && p.compareAtPriceInPaise > p.priceInPaise
  );
  console.log(`Total products in DB: ${products.length}`);
  console.log(`Products with dummy compareAtPrice/discount: ${withCompareAt.length}`);
  for (const p of withCompareAt.slice(0, 10)) {
    console.log(
      `- ${p.name}: Sale Price = ₹${p.priceInPaise / 100}, Dummy MRP = ₹${
        (p.compareAtPriceInPaise || 0) / 100
      }`
    );
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
