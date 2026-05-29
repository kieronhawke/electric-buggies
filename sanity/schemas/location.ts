import { defineType, defineField, defineArrayMember } from "sanity";

/** location — geo landing subsite (brief §D). */
export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, group: "content", validation: (r) => r.required() }),
    defineField({ name: "region", type: "string", group: "content" }),
    defineField({ name: "tagline", type: "string", group: "content" }),
    defineField({ name: "hero", title: "Hero image", type: "image", options: { hotspot: true }, group: "content" }),
    defineField({ name: "intro", type: "text", rows: 4, group: "content" }),
    defineField({
      name: "sections", title: "Sections", type: "array", group: "content",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
      ] })],
    }),
    defineField({ name: "useCases", title: "Use cases", type: "array", of: [defineArrayMember({ type: "string" })], group: "content" }),
    defineField({ name: "delivery", title: "Delivery & shipping note", type: "text", rows: 3, group: "content" }),
    defineField({ name: "currencyNote", type: "string", group: "content" }),
    defineField({ name: "recommendedModels", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "model" }] })], group: "content" }),
    defineField({ name: "relatedSectors", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "sector" }] })], group: "content" }),
    defineField({
      name: "faqs", title: "FAQs", type: "array", group: "content",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "q", title: "Question", type: "string" }),
        defineField({ name: "a", title: "Answer", type: "text", rows: 2 }),
      ] })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "name", subtitle: "region", media: "hero" } },
});
