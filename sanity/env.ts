/**
 * Sanity environment (brief §13). The project ID is provided by the owner once
 * the Sanity project exists. Until then we fall back to a placeholder so the
 * build never fails and the site serves seed content (see lib/content.ts).
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Placeholder keeps Studio + client buildable before the real project exists.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";

/** True only when a real Sanity project has been configured. */
export const isSanityConfigured = projectId !== "placeholder";
