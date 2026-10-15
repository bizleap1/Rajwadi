import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { SITE_URL } from "@/lib/siteUrl";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = SITE_URL;

const defaultTitle = "Authentic Rajputi Poshak – Bridal, Festive & Semi-Stitched | Nagpur";
const defaultDescription =
  "Rajwadi Rajputi Poshak — Handcrafted Authentic Royal Rajputi Poshaks, Bridal Lehengas, Pure Georgette Ensembles, and Heirloom Gota Patti & Zardozi Couture. Worldwide Delivery.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Rajwadi Rajputi Poshak",
  },
  description: defaultDescription,
  authors: [{ name: "Rajwadi Rajputi Poshak", url: siteUrl }],
  creator: "Rajwadi Rajputi Poshak",
  publisher: "Rajwadi Rajputi Poshak",
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
    title: defaultTitle,
    description: defaultDescription,
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
    title: defaultTitle,
    description: defaultDescription,
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
  name: "Rajwadi Rajputi Poshak",
  legalName: "Rajwadi Rajputi Poshak",
  alternateName: [
    "Rajwadi",
    "Rajwadi Poshak",
    "Rajwadi Poshakh",
    "Rajwadi Nagpur",
    "Rajwadi Rajputi Poshak Nagpur",
  ],
  url: siteUrl,
  logo: `${siteUrl}/logo-without-bg.png`,
  image: `${siteUrl}/hero_bg.webp`,
  description:
    "Rajwadi Rajputi Poshak specializes in authentic handcrafted Rajasthani Rajputi Poshaks, bridal lehengas, pure georgette ensembles, and royal jewellery in Nagpur, Maharashtra.",
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
  geo: {
    "@type": "GeoCoordinates",
    latitude: "21.1307",
    longitude: "79.1176",
  },
  telephone: "+91 8766667101",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "11:00",
      closes: "20:00",
      description: "Monday to Saturday 11:00 AM to 8:00 PM IST. Walk-ins and private bridal appointments welcomed.",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "25",
    bestRating: "5",
    worstRating: "1",
  },
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "IN",
    returnPolicyCountry: "IN",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
    customerRemorseReturnFees: "https://schema.org/FreeReturn",
    url: `${siteUrl}/terms-and-conditions`,
    description: "Free exchanges or returns accepted within 7 days of delivery for defective, incorrect, or size-related requests.",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rajwadi Rajputi Poshak",
  alternateName: ["Rajwadi", "Rajwadi Poshak", "Rajwadi Rajputi Poshak Nagpur"],
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
      <body className={`${cormorant.variable} ${inter.variable} bg-royal-ivory text-charcoal font-sans antialiased selection:bg-heritage-maroon selection:text-royal-ivory min-h-screen flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
