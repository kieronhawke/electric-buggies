import { defineType, defineField } from "sanity";

/**
 * lead — captured enquiry (brief §8). Created the moment a valid email is
 * entered in any quote/hire/airport flow, then updated as the user progresses.
 * If never submitted it stays `abandoned`. Read-only in Studio (system-written).
 */
export const lead = defineType({
  name: "lead",
  title: "Lead / Enquiry",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "email", type: "string" }),
    defineField({ name: "status", type: "string", options: { list: ["abandoned", "submitted"] }, initialValue: "abandoned" }),
    defineField({ name: "flow", type: "string", description: "quote | hire | airport | contact | newsletter" }),
    defineField({ name: "firstName", type: "string" }),
    defineField({ name: "lastName", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "type", type: "string", description: "personal | business" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "companyNumber", type: "string" }),
    defineField({ name: "models", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "quantity", type: "string" }),
    defineField({ name: "branding", type: "text" }),
    defineField({ name: "timeframe", type: "string" }),
    defineField({ name: "hireFrom", type: "string" }),
    defineField({ name: "hireTo", type: "string" }),
    defineField({ name: "drivers", type: "string" }),
    defineField({ name: "eventType", type: "string" }),
    defineField({ name: "address", type: "text" }),
    defineField({ name: "country", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({ name: "build", type: "string", description: "Configurator build summary" }),
    defineField({ name: "createdAt", type: "datetime" }),
    defineField({ name: "updatedAt", type: "datetime" }),
    defineField({ name: "submittedAt", type: "datetime" }),
  ],
  orderings: [{ name: "recent", title: "Most recent", by: [{ field: "updatedAt", direction: "desc" }] }],
  preview: {
    select: { title: "email", status: "status", flow: "flow", updatedAt: "updatedAt" },
    prepare: ({ title, status, flow, updatedAt }) => ({
      title: title || "(no email)",
      subtitle: `${status || "abandoned"} · ${flow || "?"} · ${updatedAt ? new Date(updatedAt).toLocaleString("en-GB") : ""}`,
    }),
  },
});
