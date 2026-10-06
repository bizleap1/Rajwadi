import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Handcrafted Artistry & Zari Craft — Rajwadi Rajputi Poshaks",
  description:
    "Explore the centuries-old royal Rajasthani crafts behind Rajwadi poshaks: Handcrafted Gota Patti, Kasab Zari, Marodi needlework, Danka, and pure Hamrahi silk odhanis.",
  keywords: [
    "Rajputi Poshak Craft",
    "Gota Patti Handwork",
    "Zari Zardozi Embroidery",
    "Marodi Work Poshak",
    "Rajasthani Artisanal Craftsmanship",
    "Hamrahi Pure Silk",
    "Rajwadi Craft",
  ],
  alternates: {
    canonical: "/craft",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/craft",
    siteName: "Rajwadi Rajputi Poshak",
    title: "Handcrafted Artistry & Zari Craft | Rajwadi",
    description:
      "Explore the centuries-old royal Rajasthani crafts behind Rajwadi poshaks: Handcrafted Gota Patti, Kasab Zari, Marodi needlework, and pure Hamrahi silk.",
    images: [
      {
        url: "/heritage_haveli_courtyard.webp",
        width: 1200,
        height: 800,
        alt: "Rajwadi Royal Craftsmanship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Handcrafted Artistry & Zari Craft | Rajwadi",
    description:
      "Explore the centuries-old royal Rajasthani crafts behind Rajwadi poshaks: Handcrafted Gota Patti, Kasab Zari, Marodi needlework, and pure Hamrahi silk.",
    images: ["/heritage_haveli_courtyard.webp"],
  },
};

export default function CraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
