import path from "node:path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { NextRequest, NextResponse } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { seedPortal } from "@/lib/portal-seed";

/**
 * One-time DB bootstrap: applies pending migrations then seeds demo data.
 * Runs on the server where DATABASE_URL is populated. Gated by REVALIDATE_SECRET
 * and idempotent (the migrator tracks applied migrations; the seed skips
 * existing rows), so it is safe to call more than once.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!dbConfigured || !db) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL not configured" }, { status: 503 });
  }
  try {
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "lib/db/migrations") });
    const seed = await seedPortal();
    return NextResponse.json({ ok: true, migrated: true, seed });
  } catch (err) {
    console.error("setup failed:", err);
    return NextResponse.json({ ok: false, error: String(err instanceof Error ? err.message : err) }, { status: 500 });
  }
}
