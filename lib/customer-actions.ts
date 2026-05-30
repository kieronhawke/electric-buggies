"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireUser } from "./session";
import { db, schema } from "./db";
import { addOrderEvent, logAudit, sendNotifications, nextReference } from "./portal-ops";
import { STAGE_LABEL } from "./orders";

export type CustomerActionState = { ok: boolean; error?: string; message?: string } | null;

async function ownedOrder(userId: string, orderId: string) {
  const [o] = await db!.select().from(schema.order).where(and(eq(schema.order.id, orderId), eq(schema.order.userId, userId))).limit(1);
  return o ?? null;
}

async function teamAlert(event: string, message: string, orderId?: string) {
  const zapier = process.env.ZAPIER_WEBHOOK_URL;
  if (!zapier) return;
  try {
    await fetch(zapier, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "team_alert", event, message, orderId, at: new Date().toISOString() }) });
  } catch { /* best effort */ }
}

/** Customer e-signs the contract: stores name + timestamp + T&Cs version + IP. */
export async function signContract(orderId: string, signatureName: string, acceptedTncs: boolean): Promise<CustomerActionState> {
  const user = await requireUser();
  if (!db) return { ok: false, error: "Unavailable." };
  const name = signatureName.trim().slice(0, 120);
  if (!name) return { ok: false, error: "Please type your full name to sign." };
  if (!acceptedTncs) return { ok: false, error: "Please accept the terms to continue." };
  const order = await ownedOrder(user.id, orderId);
  if (!order) return { ok: false, error: "Order not found." };
  const [c] = await db.select().from(schema.contract).where(eq(schema.contract.orderId, orderId)).limit(1);
  if (!c || c.status === "signed") return { ok: false, error: "No contract awaiting signature." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || null;
  await db.update(schema.contract).set({ status: "signed", signedAt: new Date(), signatureName: name, signedIp: ip }).where(eq(schema.contract.id, c.id));
  await addOrderEvent(orderId, "contract_signed", STAGE_LABEL.contract_signed, "Thank you. Your signed contract is saved to your account.", true);
  await logAudit({ actorId: user.id, actorName: user.name, action: "contract.signed", entityType: "order", entityId: orderId, detail: { tncsVersion: c.tncsVersion, signatureName: name } });

  // Auto-advance straight to payment: create the payment + reference and move
  // the order to payment_pending so the customer sees a clear next step.
  const existingPay = await db.select().from(schema.payment).where(eq(schema.payment.orderId, orderId)).limit(1);
  if (existingPay.length === 0) {
    await db.insert(schema.payment).values({ id: crypto.randomUUID(), orderId, reference: `EB-PAY-${order.reference.slice(-4)}`, amount: order.totalAmount, currency: order.currency, status: "pending" });
  }
  await db.update(schema.order).set({ stage: "payment_pending", updatedAt: new Date() }).where(eq(schema.order.id, orderId));
  await addOrderEvent(orderId, "payment_pending", STAGE_LABEL.payment_pending, "Your payment details and reference are ready below.", true);
  await teamAlert("contract_signed", `${user.name} signed the contract for ${order.reference}; payment requested.`, orderId);

  if (user.notifyEmail) {
    const [pay] = await db.select().from(schema.payment).where(eq(schema.payment.orderId, orderId)).limit(1);
    const { sendOrderStageEmail } = await import("./emails/order-mail");
    await sendOrderStageEmail(order as never, user, "payment_pending", { paymentRef: pay?.reference });
  }
  revalidatePath(`/account/orders/${order.reference}`);
  return { ok: true, message: "Contract signed. Next, complete your payment below." };
}

/** Customer marks the wire transfer as sent (awaits finance confirmation). */
export async function markPaymentSent(orderId: string): Promise<CustomerActionState> {
  const user = await requireUser();
  if (!db) return { ok: false, error: "Unavailable." };
  const order = await ownedOrder(user.id, orderId);
  if (!order) return { ok: false, error: "Order not found." };
  const [p] = await db.select().from(schema.payment).where(eq(schema.payment.orderId, orderId)).limit(1);
  if (!p || p.status === "received") return { ok: false, error: "No payment awaiting." };
  await db.update(schema.payment).set({ status: "sent", markedSentAt: new Date() }).where(eq(schema.payment.id, p.id));
  await addOrderEvent(orderId, order.stage as never, "Payment marked as sent", "Awaiting confirmation from our finance team.", true);
  await logAudit({ actorId: user.id, actorName: user.name, action: "payment.marked_sent", entityType: "order", entityId: orderId, detail: { reference: p.reference } });
  await teamAlert("payment_sent", `${user.name} marked payment sent for ${order.reference} (${p.reference}). Awaiting finance confirmation.`, orderId);
  revalidatePath(`/account/orders/${order.reference}`);
  return { ok: true, message: "Thank you. Our finance team will confirm receipt." };
}

/** Customer chooses preferred delivery dates + slot once ready for delivery. */
export async function chooseDeliveryDates(orderId: string, dates: string[], slot: string): Promise<CustomerActionState> {
  const user = await requireUser();
  if (!db) return { ok: false, error: "Unavailable." };
  const order = await ownedOrder(user.id, orderId);
  if (!order) return { ok: false, error: "Order not found." };
  const clean = dates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 3);
  if (clean.length === 0) return { ok: false, error: "Please choose at least one date." };
  const s = slot === "morning" || slot === "afternoon" ? slot : "morning";
  await db.update(schema.order).set({ deliveryDates: clean, deliverySlot: s, updatedAt: new Date() }).where(eq(schema.order.id, orderId));
  await addOrderEvent(orderId, order.stage as never, "Delivery preferences received", `Preferred dates: ${clean.join(", ")} (${s}). We will confirm your slot.`, true);
  await teamAlert("delivery_dates", `${user.name} chose delivery dates for ${order.reference}: ${clean.join(", ")} (${s}).`, orderId);
  revalidatePath(`/account/orders/${order.reference}`);
  return { ok: true, message: "Thank you. We will confirm your delivery slot shortly." };
}

