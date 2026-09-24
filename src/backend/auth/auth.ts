import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";
import prisma from "../db/prisma";
import { sendOtpEmail } from "../services/email";

const cleanUrl = (url?: string) => (url ? url.trim().replace(/\/+$/, "") : undefined);

const appUrl = cleanUrl(process.env.NEXT_PUBLIC_APP_URL);
const authUrl = cleanUrl(process.env.BETTER_AUTH_URL);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "fallback_rajwadi_auth_secret_minimum_32_chars_long_123456789",
  baseURL: authUrl || appUrl || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://rajwadi-snowy.vercel.app",
    "https://rajwadi-snowy.vercel.app/",
    ...(appUrl ? [appUrl, `${appUrl}/`] : []),
    ...(authUrl ? [authUrl, `${authUrl}/`] : []),
  ],
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
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendOtpEmail({ email, otp, type });
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
    }),
  ],
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
