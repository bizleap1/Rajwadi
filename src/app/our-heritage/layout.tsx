import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://rajwadirajputiposhak.com";

export const metadata: Metadata = {
  title: "Our Royal Heritage & Rajputi Artistry — Royal Atelier",
  description:
    "Discover the royal heritage of Rajwadi: preservation of centuries-old Rajputi royal poshak craftsmanship, zardozi needlework, gota patti hand embroidery, and Rajasthani royal traditions.",
  keywords: [
    "Rajputi Poshak Heritage",
    "Rajasthani Royal Artistry",
    "Gota Patti Work History",
    "Zari Zardozi Embroidery",
    "Jaipur Royal Atelier",
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

export default function OurHeritageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
