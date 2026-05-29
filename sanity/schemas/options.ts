import { defineType, defineField } from "sanity";

/** Shared fields for a configurator option (brief §7). */
const optionFields = [
  defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
  defineField({ name: "id", title: "Option ID", type: "slug", options: { source: "label" }, validation: (r) => r.required() }),
  defineField({ name: "priceDelta", title: "Price delta (£)", type: "number", initialValue: 0 }),
  defineField({ name: "sortOrder", title: "Sort order", type: "number", initialValue: 0 }),
  defineField({ name: "image", title: "Overlay / swatch image", type: "image" }),
];

export const colour = defineType({
  name: "colour",
  title: "Exterior colour",
  type: "document",
  fields: [
    ...optionFields.slice(0, 2),
    defineField({ name: "group", title: "Colour group (poetic name)", type: "string", description: "e.g. The Heritage Collection" }),
    defineField({ name: "hex", title: "Hex value", type: "string", description: "Drives the live recolour preview", validation: (r) => r.regex(/^#([0-9a-fA-F]{6})$/, { name: "hex" }) }),
    defineField({ name: "finish", title: "Finish", type: "string", options: { list: ["Solid", "Metallic", "Satin"] } }),
    ...optionFields.slice(2),
  ],
  orderings: [{ name: "sort", title: "Sort order", by: [{ field: "sortOrder", direction: "asc" }] }],
});

export const roof = defineType({
  name: "roof",
  title: "Roof / canopy",
  type: "document",
  fields: [...optionFields, defineField({ name: "description", type: "string" })],
});

export const wheel = defineType({
  name: "wheel",
  title: "Wheel set",
  type: "document",
  fields: [...optionFields, defineField({ name: "description", type: "string" })],
});

export const upholsteryType = defineType({
  name: "upholstery",
  title: "Upholstery",
  type: "document",
  fields: [...optionFields, defineField({ name: "description", type: "string" })],
});

export const accessory = defineType({
  name: "accessory",
  title: "Accessory",
  type: "document",
  fields: [...optionFields, defineField({ name: "description", type: "string" })],
});
