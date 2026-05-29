"use client";
import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  plugins: [twoFactorClient()],
});

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword } = authClient;
