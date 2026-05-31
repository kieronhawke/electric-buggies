import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { db, schema } from "./db";
import { sendEmail, emailLayout } from "./email";

const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Fail closed in production: never sign sessions with a known default secret.
if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL && !process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET must be set in production.");
}

/**
 * better-auth server instance.
 * Email + password with mandatory verification, password reset, secure
 * HTTP-only session cookies, per-IP rate limiting, 2FA-ready. Roles live on the
 * user row (customer/admin/finance/engineer); server-side authz helpers are in
 * lib/session.ts. Degrades to a disabled instance when DATABASE_URL is unset.
 */
export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET || "dev-insecure-secret-change-me",
  database: drizzleAdapter(db as NonNullable<typeof db>, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      twoFactor: schema.twoFactor,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your Electric Buggies password",
        html: emailLayout(
          "Reset your password",
          "<p>We received a request to reset your password. This link expires in 1 hour. If you did not request it, no action is needed.</p>",
          { label: "Reset password", url },
        ),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { sendTemplate, accountLinks } = await import("./emails/send");
      // "Go to my account" verifies the email, then lands the customer straight
      // in their dashboard (rather than a generic page).
      let ctaLink = url;
      try {
        const u = new URL(url);
        u.searchParams.set("callbackURL", "/account");
        ctaLink = u.toString();
      } catch { /* keep original url */ }
      await sendTemplate("welcome-next-steps", user.email, {
        firstName: user.name?.split(" ")[0] || "there",
        ...accountLinks({ ctaLink }),
      });
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "customer", input: false },
      phone: { type: "string", required: false },
      company: { type: "string", required: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
    customRules: {
      "/sign-in/email": { window: 60, max: 8 },
      "/sign-up/email": { window: 60, max: 5 },
      "/forget-password": { window: 60, max: 5 },
    },
  },
  advanced: {
    cookiePrefix: "eb",
  },
  plugins: [twoFactor(), nextCookies()],
});

export type Auth = typeof auth;
