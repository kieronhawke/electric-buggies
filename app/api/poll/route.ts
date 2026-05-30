import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { rateLimited, clientIp } from "@/lib/rate-limit";

/**
 * Reader poll for Guides articles. One vote per visitor (anonymous httpOnly
 * cookie + a unique DB index). GET returns tallies and this visitor's choice;
 * POST records a vote. Validated and length-capped.
 */
export const dynamic = "force-dynamic";

async function tallies(pollId: string) {
  if (!db) return [];
  return db
    .select({ option: schema.pollVote.option, count: sql<number>`count(*)::int` })
    .from(schema.pollVote)
    .where(eq(schema.pollVote.pollId, pollId))
    .groupBy(schema.pollVote.option);
}

export async function GET(req: NextRequest) {
  const pollId = req.nextUrl.searchParams.get("pollId");
  if (!db || !pollId) return NextResponse.json({ tallies: [], voted: null });
  const vid = req.cookies.get("eb_vid")?.value;
  let voted: string | null = null;
  if (vid) {
    const [v] = await db
      .select({ option: schema.pollVote.option })
      .from(schema.pollVote)
      .where(and(eq(schema.pollVote.pollId, pollId), eq(schema.pollVote.visitorId, vid)))
      .limit(1);
    voted = v?.option ?? null;
  }
  return NextResponse.json({ tallies: await tallies(pollId), voted });
}

export async function POST(req: NextRequest) {
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  if (rateLimited("poll", clientIp(req), 20, 60 * 1000)) return NextResponse.json({ ok: false }, { status: 429 });
  let body: { pollId?: unknown; option?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { pollId, option } = body;
  if (typeof pollId !== "string" || typeof option !== "string" || !pollId || !option || pollId.length > 120 || option.length > 200) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  let vid = req.cookies.get("eb_vid")?.value;
  const fresh = !vid;
  if (!vid) vid = crypto.randomUUID();

  try {
    await db.insert(schema.pollVote).values({ id: crypto.randomUUID(), pollId, option, visitorId: vid });
  } catch {
    /* duplicate vote for this visitor: ignore, just return current tallies */
  }

  const res = NextResponse.json({ ok: true, tallies: await tallies(pollId), voted: option });
  if (fresh) {
    res.cookies.set("eb_vid", vid, { httpOnly: true, sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 * 365, path: "/" });
  }
  return res;
}
