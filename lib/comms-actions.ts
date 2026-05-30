"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { db, schema } from "./db";
import { logAudit } from "./portal-ops";
import { sanitizeEmailHtml } from "./sanitize-email-html";
import { sendEmail } from "./email";
import { compileTemplate } from "./emails/send";
import { SAMPLE_DATA, templateMeta } from "./emails/registry";
import { DEFAULT_TEMPLATES } from "./emails/defaults";

export type CommsState = { ok: boolean; error?: string; message?: string } | null;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_HTML = 200_000;

// Simple in-memory test-send rate limit (per actor, best-effort on a warm instance).
const sendHits = new Map<string, number[]>();
function rateOk(actorId: string, max = 8, windowMs = 10 * 60_000) {
  const now = Date.now();
  const hits = (sendHits.get(actorId) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  sendHits.set(actorId, hits);
  return true;
}

function validate(input: { subject: string; preheader: string; html: string }): string | null {
  if (!input.subject.trim()) return "Subject is required.";
  if (input.subject.length > 200) return "Subject is too long.";
  if (input.preheader.length > 300) return "Preheader is too long.";
  if (!input.html.trim()) return "Email body is required.";
  if (input.html.length > MAX_HTML) return "Email body is too large.";
  return null;
}

/** Save a template edit: snapshots the current live version, then upserts. */
export async function saveTemplate(key: string, input: { name?: string; subject: string; preheader: string; html: string }): Promise<CommsState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const meta = templateMeta(key);
  if (!meta) return { ok: false, error: "Unknown template." };
  const err = validate(input);
  if (err) return { ok: false, error: err };
  const html = sanitizeEmailHtml(input.html);
  const name = (input.name || meta.name).slice(0, 120);
  const subject = input.subject.trim().slice(0, 200);
  const preheader = input.preheader.trim().slice(0, 300);

  // Snapshot whatever is currently live (override or default) before overwriting.
  const [current] = await db.select().from(schema.emailTemplate).where(eq(schema.emailTemplate.key, key)).limit(1);
  const snapHtml = current?.html ?? DEFAULT_TEMPLATES[key];
  if (snapHtml) {
    await db.insert(schema.emailTemplateVersion).values({
      id: crypto.randomUUID(), templateKey: key, name: current?.name ?? meta.name,
      subject: current?.subject ?? meta.subject, preheader: current?.preheader ?? meta.preheader,
      html: snapHtml, editedByName: current?.updatedByName ?? "Default", createdAt: new Date(),
    });
  }

  if (current) {
    await db.update(schema.emailTemplate).set({ name, subject, preheader, html, updatedByName: actor.name, updatedAt: new Date() }).where(eq(schema.emailTemplate.key, key));
  } else {
    await db.insert(schema.emailTemplate).values({ key, name, subject, preheader, html, updatedByName: actor.name, updatedAt: new Date() });
  }
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "email_template.save", entityType: "email_template", entityId: key, detail: { subject } });
  revalidatePath("/admin/communications");
  revalidatePath(`/admin/communications/${key}`);
  return { ok: true, message: "Template saved. New sends will use this version." };
}

/** Reset a template back to the bundled default (snapshots current first). */
export async function resetTemplate(key: string): Promise<CommsState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const meta = templateMeta(key);
  if (!meta || !DEFAULT_TEMPLATES[key]) return { ok: false, error: "Unknown template." };
  const [current] = await db.select().from(schema.emailTemplate).where(eq(schema.emailTemplate.key, key)).limit(1);
  if (!current) return { ok: true, message: "Already using the default." };
  await db.insert(schema.emailTemplateVersion).values({
    id: crypto.randomUUID(), templateKey: key, name: current.name, subject: current.subject,
    preheader: current.preheader, html: current.html, editedByName: current.updatedByName ?? "Edited", createdAt: new Date(),
  });
  await db.delete(schema.emailTemplate).where(eq(schema.emailTemplate.key, key));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "email_template.reset", entityType: "email_template", entityId: key });
  revalidatePath("/admin/communications");
  revalidatePath(`/admin/communications/${key}`);
  return { ok: true, message: "Reset to the original template." };
}

/** Restore a saved version as the live template. */
export async function revertToVersion(key: string, versionId: string): Promise<CommsState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const [v] = await db.select().from(schema.emailTemplateVersion).where(eq(schema.emailTemplateVersion.id, versionId)).limit(1);
  if (!v || v.templateKey !== key) return { ok: false, error: "Version not found." };
  return saveTemplate(key, { name: v.name, subject: v.subject, preheader: v.preheader, html: v.html });
}

/** Send a test render of the in-editor content to a chosen address. */
export async function sendTestTemplate(to: string, input: { subject: string; preheader: string; html: string }): Promise<CommsState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  if (!EMAIL_RE.test(to.trim())) return { ok: false, error: "Enter a valid email address." };
  const err = validate(input);
  if (err) return { ok: false, error: err };
  if (!rateOk(actor.id)) return { ok: false, error: "Too many test sends. Please wait a few minutes." };
  const html = sanitizeEmailHtml(input.html);
  const { subject, html: rendered, text } = compileTemplate({ subject: input.subject, preheader: input.preheader, html }, SAMPLE_DATA);
  const r = await sendEmail({ to: to.trim(), subject: `[Test] ${subject}`, html: rendered, text });
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "email_template.test_send", entityType: "email", entityId: to.trim(), detail: { subject } });
  if (r.ok === false) return { ok: false, error: "The email provider rejected the send. Check the Resend key/domain." };
  return { ok: true, message: (r as { dev?: boolean }).dev ? "Sent (dev console: no Resend key set)." : `Test sent to ${to.trim()}.` };
}

/** Save a custom / ad-hoc email (draft). */
export async function saveCustomEmail(input: { id?: string; name: string; subject: string; preheader: string; html: string }): Promise<CommsState & { id?: string }> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const name = input.name.trim().slice(0, 120) || "Untitled email";
  const err = validate(input);
  if (err) return { ok: false, error: err };
  const html = sanitizeEmailHtml(input.html);
  const subject = input.subject.trim().slice(0, 200);
  const preheader = input.preheader.trim().slice(0, 300);
  let id = input.id;
  if (id) {
    await db.update(schema.customEmail).set({ name, subject, preheader, html, updatedAt: new Date() }).where(eq(schema.customEmail.id, id));
  } else {
    id = crypto.randomUUID();
    await db.insert(schema.customEmail).values({ id, name, subject, preheader, html, createdByName: actor.name });
  }
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "custom_email.save", entityType: "custom_email", entityId: id, detail: { name } });
  revalidatePath("/admin/communications");
  return { ok: true, message: "Saved.", id };
}
