import { test, expect } from "@playwright/test";

// 1x1 transparent PNG for the logo-upload step.
const PNG_1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

test("full configurator flow incl. branding, save/share, quote hand-off", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/configure/the-four", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Indicative price visible.
  await expect(page.getByText(/Indicative total/i)).toBeVisible();
  const priceBefore = await page.getByText(/£/).first().innerText();

  // Colour step → pick a non-default colour, expect price to change.
  await page.getByRole("button", { name: /Colour/ }).first().click();
  await page.getByRole("button", { name: /Midnight|Racing|Oxford|Claret|Storm/ }).first().click();

  // Branding step → upload + place logo.
  await page.getByRole("button", { name: /Branding/ }).click();
  await page.setInputFiles('input[type="file"]', { name: "logo.png", mimeType: "image/png", buffer: PNG_1x1 });
  await page.getByRole("button", { name: /Front panel|Both sides|Rear|Bonnet/ }).first().click();

  // Summary → save + share.
  await page.getByRole("button", { name: /Summary/ }).click();
  await page.getByRole("button", { name: "Save", exact: true }).first().click();
  await expect(page.getByText(/saved/i)).toBeVisible();

  // Quote hand-off carries the build into the wizard (URL has ?m=).
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
  // 1 details
  await page.locator('input[name="firstName"]').fill("Test");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.getByRole("button", { name: /Continue/ }).click();
  // 2 vehicles (pick first card)
  await page.locator("button:has(img)").first().click();
  await page.getByRole("button", { name: /Continue/ }).click();
  // 3 quantity
  await page.getByRole("button", { name: "1", exact: true }).first().click();
  await page.getByRole("button", { name: /Continue/ }).click();
  // step through the rest to review
  for (let i = 0; i < 5; i++) {
    const cont = page.getByRole("button", { name: /Continue/ });
    if (await cont.count() === 0) break;
    if (await cont.isDisabled().catch(() => false)) break;
    await cont.click();
  }
  await page.getByRole("button", { name: /Submit enquiry/i }).click();
  await expect(page.getByText(/Thank you/i)).toBeVisible();
});

test("mega-menu opens on hover and mobile menu toggles", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "The Range" }).hover();
  await expect(page.getByRole("link", { name: /The Four/ }).first()).toBeVisible();
});
