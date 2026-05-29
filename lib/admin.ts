import "server-only";
import { createHash } from "node:crypto";

/** Unguessable admin cookie token derived from ADMIN_PASSWORD (server-only). */
export function adminToken(): string {
  const pw = process.env.ADMIN_PASSWORD || "";
  return pw ? createHash("sha256").update(pw + ":electric-buggies-admin").digest("hex") : "";
}
