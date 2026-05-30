import { NextResponse } from "next/server";
import { and, eq, isNull, lt } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { site } from "@/lib/site";

/**
 * Abandoned-quote recovery (template 11). Runs on a Vercel cron. Sends a single
 * gentle recovery email to leads who entered a valid email in a quote/hire/
 * airport flow but never submitted, after a grace period, then stamps
 * recoverySentAt so it never repeats. Protected by CRON_SECRET (Vercel cron
 * sends `Authorization: Bearer <CRON_SECRET>`); in production a missing/wrong
 * secret is rejected. Best-effort per row; one failure never blocks the rest.
 *
 * A lead is only marked recovered when the send actually succeeds, so a provider
 * outage retries on the next run rather than silently dropping the lead.
 * `?force=1` (still CRON_SECRET-gated) ignores the grace window for an on-demand
 * test run; the response reports `attempted` and `delivered` counts.
 */
export const dynamic = "force-dynamic";

const GRACE_MS = 60 * 60 * 1000; // 1 hour
const BATCH = 40;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (process.env.NODE_ENV === "production") {
    if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!db) return NextResponse.json({ ok: false, error: "No database." }, { status: 503 });

  const force = new URL(req.url).searchParams.get("force") === "1";
  // force: a future cutoff so every incomplete lead qualifies immediately.
  const cutoff = force ? new Date(Date.now() + 60_000) : new Date(Date.now() - GRACE_MS);
  let attempted = 0;
  let delivered = 0;
  try {
    const rows = await db.select().from(schema.abandonedLead).where(
      and(eq(schema.abandonedLead.completed, false), isNull(schema.abandonedLead.recoverySentAt), lt(schema.abandonedLead.createdAt, cutoff)),
    ).limit(BATCH);

    const { sendTemplate, accountLinks } = await import("@/lib/emails/send");
    for (const lead of rows) {
      attempted++;
      try {
        const r = await sendTemplate("quote-abandoned", lead.email, {
          firstName: lead.name?.split(" ")[0] || "there",
          _modelSlug: lead.modelSlug || undefined,
          ...accountLinks({ ctaLink: `${site.url}/configure`, ctaLink2: `${site.url}/models` }),
        });
        if (r.ok) {
          await db.update(schema.abandonedLead).set({ recoverySentAt: new Date() }).where(eq(schema.abandonedLead.id, lead.id));
          delivered++;
        }
      } catch (err) {
        console.error("Recovery send failed for", lead.id, err);
      }
    }
  } catch (err) {
    console.error("Abandoned-quote cron failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true, attempted, delivered, forced: force });
}
