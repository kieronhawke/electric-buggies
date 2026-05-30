import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

/** "Was this helpful?" feedback for a Guides article. One per visitor. */
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  let body: { slug?: unknown; helpful?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { slug, helpful } = body;
  if (typeof slug !== "string" || !slug || slug.length > 160 || typeof helpful !== "boolean") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  let vid = req.cookies.get("eb_vid")?.value;
  const fresh = !vid;
  if (!vid) vid = crypto.randomUUID();
  try {
    await db.insert(schema.articleFeedback).values({ id: crypto.randomUUID(), slug, helpful, visitorId: vid });
  } catch {
    /* already gave feedback */
  }
  const [agg] = await db
    .select({
      yes: sql<number>`count(*) filter (where ${schema.articleFeedback.helpful})::int`,
      total: sql<number>`count(*)::int`,
    })
    .from(schema.articleFeedback)
    .where(eq(schema.articleFeedback.slug, slug));
  const res = NextResponse.json({ ok: true, yes: agg?.yes ?? 0, total: agg?.total ?? 0 });
  if (fresh) res.cookies.set("eb_vid", vid, { httpOnly: true, sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 * 365, path: "/" });
  return res;
}
