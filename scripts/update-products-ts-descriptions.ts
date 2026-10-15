import fs from "fs";
import path from "path";
import { generateProductLongDescription } from "../src/lib/seo";
import { REAL_POSHAKS } from "../src/data/products";

const filePath = path.resolve(__dirname, "../src/data/products.ts");
let fileContent = fs.readFileSync(filePath, "utf-8");

console.log(`Processing ${REAL_POSHAKS.length} products in REAL_POSHAKS...`);

let updateCount = 0;

for (const product of REAL_POSHAKS) {
  const newDesc = generateProductLongDescription({
    name: product.name,
    category: product.category,
    type: product.type,
    subCategory: product.subCategory,
    fabric: product.fabric,
    craft: product.craft,
    work: product.work,
    color: product.color,
    odhna: product.odhna,
    bestFor: product.bestFor,
    quality: product.quality,
  });

  // Find the product block by its id: "product.id"
  const idRegex = new RegExp(`(id:\\s*["']${product.id}["'][\\s\\S]*?description:\\s*)(["'][\\s\\S]*?["']|` + "`[\\s\\S]*?`" + `)(,)`, "m");
  
  if (idRegex.test(fileContent)) {
    const formattedDesc = JSON.stringify(newDesc);
    fileContent = fileContent.replace(idRegex, `$1${formattedDesc}$3`);
    updateCount++;
  } else {
    console.warn(`Could not locate description block for ${product.id}`);
  }
}

fs.writeFileSync(filePath, fileContent, "utf-8");
console.log(`Successfully updated ${updateCount}/${REAL_POSHAKS.length} product descriptions in src/data/products.ts!`);
