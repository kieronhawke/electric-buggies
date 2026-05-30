import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "./db";
import { DEFAULT_TEMPLATES } from "./emails/defaults";
import { TEMPLATES, templateMeta, type TemplateKey } from "./emails/registry";

export interface TemplateListItem {
  key: TemplateKey;
  name: string;
  purpose: string;
  trigger: string;
  customised: boolean;
  updatedAt: Date | null;
  updatedByName: string | null;
}

/** All 11 templates with their live override status for the manager list. */
export async function listTemplates(): Promise<TemplateListItem[]> {
  const overrides = new Map<string, { updatedAt: Date; updatedByName: string | null }>();
  if (db) {
    try {
      const rows = await db.select().from(schema.emailTemplate);
      for (const r of rows) overrides.set(r.key, { updatedAt: r.updatedAt, updatedByName: r.updatedByName });
    } catch { /* table may not exist yet */ }
  }
  return TEMPLATES.map((t) => {
    const o = overrides.get(t.key);
    return { key: t.key, name: t.name, purpose: t.purpose, trigger: t.trigger, customised: !!o, updatedAt: o?.updatedAt ?? null, updatedByName: o?.updatedByName ?? null };
  });
}

export interface EditableTemplate {
  key: TemplateKey;
  name: string;
  purpose: string;
  trigger: string;
  subject: string;
  preheader: string;
  html: string;
  customised: boolean;
  defaultHtml: string;
  defaultSubject: string;
  defaultPreheader: string;
}

/** One template for the editor: DB override when present, else bundled default. */
export async function getEditableTemplate(key: string): Promise<EditableTemplate | null> {
  const meta = templateMeta(key);
  if (!meta || !DEFAULT_TEMPLATES[key]) return null;
  const base = {
    key: meta.key, name: meta.name, purpose: meta.purpose, trigger: meta.trigger,
    defaultHtml: DEFAULT_TEMPLATES[key], defaultSubject: meta.subject, defaultPreheader: meta.preheader,
  };
  if (db) {
    try {
      const [row] = await db.select().from(schema.emailTemplate).where(eq(schema.emailTemplate.key, key)).limit(1);
      if (row) return { ...base, subject: row.subject, preheader: row.preheader, html: row.html, customised: true };
    } catch { /* fall through */ }
  }
  return { ...base, subject: meta.subject, preheader: meta.preheader, html: DEFAULT_TEMPLATES[key], customised: false };
}

export interface VersionItem { id: string; subject: string; editedByName: string | null; createdAt: Date }

/** Saved version history for a template (newest first). */
export async function getVersions(key: string): Promise<VersionItem[]> {
  if (!db) return [];
  try {
    const rows = await db.select({ id: schema.emailTemplateVersion.id, subject: schema.emailTemplateVersion.subject, editedByName: schema.emailTemplateVersion.editedByName, createdAt: schema.emailTemplateVersion.createdAt })
      .from(schema.emailTemplateVersion).where(eq(schema.emailTemplateVersion.templateKey, key)).orderBy(desc(schema.emailTemplateVersion.createdAt)).limit(20);
    return rows;
  } catch { return []; }
}

export interface CustomEmailItem { id: string; name: string; subject: string; createdByName: string | null; updatedAt: Date }

export async function listCustomEmails(): Promise<CustomEmailItem[]> {
  if (!db) return [];
  try {
    return await db.select({ id: schema.customEmail.id, name: schema.customEmail.name, subject: schema.customEmail.subject, createdByName: schema.customEmail.createdByName, updatedAt: schema.customEmail.updatedAt })
      .from(schema.customEmail).orderBy(desc(schema.customEmail.updatedAt)).limit(50);
  } catch { return []; }
}

export async function getCustomEmail(id: string) {
  if (!db) return null;
  try {
    const [row] = await db.select().from(schema.customEmail).where(eq(schema.customEmail.id, id)).limit(1);
    return row ?? null;
  } catch { return null; }
}
