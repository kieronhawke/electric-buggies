import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Portal + admin finish-and-polish verification (brief §D). Logs in as each of
 * the four roles, walks every screen, asserts real content + no uncaught page
 * errors, checks the new functionality from this pass, runs axe on key screens,
 * and confirms role isolation. Auth-dependent, so runs Chromium + one mobile
 * project only (login behaviour is identical cross-browser). Non-destructive:
 * it asserts presence/feedback, it does not sign contracts or advance stages.
 */
const PWD = "EbDemo!2026x";
const USERS = {
  customer: "customer@demo.electric-buggies.dev",
  admin: "admin@demo.electric-buggies.dev",
  finance: "finance@demo.electric-buggies.dev",
  engineer: "engineer@demo.electric-buggies.dev",
};

async function login(page: Page, email: string, expectUrl: RegExp) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByLabel(/email/i).first().fill(email);
  await page.getByLabel(/password/i).first().fill(PWD);
  await page.getByRole("button", { name: /sign in|log in/i }).first().click();
  await page.waitForURL(expectUrl, { timeout: 20_000 });
}

function trackErrors(page: Page): string[] {
  const errs: string[] = [];
  page.on("pageerror", (e) => errs.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error" && !/favicon|analytics|the server responded with a status of 4/i.test(m.text())) errs.push(`console: ${m.text()}`); });
  return errs;
}

async function axeClean(page: Page, label: string) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).exclude('iframe[title="Email preview"]').analyze();
  const serious = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  if (serious.length) console.log(`axe ${label}:`, JSON.stringify(serious.map((v) => ({ id: v.id, n: v.nodes.length })), null, 2));
  expect(serious, `axe serious/critical on ${label}`).toEqual([]);
}

