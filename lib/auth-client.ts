"use client";
import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

// No baseURL: the client calls /api/auth on the current origin, so it works in
// dev and prod alike and stays within the same-origin CSP.
export const authClient = createAuthClient({
  plugins: [twoFactorClient()],
});

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword } = authClient;
