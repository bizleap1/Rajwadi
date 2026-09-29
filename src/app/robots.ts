import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "";
  const siteUrl =
    envUrl && !envUrl.includes("vercel.app") && !envUrl.includes("localhost")
      ? envUrl.replace(/\/$/, "")
      : "https://www.rajwadirajputiposhak.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/collection",
          "/product/*",
          "/our-heritage",
          "/contact",
          "/craft",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/checkout",
          "/checkout/*",
          "/order-confirmation",
          "/order-confirmation/*",
          "/order/*",
          "/account",
          "/account/*",
          "/bag",
          "/cart",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
