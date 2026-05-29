import { NextResponse } from "next/server";
import { adminToken } from "@/lib/admin";

/** Admin auth (brief §8): password → httpOnly signed cookie. Gate is the
 *  ADMIN_PASSWORD env; cookie value is an unguessable hash so it can't be
 *  forged. Set ADMIN_PASSWORD in Vercel to enable /admin. */
export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ ok: false, error: "Admin not configured (set ADMIN_PASSWORD)." }, { status: 503 });
  let password = "";
  try { password = (await req.json()).password ?? ""; } catch { /* */ }
  if (password !== expected) return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });

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
