import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand ISR purge. POST /api/revalidate?secret=… flushes the Full Route
 * Cache for the key routes across all regions, so a new deployment's content
 * replaces any stale-while-revalidate copy immediately instead of waiting for
 * each region's revalidate window. Gated by REVALIDATE_SECRET.
 */
export const dynamic = "force-dynamic";

const PATHS = [
  "/", "/range", "/configure", "/compare", "/sectors", "/locations",
  "/ownership", "/about", "/hire", "/guides", "/bespoke",
];

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  // Purge the whole route tree (layout-level) plus each key path.
  revalidatePath("/", "layout");
  for (const p of PATHS) revalidatePath(p);
  return NextResponse.json({ ok: true, revalidated: PATHS });
}
