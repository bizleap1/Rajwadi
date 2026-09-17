import type { Metadata } from "next";
import "./globals.css";

import Providers from "@/components/Providers";

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
    <html lang="en">
      <body className="bg-royal-ivory text-charcoal font-sans antialiased selection:bg-heritage-maroon selection:text-royal-ivory min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
