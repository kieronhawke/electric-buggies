import { defineType, defineField, defineArrayMember } from "sanity";

const seoField = defineField({ name: "seo", title: "SEO", type: "seo" });

/** model — the core product document (brief §7). */
export const model = defineType({
  name: "model",
  title: "Model",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "specs", title: "Specs & price" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, group: "content", validation: (r) => r.required() }),
    defineField({
      name: "category", title: "Category", type: "string", group: "content",
      options: { list: ["2-seater", "4-seater", "6-seater", "8-seater", "utility", "bespoke"] },
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "content" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 2, group: "content" }),
    defineField({ name: "body", title: "Body", type: "array", of: [defineArrayMember({ type: "block" })], group: "content" }),
    defineField({ name: "highlights", title: "Highlights (chips)", type: "array", of: [defineArrayMember({ type: "string" })], group: "content" }),
    defineField({ name: "specs", title: "Specifications", type: "spec", group: "specs" }),
    defineField({ name: "basePrice", title: "Base price (£)", type: "number", group: "specs" }),
    defineField({ name: "baseImage", title: "Base image (for recolour preview)", type: "image", options: { hotspot: true }, group: "media" }),
    defineField({ name: "bodyMask", title: "Body mask (PNG alpha)", type: "image", description: "Per-model bodywork mask for the canvas recolour preview (brief §6).", group: "media" }),
    defineField({ name: "gallery", title: "Gallery", type: "array", of: [defineArrayMember({ type: "galleryImage" })], group: "media" }),
    defineField({ name: "recommendedSectors", title: "Recommended sectors", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "sector" }] })], group: "content" }),
    seoField,
  ],
  preview: { select: { title: "name", subtitle: "category", media: "baseImage" } },
});

/** sector — key SEO landing content (brief §7). */
export const sector = defineType({
  name: "sector",
  title: "Sector",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "hero", title: "Hero image", type: "image", options: { hotspot: true } }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "sections", title: "Sections", type: "array",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
      ] })],
    }),
    defineField({ name: "useCases", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "recommendedModels", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "model" }] })] }),
    seoField,
  ],
});

/** landingPage — keyword-led SEO pages (brief §7). */
export const landingPage = defineType({
  name: "landingPage",
  title: "Landing page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "sections", type: "array",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
      ] }), defineArrayMember({ type: "image" })],
    }),
    defineField({ name: "recommendedModels", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "model" }] })] }),
    seoField,
  ],
});

/** page — flexible content pages: about/ownership/bespoke/legal (brief §7). */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "sections", type: "array",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "body", type: "array", of: [defineArrayMember({ type: "block" })] }),
      ] }), defineArrayMember({ type: "image" })],
    }),
    seoField,
  ],
});

/** faq — ownership questions (brief §7). */
export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "sortOrder", type: "number", initialValue: 0 }),
  ],
});

/** quoteRequest — optional storage of submissions (brief §7). */
export const quoteRequest = defineType({
  name: "quoteRequest",
  title: "Quote request",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "type", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "fleetSize", type: "string" }),
    defineField({ name: "sector", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({ name: "build", title: "Config snapshot", type: "string" }),
    defineField({ name: "createdAt", type: "datetime" }),
  ],
  preview: { select: { title: "name", subtitle: "type" } },
});
