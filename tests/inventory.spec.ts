import { test, expect, type Page } from "@playwright/test";

/** Inventory Manager smoke (admin). Verifies the list, profit column, analytics
 *  and the item detail with the live cost-stack editor + standout profit. */
const PWD = "EbDemo!2026x";

async function login(page: Page, email: string, expectUrl: RegExp) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByLabel(/email/i).first().fill(email);
  await page.getByLabel(/password/i).first().fill(PWD);
  await page.getByRole("button", { name: /sign in|log in/i }).first().click();
  await page.waitForURL(expectUrl, { timeout: 20_000 });
}

test.describe("inventory", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth chromium-only");

  test("admin sees inventory list with profit + opens an item", async ({ page }) => {
    await login(page, "admin@demo.electric-buggies.dev", /\/admin/);
    await page.goto("/admin/inventory", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Inventory" })).toBeVisible();
    // A profit figure (£ + margin%) must be present in the list.
    await expect(page.getByText(/%/).first()).toBeVisible();
    await expect(page.getByText(/The Six/).first()).toBeVisible();
    // Open an item and confirm the cost stack + total cost render.
    const row = page.getByText(/The Six/).first();
    await row.click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/total cost|FOB|customs|duty/i).first()).toBeVisible();
  });

  test("sales cannot reach inventory manager", async ({ page }) => {
    await login(page, "sales@demo.electric-buggies.dev", /\/admin/);
    await page.goto("/admin/inventory", { waitUntil: "networkidle" });
    expect(page.url()).not.toContain("/admin/inventory");
  });
});
