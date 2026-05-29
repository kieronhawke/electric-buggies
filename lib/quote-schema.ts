import { z } from "zod";

export const quoteSchema = z
  .object({
    type: z.enum(["personal", "business"]),
    name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    company: z.string().optional(),
    fleetSize: z.string().optional(),
    sector: z.string().optional(),
    message: z.string().min(10, "Please tell us a little about your requirement"),
    build: z.string().optional(), // encoded configurator build, if attached
  })
  .refine((d) => d.type !== "business" || (d.company && d.company.length > 1), {
    message: "Please enter your company name",
    path: ["company"],
  });

export type QuoteInput = z.infer<typeof quoteSchema>;
