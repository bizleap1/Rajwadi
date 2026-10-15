import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../src/data/products.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Remove lines like originalPrice: "₹ 8,000", or originalPrice: "₹8,200",
const updated = content.replace(/\s*originalPrice:\s*["'][^"']+["'],?/g, "");

fs.writeFileSync(filePath, updated, "utf-8");
console.log("Successfully removed dummy originalPrice lines from src/data/products.ts!");
