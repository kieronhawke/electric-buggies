/**
 * Seed the portal locally: one verified user per role + a demo order.
 * Run: ./node_modules/.bin/tsx scripts/seed-portal.ts
 * (Production is seeded via POST /api/admin/setup.)
 */
// Use an already-exported DATABASE_URL if present; else load .env.local.
if (!process.env.DATABASE_URL) process.loadEnvFile(".env.local");

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });

async function main() {
  const { seedPortal } = await import("../lib/portal-seed");
  const result = await seedPortal();
  console.log("Seed complete:", JSON.stringify(result, null, 2));
}
