import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_URL;

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
          "/privacy-policy",
          "/shipping-policy",
          "/terms-and-conditions",
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
