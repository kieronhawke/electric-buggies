/**
 * Remove em-dashes (U+2014) from shipped source. En-dashes (U+2013, used in
 * numeric ranges like "6–8 hrs") are left intact. " — " → ", "; bare "—" → ", ".
 * Run: node scripts/strip-emdash.mjs   (also used as the guard with --check)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["lib", "app", "components"];
const EXTS = new Set([".ts", ".tsx", ".mjs"]);
const check = process.argv.includes("--check");

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (EXTS.has(extname(p))) acc.push(p);
  }
  return acc;
}

const files = ROOTS.flatMap((r) => walk(r));
let changed = 0;
const offenders = [];

for (const f of files) {
  const src = readFileSync(f, "utf8");
  if (!src.includes("—")) continue;
  if (check) { offenders.push(f); continue; }
  const out = src.replace(/\s*—\s*/g, ", ");
  writeFileSync(f, out, "utf8");
  changed++;
}

if (check) {
  if (offenders.length) {
    console.error("✗ em-dashes found in:\n  " + offenders.join("\n  "));
    process.exit(1);
  }
  console.log("✓ no em-dashes in shipped source");
} else {
  console.log(`stripped em-dashes from ${changed} file(s)`);
}
