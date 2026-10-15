export type PrimaryCategory = "Bridal" | "Festive" | "Classic Poshak" | "Jewellery";
export type ProductType = "Stitched" | "Unstitched" | "Jewellery";

export interface PoshakProduct {
  id: string;
  name: string;
  category: PrimaryCategory;
  type: ProductType;
  subCategory?: string;
  price: string;
  originalPrice?: string;
  priceNote?: string;
  fabric: string;
  craft: string;
  color: string;
  image: string;
  additionalImages?: string[];
  images?: any[];
  imagePosition?: string;
  imageScale?: number;
  description: string;
  details: string[];
  includes: string[];
  size?: string;
  sizes?: string[];
  quality?: string;
  work?: string;
  odhna?: string;
  bestFor?: string;
  soldOut?: boolean;
  stitchingAvailable?: boolean;
  createdAt?: string;
  enquiryOnly?: boolean;
  sequenceNumber?: number;
}

export function isProductEnquiryOnly(product: {
  enquiryOnly?: boolean;
  category?: string;
  type?: string;
}): boolean {
  if (typeof product.enquiryOnly === "boolean") {
    return product.enquiryOnly;
  }
  const cat = (product.category || "").toLowerCase();
  const typ = (product.type || "").toLowerCase();
  return cat === "jewellery" || typ === "jewellery";
}

export function isProductAvailableIn10Days(product?: {
  soldOut?: boolean;
  inStock?: boolean;
  stock?: number;
  price?: string;
  priceFormatted?: string;
  priceNote?: string;
} | null): boolean {
  if (!product) return false;
  if (product.soldOut) return true;
  if (product.inStock === false) return true;
  if (typeof product.stock === "number" && product.stock <= 0) return true;
  const p = (product.priceFormatted || product.price || "").toLowerCase();
  const pn = (product.priceNote || "").toLowerCase();
  if (
    p.includes("sold out") ||
    p.includes("out of stock") ||
    p.includes("available with in 10 days") ||
    p.includes("available within 10 days") ||
    p.includes("available in 10 days")
  ) {
    return true;
  }
  if (
    pn.includes("sold out") ||
    pn.includes("out of stock") ||
    pn.includes("available with in 10 days") ||
    pn.includes("available within 10 days") ||
    pn.includes("available in 10 days")
  ) {
    return true;
  }
  return false;
}

