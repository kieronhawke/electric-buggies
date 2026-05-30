import "server-only";
import { db, schema } from "./db";
import { desc } from "drizzle-orm";
import { inventoryAnalytics, enrich } from "./inventory-data";

/**
 * Business Command Centre aggregates. Computed server-side from existing tables
 * + the costing module. All financial figures are indicative estimates (not
 * accounting-grade). The dashboard renders sections by role; financial/profit
 * sections are only rendered for admin/finance.
 */

const STAGE_PROB: Record<string, number> = { new: 0.1, contacted: 0.25, quote_sent: 0.45, negotiation: 0.65, won: 1, lost: 0 };
const REALIZED = ["payment_received", "in_production", "quality_check", "in_transit", "ready_for_delivery", "delivered"];
const OPEN_DEAL = ["new", "contacted", "quote_sent", "negotiation"];
const STALE_DAYS = 14;

const monthStart = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1);
const quarterStart = (d = new Date()) => new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
const yearStart = (d = new Date()) => new Date(d.getFullYear(), 0, 1);
const daysBetween = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / 86400000);

export interface CommandCentre {
  financial: {
    revenueMonth: number; revenuePrevMonth: number; revenueQuarter: number; revenueYear: number;
    estMonthlyRevenue: number; grossProfit: number; marginPct: number; avgOrderValue: number; unitsSold: number;
    awaitingPayment: number; paymentsReceived: number; orderValueByStage: { stage: string; value: number; count: number }[];
    inventoryAtCost: number; inventoryAtRrp: number; inventoryPotentialProfit: number;
  };
  sales: {
    pipelineValue: number; weightedForecast: number; winRate: number; avgDealSize: number; openDeals: number;
    quoteToOrder: number; salesCycleDays: number; funnel: { label: string; count: number }[];
    leadsBySource: { source: string; count: number }[]; perRep: { name: string; won: number; value: number; open: number }[];
    staleDeals: { id: string; name: string; stage: string; days: number }[];
  };
  ops: {
    ordersByStage: { stage: string; count: number }[]; overdue: number; upcomingDeliveries: { reference: string; modelName: string; when: Date | null }[];
    openServices: { reference: string; type: string; status: string; days: number }[]; newEnquiries: number;
    tasksDue: { id: string; title: string; type: string; due: Date | null; assignee: string | null; overdue: boolean }[];
    activity: { action: string; actorName: string | null; at: Date }[];
  };
  alerts: { kind: string; label: string; severity: "amber" | "rose" }[];
  goals: { metric: string; target: number; actual: number; pct: number }[];
}

