export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
  };
  readTime: string;
  featuredImage: string;
  reviewNotice: string;
  content: {
    heading?: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  relatedProductSlugs: string[];
  relatedCategorySlugs: { label: string; href: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "rajputi-poshak-wedding-functions-by-occasion",
    title: "Rajputi Poshak for Wedding Functions, by Occasion",
    metaTitle: "Rajputi Poshak for Wedding Functions, by Occasion | Rajwadi",
    metaDescription:
      "A complete guide to choosing the perfect Rajputi poshak for every wedding function: Haldi, Mehendi, Sangeet, Fera ceremony, and Reception from Rajwadi Nagpur.",
    h1: "Rajputi Poshak for Wedding Functions: A Complete Guide by Occasion",
    excerpt:
      "From sunny Haldi rituals in vibrant Kesariya to the sacred Fera vows in opulent pure georgette Zardozi, discover how to curate your Rajputi poshak wardrobe for each wedding ceremony.",
    category: "Wedding Guide",
    publishedAt: "2026-03-10",
    updatedAt: "2026-04-05",
    author: {
      name: "Rajwadi Atelier Team",
      role: "Heritage Fashion Specialists",
    },
    readTime: "6 min read",
    featuredImage: "/bridal.webp",
    reviewNotice: "DRAFT – NEEDS OWNER REVIEW",
    content: [
      {
        heading: "The Splendour of Rajputana Wedding Traditions",
        paragraphs: [
          "A Rajput wedding is an extraordinary celebration of ancestral honour, imperial pageantry, and sacred rituals dating back over eight centuries. Central to this matrimonial majesty is the Rajputi Poshak—an iconic four-piece ensemble comprising the Kalidar Ghagra, Kurti, Kanchali, and Odhna. Each ceremonial function in a traditional wedding demands specific colour palettes, embroidery densities, and fabric drapery.",
          "At Rajwadi in Nagpur, we guide brides, mothers, sisters, and honoured guests in selecting authentic poshaks that harmonize historical etiquette with modern bridal elegance.",
        ],
      },
      {
        heading: "1. Haldi & Tel Baan Ceremony: Kesariya & Peela Radiance",
        paragraphs: [
          "The Tel Baan and Haldi ceremonies mark the auspicious commencement of matrimonial purification. Auspicious yellow (Peela) and royal saffron (Kesariya) palettes are mandatory, symbolizing fertility, purity, and divine blessings.",
          "Fabric & Karigari: Opt for lightweight semi-georgette or high-grade art crepe that allows effortless movement during turmeric paste rituals. Delicate Barik Gota Patti florets and subtle gold magji borders ensure royal refinement without excessive weight.",
        ],
        bullets: [
          "Recommended Hues: Auspicious Kesariya, Haldi Yellow, Sandalwood Gold",
          "Embroidery: Hand-cut gota patti leaves, light kasab zari",
          "Styling: Lightweight floral jewellery paired with delicate gold borla",
        ],
      },
      {
        heading: "2. Mehendi & Mayra Rituals: Festive Greens & Leheriya Swirls",
        paragraphs: [
          "The Mehendi celebration and the emotional Mayra (Bhaat) welcome ceremony demand joyful, energetic colours. Traditionally, shades of Pista (pistachio green), Panna (emerald), and radiant royal pink (Gulabi Rani) take centre stage.",
          "A classic Rajasthani Leheriya pattern poshak or multi-hued Panchranga ghagra brings festive dynamism. The swirling 4-meter gher of the kalidar ghagra creates magnificent photographic portraits during celebratory sangeet dances.",
        ],
      },
      {
        heading: "3. Sangeet Night: Glamorous Zari & Mirror Karigari",
        paragraphs: [
          "The Sangeet is the musical crescendo of the wedding. For this evening gala, deeper regal jewel tones reign: Neelam Turquoise, Royal Blue, Imperial Plum, and Rani Pink.",
          "Rich Kasab Zari and light Kundan embroidery reflect chandelier illumination across the dance floor. Ensure your Kurti and Kanchali are tailored with breathable inner cotton lining for complete ease throughout the musical night.",
        ],
      },
      {
        heading: "4. The Sacred Fera (Wedding) Ceremony: The Imperial Bridal Poshak",
        paragraphs: [
          "For the sacred saat phere around the sacred agni, nothing compares to the grandeur of an authentic pure handloom georgette Bridal Rajputi Poshak. Traditional bridal palettes are non-negotiable: Surkh Laal (deep royal crimson), Kesariya, and deep bridal Maroon.",
          "Heirloom Karigari: Dense three-dimensional Zardozi wirework, handcrafted Danka plates, and antique Gota Patti outline the 12-to-16 kalis. The crowning 2.5-meter odhna features an ornate four-sided border lined with handcrafted gold Gota Kiran fringe that drapes gracefully over the bride's head.",
        ],
        bullets: [
          "Pieces: Kalidar Ghagra (5m-6m gher), Kurti, Kanchali, Odhna with Kiran",
          "Jewellery: Complete Rajputi Aad, Rakhdi with Sheeshpatti, and Nath",
          "Bespoke Consultation: Connect with Rajwadi Nagpur via WhatsApp (+91 8766667101) for bespoke measurements",
        ],
      },
      {
        heading: "5. Reception & Bidai: Timeless Heritage Elegance",
        paragraphs: [
          "The Reception is your grand entrance as a newlywed couple. Rich jewel tones such as deep Emerald, Wine Maroon, and Royal Violet adorned with antique kasab borders deliver understated courtly authority.",
          "To preserve your wedding attire across decades, always dry clean your poshak, store it folded in a breathable cotton cover, and air it out away from direct sunlight once each season.",
        ],
      },
    ],
    relatedProductSlugs: [
      "morbagh-rajputi-poshak",
      "gulabi-rani-poshak",
      "rani-maroon-rajputi-poshak",
      "neelam-turquoise-rajputi-poshak",
    ],
    relatedCategorySlugs: [
      { label: "Bridal Rajputi Poshaks", href: "/collection/bridal-rajputi-poshak" },
      { label: "Festive Poshaks", href: "/collection/festive-rajputi-poshak" },
      { label: "Royal Rajputi Jewellery", href: "/collection/rajputi-jewellery" },
    ],
  },

  {
    slug: "bridal-vs-festive-poshak-how-to-choose",
    title: "Bridal vs Festive Poshak: How to Choose",
    metaTitle: "Bridal vs Festive Rajputi Poshak: How to Choose | Rajwadi",
    metaDescription:
      "Compare Bridal vs Festive Rajputi Poshaks. Understand differences in fabric weight, zari and gota patti embroidery, flare sweeps, and prices at Rajwadi Nagpur.",
    h1: "Bridal vs Festive Rajputi Poshak: Key Differences & How to Choose",
    excerpt:
      "Unsure whether to select a heavy bridal creation or a fluid festive poshak? We break down the differences in fabrics, karigari, kalidar gher, and pricing.",
    category: "Buying Advice",
    publishedAt: "2026-03-18",
    updatedAt: "2026-04-05",
    author: {
      name: "Rajwadi Master Tailors",
      role: "Atelier Consultants",
    },
    readTime: "5 min read",
    featuredImage: "/bridal.webp",
    reviewNotice: "DRAFT – NEEDS OWNER REVIEW",
    content: [
      {
        heading: "Understanding the Royal Distinctions",
        paragraphs: [
          "While both bridal and festive ensembles belong to the noble Rajputana poshak tradition, they serve distinctly different ceremonial purposes. Selecting the right category ensures you feel radiant, regal, and physically comfortable throughout long Indian ceremonies.",
          "Below is an authoritative comparison between a bridal poshak and a festive poshak handcrafted at Rajwadi's Nagpur boutique.",
        ],
      },
      {
        heading: "1. Fabric & Structural Weight",
        paragraphs: [
          "Bridal Poshak: Fashioned from heavy pure handloom georgette, tissue silk, or royal brocades. Because of the density of gold wire and metal plates, a finished bridal poshak weighs between 3.5 kg and 6.0 kg, providing a firm, regal drape that stays poised during rituals.",
          "Festive Poshak: Tailored from lighter pure georgette, chiffon, or fine art silk. Weighing between 1.2 kg and 2.5 kg, festive poshaks prioritize fluid grace, breathability, and ease of dancing or day-long fasting rituals.",
        ],
      },
      {
        heading: "2. Embroidery & Karigari Techniques",
        paragraphs: [
          "Bridal Artistry: Features dense, three-dimensional Zardozi wirework, antique Kasab metallic thread, heavy Danka (hand-cut convex metallic plates), and elaborate 4-sided Odhna borders with prominent Gota Kiran fringe.",
          "Festive Artistry: Emphasizes flat and folded Gota Patti florets, delicate Marodi needlework, Kundan stone buttas, and light Barik Zari outlines. The result is shimmering brilliance without the bulk of heavy metallic wire.",
        ],
      },
      {
        heading: "3. Kalidar Ghagra Gher (Flare Sweep)",
        paragraphs: [
          "Bridal Ghagra: Meticulously cut into 12 to 16 full kalis with an expansive sweep ranging from 4.5 meters to 6.5 meters. This dramatic flare pools regally when seated during the marriage vows.",
          "Festive Ghagra: Typically cut with 8 to 12 kalis offering a graceful 3.5 to 4.2-meter gher, designed for natural movement and effortless walking.",
        ],
      },
      {
        heading: "4. When to Choose Which?",
        paragraphs: [
          "Choose Bridal: If you are the bride, the bride's mother at the main ceremony, or the groom's sister during the Mayra and Barat procession where maximum royal formality is expected.",
          "Choose Festive: If you are attending Teej, Gangaur, Karwa Chauth, Diwali, family ring ceremonies, or pre-wedding sangeet parties where lively interaction and dancing are key.",
        ],
      },
    ],
    relatedProductSlugs: [
      "morbagh-rajputi-poshak",
      "pista-kesariya-rajputi-poshak",
      "gulabi-neelam-poshak",
      "kesariya-sunehri-poshak",
    ],
    relatedCategorySlugs: [
      { label: "Bridal Rajputi Collection", href: "/collection/bridal-rajputi-poshak" },
      { label: "Festive Rajputi Collection", href: "/collection/festive-rajputi-poshak" },
      { label: "Semi-Stitched Material", href: "/collection/semi-stitched-rajputi-poshak" },
    ],
  },

  {
    slug: "how-to-wear-a-rajputi-poshak-traditional-guide",
    title: "How to Wear a Rajputi Poshak: Traditional Step-by-Step Guide",
    metaTitle: "How to Wear a Rajputi Poshak: Traditional Guide | Rajwadi",
    metaDescription:
      "Learn how to wear an authentic Rajputi Poshak step-by-step: Ghagra tying, Kurti-Kanchali fit, and traditional Odhna palla draping from Rajwadi Nagpur.",
    h1: "How to Wear a Rajputi Poshak: Step-by-Step Traditional Draping Guide",
    excerpt:
      "Master the art of wearing the royal four-piece Rajasthani attire. Step-by-step instructions for tying the Kalidar Ghagra, Kurti-Kanchali, and crowning Odhna.",
    category: "Style & Draping",
    publishedAt: "2026-03-24",
    updatedAt: "2026-04-05",
    author: {
      name: "Rajwadi Styling Desk",
      role: "Traditional Draping Specialists",
    },
    readTime: "7 min read",
    featuredImage: "/traditonal.webp",
    reviewNotice: "DRAFT – NEEDS OWNER REVIEW",
    content: [
      {
        heading: "The Elegance of the Rajputana Silhouette",
        paragraphs: [
          "The Rajputi Poshak is revered as one of the world's most dignified traditional ensembles. Worn across generations by royal dynasties in Mewar, Marwar, and Shekhawati, its silhouette reflects noble poise, modesty, and courtly dignity.",
          "For first-time wearers, assembling the four distinct garments can appear complex. Follow our comprehensive guide from Rajwadi Nagpur to achieve an immaculate royal drape.",
        ],
      },
      {
        heading: "Step 1: The Inner Foundation & Kalidar Ghagra",
        paragraphs: [
          "Begin with a well-fitted cotton petticoat tied firmly at the natural waist. Step into the Kalidar Ghagra and align the waist drawstring (nada). Ensure the ghagra hem sits exactly half an inch above the floor when wearing your ceremonial heels.",
          "Smooth the pleats around your waist so the flared kalis distribute symmetrically. The satin or zari Aari-Magji border along the bottom hem should form an even, circular perimeter.",
        ],
      },
      {
        heading: "Step 2: Wearing the Kanchali (Inner Bodice)",
        paragraphs: [
          "The Kanchali is the fitted inner brassiere-blouse with back tie cords (dori). Slip your arms through the sleeves and position the cups securely over your chest. Tie the cords firmly in the back.",
          "Because the Kanchali is open-backed, ensure the fit around the arms and chest is snug yet comfortable, allowing freedom of arm movement.",
        ],
      },
      {
        heading: "Step 3: Slipping on the Kurti (Outer Tunic)",
        paragraphs: [
          "The Kurti is the sleeveless or short-capped outer tunic that slips over the head, covering the Kanchali and falling over the upper portion of the ghagra.",
          "Align the side slits (chaks) evenly over your hips. A properly tailored Kurti should hang straight without pulling across the bust, highlighting the fine gota and zari embroidery along the deep U-neckline.",
        ],
      },
      {
        heading: "Step 4: The Crowning Odhna Drape",
        paragraphs: [
          "The 2.5-meter Odhna is the defining crown of the poshak. There are two traditional draping styles: the Royal Court Palla and the Front Marwadi Drape.",
          "1. Take one end of the Odhna and tuck it securely into the right side of the ghagra waist.",
          "2. Bring the fabric across the back, over the left shoulder, and let the decorative palla hang elegantly across the arm.",
          "3. Take the remaining length over your head from the back, securing it with subtle bobby pins into your hair bun so the gota kiran fringe frames your forehead.",
        ],
        bullets: [
          "Pin Placement: Use velvet-padded safety pins underneath the border so metal does not snag pure georgette threads.",
          "Kiran Direction: The delicate gota kiran should point outward, glistening softly against the face.",
        ],
      },
      {
        heading: "Step 5: Pairing Rajputi Royal Jewellery",
        paragraphs: [
          "Complete the attire with traditional Rajputi jewellery: the circular Borla at the hair parting, the crescent Aad necklace nestled against the collarbone, and the delicate Nath with pearl chain pinned into the hair. You are now adorned in authentic royal splendour.",
        ],
      },
    ],
    relatedProductSlugs: [
      "classic-maroon-rajputi-poshak",
      "pista-gulab-rajputi-poshak",
      "rajputi-bridal-jewellery-set",
      "kundan-rajputi-rakhdi",
    ],
    relatedCategorySlugs: [
      { label: "Classic Poshaks", href: "/collection/classic-rajputi-poshak" },
      { label: "Rajputi Jewellery", href: "/collection/rajputi-jewellery" },
      { label: "Stitched Poshaks", href: "/collection/stitched-rajputi-poshak" },
    ],
  },

  {
    slug: "rajputi-poshak-price-guide-fabrics-and-work",
    title: "Rajputi Poshak Price Guide: Fabrics & Karigari",
    metaTitle: "Rajputi Poshak Price Guide: Fabrics & Work | Rajwadi Nagpur",
    metaDescription:
      "Understand Rajputi poshak pricing: differences between pure georgette and art crepe, hand gota patti vs machine zari, and bespoke tailoring costs.",
    h1: "Rajputi Poshak Price Guide: What Determines Fabric & Karigari Value",
    excerpt:
      "A transparent breakdown of poshak pricing. Learn how handloom textiles, pure zari wire, gota kiran finishing, and custom tailoring determine heirloom value.",
    category: "Price Guide",
    publishedAt: "2026-03-28",
    updatedAt: "2026-04-05",
    author: {
      name: "Rajwadi Master Tailors",
      role: "Atelier Consultants",
    },
    readTime: "5 min read",
    featuredImage: "/stiched.webp",
    reviewNotice: "DRAFT – NEEDS OWNER REVIEW",
    content: [
      {
        heading: "Demystifying Rajputi Poshak Pricing",
        paragraphs: [
          "Prices for Rajputi poshaks vary considerably across the market—from ₹2,500 for entry-level machine-embroidered sets to ₹85,000+ for bespoke pure handloom bridal heirlooms. Understanding what drives these price distinctions empowers you to invest wisely in quality textiles that will last for decades.",
          "At Rajwadi in Nagpur, transparent pricing is a cornerstone of our heritage atelier. Below is an honest appraisal of the factors that determine poshak valuation.",
        ],
      },
      {
        heading: "1. The Base Textile: Handloom Pure vs Art Blends",
        paragraphs: [
          "Pure Handloom Georgette & Tissue Silk: The gold standard for bridal couture. Woven from 100% natural silk fibres, pure georgette holds heavy metallic bullion without tearing or sagging. Sets in pure georgette generally range from ₹12,000 to ₹50,000+ depending on zari density.",
          "High-Grade Art Georgette & Crepe: Perfect for semi-formal festivities and classic everyday celebrations. These durable fabrics provide a beautiful drape and royal sheen at accessible price points ranging from ₹3,000 to ₹9,500.",
        ],
      },
      {
        heading: "2. The Karigari: Hand Gota Patti vs Computerized Needlework",
        paragraphs: [
          "Ancestral Hand Embroidery: Authentic Gota Patti requires artisans to manually cut metallic ribbon (gota), fold each petal into 3D shapes, and stitch them individually with needle and thread. A heavy hand-embroidered bridal piece requires 80 to 180 artisan hours.",
          "Zardozi & Kasab Zari: Genuine metallic kasab thread and copper bullion wires significantly increase cost compared to synthetic lurex threads. Real metal gives a luminous, antique gold patina that never fades.",
        ],
      },
      {
        heading: "3. Odhna Gota Kiran & Four-Sided Borders",
        paragraphs: [
          "The crowning odhna often represents 30% to 40% of the entire poshak's crafting cost. A four-sided heavily bordered odhna with hand-looped gold/silver Gota Kiran fringe requires meticulous manual finishing, ensuring no raw edges unravel.",
        ],
      },
      {
        heading: "4. Stitched vs Semi-Stitched Options at Rajwadi",
        paragraphs: [
          "Semi-Stitched Fabric Packs: Offer the greatest flexibility for local bespoke tailoring. Typically priced between ₹3,500 and ₹18,000, including fabric panels, cotton astar, and satin magji.",
          "Ready-to-Wear Tailored Poshaks: Hand-tailored by our master darzis in Nagpur with finished kali flares, lined kurtis, and generous internal alteration margins, typically priced between ₹5,500 and ₹35,000.",
        ],
      },
    ],
    relatedProductSlugs: [
      "morbagh-rajputi-poshak",
      "gulnaar-rajsi-poshak-material",
      "surkh-rajsi-poshak-material",
      "jamuni-mor-poshak-material",
    ],
    relatedCategorySlugs: [
      { label: "Semi-Stitched Material", href: "/collection/semi-stitched-rajputi-poshak" },
      { label: "Stitched Poshaks", href: "/collection/stitched-rajputi-poshak" },
      { label: "Bridal Poshaks", href: "/collection/bridal-rajputi-poshak" },
    ],
  },

  {
    slug: "rajputi-poshak-in-nagpur-store-visit-and-tailoring",
    title: "Rajputi Poshak in Nagpur: Store Visit & Tailoring",
    metaTitle: "Rajputi Poshak in Nagpur: Store Visit & Tailoring | Rajwadi",
    metaDescription:
      "Visit Rajwadi's boutique at Hiwari Layout, Nagpur for authentic Rajputi poshaks, bridal lehengas, bespoke stitching, and rental policy details.",
    h1: "Rajputi Poshak in Nagpur: Boutique Visit, Custom Stitching & Heritage Care",
    excerpt:
      "Looking for authentic Rajputi poshak in Nagpur? Experience pure Rajasthani fabrics, master darzi stitching, and boutique consultations at Rajwadi in Hiwari Layout.",
    category: "Nagpur Boutique",
    publishedAt: "2026-04-01",
    updatedAt: "2026-04-05",
    author: {
      name: "Rajwadi Nagpur Boutique",
      role: "Store Stylists",
    },
    readTime: "5 min read",
    featuredImage: "/hero_bg.webp",
    reviewNotice: "DRAFT – NEEDS OWNER REVIEW",
    content: [
      {
        heading: "Nagpur's Destination for Royal Rajputi Elegance",
        paragraphs: [
          "For decades, Rajasthani and Rajput families residing across Vidarbha and central Maharashtra had to travel to Jaipur, Jodhpur, or Bikaner to find authentic royal poshaks. Rajwadi Rajputi Poshak was founded to bridge this gap, bringing authentic Marwar karigari directly to Nagpur.",
          "Located conveniently in Hiwari Layout, Uday Nagar, our boutique invites you to touch pure handloom georgettes, inspect handcrafted zardozi motifs, and experience personal royal tailoring consultations.",
        ],
      },
      {
        heading: "1. Boutique Location & Visiting Hours",
        paragraphs: [
          "Boutique Address: EWS 41, near Maheshwari Bhawan, Hiwari Layout, Uday Nagar, Padole Nagar, Nagpur, Maharashtra 440008.",
          "Phone / WhatsApp: +91 8766667101",
          "Visiting Hours: Monday through Saturday, 11:00 AM – 8:00 PM IST. Walk-ins are warmly welcomed, though bridal parties are encouraged to schedule an appointment for dedicated stylist attention.",
        ],
      },
      {
        heading: "2. In-Store Master Darzi Stitching Service",
        paragraphs: [
          "Ill-fitting poshaks compromise both silhouette and comfort. At our Nagpur atelier, our master tailors possess deep expertise in historical poshak construction. We tailor:",
          "Custom Kalidar Gher: Tailored flares from 4 meters to 6.5 meters with perfectly balanced magji weights.",
          "Flattering Kurti-Kanchali Fit: Tailored necklines and sleeve armholes that conform comfortably without pulling.",
          "Express Alteration Assistance: Quick adjustments for destination weddings and upcoming family ceremonies.",
        ],
      },
      {
        heading: "3. Rental Service Availability",
        paragraphs: [
          "For clients seeking exclusive ceremonial attire for short-term events, select poshak sets are available for bridal event hire and styling consultations. Inquire directly with our boutique team for current rental catalog availability, deposit terms, and fitting schedules.",
        ],
      },
      {
        heading: "4. Online Ordering & Worldwide Shipping from Nagpur",
        paragraphs: [
          "Cannot visit our Nagpur store in person? Our digital boutique delivers across India and internationally to clients in the USA, UK, UAE, Canada, and Australia. Every order is carefully steam-ironed, packed in luxury keepsake packaging, and dispatched with fully insured tracking.",
        ],
      },
    ],
    relatedProductSlugs: [
      "morbagh-rajputi-poshak",
      "rani-maroon-rajputi-poshak",
      "pista-kesariya-rajputi-poshak",
      "rajputi-bridal-jewellery-set",
    ],
    relatedCategorySlugs: [
      { label: "Explore Full Collection", href: "/collection" },
      { label: "Book Boutique Visit", href: "/contact" },
      { label: "Bridal Poshaks", href: "/collection/bridal-rajputi-poshak" },
    ],
  },
];
