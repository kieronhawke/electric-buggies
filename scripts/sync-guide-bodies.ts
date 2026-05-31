/**
 * Surgical guide sync: make every guide render from the rich seed (lib/data/blog.ts).
 *
 * Why: getPost() in lib/content.ts uses the CMS body when present, and falls back to
 * the seed body+related ONLY when the CMS body is empty ("not yet authored"). Older
 * guides were seeded into Sanity via the lossy toPT() conversion (plain p/h2/quote/list
 * only — keystats, comparison, callout, poll and cta blocks were dropped), so they
 * render thinner, stale text live while newer seed-only guides render the full rich
 * layout. This clears the CMS body/related and refreshes excerpt/title/readingTime so
 * the designed seed-fallback kicks in and all guides render consistently from the seed.
 *
 * Touches ONLY existing `post` documents. Does not touch homepage, models, sectors,
 * locations or any other doc type. Idempotent and reversible (owner can re-author a
 * body in Studio at any time to override the seed again).
 *
 * Usage:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxx SANITY_API_WRITE_TOKEN=yyy npx tsx scripts/sync-guide-bodies.ts
 */
import { createClient } from "@sanity/client";
import { posts } from "../lib/data/blog";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-10-01", useCdn: false });

async function run() {
  // Which post docs actually exist in Sanity?
  const existing: string[] = await client.fetch(`*[_type=="post"].slug.current`);
  const existingSet = new Set(existing);
  console.log(`Sanity has ${existing.length} post docs.`);

  const tx = client.transaction();
  let patched = 0;
  for (const p of posts) {
    if (!existingSet.has(p.slug)) continue; // seed-only guide, already renders from seed
    tx.patch(`post-${p.slug}`, (patch) =>
      patch.set({
        body: [], // empty -> getPost() falls back to the rich seed body
        related: [], // empty -> getPost() falls back to seed related
        excerpt: p.excerpt,
        title: p.title,
        readingTime: p.readingTime,
      }),
    );
    patched++;
  }

  console.log(`Patching ${patched} existing guide(s) to render from the seed...`);
  await tx.commit();
  console.log("Done. Affected slugs:", posts.filter((p) => existingSet.has(p.slug)).map((p) => p.slug).join(", "));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
