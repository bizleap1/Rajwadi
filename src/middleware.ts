import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // 1. If someone accesses legacy /admin/login, redirect to storefront sign-in
  if (pathname === "/admin/login") {
    const homeUrl = new URL("/", req.url);
    homeUrl.searchParams.set("auth", "signin");
    homeUrl.searchParams.set("returnUrl", "/admin/products");
    return NextResponse.redirect(homeUrl);
  }

  // 2. Protect all /admin routes (redirect to unified sign-in modal if not logged in)
  if (pathname.startsWith("/admin")) {
    const sessionCookie =
      req.cookies.get("better-auth.session_token")?.value ||
      req.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionCookie) {
      const homeUrl = new URL("/", req.url);
      homeUrl.searchParams.set("auth", "signin");
      homeUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