export function getPoshakDisplayName(product: { name: string; type?: string; category?: string }): string {
  const isJewellery =
    (product.category || "").toLowerCase() === "jewellery" ||
    (product.type || "").toLowerCase() === "jewellery";
  if (isJewellery) {
    return product.name;
  }

  const isUnstitched =
    (product.type || "").toLowerCase() === "unstitched" ||
    (product.category || "").toLowerCase() === "unstitched" ||
    (product.type || "").toLowerCase() === "semi stitched" ||
    (product.type || "").toLowerCase() === "semi-stitched";
  const trimmed = product.name.trim();

  if (isUnstitched) {
    if (/semi[- ]?stitched(s+poshak)?$/i.test(trimmed)) {
      return trimmed.replace(/semi[- ]?stitched(s+poshak)?$/i, "Semi Stitched Poshak").trim();
    }
    if (/poshak material$/i.test(trimmed)) {
      return trimmed.replace(/poshak material$/i, "Semi Stitched Poshak").trim();
    }
    if (/poshak$/i.test(trimmed)) {
      return trimmed.replace(/poshak$/i, "Semi Stitched Poshak").trim();
    }
    return `${trimmed} Semi Stitched Poshak`;
  }

  // Stitched poshak rule: [Design Name] Poshak
  if (/poshak material$/i.test(trimmed)) {
    return trimmed.replace(/poshak material$/i, "Poshak").trim();
  }
  if (/semi[- ]?stitched(s+poshak)?$/i.test(trimmed)) {
    return trimmed.replace(/semi[- ]?stitched(s+poshak)?$/i, "Poshak").trim();
  }
  if (/poshak$/i.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed} Poshak`;
}

// Backward-compatible alias
export function getUnstitchedDisplayName(product: { name: string; type?: string; category?: string }): string {
  return getPoshakDisplayName(product);
}

export function getCategoryEyebrow(product: { category?: string; type?: string }): string {
  const isJewellery =
    (product.category || "").toLowerCase() === "jewellery" ||
    (product.type || "").toLowerCase() === "jewellery";
  if (isJewellery) {
    return "JEWELLERY";
  }

  const rawCat = (product.category || "FESTIVE").toUpperCase();
  let categoryUpper = rawCat;
  if (rawCat === "BRIDAL") categoryUpper = "HEAVY";
  else if (rawCat === "EVERYDAY" || rawCat === "CLASSIC" || rawCat === "CLASSIC POSHAK") categoryUpper = "CLASSIC";

  const isUnstitched =
    (product.type || "").toLowerCase() === "unstitched" ||
    (product.category || "").toLowerCase() === "unstitched" ||
    (product.type || "").toLowerCase() === "semi stitched" ||
    (product.type || "").toLowerCase() === "semi-stitched";

  if (isUnstitched) {
    return `${categoryUpper} / SEMI STITCHED`;
  }
  return `${categoryUpper} / STITCHED POSHAK`;
}

export const REAL_POSHAKS: PoshakProduct[] = [
  {
    id: "morbagh-rajputi-poshak",
    name: "Morbagh-Poshak",
    category: "Bridal",
    type: "Stitched",
    subCategory: "Bridal",

    price: "₹ 7,594",
    priceNote: "Inclusive of stitching",
    fabric: "Pure Georgette & Satin Magji",
    craft: "Handcrafted Peacock Gotapatti, Kasab Zari & Dabka",
    color: "Gulabi Pink & Firozi Turquoise",
    image: "/products/Morbagh-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Morbagh-Poshak/1.webp",
      "/products/Morbagh-Poshak/2.webp",
      "/products/Morbagh-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Morbagh Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Pure Georgette & Satin Magji in a luminous Gulabi Pink & Firozi Turquoise shade, lavishly adorned with Handcrafted Peacock Gotapatti, Kasab Zari & Dabka.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Signature Morbagh peacock medallions handcrafted in fine gotapatti and zardozi",
      "Rich dual-tone contrast: Royal blush pink ghagra with vibrant turquoise odhani",
      "Heavy ceremonial odhani bordered with solid metallic gold kiran fringe",
      "Tailored with kalidar ghera for sweeping royal poise",
    ],
    includes: [
      "Heavy Flared Morbagh Ghagra",
      "Embroidered Kurti & Kanchali Ensemble",
      "Full-Length Turquoise Odhani with Rich Kiran",
      "Pure Cotton Lining & Magji Finish",
    ],
  },
  {
    id: "neelam-turquoise-rajputi-poshak",
    name: "Neelam-Turquoise-Poshak",
    category: "Festive",
    type: "Stitched",

    price: "₹ 6,370",
    priceNote: "Inclusive of stitching",
    fabric: "bamber satan material and ,hamrahi pure odhani",
    craft: "Handcrafted Gota Patti & Zari Bel",
    color: "Royal Neelam Turquoise",
    image: "/products/Neelam-Turquoise-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Neelam-Turquoise-Poshak/1.webp",
      "/products/Neelam-Turquoise-Poshak/2.webp",
      "/products/Neelam-Turquoise-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Neelam Turquoise Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Bamber Satin Material with Hamrahi Pure Odhani in a luminous Royal Neelam Turquoise shade, lavishly adorned with Handcrafted Gota Patti & Zari Bel.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Exquisite turquoise shade with lustrous gold leaf gota",
      "Pre-tailored kalidar silhouette for an immaculate drape",
      "Lustrous satin magji border included in set",
      "Authentic traditional drape for festive celebrations",
    ],
    includes: [
      "Flared Kalidar Ghagra",
      "Tailored Kurti & Kanchali Ensemble",
      "Heavy Worked Pure Odhani (2.5m)",
      "Lining & Magji Bundle",
    ],
  },
  {
    id: "rani-maroon-rajputi-poshak",
    name: "Rani-Maroon-Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 6,370",
    priceNote: "Inclusive of stitching",
    fabric: "Pure Georgette & Brocade",
    craft: "Danka, Marodi & Zardozi Handwork",
    color: "Heritage Maroon & Antique Gold",
    image: "/products/Rani-Maroon-Poshak/1.webp",
    imagePosition: "center 2%",
    additionalImages: [
      "/products/Rani-Maroon-Poshak/1.webp",
      "/products/Rani-Maroon-Poshak/2.webp",
      "/products/Rani-Maroon-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Rani Maroon Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Pure Georgette & Brocade in a luminous Heritage Maroon & Antique Gold shade, lavishly adorned with Danka, Marodi & Zardozi Handwork.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Pure Poshak",
    work: "Danka, Marodi & Zardozi Handwork",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Festive",
    details: [
      "Pure bridal poshak",
      "Danka, marodi and zardozi needlework",
      "Four-side border with gota kiran in odhna",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Imperial Kalidar Ghagra with Zardozi Work",
      "Tailored Kurti & Kanchali Ensemble",
      "Pure Maroon Odhna with Gota Kiran",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "gulabi-rani-rajputi-poshak",
    name: "Gulabi-Rani-Poshak",
    category: "Bridal",
    type: "Stitched",
    subCategory: "Bridal",

    price: "Available within 10 days",
    priceNote: "Available within 10 days",
    soldOut: true,
    fabric: "Pure Georgette & Heritage Satin Magji",
    craft: "Handcrafted Gota Patti & Kasab Zari",
    color: "Gulabi Rani Pink",
    image: "/products/Gulabi-Rani-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Gulabi-Rani-Poshak/1.webp",
      "/products/Gulabi-Rani-Poshak/2.webp",
      "/products/Gulabi-Rani-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Gulabi Rani Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Pure Georgette & Heritage Satin Magji in a luminous Gulabi Rani Pink shade, lavishly adorned with Handcrafted Gota Patti & Kasab Zari.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Traditional 4-Piece Royal Rajputi Poshak",
      "Authentic hand-worked Gota Patti & Kasab Zari floral bel",
      "Pure georgette ghagra with wide imperial kalidar flare",
      "Ceremonial sheer odhani with delicate gotta patti border",
    ],
    includes: [
      "Flared Ghagra (Lehenga)",
      "Kurti & Kanchali (Top ensemble)",
      "Pure Georgette Royal Odhani with Magji finishing",
      "Matching pure cotton astar (lining)",
    ],
  },
  {
    id: "pista-neel-rajputi-poshak",
    name: "Pista-Neel-Poshak",
    category: "Bridal",
    type: "Stitched",

    price: "₹ 7,594",
    priceNote: "Inclusive of stitching",
    fabric: "Pure silk material",
    craft: "Hand Marodi & Zardozi Needlecraft",
    color: "Pista Green with Neel Accent",
    image: "/products/Pista-Neel-Poshak/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Pista-Neel-Poshak/1.webp",
      "/products/Pista-Neel-Poshak/2.webp",
      "/products/Pista-Neel-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Pista Neel Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Pure Heritage Silk & Satin Magji in a luminous Pista Green with Neel Accent shade, lavishly adorned with Hand Marodi & Zardozi Needlecraft.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Fine marodi needlecraft with ancestral Rajasthani motifs",
      "Stitched and tailored for effortless royal grace and drape",
      "Pure organza odhani with hand-fringed kiran trim",
      "Double-layered magji hemline for superior swirl and movement",
    ],
    includes: [
      "Stitched Ghagra with Full Kalidar Flare",
      "Tailored Kurti & Kanchali",
      "Pure Odhani with Rich Pallu Border",
      "Soft Breathable Cotton Astar",
    ],
  },
  {
    id: "aqua-pista-rajputi-poshak",
    name: "Aqua-Pista-Poshak",
    category: "Bridal",
    type: "Stitched",
    subCategory: "Bridal",

    price: "₹ 7,390",
    priceNote: "Inclusive of stitching",
    fabric: "Pure Georgette & Satin Magji",
    craft: "Handcrafted Gota Patti & Kasab Zari",
    color: "Aqua Blue & Pista Green Ombré",
    image: "/products/Aqua-Pista-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Aqua-Pista-Poshak/1.webp",
      "/products/Aqua-Pista-Poshak/2.webp",
      "/products/Aqua-Pista-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Aqua Pista Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Pure Georgette & Satin Magji in a luminous Aqua Blue & Pista Green Ombré shade, lavishly adorned with Handcrafted Gota Patti & Kasab Zari.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Signature Rajasthani dual-tone ombré dye from pista to sea aqua",
      "Elaborate hand-worked gota patti peacock and floral medallions",
      "Sheer regal odhani adorned with fine sequin jaal and gold kiran",
      "Stitched and tailored for an immaculate, graceful drape",
    ],
    includes: [
      "Stitched Kalidar Ghagra with Embroidered Ghera",
      "Tailored Kurti & Kanchali Ensemble",
      "Pure Sheer Odhani with Heritage Kiran",
      "Matching Cotton Lining & Satin Magji",
    ],
  },
  {
    id: "peach-kundan-rajputi-poshak",
    name: "Peach Kundan Poshak",
    category: "Festive",
    subCategory: "Festive",

    price: "₹ 4,228",
    priceNote: "Inclusive of stitching",
    fabric: "Half Pure Fabric",
    craft: "Kundan Work",
    color: "Peach",
    image: "/products/Peach-Poshak/1.webp",
    imagePosition: "center 1%",
    additionalImages: [
      "/products/Peach-Poshak/1.webp",
      "/products/Peach-Poshak/2.webp",
      "/products/Peach-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Peach Kundan Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half Pure Fabric in a luminous Peach shade, lavishly adorned with Kundan Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Half-Pure Poshak",
    work: "Kundan Work",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Festive",
    details: [
      "Half-pure poshak",
      "Kundan work detailing",
      "Four-side border in odhna with gota kiran",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Finished Kalidar Ghagra with Kundan Detailing",
      "Tailored Kurti & Kanchali Ensemble",
      "Four-side border with Gota Kiran Odhna",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "pista-yellow-odhna-poshak",
    name: "Pista Yellow Odhna Poshak",
    category: "Festive",
    subCategory: "Festive",

    price: "₹ 6,370",
    priceNote: "Inclusive of stitching",
    fabric: "Pure Georgette",
    craft: "Zardozi & Kundan Work",
    color: "Pista Green & Yellow Contrast",
    image: "/products/Pista-Kesariya-Poshak/1.webp",
    imagePosition: "center 2%",
    additionalImages: [
      "/products/Pista-Kesariya-Poshak/1.webp",
      "/products/Pista-Kesariya-Poshak/2.webp",
      "/products/Pista-Kesariya-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Pista Yellow Odhna Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Pure Georgette in a luminous Pista Green & Yellow Contrast shade, lavishly adorned with Zardozi & Kundan Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Pure Poshak",
    work: "Zardozi & Kundan Work",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Festive",
    details: [
      "Pure poshak fabric",
      "Authentic zardozi and kundan work",
      "Four-side border with gota kiran in odhna",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Finished Kalidar Ghagra with Zardozi & Kundan Work",
      "Tailored Kurti & Kanchali Ensemble",
      "Yellow Odhna with Four-Side Border & Gota Kiran",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "kesariya-sunehri-rajputi-poshak",
    name: "Kesariya-Sunehri-Poshak",
    category: "Classic Poshak",
    subCategory: "Classic Poshak",

    price: "₹ 3,055",
    priceNote: "Inclusive of stitching",
    fabric: "Georgette",
    craft: "Heavy Kundan Work",
    color: "Imperial Gold & Saffron Kesar",
    image: "/products/Kesariya-Sunehri-Poshak/1.webp",
    imagePosition: "center center",
    additionalImages: [
      "/products/Kesariya-Sunehri-Poshak/1.webp",
      "/products/Kesariya-Sunehri-Poshak/2.webp",
      "/products/Kesariya-Sunehri-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Kesariya Sunehri Rajputi Poshak is an authentic Royal Rajputi Poshak designed for Classic Poshak. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Georgette in a luminous Imperial Gold & Saffron Kesar shade, lavishly adorned with Heavy Kundan Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL to XXL",
    sizes: ["XL", "XXL"],
    quality: "Semi-Pure Poshak",
    work: "Heavy Kundan Work",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Classic Poshak",
    details: [
      "Semi-pure poshak",
      "Georgette material",
      "Heavy kundan work",
      "Four-side border",
      "Gota kiran in odhna",
      "Size XL to XXL",
      "Stitching included",
    ],
    includes: [
      "Finished Kalidar Ghagra with Heavy Hem",
      "Tailored Kurti & Kanchali Ensemble",
      "Four-side border with Gota Kiran Odhna",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "kesariya-utsav-rajputi-poshak",
    name: "Kesariya-Utsav-Poshak",
    category: "Classic Poshak",
    type: "Stitched",
    subCategory: "Classic Poshak",

    price: "₹ 3,106",
    priceNote: "Inclusive of stitching",
    fabric: "georgette material",
    craft: "Danka Handwork, Zardozi & Ancestral Gota Patti",
    color: "Auspicious Kesariya & Crimson",
    image: "/products/Kesariya-Utsav-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Kesariya-Utsav-Poshak/1.webp",
      "/products/Kesariya-Utsav-Poshak/2.webp",
      "/products/Kesariya-Utsav-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Kesariya Utsav Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious occasions, pooja ceremonies, and royal celebrations. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Georgette material in a luminous Auspicious Kesariya & Crimson shade, lavishly adorned with Danka Handwork, Zardozi & Ancestral Gota Patti.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Ancestral festive craftsmanship passed through artisanal lineages",
      "Intricate danka plate embroidery on lehenga hem and kurti front",
      "Ceremonial weight odhani adorned with broad metallic fringe",
      "Designed specifically for festive utsavs and royal occasions",
    ],
    includes: [
      "Imperial Flared Ghagra with Danka Border",
      "Embroidered Kurti & Kanchali Pair",
      "Full-Length Royal Odhani with Kiran",
      "Magji & Pure Lining Pack",
    ],
  },
  {
    id: "morika-lavender-rajputi-poshak",
    name: "Morika-Lavender-Poshak",
    category: "Bridal",
    type: "Stitched",

    price: "Available within 10 days",
    priceNote: "Available within 10 days",
    soldOut: true,
    fabric: "Fine Georgette & Pure Silk Magji",
    craft: "Modern Gotapatti Flowers & Silver Kasab",
    color: "Pastel Lavender & Silver Frost",
    image: "/products/Morika-Lavender-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Morika-Lavender-Poshak/1.webp",
      "/products/Morika-Lavender-Poshak/2.webp",
      "/products/Morika-Lavender-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Morika Lavender Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Fine Georgette & Pure Silk Magji in a luminous Pastel Lavender & Silver Frost shade, lavishly adorned with Modern Gotapatti Flowers & Silver Kasab.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Unique pastel lavender tone paired with crisp silver kasab zari",
      "Featherlight drape ideal for comfortable day-long wear",
      "Pre-stitched kalidar lehenga with reinforced royal flare",
      "Handcrafted silver fringe along the odhani perimeter",
    ],
    includes: [
      "Stitched 12-Kali Lavender Ghagra",
      "Pre-tailored Kurti & Kanchali Set",
      "Gossamer Sheer Odhani with Silver Kiran",
      "Breathable Cotton Lining Attached",
    ],
  },
  {
    id: "gulabi-mor-rajputi-poshak",
    name: "Gulabi-Mor-Poshak",
    category: "Bridal",
    subCategory: "Bridal",

    price: "₹ 7,390",
    priceNote: "Inclusive of stitching",
    fabric: "half pure material and pure chiffon material",
    craft: "Heavy Kundan Work",
    color: "Vibrant Gulabi Pink & Golden Zari",
    image: "/products/Gulabi-Mor-Poshak/1.webp",
    imagePosition: "center center",
    additionalImages: [
      "/products/Gulabi-Mor-Poshak/1.webp",
      "/products/Gulabi-Mor-Poshak/2.webp",
      "/products/Gulabi-Mor-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Gulabi Mor Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Georgette & Pure Chiffon Odhana in a luminous Vibrant Gulabi Pink & Golden Zari shade, lavishly adorned with Heavy Kundan Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring Gota Kiran Border, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL to XXL",
    quality: "Semi-Pure Poshak",
    work: "Heavy Kundan Work",
    odhna: "Gota Kiran Border",
    bestFor: "Bridal",
    details: [
      "Semi-pure poshak",
      "Georgette material",
      "Heavy kundan work",
      "Gota kiran border",
      "Size XL to XXL",
      "Stitching included",
    ],
    includes: [
      "Ready-to-Wear Flared Gulabi Ghagra",
      "Stitched Kurti and Kanchali Ensemble",
      "Heavy Embroidered Pure Odhani",
      "Satin Magji & Soft Cotton Inner",
    ],
  },
  {
    id: "neelam-noor-rajputi-poshak",
    name: "Neelam-Noor-Poshak",
    category: "Festive",
    type: "Stitched",

    price: "₹ 5,146",
    priceNote: "Inclusive of stitching",
    fabric: "half pure material",
    craft: "Aari-Tari Needlework & Kasab Zari Bel",
    color: "Midnight Neelam Blue & Gold",
    image: "/products/Neelam-Noor-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Neelam-Noor-Poshak/1.webp",
      "/products/Neelam-Noor-Poshak/2.webp",
      "/products/Neelam-Noor-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Neelam Noor Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Georgette & Satin Magji in a luminous Midnight Neelam Blue & Gold shade, lavishly adorned with Aari-Tari Needlework & Kasab Zari Bel.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Pre-tailored cuts designed for elegant bespoke fit and personal comfort",
      "Deep jewel-toned sapphire hue with contrast antique gold aari work",
      "Generous lehenga flare with reinforced royal hem",
      "Includes matched satin magji and pure gota piping bundles",
    ],
    includes: [
      "Stitched Kalidar Ghagra",
      "Pre-tailored Kurti & Kanchali Top",
      "2.5m Pure Georgette Odhani with Gold Trim",
      "Complete Magji and Inner Lining Material",
    ],
  },
  {
    id: "morni-rang-rajputi-poshak",
    name: "Morni-Rang-Poshak",
    category: "Bridal",
    type: "Stitched",
    subCategory: "Bridal",

    price: "₹ 7,390",
    priceNote: "Inclusive of stitching",
    fabric: "half pure material and pure chiffon material",
    craft: "Dense Zardozi, Real Gotapatti & Marodi Work",
    color: "Dual Peacock Green & Royal Crimson",
    image: "/products/Morni-Rang-Poshak/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Morni-Rang-Poshak/1.webp",
      "/products/Morni-Rang-Poshak/2.webp",
      "/products/Morni-Rang-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Morni Rang Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Georgette & Pure Chiffon Odhana in a luminous Dual Peacock Green & Royal Crimson shade, lavishly adorned with Dense Zardozi, Real Gotapatti & Marodi Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Heavyweight bridal ensemble crafted with authentic metallic zari",
      "Intricate peacock vines hand-tacked across all lehenga kalis",
      "Double-layered odhani with antique gold kiran fringe",
      "Ancestral design documented from royal court archives",
    ],
    includes: [
      "Grand Kalidar Ghagra with Heavy Hem",
      "Intricately Detailed Kurti & Kanchali Pair",
      "Ceremonial Bridal-Weight Odhani with Kiran",
      "Pure Cotton Inner Lining Bundle",
    ],
  },
  {
    id: "rajsi-maroon-rajputi-poshak",
    name: "Rajsi-Maroon-Poshak",
    category: "Bridal",
    type: "Stitched",
    subCategory: "Bridal",

    price: "₹ 6,574",
    priceNote: "Inclusive of stitching",
    fabric: "vintage material",
    craft: "Handcrafted Gotapatti, Dabka & Antique Kasab",
    color: "Imperial Maroon & Antique Gold",
    image: "/products/Rajsi-Maroon-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Rajsi-Maroon-Poshak/1.webp",
      "/products/Rajsi-Maroon-Poshak/2.webp",
      "/products/Rajsi-Maroon-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Rajsi Maroon Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Vintage Heritage Silk & Brocade in a luminous Imperial Maroon & Antique Gold shade, lavishly adorned with Handcrafted Gotapatti, Dabka & Antique Kasab.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Imperial deep crimson maroon tone favored for sacred wedding rituals",
      "Mastercrafted dabka and kasab needlework with tactile depth",
      "Richly framed odhani designed to sit regally over royal borla",
      "Heirloom finish designed to be passed down through generations",
    ],
    includes: [
      "Imperial Bridal Ghagra with Broad Hem",
      "Hand-Embroidered Kurti & Kanchali",
      "Heavy Traditional Odhani with Kiran",
      "Authentic Magji and Inner Bundle",
    ],
  },
  {
    id: "neelambari-rajputi-poshak",
    name: "Neelambari-Poshak",
    category: "Bridal",
    type: "Stitched",

    price: "₹ 7,594",
    priceNote: "Inclusive of stitching",
    fabric: "Pure silk material",
    craft: "Gotapatti Jaal, Sequin Highlights & Kasab Zari",
    color: "Sky Neelambari & Silver Frost",
    image: "/products/Neelambari-Poshak/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Neelambari-Poshak/1.webp",
      "/products/Neelambari-Poshak/2.webp",
      "/products/Neelambari-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Neelambari Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Pure Heritage Silk & Satin Magji in a luminous Sky Neelambari & Silver Frost shade, lavishly adorned with Gotapatti Jaal, Sequin Highlights & Kasab Zari.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Luminous celestial blue shade evoking desert twilight skies",
      "Pre-tailored structured lehenga for effortless movement",
      "Lightweight yet structured pure georgette for effortless poise",
      "Finished with matching magji and gota ribbon accents",
    ],
    includes: [
      "Stitched 12-Kali Leheriya-Embroidered Ghagra",
      "Kurti & Kanchali Ensemble",
      "Hand-Finished Odhani with Delicate Kiran",
      "Matching Magji & Lining Bundle",
    ],
  },
  {
    id: "gulabi-neelam-rajputi-poshak",
    name: "Gulabi-Neelam-Poshak",
    category: "Bridal",
    type: "Stitched",
    subCategory: "Bridal",

    price: "₹ 7,390",
    priceNote: "Inclusive of stitching",
    fabric: "half pure material and pure chiffon material",
    craft: "Intricate Peacock Jaal & Shimmering Gotapatti",
    color: "Gulabi Pink & Neelam Royal Blue",
    image: "/products/Gulabi-Neelam-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Gulabi-Neelam-Poshak/1.webp",
      "/products/Gulabi-Neelam-Poshak/2.webp",
      "/products/Gulabi-Neelam-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Gulabi Neelam Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Georgette & Pure Chiffon Odhana in a luminous Gulabi Pink & Neelam Royal Blue shade, lavishly adorned with Intricate Peacock Jaal & Shimmering Gotapatti.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Signature royal color block favored in Mewar royal celebrations",
      "Dense gotapatti peacocks with raised zari embroidery",
      "Sweeping flared ghagra with heirloom magji finish",
      "Grand ceremonial odhani framed with double gold kiran",
    ],
    includes: [
      "Flared Kalidar Gulabi Ghagra",
      "Heavily Embroidered Kurti & Kanchali Set",
      "Contrast Royal Neelam Odhani with Kiran",
      "Matching Magji and Pure Lining Material",
    ],
  },
  {
    id: "gulabi-noor-rajputi-poshak",
    name: "Gulabi-Noor-Poshak",
    category: "Festive",
    type: "Stitched",

    price: "₹ 4,228",
    priceNote: "Inclusive of stitching",
    fabric: "half pure material",
    craft: "Fine Aari Needlework & Hand-Folded Gota Foliage",
    color: "Blush Noor Pink",
    image: "/products/Gulabi-Noor-Poshak/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Gulabi-Noor-Poshak/1.webp",
      "/products/Gulabi-Noor-Poshak/2.webp",
      "/products/Gulabi-Noor-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Gulabi Noor Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Georgette & Satin Magji in a luminous Blush Noor Pink shade, lavishly adorned with Fine Aari Needlework & Hand-Folded Gota Foliage.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with hand-fringed gota kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    details: [
      "Soft luminescent blush hue ideal for daytime festivities",
      "Pre-tailored kanchali and lehenga guaranteeing structured fit",
      "Finished with delicate authentic gota borders",
      "Breathable natural fabric engineered for bridal comfort",
    ],
    includes: [
      "Tailored 12-Kali Blush Ghagra",
      "Stitched Kurti and Kanchali Ensemble",
      "Full-Length Gossamer Odhani with Fine Kiran",
      "Attached Soft Cotton Inner Lining",
    ],
  },
  {
    id: "gulabi-poshak-traditional",

    name: "Gulabi-Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 4,840",
    priceNote: "Inclusive of stitching",
    fabric: "Half-Pure Fabric",
    craft: "Kundan & Zardozi Work",
    color: "Gulabi Rose Pink",
    image: "/products/Gulabi-Poshak/1.webp",
    imagePosition: "center 2%",
    additionalImages: [
      "/products/Gulabi-Poshak/1.webp",
      "/products/Gulabi-Poshak/2.webp",
      "/products/Gulabi-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Gulabi Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Fabric in a luminous Gulabi Rose Pink shade, lavishly adorned with Kundan & Zardozi Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Half-Pure Poshak",
    work: "Kundan & Zardozi Work",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Festive",
    details: [
      "Half-pure poshak",
      "Kundan and zardozi work detailing",
      "Four-side border with gota kiran in odhna",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Finished Kalidar Gulabi Ghagra with Kundan & Zardozi Work",
      "Tailored Kurti & Kanchali Ensemble",
      "Gulabi Odhna with Four-Side Border & Gota Kiran",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "gulbahar-rajputi-poshak",
    name: "Gulbahar-Poshak",

    category: "Festive",
    subCategory: "Festive",
    price: "₹ 5,554",
    priceNote: "Inclusive of stitching",
    fabric: "Tissue Georgette & Chiffon",
    craft: "Handcrafted Gota Patti & Dabka Work",
    color: "Blossom Gulbahar Pink & Gold",
    image: "/products/Gulbahar-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Gulbahar-Poshak/1.webp",
      "/products/Gulbahar-Poshak/2.webp",
      "/products/Gulbahar-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Gulbahar Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Tissue Georgette & Chiffon in a luminous Blossom Gulbahar Pink & Gold shade, lavishly adorned with Gota Patti & Dabka Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Pure Poshak",
    work: "Gota Patti & Dabka Work",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Festive",
    details: [
      "Traditional pure poshak",
      "Gota patti florets and dabka motifs",
      "Four-side border with gota kiran in odhna",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Finished Kalidar Gulbahar Ghagra",
      "Tailored Kurti & Kanchali Ensemble",
      "Pure Chiffon Odhna with Gota Kiran",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "kesariya-gulab-rajputi-poshak",
    name: "Kesariya-Gulab-Poshak",
    category: "Classic Poshak",
    subCategory: "Classic Poshak",

    price: "₹ 2,800",
    priceNote: "Inclusive of stitching",
    fabric: "Georgette",
    craft: "Yellow Sequin Work",
    color: "Kesariya Yellow",
    image: "/products/Kesariya-Gulab-Poshak/1.webp",
    imagePosition: "center center",
    additionalImages: [
      "/products/Kesariya-Gulab-Poshak/1.webp",
      "/products/Kesariya-Gulab-Poshak/2.webp",
      "/products/Kesariya-Gulab-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Kesariya Gulab Rajputi Poshak is an authentic Royal Rajputi Poshak designed for Classic Poshak. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Georgette in a luminous Kesariya Yellow shade, lavishly adorned with Yellow Sequin Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Semi-Pure Poshak",
    work: "Yellow Sequin Work",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Classic Poshak",
    details: [
      "Semi-pure poshak",
      "Georgette fabric",
      "Yellow sequin work",
      "Four-side border with gota kiran",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Finished Kalidar Ghagra with Yellow Sequin Detailing",
      "Tailored Kurti & Kanchali Ensemble",
      "Four-side border with Gota Kiran Odhna",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "neelkamal-gulab-rajputi-poshak",
    name: "Neelkamal-Gulab-Poshak",

    category: "Festive",
    subCategory: "Festive",
    price: "₹ 5,554",
    priceNote: "Inclusive of stitching",
    fabric: "Pure Fabric",
    craft: "Zardozi & Kundan Work",
    color: "Deep Emerald Green & Rose",
    image: "/products/Neelkamal-Gulab-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Neelkamal-Gulab-Poshak/1.webp",
      "/products/Neelkamal-Gulab-Poshak/2.webp",
      "/products/Neelkamal-Gulab-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Neelkamal Gulab Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Pure Fabric in a luminous Deep Emerald Green & Rose shade, lavishly adorned with Zardozi & Kundan Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Pure Poshak",
    work: "Zardozi & Kundan Work",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Festive",
    details: [
      "Pure poshak",
      "Zardozi and kundan work detailing",
      "Four-side border with gota kiran odhna",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Finished Kalidar Ghagra with Zardozi & Kundan Embellishment",
      "Tailored Kurti & Kanchali Ensemble",
      "Pure Odhna with Four-Side Border & Gota Kiran",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "neelkanth-mor-rajputi-poshak",
    name: "Neelkanth-Mor-Poshak",
    category: "Bridal",

    subCategory: "Bridal",
    price: "₹ 7,390",
    priceNote: "Inclusive of stitching",
    fabric: "Half-Pure Fabric & Pure Chiffon",
    craft: "Pure Zari & Kundan Work",
    color: "Peacock Blue & Sea Green",
    image: "/products/Neelkanth-Mor-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Neelkanth-Mor-Poshak/1.webp",
      "/products/Neelkanth-Mor-Poshak/2.webp",
      "/products/Neelkanth-Mor-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Neelkanth Mor Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Fabric & Pure Chiffon in a luminous Peacock Blue & Sea Green shade, lavishly adorned with Pure Zari & Kundan Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border and Gota Kiran in Pure Chiffon, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Half-Pure Poshak",
    work: "Pure Zari & Kundan Work",
    odhna: "Four-side border and Gota Kiran in Pure Chiffon",
    bestFor: "Bridal",
    details: [
      "Half-pure poshak with pure chiffon odhna",
      "Pure zari and kundan work",
      "Grand 6.5 meter flared ghera",
      "Four-side border and gota kiran in odhna",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Kalidar Ghagra with 6.5m Flared Ghera & Kundan Zari Work",
      "Tailored Kurti & Kanchali Ensemble",
      "Pure Chiffon Odhna with Four-Side Border & Gota Kiran",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "pista-gulab-rajputi-poshak",
    name: "Pista-Gulab-Poshak",
    category: "Festive",

    subCategory: "Festive",
    price: "₹ 4,534",
    priceNote: "Inclusive of stitching",
    fabric: "Half-Pure Fabric",
    craft: "Kundan Work",
    color: "Pista Green",
    image: "/products/Pista-Gulab-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Pista-Gulab-Poshak/1.webp",
      "/products/Pista-Gulab-Poshak/2.webp",
      "/products/Pista-Gulab-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Pista Gulab Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Fabric in a luminous Pista Green shade, lavishly adorned with Kundan Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Half-Pure Poshak",
    work: "Kundan Work",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Festive",
    details: [
      "Half-pure poshak",
      "Kundan work detailing",
      "Four-side border in odhna with gota kiran",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Finished Kalidar Ghagra with Kundan Embroidery",
      "Tailored Kurti & Kanchali Ensemble",
      "Pista Green Odhna with Four-Side Border & Gota Kiran",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "rangrez-rani-lehenga-poshak",
    name: "Rangrez Rani Poshak",

    category: "Bridal",
    subCategory: "Bridal",
    price: "₹ 7,390",
    priceNote: "Inclusive of stitching",
    fabric: "Royal Velvet & Georgette",
    craft: "Rangrez Gota Border & Danka Work",
    color: "Royal Navy & Rani Pink",
    image: "/products/Rangrez-Rani-Lehenga/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Rangrez-Rani-Lehenga/1.webp",
      "/products/Rangrez-Rani-Lehenga/2.webp",
      "/products/Rangrez-Rani-Lehenga/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Rangrez Rani Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Royal Velvet & Georgette in a luminous Royal Navy & Rani Pink shade, lavishly adorned with Gota Border & Danka Needlework.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Pure Poshak",
    work: "Gota Border & Danka Needlework",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Bridal",
    details: [
      "Traditional festive poshak lehenga",
      "Dense gota patti panels and ceremonial borders",
      "Four-side border with gota kiran in odhna",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Stitched Grand Flared Velvet Ghagra",
      "Tailored Kurti & Kanchali Ensemble",
      "Rani Pink Odhna with Gota Kiran",
      "Pure Cotton Inner Lining Attached",
    ],
  },
  {
    id: "rani-crimson-rajputi-poshak",
    name: "Rani-Crimson-Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 6,370",
    priceNote: "Inclusive of stitching",
    fabric: "Pure Georgette & Brocade",
    craft: "Bridal Zardozi, Marodi & Heavy Kiran",
    color: "Deep Heritage Crimson & Gold",
    image: "/products/Rani-Crimson-Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Rani-Crimson-Poshak/1.webp",
      "/products/Rani-Crimson-Poshak/2.webp",
      "/products/Rani-Crimson-Poshak/3.webp",
    ],
    description:
      "Handcrafted with artisanal heritage finesse, the Rani Crimson Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Pure Georgette & Brocade in a luminous Deep Heritage Crimson & Gold shade, lavishly adorned with Bridal Zardozi & Marodi Work.\n\nThis ceremonial ensemble is a pre-tailored stitched ensemble featuring an imperial kalidar ghagra with generous royal flare, tailored kurti and kanchali, complemented by an odhna featuring four-side border with Gota Kiran, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Stitched",
    size: "XL, XXL",
    sizes: ["XL", "XXL"],
    quality: "Pure Poshak",
    work: "Bridal Zardozi & Marodi Work",
    odhna: "Four-side border with Gota Kiran",
    bestFor: "Festive",
    details: [
      "Classic heirloom crimson red bridal poshak",
      "Heavy marodi and zardozi needlework",
      "Four-side border with gota kiran in odhna",
      "Size XL, XXL",
      "Stitching included",
    ],
    includes: [
      "Imperial Flared Crimson Ghagra with Zardozi Work",
      "Tailored Kurti & Kanchali Top Set",
      "Bridal-Weight Pure Odhna with Rich Kiran",
      "Pure Cotton Inner Lining Attached",
    ],
  },
  {
    id: "kundan-rajputi-rakhdi",
    name: "Kundan-Rajputi-Rakhdi",
    category: "Jewellery",
    type: "Jewellery",

    price: "₹ 5,350",
    fabric: "Metal",
    craft: "Kundan",
    color: "Gold",
    image: "/Jewellery/Kundan-Rajputi-Rakhdi/9047ef51-3e9d-42c8-a98a-662b5d211956.webp",
    imagePosition: "center",
    description: "Handcrafted with royal heritage artistry, the Kundan Rajputi Rakhdi is an exquisite Rajasthani bridal jewellery piece designed for royal weddings, festive celebrations, and heirloom adornment. Crafted with high-grade metal alloy, lustrous kundan stones, and intricate meenakari detailing, this ceremonial accessory embodies centuries of Rajputana regal finery.\n\nThis traditional jewellery creation features authentic Rajasthani craftsmanship, engineered for both lasting durability and royal elegance. The piece pairs seamlessly with bridal and festive Rajputi poshaks, accentuating your traditional ensemble with unmistakable royal grace.\n\nCare & Preservation: Keep away from moisture, water, perfumes, and hairsprays to maintain the lustrous gold polish and stone settings. Store separately in an airtight velvet-lined jewellery box.\n\nDelivery & Packaging: Carefully packed in a protective luxury jewellery case and dispatched from Rajwadi, Nagpur. Complimentary insured shipping across India and express worldwide delivery.",
    details: ["Jewellery"],
    includes: ["1 Rakhdi"]
  },
  {
    id: "rajputi-borla",
    name: "Rajputi-Borla",
    category: "Jewellery",
    type: "Jewellery",

    price: "₹ 3,820",
    fabric: "Metal",
    craft: "Kundan",
    color: "Gold",
    image: "/Jewellery/Rajputi-Borla/6ac6fabd-f6ab-4e8d-a7c7-36e1be38e3d8.webp",
    imagePosition: "center",
    description: "Handcrafted with royal heritage artistry, the Rajputi Borla is an exquisite Rajasthani bridal jewellery piece designed for royal weddings, festive celebrations, and heirloom adornment. Crafted with high-grade metal alloy, lustrous kundan stones, and intricate meenakari detailing, this ceremonial accessory embodies centuries of Rajputana regal finery.\n\nThis traditional jewellery creation features authentic Rajasthani craftsmanship, engineered for both lasting durability and royal elegance. The piece pairs seamlessly with bridal and festive Rajputi poshaks, accentuating your traditional ensemble with unmistakable royal grace.\n\nCare & Preservation: Keep away from moisture, water, perfumes, and hairsprays to maintain the lustrous gold polish and stone settings. Store separately in an airtight velvet-lined jewellery box.\n\nDelivery & Packaging: Carefully packed in a protective luxury jewellery case and dispatched from Rajwadi, Nagpur. Complimentary insured shipping across India and express worldwide delivery.",
    details: ["Jewellery"],
    includes: ["1 Borla"]
  },
  {
    id: "rajputi-bridal-jewellery-set",
    name: "Rajputi-Bridal-Jewellery-Set",
    category: "Jewellery",
    type: "Jewellery",

    price: "₹ 46,150",
    fabric: "Metal",
    craft: "Kundan",
    color: "Gold",
    image: "/Jewellery/Rajputi-Bridal-Jewellery-Set/73e3bb0b-9398-4aa7-9b9c-bb8d04ba8c2d.webp",
    imagePosition: "center",
    description: "Handcrafted with royal heritage artistry, the Rajputi Bridal Jewellery Set is an exquisite Rajasthani bridal jewellery piece designed for royal weddings, festive celebrations, and heirloom adornment. Crafted with high-grade metal alloy, lustrous kundan stones, and intricate meenakari detailing, this ceremonial accessory embodies centuries of Rajputana regal finery.\n\nThis traditional jewellery creation features authentic Rajasthani craftsmanship, engineered for both lasting durability and royal elegance. The piece pairs seamlessly with bridal and festive Rajputi poshaks, accentuating your traditional ensemble with unmistakable royal grace.\n\nCare & Preservation: Keep away from moisture, water, perfumes, and hairsprays to maintain the lustrous gold polish and stone settings. Store separately in an airtight velvet-lined jewellery box.\n\nDelivery & Packaging: Carefully packed in a protective luxury jewellery case and dispatched from Rajwadi, Nagpur. Complimentary insured shipping across India and express worldwide delivery.",
    details: ["Bridal Jewellery Set"],
    includes: ["Full Set"]
  },
  {
    id: "rajputi-sheeshphool",
    name: "Rajputi-Sheeshphool",
    category: "Jewellery",
    type: "Jewellery",

    price: "₹ 8,410",
    fabric: "Metal",
    craft: "Kundan",
    color: "Gold",
    image: "/Jewellery/Rajputi-Sheeshphool/d96f42f2-30c8-4d96-80ae-bfd4b0b3288d.webp",
    imagePosition: "center",
      imageScale: 1.25,
    description: "Handcrafted with royal heritage artistry, the Rajputi Sheeshphool is an exquisite Rajasthani bridal jewellery piece designed for royal weddings, festive celebrations, and heirloom adornment. Crafted with high-grade metal alloy, lustrous kundan stones, and intricate meenakari detailing, this ceremonial accessory embodies centuries of Rajputana regal finery.\n\nThis traditional jewellery creation features authentic Rajasthani craftsmanship, engineered for both lasting durability and royal elegance. The piece pairs seamlessly with bridal and festive Rajputi poshaks, accentuating your traditional ensemble with unmistakable royal grace.\n\nCare & Preservation: Keep away from moisture, water, perfumes, and hairsprays to maintain the lustrous gold polish and stone settings. Store separately in an airtight velvet-lined jewellery box.\n\nDelivery & Packaging: Carefully packed in a protective luxury jewellery case and dispatched from Rajwadi, Nagpur. Complimentary insured shipping across India and express worldwide delivery.",
    details: ["Jewellery"],
    includes: ["1 Sheeshphool"]
  },
  {
    id: "rajsi-green-aad-necklace-set",
    name: "Rajsi-Green-Aad-Necklace-Set",
    category: "Jewellery",
    type: "Jewellery",

    price: "₹ 15,550",
    fabric: "Metal",
    craft: "Kundan",
    color: "Green",
    image: "/Jewellery/Rajsi-Green-Aad-Necklace-Set/fd0bcb88-533a-4f5d-bac6-456f2fcf2919.webp",
    imagePosition: "center",
    description: "Handcrafted with royal heritage artistry, the Rajsi Green Aad Necklace Set is an exquisite Rajasthani bridal jewellery piece designed for royal weddings, festive celebrations, and heirloom adornment. Crafted with high-grade metal alloy, lustrous kundan stones, and intricate meenakari detailing, this ceremonial accessory embodies centuries of Rajputana regal finery.\n\nThis traditional jewellery creation features authentic Rajasthani craftsmanship, engineered for both lasting durability and royal elegance. The piece pairs seamlessly with bridal and festive Rajputi poshaks, accentuating your traditional ensemble with unmistakable royal grace.\n\nCare & Preservation: Keep away from moisture, water, perfumes, and hairsprays to maintain the lustrous gold polish and stone settings. Store separately in an airtight velvet-lined jewellery box.\n\nDelivery & Packaging: Carefully packed in a protective luxury jewellery case and dispatched from Rajwadi, Nagpur. Complimentary insured shipping across India and express worldwide delivery.",
    details: ["Jewellery"],
    includes: ["1 Aad Necklace Set"]
  },
  {
    id: "rajsi-kundan-aad-necklace",
    name: "Rajsi-Kundan-Aad-Necklace",
    category: "Jewellery",
    type: "Jewellery",

    price: "₹ 12,490",
    fabric: "Metal",
    craft: "Kundan",
    color: "Gold",
    image: "/Jewellery/Rajsi-Kundan-Aad-Necklace/2e24d40e-016b-4e56-80ad-8d2699da3bc6.webp",
    imagePosition: "center",
    description: "Handcrafted with royal heritage artistry, the Rajsi Kundan Aad Necklace is an exquisite Rajasthani bridal jewellery piece designed for royal weddings, festive celebrations, and heirloom adornment. Crafted with high-grade metal alloy, lustrous kundan stones, and intricate meenakari detailing, this ceremonial accessory embodies centuries of Rajputana regal finery.\n\nThis traditional jewellery creation features authentic Rajasthani craftsmanship, engineered for both lasting durability and royal elegance. The piece pairs seamlessly with bridal and festive Rajputi poshaks, accentuating your traditional ensemble with unmistakable royal grace.\n\nCare & Preservation: Keep away from moisture, water, perfumes, and hairsprays to maintain the lustrous gold polish and stone settings. Store separately in an airtight velvet-lined jewellery box.\n\nDelivery & Packaging: Carefully packed in a protective luxury jewellery case and dispatched from Rajwadi, Nagpur. Complimentary insured shipping across India and express worldwide delivery.",
    details: ["Jewellery"],
    includes: ["1 Aad Necklace"]
  },
  {
    id: "kesari-noor-poshak-material",
    name: "Kesari Noor Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 4,626",
    fabric: "Fandy Fabric",
    craft: "Heavy Zari Multi Work Border with Diamond Work",
    color: "Kesari Saffron",
    image: "/yellow.jpeg",
    additionalImages: ["/products/Unstiched/Kesari-Noor-Rajputi-Poshak/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Kesari Noor Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Fancy Royal Fabric & Satin Magji in a luminous Kesari Saffron shade, lavishly adorned with Heavy Zari Multi Work Border with Diamond Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Half-Pure Odhna, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Quality",
    work: "Heavy Zari Multi Work Border with Diamond Work",
    odhna: "Half-Pure Odhna",
    bestFor: "Festive",
    stitchingAvailable: true,
    details: [
      "Type — Semi-Stitched",
      "Fabric — Fandy Fabric",
      "Quality — Premium Quality",
      "Odhna — Half-Pure Odhna",
      "Work — Heavy Zari Multi Work Border with Diamond Work",
      "Gala — Heavy Gala Work",
      "Odhna Work — Four-side Butti Work with Gota Turri",
      "Set Detail — Magji Complete Poshak",
      "Best For — Festive",
    ],
    includes: [
      "Semi-Stitched Ghagra Fabric (Kalidar Cut)",
      "Semi-Stitched Kurti & Kanchali Fabric",
      "Full Size Odhna with Kiran Border",
      "Lining & Magji Bundle",
    ],
  },
  {
    id: "laal-mahal-poshak-material",
    name: "Laal Mahal Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 4,626",
    fabric: "Fandy Fabric",
    craft: "Heavy Zari Multi Work Border with Diamond Work",
    color: "Royal Crimson Red",
    image: "/products/cloud/oewtbhxcrc6kzj4gubte.webp",
    additionalImages: ["/products/Unstiched/Laal-Mahal-Rajputi-Poshak/1.webp","/red.jpeg"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Laal Mahal Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Fancy Royal Fabric & Satin Magji in a luminous Royal Crimson Red shade, lavishly adorned with Heavy Zari Multi Work Border with Diamond Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Half-Pure Odhna, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Quality",
    work: "Heavy Zari Multi Work Border with Diamond Work",
    odhna: "Half-Pure Odhna",
    bestFor: "Festive",
    stitchingAvailable: true,
    details: [
      "Type — Semi-Stitched",
      "Fabric — Fandy Fabric",
      "Quality — Premium Quality",
      "Odhna — Half-Pure Odhna",
      "Work — Heavy Zari Multi Work Border with Diamond Work",
      "Gala — Heavy Gala Work",
      "Odhna Work — Four-side Butti Work with Gota Turri",
      "Set Detail — Magji Complete Poshak",
      "Best For — Festive",
    ],
    includes: [
      "Semi-Stitched Ghagra Panels",
      "Embroidered Kurti & Kanchali Fabric",
      "Heavy Bridal Odhna with Kiran Fringe",
      "Astar Lining & Magji Package",
    ],
  },
  {
    id: "rajrani-maroon-ivory-poshak-material",
    name: "Rajrani Maroon Ivory Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 4,626",
    fabric: "Fandy Fabric",
    craft: "Heavy Zari Multi Work Border with Diamond Work",
    color: "Maroon & Ivory",
    image: "/brown.jpeg",
    additionalImages: ["/products/Unstiched/Rajrani-Maroon-Ivory-Poshak/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Rajrani Maroon Ivory Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Fancy Royal Fabric & Satin Magji in a luminous Maroon & Ivory shade, lavishly adorned with Heavy Zari Multi Work Border with Diamond Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Half-Pure Odhna, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Quality",
    work: "Heavy Zari Multi Work Border with Diamond Work",
    odhna: "Half-Pure Odhna",
    bestFor: "Festive",
    stitchingAvailable: true,
    details: [
      "Type — Semi-Stitched",
      "Fabric — Fandy Fabric",
      "Quality — Premium Quality",
      "Odhna — Half-Pure Odhna",
      "Work — Heavy Zari Multi Work Border with Diamond Work",
      "Gala — Heavy Gala Work",
      "Odhna Work — Four-side Butti Work with Gota Turri",
      "Set Detail — Magji Complete Poshak",
      "Best For — Festive",
    ],
    includes: [
      "Unstitched Ghagra Fabric",
      "Kurti & Kanchali Fabric",
      "Odhna with Kiran",
      "Lining & Magji Bundle",
    ],
  },
  {
    id: "rani-sa-gulabi-poshak-material",
    name: "Rani Sa Gulabi Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 4,626",
    fabric: "Fandy Fabric",
    craft: "Heavy Zari Multi Work Border with Diamond Work",
    color: "Rani Sa Gulabi",
    image: "/pink3.jpeg",
    additionalImages: ["/products/Unstiched/Rani Sa Gulabi-Poshak/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Rani Sa Gulabi Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Fancy Royal Fabric & Satin Magji in a luminous Rani Sa Gulabi shade, lavishly adorned with Heavy Zari Multi Work Border with Diamond Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Half-Pure Odhna, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Quality",
    work: "Heavy Zari Multi Work Border with Diamond Work",
    odhna: "Half-Pure Odhna",
    bestFor: "Festive",
    stitchingAvailable: true,
    details: [
      "Type — Semi-Stitched",
      "Fabric — Fandy Fabric",
      "Quality — Premium Quality",
      "Odhna — Half-Pure Odhna",
      "Work — Heavy Zari Multi Work Border with Diamond Work",
      "Gala — Heavy Gala Work",
      "Odhna Work — Four-side Butti Work with Gota Turri",
      "Set Detail — Magji Complete Poshak",
      "Best For — Festive",
    ],
    includes: [
      "Semi-Stitched Ghagra Material",
      "Semi-Stitched Kurti-Kanchali",
      "Matching Odhna with Kiran",
      "Magji & Cotton Lining",
    ],
  },
  {
    id: "gulnaar-rajsi-poshak-material",
    name: "Gulnaar Rajsi Semi Stitched Poshak",
    category: "Bridal",
    subCategory: "Bridal",
    price: "₹ 4,320",
    fabric: "Heavy Quality",
    craft: "Heavy Border Work",
    color: "Red",
    image: "/red.jpeg",
    additionalImages: ["/products/Unstiched/Gulnaar-Rajsi-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Gulnaar Rajsi Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Heavy Bridal Georgette & Satin Magji in a luminous Red shade, lavishly adorned with Heavy Border Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring four-side Work with Fancy Buttiya, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Heavy Quality",
    work: "Heavy Border Work",
    odhna: "Four-side Work with Fancy Buttiya",
    bestFor: "Bridal",
    stitchingAvailable: true,
    details: [
      "Type — Semi-Stitched",
      "Quality — Heavy Quality",
      "Work — Heavy Border Work",
      "Kurti Work — Heavy Kurti Work with Gala Work",
      "Odhna — Four-side Work with Fancy Buttiya",
      "Set Type — Single Suit",
      "Best For — Bridal",
    ],
    includes: [
      "Semi-Stitched Poshak Set"
    ],
  },
  {
    id: "rajkumari-gulnaar-poshak-material",
    name: "Rajkumari Gulnaar Semi Stitched Poshak",
    category: "Bridal",
    subCategory: "Bridal",
    price: "₹ 4,320",
    fabric: "Heavy Quality",
    craft: "Heavy Border Work",
    color: "Red",
    image: "/pink5.jpeg",
    additionalImages: ["/products/Unstiched/Rajkumari-Gulnaar-Poshak/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Rajkumari Gulnaar Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Heavy Bridal Georgette & Satin Magji in a luminous Red shade, lavishly adorned with Heavy Border Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring four-side Work with Fancy Buttiya, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Heavy Quality",
    work: "Heavy Border Work",
    odhna: "Four-side Work with Fancy Buttiya",
    bestFor: "Bridal",
    stitchingAvailable: true,
    details: [
      "Type — Semi-Stitched",
      "Quality — Heavy Quality",
      "Work — Heavy Border Work",
      "Kurti Work — Heavy Kurti Work with Gala Work",
      "Odhna — Four-side Work with Fancy Buttiya",
      "Set Type — Single Suit",
      "Best For — Bridal",
    ],
    includes: [
      "Semi-Stitched Poshak Set"
    ],
  },
  {
    id: "raktima-zari-poshak-material",
    name: "Raktima Zari Semi Stitched Poshak",
    category: "Bridal",
    subCategory: "Bridal",
    price: "₹ 4,320",
    fabric: "Heavy Quality",
    craft: "Heavy Border Work",
    color: "Red",
    image: "/products/cloud/b5bpen8eztzn22fux9xe.webp",
    additionalImages: ["/products/Unstiched/Raktima-Zari-Poshak-Material/1.webp","/red2.jpeg"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Raktima Zari Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Heavy Bridal Georgette & Satin Magji in a luminous Red shade, lavishly adorned with Heavy Border Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring four-side Work with Fancy Buttiya, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Heavy Quality",
    work: "Heavy Border Work",
    odhna: "Four-side Work with Fancy Buttiya",
    bestFor: "Bridal",
    stitchingAvailable: true,
    details: [
      "Type — Semi-Stitched",
      "Quality — Heavy Quality",
      "Work — Heavy Border Work",
      "Kurti Work — Heavy Kurti Work with Gala Work",
      "Odhna — Four-side Work with Fancy Buttiya",
      "Set Type — Single Suit",
      "Best For — Bridal",
    ],
    includes: [
      "Semi-Stitched Poshak Set"
    ],
  },
  {
    id: "surkh-rajsi-poshak-material",
    name: "Surkh Rajsi Semi Stitched Poshak",
    category: "Bridal",
    subCategory: "Bridal",
    price: "₹ 4,320",
    fabric: "Heavy Quality",
    craft: "Heavy Border Work",
    color: "Red",
    image: "/products/cloud/zglpytqufj3qn2rpzpom.webp",
    additionalImages: ["/products/Unstiched/Surkh-Rajsi-Poshak-Material/1.webp","/red3.jpeg"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Surkh Rajsi Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for regal weddings and bridal ceremonies. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Heavy Bridal Georgette & Satin Magji in a luminous Red shade, lavishly adorned with Heavy Border Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring four-side Work with Fancy Buttiya, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Heavy Quality",
    work: "Heavy Border Work",
    odhna: "Four-side Work with Fancy Buttiya",
    bestFor: "Bridal",
    stitchingAvailable: true,
    details: [
      "Type — Semi-Stitched",
      "Quality — Heavy Quality",
      "Work — Heavy Border Work",
      "Kurti Work — Heavy Kurti Work with Gala Work",
      "Odhna — Four-side Work with Fancy Buttiya",
      "Set Type — Single Suit",
      "Best For — Bridal",
    ],
    includes: [
      "Semi-Stitched Poshak Set"
    ],
  },
  {
    id: "baingani-gulnaar-leheriya-poshak-material",
    name: "Baingani Gulnaar Leheriya Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 3,820",
    fabric: "Premium Royal Pure Fabric",
    craft: "Heavy Fancy Barik Zari Work with Stone Work",
    color: "Baingani Gulnaar",
    image: "/products/cloud/wfstpy8teujacwouoq6w.webp",
    additionalImages: ["/products/Unstiched/Baingani-Gulnaar-Leheriya-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Baingani Gulnaar Leheriya Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Royal Pure Fabric in a luminous Baingani Gulnaar shade, lavishly adorned with Heavy Fancy Barik Zari Work with Stone Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Heavy Four-side Work, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Royal Pure Fabric",
    work: "Heavy Fancy Barik Zari Work with Stone Work",
    odhna: "Heavy Four-side Work",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Semi-Stitched",
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
      "Semi-Stitched Poshak Set",
      "Astar",
      "Aari Magji"
    ],
  },
  {
    id: "gulnaar-leheriya-poshak-material",
    name: "Gulnaar Leheriya Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 3,820",
    fabric: "Premium Royal Pure Fabric",
    craft: "Heavy Fancy Barik Zari Work with Stone Work",
    color: "Gulnaar",
    image: "/products/cloud/n4kv4jcsehfshvxxmysy.webp",
    additionalImages: ["/products/Unstiched/Gulnaar-Leheriya-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Gulnaar Leheriya Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Royal Pure Fabric in a luminous Gulnaar shade, lavishly adorned with Heavy Fancy Barik Zari Work with Stone Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Heavy Four-side Work, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Royal Pure Fabric",
    work: "Heavy Fancy Barik Zari Work with Stone Work",
    odhna: "Heavy Four-side Work",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Semi-Stitched",
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
      "Semi-Stitched Poshak Set",
      "Astar",
      "Aari Magji"
    ],
  },
  {
    id: "hari-kesariya-leheriya-poshak-material",
    name: "Hari Kesariya Leheriya Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 3,820",
    fabric: "Premium Royal Pure Fabric",
    craft: "Heavy Fancy Barik Zari Work with Stone Work",
    color: "Hari Kesariya",
    image: "/products/cloud/jpaqszjaafob0bck3o6v.webp",
    additionalImages: ["/products/Unstiched/Hari-Kesariya-Leheriya-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Hari Kesariya Leheriya Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Royal Pure Fabric in a luminous Hari Kesariya shade, lavishly adorned with Heavy Fancy Barik Zari Work with Stone Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Heavy Four-side Work, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Royal Pure Fabric",
    work: "Heavy Fancy Barik Zari Work with Stone Work",
    odhna: "Heavy Four-side Work",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Semi-Stitched",
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
      "Semi-Stitched Poshak Set",
      "Astar",
      "Aari Magji"
    ],
  },
  {
    id: "panna-leheriya-poshak-material",
    name: "Panna Leheriya Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 3,820",
    fabric: "Premium Royal Pure Fabric",
    craft: "Heavy Fancy Barik Zari Work with Stone Work",
    color: "Panna",
    image: "/products/cloud/tkyuv3qdk384ijj0zjl6.webp",
    additionalImages: ["/products/Unstiched/Panna-Leheriya-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Panna Leheriya Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Royal Pure Fabric in a luminous Panna shade, lavishly adorned with Heavy Fancy Barik Zari Work with Stone Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Heavy Four-side Work, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Royal Pure Fabric",
    work: "Heavy Fancy Barik Zari Work with Stone Work",
    odhna: "Heavy Four-side Work",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Semi-Stitched",
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
      "Semi-Stitched Poshak Set",
      "Astar",
      "Aari Magji"
    ],
  },
  {
    id: "rani-gulabi-leheriya-poshak-material",
    name: "Rani Gulabi Leheriya Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 3,820",
    fabric: "Premium Royal Pure Fabric",
    craft: "Heavy Fancy Barik Zari Work with Stone Work",
    color: "Rani Gulabi",
    image: "/products/cloud/fe9zbnxeqxwa7tfbpv1g.webp",
    additionalImages: ["/products/Unstiched/Rani-Gulabi-Leheriya-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Rani Gulabi Leheriya Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Royal Pure Fabric in a luminous Rani Gulabi shade, lavishly adorned with Heavy Fancy Barik Zari Work with Stone Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Heavy Four-side Work, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Royal Pure Fabric",
    work: "Heavy Fancy Barik Zari Work with Stone Work",
    odhna: "Heavy Four-side Work",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Semi-Stitched",
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
      "Semi-Stitched Poshak Set",
      "Astar",
      "Aari Magji"
    ],
  },
  {
    id: "surkh-kesariya-leheriya-poshak-material",
    name: "Surkh Kesariya Leheriya Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 3,820",
    fabric: "Premium Royal Pure Fabric",
    craft: "Heavy Fancy Barik Zari Work with Stone Work",
    color: "Surkh Kesariya",
    image: "/products/cloud/skdi574kzwqnciuz1xvb.webp",
    additionalImages: ["/products/Unstiched/Surkh-Kesariya-Leheriya-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Surkh Kesariya Leheriya Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Premium Royal Pure Fabric in a luminous Surkh Kesariya shade, lavishly adorned with Heavy Fancy Barik Zari Work with Stone Work.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring Heavy Four-side Work, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Premium Royal Pure Fabric",
    work: "Heavy Fancy Barik Zari Work with Stone Work",
    odhna: "Heavy Four-side Work",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Semi-Stitched",
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
      "Semi-Stitched Poshak Set",
      "Astar",
      "Aari Magji"
    ],
  },
  {
    id: "laal-mor-poshak-material",
    name: "Laal Mor Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 4,126",
    fabric: "Half-Pure Fabric",
    craft: "Heavy Zari Work with Stone Touch",
    color: "Laal",
    image: "/products/cloud/eftdkkxmayzs2kzatdau.webp",
    additionalImages: ["/products/Unstiched/Laal-Mor-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Laal Mor Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Fabric in a luminous Laal shade, lavishly adorned with Heavy Zari Work with Stone Touch.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring four-side Work with Gota Turri, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Good Quality",
    work: "Heavy Zari Work with Stone Touch",
    odhna: "Four-side Work with Gota Turri",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Semi-Stitched",
      "Fabric — Half-Pure Fabric",
      "Quality — Good Quality",
      "Work — Heavy Zari Work with Stone Touch",
      "Odhna — Four-side Work with Gota Turri",
      "Lining — With Astar",
      "Set Detail — Magji Complete Dress",
      "Best For — Festive",
    ],
    includes: [
      "Semi-Stitched Poshak Set",
      "Astar",
      "Magji"
    ],
  },
  {
    id: "jamuni-mor-poshak-material",
    name: "Jamuni Mor Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 4,126",
    fabric: "Half-Pure Fabric",
    craft: "Heavy Zari Work with Stone Touch",
    color: "Jamuni",
    image: "/products/cloud/al7g3kadcvp5gs0r3srb.webp",
    additionalImages: ["/products/Unstiched/Jamuni-Mor-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Jamuni Mor Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Fabric in a luminous Jamuni shade, lavishly adorned with Heavy Zari Work with Stone Touch.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring four-side Work with Gota Turri, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Good Quality",
    work: "Heavy Zari Work with Stone Touch",
    odhna: "Four-side Work with Gota Turri",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Semi-Stitched",
      "Fabric — Half-Pure Fabric",
      "Quality — Good Quality",
      "Work — Heavy Zari Work with Stone Touch",
      "Odhna — Four-side Work with Gota Turri",
      "Lining — With Astar",
      "Set Detail — Magji Complete Dress",
      "Best For — Festive",
    ],
    includes: [
      "Semi-Stitched Poshak Set",
      "Astar",
      "Magji"
    ],
  },
  {
    id: "panna-mor-poshak-material",
    name: "Panna Mor Semi Stitched Poshak",
    category: "Festive",
    subCategory: "Festive",
    price: "₹ 4,126",
    fabric: "Half-Pure Fabric",
    craft: "Heavy Zari Work with Stone Touch",
    color: "Panna",
    image: "/products/cloud/oa0zfmfp1cnuxmbyndpg.webp",
    additionalImages: ["/products/Unstiched/Panna-Mor-Poshak-Material/1.webp"],
    imagePosition: "center",
    description: "Handcrafted with artisanal heritage finesse, the Panna Mor Semi Stitched Rajputi Poshak is an authentic Royal Rajputi Poshak designed for auspicious festive celebrations and royal gatherings. Imbued with centuries of Rajasthani courtly elegance, this ensemble is created in Half-Pure Fabric in a luminous Panna shade, lavishly adorned with Heavy Zari Work with Stone Touch.\n\nThis ceremonial ensemble is a semi-stitched poshak material set featuring unstitched kalidar ghagra panels, matching kurti-kanchali fabric with gala neckline work, complemented by an odhna featuring four-side Work with Gota Turri, complete with matching satin magji and pure cotton lining (astar). The flowing silhouette provides an expansive kalidar flare (ghera), ensuring an imposing royal swirl and effortless posture for day-long wedding and festival wear.\n\nCare & Maintenance: Strictly dry clean only to safeguard the delicate zari threads, gotta patti motifs, and pure fabric integrity. Store flat folded in a breathable cotton or muslin cover away from humidity.\n\nDelivery: Dispatched within 2 to 4 business days from the Rajwadi atelier in Hiwari Layout, Nagpur with fully insured tamper-evident courier delivery across India and worldwide.",
    type: "Unstitched",
    quality: "Good Quality",
    work: "Heavy Zari Work with Stone Touch",
    odhna: "Four-side Work with Gota Turri",
    bestFor: "Festive",
    stitchingAvailable: false,
    details: [
      "Type — Semi-Stitched",
      "Fabric — Half-Pure Fabric",
      "Quality — Good Quality",
      "Work — Heavy Zari Work with Stone Touch",
      "Odhna — Four-side Work with Gota Turri",
      "Lining — With Astar",
      "Set Detail — Magji Complete Dress",
      "Best For — Festive",
    ],
    includes: [
      "Semi-Stitched Poshak Set",
      "Astar",
      "Magji"
    ],
  },
];

export interface SubCategoryItem {
  id: string;
  title: string;
  href: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  image: string;
  imagePositionDesktop: string;
  imagePositionMobile: string;
  subCategories?: SubCategoryItem[];
}

export const COLLECTIONS_DATA: CollectionItem[] = [
  {
    id: "bridal-poshaks",
    title: "Heavy Poshak",
    image: "/bridal.webp",
    imagePositionDesktop: "md:object-top",
    imagePositionMobile: "object-top",
    subCategories: [
      { id: "stitched", title: "Stitched", href: "/collection/stitched-rajputi-poshak" },
      { id: "poshak-material", title: "Semi-Stitched", href: "/collection/semi-stitched-rajputi-poshak" },
    ],
  },
  {
    id: "everyday-poshaks",
    title: "Classic Poshak",
    image: "/stiched.webp",
    imagePositionDesktop: "md:object-top",
    imagePositionMobile: "object-top",
    subCategories: [
      { id: "stitched", title: "Stitched", href: "/collection/stitched-rajputi-poshak" },
      { id: "poshak-material", title: "Semi-Stitched", href: "/collection/semi-stitched-rajputi-poshak" },
    ],
  },
  {
    id: "festive-poshaks",
    title: "Festive Poshak",
    image: "/festive.webp",
    imagePositionDesktop: "md:object-top",
    imagePositionMobile: "object-top",
    subCategories: [
      { id: "stitched", title: "Stitched", href: "/collection/stitched-rajputi-poshak" },
      { id: "poshak-material", title: "Semi-Stitched", href: "/collection/semi-stitched-rajputi-poshak" },
    ],
  },
  {
    id: "jewellery",
    title: "Jewellery",
    image: "/jewellery_banner.webp",
    imagePositionDesktop: "md:object-center",
    imagePositionMobile: "object-center",
  },
];

export const CRAFTSMANSHIP_STEPS = [
  {
    step: "01",
    title: "Inspired By Heritage",
    description:
      "Each poshak takes inspiration from traditional Rajasthani royal attire, preserving authentic cuts, silhouettes, and time-honored color harmonies.",
    image: "/hero_couture.webp",
  },
  {
    step: "02",
    title: "Detailed Craftsmanship",
    description:
      "Dedicated artisans practice traditional hand needlework—painstakingly stitching Gota Patti, Danka, and Marodi patterns into pure georgette and silk.",
    image: "/hero_couture.webp",
  },
  {
    step: "03",
    title: "Perfect Finishing",
    description:
      "Every piece is framed with handcrafted magji, authentic kiran fringe, and pure lining to guarantee flawless drape and ceremonial dignity.",
    image: "/hero_couture.webp",
  },
  {
    step: "04",
    title: "Royal Celebration",
    description:
      "The finished poshak comes to life on brides and families during weddings, sacred rituals, and joyous festival moments.",
    image: "/hero_couture.webp",
  },
];

export const LOOKBOOK_ITEMS = [
  {
    id: "lb-1",
    title: "Royal Crimson Bridal Portrait",
    category: "Bridal Portraits",
    image: "/hero_couture.webp",
    note: "Crimson silk poshak adorned with traditional gota and royal kiran odhani.",
  },
  {
    id: "lb-2",
    title: "Festive Teej Celebration",
    category: "Festival Styling",
    image: "/hero_couture.webp",
    note: "Graceful chiffon lehenga paired with vibrant contrast odhani and floral jewellery.",
  },
  {
    id: "lb-3",
    title: "Heritage Court Ensemble",
    category: "Classic Elegance",
    image: "/hero_couture.webp",
    note: "Emerald georgette kalidar lehenga with ancestral zari border finish.",
  },
  {
    id: "lb-4",
    title: "Heirloom Saffron Draping",
    category: "Classic Elegance",
    image: "/hero_couture.webp",
    note: "Kesariya gold threadwork tailored for sacred family ceremonies.",
  },
  {
    id: "lb-5",
    title: "Ceremonial Wedding Radiance",
    category: "Bridal Portraits",
    image: "/hero_couture.webp",
    note: "Capturing the serene poise of a Rajputi bride on her auspicious wedding day.",
  },
  {
    id: "lb-6",
    title: "Archival Poshak Weave",
    category: "Festival Styling",
    image: "/hero_couture.webp",
    note: "Detailed border work complementing traditional borla and aad jewellery.",
  },
];

export const CUSTOMER_STORIES = [
  {
    quote:
      "Wearing a genuine Rajputi Poshak from Rajwadi for my wedding day was deeply emotional. The hand-done gota patti and the weight of the odhani felt truly authentic to our traditions.",
    author: "Shweta Rathore",
    occasion: "Wedding Ceremony",
    image: "/hero_couture.webp",
  },
  {
    quote:
      "The personalized fitting and consultation made all the difference. The kanchali and kurti fit perfectly on the first try, and the fabric drape for Gangaur was extraordinary.",
    author: "Bhavna Shekhawat",
    occasion: "Gangaur Festival Celebration",
    image: "/hero_couture.webp",
  },
  {
    quote:
      "In an era of generic partywear, Rajwadi keeps the dignity and grace of pure Rajputi poshaks alive. The craftsmanship and finishing details are unmatched.",
    author: "Devika Singh",
    occasion: "Family Wedding & Pheras",
    image: "/hero_couture.webp",
  },
];

export const INSTAGRAM_POSTS = [
  {
    id: "ig-1",
    image: "/hero_couture.webp",
    caption: "The timeless allure of pure hand-embroidered Rajputi Poshaks.",
    tag: "@rajwadi_poshaks",
  },
  {
    id: "ig-2",
    image: "/hero_couture.webp",
    caption: "Wedding moments captured in heritage crimson and antique gold.",
    tag: "@rajwadi_poshaks",
  },
  {
    id: "ig-3",
    image: "/hero_couture.webp",
    caption: "Graceful festive silhouettes for celebration days.",
    tag: "@rajwadi_poshaks",
  },
  {
    id: "ig-4",
    image: "/hero_couture.webp",
    caption: "Ancestral gota patti borders crafted with devotion.",
    tag: "@rajwadi_poshaks",
  },
  {
    id: "ig-5",
    image: "/hero_couture.webp",
    caption: "Elegance passed down through generations.",
    tag: "@rajwadi_poshaks",
  },
];