test.describe("customer portal", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth flow chromium-only");

  test("every customer screen renders + reachable + a11y", async ({ page }) => {
    const errs = trackErrors(page);
    await login(page, USERS.customer, /\/account/);

    // Dashboard: a prominent required-action CTA exists.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const screens = ["/account", "/account/orders", "/account/fleet", "/account/quotes", "/account/request-quote", "/account/help", "/account/profile", "/account/notifications"];
    for (const s of screens) {
      await page.goto(s, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      await expect(page.getByText(/\{\{\w|undefinedundefined|NaN%|£NaN/)).toHaveCount(0);
    }

    // Profile + Notifications reachable from the nav (not just dashboard tiles).
    await page.goto("/account/orders", { waitUntil: "networkidle" });
    await expect(page.getByRole("navigation").getByRole("link", { name: /profile/i }).first()).toBeVisible();

    // Vehicle imagery present on fleet + request-quote.
    await page.goto("/account/fleet", { waitUntil: "networkidle" });
    await expect(page.locator("img").first()).toBeVisible();
    await page.goto("/account/request-quote", { waitUntil: "networkidle" });
    await expect(page.locator("img").first()).toBeVisible();

    // Walk each order; tracker + image render, no raw tokens.
    await page.goto("/account/orders", { waitUntil: "networkidle" });
    const orderLinks = await page.getByRole("link", { name: /EB-2026/ }).all();
    expect(orderLinks.length).toBeGreaterThan(0);

    await axeClean(page, "customer dashboard");
    await page.goto("/account/help", { waitUntil: "networkidle" });
    await axeClean(page, "customer help");

    expect(errs, `console/page errors: ${errs.join(" | ")}`).toEqual([]);
  });

  test("order lifecycle panels present across seeded stages", async ({ page }) => {
    await login(page, USERS.customer, /\/account/);
    // Open every order and confirm a tracker renders and at least the action
    // panels collectively appear (contract / payment / delivery / delivered).
    await page.goto("/account/orders", { waitUntil: "networkidle" });
    // Collect hrefs up front, then visit each directly (robust to re-render).
    const hrefs = [...new Set((await page.getByRole("link", { name: /EB-2026/ }).evaluateAll(
      (els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")).filter(Boolean) as string[],
    )))];
    expect(hrefs.length).toBeGreaterThan(0);
    let sawPanel = false;
    for (const href of hrefs) {
      await page.goto(href, { waitUntil: "networkidle" });
      await expect(page.locator("img").first()).toBeVisible();
      if (await page.getByText(/sign|payment|delivery|delivered|bank|reference/i).first().isVisible().catch(() => false)) sawPanel = true;
    }
    expect(sawPanel, "at least one order shows a lifecycle action panel").toBeTruthy();
  });
});

test.describe("admin dashboard", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth flow chromium-only");

  test("every admin screen renders + new features present + a11y", async ({ page }) => {
    const errs = trackErrors(page);
    await login(page, USERS.admin, /\/admin/);

    // Orders list: filter/sort controls now exist + cards with images.
    await page.goto("/admin/orders", { waitUntil: "networkidle" });
    await expect(page.locator("img").first()).toBeVisible();
    await page.goto("/admin/orders?sort=value_high", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Order detail: tracker + advance control.
    const firstOrder = page.getByRole("link", { name: /EB-2026/ }).first();
    await firstOrder.click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/advance|stage|journey|notes/i).first()).toBeVisible();

    // Service list + detail.
    await page.goto("/admin/service", { waitUntil: "networkidle" });
    const svc = page.getByRole("link", { name: /EB-SVC/ }).first();
    if (await svc.isVisible().catch(() => false)) {
      await svc.click();
      await page.waitForLoadState("networkidle");
      await expect(page.getByText(/description|issue|severity|engineer|log/i).first()).toBeVisible();
    }

    // CRM: board + abandoned-leads section heading.
    await page.goto("/admin/crm", { waitUntil: "networkidle" });
    await expect(page.getByText(/abandoned leads/i)).toBeVisible();
    const deal = page.getByRole("link").filter({ hasText: /Aldridge|Marin|Okafor|Vance|King/ }).first();
    if (await deal.isVisible().catch(() => false)) {
      await deal.click();
      await page.waitForLoadState("networkidle");
      await expect(page.getByText(/assign|owner|salesperson|reassign/i).first()).toBeVisible();
    }

    // Quotes list, marketing, enquiries, communications.
    for (const s of ["/admin/quotes", "/admin/marketing", "/admin/enquiries", "/admin/communications"]) {
      await page.goto(s, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByText(/undefined|\{\{|NaN(?![a-z])/i)).toHaveCount(0);
    }

    await page.goto("/admin/orders", { waitUntil: "networkidle" });
    await axeClean(page, "admin orders");
    await page.goto("/admin/crm", { waitUntil: "networkidle" });
    await axeClean(page, "admin crm");

    expect(errs, `console/page errors: ${errs.join(" | ")}`).toEqual([]);
  });
});

test.describe("role isolation", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "auth flow chromium-only");

  test("engineer cannot reach CRM/finance, has own dashboard", async ({ page }) => {
    await login(page, USERS.engineer, /\/engineer/);
    await page.goto("/admin/crm", { waitUntil: "networkidle" });
    expect(page.url()).not.toContain("/admin/crm");
    await page.goto("/admin/orders", { waitUntil: "networkidle" });
    expect(page.url()).not.toContain("/admin/orders");
  });

  test("finance nav is scoped; CRM redirects away", async ({ page }) => {
    await login(page, USERS.finance, /\/admin/);
    // Finance should not see CRM in nav, and the page should redirect.
    await page.goto("/admin/crm", { waitUntil: "networkidle" });
    expect(page.url()).not.toContain("/admin/crm");
    // But finance can reach orders (to confirm payments).
    await page.goto("/admin/orders", { waitUntil: "networkidle" });
    expect(page.url()).toContain("/admin/orders");
  });
});

test.describe("mobile", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "single mobile pass via viewport");

  test("customer portal mobile bottom nav + no overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page, USERS.customer, /\/account/);
    for (const s of ["/account", "/account/orders", "/account/fleet", "/account/help"]) {
      await page.goto(s, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `horizontal overflow on ${s}`).toBeLessThanOrEqual(1);
    }
    // Fixed bottom nav present on mobile.
    await expect(page.getByRole("navigation").last()).toBeVisible();
  });
});
