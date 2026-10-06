import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl";

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Royal Rajputi Poshaks Collection — Bridal, Festive & Pure Georgette",
  description:
    "Explore Rajwadi's handcrafted royal Rajputi Poshak catalog. Featuring authentic bridal poshaks, pure georgette sets, gota patti work, and heirloom couture. Custom tailoring available.",
  keywords: [
    "Royal Rajputi Poshak Collection",
    "Rajwadi Poshak Collection",
    "Rajwadi Poshakh",
    "Bridal Rajputi Poshak",
    "Festive Rajputi Poshak",
    "Pure Georgette Poshak Online",
    "Gota Patti Rajputi Dress",
    "Semi-Stitched Rajputi Poshak",
    "Rajwadi Collection",
    "Heirloom Bridal Poshak",
    "Rajputi Poshak Nagpur",
  ],
  alternates: {
    canonical: "/collection",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/collection",
    siteName: "Rajwadi Rajputi Poshak",
    title: "Royal Rajputi Poshaks Collection — Bridal, Festive & Pure Georgette | Rajwadi",
    description:
      "Explore Rajwadi's handcrafted royal Rajputi Poshak catalog. Featuring authentic bridal poshaks, pure georgette sets, gota patti work, and heirloom couture.",
    images: [
      {
        url: "/bridal.webp",
        width: 800,
        height: 1067,
        alt: "Rajwadi Royal Rajputi Poshak Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Rajputi Poshaks Collection — Bridal, Festive & Pure Georgette | Rajwadi",
    description:
      "Explore Rajwadi's handcrafted royal Rajputi Poshak catalog. Featuring authentic bridal poshaks, pure georgette sets, gota patti work, and heirloom couture.",
    images: ["/bridal.webp"],
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Royal Rajputi Poshaks Collection",
  description:
    "Explore Rajwadi's handcrafted royal Rajputi Poshak catalog. Featuring authentic bridal poshaks, pure georgette sets, gota patti work, and heirloom couture.",
  url: `${siteUrl}/collection`,
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
    ],
  },
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      {children}
    </>
  );
}
