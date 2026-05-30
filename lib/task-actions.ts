"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { db, schema } from "./db";
import { logAudit } from "./portal-ops";

export type TaskState = { ok: boolean; error?: string } | null;

/** Sign off a follow-up task (records who completed it and when). */
export async function signOffTask(taskId: string): Promise<TaskState> {
  const actor = await requireRole(["admin", "finance", "sales"]);
  if (!db) return { ok: false, error: "Unavailable." };
  await db.update(schema.task).set({ status: "done", signOffName: actor.name, signOffAt: new Date() }).where(eq(schema.task.id, taskId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "task.signoff", entityType: "task", entityId: taskId });
  revalidatePath("/admin");
  return { ok: true };
}

/** Reopen a completed task. */
export async function reopenTask(taskId: string): Promise<TaskState> {
  const actor = await requireRole(["admin", "finance", "sales"]);
  if (!db) return { ok: false, error: "Unavailable." };
  await db.update(schema.task).set({ status: "open", signOffName: null, signOffAt: null }).where(eq(schema.task.id, taskId));
  revalidatePath("/admin");
  return { ok: true };
}

/** Create a manual task / reminder. */
export async function createTask(form: { type?: string; title: string; relatedType?: string; relatedId?: string; dueDate?: string; assigneeName?: string; note?: string }): Promise<TaskState> {
  const actor = await requireRole(["admin", "finance", "sales"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const title = form.title.trim().slice(0, 200);
  if (!title) return { ok: false, error: "Title is required." };
  await db.insert(schema.task).values({
    id: crypto.randomUUID(), type: form.type || "task", title,
    relatedType: form.relatedType || null, relatedId: form.relatedId || null,
    dueDate: form.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(form.dueDate) ? new Date(form.dueDate) : null,
    assigneeName: form.assigneeName || actor.name, note: form.note?.slice(0, 2000) || null, status: "open",
  });
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "task.create", entityType: "task", entityId: title });
  revalidatePath("/admin");
  return { ok: true };
}
