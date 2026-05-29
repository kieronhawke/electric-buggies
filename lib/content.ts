import "server-only";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  siteSettingsQuery,
  modelsQuery,
  modelBySlugQuery,
  sectorsQuery,
  sectorBySlugQuery,
  faqsQuery,
} from "@/sanity/queries";

// Seed fallbacks — the site is never empty (brief §7) and main is always
// deployable even before Sanity is connected.
import { site as seedSite } from "./site";
import { models as seedModels, modelBySlug as seedModelBySlug } from "./data/models";
import { sectors as seedSectors, sectorBySlug as seedSectorBySlug } from "./data/sectors";
import { faqs as seedFaqs } from "./data/faqs";

/**
 * Content-access layer. When a real Sanity project is configured it fetches via
 * GROQ (with ISR); otherwise it returns the seed content. This is the single
 * switchover point for Phase 2 — pages call these, not the raw seed.
 *
 * ISR: 60s revalidate keeps SEO + speed while letting CMS edits propagate.
 */
const REVALIDATE = 60;

async function fetchOr<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!isSanityConfigured) return fallback;
  try {
    const data = await client.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE },
    });
    // If the dataset is empty, prefer the seed so nothing renders blank.
    if (data == null || (Array.isArray(data) && data.length === 0)) return fallback;
    return data;
  } catch (err) {
    console.error("Sanity fetch failed, using seed fallback:", err);
    return fallback;
  }
}

export async function getSiteSettings() {
  const cms = await fetchOr<Record<string, unknown> | null>(siteSettingsQuery, {}, null);
  // Merge CMS values over the seed defaults so partial edits still work.
  return {
    name: (cms?.siteName as string) || seedSite.name,
    strapline: (cms?.strapline as string) || seedSite.strapline,
    warrantyTerm: (cms?.warrantyTerm as string) || seedSite.warrantyTerm,
    email: (cms?.email as string) || seedSite.contact.email,
    phone: (cms?.phone as string) || seedSite.contact.phone,
  };
}

export async function getModels() {
  return fetchOr(modelsQuery, {}, seedModels);
}

export async function getModel(slug: string) {
  return fetchOr(modelBySlugQuery, { slug }, seedModelBySlug(slug) ?? null);
}

export async function getSectors() {
  return fetchOr(sectorsQuery, {}, seedSectors);
}

export async function getSector(slug: string) {
  return fetchOr(sectorBySlugQuery, { slug }, seedSectorBySlug(slug) ?? null);
}

export async function getFaqs() {
  return fetchOr(faqsQuery, {}, seedFaqs);
}
