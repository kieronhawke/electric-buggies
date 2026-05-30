import "server-only";
import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db, schema } from "./db";

const PASSWORD = "EbDemo!2026x";
const uid = () => crypto.randomUUID();
const day = (d: number) => new Date(Date.now() - d * 86400000);
const future = (d: number) => new Date(Date.now() + d * 86400000);

/**
 * Seed rich demo data so every portal screen is reachable and populated:
 * one user per role, orders at every lifecycle stage (sign / pay / choose
 * delivery / delivered), a fleet vehicle, service requests, quotes, CRM deals
 * with salespeople, marketing campaigns and enquiries. Idempotent.
 */
export async function seedPortal() {
  if (!db) throw new Error("DATABASE_URL not configured");

  const people = [
    { email: "customer@demo.electric-buggies.dev", name: "Olivia Hartwell", role: "customer" as const },
    { email: "admin@demo.electric-buggies.dev", name: "Marcus Reed", role: "admin" as const },
    { email: "finance@demo.electric-buggies.dev", name: "Priya Shah", role: "finance" as const },
    { email: "engineer@demo.electric-buggies.dev", name: "Tom Whitfield", role: "engineer" as const },
  ];
  for (const p of people) {
    const existing = await db.select().from(schema.user).where(eq(schema.user.email, p.email)).limit(1);
    if (existing.length === 0) {
      try { await auth.api.signUpEmail({ body: { email: p.email, password: PASSWORD, name: p.name } }); } catch { /* */ }
    }
    await db.update(schema.user).set({ role: p.role, emailVerified: true, phone: p.role === "customer" ? "+44 7700 900123" : null, company: p.role === "customer" ? "Hartwell Estate" : null, updatedAt: new Date() }).where(eq(schema.user.email, p.email));
  }

  const [customer] = await db.select().from(schema.user).where(eq(schema.user.email, "customer@demo.electric-buggies.dev")).limit(1);
  const [engineer] = await db.select().from(schema.user).where(eq(schema.user.email, "engineer@demo.electric-buggies.dev")).limit(1);
  if (!customer) return { ok: false };

  // ── Helper: ensure an order at a given stage with the right side records ──
  async function ensureOrder(ref: string, stage: string, modelSlug: string, modelName: string, total: number, config: Record<string, string | number>) {
    const exists = await db!.select().from(schema.order).where(eq(schema.order.reference, ref)).limit(1);
    if (exists.length) return exists[0];
    const id = `ord_${ref.replace(/-/g, "_").toLowerCase()}`;
    const readyOrLater = ["ready_for_delivery", "in_transit", "delivered"].includes(stage);
    await db!.insert(schema.order).values({
      id, reference: ref, userId: customer.id, stage: stage as never, modelSlug, modelName,
      configuration: config, totalAmount: total, currency: "GBP",
      estDeliveryStart: future(readyOrLater ? 7 : 24), estDeliveryEnd: future(readyOrLater ? 14 : 38), createdAt: day(20),
    });
    // Timeline up to the current stage.
    const flow = ["confirmed", "contract_sent", "contract_signed", "payment_pending", "payment_received", "in_production", "quality_check", "ready_for_delivery", "in_transit", "delivered"];
    const titles: Record<string, string> = { confirmed: "Order confirmed", contract_sent: "Contract issued", contract_signed: "Contract signed", payment_pending: "Payment requested", payment_received: "Payment received", in_production: "In production", quality_check: "Quality check", ready_for_delivery: "Ready for delivery", in_transit: "In transit", delivered: "Delivered" };
    const upto = flow.indexOf(stage);
    for (let i = 0; i <= upto; i++) {
      await db!.insert(schema.orderEvent).values({ id: uid(), orderId: id, stage: flow[i] as never, title: titles[flow[i]], detail: "", customerVisible: true, occurredAt: day(20 - i) });
    }
    // Side records.
    if (flow.indexOf(stage) >= flow.indexOf("contract_sent")) {
      await db!.insert(schema.contract).values({ id: uid(), orderId: id, status: flow.indexOf(stage) >= flow.indexOf("contract_signed") ? "signed" : "sent", tncsVersion: "v1-2026", signedAt: flow.indexOf(stage) >= flow.indexOf("contract_signed") ? day(15) : null, signatureName: flow.indexOf(stage) >= flow.indexOf("contract_signed") ? customer.name : null });
    }
    if (flow.indexOf(stage) >= flow.indexOf("payment_pending")) {
      const pstatus = flow.indexOf(stage) >= flow.indexOf("payment_received") ? "received" : "pending";
      await db!.insert(schema.payment).values({ id: uid(), orderId: id, reference: `EB-PAY-${ref.slice(-4)}`, amount: total, currency: "GBP", status: pstatus, confirmedAt: pstatus === "received" ? day(12) : null });
    }
    if (stage === "delivered") {
      await db!.insert(schema.vehicle).values({ id: `veh_${ref.slice(-4)}`, userId: customer.id, orderId: id, modelName, vin: `EB${ref.slice(-4)}VIN0098`, registration: "EB76 BUG", spec: config, deliveredAt: day(3), warrantyEnd: future(3 * 365) });
    }
    return (await db!.select().from(schema.order).where(eq(schema.order.id, id)).limit(1))[0];
  }

  await ensureOrder("EB-2026-0001", "in_production", "the-six", "The Six", 2895000, { colour: "British Racing Green", roof: "Hard top", wheels: "Noble polished", interior: "Tan leather", seats: 6 });
  await ensureOrder("EB-2026-0002", "confirmed", "the-four", "The Four", 1590000, { colour: "Slate Grey", roof: "Soft top", wheels: "Sport alloy", interior: "Charcoal weave", seats: 4 });
  await ensureOrder("EB-2026-0003", "contract_sent", "the-eight", "The Eight", 3450000, { colour: "Pearl White", roof: "Hard top", wheels: "Noble polished", interior: "Navy leather", seats: 8 });
  await ensureOrder("EB-2026-0004", "payment_pending", "the-two", "The Two", 1190000, { colour: "Estate Green", roof: "Canopy", wheels: "Classic", interior: "Tan", seats: 2 });
  await ensureOrder("EB-2026-0005", "ready_for_delivery", "the-utility", "The Utility", 1690000, { colour: "Graphite", roof: "Hard top", wheels: "All-terrain", interior: "Utility vinyl", seats: 2 });
  const delivered = await ensureOrder("EB-2026-0006", "delivered", "the-four", "The Four", 1620000, { colour: "Oxford Blue", roof: "Soft top", wheels: "Sport alloy", interior: "Charcoal weave", seats: 4 });

  // ── Service requests (for the delivered vehicle) ──
  const [veh] = await db.select().from(schema.vehicle).where(eq(schema.vehicle.orderId, delivered.id)).limit(1);
  if (veh) {
    const svcSeeds = [
      { ref: "EB-SVC-0001", type: "fault", tier: null, faultType: "Battery not holding charge", severity: "high", status: "in_progress", engineerId: engineer?.id, desc: "Range has dropped noticeably over the last fortnight." },
      { ref: "EB-SVC-0002", type: "service", tier: "Full service", faultType: null, severity: null, status: "received", engineerId: null, desc: "Annual full service due." },
      { ref: "EB-SVC-0003", type: "inspection", tier: null, faultType: null, severity: "low", status: "engineer_assigned", engineerId: engineer?.id, desc: "Pre-event inspection requested." },
    ];
    for (const s of svcSeeds) {
      const ex = await db.select().from(schema.serviceRequest).where(eq(schema.serviceRequest.reference, s.ref)).limit(1);
      if (!ex.length) {
        await db.insert(schema.serviceRequest).values({ id: uid(), reference: s.ref, vehicleId: veh.id, userId: customer.id, type: s.type, tier: s.tier, faultType: s.faultType, severity: s.severity, description: s.desc, status: s.status as never, engineerId: s.engineerId ?? null, preferredDates: [future(3).toISOString().slice(0, 10), future(5).toISOString().slice(0, 10)] });
      }
    }
  }

  // ── Quotes (with discount + inclusions) ──
  const qExists = await db.select().from(schema.quote).where(eq(schema.quote.reference, "EB-Q-0001")).limit(1);
  if (!qExists.length) {
    const original = 3100000, pct = 8, total = Math.round(original * (1 - pct / 100));
    await db.insert(schema.quote).values({ id: uid(), reference: "EB-Q-0001", userId: customer.id, customerEmail: customer.email, customerName: customer.name, status: "sent", modelSlug: "the-six", lineItems: [{ label: "The Six, bespoke build", amount: original }], originalTotal: original, discountPct: pct, total, inclusions: ["2-year extended warranty", "6-month complimentary service plan", "Free UK delivery"], estDelivery: future(60), validUntil: future(21), sentAt: day(2), accessToken: "demoquotetoken0001" });
  }

  // ── CRM deals (enriched with salesperson + model) ──
  const sales = ["Marcus Reed", "Hannah Cole", "Marcus Reed", "Hannah Cole", "James Patel"];
  const dealSeeds = [
    { name: "James Aldridge", email: "james@stonehillestate.example", company: "Stonehill Estate", stage: "new", source: "quote", value: 2600000, model: "the-six", note: "Wants a 6-seat for guest transfers.", next: "Send intro pack" },
    { name: "Sofia Marin", email: "events@harbourhotel.example", company: "Harbour Hotel", stage: "contacted", source: "hire", value: 480000, model: "the-eight", note: "Summer event hire, 3 vehicles.", next: "Confirm dates" },
    { name: "Daniel Okafor", email: "ops@cityairport.example", company: "City Airport", stage: "quote_sent", source: "airport", value: 5400000, model: "the-utility", note: "Accessible PRM fleet.", next: "Follow up on quote" },
    { name: "Eleanor Vance", email: "el@manorgolf.example", company: "Manor Golf Club", stage: "negotiation", source: "quote", value: 1900000, model: "the-four", note: "Comparing two configurations.", next: "Revised quote" },
    { name: "Robert King", email: "rk@kingsresort.example", company: "Kings Resort", stage: "won", source: "quote", value: 3200000, model: "the-six", note: "Signed off, awaiting account.", next: "Convert to order" },
  ];
  for (let i = 0; i < dealSeeds.length; i++) {
    const d = dealSeeds[i];
    const ex = await db.select().from(schema.deal).where(eq(schema.deal.email, d.email)).limit(1);
    if (!ex.length) {
      await db.insert(schema.deal).values({ id: uid(), name: d.name, email: d.email, company: d.company, stage: d.stage as never, source: d.source, value: d.value, modelSlug: d.model, note: d.note, nextAction: d.next, assigneeName: sales[i], position: i });
    } else {
      await db.update(schema.deal).set({ modelSlug: d.model, assigneeName: sales[i], nextAction: d.next }).where(eq(schema.deal.email, d.email));
    }
  }

  // ── Marketing campaigns ──
  const campSeeds = [
    { name: "Spring estates email", channel: "email", status: "completed", budget: 0, spent: 0, leads: 42, conversions: 6, note: "Newsletter to estate segment." },
    { name: "Google Ads, golf buggies UK", channel: "google_ads", status: "active", budget: 250000, spent: 138000, leads: 71, conversions: 9, note: "Search campaign, UK." },
    { name: "Resort sector retargeting", channel: "google_ads", status: "active", budget: 180000, spent: 64000, leads: 23, conversions: 3, note: "Display retargeting." },
  ];
  for (const c of campSeeds) {
    const ex = await db.select().from(schema.campaign).where(eq(schema.campaign.name, c.name)).limit(1);
    if (!ex.length) await db.insert(schema.campaign).values({ id: uid(), name: c.name, channel: c.channel, status: c.status, budget: c.budget, spent: c.spent, leads: c.leads, conversions: c.conversions, startDate: day(40), endDate: future(20), note: c.note });
  }

  // ── Customer enquiries log ──
  const enqSeeds = [
    { name: "Priya Nair", email: "priya@greenfields.example", source: "web", subject: "Bespoke 6-seater", message: "Could you build a 6-seat with a cargo bed?" },
    { name: "Tom Bradley", email: "tom@lakesidehotel.example", source: "phone", subject: "Fleet hire", message: "Looking to hire 4 vehicles for a wedding season." },
    { name: "Aisha Khan", email: "aisha@coastalresort.example", source: "email", subject: "Worldwide delivery", message: "Do you deliver to the UAE and service there?" },
  ];
  for (const e of enqSeeds) {
    const ex = await db.select().from(schema.enquiry).where(eq(schema.enquiry.email, e.email)).limit(1);
    if (!ex.length) await db.insert(schema.enquiry).values({ id: uid(), name: e.name, email: e.email, source: e.source, subject: e.subject, message: e.message, status: "new", createdAt: day(Math.floor(Math.random() * 0) + 1) });
  }

  return { ok: true, password: PASSWORD };
}
