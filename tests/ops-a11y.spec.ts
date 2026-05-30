import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** axe (WCAG 2 A/AA) on the new operations screens, as admin. */
const PWD = "EbDemo!2026x";
test.use({ reducedMotion: "reduce" });

async function login(page: Page) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByLabel(/email/i).first().fill("admin@demo.electric-buggies.dev");
  await page.getByLabel(/password/i).first().fill(PWD);
  await page.getByRole("button", { name: /sign in|log in/i }).first().click();
  await page.waitForURL(/\/admin/, { timeout: 20_000 });
}

async function axeClean(page: Page, label: string) {
  await page.waitForTimeout(400);
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const serious = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  if (serious.length) console.log(`axe ${label}:`, JSON.stringify(serious.map((v) => ({ id: v.id, n: v.nodes.length })), null, 2));
  expect(serious, `axe on ${label}`).toEqual([]);
}

test.describe("ops a11y", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth chromium-only");

  test("command centre, inventory, quotes, reports are axe-clean", async ({ page }) => {
    await login(page);
    await page.goto("/admin", { waitUntil: "networkidle" });
    await axeClean(page, "command centre");
    await page.goto("/admin/inventory", { waitUntil: "networkidle" });
    await axeClean(page, "inventory list");
    await page.getByText(/The Six/).first().click();
    await page.waitForLoadState("networkidle");
    await axeClean(page, "inventory detail");
    await page.goto("/admin/quotes", { waitUntil: "networkidle" });
    await axeClean(page, "quote generator");
    await page.goto("/admin/reports", { waitUntil: "networkidle" });
    await axeClean(page, "reports");
  });
});
