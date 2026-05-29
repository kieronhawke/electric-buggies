// Deep live integrity crawl. Usage: node scripts/live-audit.mjs [baseURL]
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "https://electric-buggies.vercel.app";

// 1. routes from sitemap
const sm = await (await fetch(BASE + "/sitemap.xml")).text();
const routes = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(BASE, "") || "/");
console.log(`Sitemap routes: ${routes.length}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await ctx.addInitScript(() => { try { localStorage.setItem("eb-cookie-consent","accepted"); } catch {} });
const page = await ctx.newPage();

const imgSet = new Set(), linkSet = new Set();
const consoleErrs = {}, pageErrs = {}, overflow = {};

for (const r of routes) {
  const errs = [];
  page.removeAllListeners("console"); page.removeAllListeners("pageerror");
  page.on("console", m => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
  try {
    await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) { consoleErrs[r] = ["NAV FAIL: " + e.message]; continue; }
  // collect assets
  const { imgs, links } = await page.evaluate((origin) => {
    const imgs = [...document.querySelectorAll("img")].map(i => i.currentSrc || i.src).filter(Boolean);
    const links = [...document.querySelectorAll("a[href]")].map(a => a.href)
      .filter(h => h.startsWith(origin)).map(h => h.split("#")[0]);
    return { imgs, links };
  }, BASE);
  imgs.forEach(u => imgSet.add(u));
  links.forEach(u => linkSet.add(u));
  // mobile overflow
  await page.setViewportSize({ width: 390, height: 844 });
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (ov > 1) overflow[r] = ov;
  await page.setViewportSize({ width: 1440, height: 900 });
  if (errs.length) consoleErrs[r] = [...new Set(errs)];
}

// 2. check every unique image + internal link returns 200
async function statusOf(url) {
  try { const res = await fetch(url, { method: "GET" }); return res.status; }
  catch (e) { return "ERR " + e.message; }
}
const badImgs = [], badLinks = [];
for (const u of imgSet) { const s = await statusOf(u); if (s !== 200) badImgs.push(`${s}  ${u.slice(0,90)}`); }
for (const u of linkSet) { const s = await statusOf(u); if (s !== 200 && s !== 308 && s !== 301) badLinks.push(`${s}  ${u.replace(BASE,"")}`); }

console.log(`\nUnique images checked: ${imgSet.size} — bad: ${badImgs.length}`);
badImgs.forEach(x => console.log("  IMG " + x));
console.log(`Unique internal links checked: ${linkSet.size} — bad: ${badLinks.length}`);
badLinks.forEach(x => console.log("  LINK " + x));
console.log(`\nConsole/page errors: ${Object.keys(consoleErrs).length} route(s)`);
for (const [r, e] of Object.entries(consoleErrs)) console.log(`  ${r}: ${e.join(" | ").slice(0,160)}`);
console.log(`\nMobile horizontal overflow: ${Object.keys(overflow).length} route(s)`);
for (const [r, o] of Object.entries(overflow)) console.log(`  ${r}: ${o}px`);

await browser.close();
console.log("\n" + ((badImgs.length||badLinks.length||Object.keys(consoleErrs).length||Object.keys(overflow).length) ? "ISSUES ABOVE" : "ALL CLEAN"));
