import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/quote-schema";
import { decodeBuild, buildSpecLines, priceBuild } from "@/lib/configurator";
import { site } from "@/lib/site";
import { gbp } from "@/lib/utils";

/**
 * Quote-request handler (brief §3/§8 security). Defences:
 *  - zod validation + length caps (lib/quote-schema)
 *  - honeypot field (`website`), silently accepted, not sent
 *  - simple per-IP rate limit (in-memory; swap for Upstash for multi-instance)
 *  - header/HTML-injection guard: strip CR/LF from any value used in subject/
 *    reply-to; raw user input is never reflected to the client
 * Sends via Resend when RESEND_API_KEY is set; otherwise logs (nothing lost).
 * A CAPTCHA (Turnstile/hCaptcha) is the recommended owner add-on (needs a key).
 */

// In-memory rate limit: 5 requests / 10 min / IP (best-effort on serverless).
const hits = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW = 10 * 60 * 1000;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > LIMIT;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests, please try again shortly." }, { status: 429 });
  }

  let data;
  try {
    data = quoteSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid submission" }, { status: 400 });
  }

  // Honeypot tripped → pretend success, send nothing.
  if (data.website) return NextResponse.json({ ok: true });

  let buildSummary = "";
  if (data.build) {
    const b = decodeBuild(data.build);
    const lines = buildSpecLines(b).map((l) => `  ${l.label}: ${l.value}`).join("\n");
    buildSummary = `\n\nAttached build (indicative ${gbp(priceBuild(b))}):\n${lines}`;
  }

  const subject = oneLine(`Quote request, ${data.type}, ${data.name}`);
  const replyTo = oneLine(data.email);
  const body = [
    `Type: ${data.type}`,
    `Name: ${oneLine(data.name)}`,
    `Email: ${replyTo}`,
    data.phone && `Phone: ${oneLine(data.phone)}`,
    data.company && `Company: ${oneLine(data.company)}`,
    data.fleetSize && `Fleet size: ${oneLine(data.fleetSize)}`,
    data.sector && `Sector: ${oneLine(data.sector)}`,
    ``,
    `Message:\n${data.message}`,
    buildSummary,
  ].filter(Boolean).join("\n");

  // ── Instant lead notification via Zapier "Catch Hook" (brief: notify owner
  // immediately so they can SMS/call). Best-effort: a webhook hiccup must not
  // block the visitor's success, but we log failures. This is the primary
  // instant channel; Resend (below) is an optional email backup.
  const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
  if (zapierUrl) {
    const b = data.build ? decodeBuild(data.build) : null;
    const payload = {
      kind: "quote",
      type: data.type,
      name: oneLine(data.name),
      email: replyTo,
      phone: data.phone ? oneLine(data.phone) : "",
      company: data.company ? oneLine(data.company) : "",
      fleetSize: data.fleetSize ? oneLine(data.fleetSize) : "",
      sector: data.sector ? oneLine(data.sector) : "",
      message: data.message,
      build: b ? buildSpecLines(b).map((l) => `${l.label}: ${l.value}`).join("; ") : "",
      indicativeTotal: b ? gbp(priceBuild(b)) : "",
      summary: subject,
      source: "electric-buggies.vercel.app",
      submittedAt: new Date().toISOString(),
    };
    try {
      const z = await fetch(zapierUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!z.ok) console.error("Zapier hook non-200:", z.status);
    } catch (err) {
      console.error("Zapier hook failed:", err);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_NOTIFICATION_EMAIL || site.contact.email;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Electric Buggies <onboarding@resend.dev>",
          to: [to],
          reply_to: replyTo,
          subject,
          text: body,
        }),
      });
      if (!res.ok) {
        console.error("Resend error:", res.status);
        return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 502 });
      }
    } catch (err) {
      console.error("Resend exception:", err);
      return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 502 });
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.log("[quote] (no RESEND_API_KEY) " + subject);
  }

  return NextResponse.json({ ok: true });
}
