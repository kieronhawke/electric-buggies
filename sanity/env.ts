/**
 * Sanity environment. Reads NEXT_PUBLIC_* (Next.js app + embedded Studio) and
 * falls back to SANITY_STUDIO_* (the hosted `sanity deploy` / Vite build, which
 * only exposes the SANITY_STUDIO_ prefix). Placeholder keeps builds green before
 * the project is configured (site then serves seed content via lib/content.ts).
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  "placeholder";

/** True only when a real Sanity project has been configured. */
export const isSanityConfigured = projectId !== "placeholder";
