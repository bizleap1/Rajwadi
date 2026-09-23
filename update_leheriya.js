const fs = require('fs');

const path = 'src/data/products.ts';
let content = fs.readFileSync(path, 'utf8');

const interfaceIndex = content.indexOf('export interface SubCategoryItem');
const arrayEndIndex = content.lastIndexOf('];', interfaceIndex);

if (arrayEndIndex === -1) {
    console.error("Could not find the array end");
    process.exit(1);
}

const products = [
  {
    folderName: "Baingani Gulnaar Leheriya Poshak Material",
    id: "baingani-gulnaar-leheriya-poshak-material",
    name: "Baingani Gulnaar Leheriya Poshak Material",
    color: "Baingani Gulnaar"
  },
  {
    folderName: "Gulnaar Leheriya Poshak Material",
    id: "gulnaar-leheriya-poshak-material",
    name: "Gulnaar Leheriya Poshak Material",
    color: "Gulnaar"
  },
  {
    folderName: "Hari Kesariya Leheriya Poshak Material",
    id: "hari-kesariya-leheriya-poshak-material",
    name: "Hari Kesariya Leheriya Poshak Material",
    color: "Hari Kesariya"
  },
  {
    folderName: "Panna Leheriya Poshak Material",
    id: "panna-leheriya-poshak-material",
    name: "Panna Leheriya Poshak Material",
    color: "Panna"
  },
  {
    folderName: "Rani Gulabi Leheriya Poshak Material",
    id: "rani-gulabi-leheriya-poshak-material",
    name: "Rani Gulabi Leheriya Poshak Material",
    color: "Rani Gulabi"
  },
  {
    folderName: "Surkh Kesariya Leheriya Poshak Material",
    id: "surkh-kesariya-leheriya-poshak-material",
    name: "Surkh Kesariya Leheriya Poshak Material",
    color: "Surkh Kesariya"
  }
];

let newProductsStr = '';

for (const p of products) {
  newProductsStr += `  {
    id: "${p.id}",
    name: "${p.name}",
    category: "Festive",
    subCategory: "Festive",
    originalPrice: "₹ 4,550",
    price: "₹ 3,500",
    fabric: "Premium Royal Pure Fabric",
    craft: "Heavy Fancy Barik Zari Work with Stone Work",
    color: "${p.color}",
    image: "/products/Unstiched/${p.folderName}/1.webp",
    imagePosition: "center 5%",
    description: "Festive ${p.name} with Heavy Fancy Barik Zari Work.",
    type: "Unstitched",
    quality: "Premium Royal Pure Fabric",
    work: "Heavy Fancy Barik Zari Work with Stone Work",
    odhna: "Heavy Four-side Work",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Poshak Material",
      "Fabric — Premium Royal Pure Fabric",
      "Work — Heavy Fancy Barik Zari Work with Stone Work",
      "Odhna — Heavy Four-side Work",
      "Kurti Work — Heavy Kurti Work with Gala Work",
      "Lining — With Astar",
      "Set Detail — Aari Magji Complete",
      "Set Type — Single Suit",
      "Best For — Festive",
    ],
    includes: [
      "Poshak Material",
      "Astar",
      "Aari Magji"
    ],
  },
`;
}

content = content.substring(0, arrayEndIndex) + newProductsStr + content.substring(arrayEndIndex);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated Leheriya products in products.ts");
