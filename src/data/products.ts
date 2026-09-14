export interface PoshakProduct {
  id: string;
  name: string;
  category: string;
  fabric: string;
  craft: string;
  color: string;
  image: string;
  additionalImages?: string[];
  description: string;
  details: string[];
  includes: string[];
}

export const REAL_POSHAKS: PoshakProduct[] = [
  {
    id: "stitched-rajputi-poshak-emerald",
    name: "Traditional Rajputi Poshak",
    category: "Traditional Rajputi Wear",
    fabric: "Pure Georgette & Heritage Brocade",
    craft: "Authentic Hand Gota Patti & Zari",
    color: "Royal Emerald & Gulabi Pink Odhani",
    image: "/hero_couture.jpg",
    additionalImages: [
      "/hero_couture.jpg",
    ],
    description:
      "A traditional Rajputi Poshak crafted in fine georgette, featuring an authentic flared lehenga paired with a contrasting hand-bordered odhani. Embellished with classic gota patti, danka, and zari borders.",
    details: [
      "Traditional 4-Piece Royal Rajputi Poshak",
      "Authentic hand-worked Gota Patti & Kasab Zari borders",
      "Fine pure georgette lehenga with broad magji & gotaa",
      "Lightweight ceremonial drape with rich pallu accents",
    ],
    includes: [
      "Flared Ghagra (Lehenga)",
      "Kurti & Kanchali (Top ensemble)",
      "Traditional Sheer Royal Odhani with Magji finishing",
      "Matching pure cotton astar (lining)",
    ],
  },
  {
    id: "bridal-rajputi-poshak-crimson",
    name: "Royal Bridal Rajputi Poshak",
    category: "Bridal Rajputi Poshaks",
    fabric: "Heirloom Silk & Heavy Organza Odhani",
    craft: "Handcrafted Zardozi, Danka & Marodi Embroidery",
    color: "Heritage Crimson Maroon & Antique Gold",
    image: "/hero_couture.jpg",
    additionalImages: [
      "/hero_couture.jpg",
    ],
    description:
      "A bridal Rajputi poshak created for sacred wedding ceremonies and pheras. Features deep crimson heritage silk adorned with intricate gold zardozi motifs, finished with authentic royal kiran along the odhani perimeter.",
    details: [
      "Royal Bridal Couture creation with heirloom embroidery",
      "Intricate hand-stitched Danka and Marodi floral bel pattern",
      "Finished with authentic hand-beaten gold kiran edging",
      "Crafted for memorable wedding moments and royal heritage celebrations",
    ],
    includes: [
      "Bridal Ghagra with full kalis and heritage hem",
      "Heavy Embroidered Kurti & Kanchali",
      "Grand Bridal Odhani with dense matha patti and border work",
      "Customised astar lining and personalized fitting support",
    ],
  },
  {
    id: "unstitched-rajputi-poshak-kesariya",
    name: "Handcrafted Unstitched Poshak Set",
    category: "New Arrivals",
    fabric: "Pure Georgette & Brocade Weave",
    craft: "Fine Zari Threadwork & Gota Borders",
    color: "Royal Kesariya Saffron & Amber Gold",
    image: "/hero_couture.jpg",
    additionalImages: [
      "/hero_couture.jpg",
    ],
    description:
      "A handcrafted unstitched Rajputi poshak ensemble offering complete flexibility for bespoke tailoring. Comes with rich zari borders and matching fabric pieces for customized measurements.",
    details: [
      "Unstitched raw fabric set for bespoke personalized tailoring",
      "Pure georgette fabric with rich soft handfeel and fluid fall",
      "Complete set of matching magji fabric and authentic gota ribbons",
      "Ideal for pre-wedding functions, haldi, and royal festive gatherings",
    ],
    includes: [
      "Ghagra Fabric with pre-embroidered kalis",
      "Kurti & Kanchali unstitched patterned fabric",
      "Full 2.5m Pure Georgette Odhani with finished borders",
      "Complimentary matching magji and astar fabric",
    ],
  },
  {
    id: "festive-rajputi-poshak-rani",
    name: "Heirloom Festive Rajputi Poshak",
    category: "Festive Collection",
    fabric: "Pure Chiffon & Satin Magji",
    craft: "Traditional Hand Gota Work & Zari",
    color: "Vibrant Rani Pink & Antique Gold",
    image: "/hero_couture.jpg",
    additionalImages: [
      "/hero_couture.jpg",
    ],
    description:
      "Designed for Teej, Gangaur, and festive celebrations. Lightweight pure chiffon ensures effortless grace while shimmering gota patti handwork adds a radiant festive glow.",
    details: [
      "Vibrant festive hue designed for auspicious family ceremonies",
      "Handcrafted fine floral gota motifs on ghagra kalis",
      "Lightweight ceremonial drape with traditional border work",
      "Includes complete unstitched or customized stitching support",
    ],
    includes: [
      "Ghagra in pure flowy festive chiffon",
      "Kurti and Kanchali matching fabric with neckline work",
      "Chiffon Odhani with handcrafted kiran border",
      "Breathable pure lining",
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
    id: "bridal-poshaks",
    title: "Bridal Poshaks",
    image: "/bridal.png",
    imagePositionDesktop: "object-[50%_25%]",
    imagePositionMobile: "object-[50%_20%]",
  },
  {
    id: "festive-poshaks",
    title: "Festive Poshaks",
    image: "/festive.png",
    imagePositionDesktop: "object-[50%_25%]",
    imagePositionMobile: "object-[50%_20%]",
  },
  {
    id: "traditional-poshaks",
    title: "Traditional Poshaks",
    image: "/traditonal.png",
    imagePositionDesktop: "object-[58%_45%]",
    imagePositionMobile: "object-[58%_38%]",
  },
];

export const CRAFTSMANSHIP_STEPS = [
  {
    step: "01",
    title: "Inspired By Heritage",
    description:
      "Each poshak takes inspiration from traditional Rajasthani royal attire, preserving authentic cuts, silhouettes, and time-honored color harmonies.",
    image: "/hero_couture.jpg",
  },
  {
    step: "02",
    title: "Detailed Craftsmanship",
    description:
      "Dedicated artisans practice traditional hand needlework—painstakingly stitching Gota Patti, Danka, and Marodi patterns into pure georgette and silk.",
    image: "/hero_couture.jpg",
  },
  {
    step: "03",
    title: "Perfect Finishing",
    description:
      "Every piece is framed with handcrafted magji, authentic kiran fringe, and pure lining to guarantee flawless drape and ceremonial dignity.",
    image: "/hero_couture.jpg",
  },
  {
    step: "04",
    title: "Royal Celebration",
    description:
      "The finished poshak comes to life on brides and families during weddings, sacred rituals, and joyous festival moments.",
    image: "/hero_couture.jpg",
  },
];

export const LOOKBOOK_ITEMS = [
  {
    id: "lb-1",
    title: "Royal Crimson Bridal Portrait",
    category: "Bridal Portraits",
    image: "/hero_couture.jpg",
    note: "Crimson silk poshak adorned with traditional gota and royal kiran odhani.",
  },
  {
    id: "lb-2",
    title: "Festive Teej Celebration",
    category: "Festival Styling",
    image: "/hero_couture.jpg",
    note: "Graceful chiffon lehenga paired with vibrant contrast odhani and floral jewellery.",
  },
  {
    id: "lb-3",
    title: "Heritage Court Ensemble",
    category: "Royal Traditional",
    image: "/hero_couture.jpg",
    note: "Emerald georgette kalidar lehenga with ancestral zari border finish.",
  },
  {
    id: "lb-4",
    title: "Heirloom Saffron Draping",
    category: "Royal Traditional",
    image: "/hero_couture.jpg",
    note: "Kesariya gold threadwork tailored for sacred family ceremonies.",
  },
  {
    id: "lb-5",
    title: "Ceremonial Wedding Radiance",
    category: "Bridal Portraits",
    image: "/hero_couture.jpg",
    note: "Capturing the serene poise of a Rajputi bride on her auspicious wedding day.",
  },
  {
    id: "lb-6",
    title: "Archival Poshak Weave",
    category: "Festival Styling",
    image: "/hero_couture.jpg",
    note: "Detailed border work complementing traditional borla and aad jewellery.",
  },
];

export const CUSTOMER_STORIES = [
  {
    quote:
      "Wearing a genuine Rajputi Poshak from Rajwadi for my wedding day was deeply emotional. The hand-done gota patti and the weight of the odhani felt truly authentic to our traditions.",
    author: "Shweta Rathore",
    occasion: "Wedding Ceremony",
    image: "/hero_couture.jpg",
  },
  {
    quote:
      "The personalized fitting and consultation made all the difference. The kanchali and kurti fit perfectly on the first try, and the fabric drape for Gangaur was extraordinary.",
    author: "Bhavna Shekhawat",
    occasion: "Gangaur Festival Celebration",
    image: "/hero_couture.jpg",
  },
  {
    quote:
      "In an era of generic partywear, Rajwadi keeps the dignity and grace of pure Rajputi poshaks alive. The craftsmanship and finishing details are unmatched.",
    author: "Devika Singh",
    occasion: "Family Wedding & Pheras",
    image: "/hero_couture.jpg",
  },
];

export const INSTAGRAM_POSTS = [
  {
    id: "ig-1",
    image: "/hero_couture.jpg",
    caption: "The timeless allure of pure hand-embroidered Rajputi Poshaks.",
    tag: "@rajwadi_poshaks",
  },
  {
    id: "ig-2",
    image: "/hero_couture.jpg",
    caption: "Wedding moments captured in heritage crimson and antique gold.",
    tag: "@rajwadi_poshaks",
  },
  {
    id: "ig-3",
    image: "/hero_couture.jpg",
    caption: "Graceful festive silhouettes for celebration days.",
    tag: "@rajwadi_poshaks",
  },
  {
    id: "ig-4",
    image: "/hero_couture.jpg",
    caption: "Ancestral gota patti borders crafted with devotion.",
    tag: "@rajwadi_poshaks",
  },
  {
    id: "ig-5",
    image: "/hero_couture.jpg",
    caption: "Elegance passed down through generations.",
    tag: "@rajwadi_poshaks",
  },
];