export async function commandCentre(): Promise<CommandCentre> {
  if (!db) throw new Error("No database");
  const [orders, deals, quotes, payments, services, enquiries, tasks, goals, audit, items] = await Promise.all([
    db.select().from(schema.order),
    db.select().from(schema.deal),
    db.select().from(schema.quote),
    db.select().from(schema.payment),
    db.select().from(schema.serviceRequest),
    db.select().from(schema.enquiry),
    db.select().from(schema.task),
    db.select().from(schema.goal),
    db.select().from(schema.auditLog).orderBy(desc(schema.auditLog.createdAt)).limit(12),
    db.select().from(schema.inventoryItem),
  ]);
  const now = new Date();
  const costByModel = new Map<string, number>();
  for (const it of items) costByModel.set(it.modelSlug ?? it.sku, enrich(it).stack.totalCost);

  // ── Financial ──
  const realized = orders.filter((o) => REALIZED.includes(o.stage));
  const rev = (from: Date, to?: Date) => realized.filter((o) => o.createdAt >= from && (!to || o.createdAt < to)).reduce((s, o) => s + o.totalAmount, 0);
  const revenueMonth = rev(monthStart());
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const revenuePrevMonth = rev(prevMonthStart, monthStart());
  const revenueQuarter = rev(quarterStart());
  const revenueYear = rev(yearStart());
  const unitsSold = realized.length;
  const totalRealized = realized.reduce((s, o) => s + o.totalAmount, 0);
  const avgOrderValue = unitsSold ? Math.round(totalRealized / unitsSold) : 0;
  const dayOfMonth = now.getDate();
  const estMonthlyRevenue = dayOfMonth > 0 ? Math.round((revenueMonth / dayOfMonth) * 30) : revenueMonth;
  let cost = 0;
  for (const o of realized) cost += costByModel.get(o.modelSlug) ?? Math.round(o.totalAmount * 0.7);
  const grossProfit = totalRealized - cost;
  const marginPct = totalRealized ? (grossProfit / totalRealized) * 100 : 0;
  const awaitingPayment = orders.filter((o) => o.stage === "payment_pending").reduce((s, o) => s + o.totalAmount, 0);
  const paymentsReceived = payments.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0);
  const stageMap = new Map<string, { value: number; count: number }>();
  for (const o of orders) {
    const e = stageMap.get(o.stage) ?? { value: 0, count: 0 };
    e.value += o.totalAmount; e.count++; stageMap.set(o.stage, e);
  }
  const orderValueByStage = [...stageMap.entries()].map(([stage, v]) => ({ stage, ...v }));
  const inv = await inventoryAnalytics();

  // ── Sales / CRM ──
  const open = deals.filter((d) => OPEN_DEAL.includes(d.stage));
  const won = deals.filter((d) => d.stage === "won");
  const lost = deals.filter((d) => d.stage === "lost");
  const pipelineValue = open.reduce((s, d) => s + (d.value ?? 0), 0);
  const weightedForecast = deals.reduce((s, d) => s + (d.value ?? 0) * (STAGE_PROB[d.stage] ?? 0), 0);
  const winRate = won.length + lost.length ? (won.length / (won.length + lost.length)) * 100 : 0;
  const avgDealSize = won.length ? Math.round(won.reduce((s, d) => s + (d.value ?? 0), 0) / won.length) : 0;
  const sentQuotes = quotes.filter((q) => q.status !== "draft").length;
  const acceptedQuotes = quotes.filter((q) => q.status === "accepted").length;
  const quoteToOrder = sentQuotes ? (acceptedQuotes / sentQuotes) * 100 : 0;
  const wonWithDates = won.filter((d) => d.createdAt && d.updatedAt);
  const salesCycleDays = wonWithDates.length ? Math.round(wonWithDates.reduce((s, d) => s + daysBetween(d.updatedAt, d.createdAt), 0) / wonWithDates.length) : 0;
  const funnel = [
    { label: "Enquiries", count: enquiries.length },
    { label: "Quotes sent", count: sentQuotes },
    { label: "Negotiation", count: deals.filter((d) => d.stage === "negotiation").length },
    { label: "Won", count: won.length },
  ];
  const sourceMap = new Map<string, number>();
  for (const d of deals) sourceMap.set(d.source ?? "other", (sourceMap.get(d.source ?? "other") ?? 0) + 1);
  const leadsBySource = [...sourceMap.entries()].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);
  const repMap = new Map<string, { won: number; value: number; open: number }>();
  for (const d of deals) {
    const k = d.assigneeName ?? "Unassigned";
    const e = repMap.get(k) ?? { won: 0, value: 0, open: 0 };
    if (d.stage === "won") { e.won++; e.value += d.value ?? 0; }
    if (OPEN_DEAL.includes(d.stage)) e.open++;
    repMap.set(k, e);
  }
  const perRep = [...repMap.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.value - a.value);
  const staleDeals = open.filter((d) => daysBetween(now, d.updatedAt) >= STALE_DAYS).map((d) => ({ id: d.id, name: d.name, stage: d.stage, days: daysBetween(now, d.updatedAt) }));

  // ── Operations ──
  const ordersByStage = orderValueByStage.map((s) => ({ stage: s.stage, count: s.count }));
  const overdue = orders.filter((o) => o.stage !== "delivered" && o.estDeliveryEnd && o.estDeliveryEnd < now).length;
  const upcomingDeliveries = orders.filter((o) => ["ready_for_delivery", "in_transit"].includes(o.stage)).map((o) => ({ reference: o.reference, modelName: o.modelName, when: o.estDeliveryEnd })).slice(0, 6);
  const openServices = services.filter((s) => s.status !== "resolved").map((s) => ({ reference: s.reference, type: s.type, status: s.status, days: daysBetween(now, s.createdAt) }));
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;
  const tasksDue = tasks.filter((t) => t.status === "open").map((t) => ({ id: t.id, title: t.title, type: t.type, due: t.dueDate, assignee: t.assigneeName, overdue: !!t.dueDate && t.dueDate < now })).sort((a, b) => (a.due?.getTime() ?? 0) - (b.due?.getTime() ?? 0));
  const activity = audit.map((a) => ({ action: a.action, actorName: a.actorName, at: a.createdAt }));

  // ── Alerts ──
  const alerts: CommandCentre["alerts"] = [];
  if (inv.lowStockCount > 0) alerts.push({ kind: "low_stock", label: `${inv.lowStockCount} item(s) at or below reorder point`, severity: "amber" });
  const belowCostQuotes = quotes.filter((q) => (q.profitSnapshot as { band?: string } | null)?.band === "red").length;
  if (belowCostQuotes > 0) alerts.push({ kind: "below_cost", label: `${belowCostQuotes} quote(s) at thin or negative margin`, severity: "rose" });
  const overduePayments = orders.filter((o) => o.stage === "payment_pending" && o.updatedAt < new Date(now.getTime() - 7 * 86400000)).length;
  if (overduePayments > 0) alerts.push({ kind: "overdue_payment", label: `${overduePayments} order(s) awaiting payment over 7 days`, severity: "amber" });
  if (staleDeals.length > 0) alerts.push({ kind: "stale_deal", label: `${staleDeals.length} deal(s) with no activity in ${STALE_DAYS}+ days`, severity: "amber" });
  const overdueFollowUps = tasksDue.filter((t) => t.overdue).length;
  if (overdueFollowUps > 0) alerts.push({ kind: "overdue_followup", label: `${overdueFollowUps} follow-up(s) overdue`, severity: "rose" });

  // ── Goals ──
  const goalRows = goals.map((g) => {
    const actual = g.metric === "revenue" ? revenueMonth : g.metric === "units" ? unitsSold : won.length;
    return { metric: g.metric, target: g.target, actual, pct: g.target ? Math.min(100, Math.round((actual / g.target) * 100)) : 0 };
  });

  return {
    financial: { revenueMonth, revenuePrevMonth, revenueQuarter, revenueYear, estMonthlyRevenue, grossProfit, marginPct, avgOrderValue, unitsSold, awaitingPayment, paymentsReceived, orderValueByStage, inventoryAtCost: inv.stockValueAtCost, inventoryAtRrp: inv.stockValueAtRrp, inventoryPotentialProfit: inv.potentialProfit },
    sales: { pipelineValue, weightedForecast, winRate, avgDealSize, openDeals: open.length, quoteToOrder, salesCycleDays, funnel, leadsBySource, perRep, staleDeals },
    ops: { ordersByStage, overdue, upcomingDeliveries, openServices, newEnquiries, tasksDue, activity },
    alerts, goals: goalRows,
  };
}
