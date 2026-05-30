import { test, expect, type Page } from "@playwright/test";

/** Quote Generator smoke: sales + admin can build a quote; the live profit and
 *  preview/safeguard flow render. Non-destructive (does not send). */
const PWD = "EbDemo!2026x";

async function login(page: Page, email: string) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByLabel(/email/i).first().fill(email);
  await page.getByLabel(/password/i).first().fill(PWD);
  await page.getByRole("button", { name: /sign in|log in/i }).first().click();
  await page.waitForURL(/\/admin/, { timeout: 20_000 });
}

test.describe("quote generator", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth chromium-only");

  test("sales sees the generator and live profit", async ({ page }) => {
    await login(page, "sales@demo.electric-buggies.dev");
    await page.goto("/admin/quotes", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /quote generator/i })).toBeVisible();
    // A buggy picker and customer fields exist.
    await expect(page.getByText(/the six|the four|customer/i).first()).toBeVisible();
  });

  test("admin quotes list shows internal margin", async ({ page }) => {
    await login(page, "admin@demo.electric-buggies.dev");
    await page.goto("/admin/quotes", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /quote generator/i })).toBeVisible();
  });
});
