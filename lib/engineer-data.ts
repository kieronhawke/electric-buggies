import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "./db";

/** Services visible to an engineer: those assigned to them. Admin sees all. */
export async function getEngineerServices(engineerId: string, isAdmin: boolean) {
  if (!db) return [];
  const rows = isAdmin
    ? await db.select().from(schema.serviceRequest).orderBy(desc(schema.serviceRequest.createdAt))
    : await db.select().from(schema.serviceRequest).where(eq(schema.serviceRequest.engineerId, engineerId)).orderBy(desc(schema.serviceRequest.createdAt));
  const users = await db.select({ id: schema.user.id, name: schema.user.name }).from(schema.user);
  const byId = new Map(users.map((u) => [u.id, u.name]));
  const vehicles = await db.select().from(schema.vehicle);
  const vById = new Map(vehicles.map((v) => [v.id, v]));
  return rows.map((s) => ({ ...s, customerName: byId.get(s.userId), vehicle: s.vehicleId ? vById.get(s.vehicleId) : null }));
}

export async function getServiceDetail(id: string) {
  if (!db) return null;
  const [svc] = await db.select().from(schema.serviceRequest).where(eq(schema.serviceRequest.id, id)).limit(1);
  if (!svc) return null;
  const [customer] = await db.select({ name: schema.user.name, email: schema.user.email }).from(schema.user).where(eq(schema.user.id, svc.userId)).limit(1);
  const vehicle = svc.vehicleId ? (await db.select().from(schema.vehicle).where(eq(schema.vehicle.id, svc.vehicleId)).limit(1))[0] : null;
  const logs = await db.select().from(schema.serviceLog).where(eq(schema.serviceLog.serviceRequestId, id)).orderBy(desc(schema.serviceLog.createdAt));
  return { svc, customer, vehicle, logs };
}
