import { test } from "@playwright/test";

/**
 * Mobile diagnostic (logs findings, does not assert). Renders key routes at a
 * phone width and reports horizontal overflow, elements wider than the screen,
 * stacked fixed/bottom bars, tiny tap targets and tiny fonts.
 *   npx playwright test tests/mobile-audit.spec.ts --project=chromium --workers=1
 */
const routes = ["/", "/range", "/range/the-six", "/configure", "/request-a-quote", "/hire", "/sectors/airports", "/locations/dubai", "/compare", "/blog/hiring-electric-buggies-for-events"];

test.use({ viewport: { width: 390, height: 844 } });

test("mobile audit at 390px", async ({ page }) => {
  for (const path of routes) {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const overflow = document.documentElement.scrollWidth - W;
      // elements extending past the right edge
      const wide: string[] = [];
      document.querySelectorAll("body *").forEach((el) => {
        const b = (el as HTMLElement).getBoundingClientRect();
        if (b.width > 0 && b.right > W + 2 && b.left >= 0 && b.width <= W * 3) {
          const c = (el as HTMLElement).className?.toString().slice(0, 40) || "";
          wide.push(`${el.tagName.toLowerCase()}.${c.replace(/\s+/g, ".")} (right ${Math.round(b.right)})`);
        }
      });
      // fixed/sticky elements near the bottom (overlap risk)
      const bottomFixed: string[] = [];
      document.querySelectorAll("body *").forEach((el) => {
        const s = getComputedStyle(el);
        const b = (el as HTMLElement).getBoundingClientRect();
        if ((s.position === "fixed" || s.position === "sticky") && b.bottom > window.innerHeight - 120 && b.height > 0 && b.height < 300) {
          bottomFixed.push(`${el.tagName.toLowerCase()}.${((el as HTMLElement).className || "").toString().slice(0, 30)} @${Math.round(b.top)}-${Math.round(b.bottom)}`);
        }
      });
      // tap targets under 40px
      let smallTaps = 0; const tapEg: string[] = [];
      document.querySelectorAll("a, button, input, select").forEach((el) => {
        const b = (el as HTMLElement).getBoundingClientRect();
        if (b.width > 0 && b.height > 0 && (b.height < 40 || b.width < 40)) {
          smallTaps++;
          if (tapEg.length < 4) tapEg.push(`${el.tagName.toLowerCase()} ${Math.round(b.width)}x${Math.round(b.height)} "${(el.textContent || "").trim().slice(0, 18)}"`);
        }
      });
      // tiny fonts
      let tinyFont = 0;
      document.querySelectorAll("p, span, a, li, div").forEach((el) => {
        if ((el.textContent || "").trim().length > 4) {
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs && fs < 11.5) tinyFont++;
        }
      });
      return { overflow, wide: [...new Set(wide)].slice(0, 6), bottomFixed: [...new Set(bottomFixed)], smallTaps, tapEg, tinyFont };
    });
    console.log(`\n### ${path}`);
    console.log(`  overflow: ${r.overflow}px`);
    if (r.wide.length) console.log(`  WIDE: ${r.wide.join(" | ")}`);
    console.log(`  bottom-fixed bars (${r.bottomFixed.length}): ${r.bottomFixed.join(" | ")}`);
    console.log(`  small tap targets: ${r.smallTaps} ${r.tapEg.length ? "→ " + r.tapEg.join(", ") : ""}`);
    console.log(`  tiny fonts (<11.5px): ${r.tinyFont}`);
  }
});
