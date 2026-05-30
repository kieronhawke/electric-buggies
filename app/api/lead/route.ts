import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@sanity/client";

/**
 * Abandoned-lead capture (brief §8). Upserts a `lead` doc keyed by email the
 * moment a valid email is entered, then merges further fields as the user
 * progresses. `action: "submit"` flips status → submitted, stamps submittedAt,
 * and fires the Zapier instant-notify. Degrades gracefully (logs) with no token.
 * Server-only: Sanity write token never reaches the client.
 */
const schema = z.object({
  email: z.string().email().max(160),
  action: z.enum(["save", "submit"]).default("save"),
  flow: z.string().max(40).default("quote"),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
  data: z.record(z.string(), z.unknown()).default({}),
});

const ALLOWED = new Set([
  "firstName", "lastName", "phone", "type", "company", "companyNumber", "models",
  "quantity", "branding", "timeframe", "hireFrom", "hireTo", "drivers", "eventType",
  "address", "country", "message", "build",
]);
const clean = (v: unknown) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").slice(0, 4000) : v);

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 40; // generous: autosave fires repeatedly
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  let body;
  try { body = schema.parse(await req.json()); } catch { return NextResponse.json({ ok: false, error: "Invalid" }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true });

  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body.data)) if (ALLOWED.has(k)) fields[k] = clean(v);

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const now = new Date().toISOString();

  if (projectId && token) {
    try {
      const client = createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", token, apiVersion: "2024-10-01", useCdn: false });
      const id = `lead-${body.email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      await client.createIfNotExists({ _id: id, _type: "lead", email: body.email, flow: body.flow, status: "abandoned", createdAt: now });
      const patch: Record<string, unknown> = { ...fields, email: body.email, flow: body.flow, updatedAt: now };
      if (body.action === "submit") { patch.status = "submitted"; patch.submittedAt = now; }
      await client.patch(id).set(patch).commit();
    } catch (err) {
      console.error("lead upsert failed:", err);
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.log(`[lead] ${body.action} ${body.flow} ${body.email}`);
  }

  // Mirror into the DB so the abandoned-quote recovery cron (template 11) can
  // find leads that entered an email but never submitted. Best-effort.
  try {
    const { db, schema } = await import("@/lib/db");
    if (db) {
      const name = [fields.firstName, fields.lastName].filter(Boolean).join(" ").slice(0, 120) || null;
      const modelSlug = typeof fields.models === "string" ? fields.models.slice(0, 60) : null;
      const completed = body.action === "submit";
      await db.insert(schema.abandonedLead)
        .values({ id: crypto.randomUUID(), email: body.email.toLowerCase(), name, flow: body.flow, modelSlug, completed })
        .onConflictDoUpdate({
          target: [schema.abandonedLead.email, schema.abandonedLead.flow],
          set: { name, modelSlug, ...(completed ? { completed: true } : {}) },
        });
    }
  } catch (err) {
    console.error("abandoned_lead upsert failed:", err);
  }

  // Instant notify on submit.
  if (body.action === "submit" && process.env.ZAPIER_WEBHOOK_URL) {
    try {
      await fetch(process.env.ZAPIER_WEBHOOK_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: body.flow, email: body.email, ...fields, source: "electric-buggies.vercel.app", submittedAt: now }),
      });
    } catch (err) { console.error("Zapier (lead) failed:", err); }
  }
  return NextResponse.json({ ok: true });
}
