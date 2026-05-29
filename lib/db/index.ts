import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Drizzle client over postgres.js. The portal degrades gracefully when
 * DATABASE_URL is unset: `db` is null and callers fall back to a "portal not
 * configured" state, so the marketing site keeps building and deploying.
 */
const url = process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var __ebPg: ReturnType<typeof postgres> | undefined;
}

export const dbConfigured = Boolean(url);

const client = url
  ? // Reuse a single connection in dev/hot-reload; modest pool for serverless.
    (globalThis.__ebPg ??= postgres(url, { max: 10, prepare: false }))
  : null;

export const db = client ? drizzle(client, { schema }) : null;

/** Use in route handlers/pages that require the DB; throws a clear error. */
export function requireDb() {
  if (!db) {
    throw new Error("DATABASE_URL is not configured. The portal is unavailable.");
  }
  return db;
}

export { schema };
