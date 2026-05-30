"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { db, schema } from "./db";
import {
  STAGE_NOTIFICATION, channelsForUser, sendNotifications, logAudit, addOrderEvent,
  nextReference, TNCS_VERSION,
} from "./portal-ops";
import { STAGE_LABEL, type OrderStage } from "./orders";

type Channel = "email" | "sms" | "whatsapp";
export type AdminActionState = { ok: boolean; error?: string; message?: string } | null;

async function orderWithCustomer(orderId: string) {
  const [o] = await db!.select().from(schema.order).where(eq(schema.order.id, orderId)).limit(1);
  if (!o) return null;
  const [u] = await db!.select().from(schema.user).where(eq(schema.user.id, o.userId)).limit(1);
  return o && u ? { order: o, customer: u } : null;
}

/**
 * Advance an order to a stage, with explicit notification control. Only finance
 * may set payment_received. Side effects: creates contract/payment on the
 * relevant stages and a fleet vehicle on delivery. Always audited.
 */
export async function advanceStage(
  orderId: string,
  toStage: OrderStage,
  notify: boolean,
  channels: Channel[],
): Promise<AdminActionState> {
  // Only finance may confirm payment received; admin/finance drive other stages.
  const roles = toStage === "payment_received" ? (["finance"] as const) : (["admin", "finance"] as const);
  const actor = await requireRole([...roles]);
  if (!db) return { ok: false, error: "Unavailable." };
  const ctx = await orderWithCustomer(orderId);
  if (!ctx) return { ok: false, error: "Order not found." };
  const { order, customer } = ctx;
  const from = order.stage as OrderStage;

  await db.update(schema.order).set({ stage: toStage, updatedAt: new Date() }).where(eq(schema.order.id, orderId));

  // Side effects.
  if (toStage === "contract_sent") {
    const existing = await db.select().from(schema.contract).where(eq(schema.contract.orderId, orderId)).limit(1);
    if (existing.length === 0) {
      await db.insert(schema.contract).values({ id: crypto.randomUUID(), orderId, status: "sent", tncsVersion: TNCS_VERSION });
    }
  }
  if (toStage === "payment_pending") {
    const existing = await db.select().from(schema.payment).where(eq(schema.payment.orderId, orderId)).limit(1);
    if (existing.length === 0) {
      const reference = await nextReference("EB-PAY", schema.payment);
      await db.insert(schema.payment).values({ id: crypto.randomUUID(), orderId, reference, amount: order.totalAmount, currency: order.currency, status: "pending" });
    }
  }
  if (toStage === "payment_received") {
    await db.update(schema.payment).set({ status: "received", confirmedAt: new Date(), confirmedBy: actor.id }).where(eq(schema.payment.orderId, orderId));
  }
  if (toStage === "delivered") {
    const existing = await db.select().from(schema.vehicle).where(eq(schema.vehicle.orderId, orderId)).limit(1);
    if (existing.length === 0) {
      await db.insert(schema.vehicle).values({
        id: crypto.randomUUID(), userId: order.userId, orderId, modelName: order.modelName,
        spec: order.configuration as object, deliveredAt: new Date(),
        warrantyEnd: new Date(Date.now() + 3 * 365 * 86400000),
      });
    }
  }

  await addOrderEvent(orderId, toStage, STAGE_LABEL[toStage], `Stage updated by ${actor.name}.`, true);

  let sentTo: Channel[] = [];
  const def = STAGE_NOTIFICATION[toStage];
  if (notify && def) {
    sentTo = channelsForUser(customer, channels.length ? channels : def.channels);
    if (sentTo.length) {
      await sendNotifications({ orderId, recipient: customer.email, recipientName: customer.name, channels: sentTo, event: def.event, subject: def.subject, message: def.message });
    }
  }

  await logAudit({ actorId: actor.id, actorName: actor.name, action: "order.stage_change", entityType: "order", entityId: orderId, detail: { from, to: toStage, notified: notify, channels: sentTo } });

  revalidatePath(`/admin/orders/${order.reference}`);
  revalidatePath(`/account/orders/${order.reference}`);
  return { ok: true, message: `Moved to ${STAGE_LABEL[toStage]}${sentTo.length ? `, notified by ${sentTo.join(", ")}` : ", no notification sent"}.` };
}

export async function addNote(orderId: string, body: string, customerVisible: boolean): Promise<AdminActionState> {
  const actor = await requireRole(["admin", "finance"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const text = body.trim().slice(0, 4000);
  if (!text) return { ok: false, error: "Empty note." };
  await db.insert(schema.orderNote).values({ id: crypto.randomUUID(), orderId, authorId: actor.id, authorName: actor.name, body: text, customerVisible });
  if (customerVisible) {
    const [o] = await db.select().from(schema.order).where(eq(schema.order.id, orderId)).limit(1);
    if (o) await addOrderEvent(orderId, o.stage as OrderStage, "Note from the team", text, true);
  }
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "order.note_add", entityType: "order", entityId: orderId, detail: { customerVisible } });
  const [o] = await db.select().from(schema.order).where(eq(schema.order.id, orderId)).limit(1);
  if (o) revalidatePath(`/admin/orders/${o.reference}`);
  return { ok: true };
}

/** Assign an engineer to a service request and advance its status. */
export async function assignEngineer(serviceId: string, engineerId: string): Promise<AdminActionState> {
  const actor = await requireRole(["admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  await db.update(schema.serviceRequest).set({ engineerId, status: "engineer_assigned", updatedAt: new Date() }).where(eq(schema.serviceRequest.id, serviceId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "service.assign", entityType: "service", entityId: serviceId, detail: { engineerId } });
  revalidatePath("/admin/service");
  return { ok: true };
}
