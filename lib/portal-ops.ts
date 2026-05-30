import "server-only";
import { eq, desc, sql } from "drizzle-orm";
import { db, schema } from "./db";
import type { OrderStage } from "./orders";
import { STAGE_LABEL } from "./orders";

/** Company bank details for wire payments (env-overridable; placeholder safe). */
export const BANK_DETAILS = {
  accountName: process.env.COMPANY_BANK_NAME || "Electric Buggies Ltd",
  bank: process.env.COMPANY_BANK || "Set your bank in COMPANY_BANK",
  sortCode: process.env.COMPANY_BANK_SORT || "00-00-00",
  accountNumber: process.env.COMPANY_BANK_ACCOUNT || "00000000",
  iban: process.env.COMPANY_BANK_IBAN || "",
  swift: process.env.COMPANY_BANK_SWIFT || "",
};

export const TNCS_VERSION = "v1-2026";

/** Ordered lifecycle. Admin advances most stages; contract/payment also advance
 *  automatically from the customer's actions. */
export const ADVANCE_ORDER: OrderStage[] = [
  "confirmed", "contract_sent", "contract_signed", "payment_pending",
  "payment_received", "in_production", "quality_check", "ready_for_delivery",
  "in_transit", "delivered",
];

/** Customer-facing notification for entering a stage: copy + default channels. */
export const STAGE_NOTIFICATION: Partial<Record<OrderStage, { event: string; subject: string; message: string; channels: ("email" | "sms" | "whatsapp")[] }>> = {
  contract_sent: { event: "contract_sent", subject: "Your contract is ready to sign", message: "Your Electric Buggies contract is ready. Sign it in your account to proceed.", channels: ["email"] },
  payment_pending: { event: "payment_requested", subject: "Payment details for your order", message: "Your payment details and reference are ready in your account.", channels: ["email"] },
  payment_received: { event: "payment_received", subject: "Payment received, production begins", message: "Thank you. We have confirmed your payment and your build is scheduled.", channels: ["email", "sms"] },
  in_production: { event: "in_production", subject: "Your vehicle is in production", message: "Good news. Your vehicle has entered the build line at our UK workshop.", channels: ["email"] },
  quality_check: { event: "quality_check", subject: "Your vehicle is in final checks", message: "Your vehicle is in final quality checks before dispatch.", channels: ["email"] },
  ready_for_delivery: { event: "ready_for_delivery", subject: "Your vehicle is ready for delivery", message: "Your vehicle is ready. We will confirm your delivery date shortly.", channels: ["email", "sms"] },
  in_transit: { event: "in_transit", subject: "Your vehicle is on its way", message: "Your vehicle is in transit. We will confirm arrival details.", channels: ["email", "sms"] },
  delivered: { event: "delivered", subject: "Your vehicle has been delivered", message: "Your vehicle has been delivered. It now appears in Manage My Fleet.", channels: ["email"] },
};

export function channelsForUser(u: { notifyEmail: boolean; notifySms: boolean; notifyWhatsapp: boolean }, requested: ("email" | "sms" | "whatsapp")[]) {
  return requested.filter((c) => (c === "email" && u.notifyEmail) || (c === "sms" && u.notifySms) || (c === "whatsapp" && u.notifyWhatsapp));
}

/** Send notifications across channels: fire Zapier (if set) + record in the log. */
export async function sendNotifications(opts: {
  orderId: string;
  recipient: string;
  recipientName: string;
  channels: ("email" | "sms" | "whatsapp")[];
  event: string;
  subject: string;
  message: string;
}) {
  if (!db) return;
  const zapier = process.env.ZAPIER_WEBHOOK_URL;
  for (const channel of opts.channels) {
    let ok = true;
    if (zapier) {
      try {
        const r = await fetch(zapier, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "order_notification", channel, event: opts.event, to: opts.recipient, name: opts.recipientName, subject: opts.subject, message: opts.message, orderId: opts.orderId, at: new Date().toISOString() }),
        });
        ok = r.ok;
      } catch { ok = false; }
    }
    await db.insert(schema.notificationLog).values({
      id: crypto.randomUUID(), orderId: opts.orderId, channel, event: opts.event,
      recipient: opts.recipient, subject: opts.subject, body: opts.message, ok,
    });
  }
}

export async function logAudit(opts: { actorId?: string | null; actorName?: string | null; action: string; entityType?: string; entityId?: string; detail?: unknown }) {
  if (!db) return;
  await db.insert(schema.auditLog).values({
    id: crypto.randomUUID(), actorId: opts.actorId ?? null, actorName: opts.actorName ?? null,
    action: opts.action, entityType: opts.entityType, entityId: opts.entityId, detail: (opts.detail ?? null) as object,
  });
}

/** Append a customer-visible (or internal) timeline event. */
export async function addOrderEvent(orderId: string, stage: OrderStage, title: string, detail: string, customerVisible = true) {
  if (!db) return;
  await db.insert(schema.orderEvent).values({ id: crypto.randomUUID(), orderId, stage, title, detail, customerVisible });
}

/** Sequential reference helper, e.g. EB-PAY-0007. */
export async function nextReference(prefix: string, table: typeof schema.payment | typeof schema.serviceRequest | typeof schema.quote | typeof schema.order, year = 2026) {
  if (!db) return `${prefix}-0001`;
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(table);
  return `${prefix}-${String((count ?? 0) + 1).padStart(4, "0")}`;
}

export { STAGE_LABEL };

/** KPI snapshot for the admin dashboard. */
export async function adminKpis() {
  if (!db) return { activeOrders: 0, awaitingPayment: 0, openServices: 0, openDeals: 0, recentOrders: [] as (typeof schema.order.$inferSelect)[] };
  const orders = await db.select().from(schema.order).orderBy(desc(schema.order.createdAt));
  const services = await db.select().from(schema.serviceRequest);
  const deals = await db.select().from(schema.deal);
  return {
    activeOrders: orders.filter((o) => o.stage !== "delivered").length,
    awaitingPayment: orders.filter((o) => o.stage === "payment_pending").length,
    openServices: services.filter((s) => s.status !== "resolved").length,
    openDeals: deals.filter((d) => d.stage !== "won" && d.stage !== "lost").length,
    recentOrders: orders.slice(0, 8),
  };
}
