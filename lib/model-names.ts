/**
 * SINGLE SOURCE OF TRUTH for model display names (the rename token).
 *
 * Renaming any model is a one-line edit here that flows to the marketing site,
 * range, configurator and new quotes/orders, because they all read the model's
 * `name` (which is set from this map in lib/data/models.ts). The portal, emails
 * and DB store the name as a snapshot at order time, so historical records keep
 * the name they were created with, which is correct.
 *
 * Names are PROVISIONAL, pending owner sign-off and a trademark check. When the
 * final names are confirmed, change only the values below.
 *
 * Proposed premium name themes for the owner to choose from (see AUDIT-REPORT):
 *   - British rivers: The Wye, The Avon, The Severn, The Thames, The Tamar
 *   - British peaks:  The Scafell, The Snowdon, The Ben (Nevis), The Cairn
 *   - Estate/heritage: The Warden, The Ranger, The Steward, The Marque
 */
export const MODEL_NAMES = {
  "the-two": "The Two",
  "the-four": "The Four",
  "the-six": "The Six",
  "the-eight": "The Eight",
  "the-utility": "The Utility",
  bespoke: "Bespoke build",
} as const;

export type ModelSlug = keyof typeof MODEL_NAMES;

/** Resolve a model display name from its slug (falls back to the slug). */
export const modelName = (slug: string): string =>
  (MODEL_NAMES as Record<string, string>)[slug] ?? slug;
