import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { adminToken } from "@/lib/admin";
import { rateLimited, clientIp } from "@/lib/rate-limit";

/** Constant-time string compare (avoids length/timing leaks). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Admin auth (brief §8): password → httpOnly signed cookie. Gate is the
 *  ADMIN_PASSWORD env; cookie value is an unguessable hash so it can't be
 *  forged. Rate-limited + constant-time compare to resist brute force. */
export async function POST(req: Request) {
  if (rateLimited("admin-login", clientIp(req), 5, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts, try again shortly." }, { status: 429 });
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ ok: false, error: "Admin not configured (set ADMIN_PASSWORD)." }, { status: 503 });
  let password = "";
  try { password = (await req.json()).password ?? ""; } catch { /* */ }
  if (!safeEqual(password, expected)) return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("eb_admin", adminToken(), {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("eb_admin", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
