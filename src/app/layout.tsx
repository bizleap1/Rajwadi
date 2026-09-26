import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://rajwadirajputiposhak.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rajwadi Jaipur | Authentic Royal Rajputi Poshaks & Bridal Wear",
    template: "%s | Rajwadi",
  },
  description:
    "Rajwadi Jaipur — Handcrafted Authentic Royal Rajputi Poshaks, Bridal Lehengas, Pure Georgette Ensembles, and Heirloom Gota Patti & Zardozi Couture. Worldwide Delivery.",
  keywords: [
    "Rajputi Poshak",
    "Royal Rajputi Poshak",
    "Bridal Rajputi Poshak",
    "Jaipur Poshak",
    "Pure Georgette Poshak",
    "Zari Zardozi Poshak",
    "Rajasthani Traditional Dress",
    "Kundan Work Poshak",
    "Rajwadi",
    "Rajwadi Poshak Jaipur",
    "Heirloom Rajputi Couture",
    "Gota Patti Poshak",
    "Custom Tailored Rajputi Poshak",
  ],
  authors: [{ name: "Rajwadi Atelier", url: siteUrl }],
  creator: "Rajwadi Atelier",
  publisher: "Rajwadi Couture",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Rajwadi Rajputi Poshak",
    title: "Rajwadi Jaipur | Authentic Royal Rajputi Poshaks & Bridal Wear",
    description:
      "Handcrafted Rajputi Poshaks crafted with zari, gota patti, and pure silk heritage artistry. Bespoke crafting & worldwide delivery.",
    images: [
      {
        url: "/hero_bg.webp",
        width: 1200,
        height: 630,
        alt: "Rajwadi Royal Rajputi Poshaks Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajwadi Jaipur | Authentic Royal Rajputi Poshaks & Bridal Wear",
    description:
      "Handcrafted Rajputi Poshaks crafted with zari, gota patti, and pure silk heritage artistry.",
    images: ["/hero_bg.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Rajwadi",
  alternateName: "Rajwadi Rajputi Poshak",
  url: siteUrl,
  logo: `${siteUrl}/logo%20without%20bg.png`,
  image: `${siteUrl}/hero_bg.webp`,
  description:
    "Rajwadi specializes in authentic handcrafted Rajputi Poshaks for weddings, festivals and royal occasions. Modern Royal Heritage Luxury.",
  priceRange: "₹₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="bg-royal-ivory text-charcoal font-sans antialiased selection:bg-heritage-maroon selection:text-royal-ivory min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
