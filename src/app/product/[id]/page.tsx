import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";
import { REAL_POSHAKS } from "@/data/products";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://rajwadirajputiposhak.com";

function parsePriceToPaise(priceStr: string): number {
  const numeric = priceStr.replace(/[^0-9]/g, "");
  const inRupees = numeric ? parseInt(numeric, 10) : 0;
  return inRupees * 100;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  let product: any = null;
  try {
    product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: id }, { slug: decodedId }, { id }],
        status: "PUBLISHED",
      },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });
  } catch {}

  if (!product) {
    product = REAL_POSHAKS.find(
      (p) => p.id === id || p.id === decodedId || p.name.toLowerCase() === decodedId.toLowerCase()
    );
  }

  if (!product) {
    return {
      title: "Royal Rajputi Poshak Not Found | Rajwadi",
    };
  }

  const productIdentifier = product.slug || product.id;
  const productUrl = `${siteUrl}/product/${encodeURIComponent(productIdentifier)}`;
  const title = `${product.name} — Authentic Royal Rajputi Poshak | Rajwadi`;
  const description =
    product.description ||
    `Order ${product.name} from Rajwadi Jaipur. Handcrafted authentic Royal Rajputi Poshak with pure fabric, intricate royal embroidery, and bespoke tailoring.`;

  const primaryImage =
    (product.images && product.images[0]?.secureUrl) ||
    product.image ||
    "/bridal.webp";

  const fullImageUrl = primaryImage.startsWith("http")
    ? primaryImage
    : `${siteUrl}${primaryImage}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      "Rajputi Poshak",
      "Royal Rajputi Poshak",
      product.category ? `${product.category} Rajputi Poshak` : "Bridal Poshak",
      product.fabric ? `${product.fabric} Rajputi Poshak` : "Pure Georgette Poshak",
      "Rajwadi Jaipur",
      "Heirloom Poshak",
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: productUrl,
      siteName: "Rajwadi Rajputi Poshak",
      title,
      description,
      images: [
        {
          url: fullImageUrl,
          width: 800,
          height: 1067,
          alt: `${product.name} — Rajwadi Royal Rajputi Poshak`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  let dbProduct: any = null;
  try {
    dbProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug: id }, { slug: decodedId }, { id }],
        status: "PUBLISHED",
      },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: true,
      },
    });
  } catch {}

  const fallbackProduct = REAL_POSHAKS.find(
    (p) => p.id === id || p.id === decodedId || p.name.toLowerCase() === decodedId.toLowerCase()
  );

  if (!dbProduct && !fallbackProduct) {
    notFound();
  }

  // Complementary related products
  let relatedProducts: any[] = [];
  try {
    const relatedDbProducts = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(dbProduct ? { id: { not: dbProduct.id } } : {}),
      },
      take: 4,
      orderBy: { isFeatured: "desc" },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (relatedDbProducts && relatedDbProducts.length > 0) {
      relatedProducts = relatedDbProducts.map((p) => {
        const pImages = p.images.map((img) => img.secureUrl);
        return {
          id: p.slug,
          slug: p.slug,
          name: p.name,
          category: p.category,
          priceInPaise: p.priceInPaise,
          price: `₹ ${(p.priceInPaise / 100).toLocaleString("en-IN")}`,
          image: pImages[0] || "/placeholder.webp",
          additionalImages: pImages,
          fabric: p.fabric,
          craft: p.craft,
          color: p.color,
          description: p.description,
          details: Array.isArray(p.details) ? (p.details as string[]) : [],
          includes: Array.isArray(p.includes) ? (p.includes as string[]) : [],
          imagePosition: p.imagePosition,
          imageScale: p.imageScale,
          inStock: p.inStock && p.stock > 0,
        };
      });
    }
  } catch {}

  if (relatedProducts.length === 0) {
    relatedProducts = REAL_POSHAKS.filter(
      (p) => p.id !== (dbProduct?.slug || fallbackProduct?.id)
    ).slice(0, 4);
  }

  let formattedProduct: any;

  if (dbProduct) {
    const formattedImages = dbProduct.images.map((img: any) => img.secureUrl);
    const mainImage = formattedImages[0] || "/placeholder.webp";

    formattedProduct = {
      id: dbProduct.slug,
      internalId: dbProduct.id,
      slug: dbProduct.slug,
      name: dbProduct.name,
      category: dbProduct.category,
      priceInPaise: dbProduct.priceInPaise,
      priceFormatted: `₹ ${(dbProduct.priceInPaise / 100).toLocaleString("en-IN")}`,
      price: `₹ ${(dbProduct.priceInPaise / 100).toLocaleString("en-IN")}`,
      compareAtPriceInPaise: dbProduct.compareAtPriceInPaise,
      fabric: dbProduct.fabric,
      craft: dbProduct.craft,
      color: dbProduct.color,
      description: dbProduct.description,
      details: Array.isArray(dbProduct.details) ? (dbProduct.details as string[]) : [],
      includes: Array.isArray(dbProduct.includes) ? (dbProduct.includes as string[]) : [],
      image: mainImage,
      additionalImages: formattedImages,
      imagePosition: dbProduct.imagePosition,
      imageScale: dbProduct.imageScale,
      inStock: dbProduct.inStock && dbProduct.stock > 0,
      stock: dbProduct.stock,
      stitchingAvailable: dbProduct.stitchingAvailable,
      stitchingPriceInPaise: dbProduct.stitchingPriceInPaise,
      stitchingPriceFormatted: `₹ ${(dbProduct.stitchingPriceInPaise / 100).toLocaleString("en-IN")}`,
      isFeatured: dbProduct.isFeatured,
    };
  } else if (fallbackProduct) {
    const priceInPaise = parsePriceToPaise(fallbackProduct.price);
    const compareAtPaise = fallbackProduct.originalPrice
      ? parsePriceToPaise(fallbackProduct.originalPrice)
      : null;

    formattedProduct = {
      ...fallbackProduct,
      priceInPaise,
      priceFormatted: fallbackProduct.price,
      compareAtPriceInPaise: compareAtPaise,
      inStock: !fallbackProduct.soldOut,
      stitchingPriceInPaise: 250000,
      stitchingPriceFormatted: "₹ 2,500",
    };
  }

  // Schema.org Product Structured Data
  const productPriceNumber =
    formattedProduct.priceInPaise != null
      ? formattedProduct.priceInPaise / 100
      : parsePriceToPaise(formattedProduct.price || "0") / 100;

  const productUrl = `${siteUrl}/product/${encodeURIComponent(formattedProduct.slug || formattedProduct.id)}`;
  const primaryImageUrl = formattedProduct.image?.startsWith("http")
    ? formattedProduct.image
    : `${siteUrl}${formattedProduct.image}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: formattedProduct.name,
    image: [primaryImageUrl],
    description: formattedProduct.description,
    sku: formattedProduct.id || formattedProduct.slug,
    brand: {
      "@type": "Brand",
      name: "Rajwadi",
    },
    category: formattedProduct.category || "Rajputi Poshak",
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: productPriceNumber,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      itemCondition: "https://schema.org/NewCondition",
      availability: formattedProduct.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Rajwadi",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Collection",
          item: `${siteUrl}/collection`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: formattedProduct.name,
          item: productUrl,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <ProductDetailClient
        product={formattedProduct}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
