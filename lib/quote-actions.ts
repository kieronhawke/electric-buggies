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

/** Public response to a quote (accept/decline) via its unguessable token. */
export async function respondQuote(token: string, accept: boolean): Promise<QuoteActionState> {
  if (!db) return { ok: false, error: "Unavailable." };
  const [q] = await db.select().from(schema.quote).where(eq(schema.quote.accessToken, token)).limit(1);
  if (!q) return { ok: false, error: "Quote not found." };
  if (q.status === "accepted" || q.status === "declined") return { ok: false, error: "Already responded." };
  const status = accept ? "accepted" : "declined";
  await db.update(schema.quote).set({ status, respondedAt: new Date(), updatedAt: new Date() }).where(eq(schema.quote.id, q.id));
  await logAudit({ action: "quote.respond", entityType: "quote", entityId: q.reference, detail: { status } });
  const zapier = process.env.ZAPIER_WEBHOOK_URL;
  if (zapier) { try { await fetch(zapier, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "quote_response", reference: q.reference, status, email: q.customerEmail }) }); } catch { /* */ } }
  revalidatePath(`/q/${token}`);
  return { ok: true };
}
