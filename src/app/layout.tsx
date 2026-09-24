import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rajwadi | Authentic Royal Rajputi Poshaks",
  description:
    "Rajwadi specializes in authentic Rajputi Poshaks for weddings, festivals and royal occasions. Modern Royal Heritage Luxury.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-royal-ivory text-charcoal font-sans antialiased selection:bg-heritage-maroon selection:text-royal-ivory min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
