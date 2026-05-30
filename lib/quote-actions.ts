"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { db, schema } from "./db";
import { logAudit, nextReference } from "./portal-ops";
import { sendEmail, emailLayout } from "./email";
import { site } from "./site";

export type QuoteActionState = { ok: boolean; error?: string; token?: string } | null;

const gbp = (p: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(p / 100);

/** Admin issues a quote with optional model, % discount and inclusions.
 *  Emailed to the customer + visible at a tokenised link + in their account. */
export async function createQuote(form: {
  customerName: string; customerEmail: string; modelSlug?: string; modelName?: string;
  basePounds: number; discountPct: number; inclusions: string[]; estDelivery?: string; validDays: number; dealId?: string;
}): Promise<QuoteActionState> {
  const actor = await requireRole(["admin", "finance", "sales"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const name = form.customerName.trim().slice(0, 120);
  const email = form.customerEmail.trim().slice(0, 160);
  if (!name || !email || !(form.basePounds > 0)) return { ok: false, error: "Name, email and price are required." };

  const pct = Math.min(90, Math.max(0, Math.round(form.discountPct || 0)));
  const original = Math.round(form.basePounds * 100);
  const total = Math.round(original * (1 - pct / 100));
  const savings = original - total;
  const inclusions = (form.inclusions || []).filter(Boolean).slice(0, 12);
  const label = `${form.modelName || "Bespoke build"}, configured to your brief`;

  const [existingUser] = await db.select().from(schema.user).where(eq(schema.user.email, email)).limit(1);
  const reference = await nextReference("EB-Q", schema.quote);
  const token = crypto.randomUUID().replace(/-/g, "");
  const validUntil = new Date(Date.now() + (form.validDays || 30) * 86400000);
  const estDelivery = form.estDelivery && /^\d{4}-\d{2}-\d{2}$/.test(form.estDelivery) ? new Date(form.estDelivery) : null;

  await db.insert(schema.quote).values({
    id: crypto.randomUUID(), reference, userId: existingUser?.id ?? null, customerEmail: email, customerName: name,
    status: "sent", modelSlug: form.modelSlug || null, lineItems: [{ label, amount: original }],
    originalTotal: original, discountPct: pct, total, inclusions, estDelivery, validUntil, sentAt: new Date(), accessToken: token,
  });
  if (form.dealId) await db.update(schema.deal).set({ stage: "quote_sent", updatedAt: new Date() }).where(eq(schema.deal.id, form.dealId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "quote.create", entityType: "quote", entityId: reference });

  const url = `${site.url}/q/${token}`;
  const incHtml = inclusions.length ? `<p style="margin-top:14px"><b>Included:</b></p><ul>${inclusions.map((i) => `<li>${i}</li>`).join("")}</ul>` : "";
  const priceHtml = pct > 0
    ? `<p style="font-size:15px">Was <s>${gbp(original)}</s>, now <b style="font-size:20px">${gbp(total)}</b> <span style="color:#047857">(save ${gbp(savings)}, ${pct}% off)</span></p>`
    : `<p style="font-size:20px"><b>${gbp(total)}</b></p>`;
  const body = `<p>Hi ${name}, your quote ${reference} for the ${form.modelName || "your build"} is ready.</p>${priceHtml}${incHtml}<p style="margin-top:14px;color:#5b6066">Valid until ${validUntil.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>`;
  await sendEmail({ to: email, subject: `Your Electric Buggies quote ${reference}${pct > 0 ? `, save ${gbp(savings)}` : ""}`, html: emailLayout("Your quote is ready", body, { label: "View your quote", url }) });
  revalidatePath("/admin/quotes");
  return { ok: true, token };
}

// ── Quote Generator (inventory-aware, server-authoritative profit) ──────────
const HIGH_VALUE_PENCE = 5_000_000; // quotes >= £50k flag for second sign-off

export interface GenerateQuoteForm {
  itemId?: string; modelSlug?: string; modelName?: string;
  customerName: string; customerEmail: string; dealId?: string;
  unitBasePounds: number; markupPct: number; discountPct: number;
  fees: { label: string; amount: number }[]; // pence
  inclusions: string[]; estDelivery?: string; validDays: number; quantity: number;
  confirmedBelowCost?: boolean;
}

export type GenerateState = { ok: boolean; error?: string; token?: string; warnBelowCost?: boolean } | null;

/**
 * Create a customer quote from an inventory item. The cost stack and profit are
 * recomputed SERVER-SIDE from the item (the client estimate is never trusted),
 * stored as internal snapshots, and never serialised to the customer.
 */
export async function generateQuote(form: GenerateQuoteForm): Promise<GenerateState> {
  const actor = await requireRole(["admin", "finance", "sales"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const name = form.customerName.trim().slice(0, 120);
  const email = form.customerEmail.trim().slice(0, 160);
  if (!name || !email) return { ok: false, error: "Customer name and email are required." };
  if (!(form.unitBasePounds > 0)) return { ok: false, error: "Enter a base price." };

  const { applyMarkup, applyDiscountPct, computeProfit, MARGIN_THIN } = await import("./costing");
  const qty = Math.min(500, Math.max(1, Math.round(form.quantity) || 1));
  const markupPct = Math.min(500, Math.max(0, Math.round(form.markupPct || 0)));
  const discountPct = Math.min(90, Math.max(0, Math.round(form.discountPct || 0)));

  // Authoritative unit cost from the inventory item (if linked).
  let unitCost = 0; let costSnapshot: unknown = null; let modelSlug = form.modelSlug || null; let modelName = form.modelName || "Bespoke build";
  if (form.itemId) {
    const { enrich } = await import("./inventory-data");
    const [item] = await db.select().from(schema.inventoryItem).where(eq(schema.inventoryItem.id, form.itemId)).limit(1);
    if (item) {
      const e = enrich(item);
      unitCost = e.stack.totalCost;
      costSnapshot = { stack: e.stack, unitCost, qty };
      modelSlug = item.modelSlug || modelSlug;
      modelName = item.name;
    }
  }

  const unitBase = Math.round(form.unitBasePounds * 100);
  const unitMarked = applyMarkup(unitBase, markupPct);
  const { was, now, saving } = applyDiscountPct(unitMarked, discountPct);
  const fees = (form.fees || []).filter((f) => f && f.label).map((f) => ({ label: String(f.label).slice(0, 80), amount: Math.max(0, Math.round(f.amount) || 0) })).slice(0, 20);
  const feesTotal = fees.reduce((s, f) => s + f.amount, 0);
  const total = now * qty + feesTotal;
  const originalTotal = was * qty + feesTotal;

  // Server-authoritative profit (fees count as revenue; cost is landed cost x qty).
  const profit = computeProfit(unitCost * qty, total);
  const belowCost = unitCost > 0 && now < unitCost;
  if (belowCost && !form.confirmedBelowCost) {
    return { ok: false, warnBelowCost: true, error: `This price is below the landed cost of ${gbp(unitCost)} per unit. Confirm to proceed.` };
  }
  const approvalRequired = (unitCost > 0 && profit.marginPct < MARGIN_THIN) || total >= HIGH_VALUE_PENCE;

  const inclusions = (form.inclusions || []).filter(Boolean).slice(0, 12);
  const [existingUser] = await db.select().from(schema.user).where(eq(schema.user.email, email)).limit(1);
  const reference = await nextReference("EB-Q", schema.quote);
  const token = crypto.randomUUID().replace(/-/g, "");
  const validUntil = new Date(Date.now() + (form.validDays || 30) * 86400000);
  const estDelivery = form.estDelivery && /^\d{4}-\d{2}-\d{2}$/.test(form.estDelivery) ? new Date(form.estDelivery) : null;

  const lineItems = [{ label: `${modelName}${qty > 1 ? ` x ${qty}` : ""}`, amount: now * qty }, ...fees.map((f) => ({ label: f.label, amount: f.amount }))];

  await db.insert(schema.quote).values({
    id: crypto.randomUUID(), reference, dealId: form.dealId || null, userId: existingUser?.id ?? null,
    customerEmail: email, customerName: name, status: "sent", modelSlug,
    lineItems, originalTotal, discountPct, total, inclusions, estDelivery, validUntil, sentAt: new Date(),
    accessToken: token, itemId: form.itemId || null, quantity: qty, unitPrice: now, markupPct,
    feesApplied: fees, costSnapshot, profitSnapshot: { profit: profit.profit, marginPct: profit.marginPct, band: profit.band },
    approvalRequired, createdByName: actor.name,
  });
  if (form.dealId) await db.update(schema.deal).set({ stage: "quote_sent", updatedAt: new Date() }).where(eq(schema.deal.id, form.dealId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "quote.generate", entityType: "quote", entityId: reference, detail: { total, marginPct: Math.round(profit.marginPct), approvalRequired } });

  // Follow-up tasks (email + call) with due dates, for the sales dashboard.
  const due = (d: number) => new Date(Date.now() + d * 86400000);
  await db.insert(schema.task).values([
    { id: crypto.randomUUID(), type: "follow_up_email", title: `Follow up by email on quote ${reference}`, relatedType: "quote", relatedId: reference, dueDate: due(3), assigneeName: actor.name, status: "open" },
    { id: crypto.randomUUID(), type: "follow_up_call", title: `Follow up by phone on quote ${reference}`, relatedType: "quote", relatedId: reference, dueDate: due(7), assigneeName: actor.name, status: "open" },
  ]);

  // Customer email contains ONLY customer-facing fields (no cost/profit).
  const url = `${site.url}/q/${token}`;
  const incHtml = inclusions.length ? `<p style="margin-top:14px"><b>Included:</b></p><ul>${inclusions.map((i) => `<li>${i}</li>`).join("")}</ul>` : "";
  const feeHtml = fees.length ? `<ul style="margin-top:8px">${fees.map((f) => `<li>${f.label}: ${gbp(f.amount)}</li>`).join("")}</ul>` : "";
  const priceHtml = discountPct > 0
    ? `<p style="font-size:15px">Was <s>${gbp(originalTotal)}</s>, now <b style="font-size:20px">${gbp(total)}</b> <span style="color:#047857">(save ${gbp(originalTotal - total)})</span></p>`
    : `<p style="font-size:20px"><b>${gbp(total)}</b></p>`;
  const body = `<p>Hi ${name}, your quote ${reference} for the ${modelName}${qty > 1 ? ` (${qty} units)` : ""} is ready.</p>${priceHtml}${feeHtml}${incHtml}<p style="margin-top:14px;color:#5b6066">Valid until ${validUntil.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>`;
  await sendEmail({ to: email, subject: `Your Electric Buggies quote ${reference}`, html: emailLayout("Your quote is ready", body, { label: "View your quote", url }) });

  revalidatePath("/admin/quotes");
  return { ok: true, token };
}

/** Second sign-off for a flagged (low-margin / high-value) quote. */
export async function approveQuote(quoteId: string): Promise<QuoteActionState> {
  const actor = await requireRole(["admin", "finance"]);
  if (!db) return { ok: false, error: "Unavailable." };
  await db.update(schema.quote).set({ approvalRequired: false, approvedBy: actor.name, approvedAt: new Date(), updatedAt: new Date() }).where(eq(schema.quote.id, quoteId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "quote.approve", entityType: "quote", entityId: quoteId });
  revalidatePath("/admin/quotes");
  return { ok: true };
}

/** Mark a quote as viewed when the customer opens its public link. */
export async function markQuoteViewed(token: string) {
  if (!db) return;
  const [q] = await db.select().from(schema.quote).where(eq(schema.quote.accessToken, token)).limit(1);
  if (q && !q.viewedAt) {
    await db.update(schema.quote).set({ viewedAt: new Date(), status: q.status === "sent" ? "viewed" : q.status }).where(eq(schema.quote.id, q.id));
  }
}

/** Public response to a quote (accept/decline) via its unguessable token. */
export async function respondQuote(token: string, accept: boolean): Promise<QuoteActionState> {
  if (!db) return { ok: false, error: "Unavailable." };
  const [q] = await db.select().from(schema.quote).where(eq(schema.quote.accessToken, token)).limit(1);
  if (!q) return { ok: false, error: "Quote not found." };
  if (q.status === "accepted" || q.status === "declined") return { ok: false, error: "Already responded." };
  const status = accept ? "accepted" : "declined";
  await db.update(schema.quote).set({ status, respondedAt: new Date(), acceptedAt: accept ? new Date() : null, updatedAt: new Date() }).where(eq(schema.quote.id, q.id));
  await logAudit({ action: "quote.respond", entityType: "quote", entityId: q.reference, detail: { status } });
  const zapier = process.env.ZAPIER_WEBHOOK_URL;
  if (zapier) { try { await fetch(zapier, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "quote_response", reference: q.reference, status, email: q.customerEmail }) }); } catch { /* */ } }
  revalidatePath(`/q/${token}`);
  return { ok: true };
}
