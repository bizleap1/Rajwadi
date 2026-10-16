import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_URL;

  const publicRoutes = {
    allow: [
      "/",
      "/collection",
      "/collection/*",
      "/product/*",
      "/blog",
      "/blog/*",
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
      "/order*",
      "/account",
      "/account/*",
      "/bag",
      "/cart",
      "/wishlist",
      "/wishlist/*",
    ],
  };

  return {
    rules: [
      { userAgent: "Googlebot", ...publicRoutes },
      { userAgent: "Bingbot", ...publicRoutes },
      { userAgent: "*", ...publicRoutes },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
