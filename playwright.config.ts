import { defineConfig, devices } from "@playwright/test";

/**
 * Cross-browser E2E + a11y harness (forensic brief §5).
 * Runs against BASE_URL (defaults to the live site). Projects cover Chromium,
 * WebKit (Safari) and Firefox; viewport coverage (360/390/768/1024/1440) is
 * exercised within specs via page.setViewportSize for layout assertions.
 *
 *   pnpm test:e2e          # all browsers
 *   BASE_URL=http://localhost:3000 pnpm test:e2e
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL || "https://electric-buggies.vercel.app",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 14"] } },
  ],
});
