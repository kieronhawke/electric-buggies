import { models, modelBySlug } from "./data/models";

/** Resolve a vehicle photo from a model slug (with a safe fallback). */
export function vehicleImage(slug?: string | null): string {
  return (slug && modelBySlug(slug)?.image) || "/img/vehicles/four.webp";
}

/** Resolve a vehicle photo from a model display name (fleet vehicles store the name). */
export function vehicleImageByName(name?: string | null): string {
  const m = name ? models.find((x) => x.name === name) : null;
  return m?.image || "/img/vehicles/four.webp";
}
