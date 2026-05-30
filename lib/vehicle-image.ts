import { models, modelBySlug } from "./data/models";

/**
 * Transparent-PNG cutouts per model (the same assets the emails use), so a
 * vehicle renders cleanly on any background across the portal and admin. Falls
 * back to the model's catalogue photo, then a safe default.
 */
const SLUG_TO_PNG: Record<string, string> = {
  "the-two": "/img/email/two.png",
  "the-four": "/img/email/four.png",
  "the-six": "/img/email/six.png",
  "the-eight": "/img/email/eight.png",
  "the-utility": "/img/email/utility.png",
  bespoke: "/img/email/bespoke.png",
};

const NAME_TO_SLUG: Record<string, string> = {
  "The Two": "the-two", "The Four": "the-four", "The Six": "the-six",
  "The Eight": "the-eight", "The Utility": "the-utility", "Bespoke build": "bespoke",
};

/** Resolve a transparent vehicle image from a model slug (with safe fallbacks). */
export function vehicleImage(slug?: string | null): string {
  return (slug && SLUG_TO_PNG[slug]) || (slug && modelBySlug(slug)?.image) || "/img/email/four.png";
}

/** Resolve a transparent vehicle image from a model display name (fleet stores the name). */
export function vehicleImageByName(name?: string | null): string {
  const slug = name ? NAME_TO_SLUG[name] : null;
  if (slug && SLUG_TO_PNG[slug]) return SLUG_TO_PNG[slug];
  const m = name ? models.find((x) => x.name === name) : null;
  return m?.image || "/img/email/four.png";
}
