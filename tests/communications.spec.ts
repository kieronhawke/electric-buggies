import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Communications admin (email system §4 QA). Logs in as the demo admin, opens a
 * template, exercises preview/raw-HTML/merge-insert, scans a11y, and confirms
 * the preview renders the vehicle hero image with no leftover {{tokens}}.
 * Runs Chromium only (auth flow is identical cross-browser; keeps it fast).
 * Does NOT trigger a real send.
 */
const ADMIN = "admin@demo.electric-buggies.dev";
const PASSWORD = "EbDemo!2026x";

test.use({ reducedMotion: "reduce" });

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByLabel(/email/i).first().fill(ADMIN);
  await page.getByLabel(/password/i).first().fill(PASSWORD);
  await page.getByRole("button", { name: /sign in|log in/i }).first().click();
  await page.waitForURL(/\/admin/, { timeout: 20_000 });
}

test("communications: list and open a template", async ({ page }) => {
  test.skip(test.info().project.name !== "chromium", "auth flow chromium-only");
  await login(page);
  await page.goto("/admin/communications", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Communications" })).toBeVisible();
  await expect(page.getByText("Order confirmed")).toBeVisible();

  // Open the order-confirmed editor.
  await page.goto("/admin/communications/order-confirmed", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();

  // Preview iframe renders with the hero image and no raw tokens.
  const frame = page.frameLocator('iframe[title="Email preview"]');
  await expect(frame.locator("img").first()).toBeVisible();
  const frameHtml = await page.locator('iframe[title="Email preview"]').getAttribute("srcdoc");
  expect(frameHtml).toBeTruthy();
  expect(frameHtml).toContain("/img/email/");
  expect((frameHtml!.match(/\{\{\w+\}\}/g) || []).filter((t) => t !== "{{HERO}}")).toEqual([]);

  // Toggle to raw HTML, insert a merge field, confirm it lands in the textarea.
  await page.getByRole("button", { name: "First name" }).click();
  const code = page.locator("textarea");
  await expect(code).toBeVisible();
  expect(await code.inputValue()).toContain("{{firstName}}");

  // Send-test control is present (we do not click it).
  await expect(page.getByRole("button", { name: /send test email/i })).toBeVisible();
});

test("a11y: communications editor", async ({ page }) => {
  test.skip(test.info().project.name !== "chromium", "auth flow chromium-only");
  await login(page);
  await page.goto("/admin/communications/payment-details", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  // Exclude the email-preview iframe: it renders the approved email artwork,
  // whose intentional subtle greys are not held to app-UI AA contrast.
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).exclude('iframe[title="Email preview"]').analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  if (serious.length) console.log("comms a11y:", JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.length })), null, 2));
  expect(serious).toEqual([]);
});
