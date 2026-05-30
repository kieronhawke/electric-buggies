"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "./session";
import { db, schema } from "./db";

export type ActionState = { ok: boolean; error?: string } | null;

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (!db) return { ok: false, error: "The portal is unavailable." };
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") ?? "",
    company: formData.get("company") ?? "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  await db
    .update(schema.user)
    .set({ name: parsed.data.name, phone: parsed.data.phone || null, company: parsed.data.company || null, updatedAt: new Date() })
    .where(eq(schema.user.id, user.id));
  revalidatePath("/account/profile");
  revalidatePath("/account");
  return { ok: true };
}

const EVENT_TYPES = ["orderUpdates", "contract", "payment", "service", "marketing"] as const;

export async function updateNotifications(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (!db) return { ok: false, error: "The portal is unavailable." };
  const on = (k: string) => formData.get(k) === "on";
  const events: Record<string, boolean> = {};
  for (const t of EVENT_TYPES) events[t] = on(`event_${t}`);
  await db
    .update(schema.user)
    .set({
      notifyEmail: on("notifyEmail"),
      notifySms: on("notifySms"),
      notifyWhatsapp: on("notifyWhatsapp"),
      notifyEvents: events,
      updatedAt: new Date(),
    })
    .where(eq(schema.user.id, user.id));
  revalidatePath("/account/notifications");
  return { ok: true };
}
