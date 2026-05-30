import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";
import { DEFAULT_TEMPLATES } from "./defaults";
import { templateMeta, type TemplateKey } from "./registry";
import { renderTemplate, htmlToText } from "./render";
import { sendEmail } from "../email";
import { site } from "../site";

/** Resolve a template: DB override if present, else the bundled default. */
export async function getTemplate(key: string) {
  const meta = templateMeta(key);
  if (db) {
    try {
      const [row] = await db.select().from(schema.emailTemplate).where(eq(schema.emailTemplate.key, key)).limit(1);
      if (row) return { key, name: row.name, subject: row.subject, preheader: row.preheader, html: row.html };
    } catch { /* fall through to default */ }
  }
  if (meta && DEFAULT_TEMPLATES[key]) return { key, name: meta.name, subject: meta.subject, preheader: meta.preheader, html: DEFAULT_TEMPLATES[key] };
  return null;
}

/** Compile a template + data into final subject/html/text. */
export function compileTemplate(tpl: { subject: string; preheader: string; html: string }, data: Record<string, string | undefined>) {
  const merged = { ...data, _preheader: renderTemplate(tpl.preheader, data) } as Record<string, string | undefined>;
  return { subject: renderTemplate(tpl.subject, data), html: renderTemplate(tpl.html, merged), text: htmlToText(renderTemplate(tpl.html, merged)) };
}

/** Common links so triggers do not repeat URL building. */
export function accountLinks(extra?: Record<string, string>) {
  return {
    accountLink: `${site.url}/account`,
    privacyLink: `${site.url}/privacy`,
    unsubscribeLink: `${site.url}/account/notifications`,
    phone: site.contact.phoneDisplay,
    ...extra,
  };
}

/** Send a transactional template to one recipient; logs to notification_log. */
export async function sendTemplate(key: TemplateKey, to: string, data: Record<string, string | undefined>, opts?: { orderId?: string }) {
  const tpl = await getTemplate(key);
  if (!tpl) return { ok: false };
  const { subject, html, text } = compileTemplate(tpl, data);
  const r = await sendEmail({ to, subject, html, text });
  if (db) {
    try {
      await db.insert(schema.notificationLog).values({ id: crypto.randomUUID(), orderId: opts?.orderId ?? null, channel: "email", event: key, recipient: to, subject, body: text.slice(0, 2000), ok: r.ok !== false });
    } catch { /* logging is best-effort */ }
  }
  return { ok: r.ok !== false };
}