/** In-account quote request: customer picks a model + details, feeds the CRM. */
export async function requestQuoteInAccount(form: { modelSlug: string; modelName: string; useCase: string; quantity: number; timeframe: string; notes?: string }): Promise<CustomerActionState> {
  const user = await requireUser();
  if (!db) return { ok: false, error: "Unavailable." };
  const qty = Math.min(50, Math.max(1, Math.round(form.quantity) || 1));
  const { modelBySlug } = await import("./data/models");
  const base = modelBySlug(form.modelSlug)?.basePrice ?? 0;
  const note = `${form.useCase} · qty ${qty} · ${form.timeframe}${form.notes ? ` · ${form.notes.trim().slice(0, 500)}` : ""}`;
  const existing = await db.select().from(schema.deal).where(and(eq(schema.deal.email, user.email), eq(schema.deal.stage, "new"))).limit(1);
  if (existing.length) {
    await db.update(schema.deal).set({ modelSlug: form.modelSlug, value: base * 100 * qty, note, nextAction: "Respond to in-account request", updatedAt: new Date() }).where(eq(schema.deal.id, existing[0].id));
  } else {
    await db.insert(schema.deal).values({ id: crypto.randomUUID(), name: user.name, email: user.email, company: user.company, stage: "new", source: "account", value: base * 100 * qty, modelSlug: form.modelSlug, note, nextAction: "Respond to in-account request", userId: user.id, position: 0 });
  }
  await db.insert(schema.enquiry).values({ id: crypto.randomUUID(), name: user.name, email: user.email, source: "web", subject: `Quote request: ${form.modelName}`, message: note, status: "new" });
  await logAudit({ actorId: user.id, actorName: user.name, action: "quote.requested", entityType: "deal", entityId: user.email, detail: { modelSlug: form.modelSlug, quantity: qty } });
  await teamAlert("quote_requested", `${user.name} requested a quote for ${qty}x ${form.modelName} (${form.useCase}).`);
  return { ok: true, message: "Thank you. Our team will prepare your quote and it will appear here." };
}

const SERVICE_TIERS = ["Interim service", "Full service", "Major service"];

/** Customer requests a service for a fleet vehicle (fault / inspection / service). */
export async function createServiceRequest(input: {
  vehicleId: string; type: string; description: string; tier?: string; faultType?: string; severity?: string; preferredDates?: string[];
}): Promise<CustomerActionState> {
  const user = await requireUser();
  if (!db) return { ok: false, error: "Unavailable." };
  const desc = input.description.trim().slice(0, 2000);
  if (!desc) return { ok: false, error: "Please describe what you need." };
  const t = ["service", "fault", "inspection"].includes(input.type) ? input.type : "service";
  const [v] = await db.select().from(schema.vehicle).where(and(eq(schema.vehicle.id, input.vehicleId), eq(schema.vehicle.userId, user.id))).limit(1);
  if (!v) return { ok: false, error: "Vehicle not found." };
  const reference = await nextReference("EB-SVC", schema.serviceRequest);
  const id = crypto.randomUUID();
  await db.insert(schema.serviceRequest).values({
    id, reference, vehicleId: input.vehicleId, userId: user.id, type: t, description: desc, status: "received",
    tier: t === "service" && input.tier && SERVICE_TIERS.includes(input.tier) ? input.tier : null,
    faultType: t === "fault" ? input.faultType?.slice(0, 120) || null : null,
    severity: input.severity && ["low", "medium", "high"].includes(input.severity) ? input.severity : null,
    preferredDates: (input.preferredDates ?? []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 3),
  });
  await logAudit({ actorId: user.id, actorName: user.name, action: "service.requested", entityType: "service", entityId: id, detail: { reference, type: t } });
  await teamAlert("service_requested", `New ${t} request ${reference} from ${user.name} for ${v.modelName}.`);
  revalidatePath("/account/fleet");
  return { ok: true, message: `Request ${reference} received. Our team will be in touch.` };
}
