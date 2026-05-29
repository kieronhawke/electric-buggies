/**
 * HTTP crawl + link checker (no browser needed). Pulls the sitemap, asserts
 * every route is 200, then extracts internal links from each page and asserts
 * none 404. Complements the Playwright suite (which adds console-error,
 * interaction, axe and cross-browser coverage).
 *
 *   node scripts/crawl-check.mjs [baseUrl]
 */
const BASE = process.argv[2] || "https://electric-buggies.vercel.app";

async function get(url) {
  const res = await fetch(url, { redirect: "manual" });
  return { status: res.status, body: res.status < 400 ? await res.text() : "" };
}

async function sitemapUrls() {
  const { body } = await get(`${BASE}/sitemap.xml`);
  return [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function internalLinks(html) {
  return [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1])
    .filter((h) => !h.startsWith("//") && !h.startsWith("/_next") && h !== "/");
}

const run = async () => {
  const routes = await sitemapUrls();
  console.log(`Sitemap routes: ${routes.length}`);
  const linkSet = new Set();
  let routeFails = 0;

  for (const url of routes) {
    const { status, body } = await get(url);
    const ok = status === 200;
    if (!ok) { routeFails++; console.log(`  ✗ ${status} ${url}`); }
    internalLinks(body).forEach((l) => linkSet.add(new URL(l, BASE).toString()));
  }
  console.log(routeFails === 0 ? "✓ all sitemap routes 200" : `✗ ${routeFails} route failures`);

  let linkFails = 0;
  for (const link of linkSet) {
    const res = await fetch(link, { redirect: "manual" });
    // 200 OK, or 3xx (e.g. /contact → /request-a-quote) are acceptable.
    if (res.status >= 400) { linkFails++; console.log(`  ✗ ${res.status} (link) ${link}`); }
  }
  console.log(`Internal links checked: ${linkSet.size} — ${linkFails === 0 ? "✓ no 404s" : `✗ ${linkFails} broken`}`);

  process.exit(routeFails + linkFails === 0 ? 0 : 1);
};
run().catch((e) => { console.error(e); process.exit(1); });
