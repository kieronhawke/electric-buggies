"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { db, schema } from "./db";
import { logAudit, nextReference } from "./portal-ops";
import { sendEmail, emailLayout } from "./email";
import { site } from "./site";

export type QuoteActionState = { ok: boolean; error?: string; token?: string } | null;

/** Admin issues a quote: emailed to the customer + visible at a tokenised link. */
export async function createQuote(form: { customerName: string; customerEmail: string; totalPounds: number; summary: string; validDays?: number }): Promise<QuoteActionState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const name = form.customerName.trim().slice(0, 120);
  const email = form.customerEmail.trim().slice(0, 160);
  const summary = form.summary.trim().slice(0, 2000);
  if (!name || !email || !summary || !(form.totalPounds > 0)) return { ok: false, error: "Please complete every field." };

  const [existingUser] = await db.select().from(schema.user).where(eq(schema.user.email, email)).limit(1);
  const reference = await nextReference("EB-Q", schema.quote);
  const token = crypto.randomUUID().replace(/-/g, "");
  const total = Math.round(form.totalPounds * 100);
  const validUntil = new Date(Date.now() + (form.validDays ?? 30) * 86400000);

  await db.insert(schema.quote).values({
    id: crypto.randomUUID(), reference, userId: existingUser?.id ?? null, customerEmail: email, customerName: name,
    status: "sent", lineItems: [{ label: summary, amount: total }], total, validUntil, sentAt: new Date(), accessToken: token,
  });
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "quote.create", entityType: "quote", entityId: reference });

  const url = `${site.url}/q/${token}`;
  await sendEmail({ to: email, subject: `Your Electric Buggies quote ${reference}`, html: emailLayout("Your quote is ready", `<p>Hi ${name}, your quote ${reference} is ready to view.</p>`, { label: "View your quote", url }) });
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
