import { test, expect, type Page } from "@playwright/test";

/**
 * Visibility-boundary suite (brief CRITICAL section). A regression that leaks
 * internal commercial data (cost / landed cost / profit / margin / supplier /
 * inventory) to a customer or engineer, in the HTML/RSC payload OR via a direct
 * API call by a lower role, FAILS these tests.
 */
const PWD = "EbDemo!2026x";
const U = {
  customer: "customer@demo.electric-buggies.dev",
  engineer: "engineer@demo.electric-buggies.dev",
  sales: "sales@demo.electric-buggies.dev",
  finance: "finance@demo.electric-buggies.dev",
  admin: "admin@demo.electric-buggies.dev",
};

// Unambiguous internal markers that must NEVER appear on a customer surface.
const INTERNAL_MARKERS = [
  "Suzhou", "Factory price", "factoryFob", "Total cost to us", "costSnapshot",
  "profitSnapshot", "landed cost", "Landed cost", "Import duty", "Estimated profit",
  "stockOnHand", "reorderPoint", "marginPct",
];

async function login(page: Page, email: string, expectUrl: RegExp) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByLabel(/email/i).first().fill(email);
  await page.getByLabel(/password/i).first().fill(PWD);
  await page.getByRole("button", { name: /sign in|log in/i }).first().click();
  await page.waitForURL(expectUrl, { timeout: 20_000 });
}

function assertNoInternal(html: string, where: string) {
  for (const m of INTERNAL_MARKERS) {
    expect(html.includes(m), `internal marker "${m}" leaked into ${where}`).toBeFalsy();
  }
}

test.describe("customer boundary", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth chromium-only");

  test("customer pages + RSC payload contain no internal data", async ({ page }) => {
    await login(page, U.customer, /\/account/);
    for (const path of ["/account", "/account/quotes", "/account/orders", "/account/fleet"]) {
      await page.goto(path, { waitUntil: "networkidle" });
      assertNoInternal(await page.content(), path);
    }
  });

  test("public quote view contains no cost/profit", async ({ page }) => {
    // Seeded customer-facing quote link.
    const res = await page.goto("/q/demoquotetoken0001", { waitUntil: "networkidle" });
    expect(res?.status()).toBeLessThan(400);
    assertNoInternal(await page.content(), "/q/<token>");
    // It should still show customer-facing content.
    await expect(page.getByText(/quote/i).first()).toBeVisible();
  });

  test("customer cannot reach admin/inventory/crm/quotes/reports", async ({ page }) => {
    await login(page, U.customer, /\/account/);
    for (const path of ["/admin", "/admin/inventory", "/admin/crm", "/admin/quotes", "/admin/reports"]) {
      await page.goto(path, { waitUntil: "networkidle" });
      expect(page.url(), `customer reached ${path}`).not.toContain(path === "/admin" ? "/admin/" : path);
      expect(page.url()).toContain("/account");
    }
  });

  test("customer is denied the reports export API server-side (403)", async ({ page }) => {
    await login(page, U.customer, /\/account/);
    for (const type of ["orders", "quotes", "deals"]) {
      const r = await page.request.get(`/api/admin/reports/export?type=${type}`);
      expect(r.status(), `export ${type} not blocked for customer`).toBe(403);
    }
  });
});

test.describe("engineer boundary", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth chromium-only");

  test("engineer cannot reach CRM/quotes/inventory/financials", async ({ page }) => {
    await login(page, U.engineer, /\/engineer/);
    for (const path of ["/admin/crm", "/admin/quotes", "/admin/inventory", "/admin/reports", "/admin"]) {
      await page.goto(path, { waitUntil: "networkidle" });
      expect(page.url(), `engineer reached ${path}`).not.toContain("/admin");
    }
    const r = await page.request.get("/api/admin/reports/export?type=orders");
    expect(r.status()).toBe(403);
  });
});

test.describe("positive role access", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth chromium-only");

  test("admin can export orders CSV; sales cannot export orders but can deals", async ({ page }) => {
    await login(page, U.admin, /\/admin/);
    const ok = await page.request.get("/api/admin/reports/export?type=orders");
    expect(ok.status()).toBe(200);
    expect(ok.headers()["content-type"]).toContain("csv");

    await page.context().clearCookies(); // sign out before switching role
    await login(page, U.sales, /\/admin/);
    const orders = await page.request.get("/api/admin/reports/export?type=orders");
    expect(orders.status(), "sales must NOT export financial orders").toBe(403);
    const deals = await page.request.get("/api/admin/reports/export?type=deals");
    expect(deals.status(), "sales should export deals").toBe(200);
  });

  test("sales sees pipeline but not the financial overview", async ({ page }) => {
    await login(page, U.sales, /\/admin/);
    await page.goto("/admin", { waitUntil: "networkidle" });
    await expect(page.getByText(/pipeline/i).first()).toBeVisible();
    // Financial-only revenue/gross-profit section must not render for sales.
    expect(await page.content()).not.toContain("Gross profit");
  });

  test("finance sees the financial overview", async ({ page }) => {
    await login(page, U.finance, /\/admin/);
    await page.goto("/admin", { waitUntil: "networkidle" });
    await expect(page.getByText(/revenue/i).first()).toBeVisible();
  });
});
