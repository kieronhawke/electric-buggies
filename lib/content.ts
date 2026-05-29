import "server-only";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { site as seedSite } from "./site";
import { models as seedModels, modelBySlug as seedModelBySlug, modelCategories, type Model, type ModelCategory } from "./data/models";
import { sectors as seedSectors, sectorBySlug as seedSectorBySlug, type Sector } from "./data/sectors";
import { faqs as seedFaqs, type Faq } from "./data/faqs";
import { locations as seedLocations, locationBySlug as seedLocationBySlug, type Location } from "./data/locations";
import { posts as seedPosts, postBySlug as seedPostBySlug, categories as seedCategories, type Post } from "./data/blog";

/**
 * Content-access layer. Reads from Sanity (ISR) and MERGES over the seed so:
 *  - editable fields (title, copy, price, specs, highlights, image) flow to the
 *    site the moment they're edited in /studio;
 *  - visual/derived fields (categoryLabel, plate colour, sector problem/faqs)
 *    and anything not yet edited fall back to seed, nothing renders blank/broken.
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

// ── Locations ────────────────────────────────────────────────────────────────
const locationsCmsQuery = groq`*[_type=="location"]{ "slug":slug.current, name, region, tagline, intro, sections, useCases, delivery, currencyNote, "hero":hero.asset->url, "recommendedModels":recommendedModels[]->slug.current, "relatedSectors":relatedSectors[]->slug.current, faqs }`;

function mergeLocation(cms: Partial<Location> & { slug: string }): Location | null {
  const seed = seedLocationBySlug(cms.slug);
  if (!seed) return null;
  return {
    ...seed,
    name: cms.name ?? seed.name,
    region: cms.region ?? seed.region,
    tagline: cms.tagline ?? seed.tagline,
    hero: cms.hero ?? seed.hero ?? null,
    intro: cms.intro ?? seed.intro,
    sections: cms.sections?.length ? cms.sections : seed.sections,
    useCases: cms.useCases?.length ? cms.useCases : seed.useCases,
    delivery: cms.delivery ?? seed.delivery,
    currencyNote: cms.currencyNote ?? seed.currencyNote,
    recommendedModels: cms.recommendedModels?.length ? cms.recommendedModels : seed.recommendedModels,
    relatedSectors: cms.relatedSectors?.length ? cms.relatedSectors : seed.relatedSectors,
    faqs: cms.faqs?.length ? cms.faqs : seed.faqs,
  };
}

export async function getLocations(): Promise<Location[]> {
  // Seed-based union: every seed location shows (so newly-added ones appear
  // without re-seeding Sanity), with any matching Sanity doc overlaid.
  const cms = await fetchCms<(Partial<Location> & { slug: string })[]>(locationsCmsQuery);
  const byId = new Map((cms ?? []).map((c) => [c.slug, c]));
  return seedLocations.map((seed) => {
    const c = byId.get(seed.slug);
    return c ? (mergeLocation(c) ?? seed) : seed;
  });
}

export async function getLocation(slug: string): Promise<Location | null> {
  const cms = await fetchCms<(Partial<Location> & { slug: string }) | null>(groq`${locationsCmsQuery}[slug==$slug][0]`, { slug });
  if (!cms) return seedLocationBySlug(slug) ?? null;
  return mergeLocation(cms) ?? seedLocationBySlug(slug) ?? null;
}

// ── Journal ──────────────────────────────────────────────────────────────────
/** Post with optional Portable Text body + resolved cover image. */
export type ContentPost = Omit<Post, "body"> & { body: Post["body"] | unknown[]; image?: string | null };

const postsListQuery = groq`*[_type=="post"]|order(date desc){ "slug":slug.current, title, excerpt, readingTime, author, date, "category":category->name, "categorySlug":category->slug.current, "image":coverImage.asset->url }`;

export async function getPosts(): Promise<ContentPost[]> {
  // Seed-based union (newest first): all seed posts + any CMS posts, CMS wins
  // on overlap. Lets newly-added seed posts appear without re-seeding Sanity.
  const cms = await fetchCms<ContentPost[]>(postsListQuery);
  const bySlug = new Map<string, ContentPost>(seedPosts.map((p) => [p.slug, p as ContentPost]));
  for (const c of cms ?? []) bySlug.set(c.slug, { ...bySlug.get(c.slug), ...c });
  return [...bySlug.values()].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPost(slug: string): Promise<ContentPost | null> {
  const cms = await fetchCms<ContentPost | null>(
    groq`*[_type=="post" && slug.current==$slug][0]{ "slug":slug.current, title, excerpt, readingTime, author, date, "category":category->name, "categorySlug":category->slug.current, "image":coverImage.asset->url, body, "related":related[]->slug.current }`,
    { slug },
  );
  if (!cms) return seedPostBySlug(slug) ?? null;
  // If CMS body is empty (not yet authored), fall back to the seed body/related.
  const seed = seedPostBySlug(slug);
  if ((!cms.body || (Array.isArray(cms.body) && cms.body.length === 0)) && seed) {
    return { ...cms, body: seed.body, related: cms.related?.length ? cms.related : seed.related };
  }
  return cms;
}

// ── Configurator options ─────────────────────────────────────────────────────
import {
  exteriorColours as seedColours, roofs as seedRoofs, wheels as seedWheels,
  upholstery as seedUpholstery, accessories as seedAccessories,
} from "./data/options";

/** Merge a Sanity option list over the seed by `id` (preserves seed order +
 *  visual fields like hex/rim/seat that the CMS may not carry). */
function mergeOptions<T extends { id: string }>(seed: T[], cms: Partial<T>[] | null): T[] {
  if (!cms || cms.length === 0) return seed;
  const byId = new Map(cms.map((c) => [c.id, c]));
  return seed.map((s) => ({ ...s, ...(byId.get(s.id) ?? {}) }));
}

export async function getConfiguratorOptions() {
  const cms = await fetchCms<{
    colours?: Partial<typeof seedColours[number]>[];
    roofs?: Partial<typeof seedRoofs[number]>[];
    wheels?: Partial<typeof seedWheels[number]>[];
    upholstery?: Partial<typeof seedUpholstery[number]>[];
    accessories?: Partial<typeof seedAccessories[number]>[];
  }>(groq`{
    "colours": *[_type=="colour"]|order(sortOrder asc){ "id":id.current, "name":label, group, hex, finish, priceDelta },
    "roofs": *[_type=="roof"]|order(sortOrder asc){ "id":id.current, "name":label, description, priceDelta },
    "wheels": *[_type=="wheel"]|order(sortOrder asc){ "id":id.current, "name":label, description, priceDelta },
    "upholstery": *[_type=="upholstery"]|order(sortOrder asc){ "id":id.current, "name":label, description, priceDelta },
    "accessories": *[_type=="accessory"]|order(sortOrder asc){ "id":id.current, "name":label, description, priceDelta }
  }`);
  return {
    colours: mergeOptions(seedColours, cms?.colours ?? null),
    roofs: mergeOptions(seedRoofs, cms?.roofs ?? null),
    wheels: mergeOptions(seedWheels, cms?.wheels ?? null),
    upholstery: mergeOptions(seedUpholstery, cms?.upholstery ?? null),
    accessories: mergeOptions(seedAccessories, cms?.accessories ?? null),
  };
}

export async function getCategories() {
  const cms = await fetchCms<{ slug: string; name: string }[]>(groq`*[_type=="category"]{ "slug":slug.current, name }`);
  return cms && cms.length > 0 ? cms : seedCategories;
}
