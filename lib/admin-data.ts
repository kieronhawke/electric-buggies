import "server-only";
import { and, desc, eq, asc } from "drizzle-orm";
import { db, schema } from "./db";

export async function getAllOrdersAdmin() {
  if (!db) return [];
  const orders = await db.select().from(schema.order).orderBy(desc(schema.order.createdAt));
  const users = await db.select({ id: schema.user.id, name: schema.user.name, email: schema.user.email }).from(schema.user);
  const byId = new Map(users.map((u) => [u.id, u]));
  return orders.map((o) => ({ ...o, customer: byId.get(o.userId) }));
}

export async function getOrderAdmin(reference: string) {
  if (!db) return null;
  const [order] = await db.select().from(schema.order).where(eq(schema.order.reference, reference)).limit(1);
  if (!order) return null;
  const [customer] = await db.select().from(schema.user).where(eq(schema.user.id, order.userId)).limit(1);
  const events = await db.select().from(schema.orderEvent).where(eq(schema.orderEvent.orderId, order.id)).orderBy(asc(schema.orderEvent.occurredAt));
  const notes = await db.select().from(schema.orderNote).where(eq(schema.orderNote.orderId, order.id)).orderBy(desc(schema.orderNote.createdAt));
  const [contract] = await db.select().from(schema.contract).where(eq(schema.contract.orderId, order.id)).limit(1);
  const [payment] = await db.select().from(schema.payment).where(eq(schema.payment.orderId, order.id)).limit(1);
  const notifications = await db.select().from(schema.notificationLog).where(eq(schema.notificationLog.orderId, order.id)).orderBy(desc(schema.notificationLog.createdAt));
  const audit = await db.select().from(schema.auditLog).where(and(eq(schema.auditLog.entityType, "order"), eq(schema.auditLog.entityId, order.id))).orderBy(desc(schema.auditLog.createdAt));
  return { order, customer, events, notes, contract, payment, notifications, audit };
}

export async function getServicesAdmin() {
  if (!db) return [];
  const services = await db.select().from(schema.serviceRequest).orderBy(desc(schema.serviceRequest.createdAt));
  const users = await db.select({ id: schema.user.id, name: schema.user.name }).from(schema.user);
  const byId = new Map(users.map((u) => [u.id, u.name]));
  const vehicles = await db.select().from(schema.vehicle);
  const vById = new Map(vehicles.map((v) => [v.id, v]));
  return services.map((s) => ({ ...s, customerName: byId.get(s.userId), engineerName: s.engineerId ? byId.get(s.engineerId) : null, vehicle: s.vehicleId ? vById.get(s.vehicleId) : null }));
}

export async function getEngineers() {
  if (!db) return [];
  return db.select({ id: schema.user.id, name: schema.user.name }).from(schema.user).where(eq(schema.user.role, "engineer"));
}

export async function getDealsAdmin() {
  if (!db) return [];
  return db.select().from(schema.deal).orderBy(asc(schema.deal.position), desc(schema.deal.createdAt));
}

export async function getQuotesAdmin() {
  if (!db) return [];
  return db.select().from(schema.quote).orderBy(desc(schema.quote.createdAt));
}
