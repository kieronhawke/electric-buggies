import { defineType, defineField, defineArrayMember } from "sanity";

/** homepage (singleton) — ordered sections (brief §7). */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroHeadline", title: "Hero headline", type: "string" }),
    defineField({ name: "heroSubhead", title: "Hero sub-headline", type: "text", rows: 2 }),
    defineField({ name: "heroImage", title: "Hero image", type: "image", options: { hotspot: true } }),
    defineField({ name: "positioning", title: "Positioning statement", type: "text", rows: 3 }),
    defineField({
      name: "stats", title: "Difference stats", type: "array",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "value", type: "string" }),
        defineField({ name: "label", type: "string" }),
      ] })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});

/** siteSettings (singleton) — logo, nav, footer, contact, warranty (brief §7). */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({ name: "siteName", title: "Site name", type: "string", group: "general" }),
    defineField({ name: "strapline", title: "Strapline", type: "string", group: "general" }),
    defineField({ name: "logo", title: "Logo", type: "image", group: "general" }),
    defineField({ name: "warrantyTerm", title: "Warranty term", type: "string", description: "e.g. 3-year", group: "general" }),
    defineField({ name: "pricingVisible", title: "Show vehicle pricing", type: "boolean", initialValue: false, description: "OFF hides all From-£X vehicle prices across the site. Turn ON to reveal indicative prices everywhere.", group: "general" }),
    defineField({ name: "email", title: "Contact email", type: "string", group: "contact" }),
    defineField({ name: "phone", title: "Contact phone", type: "string", group: "contact" }),
    defineField({ name: "addressLocality", title: "Town / city", type: "string", group: "contact" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url", group: "contact" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url", group: "contact" }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
