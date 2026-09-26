import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rajwadirajputiposhak.com";

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
