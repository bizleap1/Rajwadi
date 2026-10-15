import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const host = req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto");

  // 1. Single-hop 301 Canonical redirect: non-www to www and http to https
  if (
    host === "rajwadirajputiposhak.com" ||
    (proto === "http" && !host.includes("localhost") && !host.includes("127.0.0.1"))
  ) {
    const targetUrl = new URL(req.url);
    targetUrl.protocol = "https:";
    targetUrl.host = "www.rajwadirajputiposhak.com";
    return NextResponse.redirect(targetUrl, 301);
  }

  // 2. 301-redirect legacy GSC paths: /craft -> /our-heritage, /terms -> /terms-and-conditions
  if (pathname === "/craft") {
    return NextResponse.redirect(new URL("/our-heritage", req.url), 301);
  }
  if (pathname === "/terms") {
    return NextResponse.redirect(new URL("/terms-and-conditions", req.url), 301);
  }

  // 3. 301-redirect /collection?category=* and /collection?type=* to clean routes
  if (pathname === "/collection") {
    const category = searchParams.get("category")?.toLowerCase();
    const type = searchParams.get("type")?.toLowerCase();
    const sub = (searchParams.get("sub") || searchParams.get("subcategory"))?.toLowerCase();
    const targetCategory = category || sub;

    if (targetCategory) {
      if (
        targetCategory === "bridal" ||
        targetCategory === "heavy" ||
        targetCategory.includes("heavy-poshak")
      ) {
        return NextResponse.redirect(
          new URL("/collection/bridal-rajputi-poshak", req.url),
          301
        );
      }
      if (targetCategory === "festive") {
        return NextResponse.redirect(
          new URL("/collection/festive-rajputi-poshak", req.url),
          301
        );
      }
      if (
        targetCategory === "classic" ||
        targetCategory.includes("classic-poshak") ||
        targetCategory === "everyday" ||
        targetCategory === "traditional"
      ) {
        return NextResponse.redirect(
          new URL("/collection/classic-rajputi-poshak", req.url),
          301
        );
      }
      if (targetCategory === "jewellery") {
        return NextResponse.redirect(
          new URL("/collection/rajputi-jewellery", req.url),
          301
        );
      }
      if (
        targetCategory === "unstitched" ||
        targetCategory === "semi-stitched" ||
        targetCategory === "poshak-material"
      ) {
        return NextResponse.redirect(
          new URL("/collection/semi-stitched-rajputi-poshak", req.url),
          301
        );
      }
      if (targetCategory === "stitched") {
        return NextResponse.redirect(
          new URL("/collection/stitched-rajputi-poshak", req.url),
          301
        );
      }
    }

    if (type) {
      if (
        type === "unstitched" ||
        type === "semi-stitched" ||
        type === "poshak-material"
      ) {
        return NextResponse.redirect(
          new URL("/collection/semi-stitched-rajputi-poshak", req.url),
          301
        );
      }
      if (type === "stitched") {
        return NextResponse.redirect(
          new URL("/collection/stitched-rajputi-poshak", req.url),
          301
        );
      }
      if (type === "jewellery") {
        return NextResponse.redirect(
          new URL("/collection/rajputi-jewellery", req.url),
          301
        );
      }
    }
  }

  // 4. Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie =
      req.cookies.get("better-auth.session_token")?.value ||
      req.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static public assets like images (.svg, .png, .jpg, .jpeg, .webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
