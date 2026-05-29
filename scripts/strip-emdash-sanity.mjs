/**
 * Strip em-dashes from live Sanity content WITHOUT overwriting edits: fetches
 * every published doc, replaces only em-dash characters in string values
 * (preserving all structure/edits), and writes back via createOrReplace.
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=… SANITY_API_WRITE_TOKEN=… node scripts/strip-emdash-sanity.mjs
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) { console.error("Missing Sanity env"); process.exit(1); }

const client = createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", token, apiVersion: "2024-10-01", useCdn: false });

let touched = false;
const fix = (s) => s.replace(/\s*—\s*/g, ", ");
function deep(v) {
  if (typeof v === "string") { const f = fix(v); if (f !== v) touched = true; return f; }
  if (Array.isArray(v)) return v.map(deep);
  if (v && typeof v === "object") {
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = k.startsWith("_") ? val : deep(val);
    return out;
  }
  return v;
}

const docs = await client.fetch('*[!(_id in path("drafts.**"))]');
let changed = 0;
for (const doc of docs) {
  touched = false;
  const cleaned = deep(doc);
  if (touched) { await client.createOrReplace(cleaned); changed++; console.log("  fixed", doc._id); }
}
console.log(`✓ stripped em-dashes from ${changed}/${docs.length} Sanity docs`);
