import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/products", "/api/products*"],
      disallow: [
        "/admin",
        "/admin/*",
        "/api/*",
        "/checkout",
        "/checkout/*",
        "/order",
        "/order/*",
        "/order-confirmation",
        "/order-confirmation/*",
        "/account",
        "/account/*",
        "/bag",
        "/cart",
        "/wishlist",
        "/wishlist/*",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
