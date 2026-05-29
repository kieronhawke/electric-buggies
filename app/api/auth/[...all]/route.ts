import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

const handler = toNextJsHandler(auth);

// Guard: if the database isn't configured yet, return 503 instead of crashing,
// so the rest of the site stays up.
export async function GET(req: Request) {
  if (!dbConfigured) return new Response("Portal not configured", { status: 503 });
  return handler.GET(req);
}
export async function POST(req: Request) {
  if (!dbConfigured) return new Response("Portal not configured", { status: 503 });
  return handler.POST(req);
}
