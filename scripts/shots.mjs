// Quick visual-QA screenshotter. Usage: node scripts/shots.mjs [baseURL]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3001";
const OUT = "/tmp/eb-shots";
mkdirSync(OUT, { recursive: true });

const pages = [
  ["home", "/"],
  ["range", "/range"],
  ["model", "/range/the-four"],
  ["configure", "/configure"],
  ["compare", "/compare"],
  ["sectors", "/sectors"],
  ["airports", "/sectors/airports"],
  ["locations", "/locations"],
  ["hire", "/hire"],
  ["quote", "/request-a-quote"],
  ["about", "/about"],
  ["blog", "/blog"],
  ["ownership", "/ownership"],
];

const widths = [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
];

const browser = await chromium.launch();
let fail = 0;
for (const [label, w, h] of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await ctx.addInitScript(() => { try { localStorage.setItem("eb-cookie-consent", "accepted"); } catch {} });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const [name, path] of pages) {
    try {
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 30000 });
      // Scroll through to trigger every whileInView reveal (once:true keeps them
      // visible), then return to top for a complete full-page capture.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/${name}-${label}.png`, fullPage: true });
      // overflow check
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const tag = overflow > 1 ? ` ⚠ H-OVERFLOW ${overflow}px` : "";
      if (overflow > 1) fail++;
      console.log(`${label.padEnd(8)} ${path.padEnd(24)} ok${tag}`);
    } catch (e) {
      fail++;
      console.log(`${label.padEnd(8)} ${path.padEnd(24)} FAIL ${e.message}`);
    }
  }
  if (errors.length) console.log(`  console errors (${label}): ${[...new Set(errors)].slice(0, 8).join(" | ")}`);
  await ctx.close();
}
await browser.close();
console.log(fail ? `\n${fail} issue(s)` : "\nclean");
