import { test, expect, type Page } from "@playwright/test";

/** Routes to crawl (representative of every type). The node crawler
 *  (scripts/crawl-check.mjs) covers the full sitemap at the HTTP level; this
 *  adds console-error + render assertions in a real browser. */
const routes = [
  "/", "/range", "/range/the-two", "/range/the-four", "/range/the-six",
  "/range/the-eight", "/range/the-utility", "/range/bespoke",
  "/configure", "/configure/the-four",
  "/sectors", "/sectors/golf-clubs", "/sectors/estates",
  "/locations", "/locations/dubai", "/locations/scotland",
  "/blog", "/blog/lithium-vs-lead-acid-range-lifespan", "/blog/category/regulations",
  "/bespoke", "/ownership", "/about", "/request-a-quote",
  "/hire", "/sectors/airports", "/services/shuttle", "/services/vip-chauffeur", "/services/service-plan",
  "/locations/monaco", "/locations/maldives", "/locations/usa",
  "/blog/hiring-electric-buggies-for-events", "/blog/airport-prm-transport-accessible-vehicles",
  "/privacy", "/terms", "/cookies",
];

for (const path of routes) {
  test(`${path} renders without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(res?.status(), `status for ${path}`).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
    // No stuck "Loading…" on lead routes.
    if (path === "/request-a-quote") {
      await expect(page.locator('input[name="email"]')).toBeVisible();
    }
    expect(errors, `console errors on ${path}`).toEqual([]);
  });
}

test("no horizontal overflow at mobile/tablet/desktop widths", async ({ page }: { page: Page }) => {
  // Representative page types (configurator caught a real 257px mobile overflow).
  const pages = ["/", "/configure", "/range/the-six", "/request-a-quote", "/sectors/airports", "/locations/dubai", "/compare"];
  for (const path of pages) {
    for (const w of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(250);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `horizontal overflow on ${path} at ${w}px`).toBeLessThanOrEqual(1);
    }
  }
});
