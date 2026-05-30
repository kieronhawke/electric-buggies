"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { db, schema } from "./db";
import { logAudit, nextReference } from "./portal-ops";
import { SALES_TEAM } from "./crm-constants";

export type CrmActionState = { ok: boolean; error?: string; ref?: string } | null;

const DEAL_STAGES = ["new", "contacted", "quote_sent", "negotiation", "won", "lost"] as const;
type DealStage = (typeof DEAL_STAGES)[number];

export async function moveDeal(dealId: string, toStage: string): Promise<CrmActionState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  if (!DEAL_STAGES.includes(toStage as DealStage)) return { ok: false, error: "Invalid stage." };
  await db.update(schema.deal).set({ stage: toStage as DealStage, updatedAt: new Date() }).where(eq(schema.deal.id, dealId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "deal.move", entityType: "deal", entityId: dealId, detail: { toStage } });
  revalidatePath("/admin/crm");
  return { ok: true };
}

export async function createDeal(form: { name: string; email: string; company?: string; value?: number; note?: string }): Promise<CrmActionState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const name = form.name.trim().slice(0, 120);
  const email = form.email.trim().slice(0, 160);
  if (!name || !email) return { ok: false, error: "Name and email are required." };
  await db.insert(schema.deal).values({ id: crypto.randomUUID(), name, email, company: form.company?.trim().slice(0, 120) || null, value: form.value ?? null, note: form.note?.trim().slice(0, 2000) || null, stage: "new", source: "manual", position: 0 });
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "deal.create", entityType: "deal", entityId: email });
  revalidatePath("/admin/crm");
  return { ok: true };
}

/** Assign (or reassign) a salesperson to a deal. */
export async function assignDeal(dealId: string, assigneeName: string): Promise<CrmActionState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const name = assigneeName.trim().slice(0, 120);
  if (!SALES_TEAM.includes(name as (typeof SALES_TEAM)[number])) return { ok: false, error: "Pick a salesperson from the team." };
  await db.update(schema.deal).set({ assigneeName: name, updatedAt: new Date() }).where(eq(schema.deal.id, dealId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "deal.assign", entityType: "deal", entityId: dealId, detail: { assigneeName: name } });
  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/${dealId}`);
  return { ok: true };
}

/** Pull an abandoned lead into the pipeline as a new deal, then mark it done. */
export async function addLeadToPipeline(leadId: string): Promise<CrmActionState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const [lead] = await db.select().from(schema.abandonedLead).where(eq(schema.abandonedLead.id, leadId)).limit(1);
  if (!lead) return { ok: false, error: "Lead not found." };
  const email = lead.email.trim().slice(0, 160);
  const name = (lead.name?.trim() || email.split("@")[0] || "New lead").slice(0, 120);
  await db.insert(schema.deal).values({
    id: crypto.randomUUID(), name, email, modelSlug: lead.modelSlug || null,
    stage: "new", source: lead.flow, note: `From abandoned ${lead.flow} form`, position: 0,
  });
  await db.update(schema.abandonedLead).set({ completed: true }).where(eq(schema.abandonedLead.id, lead.id));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "lead.to_pipeline", entityType: "deal", entityId: email, detail: { flow: lead.flow } });
  revalidatePath("/admin/crm");
  return { ok: true };
}

/** Convert a won deal into an order (carrying the saved build through). */
export async function convertDealToOrder(dealId: string): Promise<CrmActionState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const [deal] = await db.select().from(schema.deal).where(eq(schema.deal.id, dealId)).limit(1);
  if (!deal) return { ok: false, error: "Deal not found." };
  if (deal.orderId) return { ok: false, error: "Already converted." };

  // Match (or note) the customer by email; orders require a user account.
  const [existingUser] = await db.select().from(schema.user).where(eq(schema.user.email, deal.email)).limit(1);
  if (!existingUser) return { ok: false, error: "No customer account for this email yet. Ask them to register, then convert." };

  const ref = await nextReference("EB-2026", schema.order); // sequential
  const orderId = crypto.randomUUID();
  await db.insert(schema.order).values({
    id: orderId, reference: ref, userId: existingUser.id, stage: "confirmed",
    modelSlug: "bespoke", modelName: "Bespoke build", configuration: deal.build ? { build: deal.build } : null,
    totalAmount: deal.value ?? 0, currency: "GBP",
  });
  await db.insert(schema.orderEvent).values({ id: crypto.randomUUID(), orderId, stage: "confirmed", title: "Order confirmed", detail: "Converted from your enquiry.", customerVisible: true });
  await db.update(schema.deal).set({ stage: "won", orderId, updatedAt: new Date() }).where(eq(schema.deal.id, dealId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "deal.convert", entityType: "deal", entityId: dealId, detail: { orderRef: ref } });
  if (existingUser.notifyEmail) {
    try {
      const [created] = await db.select().from(schema.order).where(eq(schema.order.id, orderId)).limit(1);
      const { sendOrderConfirmed } = await import("./emails/order-mail");
      if (created) await sendOrderConfirmed(created as never, existingUser);
    } catch (err) { console.error("Order-confirmed email failed:", err); }
  }
  revalidatePath("/admin/crm");
  revalidatePath("/admin/orders");
  return { ok: true, ref };
}
