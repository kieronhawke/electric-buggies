import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Scan the settled state (entrance fades disabled) — the state assistive tech
// and reduced-motion users actually get; avoids false contrast hits mid-animation.
test.use({ reducedMotion: "reduce" });

/** axe-core WCAG 2 A/AA scan per representative route (forensic §5). */
const routes = ["/", "/range", "/range/the-six", "/configure", "/sectors/golf-clubs", "/locations/dubai", "/blog", "/blog/lithium-vs-lead-acid-range-lifespan", "/request-a-quote", "/ownership"];

for (const path of routes) {
  test(`a11y: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForTimeout(700); // let any entrance animations settle
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    if (serious.length) console.log(path, JSON.stringify(serious.map((v) => v.id), null, 2));
    expect(serious, `serious/critical a11y violations on ${path}`).toEqual([]);
  });
}
