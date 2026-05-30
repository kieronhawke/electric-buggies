import "server-only";
import { eq, and, desc, asc } from "drizzle-orm";
import { db, schema } from "./db";

export type OrderStage =
  | "confirmed"
  | "contract_sent"
  | "contract_signed"
  | "payment_pending"
  | "payment_received"
  | "in_production"
  | "quality_check"
  | "ready_for_delivery"
  | "in_transit"
  | "delivered";

export const STAGE_ORDER: OrderStage[] = [
  "confirmed",
  "contract_sent",
  "contract_signed",
  "payment_pending",
  "payment_received",
  "in_production",
  "quality_check",
  "ready_for_delivery",
  "in_transit",
  "delivered",
];

/** High-level horizontal tracker steps; each groups one or more fine stages. */
export const TRACKER_STEPS: { key: string; label: string; stages: OrderStage[] }[] = [
  { key: "order", label: "Order", stages: ["confirmed", "contract_sent", "contract_signed"] },
  { key: "payment", label: "Payment", stages: ["payment_pending", "payment_received"] },
  { key: "production", label: "Production", stages: ["in_production"] },
  { key: "quality", label: "Quality", stages: ["quality_check"] },
  { key: "delivery", label: "Delivery", stages: ["ready_for_delivery", "in_transit"] },
  { key: "delivered", label: "Delivered", stages: ["delivered"] },
];

/** Friendly per-stage copy: a reassuring headline and a clear "what's next". */
export const STAGE_META: Record<OrderStage, { headline: string; whatsNext: string }> = {
  confirmed: { headline: "Your order is confirmed", whatsNext: "We will prepare your contract and send it here to sign." },
  contract_sent: { headline: "Your contract is ready to sign", whatsNext: "Review and sign your contract in the account to proceed." },
  contract_signed: { headline: "Contract signed, thank you", whatsNext: "We will issue your payment details and reference shortly." },
  payment_pending: { headline: "Payment details issued", whatsNext: "Transfer the balance using your reference, then mark it as sent." },
  payment_received: { headline: "Payment received", whatsNext: "Your build is scheduled. Production begins shortly." },
  in_production: { headline: "Your vehicle is in production", whatsNext: "Our UK workshop is building your vehicle to your specification." },
  quality_check: { headline: "In final quality checks", whatsNext: "Every system is inspected and signed off before dispatch." },
  ready_for_delivery: { headline: "Ready for delivery", whatsNext: "We are arranging delivery and will confirm your date." },
  in_transit: { headline: "On its way to you", whatsNext: "Your vehicle is in transit. We will confirm arrival details." },
  delivered: { headline: "Delivered, enjoy", whatsNext: "Your vehicle now appears in Manage My Fleet for servicing and support." },
};

export const STAGE_LABEL: Record<OrderStage, string> = {
  confirmed: "Confirmed",
  contract_sent: "Contract sent",
  contract_signed: "Contract signed",
  payment_pending: "Payment requested",
  payment_received: "Payment received",
  in_production: "In production",
  quality_check: "Quality check",
  ready_for_delivery: "Ready for delivery",
  in_transit: "In transit",
  delivered: "Delivered",
};

export function trackerIndexFor(stage: OrderStage): number {
  const i = TRACKER_STEPS.findIndex((s) => s.stages.includes(stage));
  return i < 0 ? 0 : i;
}

export function isActiveOrder(stage: OrderStage) {
  return stage !== "delivered";
}

export function gbpFromPence(pence: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);
}

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
}

/** Narrowing estimated-delivery window with simple delay awareness. */
export function deliveryWindow(o: { estDeliveryStart: Date | null; estDeliveryEnd: Date | null; stage: OrderStage }) {
  if (!o.estDeliveryStart || !o.estDeliveryEnd) return null;
  const start = formatDate(o.estDeliveryStart);
  const end = formatDate(o.estDeliveryEnd);
  const overdue = o.stage !== "delivered" && new Date(o.estDeliveryEnd).getTime() < Date.now();
  return { start, end, overdue };
}

export type OrderWithEvents = typeof schema.order.$inferSelect & {
  events: (typeof schema.orderEvent.$inferSelect)[];
};

export async function getOrdersForUser(userId: string) {
  if (!db) return [];
  return db.select().from(schema.order).where(eq(schema.order.userId, userId)).orderBy(desc(schema.order.createdAt));
}

export async function getVehiclesForUser(userId: string) {
  if (!db) return [];
  return db.select().from(schema.vehicle).where(eq(schema.vehicle.userId, userId)).orderBy(desc(schema.vehicle.createdAt));
}

export async function getServiceRequestsForUser(userId: string) {
  if (!db) return [];
  return db.select().from(schema.serviceRequest).where(eq(schema.serviceRequest.userId, userId)).orderBy(desc(schema.serviceRequest.createdAt));
}

export async function getQuotesForUser(userId: string, email: string) {
  if (!db) return [];
  const rows = await db.select().from(schema.quote).orderBy(desc(schema.quote.createdAt));
  return rows.filter((q) => q.userId === userId || q.customerEmail === email);
}

export async function getOrderByRef(userId: string, reference: string) {
  if (!db) return null;
  const [o] = await db
    .select()
    .from(schema.order)
    .where(and(eq(schema.order.reference, reference), eq(schema.order.userId, userId)))
    .limit(1);
  if (!o) return null;
  const events = await db
    .select()
    .from(schema.orderEvent)
    .where(and(eq(schema.orderEvent.orderId, o.id), eq(schema.orderEvent.customerVisible, true)))
    .orderBy(asc(schema.orderEvent.occurredAt));
  const [contract] = await db.select().from(schema.contract).where(eq(schema.contract.orderId, o.id)).limit(1);
  const [payment] = await db.select().from(schema.payment).where(eq(schema.payment.orderId, o.id)).limit(1);
  return { ...o, events, contract: contract ?? null, payment: payment ?? null };
}
