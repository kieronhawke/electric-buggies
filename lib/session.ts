import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db, schema } from "./db";
import type { User } from "./db/schema";

export type Role = "customer" | "admin" | "finance" | "engineer" | "sales";

/** Raw better-auth session (cookie-validated). Null when signed out / no DB. */
export async function getSession() {
  if (!db) return null;
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

/** Authoritative current user row (role/profile read fresh from the DB). */
export async function getCurrentUser(): Promise<User | null> {
  const s = await getSession();
  if (!s?.user?.id || !db) return null;
  const rows = await db.select().from(schema.user).where(eq(schema.user.id, s.user.id)).limit(1);
  return rows[0] ?? null;
}

/** Require any signed-in user; redirect to login with a return path otherwise. */
export async function requireUser(nextPath?: string): Promise<User> {
  const u = await getCurrentUser();
  if (!u) {
    const q = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${q}`);
  }
  return u;
}

/**
 * Require one of the given roles. Signed-out → login; wrong role → that role's
 * own home (no information leak about the protected resource).
 */
export async function requireRole(roles: Role[], nextPath?: string): Promise<User> {
  const u = await requireUser(nextPath);
  if (!roles.includes(u.role as Role)) redirect(homeForRole(u.role as Role));
  return u;
}

export function homeForRole(role: Role): string {
  switch (role) {
    case "admin":
    case "finance":
    case "sales":
      return "/admin";
    case "engineer":
      return "/engineer";
    default:
      return "/account";
  }
}
