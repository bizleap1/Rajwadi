export interface CategoryPageData {
  slug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  introParagraphs: string[];
  faq: { question: string; answer: string }[];
  filterType: "category" | "type";
  filterValue: string;
}

export const CATEGORY_PAGES: Record<string, CategoryPageData> = {
  "bridal-rajputi-poshak": {
    slug: "bridal-rajputi-poshak",
    name: "Bridal Rajputi Poshak",
    h1: "Authentic Bridal Rajputi Poshaks – Royal Wedding Couture | Nagpur",
    metaTitle: "Bridal Rajputi Poshak Collection – Pure Georgette | Rajwadi",
    metaDescription:
      "Explore handcrafted Bridal Rajputi Poshaks in pure georgette with zari, dabka and gota patti. Bespoke stitching & worldwide delivery from Rajwadi Nagpur.",
    introParagraphs: [
      "The Bridal Rajputi Poshak is the pinnacle of imperial Rajasthani heritage, representing generations of noble matrimonial tradition and courtly elegance. Worn by Rajput brides across centuries, this resplendent 4-piece ensemble—comprising the sweeping Kalidar Ghagra, the fitted Kurti, the inner Kanchali, and the majestic 2.5-meter Odhna—embodies the timeless splendour of royal Rajasthan. At Rajwadi in Nagpur, each bridal poshak is an heirloom masterpiece, meticulously brought to life by master artisans who preserve ancestral hand-embroidery traditions passed down through lineages of royal needleworkers.",
      "Our bespoke bridal collection is crafted on pure handloom textiles, predominantly pure georgette, shimmering tissue silk, and luxurious brocades. Each creation is enriched with ancestral embroidery techniques including three-dimensional Gota Patti hand-folding, lustrous Zardozi metallic needlecraft, antique Kasab zari, and hand-cut Danka plate work. Traditional bridal palettes reign supreme—from auspicious Kesariya (royal saffron), Surkh Laal (deep crimson), and Gulabi Rani (vibrant imperial pink) to majestic deep maroon and peacock accents—all outlined with glittering four-sided Gota Kiran fringe.",
      "Every bridal creation from our Nagpur atelier offers comprehensive customisation. From bespoke kali flares spanning 4 to 6 meters to personalised waist-to-hem drape measurements and neckline tailoring, our master karigars ensure an immaculate, regal silhouette. We invite brides to explore our bridal collection online or schedule a bespoke consultation with our stylists.",
    ],
    faq: [
      {
        question: "What makes an authentic Rajputi Bridal Poshak unique?",
        answer:
          "An authentic bridal poshak consists of four traditional garments—Ghagra, Kurti, Kanchali, and Odhna—adorned with handcrafted Gota Patti, Zardozi, and Danka embroidery, finished with signature Gota Kiran along the odhna perimeter.",
      },
      {
        question: "How long does a bridal poshak take to craft and deliver?",
        answer:
          "Ready-to-ship bridal poshaks dispatch within 2–4 business days. Custom bespoke bridal creations typically take 10–25 days for handcrafting, tailoring, and insured door-step delivery.",
      },
      {
        question: "Do you offer custom bridal tailoring and size measurements?",
        answer:
          "Yes. Our master atelier tailors provide personalized measurement consultations via WhatsApp (+91 8766667101) to ensure your bridal poshak fits impeccably.",
      },
      {
        question: "Can I inspect bridal poshaks at your Nagpur boutique?",
        answer:
          "Yes. You are warmly welcomed to visit our boutique at EWS 41, near Maheshwari Bhawan, Hiwari Layout, Uday Nagar, Nagpur to experience the fabrics and craftsmanship in person.",
      },
    ],
    filterType: "category",
    filterValue: "Bridal",
  },

  "festive-rajputi-poshak": {
    slug: "festive-rajputi-poshak",
    name: "Festive Rajputi Poshak",
    h1: "Festive Rajputi Poshaks – Handcrafted Royal Celebrations | Nagpur",
    metaTitle: "Festive Rajputi Poshak Collection – Gota Patti & Zari | Rajwadi",
    metaDescription:
      "Shop royal Festive Rajputi Poshaks in vibrant hues with gota patti and kundan embroidery. Handcrafted heritage attire with insured delivery from Rajwadi.",
    introParagraphs: [
      "Celebrate India's most auspicious occasions and sacred festivals in authentic royal splendour with Rajwadi's Festive Rajputi Poshak collection. In traditional Rajasthani culture, festivals such as Teej, Gangaur, Karwa Chauth, Navratri, and Diwali are celebrated with exuberant pageantry, where women adorn themselves in vibrant, ceremonial poshaks that celebrate heritage, joy, and family prestige. Our festive collection captures this joyous royal essence with lighter, fluid silhouettes that retain regal embroidery without compromising movement.",
      "Crafted in pure flowy georgette, chiffon, and art silks, our festive ensembles showcase delicate Gotapatti florets, intricate Barik Zari needlework, glistening Kundan buttas, and delicate Marodi threadwork. The vibrant colour spectrum celebrates Rajasthan's festive spirit: radiant Pista Green, Auspicious Kesariya, Vibrant Gulabi, Regal Neelam Turquoise, and festive Leheriya prints that swirl gracefully during joyous celebrations.",
      "Each festive poshak includes matching Aari-Magji finishing and pure cotton inner lining (astar), designed to remain breathable and comfortable during day-long rituals and evening festivities. Explore our ready-to-wear and semi-stitched festive options for fast delivery across India and worldwide.",
    ],
    faq: [
      {
        question: "What fabrics are best suited for festive celebrations?",
        answer:
          "Pure georgette and high-grade chiffon are ideal for festive wear because they offer a lightweight, breathable drape with royal fluidity while effortlessly supporting intricate gota patti handwork.",
      },
      {
        question: "Are festive poshaks available in stitched or semi-stitched sets?",
        answer:
          "We offer both ready-to-wear pre-stitched sets in standard sizes (XL/XXL with alterable margins) and complete semi-stitched fabric sets for bespoke local tailoring.",
      },
      {
        question: "How should I clean and care for a festive poshak?",
        answer:
          "All handcrafted poshaks should be dry cleaned only. Avoid direct contact with water and perfumes, and store folded inside a breathable cotton cover.",
      },
    ],
    filterType: "category",
    filterValue: "Festive",
  },

  "classic-rajputi-poshak": {
    slug: "classic-rajputi-poshak",
    name: "Classic Rajputi Poshak",
    h1: "Classic Rajputi Poshaks – Traditional Everyday Elegance | Nagpur",
    metaTitle: "Classic Rajputi Poshak Collection – Timeless Heritage | Rajwadi",
    metaDescription:
      "Discover timeless Classic Rajputi Poshaks tailored in georgette and crepe. Traditional danka and kiran borders with worldwide delivery from Rajwadi Nagpur.",
    introParagraphs: [
      "Rooted in ancestral tradition and timeless Rajasthani simplicity, the Classic Rajputi Poshak collection from Rajwadi brings everyday royal refinement to traditional wardrobes. Designed for traditional family poojas, temple visits, informal family gatherings, and everyday ceremonial grace, these ensembles celebrate the pure, unpretentious beauty of ancestral poshak silhouettes without the heavy weight of bridal couture.",
      "Our classic poshaks are fashioned from durable, high-grade georgette, semi-pure fabrics, and soft crepes that ensure effortless all-day comfort. Adorned with understated Gota Patti leaf borders, fine kasab zari buttiya, and delicate gota kiran fringes, each piece preserves the essential royal heritage codes: a modest, flattering kalidar ghagra drape, perfectly proportioned kurti-kanchali, and an airy 2.5-meter odhna.",
      "Every classic poshak comes complete with matching satin magji borders and breathable cotton lining packs. Available at accessible prices with bespoke stitching assistance, our classic collection is the perfect starting point for discovering the timeless dignity of Rajputi attire.",
    ],
    faq: [
      {
        question: "What is the difference between classic and bridal poshaks?",
        answer:
          "Classic poshaks are crafted with lighter embroidery and breathable fabrics for comfort during day-to-day traditional wear and family gatherings, whereas bridal poshaks feature dense, heavy zardozi and danka embroidery spanning 4 to 6 meter flares.",
      },
      {
        question: "Are classic poshaks easy to maintain?",
        answer:
          "Yes. While dry cleaning is still recommended to preserve the metallic zari trim, the fabrics are resilient and comfortable for repeated seasonal wear.",
      },
    ],
    filterType: "category",
    filterValue: "Classic Poshak",
  },

  "semi-stitched-rajputi-poshak": {
    slug: "semi-stitched-rajputi-poshak",
    name: "Semi-Stitched Rajputi Poshak",
    h1: "Semi-Stitched Rajputi Poshak Material – Custom Tailoring Sets | Nagpur",
    metaTitle: "Semi-Stitched Rajputi Poshak Material Sets | Rajwadi Nagpur",
    metaDescription:
      "Buy premium Semi-Stitched Rajputi Poshak material sets with gala work, complete aari-magji & cotton astar. Ready for custom tailoring. Rajwadi Nagpur.",
    introParagraphs: [
      "For women who desire an exact, custom-tailored royal fit from their trusted family master tailor, Rajwadi offers our curated Semi-Stitched Rajputi Poshak Material sets. A semi-stitched poshak provides the perfect balance of intricate artisan handwork and total sizing flexibility, ensuring you receive authentically embroidered panels that can be tailored precisely to your unique measurements.",
      "Each semi-stitched set comes complete with pre-worked kalidar ghagra panels featuring heavy hem borders, pre-embroidered kurti-kanchali fabric with gala (neckline) needlework, a full-length 2.5-meter odhna finished with authentic four-sided border and gota kiran fringe, and a complete aari-magji and pure cotton lining (astar) bundle. Nothing extra needs to be sourced—your tailor has everything required to assemble an immaculate royal ensemble.",
      "Whether you prefer a sweeping 4-meter ghagra flare or a streamlined contemporary silhouette, our semi-stitched poshak materials allow you to customise lehenga length, choli sleeves, and neckline depth to your exact preference. Shipped across India and internationally with insured tracking.",
    ],
    faq: [
      {
        question: "What is included in a semi-stitched Rajputi poshak set?",
        answer:
          "A complete set includes embroidered ghagra panels, kurti-kanchali fabric with neck work, 2.5m odhna with 4-side gota kiran border, matching magji border fabric, and pure cotton inner lining (astar).",
      },
      {
        question: "Can any local tailor stitch a Rajputi poshak?",
        answer:
          "Yes, any experienced tailor familiar with ethnic lehengas or traditional suits can easily assemble a semi-stitched poshak following the pre-cut panel lines and lining guidance provided.",
      },
      {
        question: "Can Rajwadi stitch the poshak before dispatch?",
        answer:
          "Yes. We offer in-house bespoke stitching by our master atelier tailors in Nagpur. Contact us via WhatsApp (+91 8766667101) to add bespoke stitching to your order.",
      },
    ],
    filterType: "type",
    filterValue: "Unstitched",
  },

  "stitched-rajputi-poshak": {
    slug: "stitched-rajputi-poshak",
    name: "Stitched Rajputi Poshak",
    h1: "Ready to Wear Stitched Rajputi Poshaks – Tailored Royal Flare | Nagpur",
    metaTitle: "Stitched Rajputi Poshak Collection – Ready to Wear | Rajwadi",
    metaDescription:
      "Explore ready-to-wear Stitched Rajputi Poshaks tailored with imperial kalidar flare and side margins. Quick dispatch and insured delivery from Rajwadi Nagpur.",
    introParagraphs: [
      "Experience the grandeur of royal Rajputi couture without the wait of bespoke tailoring with Rajwadi's Ready-to-Wear Stitched Rajputi Poshak collection. Tailored to perfection by master artisans who have specialized in traditional Rajasthani cuts for decades, our stitched poshaks arrive ready to adorn for your special occasion.",
      "Each stitched ensemble includes a pre-tailored kalidar ghagra with generous royal flare, an expertly fitted kurti-kanchali with traditional neck and sleeve piping, and a fully finished odhna with hand-fringed gota kiran and delicate pallu motifs. Our stitched garments are tailored in generous standard sizes (XL and XXL) and include 2-inch inner side margins, allowing seamless minor alterations at home or with your local boutique.",
      "Ideal for destination weddings, last-minute festivities, and international clients seeking hassle-free authentic ethnic wear, our stitched collection combines artisanal heritage embroidery with contemporary convenience. Enjoy complimentary insured express dispatch across India.",
    ],
    faq: [
      {
        question: "What sizes are available in ready-to-wear stitched poshaks?",
        answer:
          "Our standard stitched poshaks are tailored in XL (Bust ~42 inches) and XXL (Bust ~44 inches) with 2 inches of generous inner margin fabric for easy alteration if needed.",
      },
      {
        question: "How quickly can a stitched poshak be delivered?",
        answer:
          "In-stock stitched poshaks are dispatched within 24–48 hours, arriving within 3–6 business days across India and 7–10 days internationally.",
      },
      {
        question: "Can I request size adjustments before shipping?",
        answer:
          "Yes. Contact our styling concierge on WhatsApp (+91 8766667101) right after placing your order to share custom sizing requests.",
      },
    ],
    filterType: "type",
    filterValue: "Stitched",
  },

  "rajputi-jewellery": {
    slug: "rajputi-jewellery",
    name: "Rajputi Jewellery",
    h1: "Traditional Rajputi Jewellery – Aad, Rakhdi, Borla & Sheeshphool | Nagpur",
    metaTitle: "Traditional Rajputi Jewellery – Aad, Borla & Rakhdi | Rajwadi",
    metaDescription:
      "Adorn yourself with authentic Rajputi Jewellery: Rajasthani Aad, Kundan Rakhdi, Borla, and Sheeshphool. Handcrafted royal ornaments from Rajwadi Nagpur.",
    introParagraphs: [
      "No Rajputi poshak is truly complete without the regal accompaniment of authentic Rajasthani Rajputi Jewellery. For centuries, the royal courts of Mewar, Marwar, and Shekhawati celebrated distinct jewellery traditions that accentuated a woman's dignity, marital auspiciousness, and royal stature. Rajwadi's curated jewellery collection revives these ancestral designs with heirloom-grade craftsmanship.",
      "Our jewellery collection encompasses every essential royal ornament: the iconic circular Rakhdi and Borla worn poised on the forehead parting; the elaborate Sheeshphool floral head-harness; the royal Aad choker necklace with cascading pearls and intricate meenakari enamel work; and elegant matching kundan earrings. Handcrafted by master artisans using premium brass alloy, radiant 22k gold polish, and hand-set faux kundan and polki stones.",
      "Designed to complement both heavy bridal attire and vibrant festive wear, each piece features adjustable cords and secure hair clasps for effortless, comfortable all-day wear. Shipped in protective luxury velvet presentation boxes from our boutique in Nagpur.",
    ],
    faq: [
      {
        question: "What are the essential ornaments in a traditional Rajputi jewellery set?",
        answer:
          "The classic set comprises a Rakhdi/Borla for the forehead, a Sheeshphool head-harness, an Aad (royal choker necklace), matching Kundan earrings, a Nath (nose ring), and Bajuband (armlet).",
      },
      {
        question: "What materials are used in Rajwadi Rajputi jewellery?",
        answer:
          "Our jewellery is crafted with skin-safe premium brass and copper alloy, electroplated in long-lasting micro-gold polish, and hand-set with fine Kundan, simulated pearls, and Meenakari enamel.",
      },
      {
        question: "How should I store and clean my Rajputi jewellery?",
        answer:
          "Keep jewellery away from perfumes, sweat, and water. Store each item in a separate ziplock pouch inside a velvet-lined box to protect the gold finish from oxidation.",
      },
    ],
    filterType: "category",
    filterValue: "Jewellery",
  },
};
