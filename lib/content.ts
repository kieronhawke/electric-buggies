import "server-only";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { site as seedSite } from "./site";
import { models as seedModels, modelBySlug as seedModelBySlug, modelCategories, type Model, type ModelCategory } from "./data/models";
import { sectors as seedSectors, sectorBySlug as seedSectorBySlug, type Sector } from "./data/sectors";
import { faqs as seedFaqs, type Faq } from "./data/faqs";

/**
 * Content-access layer. Reads from Sanity (ISR) and MERGES over the seed so:
 *  - editable fields (title, copy, price, specs, highlights, image) flow to the
 *    site the moment they're edited in /studio;
 *  - visual/derived fields (categoryLabel, plate colour, sector problem/faqs)
 *    and anything not yet edited fall back to seed — nothing renders blank/broken.
 * When Sanity isn't configured (or a fetch fails) it returns pure seed content.
 */
const REVALIDATE = 60; // ISR window

async function fetchCms<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: REVALIDATE } });
  } catch (err) {
    console.error("Sanity fetch failed → seed fallback:", err);
    return null;
  }
}

const labelFor = (cat: ModelCategory) => modelCategories.find((c) => c.value === cat)?.label ?? "Model";

// ── Models ────────────────────────────────────────────────────────────────
const modelsCmsQuery = groq`*[_type=="model"]{ "slug":slug.current, name, category, tagline, summary, highlights, basePrice, specs, "image":baseImage.asset->url, "recommendedSectors":recommendedSectors[]->slug.current }`;

type CmsModel = Partial<Model> & { slug: string };

function mergeModel(cms: CmsModel): Model {
  const seed = seedModelBySlug(cms.slug);
  const base: Model = seed ?? {
    slug: cms.slug, name: cms.name ?? cms.slug, category: (cms.category as ModelCategory) ?? "4-seater",
    categoryLabel: labelFor((cms.category as ModelCategory) ?? "4-seater"), tagline: "", summary: "", body: [],
    specs: { seats: "", range: "", battery: "", topSpeed: "", dimensions: "", charge: "" }, basePrice: 0,
    plate: "#5b6066", image: null, highlights: [], recommendedSectors: [],
  };
  return {
    ...base,
    name: cms.name ?? base.name,
    category: (cms.category as ModelCategory) ?? base.category,
    categoryLabel: cms.category ? labelFor(cms.category as ModelCategory) : base.categoryLabel,
    tagline: cms.tagline ?? base.tagline,
    summary: cms.summary ?? base.summary,
    basePrice: typeof cms.basePrice === "number" ? cms.basePrice : base.basePrice,
    specs: cms.specs ? { ...base.specs, ...cms.specs } : base.specs,
    highlights: cms.highlights?.length ? cms.highlights : base.highlights,
    image: cms.image ?? base.image,
    recommendedSectors: cms.recommendedSectors?.length ? cms.recommendedSectors : base.recommendedSectors,
  };
}

export async function getModels(): Promise<Model[]> {
  const cms = await fetchCms<CmsModel[]>(modelsCmsQuery);
  if (!cms || cms.length === 0) return seedModels;
  const merged = cms.map(mergeModel);
  // Preserve seed ordering; append any CMS-only models.
  const order = seedModels.map((m) => m.slug);
  return merged.sort((a, b) => {
    const ia = order.indexOf(a.slug), ib = order.indexOf(b.slug);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}

export async function getModel(slug: string): Promise<Model | null> {
  const cms = await fetchCms<CmsModel | null>(groq`${modelsCmsQuery}[slug==$slug][0]`, { slug });
  if (!cms) return seedModelBySlug(slug) ?? null;
  return mergeModel(cms);
}

// ── Sectors ─────────────────────────────────────────────────────────────────
const sectorsCmsQuery = groq`*[_type=="sector"]{ "slug":slug.current, name, tagline, intro, sections, useCases, "recommendedModels":recommendedModels[]->slug.current }`;

function mergeSector(cms: Partial<Sector> & { slug: string }): Sector | null {
  const seed = seedSectorBySlug(cms.slug);
  if (!seed) return null; // sector-only docs need seed scaffolding (problem/faqs)
  return {
    ...seed,
    name: cms.name ?? seed.name,
    tagline: cms.tagline ?? seed.tagline,
    intro: cms.intro ?? seed.intro,
    sections: cms.sections?.length ? cms.sections : seed.sections,
    useCases: cms.useCases?.length ? cms.useCases : seed.useCases,
    recommendedModels: cms.recommendedModels?.length ? cms.recommendedModels : seed.recommendedModels,
  };
}

export async function getSectors(): Promise<Sector[]> {
  const cms = await fetchCms<(Partial<Sector> & { slug: string })[]>(sectorsCmsQuery);
  if (!cms || cms.length === 0) return seedSectors;
  const order = seedSectors.map((s) => s.slug);
  return cms.map(mergeSector).filter((s): s is Sector => s !== null)
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
}

export async function getSector(slug: string): Promise<Sector | null> {
  const cms = await fetchCms<(Partial<Sector> & { slug: string }) | null>(groq`${sectorsCmsQuery}[slug==$slug][0]`, { slug });
  if (!cms) return seedSectorBySlug(slug) ?? null;
  return mergeSector(cms) ?? seedSectorBySlug(slug) ?? null;
}

// ── Site settings + FAQs ─────────────────────────────────────────────────────
export async function getSiteSettings() {
  const cms = await fetchCms<Record<string, unknown> | null>(groq`*[_type=="siteSettings"][0]`);
  return {
    name: (cms?.siteName as string) || seedSite.name,
    strapline: (cms?.strapline as string) || seedSite.strapline,
    warrantyTerm: (cms?.warrantyTerm as string) || seedSite.warrantyTerm,
    email: (cms?.email as string) || seedSite.contact.email,
    phone: (cms?.phone as string) || seedSite.contact.phone,
  };
}

export async function getFaqs(): Promise<Faq[]> {
  const cms = await fetchCms<Faq[]>(groq`*[_type=="faq"]|order(sortOrder asc){question,answer,category}`);
  return cms && cms.length > 0 ? cms : seedFaqs;
}
