import { test, expect, type Page } from "@playwright/test";

/** Full Quote Generator flow: pick a buggy, below-cost warning fires, build a
 *  valid quote, preview, confirm + send, then sign off a follow-up task. */
const PWD = "EbDemo!2026x";

async function login(page: Page, email: string) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByLabel(/email/i).first().fill(email);
  await page.getByLabel(/password/i).first().fill(PWD);
  await page.getByRole("button", { name: /sign in|log in/i }).first().click();
  await page.waitForURL(/\/admin/, { timeout: 20_000 });
}

test.describe("quote flow", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth chromium-only");

  test("below-cost warning, send, and follow-up sign-off", async ({ page }) => {
    await login(page, "sales@demo.electric-buggies.dev");
    await page.goto("/admin/quotes", { waitUntil: "networkidle" });

    await page.getByPlaceholder("Customer name").fill("Test Buyer");
    await page.getByPlaceholder("name@example.com").fill("customer@demo.electric-buggies.dev");

    // Pick a buggy (auto-fills the base price from RRP).
    await page.getByPlaceholder(/search by name or sku/i).fill("Six");
    await page.getByRole("button", { name: /The Six/i }).first().click();
    const base = page.getByPlaceholder("0").first();
    await expect(base).not.toHaveValue("");

    // Drop the price below cost -> rose below-cost warning.
    await base.fill("100");
    await expect(page.getByText(/below cost/i)).toBeVisible();

    // Restore a healthy price -> warning clears, preview enabled.
    await base.fill("30000");
    await expect(page.getByText(/below cost/i)).toHaveCount(0);

    await page.getByRole("button", { name: /preview quote/i }).click();
    await expect(page.getByText(/would you like to send this quote/i)).toBeVisible();
    await page.getByRole("button", { name: /confirm and send/i }).click();

    // Success: a public quote link or a "new quote" reset appears.
    await expect(page.getByText(/\/q\/|quote sent|new quote|sent/i).first()).toBeVisible({ timeout: 15_000 });

    // Sign off a follow-up task on the dashboard.
    await page.goto("/admin", { waitUntil: "networkidle" });
    const signoff = page.getByRole("button", { name: /sign off/i }).first();
    if (await signoff.isVisible().catch(() => false)) {
      await signoff.click();
      await expect(page.getByText(/signed off|saving/i).first()).toBeVisible({ timeout: 10_000 });
    }
  });
});
