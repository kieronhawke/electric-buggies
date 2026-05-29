import { defineType, defineField, defineArrayMember } from "sanity";

/** category — blog category (brief §C). */
export const category = defineType({
  name: "category",
  title: "Blog category",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "name" } },
});

/** post — Journal article, Portable Text body (brief §C). */
export const post = defineType({
  name: "post",
  title: "Journal post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Meta" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, group: "content", validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "content" }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true }, group: "content" }),
    defineField({
      name: "body", title: "Body", type: "array", group: "content",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }),
        defineArrayMember({ type: "object", name: "callout", title: "Callout", fields: [defineField({ name: "text", type: "text", rows: 2 })] }),
      ],
    }),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }], group: "meta" }),
    defineField({ name: "author", type: "string", group: "meta", initialValue: "The Electric Buggies Team" }),
    defineField({ name: "date", title: "Publish date", type: "datetime", group: "meta" }),
    defineField({ name: "readingTime", title: "Reading time (min)", type: "number", group: "meta" }),
    defineField({ name: "related", title: "Related posts", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "post" }] })], group: "meta" }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "author", media: "coverImage" } },
});
