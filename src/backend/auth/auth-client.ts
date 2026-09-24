"use client";

import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL;
  return appUrl ? appUrl.replace(/\/+$/, "") : "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

