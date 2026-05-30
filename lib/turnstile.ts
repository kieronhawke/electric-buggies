import "server-only";

/**
 * Cloudflare Turnstile server-side verification. Defence-in-depth alongside the
 * honeypot + per-IP rate limiting on the public forms.
 *
 * Graceful degradation:
 *  - No TURNSTILE_SECRET_KEY configured -> returns true (do not block; lets the
 *    forms keep working in dev/preview or before the key is set).
 *  - Secret configured but no/invalid token -> returns false (reject).
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string | undefined | null, ip?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured -> degrade gracefully
  if (!token || typeof token !== "string") return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verify failed:", err);
    return false; // secret present but verification errored -> fail closed
  }
}
