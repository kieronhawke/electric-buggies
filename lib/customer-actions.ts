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
  await db.update(schema.order).set({ stage: "contract_signed", updatedAt: new Date() }).where(eq(schema.order.id, orderId));
  await addOrderEvent(orderId, "contract_signed", STAGE_LABEL.contract_signed, "Thank you. Your signed contract is saved to your account.", true);
  await logAudit({ actorId: user.id, actorName: user.name, action: "contract.signed", entityType: "order", entityId: orderId, detail: { tncsVersion: c.tncsVersion, signatureName: name } });
  await teamAlert("contract_signed", `${user.name} signed the contract for ${order.reference}.`, orderId);
  revalidatePath(`/account/orders/${order.reference}`);
  return { ok: true, message: "Contract signed. Thank you." };
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

/** Customer requests a service for a fleet vehicle. */
export async function createServiceRequest(vehicleId: string, type: string, description: string): Promise<CustomerActionState> {
  const user = await requireUser();
  if (!db) return { ok: false, error: "Unavailable." };
  const desc = description.trim().slice(0, 2000);
  if (!desc) return { ok: false, error: "Please describe what you need." };
  const t = ["service", "fault", "inspection"].includes(type) ? type : "service";
  const [v] = await db.select().from(schema.vehicle).where(and(eq(schema.vehicle.id, vehicleId), eq(schema.vehicle.userId, user.id))).limit(1);
  if (!v) return { ok: false, error: "Vehicle not found." };
  const reference = await nextReference("EB-SVC", schema.serviceRequest);
  const id = crypto.randomUUID();
  await db.insert(schema.serviceRequest).values({ id, reference, vehicleId, userId: user.id, type: t, description: desc, status: "received" });
  await logAudit({ actorId: user.id, actorName: user.name, action: "service.requested", entityType: "service", entityId: id, detail: { reference, vehicleId } });
  await teamAlert("service_requested", `New ${t} request ${reference} from ${user.name} for ${v.modelName}.`);
  revalidatePath("/account/fleet");
  return { ok: true, message: `Request ${reference} received. Our team will be in touch.` };
}
