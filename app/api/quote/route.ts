import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/quote-schema";
import { decodeBuild, buildSpecLines, priceBuild } from "@/lib/configurator";
import { site } from "@/lib/site";
import { gbp } from "@/lib/utils";

/**
 * Quote-request handler (brief §3, §5). Sends via Resend when RESEND_API_KEY is
 * configured; otherwise it validates, logs and returns success so the form works
 * end-to-end today and "lights up" email delivery the moment the key is added.
 *
 * Optionally store the submission in Sanity (`quoteRequest`) in Phase 2.
 */
export async function POST(req: Request) {
  let data;
  try {
    data = quoteSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid submission" }, { status: 400 });
  }

  // Compose the build summary, if a configuration was attached.
  let buildSummary = "";
  if (data.build) {
    const b = decodeBuild(data.build);
    const lines = buildSpecLines(b)
      .map((l) => `  ${l.label}: ${l.value}`)
      .join("\n");
    buildSummary = `\n\nAttached build (indicative ${gbp(priceBuild(b))}):\n${lines}`;
  }

  const subject = `Quote request — ${data.type} — ${data.name}`;
  const body = [
    `Type: ${data.type}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone && `Phone: ${data.phone}`,
    data.company && `Company: ${data.company}`,
    data.fleetSize && `Fleet size: ${data.fleetSize}`,
    data.sector && `Sector: ${data.sector}`,
    ``,
    `Message:\n${data.message}`,
    buildSummary,
  ]
    .filter(Boolean)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_NOTIFICATION_EMAIL || site.contact.email;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Electric Buggies <onboarding@resend.dev>`,
          to: [to],
          reply_to: data.email,
          subject,
          text: body,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("Resend error:", detail);
        return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 502 });
      }
    } catch (err) {
      console.error("Resend exception:", err);
      return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 502 });
    }
  } else {
    // No key yet — log so nothing is lost, and report success to the user.
    console.log("[quote] (no RESEND_API_KEY set — logging only)\n" + subject + "\n" + body);
  }

  return NextResponse.json({ ok: true });
}
