import { z } from "zod";

export const quoteSchema = z
  .object({
    type: z.enum(["personal", "business"]),
    name: z.string().min(2, "Please enter your name").max(120),
    email: z.string().email("Please enter a valid email").max(160),
    phone: z.string().max(40).optional(),
    company: z.string().max(160).optional(),
    fleetSize: z.string().max(60).optional(),
    sector: z.string().max(80).optional(),
    message: z.string().min(10, "Please tell us a little about your requirement").max(4000),
    build: z.string().max(400).optional(), // encoded configurator build, if attached
    // Honeypot, must stay empty; bots fill hidden fields. Not shown to humans.
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .refine((d) => d.type !== "business" || (d.company && d.company.length > 1), {
    message: "Please enter your company name",
    path: ["company"],
  });

export type QuoteInput = z.infer<typeof quoteSchema>;
