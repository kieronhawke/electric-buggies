"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { db, schema } from "./db";
import { logAudit } from "./portal-ops";

export type MktState = { ok: boolean; error?: string } | null;

export async function createCampaign(form: { name: string; channel: string; budgetPounds: number; startDate?: string; endDate?: string; note?: string }): Promise<MktState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const name = form.name.trim().slice(0, 160);
  if (!name) return { ok: false, error: "Name is required." };
  const channel = ["email", "google_ads", "social", "other"].includes(form.channel) ? form.channel : "other";
  await db.insert(schema.campaign).values({
    id: crypto.randomUUID(), name, channel, status: "active", budget: Math.round((form.budgetPounds || 0) * 100), spent: 0,
    startDate: form.startDate ? new Date(form.startDate) : null, endDate: form.endDate ? new Date(form.endDate) : null, note: form.note?.slice(0, 1000) || null,
  });
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "campaign.create", entityType: "campaign", entityId: name });
  revalidatePath("/admin/marketing");
  return { ok: true };
}

export async function updateCampaignMetrics(id: string, spentPounds: number, leads: number, conversions: number): Promise<MktState> {
  await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  await db.update(schema.campaign).set({ spent: Math.round((spentPounds || 0) * 100), leads: Math.max(0, leads | 0), conversions: Math.max(0, conversions | 0) }).where(eq(schema.campaign.id, id));
  revalidatePath("/admin/marketing");
  return { ok: true };
}

export async function logEnquiry(form: { name: string; email: string; source: string; subject?: string; message: string }): Promise<MktState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const name = form.name.trim().slice(0, 120);
  const email = form.email.trim().slice(0, 160);
  const message = form.message.trim().slice(0, 2000);
  if (!name || !email || !message) return { ok: false, error: "Name, email and message are required." };
  const source = ["web", "phone", "email", "event"].includes(form.source) ? form.source : "web";
  await db.insert(schema.enquiry).values({ id: crypto.randomUUID(), name, email, source, subject: form.subject?.slice(0, 160) || null, message, status: "new" });
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "enquiry.log", entityType: "enquiry", entityId: email });
  revalidatePath("/admin/enquiries");
  return { ok: true };
}

export async function markEnquiryHandled(id: string): Promise<MktState> {
  await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  await db.update(schema.enquiry).set({ status: "handled" }).where(eq(schema.enquiry.id, id));
  revalidatePath("/admin/enquiries");
  return { ok: true };
}
