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

  const cutoff = new Date(Date.now() - GRACE_MS);
  let sent = 0;
  try {
    const rows = await db.select().from(schema.abandonedLead).where(
      and(eq(schema.abandonedLead.completed, false), isNull(schema.abandonedLead.recoverySentAt), lt(schema.abandonedLead.createdAt, cutoff)),
    ).limit(BATCH);

    const { sendTemplate, accountLinks } = await import("@/lib/emails/send");
    for (const lead of rows) {
      try {
        await sendTemplate("quote-abandoned", lead.email, {
          firstName: lead.name?.split(" ")[0] || "there",
          _modelSlug: lead.modelSlug || undefined,
          ...accountLinks({ ctaLink: `${site.url}/configure`, ctaLink2: `${site.url}/models` }),
        });
        await db.update(schema.abandonedLead).set({ recoverySentAt: new Date() }).where(eq(schema.abandonedLead.id, lead.id));
        sent++;
      } catch (err) {
        console.error("Recovery send failed for", lead.id, err);
      }
    }
  } catch (err) {
    console.error("Abandoned-quote cron failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true, sent });
}
