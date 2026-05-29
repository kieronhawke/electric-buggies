/**
 * Seed Sanity from the local seed content (brief §7/§8).
 *
 * Usage (after the Sanity project + write token exist):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxx SANITY_API_WRITE_TOKEN=yyy pnpm seed
 *
 * Idempotent: uses deterministic _id values and createOrReplace, so it can be
 * re-run safely. Images from the Eagle catalogue are uploaded separately by the
 * Phase 3 image pipeline (scripts/download-images.ts → seed image refs).
 */
import { createClient } from "@sanity/client";
import { models } from "../lib/data/models";
import { sectors } from "../lib/data/sectors";
import { faqs } from "../lib/data/faqs";
import { locations } from "../lib/data/locations";
import { posts, categories, type Block } from "../lib/data/blog";
import { site } from "../lib/site";
import {
  exteriorColours,
  roofs,
  wheels,
  upholstery,
  accessories,
} from "../lib/data/options";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN. " +
      "Set them and re-run: pnpm seed",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-10-01", useCdn: false });

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function run() {
  const tx = client.transaction();

  // Site settings (singleton)
  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: site.name,
    strapline: site.strapline,
    warrantyTerm: site.warrantyTerm,
    email: site.contact.email,
    phone: site.contact.phone,
    addressLocality: site.contact.address.line2,
  });

  // Homepage (singleton)
  tx.createOrReplace({
    _id: "homepage",
    _type: "homepage",
    heroEyebrow: site.strapline,
    heroHeadline: "The electric carriage, reimagined in Britain.",
    positioning:
      "We do not build golf carts. We build the quiet, electric vehicles that move guests, families and grounds teams across Britain's most considered places — and we build each one to order.",
    stats: [
      { value: "100%", label: "Electric" },
      { value: "Bespoke", label: "By default" },
      { value: site.warrantyTerm, label: "Warranty" },
      { value: "UK-wide", label: "Delivery & support" },
    ],
  });

  // Sectors
  for (const s of sectors) {
    tx.createOrReplace({
      _id: `sector-${s.slug}`,
      _type: "sector",
      name: s.name,
      slug: { _type: "slug", current: s.slug },
      tagline: s.tagline,
      intro: s.intro,
      sections: s.sections.map((sec) => ({ _type: "object", _key: slugify(sec.heading), ...sec })),
      useCases: s.useCases,
    });
  }

  // Models (reference sectors by _id)
  for (const m of models) {
    tx.createOrReplace({
      _id: `model-${m.slug}`,
      _type: "model",
      name: m.name,
      slug: { _type: "slug", current: m.slug },
      category: m.category,
      tagline: m.tagline,
      summary: m.summary,
      highlights: m.highlights,
      basePrice: m.basePrice,
      specs: { _type: "spec", ...m.specs },
      recommendedSectors: m.recommendedSectors.map((s) => ({
        _type: "reference",
        _key: s,
        _ref: `sector-${s}`,
      })),
    });
  }

  // FAQs
  faqs.forEach((f, i) => {
    tx.createOrReplace({
      _id: `faq-${i}`,
      _type: "faq",
      question: f.question,
      answer: f.answer,
      category: f.category,
      sortOrder: i,
    });
  });

  // Configurator options
  type SeedOption = { id: string; name: string; priceDelta: number; [k: string]: unknown };
  const optionGroups: [string, SeedOption[]][] = [
    ["colour", exteriorColours.map((c) => ({ id: c.id, name: c.name, priceDelta: c.priceDelta, group: c.group, hex: c.hex, finish: c.finish }))],
    ["roof", roofs.map((r) => ({ ...r }))],
    ["wheel", wheels.map((w) => ({ ...w }))],
    ["upholstery", upholstery.map((u) => ({ ...u }))],
    ["accessory", accessories.map((a) => ({ ...a }))],
  ];
  for (const [type, items] of optionGroups) {
    items.forEach((opt, i) => {
      const { id, name, priceDelta, ...rest } = opt;
      tx.createOrReplace({
        _id: `${type}-${id}`,
        _type: type,
        label: name,
        id: { _type: "slug", current: id },
        priceDelta,
        sortOrder: i,
        ...rest,
      });
    });
  }

  // Locations
  for (const l of locations) {
    tx.createOrReplace({
      _id: `location-${l.slug}`,
      _type: "location",
      name: l.name,
      slug: { _type: "slug", current: l.slug },
      region: l.region,
      tagline: l.tagline,
      intro: l.intro,
      sections: l.sections.map((s) => ({ _type: "object", _key: slugify(s.heading), ...s })),
      useCases: l.useCases,
      delivery: l.delivery,
      currencyNote: l.currencyNote,
      recommendedModels: l.recommendedModels.map((s) => ({ _type: "reference", _key: s, _ref: `model-${s}` })),
      relatedSectors: l.relatedSectors.map((s) => ({ _type: "reference", _key: s, _ref: `sector-${s}` })),
      faqs: l.faqs.map((f, i) => ({ _type: "object", _key: `faq${i}`, q: f.q, a: f.a })),
    });
  }

  // Blog categories
  for (const c of categories) {
    tx.createOrReplace({ _id: `category-${c.slug}`, _type: "category", name: c.name, slug: { _type: "slug", current: c.slug } });
  }

  // Portable Text conversion for post bodies
  const toPT = (body: Block[]) =>
    body.flatMap((b, i) => {
      const key = `b${i}`;
      if (b.type === "list") {
        return b.items.map((it, j) => ({ _type: "block", _key: `${key}-${j}`, listItem: "bullet", style: "normal", children: [{ _type: "span", _key: `${key}-${j}s`, text: it }] }));
      }
      const style = b.type === "h2" ? "h2" : b.type === "quote" ? "blockquote" : "normal";
      return [{ _type: "block", _key: key, style, children: [{ _type: "span", _key: `${key}s`, text: b.text }] }];
    });

  // Journal posts
  for (const p of posts) {
    tx.createOrReplace({
      _id: `post-${p.slug}`,
      _type: "post",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      excerpt: p.excerpt,
      author: p.author,
      date: new Date(p.date).toISOString(),
      readingTime: p.readingTime,
      category: { _type: "reference", _ref: `category-${p.categorySlug}` },
      body: toPT(p.body),
      related: p.related.map((s) => ({ _type: "reference", _key: s, _ref: `post-${s}` })),
    });
  }

  console.log("Committing seed transaction…");
  await tx.commit();
  console.log("✓ Seed complete:", {
    models: models.length,
    sectors: sectors.length,
    faqs: faqs.length,
    options: exteriorColours.length + roofs.length + wheels.length + upholstery.length + accessories.length,
    locations: locations.length,
    posts: posts.length,
    categories: categories.length,
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
