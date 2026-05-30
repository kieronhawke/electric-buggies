import "server-only";
import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db, schema } from "./db";

/**
 * Seed the portal with one verified user per role and a demo order with a
 * realistic timeline. Idempotent: skips anything that already exists. Used by
 * the local seed script and the one-time /api/admin/setup route.
 */
export async function seedPortal() {
  if (!db) throw new Error("DATABASE_URL not configured");
  const PASSWORD = "EbDemo!2026x";
  const people = [
    { email: "customer@demo.electric-buggies.dev", name: "Olivia Hartwell", role: "customer" as const },
    { email: "admin@demo.electric-buggies.dev", name: "Marcus Reed", role: "admin" as const },
    { email: "finance@demo.electric-buggies.dev", name: "Priya Shah", role: "finance" as const },
    { email: "engineer@demo.electric-buggies.dev", name: "Tom Whitfield", role: "engineer" as const },
  ];
  const created: string[] = [];

  for (const p of people) {
    const existing = await db.select().from(schema.user).where(eq(schema.user.email, p.email)).limit(1);
    if (existing.length === 0) {
      try {
        await auth.api.signUpEmail({ body: { email: p.email, password: PASSWORD, name: p.name } });
      } catch {
        /* may already exist via a partial run */
      }
    }
    await db
      .update(schema.user)
      .set({ role: p.role, emailVerified: true, updatedAt: new Date() })
      .where(eq(schema.user.email, p.email));
    created.push(`${p.role}:${p.email}`);
  }

  const [customer] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, "customer@demo.electric-buggies.dev"))
    .limit(1);

  const REF = "EB-2026-0001";
  const existingOrder = await db.select().from(schema.order).where(eq(schema.order.reference, REF)).limit(1);
  let orderSeeded = false;
  if (customer && existingOrder.length === 0) {
    const day = (d: number) => new Date(Date.now() - d * 86400000);
    const orderId = "ord_demo_0001";
    await db.insert(schema.order).values({
      id: orderId,
      reference: REF,
      userId: customer.id,
      stage: "in_production",
      modelSlug: "the-six",
      modelName: "The Six",
      configuration: {
        colour: "British Racing Green",
        roof: "Hard top",
        wheels: "Noble polished",
        interior: "Tan leather",
        branding: "Estate crest, both doors",
        seats: 6,
      },
      totalAmount: 2895000,
      currency: "GBP",
      estDeliveryStart: new Date(Date.now() + 24 * 86400000),
      estDeliveryEnd: new Date(Date.now() + 38 * 86400000),
      createdAt: day(28),
    });
    const events = [
      { stage: "confirmed", title: "Order confirmed", detail: "Your build was confirmed and a reference assigned.", occurredAt: day(28) },
      { stage: "contract_sent", title: "Contract issued", detail: "Your order contract was prepared and sent for signature.", occurredAt: day(26) },
      { stage: "contract_signed", title: "Contract signed", detail: "Thank you. Your signed contract is saved to your account.", occurredAt: day(25) },
      { stage: "payment_pending", title: "Payment requested", detail: "Bank details and your payment reference were issued.", occurredAt: day(25) },
      { stage: "payment_received", title: "Payment received", detail: "Funds confirmed by our finance team. Production scheduled.", occurredAt: day(21) },
      { stage: "in_production", title: "In production", detail: "Your vehicle has entered the build line at our UK workshop.", occurredAt: day(7) },
    ] as const;
    for (let i = 0; i < events.length; i++) {
      await db.insert(schema.orderEvent).values({
        id: `evt_demo_${i}`,
        orderId,
        stage: events[i].stage,
        title: events[i].title,
        detail: events[i].detail,
        occurredAt: events[i].occurredAt,
        customerVisible: true,
      });
    }
    orderSeeded = true;
  }

  return { users: created, orderSeeded, password: PASSWORD };
}
