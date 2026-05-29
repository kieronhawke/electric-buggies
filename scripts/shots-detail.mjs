// Detailed viewport captures for close QA. node scripts/shots-detail.mjs [baseURL]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3001";
const OUT = "/tmp/eb-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function ctx(w, h) {
  const c = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  await c.addInitScript(() => { try { localStorage.setItem("eb-cookie-consent", "accepted"); } catch {} });
  return c;
}

// Desktop: nav mega-menu open
{
  const c = await ctx(1440, 900);
  const p = await c.newPage();
  await p.goto(BASE + "/range", { waitUntil: "networkidle" });
  // hover the first nav trigger (The Range)
  await p.getByRole("button", { name: /The Range/i }).first().hover();
  await p.waitForTimeout(450);
  await p.screenshot({ path: `${OUT}/nav-mega-desktop.png` });
  // switch to Configure to confirm crossfade keeps panel stable
  await p.getByRole("button", { name: /^Configure/i }).first().hover();
  await p.waitForTimeout(450);
  await p.screenshot({ path: `${OUT}/nav-mega-configure.png` });
  await c.close();
}

// Mobile viewport-only captures
const mobiles = [
  ["m-home-hero", "/", false],
  ["m-configure", "/configure", false],
  ["m-model", "/range/the-four", false],
  ["m-quote", "/request-a-quote", false],
  ["m-compare", "/compare", false],
  ["m-blog", "/blog", false],
];
{
  const c = await ctx(390, 844);
  const p = await c.newPage();
  for (const [name, path] of mobiles) {
    await p.goto(BASE + path, { waitUntil: "networkidle" });
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}/${name}.png` });
  }
  // mobile nav open
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: /Open menu/i }).click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/m-nav-open.png` });
  await c.close();
}

await browser.close();
console.log("done");
