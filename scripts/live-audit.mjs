// Deep live integrity crawl (hardened). node scripts/live-audit.mjs [baseURL]
import { chromium } from "@playwright/test";
const BASE = process.argv[2] || "https://electric-buggies.vercel.app";

const fetchT = (url, opts = {}, ms = 12000) => {
  const ac = new AbortController(); const t = setTimeout(() => ac.abort(), ms);
  return fetch(url, { ...opts, signal: ac.signal }).finally(() => clearTimeout(t));
};

const sm = await (await fetchT(BASE + "/sitemap.xml")).text();
const routes = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(BASE, "") || "/");
console.log(`Sitemap routes: ${routes.length}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await ctx.addInitScript(() => { try { localStorage.setItem("eb-cookie-consent","accepted"); } catch {} });
const page = await ctx.newPage();
const imgSet = new Set(), linkSet = new Set();
const consoleErrs = {}, overflow = {};

for (const r of routes) {
  const errs = [];
  page.removeAllListeners("console"); page.removeAllListeners("pageerror");
  page.on("console", m => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
  try { await page.goto(BASE + r, { waitUntil: "domcontentloaded", timeout: 25000 }); }
  catch (e) { consoleErrs[r] = ["NAV FAIL: " + e.message]; continue; }
  await page.waitForTimeout(600);
  const { imgs, links } = await page.evaluate((origin) => ({
    imgs: [...document.querySelectorAll("img")].map(i => i.currentSrc || i.src).filter(Boolean),
    links: [...document.querySelectorAll("a[href]")].map(a => a.href).filter(h => h.startsWith(origin)).map(h => h.split("#")[0]),
  }), BASE);
  imgs.forEach(u => imgSet.add(u)); links.forEach(u => linkSet.add(u));
  await page.setViewportSize({ width: 390, height: 844 });
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (ov > 1) overflow[r] = ov;
  await page.setViewportSize({ width: 1440, height: 900 });
  if (errs.length) consoleErrs[r] = [...new Set(errs)];
}
await browser.close();
console.log(`Crawled ${routes.length} routes in browser.`);

async function status(url, method="HEAD") {
  try { const res = await fetchT(url, { method }, 12000); return res.status; }
  catch { return method==="HEAD" ? await status(url,"GET") : "TIMEOUT"; }
}
const badImgs = [], badLinks = [];
let i=0;
for (const u of imgSet) { const s = await status(u); if (s !== 200) badImgs.push(`${s}  ${u.slice(0,100)}`); }
for (const u of linkSet) { const s = await status(u, "GET"); if (![200,301,308].includes(s)) badLinks.push(`${s}  ${u.replace(BASE,"")}`); }

console.log(`\nImages checked: ${imgSet.size} — bad: ${badImgs.length}`);
badImgs.forEach(x => console.log("  IMG " + x));
console.log(`Internal links checked: ${linkSet.size} — bad: ${badLinks.length}`);
badLinks.forEach(x => console.log("  LINK " + x));
console.log(`Console/page errors: ${Object.keys(consoleErrs).length}`);
for (const [r,e] of Object.entries(consoleErrs)) console.log(`  ${r}: ${e.join(" | ").slice(0,140)}`);
console.log(`Mobile overflow: ${Object.keys(overflow).length}`);
for (const [r,o] of Object.entries(overflow)) console.log(`  ${r}: ${o}px`);
console.log("\n" + ((badImgs.length||badLinks.length||Object.keys(consoleErrs).length||Object.keys(overflow).length) ? "ISSUES ABOVE" : "ALL CLEAN ✓"));
