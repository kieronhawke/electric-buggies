import "server-only";
import { and, eq } from "drizzle-orm";
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
    { email: "sales@demo.electric-buggies.dev", name: "Hannah Cole", role: "sales" as const },
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
  await ensureOrder("EB-2026-0007", "quality_check", "the-six", "The Six", 2750000, { colour: "Midnight Blue", roof: "Hard top", wheels: "Noble polished", interior: "Navy leather", seats: 6 });
  await ensureOrder("EB-2026-0008", "in_transit", "the-eight", "The Eight", 3380000, { colour: "Slate Grey", roof: "Hard top", wheels: "All-terrain", interior: "Charcoal weave", seats: 8 });
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

  // ── Abandoned leads (entered an email in a flow but never submitted) ──
  const leadSeeds = [
    { email: "charlotte@brookhall.example", name: "Charlotte Brook", flow: "quote", modelSlug: "the-six" },
    { email: "events@coastlinehotels.example", name: "Coastline Hotels", flow: "hire", modelSlug: "the-eight" },
    { email: "transfers@gatwickmeet.example", name: null as string | null, flow: "airport", modelSlug: "the-utility" },
  ];
  for (const l of leadSeeds) {
    const ex = await db.select().from(schema.abandonedLead).where(and(eq(schema.abandonedLead.email, l.email), eq(schema.abandonedLead.flow, l.flow))).limit(1);
    if (!ex.length) await db.insert(schema.abandonedLead).values({ id: uid(), email: l.email, name: l.name, flow: l.flow, modelSlug: l.modelSlug, completed: false, createdAt: day(2) });
  }

  // ── Suppliers ──
  const supplierSeeds = [
    { id: "sup_eagle", name: "Suzhou Eagle Electric Vehicle", country: "China", contactName: "Lin Wei", contactEmail: "export@suzhoueagle.example", leadTimeDays: 90, notes: "Primary factory. FOB Shanghai." },
    { id: "sup_marshell", name: "Marshell Green Power", country: "China", contactName: "Chen Yu", contactEmail: "sales@marshell.example", leadTimeDays: 75, notes: "Secondary supplier for utility models." },
  ];
  for (const s of supplierSeeds) {
    const ex = await db.select().from(schema.supplier).where(eq(schema.supplier.id, s.id)).limit(1);
    if (!ex.length) await db.insert(schema.supplier).values({ ...s, createdAt: day(120) });
  }

  // ── Inventory items (full landed-cost stack; all figures are estimates) ──
  const png = (n: string) => [{ url: `/img/email/${n}.png`, primary: true }];
  const invSeeds = [
    { id: "inv_two", sku: "EB-TWO", name: "The Two", modelSlug: "the-two", status: "active", supplierId: "sup_eagle", img: "two",
      factoryFob: 650000, freightInsurance: 120000, otherFees: [{ label: "Customs clearance", amount: 18000 }, { label: "Terminal handling (THC)", amount: 24000 }], ukDelivery: 45000, pdi: 22000, branding: 0, warrantyReserve: 24000,
      rrp: 1190000, targetMarginPct: 32, autoPrice: false, onHand: 5, onOrder: 0, reorder: 2, specs: { seats: "2", range: "45 miles", battery: "5.0 kWh lithium", topSpeed: "25 mph" } },
    { id: "inv_four", sku: "EB-FOUR", name: "The Four", modelSlug: "the-four", status: "active", supplierId: "sup_eagle", img: "four",
      factoryFob: 850000, freightInsurance: 150000, otherFees: [{ label: "Customs clearance", amount: 18000 }, { label: "Terminal handling (THC)", amount: 24000 }, { label: "Marine cargo insurance", amount: 21000 }], ukDelivery: 45000, pdi: 22000, branding: 0, warrantyReserve: 28000,
      rrp: 1590000, targetMarginPct: 34, autoPrice: false, onHand: 3, onOrder: 4, reorder: 2, specs: { seats: "4", range: "55 miles", battery: "7.5 kWh lithium", topSpeed: "25 mph" } },
    { id: "inv_six", sku: "EB-SIX", name: "The Six", modelSlug: "the-six", status: "active", supplierId: "sup_eagle", img: "six",
      factoryFob: 1400000, freightInsurance: 200000, otherFees: [{ label: "Customs clearance", amount: 18000 }, { label: "Terminal handling (THC)", amount: 24000 }, { label: "Drayage / haulage from port", amount: 32000 }], ukDelivery: 45000, pdi: 26000, branding: 0, warrantyReserve: 30000,
      rrp: 2895000, targetMarginPct: 36, autoPrice: false, onHand: 2, onOrder: 2, reorder: 1, specs: { seats: "6", range: "60 miles", battery: "10.0 kWh lithium", topSpeed: "25 mph" } },
    { id: "inv_eight", sku: "EB-EIGHT", name: "The Eight", modelSlug: "the-eight", status: "active", supplierId: "sup_eagle", img: "eight",
      factoryFob: 1700000, freightInsurance: 240000, otherFees: [{ label: "Customs clearance", amount: 18000 }, { label: "Terminal handling (THC)", amount: 24000 }, { label: "Drayage / haulage from port", amount: 32000 }], ukDelivery: 52000, pdi: 28000, branding: 0, warrantyReserve: 34000,
      rrp: 0, targetMarginPct: 35, autoPrice: true, onHand: 0, onOrder: 3, reorder: 1, specs: { seats: "8", range: "55 miles", battery: "12.5 kWh lithium", topSpeed: "25 mph" } },
    { id: "inv_utility", sku: "EB-UTIL", name: "The Utility", modelSlug: "the-utility", status: "active", supplierId: "sup_marshell", img: "utility",
      factoryFob: 900000, freightInsurance: 160000, otherFees: [{ label: "Customs clearance", amount: 18000 }, { label: "Terminal handling (THC)", amount: 24000 }], ukDelivery: 45000, pdi: 24000, branding: 0, warrantyReserve: 26000,
      rrp: 1690000, targetMarginPct: 33, autoPrice: false, onHand: 4, onOrder: 0, reorder: 2, specs: { seats: "2 + cargo", range: "50 miles", battery: "8.0 kWh lithium", topSpeed: "25 mph" } },
    { id: "inv_bespoke", sku: "EB-BESPOKE", name: "Bespoke build", modelSlug: "bespoke", status: "draft", supplierId: "sup_eagle", img: "bespoke",
      factoryFob: 1500000, freightInsurance: 220000, otherFees: [{ label: "Customs clearance", amount: 18000 }], ukDelivery: 50000, pdi: 30000, branding: 40000, warrantyReserve: 32000,
      rrp: 0, targetMarginPct: 40, autoPrice: true, onHand: 0, onOrder: 0, reorder: 0, specs: { seats: "Configurable", range: "Configurable", battery: "Configurable", topSpeed: "25 mph" } },
  ];
  for (const it of invSeeds) {
    const ex = await db.select().from(schema.inventoryItem).where(eq(schema.inventoryItem.sku, it.sku)).limit(1);
    if (!ex.length) {
      await db.insert(schema.inventoryItem).values({
        id: it.id, sku: it.sku, name: it.name, modelSlug: it.modelSlug, status: it.status as never,
        specs: it.specs, photos: png(it.img), supplierId: it.supplierId,
        factoryFob: it.factoryFob, freightInsurance: it.freightInsurance, dutyPct: 10, antiDumping: false,
        vatPct: 20, vatReclaimable: true, otherFees: it.otherFees, ukDelivery: it.ukDelivery, pdi: it.pdi,
        branding: it.branding, warrantyReserve: it.warrantyReserve, rrp: it.rrp, targetMarginPct: it.targetMarginPct,
        autoPrice: it.autoPrice, stockOnHand: it.onHand, stockOnOrder: it.onOrder, stockAllocated: 0,
        reorderPoint: it.reorder, location: "UK warehouse", createdAt: day(100),
      });
    }
  }

  // ── VIN units for in-stock items ──
  const unitSeeds = [
    { id: "unit_six_1", itemId: "inv_six", vin: "EBSIX2026A0001", status: "in_stock" },
    { id: "unit_six_2", itemId: "inv_six", vin: "EBSIX2026A0002", status: "reserved" },
    { id: "unit_four_1", itemId: "inv_four", vin: "EBFOUR2026A0001", status: "in_stock" },
    { id: "unit_two_1", itemId: "inv_two", vin: "EBTWO2026A0001", status: "in_stock" },
  ];
  for (const u of unitSeeds) {
    const ex = await db.select().from(schema.inventoryUnit).where(eq(schema.inventoryUnit.id, u.id)).limit(1);
    if (!ex.length) await db.insert(schema.inventoryUnit).values({ id: u.id, itemId: u.itemId, vin: u.vin, status: u.status, location: "UK warehouse", createdAt: day(60) });
  }

  // ── Purchase orders ──
  const poSeeds = [
    { id: "po_0001", reference: "EB-PO-0001", supplierId: "sup_eagle", itemId: "inv_eight", status: "in_transit", quantity: 3, unitCost: 1940000, expectedAt: future(35) },
    { id: "po_0002", reference: "EB-PO-0002", supplierId: "sup_eagle", itemId: "inv_four", status: "ordered", quantity: 4, unitCost: 1000000, expectedAt: future(70) },
  ];
  for (const p of poSeeds) {
    const ex = await db.select().from(schema.purchaseOrder).where(eq(schema.purchaseOrder.reference, p.reference)).limit(1);
    if (!ex.length) await db.insert(schema.purchaseOrder).values({ id: p.id, reference: p.reference, supplierId: p.supplierId, itemId: p.itemId, status: p.status, quantity: p.quantity, unitCost: p.unitCost, totalCost: p.unitCost * p.quantity, expectedAt: p.expectedAt, createdAt: day(30) });
  }

  // ── Tasks / follow-ups (some overdue, one signed off) ──
  const taskSeeds = [
    { id: "task_1", type: "follow_up_call", title: "Call James Aldridge re: 6-seat fleet", relatedType: "deal", relatedId: "james@stonehillestate.example", due: future(1), assignee: "Marcus Reed", status: "open", sign: null },
    { id: "task_2", type: "follow_up_email", title: "Send revised quote to Manor Golf Club", relatedType: "deal", relatedId: "el@manorgolf.example", due: day(1), assignee: "Hannah Cole", status: "open", sign: null },
    { id: "task_3", type: "reminder", title: "Quote EB-Q-0001 expires soon", relatedType: "quote", relatedId: "EB-Q-0001", due: future(5), assignee: "Hannah Cole", status: "open", sign: null },
    { id: "task_4", type: "follow_up_call", title: "Welcome call to City Airport", relatedType: "deal", relatedId: "ops@cityairport.example", due: day(3), assignee: "James Patel", status: "done", sign: "James Patel" },
  ];
  for (const t of taskSeeds) {
    const ex = await db.select().from(schema.task).where(eq(schema.task.id, t.id)).limit(1);
    if (!ex.length) await db.insert(schema.task).values({ id: t.id, type: t.type, title: t.title, relatedType: t.relatedType, relatedId: t.relatedId, dueDate: t.due, assigneeName: t.assignee, status: t.status, signOffName: t.sign, signOffAt: t.sign ? day(2) : null, createdAt: day(5) });
  }

  // ── Goals / targets ──
  const goalSeeds = [
    { id: "goal_rev", period: "2026-05", metric: "revenue", target: 15000000, ownerName: "Team" },
    { id: "goal_units", period: "2026-05", metric: "units", target: 8, ownerName: "Team" },
  ];
  for (const g of goalSeeds) {
    const ex = await db.select().from(schema.goal).where(eq(schema.goal.id, g.id)).limit(1);
    if (!ex.length) await db.insert(schema.goal).values({ id: g.id, period: g.period, metric: g.metric, target: g.target, ownerName: g.ownerName, createdAt: day(10) });
  }

  // ── Email templates (seed the 11 from bundled defaults if missing) ──
  const { DEFAULT_TEMPLATES } = await import("./emails/defaults");
  const { TEMPLATES } = await import("./emails/registry");
  for (const t of TEMPLATES) {
    if (!DEFAULT_TEMPLATES[t.key]) continue;
    const [ex] = await db.select().from(schema.emailTemplate).where(eq(schema.emailTemplate.key, t.key)).limit(1);
    const vals = { name: t.name, subject: t.subject, preheader: t.preheader, html: DEFAULT_TEMPLATES[t.key], updatedByName: "system" };
    if (!ex) {
      await db.insert(schema.emailTemplate).values({ key: t.key, ...vals });
    } else if (ex.updatedByName === "system") {
      // Never edited by an admin: keep it current with the bundled default.
      await db.update(schema.emailTemplate).set({ ...vals, updatedAt: new Date() }).where(eq(schema.emailTemplate.key, t.key));
    }
  }

  return { ok: true, password: PASSWORD };
}
