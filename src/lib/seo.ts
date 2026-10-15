/**
 * SEO helper utilities for Rajwadi Rajputi Poshak
 */

export function generateProductTitle(product: {
  name: string;
  fabric?: string;
  work?: string;
  craft?: string;
}): string {
  const brandSuffix = " | Rajwadi Nagpur";
  const maxLen = 60;
  let name = product.name.trim();
  const hasRajputi = /rajputi/i.test(name);
  let baseName = "";
  if (hasRajputi) {
    baseName = name;
  } else if (/poshak$/i.test(name)) {
    baseName = name.replace(/poshak$/i, "Rajputi Poshak").trim();
  } else {
    baseName = `${name} Rajputi Poshak`;
  }

  const rawFabric = (product.fabric || "").split("&")[0].split(",")[0].trim();
  const rawWork = (product.work || product.craft || "").split("&")[0].split(",")[0].trim();

  let descriptor = [rawFabric, rawWork].filter(Boolean).join(" ");
  let candidate = `${baseName} – ${descriptor}${brandSuffix}`;
  if (candidate.length <= maxLen) return candidate;

  if (rawWork) {
    candidate = `${baseName} – ${rawWork}${brandSuffix}`;
    if (candidate.length <= maxLen) return candidate;
  }
  if (rawFabric) {
    candidate = `${baseName} – ${rawFabric}${brandSuffix}`;
    if (candidate.length <= maxLen) return candidate;
  }

  candidate = `${baseName}${brandSuffix}`;
  if (candidate.length <= maxLen) return candidate;

  const avail = maxLen - brandSuffix.length;
  return `${baseName.slice(0, avail - 1).trim()}…${brandSuffix}`;
}

export function generateProductMetaDescription(product: {
  name: string;
  color?: string;
  fabric?: string;
  work?: string;
  craft?: string;
  type?: string;
  category?: string;
  price?: string;
  priceFormatted?: string;
}): string {
  const isJewellery =
    (product.category || "").toLowerCase() === "jewellery" ||
    (product.type || "").toLowerCase() === "jewellery";

  const name = isJewellery
    ? product.name.trim()
    : `${product.name.replace(/poshak$/i, "").trim()} Rajputi Poshak`;
  const color = (product.color || "Royal").split("&")[0].split(",")[0].trim();
  const fabric = (product.fabric || "fine fabric").split("&")[0].split(",")[0].trim();
  const work = (product.work || product.craft || "gota patti").split("&")[0].split(",")[0].trim();
  const isStitched =
    (product.type || "").toLowerCase() === "stitched" ||
    (product.category || "").toLowerCase() === "stitched";
  const stitchStatus = isJewellery
    ? "Authentic jewellery"
    : isStitched
    ? "Stitched ensemble"
    : "Semi-stitched material";

  const p = product.priceFormatted || product.price || "";
  const priceSnippet =
    p && !p.toLowerCase().includes("available") && !p.toLowerCase().includes("sold out")
      ? `at ${p}`
      : "with price on request";

  const lead = `Buy ${name} in ${color} ${fabric} with ${work}. ${stitchStatus} ${priceSnippet}.`;
  const suffixes = [
    " Free insured delivery across India & worldwide from Rajwadi Nagpur.",
    " Free insured delivery across India from Rajwadi Nagpur boutique.",
    " Insured delivery across India & worldwide from Rajwadi, Nagpur.",
    " Express delivery across India & worldwide from Rajwadi Nagpur.",
    " Insured pan-India delivery from Rajwadi atelier in Nagpur.",
    " Fast delivery in India & worldwide from Rajwadi, Nagpur.",
    " Insured delivery from Rajwadi atelier in Nagpur.",
    " Order authentic pieces online from Rajwadi Nagpur.",
    " Delivery across India & worldwide from Rajwadi.",
    " Worldwide delivery from Rajwadi, Nagpur.",
    " Fast delivery from Rajwadi, Nagpur.",
    " Order online from Rajwadi Nagpur.",
    " From Rajwadi Nagpur.",
  ];

  for (const suf of suffixes) {
    const candidate = `${lead}${suf}`;
    if (candidate.length >= 140 && candidate.length <= 160) {
      return candidate;
    }
  }

  // Exact clamp to 140-160
  let text = `${lead} Insured delivery across India & worldwide from Rajwadi Nagpur.`;
  if (text.length > 160) {
    const sliced = text.slice(0, 159);
    const lastSp = sliced.lastIndexOf(" ");
    text = sliced.slice(0, lastSp).replace(/[&,\-–\s]+$/, "") + ".";
  }
  while (text.length < 140) {
    text = `Royal Rajputi Heritage: ${text}`;
    if (text.length > 160) {
      const sliced = text.slice(0, 159);
      const lastSp = sliced.lastIndexOf(" ");
      text = sliced.slice(0, lastSp).replace(/[&,\-–\s]+$/, "") + ".";
    }
  }
  return text;
}

/**
 * Generates a comprehensive 120-200 word editorial description per product
 * covering occasion, fabric, pieces included, odhna/ghera details, care, and delivery.
 * Marked as DRAFT - NEEDS OWNER REVIEW.
 */
