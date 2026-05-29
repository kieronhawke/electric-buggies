import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Newsletter / lead-capture. Forwards to the same Zapier hook (kind:"newsletter")
 * so signups reach the owner instantly too. Honeypot + light rate-limit + zod.
 */
const schema = z.object({
  email: z.string().email().max(160),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 6;
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });

  let data;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Please enter a valid email" }, { status: 400 });
  }
  if (data.website) return NextResponse.json({ ok: true }); // honeypot

  const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
  if (zapierUrl) {
    try {
      await fetch(zapierUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "newsletter",
          email: data.email.replace(/[\r\n]+/g, " ").trim(),
          source: "electric-buggies.vercel.app",
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Zapier newsletter hook failed:", err);
    }
  }
  return NextResponse.json({ ok: true });
}
