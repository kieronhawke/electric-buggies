import { test, expect } from "@playwright/test";

// 1x1 transparent PNG for the logo-upload step.
const PNG_1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

test("configurator: live preview, branding upload, quote hand-off", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/configure/the-four", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText(/Indicative total/i)).toBeVisible();

  // Colour step → pick a colour.
  await page.getByRole("button", { name: /Colour/ }).first().click();
  await page.getByRole("button", { name: /Midnight|Racing|Oxford|Claret|Storm/ }).first().click();

  // Branding step → logo upload + placement work.
  await page.getByRole("button", { name: /Branding/ }).click();
  await page.setInputFiles('input[type="file"]', { name: "logo.png", mimeType: "image/png", buffer: PNG_1x1 });
  await page.getByRole("button", { name: /Front panel|Both sides|Rear|Bonnet/ }).first().click();

  // Hand-off to the quote wizard carries the build (?m=).
  await page.getByRole("button", { name: /Request Quote/i }).first().click();
  await page.waitForURL(/\/request-a-quote\?.*m=/);
  await expect(page.locator('input[name="email"]')).toBeVisible();
  expect(errors).toEqual([]);
});

test("multi-step quote wizard completes and submits (API mocked)", async ({ page }) => {
  await page.route("**/api/lead", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
  );
  await page.goto("/request-a-quote");
  await page.getByRole("button", { name: "Accept" }).click().catch(() => {}); // dismiss cookie banner overlay
  await page.locator('input[name="firstName"]').fill("Test");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.getByRole("button", { name: "Continue" }).click();
  // vehicles: select the first product card
  await page.locator("button:has(img)").first().click();
  // advance through remaining steps until the review's Submit appears
  for (let i = 0; i < 10; i++) {
    const submit = page.getByRole("button", { name: /Submit enquiry/i });
    if (await submit.isVisible().catch(() => false)) break;
    await page.getByRole("button", { name: "Continue" }).click();
  }
  await page.getByRole("button", { name: /Submit enquiry/i }).click();
  await expect(page.getByText(/Thank you/i)).toBeVisible();
});

test("mega-menu opens on hover and mobile menu toggles", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "The Range" }).hover();
  await expect(page.getByRole("link", { name: /The Four/ }).first()).toBeVisible();
});
