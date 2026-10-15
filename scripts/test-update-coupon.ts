import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Updating cuid_royal10 with applicableScope and products...");
  const updated = await prisma.coupon.update({
    where: { id: "cuid_royal10" },
    data: {
      applicableScope: "SPECIFIC_PRODUCTS",
      applicableProducts: ["cmucdqlt90000t87k6wd7khaw"],
      applicableCategories: ["Stitched"],
      isActive: true,
      description: "Exclusive 10% Royal Heritage discount for our patrons",
    },
  });
  console.log("SUCCESS! Updated coupon in DB:", JSON.stringify(updated, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
