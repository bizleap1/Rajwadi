export interface PoshakProduct {
  id: string;
  name: string;
  category: "Stitched" | "Unstitched" | "Traditional" | string;
  price: string;
  fabric: string;
  craft: string;
  color: string;
  image: string;
  additionalImages?: string[];
  imagePosition?: string;
  imageScale?: number;
  description: string;
  details: string[];
  includes: string[];
}

export const REAL_POSHAKS: PoshakProduct[] = [
  {
    id: "morbagh-rajputi-poshak",
    name: "Morbagh Poshak",
    category: "Traditional",
    price: "₹ 29,500",
    fabric: "Pure Georgette & Satin Magji",
    craft: "Handcrafted Peacock Gotapatti, Kasab Zari & Dabka",
    color: "Gulabi Pink & Firozi Turquoise",
    image: "/products/Morbagh Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Morbagh Poshak/1.webp",
      "/products/Morbagh Poshak/2.webp",
      "/products/Morbagh Poshak/3.webp",
    ],
    description:
      "A majestic traditional Rajputi poshak featuring intricate Mor (peacock) motifs hand-embroidered in firozi turquoise and shimmering gold zari over an imperial pink kalidar ghagra.",
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
    name: "Neelam Turquoise Poshak",
    category: "Unstitched",
    price: "₹ 22,000",
    fabric: "Pure Georgette & Satin Magji",
    craft: "Handcrafted Gota Patti & Zari Bel",
    color: "Royal Neelam Turquoise",
    image: "/products/Neelam Turquoise Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Neelam Turquoise Poshak/1.webp",
      "/products/Neelam Turquoise Poshak/2.webp",
      "/products/Neelam Turquoise Poshak/3.webp",
    ],
    description:
      "A striking jewel-toned turquoise unstitched Rajputi poshak, designed with dense gota work and kasab zari highlighting the ghagra kalis.",
    details: [
      "Exquisite turquoise shade with lustrous gold leaf gota",
      "Unstitched cuts designed for flexible bespoke fit",
      "Lustrous satin magji border included in set",
      "Authentic traditional drape for festive celebrations",
    ],
    includes: [
      "Ghagra 12-Kali Fabric Set",
      "Kurti & Kanchali Cut Pieces",
      "Heavy Worked Pure Odhani (2.5m)",
      "Lining & Magji Bundle",
    ],
  },
  {
    id: "rani-maroon-rajputi-poshak",
    name: "Rani Maroon Poshak",
    category: "Traditional",
    price: "₹ 32,500",
    fabric: "Heirloom Silk Georgette & Brocade",
    craft: "Danka, Marodi & Zardozi Handwork",
    color: "Heritage Maroon & Antique Gold",
    image: "/products/Rani Maroon Poshak/1.webp",
    imagePosition: "center 2%",
    additionalImages: [
      "/products/Rani Maroon Poshak/1.webp",
      "/products/Rani Maroon Poshak/2.webp",
      "/products/Rani Maroon Poshak/3.webp",
    ],
    description:
      "An imperial traditional poshak crafted in deep heritage maroon, adorned with dense danka, marodi, and zardozi needlework suited for grand wedding pheras.",
    details: [
      "Grand imperial heritage poshak with heirloom handcraft",
      "Heavy zardozi and danka embellishments on hem and kurti",
      "Full bridal weight sheer odhani with solid gold kiran",
      "Crafted by ancestral artisans of Rajasthan",
    ],
    includes: [
      "Imperial Ghagra with Grand Kalidar Ghera",
      "Intricately Embroidered Kurti & Kanchali",
      "Bridal Weight Pure Odhani with Kiran",
      "Pure Cotton Lining",
    ],
  },
  {
    id: "gulabi-rani-rajputi-poshak",
    name: "Gulabi Rani Poshak",
    category: "Traditional",
    price: "₹ 28,500",
    fabric: "Pure Georgette & Heritage Satin Magji",
    craft: "Handcrafted Gota Patti & Kasab Zari",
    color: "Gulabi Rani Pink",
    image: "/products/Gulabi Rani Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Gulabi Rani Poshak/1.webp",
      "/products/Gulabi Rani Poshak/2.webp",
      "/products/Gulabi Rani Poshak/3.webp",
    ],
    description:
      "A timeless Gulabi Rani Rajputi Poshak tailored in pure flowy georgette, embellished with handcrafted gota patti florals and traditional kiran magji finishing.",
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
    name: "Pista Neel Poshak",
    category: "Stitched",
    price: "₹ 26,500",
    fabric: "Pure Crepe & Heritage Brocade",
    craft: "Hand Marodi & Zardozi Needlecraft",
    color: "Pista Green with Neel Accent",
    image: "/products/Pista Neel Poshak/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Pista Neel Poshak/1.webp",
      "/products/Pista Neel Poshak/2.webp",
      "/products/Pista Neel Poshak/3.webp",
    ],
    description:
      "A magnificent stitched Rajputi ensemble crafted in pure crepe, showcasing heritage marodi hand embroidery and deep jewel-toned accents for regal occasions.",
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
    name: "Aqua Pista Poshak",
    category: "Traditional",
    price: "₹ 27,500",
    fabric: "Pure Georgette & Satin Magji",
    craft: "Handcrafted Gota Patti & Kasab Zari",
    color: "Aqua Blue & Pista Green Ombré",
    image: "/products/Aqua Pista Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Aqua Pista Poshak/1.webp",
      "/products/Aqua Pista Poshak/2.webp",
      "/products/Aqua Pista Poshak/3.webp",
    ],
    description:
      "An enchanting ombré Rajputi poshak blending pastel aqua blue and luminous pista green, embellished with intricate gota patti peacocks, zardozi motifs, and ancestral kiran odhani.",
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
    id: "peach-rose-rajputi-poshak",
    name: "Peach Rose Poshak",
    category: "Stitched",
    price: "₹ 24,000",
    fabric: "Fine Georgette with Heritage Zari Weave",
    craft: "Intricate Danka & Gota Patti Borders",
    color: "Pastel Peach & Antique Gold",
    image: "/products/Peach Poshak/1.webp",
    imagePosition: "center 1%",
    additionalImages: [
      "/products/Peach Poshak/1.webp",
      "/products/Peach Poshak/2.webp",
      "/products/Peach Poshak/3.webp",
    ],
    description:
      "Subtle royal pastel peach poshak featuring classic danka needlework and pure gold thread borders, tailored for daytime wedding celebrations and sacred ceremonies.",
    details: [
      "Pre-stitched and tailored for regal posture and effortless comfort",
      "Subtle pastel hue with traditional hand gold embellishments",
      "Full kalidar lehenga with heavy traditional hem finishing",
      "Breathable natural georgette fabric for festive ceremonies",
    ],
    includes: [
      "Stitched Flared Ghagra with Heavy Hem",
      "Tailored Kurti & Kanchali Top Set",
      "Hand-finished Odhani with Kiran fringe",
      "Pure Cotton Inner Lining",
    ],
  },
  {
    id: "pista-kesariya-rajputi-poshak",
    name: "Pista Kesariya Poshak",
    category: "Unstitched",
    price: "₹ 21,500",
    fabric: "Pure Georgette Ensemble",
    craft: "Fine Kasab Zari & Foliate Gota Work",
    color: "Pista Green & Kesariya Contrast",
    image: "/products/Pista Kesariya Poshak/1.webp",
    imagePosition: "center 2%",
    additionalImages: [
      "/products/Pista Kesariya Poshak/1.webp",
      "/products/Pista Kesariya Poshak/2.webp",
      "/products/Pista Kesariya Poshak/3.webp",
    ],
    description:
      "An unstitched 4-piece poshak ensemble in royal pista green complemented by auspicious kesariya accents, providing complete freedom for personalized bespoke measurements.",
    details: [
      "Unstitched fabric set for custom personalized royal tailoring",
      "Intricate gold threadwork along all 12 ghagra kalis",
      "Includes pre-cut matching magji and authentic gota ribbons",
      "Ideal for pre-wedding functions, haldi, and royal gatherings",
    ],
    includes: [
      "Ghagra Kalis Fabric Set with hand embroidery",
      "Kurti & Kanchali unstitched patterned fabric",
      "2.5m Pure Georgette Odhani with finished kiran",
      "Complimentary matching magji and astar bundle",
    ],
  },
  {
    id: "sunehri-kesar-rajputi-poshak",
    name: "Sunehri Kesar Poshak",
    category: "Stitched",
    price: "₹ 27,500",
    fabric: "Heirloom Chanderi Silk & Satin Magji",
    craft: "Pitta Work, Kasab Zari & Gota Bel",
    color: "Imperial Gold & Saffron Kesar",
    image: "/products/Sunehri Kesar Poshak/1.webp",
    imagePosition: "center 8%",
    imageScale: 1.22,
    additionalImages: [
      "/products/Sunehri Kesar Poshak/1.webp",
      "/products/Sunehri Kesar Poshak/2.webp",
      "/products/Sunehri Kesar Poshak/3.webp",
    ],
    description:
      "A luminous saffron poshak adorned with pitta needlework and raised Kasab zari, radiating royal warmth for auspicious family festivities.",
    details: [
      "Handcrafted pitta work creating subtle heirloom golden shimmer",
      "Rich contrast odhani with dense foliage kiran border",
      "Pre-stitched kalidar ghera designed for graceful poise",
      "Authentic Rajputi magji and kiran tailored to royal standards",
    ],
    includes: [
      "Finished Kalidar Ghagra with Heavy Hem",
      "Tailored Kurti & Kanchali Ensemble",
      "Pure Chiffon Odhani with Gold Kiran",
      "Cotton Inner Lining Pack",
    ],
  },
  {
    id: "kesariya-utsav-rajputi-poshak",
    name: "Kesariya Utsav Poshak",
    category: "Traditional",
    price: "₹ 31,000",
    fabric: "Pure Georgette & Heritage Brocade",
    craft: "Danka Handwork, Zardozi & Ancestral Gota Patti",
    color: "Auspicious Kesariya & Crimson",
    image: "/products/Kesariya Utsav Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Kesariya Utsav Poshak/1.webp",
      "/products/Kesariya Utsav Poshak/2.webp",
      "/products/Kesariya Utsav Poshak/3.webp",
    ],
    description:
      "An imperial traditional festive poshak woven in radiant kesariya saffron, featuring ceremonial danka medallions and authentic zardozi crafted by master Rajasthani karigars.",
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
    name: "Morika Lavender Poshak",
    category: "Stitched",
    price: "₹ 25,000",
    fabric: "Fine Georgette & Pure Silk Magji",
    craft: "Modern Gotapatti Flowers & Silver Kasab",
    color: "Pastel Lavender & Silver Frost",
    image: "/products/Morika Lavender Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Morika Lavender Poshak/1.webp",
      "/products/Morika Lavender Poshak/2.webp",
      "/products/Morika Lavender Poshak/3.webp",
    ],
    description:
      "A serene pastel lavender poshak delicately embroidered with silver zari and hand-folded gotapatti florets, offering a contemporary royal aesthetic for daytime receptions.",
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
    name: "Gulabi Mor Poshak",
    category: "Traditional",
    price: "₹ 28,000",
    fabric: "Heritage Georgette & Satin Weave",
    craft: "Peacock Gotapatti, Mukaish & Zari Jaal",
    color: "Vibrant Gulabi Pink & Golden Zari",
    image: "/products/Gulabi Mor Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Gulabi Mor Poshak/1.webp",
      "/products/Gulabi Mor Poshak/2.webp",
      "/products/Gulabi Mor Poshak/3.webp",
    ],
    description:
      "A vibrant pink regal poshak showcasing stately peacocks hand-rendered in golden gota patti, complemented by fine mukaish speckles across the sweeping flared skirt.",
    details: [
      "Heritage peacock insignia on ghagra kalis and kurti neckline",
      "Rich golden gota border with heavy contrast magji finish",
      "Pre-stitched silhouette guaranteeing effortless royal poise",
      "High-density zari borders that maintain structure and drape",
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
    name: "Neelam Noor Poshak",
    category: "Unstitched",
    price: "₹ 23,000",
    fabric: "Pure 60gm Georgette",
    craft: "Aari-Tari Needlework & Kasab Zari Bel",
    color: "Midnight Neelam Blue & Gold",
    image: "/products/Neelam Noor Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Neelam Noor Poshak/1.webp",
      "/products/Neelam Noor Poshak/2.webp",
      "/products/Neelam Noor Poshak/3.webp",
    ],
    description:
      "An unstitched jewel-toned royal blue poshak embellished with luminous gold threadwork and geometric needlepoint borders, ready for bespoke atelier tailoring.",
    details: [
      "Unstitched cuts designed for flexible bespoke fit and personal tailoring",
      "Deep jewel-toned sapphire hue with contrast antique gold aari work",
      "Generous fabric allowance for high-volume lehenga flare",
      "Includes matched satin magji and pure gota piping bundles",
    ],
    includes: [
      "12-Kali Unstitched Ghagra Panels",
      "Kurti & Kanchali Fabric Cuts",
      "2.5m Pure Georgette Odhani with Gold Trim",
      "Complete Magji and Inner Lining Material",
    ],
  },
  {
    id: "morni-rang-rajputi-poshak",
    name: "Morni Rang Poshak",
    category: "Traditional",
    price: "₹ 34,000",
    fabric: "Pure Tissue Georgette & Heritage Satin",
    craft: "Dense Zardozi, Real Gotapatti & Marodi Work",
    color: "Dual Peacock Green & Royal Crimson",
    image: "/products/Morni Rang Poshak/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Morni Rang Poshak/1.webp",
      "/products/Morni Rang Poshak/2.webp",
      "/products/Morni Rang Poshak/3.webp",
    ],
    description:
      "An opulent heirloom poshak capturing traditional Rajputana grandeur, featuring dense zardozi kalis and intricate marodi needlework tailored for grand ceremonies.",
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
    name: "Rajsi Maroon Poshak",
    category: "Traditional",
    price: "₹ 33,500",
    fabric: "Heavy Georgette & Pure Silk Brocade",
    craft: "Handcrafted Gotapatti, Dabka & Antique Kasab",
    color: "Imperial Maroon & Antique Gold",
    image: "/products/Rajsi Maroon Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Rajsi Maroon Poshak/1.webp",
      "/products/Rajsi Maroon Poshak/2.webp",
      "/products/Rajsi Maroon Poshak/3.webp",
    ],
    description:
      "A quintessential Rajputana bridal poshak in deep imperial maroon, encrusted with rich dabka, gotapatti floral jaals, and antique golden magji.",
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
    name: "Neelambari Poshak",
    category: "Unstitched",
    price: "₹ 22,500",
    fabric: "Pure Flowy Georgette",
    craft: "Gotapatti Jaal, Sequin Highlights & Kasab Zari",
    color: "Sky Neelambari & Silver Frost",
    image: "/products/Neelambari Poshak/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Neelambari Poshak/1.webp",
      "/products/Neelambari Poshak/2.webp",
      "/products/Neelambari Poshak/3.webp",
    ],
    description:
      "An unstitched celestial blue poshak patterned with delicate gotapatti vines and soft golden accents, offering versatile elegance for festive daytime gatherings.",
    details: [
      "Luminous celestial blue shade evoking desert twilight skies",
      "Unstitched pieces allowing customizable necklines and lehenga length",
      "Lightweight yet structured pure georgette for effortless movement",
      "Finished with matching magji and gota ribbon accents",
    ],
    includes: [
      "12-Kali Leheriya-Embroidered Ghagra Fabric",
      "Kurti & Kanchali Cut Pieces",
      "Hand-Finished Odhani with Delicate Kiran",
      "Matching Magji & Lining Bundle",
    ],
  },
  {
    id: "gulabi-neelam-rajputi-poshak",
    name: "Gulabi Neelam Poshak",
    category: "Traditional",
    price: "₹ 30,500",
    fabric: "Pure Satin Georgette & Banarasi Magji",
    craft: "Intricate Peacock Jaal & Shimmering Gotapatti",
    color: "Gulabi Pink & Neelam Royal Blue",
    image: "/products/Gulabi Neelam Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Gulabi Neelam Poshak/1.webp",
      "/products/Gulabi Neelam Poshak/2.webp",
      "/products/Gulabi Neelam Poshak/3.webp",
    ],
    description:
      "A magnificent dual-toned traditional poshak harmonizing blushing gulabi pink with royal neelam blue odhani, richly ornamented with dense peacock gotapatti motifs.",
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
    name: "Gulabi Noor Poshak",
    category: "Stitched",
    price: "₹ 25,500",
    fabric: "Flowy Georgette & Silk Magji",
    craft: "Fine Aari Needlework & Hand-Folded Gota Foliage",
    color: "Blush Noor Pink",
    image: "/products/Gulabi Noor Poshak/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Gulabi Noor Poshak/1.webp",
      "/products/Gulabi Noor Poshak/2.webp",
      "/products/Gulabi Noor Poshak/3.webp",
    ],
    description:
      "A delicate, pre-stitched blush pink poshak designed for graceful movement, adorned with fine foliate needlework and subtle metallic leaf borders.",
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
    name: "Gulabi Heritage Poshak",
    category: "Unstitched",
    price: "₹ 21,000",
    fabric: "Pure 60gm Georgette",
    craft: "Classic Gota Leaf Bel & Silver Kasab",
    color: "Pure Rose Gulabi",
    image: "/products/Gulabi Poshak/1.webp",
    imagePosition: "center 2%",
    additionalImages: [
      "/products/Gulabi Poshak/1.webp",
      "/products/Gulabi Poshak/2.webp",
      "/products/Gulabi Poshak/3.webp",
    ],
    description:
      "An unstitched authentic rose pink Rajputi poshak set, showcasing ancestral leaf vines (bel) hand-applied in fine gota patti over pure flowy georgette.",
    details: [
      "Unstitched pieces allowing customizable sizing and tailoring",
      "Traditional kalidar pattern ready for artisan sewing",
      "Includes matched satin magji and traditional ribbon piping",
      "Classic timeless rose color suited for festive pujas",
    ],
    includes: [
      "Unstitched Ghagra Panels (12 Kalis)",
      "Kurti & Kanchali Patterned Cuts",
      "Pure Georgette Odhani (2.5m)",
      "Full Lining and Magji Material Bundle",
    ],
  },
  {
    id: "gulbahar-rajputi-poshak",
    name: "Gulbahar Poshak",
    category: "Unstitched",
    price: "₹ 23,500",
    fabric: "Tissue Georgette & Hand-Dyed Chiffon",
    craft: "Handcrafted Gotapatti Florets & Dabka Motifs",
    color: "Blossom Gulbahar Pink & Gold",
    image: "/products/Gulbahar Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Gulbahar Poshak/1.webp",
      "/products/Gulbahar Poshak/2.webp",
      "/products/Gulbahar Poshak/3.webp",
    ],
    description:
      "Inspired by the blooming gardens of royal Jaipur, this unstitched ensemble features delicate botanical gotapatti jaal and fine dabka needlework.",
    details: [
      "Lightweight tissue georgette with gentle shimmering weave",
      "Unstitched fabric suitable for custom measurements and tailoring",
      "Artisanal floral jaal across lehenga panels and odhani corners",
      "Pure chiffon odhani with traditional metallic kiran",
    ],
    includes: [
      "12-Kali Unstitched Ghagra Fabric",
      "Embroidered Kurti and Kanchali Cuts",
      "Pure Chiffon Odhani with Gold Border",
      "Magji & Pure Cotton Inner Set",
    ],
  },
  {
    id: "kesari-gulab-rajputi-poshak",
    name: "Kesari Gulab Poshak",
    category: "Stitched",
    price: "₹ 26,500",
    fabric: "Pure Georgette & Contrast Satin Magji",
    craft: "Traditional Kasab Zari & Gota Border",
    color: "Sunset Kesari & Rose Gold",
    image: "/products/Kesari Gulab Poshak/1.webp",
    imagePosition: "center 8%",
    imageScale: 1.22,
    additionalImages: [
      "/products/Kesari Gulab Poshak/1.webp",
      "/products/Kesari Gulab Poshak/2.webp",
      "/products/Kesari Gulab Poshak/3.webp",
    ],
    description:
      "A radiant sunset kesari poshak stitched to royal perfection, blending warm saffron and soft rose hues with intricate metallic gotapatti embroidery.",
    details: [
      "Ready-to-wear stitched lehenga with generous kalidar flare",
      "Warm ceremonial hue ideal for Haldi, Sangeet, and festivals",
      "Pre-tailored kurti and kanchali with traditional neckline piping",
      "Heavy gold odhani with finished kiran edging",
    ],
    includes: [
      "Stitched Kalidar Kesari Ghagra",
      "Pre-tailored Kurti & Kanchali Top",
      "Finished Pure Odhani with Kiran",
      "Soft Cotton Inner Lining",
    ],
  },
  {
    id: "kesariya-gulab-rajputi-poshak",
    name: "Kesariya Gulab Poshak",
    category: "Unstitched",
    price: "₹ 22,000",
    fabric: "Heirloom Chiffon Georgette",
    craft: "Gota Patti Medallions & Fine Magji Finishing",
    color: "Auspicious Kesariya Saffron",
    image: "/products/Kesariya Gulab Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Kesariya Gulab Poshak/1.webp",
      "/products/Kesariya Gulab Poshak/2.webp",
      "/products/Kesariya Gulab Poshak/3.webp",
    ],
    description:
      "An unstitched traditional saffron poshak designed with circular gota medallions and fine kasab vine borders, ready for bespoke royal crafting.",
    details: [
      "Unstitched set for customized fitting and personalization",
      "Auspicious kesariya hue deeply rooted in Rajputana tradition",
      "Generous fabric for creating dramatic circular flare",
      "Complimentary satin magji and traditional gota bundle",
    ],
    includes: [
      "12-Kali Saffron Ghagra Fabric Cuts",
      "Kurti and Kanchali Unstitched Material",
      "Pure Georgette Odhani with Gold Kiran",
      "Astar Lining and Satin Magji Pack",
    ],
  },
  {
    id: "neelkamal-gulab-rajputi-poshak",
    name: "Neelkamal Gulab Poshak",
    category: "Stitched",
    price: "₹ 29,000",
    fabric: "Royal Georgette & Brocade Weave",
    craft: "Floral Lotus (Neelkamal) Gotapatti & Marodi",
    color: "Deep Royal Blue & Soft Rose",
    image: "/products/Neelkamal Gulab Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Neelkamal Gulab Poshak/1.webp",
      "/products/Neelkamal Gulab Poshak/2.webp",
      "/products/Neelkamal Gulab Poshak/3.webp",
    ],
    description:
      "A captivating stitched poshak featuring sacred lotus motifs rendered in antique gota patti over a deep sapphire blue ghagra with soft rose highlights.",
    details: [
      "Regal blue silhouette stitched for effortless poise and elegance",
      "Sacred lotus motifs crafted with hand-manipulated gota ribbon",
      "Heavy satin magji grounding the flared lehenga hemline",
      "Pre-tailored kanchali designed with authentic Rajputi proportions",
    ],
    includes: [
      "Finished Kalidar Neelkamal Ghagra",
      "Tailored Kurti & Kanchali Ensemble",
      "Full Pure Odhani with Double Gold Kiran",
      "Cotton Astar Pre-attached",
    ],
  },
  {
    id: "neelkanth-mor-rajputi-poshak",
    name: "Neelkanth Mor Poshak",
    category: "Traditional",
    price: "₹ 35,000",
    fabric: "Pure Tissue Georgette & Silk Brocade",
    craft: "Ancestral Neelkanth Zardozi & Danka Work",
    color: "Midnight Neelkanth & Pure Gold",
    image: "/products/Neelkanth Mor Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Neelkanth Mor Poshak/1.webp",
      "/products/Neelkanth Mor Poshak/2.webp",
      "/products/Neelkanth Mor Poshak/3.webp",
    ],
    description:
      "An imperial heirloom creation dedicated to the sacred peacock, embroidered in dense metallic zardozi and danka over a majestic midnight peacock blue base.",
    details: [
      "Grand imperial bridal weight ensemble for landmark celebrations",
      "Intricate hand-done danka needlework with antique gold sheen",
      "Double-panel heavy odhani with authentic metallic kiran",
      "Heirloom piece preserving ancestral court embroidery techniques",
    ],
    includes: [
      "Imperial Flared Ghagra with Heavy Hem",
      "Heavily Ornamented Kurti & Kanchali Set",
      "Bridal-Weight Odhani with Dense Kiran",
      "Pure Cotton Lining and Magji Pack",
    ],
  },
  {
    id: "pista-gulab-rajputi-poshak",
    name: "Pista Gulab Poshak",
    category: "Traditional",
    price: "₹ 28,500",
    fabric: "Fine Georgette & Satin Magji",
    craft: "Gotapatti Leaf Jaal & Kasab Needlework",
    color: "Pastel Pista & Rose Contrast",
    image: "/products/Pista Gulab Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Pista Gulab Poshak/1.webp",
      "/products/Pista Gulab Poshak/2.webp",
      "/products/Pista Gulab Poshak/3.webp",
    ],
    description:
      "An enchanting traditional poshak pairing gentle pistachio green with blushing rose gota borders, evoking timeless Rajputi garden pavilions.",
    details: [
      "Serene pistachio green with antique gold gota patti accents",
      "Dense floral jaal along the lehenga hem and kurti borders",
      "Full ceremonial odhani with lightweight pure chiffon drape",
      "Handcrafted by generational artisans in Rajasthan",
    ],
    includes: [
      "Flared Kalidar Pista Ghagra",
      "Hand-Embroidered Kurti & Kanchali Pair",
      "Rich Odhani with Gold Kiran Fringe",
      "Lining Bundle and Contrast Magji",
    ],
  },
  {
    id: "rangrez-rani-lehenga-poshak",
    name: "Rangrez Rani Lehenga",
    category: "Stitched",
    price: "₹ 31,500",
    fabric: "Heavy Weight Georgette & Satin Lining",
    craft: "Vibrant Rangrez Gota Border & Danka Work",
    color: "Royal Rani Pink & Rich Gold",
    image: "/products/Rangrez Rani Lehenga/1.webp",
    imagePosition: "center 4%",
    additionalImages: [
      "/products/Rangrez Rani Lehenga/1.webp",
      "/products/Rangrez Rani Lehenga/2.webp",
      "/products/Rangrez Rani Lehenga/3.webp",
    ],
    description:
      "A grand stitched rani pink lehenga poshak celebrating master dyers and embroiderers, adorned with dense gotapatti panels and ceremonial gold borders.",
    details: [
      "Pre-stitched bridal-grade silhouette with grand circular ghera",
      "Deep rani pink tone capturing the royal majesty of Rajasthan",
      "Pre-tailored kanchali with comfortable, structured fit",
      "Heavily fringed gold odhani that drapes regally over royal borla",
    ],
    includes: [
      "Stitched Grand Flared Rani Ghagra",
      "Pre-tailored Kurti & Kanchali Ensemble",
      "Ceremonial Pure Odhani with Gold Kiran",
      "Pure Cotton Inner Lining Attached",
    ],
  },
  {
    id: "rani-crimson-rajputi-poshak",
    name: "Rani Crimson Poshak",
    category: "Traditional",
    price: "₹ 33,000",
    fabric: "Imperial Georgette & Brocade Weave",
    craft: "Bridal Zardozi, Marodi & Heavy Kiran",
    color: "Deep Heritage Crimson & Gold",
    image: "/products/Rani Crimson Poshak/1.webp",
    imagePosition: "center 5%",
    additionalImages: [
      "/products/Rani Crimson Poshak/1.webp",
      "/products/Rani Crimson Poshak/2.webp",
      "/products/Rani Crimson Poshak/3.webp",
    ],
    description:
      "A bridal masterpiece crafted in deep imperial crimson, enriched with marodi spiral work and shimmering zardozi flowers for sacred wedding pheras.",
    details: [
      "Classic heirloom crimson red sacred to traditional Rajputi weddings",
      "Heavy marodi needlework with raised metallic gold texture",
      "Grand lehenga ghera with broad protective kasab magji border",
      "Full bridal odhani adorned with authentic gold kiran",
    ],
    includes: [
      "Imperial 12-Kali Crimson Ghagra",
      "Intricately Detailed Kurti & Kanchali Top Set",
      "Bridal-Weight Pure Odhani with Rich Kiran",
      "Satin Magji and Pure Cotton Lining",
    ],
  },
];

export interface CollectionItem {
  id: string;
  title: string;
  image: string;
  imagePositionDesktop: string;
  imagePositionMobile: string;
}

export const COLLECTIONS_DATA: CollectionItem[] = [
  {
    id: "stitched-poshaks",
    title: "Stitched Poshaks",
    image: "/stiched.webp",
    imagePositionDesktop: "md:object-top",
    imagePositionMobile: "object-top",
  },
  {
    id: "unstitched-poshaks",
    title: "Unstitched Poshaks",
    image: "/unstiched.webp",
    imagePositionDesktop: "md:object-center",
    imagePositionMobile: "object-center",
  },
  {
    id: "traditional-poshaks",
    title: "Traditional Poshaks",
    image: "/traditonal.webp",
    imagePositionDesktop: "md:object-top",
    imagePositionMobile: "object-[68%_top]",
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
    category: "Royal Traditional",
    image: "/hero_couture.webp",
    note: "Emerald georgette kalidar lehenga with ancestral zari border finish.",
  },
  {
    id: "lb-4",
    title: "Heirloom Saffron Draping",
    category: "Royal Traditional",
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
