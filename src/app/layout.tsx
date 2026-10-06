import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

function getSiteUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");

  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  return "https://www.rajwadirajputiposhak.com";
}

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rajwadi Rajputi Poshak | Authentic Royal Rajputi Poshaks & Bridal Wear",
    template: "%s | Rajwadi",
  },
  description:
    "Rajwadi Rajputi Poshak — Handcrafted Authentic Royal Rajputi Poshaks, Bridal Lehengas, Pure Georgette Ensembles, and Heirloom Gota Patti & Zardozi Couture. Worldwide Delivery.",
  keywords: [
    "Rajwadi Poshak",
    "Rajwadi Poshakh",
    "Rajwadi Rajputi Poshak",
    "Rajwadi Poshak Nagpur",
    "Rajputi Poshak",
    "Royal Rajputi Poshak",
    "Bridal Rajputi Poshak",
    "Pure Georgette Poshak",
    "Zari Zardozi Poshak",
    "Rajasthani Traditional Dress",
    "Kundan Work Poshak",
    "Rajwadi",
    "Heirloom Rajputi Couture",
    "Gota Patti Poshak",
    "Custom Tailored Rajputi Poshak",
    "Rajputi Poshak Online Shopping",
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Rajwadi Rajputi Poshak",
    title: "Rajwadi Rajputi Poshak | Authentic Royal Rajputi Poshaks & Bridal Wear",
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
    title: "Rajwadi Rajputi Poshak | Authentic Royal Rajputi Poshaks & Bridal Wear",
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
  alternateName: [
    "Rajwadi Rajputi Poshak",
    "Rajwadi Poshak",
    "Rajwadi Poshakh",
    "Rajwadi Poshak Nagpur",
  ],
  url: siteUrl,
  logo: `${siteUrl}/logo%20without%20bg.png`,
  image: `${siteUrl}/hero_bg.webp`,
  description:
    "Rajwadi specializes in authentic handcrafted Rajputi Poshaks for weddings, festivals and royal occasions. Modern Royal Heritage Luxury.",
  priceRange: "₹₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking",
  sameAs: [
    "https://www.instagram.com/rajwadirajputiposhak/",
    "https://www.facebook.com/p/Rajwadi-Rajputi-Poshak-100075751886924/",
    "https://wa.me/918766667101",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "EWS 41, near Maheshwari Bhawan, Hiwari Layout, Uday Nagar, Padole Nagar",
    addressLocality: "Nagpur",
    addressRegion: "Maharashtra",
    postalCode: "440008",
    addressCountry: "IN",
  },
  telephone: "+91 8766667101",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rajwadi Rajputi Poshak",
  alternateName: ["Rajwadi", "Rajwadi Poshak", "Rajwadi Poshakh"],
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/collection?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="bg-royal-ivory text-charcoal font-sans antialiased selection:bg-heritage-maroon selection:text-royal-ivory min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
