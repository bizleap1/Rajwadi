import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";
import prisma from "../db/prisma";

const cleanUrl = (url?: string) => (url ? url.trim().replace(/\/+$/, "") : undefined);

const appUrl = cleanUrl(process.env.NEXT_PUBLIC_APP_URL);
const authUrl = cleanUrl(process.env.BETTER_AUTH_URL);
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.trim().replace(/\/+$/, "")}` : undefined;
const vercelProjectUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/+$/, "")}` : undefined;
const renderUrl = cleanUrl(process.env.RENDER_EXTERNAL_URL);

const effectiveBaseUrl = authUrl || appUrl || renderUrl || vercelProjectUrl || vercelUrl || "http://localhost:3000";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "fallback_rajwadi_auth_secret_minimum_32_chars_long_123456789",
  baseURL: effectiveBaseUrl,
  trustedOrigins: async (request?: Request) => {
    const origins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://*.vercel.app",
      "*.vercel.app",
      "https://*.onrender.com",
      "*.onrender.com",
      "https://rajwadi-snowy.vercel.app",
      ...(appUrl ? [appUrl] : []),
      ...(authUrl ? [authUrl] : []),
      ...(renderUrl ? [renderUrl] : []),
      ...(vercelUrl ? [vercelUrl] : []),
      ...(vercelProjectUrl ? [vercelProjectUrl] : []),
      ...(process.env.NEXT_PUBLIC_VERCEL_URL ? [`https://${process.env.NEXT_PUBLIC_VERCEL_URL.trim().replace(/\/+$/, "")}`] : []),
    ];

    if (request?.headers) {
      const origin = request.headers.get("origin");
      const referer = request.headers.get("referer");
      const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
      const proto = request.headers.get("x-forwarded-proto") || "https";

      if (origin && origin !== "null") {
        try {
          origins.push(new URL(origin).origin);
        } catch {
          origins.push(origin);
        }
      }
      if (referer && referer !== "null") {
        try {
          origins.push(new URL(referer).origin);
        } catch {}
      }
      if (host) {
        origins.push(`${proto}://${host}`);
      }
    }

    return Array.from(new Set(origins.filter(Boolean)));
  },
  advanced: {
    trustedProxyHeaders: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
});

/**
 * Retrieve the current authenticated session on the server.
 */
export async function getServerSession(reqHeaders?: Headers) {
  try {
    const currentHeaders = reqHeaders ?? (await headers());
    const session = await auth.api.getSession({
      headers: currentHeaders,
    });
    return session;
  } catch (error) {
    console.error("Error fetching server session:", error);
    return null;
  }
}

/**
 * Verify that the current request has an active session with an ADMIN role.
 * Throws or returns null if not an admin.
 */
export async function requireAdminSession(reqHeaders?: Headers) {
  const session = await getServerSession(reqHeaders);
  if (!session || !session.user) {
    return null;
  }

  // Strictly verify against database to prevent stale cookie role privilege escalation
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    return null;
  }

  return {
    ...session,
    user: {
      ...session.user,
      role: "ADMIN" as const,
    },
  };
}
