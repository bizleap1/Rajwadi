export function getSiteUrl(): string {
  // Strictly enforce official domain https://www.rajwadirajputiposhak.com
  // Never allow vercel.app preview or deployment URLs in sitemap or search metadata
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (
    envUrl &&
    !envUrl.includes("vercel.app") &&
    !envUrl.includes("localhost")
  ) {
    return envUrl.replace(/\/$/, "");
  }
  return "https://www.rajwadirajputiposhak.com";
}

export const SITE_URL = getSiteUrl();