export function generateProductLongDescription(product: {
  name: string;
  category?: string | null;
  type?: string | null;
  subCategory?: string | null;
  fabric?: string | null;
  craft?: string | null;
  work?: string | null;
  color?: string | null;
  odhna?: string | null;
  bestFor?: string | null;
  quality?: string | null;
}): string {
  const isJewellery =
    (product.category || "").toLowerCase() === "jewellery" ||
    (product.type || "").toLowerCase() === "jewellery";

  const isStitched =
    (product.type || "").toLowerCase() === "stitched" ||
    (product.category || "").toLowerCase() === "stitched";

  let name = product.name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!isJewellery) {
    if (/rajputi poshak$/i.test(name)) {
      // keep
    } else if (/poshak material$/i.test(name)) {
      name = name.replace(/poshak material$/i, "Rajputi Poshak").trim();
    } else if (/poshak$/i.test(name)) {
      name = name.replace(/poshak$/i, "Rajputi Poshak").trim();
    } else if (!/rajputi/i.test(name)) {
      name = `${name} Rajputi Poshak`;
    }
  }

  if (isJewellery) {
    return `Handcrafted with royal heritage artistry, the ${name} is an exquisite Rajasthani bridal jewellery piece designed for royal weddings, festive celebrations, and heirloom adornment. Crafted with high-grade metal alloy, lustrous kundan stones, and intricate meenakari detailing, this ceremonial accessory embodies centuries of Rajputana regal finery.

This traditional jewellery creation features authentic Rajasthani craftsmanship, engineered for both lasting durability and royal elegance. The piece pairs seamlessly with bridal and festive Rajputi poshaks, accentuating your traditional ensemble with unmistakable royal grace.

Care & Preservation: Keep away from moisture, water, perfumes, and hairsprays to maintain the lustrous gold polish and stone settings. Store separately in an airtight velvet-lined jewellery box.

Delivery & Packaging: Carefully packed in a protective luxury jewellery case and dispatched from Rajwadi, Nagpur. Complimentary insured shipping across India and express worldwide delivery.`;
  }

  let rawFabric = (product.fabric || "").trim();
  let fabric = "Pure Georgette & Satin Magji";
  if (rawFabric) {
    if (/^heavy quality$/i.test(rawFabric)) {
      fabric = "Premium Heavy Bridal Georgette & Satin Magji";
    } else if (/^vintage material$/i.test(rawFabric)) {
      fabric = "Vintage Heritage Silk & Brocade";
    } else if (/^half pure material and pure chiffon material$/i.test(rawFabric)) {
      fabric = "Half-Pure Georgette & Pure Chiffon Odhana";
    } else if (/^bamber satan material and ,hamrahi pure odhani$/i.test(rawFabric)) {
      fabric = "Bamber Satin Material with Hamrahi Pure Odhani";
    } else if (/^half pure material$/i.test(rawFabric)) {
      fabric = "Half-Pure Georgette & Satin Magji";
    } else if (/^pure silk material$/i.test(rawFabric)) {
      fabric = "Pure Heritage Silk & Satin Magji";
    } else if (/^fandy fabric$/i.test(rawFabric)) {
      fabric = "Fancy Royal Fabric & Satin Magji";
    } else {
      fabric = rawFabric.charAt(0).toUpperCase() + rawFabric.slice(1);
    }
  }

  const color = (product.color || "Royal Heritage").trim();
  const craft = (product.work || product.craft || "Handcrafted Gotapatti, Kasab Zari & Dabka").trim();

  let odhna = (product.odhna || "").trim();
  if (!odhna) {
    odhna = "four-side border with hand-fringed gota kiran";
  } else if (/^four/i.test(odhna)) {
    odhna = odhna.charAt(0).toLowerCase() + odhna.slice(1);
  }

  let occasion = "regal weddings and bridal ceremonies";
  const cat = (product.category || "").toLowerCase();
  const sub = (product.subCategory || "").toLowerCase();
  const best = (product.bestFor || "").toLowerCase();

  if (best && best !== "bridal" && best !== "festive") {
    occasion = product.bestFor!;
  } else if (cat.includes("bridal") || sub.includes("bridal") || best.includes("bridal")) {
    occasion = "regal weddings and bridal ceremonies";
  } else if (cat.includes("festive") || sub.includes("festive") || best.includes("festive")) {
    occasion = "auspicious festive celebrations and royal gatherings";
  } else {
    occasion = "auspicious occasions, pooja ceremonies, and royal celebrations";
  }

  const stitchDescription = isStitched
    ? "pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali"
    : "semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work";

  return `Handcrafted with artisanal heritage finesse, the ${name} is an authentic Royal Rajputi Poshak designed for ${occasion}. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in ${fabric} in a luminous ${color} shade, lavishly adorned with ${craft}.

This ceremonial ensemble is a ${stitchDescription}, complemented by an odhna featuring ${odhna}, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.

Care & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.

Delivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.`;
}

