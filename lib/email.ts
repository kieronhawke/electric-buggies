import "server-only";

/**
 * Email sender. Uses Resend when RESEND_API_KEY is set; otherwise logs to the
 * server console (dev) so verification/reset links are still reachable. No SDK
 * dependency. Plain REST so it degrades gracefully.
 */
type SendArgs = { to: string; subject: string; html: string; text?: string };

const FROM = process.env.EMAIL_FROM || "Electric Buggies <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html, text }: SendArgs) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Dev fallback only: never log recipient/body content in production.
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n[email:dev] → ${to}\n  subject: ${subject}\n  ${text || stripTags(html)}\n`);
    }
    return { ok: true, dev: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html, text: text || stripTags(html) }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("Resend request failed:", err);
    return { ok: false };
  }
}

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Minimal on-brand HTML wrapper (cool monochrome, system-safe). */
export function emailLayout(heading: string, bodyHtml: string, cta?: { label: string; url: string }) {
  const button = cta
    ? `<a href="${cta.url}" style="display:inline-block;background:#0a0a0b;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:2px;font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase">${cta.label}</a>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#f5f6f7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    <div style="font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:13px;margin-bottom:28px">Electric Buggies</div>
    <div style="background:#ffffff;border:1px solid #e3e5e8;border-radius:8px;padding:32px">
      <h1 style="margin:0 0 14px;font-size:22px;line-height:1.2;font-weight:600">${heading}</h1>
      <div style="font-size:15px;line-height:1.6;color:#3f454b">${bodyHtml}</div>
      ${button ? `<div style="margin-top:26px">${button}</div>` : ""}
    </div>
    <div style="font-size:12px;color:#5b6066;margin-top:22px;line-height:1.6">Electric Buggies, United Kingdom. If you did not expect this email you can safely ignore it.</div>
  </div></body></html>`;
}
