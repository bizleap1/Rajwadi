import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://rajwadirajputiposhak.com";

export const metadata: Metadata = {
  title: "Contact Rajwadi Atelier — Royal Bespoke Consultation & Customer Support",
  description:
    "Connect with our master poshak stylists for bridal bespoke orders, sizing assistance, pure georgette fabric consultation, and customer inquiries.",
  keywords: [
    "Contact Rajwadi",
    "Rajputi Poshak Consultation",
    "Bespoke Bridal Poshak Order",
    "Rajwadi Poshak Atelier Nagpur Contact",
    "Rajwadi Support",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/contact",
    siteName: "Rajwadi Rajputi Poshak",
    title: "Contact Rajwadi Atelier — Royal Bespoke Consultation & Support",
    description:
      "Connect with our master poshak stylists for bridal bespoke orders, sizing assistance, and royal inquiries.",
    images: [
      {
        url: "/hero_bg.webp",
        width: 1200,
        height: 630,
        alt: "Contact Rajwadi Atelier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Rajwadi Atelier — Royal Bespoke Consultation & Support",
    description:
      "Connect with our master poshak stylists for bridal bespoke orders, sizing assistance, and royal inquiries.",
    images: ["/hero_bg.webp"],
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Rajwadi Atelier",
  description:
    "Connect with our master poshak stylists for bridal bespoke orders, sizing assistance, and royal inquiries.",
  url: `${siteUrl}/contact`,
  mainEntity: {
    "@type": "ClothingStore",
    name: "Rajwadi Rajputi Poshak",
    telephone: "+91 8766667101",
    email: "support@rajwadirajputiposhak.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "EWS 41, near Maheshwari Bhawan, Hiwari Layout, Uday Nagar, Padole Nagar",
      addressLocality: "Nagpur",
      addressRegion: "Maharashtra",
      postalCode: "440008",
      addressCountry: "IN",
    },
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />
      {children}
    </>
  );
}
