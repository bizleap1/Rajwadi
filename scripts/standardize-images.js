const fs = require("fs");
const path = require("path");

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
}

async function main() {
  const publicDir = path.join(__dirname, "..", "public");

  // 1. Rename directories with spaces in public/products and public/Jewellery
  const dirsToCheck = [
    path.join(publicDir, "products"),
    path.join(publicDir, "products", "Unstiched"),
    path.join(publicDir, "Jewellery"),
  ];

  const renames = [];

  for (const parent of dirsToCheck) {
    if (!fs.existsSync(parent)) continue;
    const entries = fs.readdirSync(parent, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory() && ent.name.includes(" ")) {
        const oldName = ent.name;
        const newName = oldName.replace(/\s+/g, "-");
        const oldPath = path.join(parent, oldName);
        const newPath = path.join(parent, newName);
        console.log(`Renaming directory: "${oldName}" -> "${newName}"`);
        fs.renameSync(oldPath, newPath);
        renames.push({ oldName, newName });
      }
    }
  }

  // 2. Download Cloudinary images as local WebP into public/products/cloud
  const cloudDir = path.join(publicDir, "products", "cloud");
  if (!fs.existsSync(cloudDir)) {
    fs.mkdirSync(cloudDir, { recursive: true });
  }

  const cloudinaryUrls = [
    { id: "oewtbhxcrc6kzj4gubte", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252236/rajwadi/products/oewtbhxcrc6kzj4gubte.jpg", localName: "oewtbhxcrc6kzj4gubte.webp" },
    { id: "b5bpen8eztzn22fux9xe", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252883/rajwadi/products/b5bpen8eztzn22fux9xe.png", localName: "b5bpen8eztzn22fux9xe.webp" },
    { id: "zglpytqufj3qn2rpzpom", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252384/rajwadi/products/zglpytqufj3qn2rpzpom.jpg", localName: "zglpytqufj3qn2rpzpom.webp" },
    { id: "wfstpy8teujacwouoq6w", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252345/rajwadi/products/wfstpy8teujacwouoq6w.jpg", localName: "wfstpy8teujacwouoq6w.webp" },
    { id: "n4kv4jcsehfshvxxmysy", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252081/rajwadi/products/n4kv4jcsehfshvxxmysy.jpg", localName: "n4kv4jcsehfshvxxmysy.webp" },
    { id: "jpaqszjaafob0bck3o6v", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252034/rajwadi/products/jpaqszjaafob0bck3o6v.jpg", localName: "jpaqszjaafob0bck3o6v.webp" },
    { id: "tkyuv3qdk384ijj0zjl6", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252004/rajwadi/products/tkyuv3qdk384ijj0zjl6.jpg", localName: "tkyuv3qdk384ijj0zjl6.webp" },
    { id: "fe9zbnxeqxwa7tfbpv1g", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790251892/rajwadi/products/fe9zbnxeqxwa7tfbpv1g.jpg", localName: "fe9zbnxeqxwa7tfbpv1g.webp" },
    { id: "skdi574kzwqnciuz1xvb", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252298/rajwadi/products/skdi574kzwqnciuz1xvb.jpg", localName: "skdi574kzwqnciuz1xvb.webp" },
    { id: "eftdkkxmayzs2kzatdau", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252185/rajwadi/products/eftdkkxmayzs2kzatdau.jpg", localName: "eftdkkxmayzs2kzatdau.webp" },
    { id: "al7g3kadcvp5gs0r3srb", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790252124/rajwadi/products/al7g3kadcvp5gs0r3srb.jpg", localName: "al7g3kadcvp5gs0r3srb.webp" },
    { id: "oa0zfmfp1cnuxmbyndpg", url: "https://res.cloudinary.com/i4irbhvz/image/upload/f_webp/v1790251722/rajwadi/products/oa0zfmfp1cnuxmbyndpg.jpg", localName: "oa0zfmfp1cnuxmbyndpg.webp" },
  ];

  for (const item of cloudinaryUrls) {
    const dest = path.join(cloudDir, item.localName);
    if (!fs.existsSync(dest)) {
      console.log(`Downloading ${item.id} -> ${item.localName}...`);
      await downloadFile(item.url, dest);
    }
  }

  // 3. Update files referencing these old paths and Cloudinary URLs
  const filesToUpdate = [
    path.join(__dirname, "..", "src", "data", "products.ts"),
    path.join(__dirname, "..", "src", "data", "collections", "bridal.ts"),
    path.join(__dirname, "..", "src", "data", "collections", "festive.ts"),
    path.join(__dirname, "..", "src", "data", "collections", "classic.ts"),
    path.join(__dirname, "..", "src", "data", "collections", "jewellery.ts"),
  ];

  for (const filePath of filesToUpdate) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, "utf-8");
    let changed = false;

    // Replace Cloudinary URLs with local /products/cloud/ URLs
    for (const item of cloudinaryUrls) {
      const regex = new RegExp(`https://res\\.cloudinary\\.com/[^"']+/rajwadi/products/${item.id}\\.(?:jpg|png|webp)`, "g");
      if (regex.test(content)) {
        content = content.replace(regex, `/products/cloud/${item.localName}`);
        changed = true;
      }
    }

    // Replace renamed folder paths
    for (const r of renames) {
      if (content.includes(r.oldName)) {
        content = content.split(r.oldName).join(r.newName);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`Updated references in: ${path.basename(filePath)}`);
    }
  }

  console.log("Image standardization complete!");
}

main().catch(err => {
  console.error("Error in standardize-images.js:", err);
  process.exit(1);
});
