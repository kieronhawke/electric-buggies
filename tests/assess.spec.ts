import { test, expect } from "@playwright/test";

const routes = ["/", "/range", "/range/the-six", "/configure", "/sectors/golf-clubs", "/locations/dubai", "/blog", "/blog/lithium-vs-lead-acid-range-lifespan", "/request-a-quote", "/about", "/ownership", "/bespoke", "/compare"];

test("heading hierarchy: exactly one h1 + no console warnings", async ({ page }) => {
  const report: string[] = [];
  for (const path of routes) {
    const warnings: string[] = [];
    page.on("console", (m) => m.type() === "warning" && warnings.push(m.text()));
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const h1 = await page.locator("h1").count();
    if (h1 !== 1) report.push(`${path}: ${h1} h1 elements`);
    if (warnings.length) report.push(`${path}: ${warnings.length} warnings → ${warnings.slice(0, 2).join(" | ")}`);
    page.removeAllListeners("console");
  }
  console.log("ASSESS:\n" + (report.join("\n") || "clean"));
  expect(report, report.join("\n")).toEqual([]);
});

test("homepage weight + image bytes", async ({ page }) => {
  let total = 0, imgBytes = 0, imgCount = 0;
  page.on("response", async (r) => {
    const len = Number(r.headers()["content-length"] || 0);
    total += len;
    if ((r.headers()["content-type"] || "").startsWith("image")) { imgBytes += len; imgCount++; }
  });
  await page.goto("/", { waitUntil: "networkidle" });
  console.log(`WEIGHT: total≈${Math.round(total / 1024)}KB · images≈${Math.round(imgBytes / 1024)}KB across ${imgCount} files`);
});
