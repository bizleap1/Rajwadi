import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl";

const siteUrl = SITE_URL;

const heritageTitle = "Our Royal Heritage & Rajputi Artistry | Rajwadi Rajputi Poshak";
const heritageDesc =
  "Discover the royal heritage of Rajwadi: preservation of centuries-old Rajputi royal poshak craftsmanship, zardozi needlework, gota patti hand embroidery, and Rajasthani royal traditions.";

export const metadata: Metadata = {
  title: {
    absolute: heritageTitle,
  },
  description: heritageDesc,
  alternates: {
    canonical: "/our-heritage",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/our-heritage",
    siteName: "Rajwadi Rajputi Poshak",
    title: heritageTitle,
    description: heritageDesc,
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
    title: heritageTitle,
    description: heritageDesc,
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
