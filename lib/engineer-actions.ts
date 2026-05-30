"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { db, schema } from "./db";
import { logAudit } from "./portal-ops";

export type EngineerActionState = { ok: boolean; error?: string } | null;

type SvcStatus = "received" | "acknowledged" | "engineer_assigned" | "in_progress" | "resolved";

/** Engineer logs work against an assigned service (builds the service history). */
export async function logServiceWork(
  serviceId: string,
  fields: { workDone: string; diagnosis?: string; parts?: string; minutes?: number; customerVisible: boolean },
): Promise<EngineerActionState> {
  const actor = await requireRole(["engineer", "admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const [svc] = await db.select().from(schema.serviceRequest).where(eq(schema.serviceRequest.id, serviceId)).limit(1);
  if (!svc) return { ok: false, error: "Service not found." };
  if (actor.role === "engineer" && svc.engineerId !== actor.id) return { ok: false, error: "Not assigned to you." };
  const work = fields.workDone.trim().slice(0, 4000);
  if (!work) return { ok: false, error: "Describe the work done." };

  await db.insert(schema.serviceLog).values({
    id: crypto.randomUUID(), serviceRequestId: serviceId, engineerId: actor.id, engineerName: actor.name,
    workDone: work, diagnosis: fields.diagnosis?.trim().slice(0, 2000) || null,
    parts: fields.parts?.trim().slice(0, 1000) || null, minutesSpent: fields.minutes ?? null,
    customerVisible: fields.customerVisible,
  });
  if (svc.status === "engineer_assigned" || svc.status === "acknowledged" || svc.status === "received") {
    await db.update(schema.serviceRequest).set({ status: "in_progress", updatedAt: new Date() }).where(eq(schema.serviceRequest.id, serviceId));
  }
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "service.log", entityType: "service", entityId: serviceId });
  revalidatePath(`/engineer/${serviceId}`);
  return { ok: true };
}

export async function updateServiceStatus(serviceId: string, status: SvcStatus): Promise<EngineerActionState> {
  const actor = await requireRole(["engineer", "admin"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const [svc] = await db.select().from(schema.serviceRequest).where(eq(schema.serviceRequest.id, serviceId)).limit(1);
  if (!svc) return { ok: false, error: "Service not found." };
  if (actor.role === "engineer" && svc.engineerId !== actor.id) return { ok: false, error: "Not assigned to you." };
  await db.update(schema.serviceRequest).set({ status, updatedAt: new Date() }).where(eq(schema.serviceRequest.id, serviceId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "service.status", entityType: "service", entityId: serviceId, detail: { status } });
  revalidatePath(`/engineer/${serviceId}`);
  revalidatePath("/engineer");
  return { ok: true };
}
