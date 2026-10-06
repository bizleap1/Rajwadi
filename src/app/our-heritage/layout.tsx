import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl";

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Our Royal Heritage & Rajputi Artistry — Rajwadi Atelier",
  description:
    "Discover the royal heritage of Rajwadi: preservation of centuries-old Rajputi royal poshak craftsmanship, zardozi needlework, gota patti hand embroidery, and Rajasthani royal traditions.",
  keywords: [
    "Rajputi Poshak Heritage",
    "Rajwadi Poshakh Heritage",
    "Rajasthani Royal Artistry",
    "Gota Patti Work History",
    "Zari Zardozi Embroidery",
    "Royal Rajputi Atelier",
    "Rajwadi Heritage",
  ],
  alternates: {
    canonical: "/our-heritage",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/our-heritage",
    siteName: "Rajwadi Rajputi Poshak",
    title: "Our Royal Heritage & Rajputi Artistry — Royal Atelier | Rajwadi",
    description:
      "Preserving centuries of Rajasthani royal needlework, gota patti embroidery, and heirloom Rajputi poshak craftsmanship.",
    images: [
      {
        url: "/heritage_haveli_courtyard.webp",
        width: 1200,
        height: 800,
        alt: "Rajwadi Royal Heritage & Atelier Craft",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Royal Heritage & Rajputi Artistry — Royal Atelier | Rajwadi",
    description:
      "Preserving centuries of Rajasthani royal needlework, gota patti embroidery, and heirloom Rajputi poshak craftsmanship.",
    images: ["/heritage_haveli_courtyard.webp"],
  },
};

const heritageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Our Royal Heritage & Rajputi Artistry",
  description:
    "Discover the royal heritage of Rajwadi: preservation of centuries-old Rajputi royal poshak craftsmanship, zardozi needlework, gota patti hand embroidery, and Rajasthani royal traditions.",
  url: `${siteUrl}/our-heritage`,
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
        name: "Our Heritage",
        item: `${siteUrl}/our-heritage`,
      },
    ],
  },
};

export default function OurHeritageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(heritageSchema),
        }}
      />
      {children}
    </>
  );
}
