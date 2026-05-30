import Link from "next/link";
import { requireRole } from "@/lib/session";
import { commandCentre } from "@/lib/command-data";
import { canSeeFinancials } from "@/lib/access";
import { gbpFromPence, formatDate } from "@/lib/format";
import { orderStageStyle, serviceStatusStyle } from "@/lib/status-style";
import { STAGE_LABEL, type OrderStage } from "@/lib/orders";
import { TaskSignoff } from "@/components/portal/task-signoff";
import { cn } from "@/lib/utils";

const card = "rounded-lg border border-line bg-white p-5";
const kpiNum = "text-[1.7rem] font-semibold tracking-[-0.02em] tabular-nums";
const kpiLabel = "mt-1 text-[.8rem] text-ink-2";
const sectionHead = "text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2";

const stageLabel = (s: string) => STAGE_LABEL[s as OrderStage] ?? s.replace(/_/g, " ");
const titleCase = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Short relative date for the activity feed. */
function shortWhen(at: Date) {
  const diff = Date.now() - new Date(at).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(at) ?? "";
}

const TASK_ICON: Record<string, string> = {
  call: "📞",
  email: "✉️",
  quote: "📄",
  payment: "💷",
  delivery: "🚚",
  service: "🔧",
  task: "✔️",
};

function Kpi({ label, value, accent, href }: { label: string; value: string; accent?: string; href?: string }) {
  const body = (
    <>
      <div className={cn(kpiNum, accent)}>{value}</div>
      <div className={kpiLabel}>{label}</div>
    </>
  );
  return href ? (
    <Link href={href} className={cn(card, "block transition-colors hover:border-line-2")}>
      {body}
    </Link>
  ) : (
    <div className={card}>{body}</div>
  );
}

/** KPI card with a delta vs a comparison value (green up / rose down). */
function KpiDelta({ label, value, current, previous, href }: { label: string; value: string; current: number; previous: number; href?: string }) {
  const diff = current - previous;
  const pct = previous ? Math.round((diff / previous) * 100) : current ? 100 : 0;
  const up = diff >= 0;
  const delta = previous || current ? (
    <span className={cn("inline-flex items-center gap-1 text-[.74rem] font-semibold tabular-nums", up ? "text-emerald-700" : "text-rose-700")}>
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      {Math.abs(pct)}%
    </span>
  ) : null;
  const body = (
    <>
      <div className={cn(kpiNum)}>{value}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-[.8rem] text-ink-2">{label}</span>
        {delta}
      </div>
      <div className="mt-0.5 text-[.7rem] text-ink-2">vs last month</div>
    </>
  );
  return href ? (
    <Link href={href} className={cn(card, "block transition-colors hover:border-line-2")}>
      {body}
    </Link>
  ) : (
    <div className={card}>{body}</div>
  );
}

export default async function CommandCentrePage() {
  const user = await requireRole(["admin", "finance", "sales"]);
  const cc = await commandCentre();
  const showFin = canSeeFinancials(user.role);

  // Financial alerts only for finance/admin; ops/crm alerts for everyone.
  const FIN_ALERT_KINDS = new Set(["below_cost", "overdue_payment", "low_stock"]);
  const alerts = cc.alerts.filter((a) => (FIN_ALERT_KINDS.has(a.kind) ? showFin : true));

  const maxFunnel = Math.max(1, ...cc.sales.funnel.map((f) => f.count));
  const maxStageValue = Math.max(1, ...cc.financial.orderValueByStage.map((s) => s.value));

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div>
        <h1 className="text-[clamp(1.6rem,4vw,2.1rem)] font-semibold tracking-[-0.02em]">Command centre</h1>
        <p className="mt-1 text-[.9rem] text-ink-2">Your live view of revenue, pipeline, operations and what needs attention today.</p>
        <p className="mt-1 text-[.76rem] text-ink-2/80">Revenue, profit and cash figures are indicative estimates, not accounting-grade.</p>
      </div>

      {/* ── ALERTS ── */}
      <section>
        {alerts.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[.85rem] font-medium text-emerald-800">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            All clear. Nothing needs your attention right now.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {alerts.map((a, i) => (
              <span
                key={`${a.kind}-${i}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[.82rem] font-medium",
                  a.severity === "rose" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-amber-200 bg-amber-50 text-amber-800",
                )}
              >
                <span className={cn("inline-block h-2 w-2 shrink-0 rounded-full", a.severity === "rose" ? "bg-rose-500" : "bg-amber-500")} />
                {a.label}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── FINANCIAL OVERVIEW (finance/admin only) ── */}
      {showFin && (
        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className={sectionHead}>Financial overview</h2>
            <Link href="/admin/orders" className="text-[.78rem] font-semibold underline-offset-2 hover:underline">View orders</Link>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiDelta label="Revenue this month" value={gbpFromPence(cc.financial.revenueMonth)} current={cc.financial.revenueMonth} previous={cc.financial.revenuePrevMonth} href="/admin/orders" />
            <Kpi label="Revenue this quarter" value={gbpFromPence(cc.financial.revenueQuarter)} />
            <Kpi label="Revenue this year" value={gbpFromPence(cc.financial.revenueYear)} />
            <Kpi label="Est. monthly revenue" value={gbpFromPence(cc.financial.estMonthlyRevenue)} />
            <div className={card}>
              <div className={cn(kpiNum, "text-emerald-700")}>{gbpFromPence(cc.financial.grossProfit)}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[.8rem] text-ink-2">Gross profit</span>
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[.72rem] font-semibold tabular-nums text-emerald-700">{Math.round(cc.financial.marginPct)}% margin</span>
              </div>
            </div>
            <Kpi label="Avg order value" value={gbpFromPence(cc.financial.avgOrderValue)} />
            <Kpi label="Units sold" value={String(cc.financial.unitsSold)} />
            <Kpi label="Awaiting payment" value={gbpFromPence(cc.financial.awaitingPayment)} accent="text-amber-700" href="/admin/orders" />
            <Kpi label="Payments received" value={gbpFromPence(cc.financial.paymentsReceived)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            {/* Order value by stage */}
            <div className={card}>
              <div className="flex items-center justify-between">
                <h3 className={sectionHead}>Order value by stage</h3>
                <Link href="/admin/orders" className="text-[.74rem] font-semibold underline-offset-2 hover:underline">Orders</Link>
              </div>
              {cc.financial.orderValueByStage.length === 0 ? (
                <p className="mt-4 text-[.85rem] text-ink-2">No orders yet.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-3">
                  {cc.financial.orderValueByStage.map((s) => {
                    const st = orderStageStyle(s.stage as OrderStage);
                    return (
                      <li key={s.stage} className="flex items-center gap-3">
                        <span className="flex w-40 shrink-0 items-center gap-2 text-[.82rem]">
                          <span className={cn("inline-block h-2 w-2 rounded-full", st.dot)} />
                          {stageLabel(s.stage)}
                          <span className="text-ink-2">({s.count})</span>
                        </span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-paper">
                          <span className={cn("block h-full rounded-full", st.dot)} style={{ width: `${(s.value / maxStageValue) * 100}%` }} />
                        </span>
                        <span className="w-24 shrink-0 text-right text-[.82rem] font-semibold tabular-nums">{gbpFromPence(s.value)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Inventory value */}
            <Link href="/admin/inventory" className={cn(card, "block transition-colors hover:border-line-2")}>
              <div className="flex items-center justify-between">
                <h3 className={sectionHead}>Inventory value</h3>
                <span className="text-[.74rem] font-semibold underline-offset-2 hover:underline">Inventory</span>
              </div>
              <dl className="mt-4 flex flex-col gap-3 text-[.9rem]">
                <div className="flex items-baseline justify-between">
                  <dt className="text-ink-2">At cost</dt>
                  <dd className="font-semibold tabular-nums">{gbpFromPence(cc.financial.inventoryAtCost)}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-ink-2">At RRP</dt>
                  <dd className="font-semibold tabular-nums">{gbpFromPence(cc.financial.inventoryAtRrp)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="text-ink-2">Potential profit</dt>
                  <dd className="font-semibold tabular-nums text-emerald-700">{gbpFromPence(cc.financial.inventoryPotentialProfit)}</dd>
                </div>
              </dl>
            </Link>
          </div>
        </section>
      )}

      {/* ── SALES & PIPELINE ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className={sectionHead}>Sales &amp; pipeline</h2>
          <Link href="/admin/crm" className="rounded-md border border-line bg-white px-3 py-1.5 text-[.78rem] font-semibold transition-colors hover:border-line-2 hover:bg-paper">Open pipeline board →</Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Pipeline value" value={gbpFromPence(cc.sales.pipelineValue)} href="/admin/crm" />
          <Kpi label="Weighted forecast" value={gbpFromPence(cc.sales.weightedForecast)} />
          <Kpi label="Win rate" value={`${Math.round(cc.sales.winRate)}%`} />
          <Kpi label="Avg deal size" value={gbpFromPence(cc.sales.avgDealSize)} />
          <Kpi label="Open deals" value={String(cc.sales.openDeals)} href="/admin/crm" />
          <Kpi label="Quote to order" value={`${Math.round(cc.sales.quoteToOrder)}%`} />
          <Kpi label="Sales cycle" value={`${cc.sales.salesCycleDays}d`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          {/* Conversion funnel */}
          <div className={card}>
            <h3 className={sectionHead}>Conversion funnel</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {cc.sales.funnel.map((f) => (
                <li key={f.label} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-[.82rem] text-ink-2">{f.label}</span>
                  <span className="h-6 flex-1 overflow-hidden rounded-md bg-paper">
                    <span className="flex h-full items-center rounded-md bg-blue-500/90 px-2 text-[.74rem] font-semibold text-white tabular-nums" style={{ width: `${Math.max(8, (f.count / maxFunnel) * 100)}%` }}>
                      {f.count}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Leads by source */}
          <div className={card}>
            <h3 className={sectionHead}>Leads by source</h3>
            {cc.sales.leadsBySource.length === 0 ? (
              <p className="mt-4 text-[.85rem] text-ink-2">No leads yet.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2.5 text-[.9rem]">
                {cc.sales.leadsBySource.map((s) => (
                  <li key={s.source} className="flex items-center justify-between">
                    <span>{titleCase(s.source)}</span>
                    <span className="font-semibold tabular-nums">{s.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Per-rep table */}
          <div className={cn(card, "overflow-x-auto")}>
            <h3 className={sectionHead}>Performance by rep</h3>
            {cc.sales.perRep.length === 0 ? (
              <p className="mt-4 text-[.85rem] text-ink-2">No deals assigned yet.</p>
            ) : (
              <table className="mt-3 w-full min-w-[420px] border-collapse text-[.88rem]">
                <thead>
                  <tr className="border-b border-line text-left text-[.66rem] font-semibold uppercase tracking-[.1em] text-ink-2">
                    <th className="py-2 pr-3">Rep</th>
                    <th className="py-2 pr-3 text-right">Won</th>
                    <th className="py-2 pr-3 text-right">Value</th>
                    <th className="py-2 text-right">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {cc.sales.perRep.map((r) => (
                    <tr key={r.name} className="border-b border-line last:border-0">
                      <td className="py-2.5 pr-3 font-medium">{r.name}</td>
                      <td className="py-2.5 pr-3 text-right tabular-nums">{r.won}</td>
                      <td className="py-2.5 pr-3 text-right tabular-nums font-semibold text-emerald-700">{gbpFromPence(r.value)}</td>
                      <td className="py-2.5 text-right tabular-nums">{r.open}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Stale deals */}
          <div className={card}>
            <div className="flex items-center justify-between">
              <h3 className={sectionHead}>Stale deals</h3>
              <Link href="/admin/crm" className="text-[.74rem] font-semibold underline-offset-2 hover:underline">CRM</Link>
            </div>
            {cc.sales.staleDeals.length === 0 ? (
              <p className="mt-4 text-[.85rem] text-ink-2">No stale deals. Pipeline is moving.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {cc.sales.staleDeals.map((d) => (
                  <li key={d.id}>
                    <Link href="/admin/crm" className="flex items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[.84rem] text-amber-800 transition-colors hover:border-amber-300">
                      <span className="truncate font-medium">{d.name}</span>
                      <span className="shrink-0 text-[.74rem] font-semibold tabular-nums">{d.days}d idle</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ── OPERATIONS ── */}
      <section className="flex flex-col gap-4">
        <h2 className={sectionHead}>Operations</h2>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Orders by stage */}
          <div className={card}>
            <div className="flex items-center justify-between">
              <h3 className={sectionHead}>Orders by stage</h3>
              <Link href="/admin/orders" className="text-[.74rem] font-semibold underline-offset-2 hover:underline">Orders</Link>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[.8rem] text-ink-2">Overdue</span>
              <span className={cn("rounded-full border px-2 py-0.5 text-[.74rem] font-semibold tabular-nums", cc.ops.overdue > 0 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-line bg-paper text-ink-2")}>{cc.ops.overdue}</span>
            </div>
            {cc.ops.ordersByStage.length === 0 ? (
              <p className="mt-4 text-[.85rem] text-ink-2">No orders yet.</p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {cc.ops.ordersByStage.map((s) => {
                  const st = orderStageStyle(s.stage as OrderStage);
                  return (
                    <span key={s.stage} className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.74rem] font-medium", st.badge)}>
                      {stageLabel(s.stage)}
                      <span className="font-semibold tabular-nums">{s.count}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming deliveries */}
          <div className={card}>
            <h3 className={sectionHead}>Upcoming deliveries</h3>
            {cc.ops.upcomingDeliveries.length === 0 ? (
              <p className="mt-4 text-[.85rem] text-ink-2">None scheduled.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2.5 text-[.88rem]">
                {cc.ops.upcomingDeliveries.map((d) => (
                  <li key={d.reference} className="flex items-center justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block text-[.7rem] font-semibold uppercase tracking-[.08em] text-ink-2">{d.reference}</span>
                      <span className="truncate">{d.modelName}</span>
                    </span>
                    <span className="shrink-0 text-[.78rem] text-ink-2">{formatDate(d.when) ?? "TBC"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* New enquiries */}
          <Link href="/admin/enquiries" className={cn(card, "block transition-colors hover:border-line-2")}>
            <h3 className={sectionHead}>New enquiries</h3>
            <div className={cn(kpiNum, "mt-3")}>{cc.ops.newEnquiries}</div>
            <div className={kpiLabel}>Awaiting first response</div>
          </Link>
        </div>

        {/* Open service requests */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <h3 className={sectionHead}>Open service requests</h3>
            <Link href="/admin/service" className="text-[.74rem] font-semibold underline-offset-2 hover:underline">Service</Link>
          </div>
          {cc.ops.openServices.length === 0 ? (
            <p className="mt-4 text-[.85rem] text-ink-2">No open service requests.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {cc.ops.openServices.map((s) => {
                const st = serviceStatusStyle(s.status);
                return (
                  <li key={s.reference} className="flex items-center justify-between gap-3 py-2.5 text-[.88rem]">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="text-[.7rem] font-semibold uppercase tracking-[.08em] text-ink-2">{s.reference}</span>
                      <span className="truncate">{titleCase(s.type)}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2.5">
                      <span className={cn("rounded-full border px-2 py-0.5 text-[.7rem] font-semibold", st.badge)}>{titleCase(s.status)}</span>
                      <span className={cn("text-[.78rem] tabular-nums", s.days > 7 ? "font-semibold text-amber-700" : "text-ink-2")}>{s.days}d</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          {/* Tasks due */}
          <div className={card}>
            <h3 className={sectionHead}>Tasks due</h3>
            {cc.ops.tasksDue.length === 0 ? (
              <p className="mt-4 text-[.85rem] text-ink-2">No open tasks. All caught up.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {cc.ops.tasksDue.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="flex min-w-0 items-start gap-2.5">
                      <span className="text-[1rem] leading-none" aria-hidden>{TASK_ICON[t.type] ?? TASK_ICON.task}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-[.9rem] font-medium">{t.title}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-2 text-[.76rem] text-ink-2">
                          {t.due && <span>Due {formatDate(t.due)}</span>}
                          {t.overdue && <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[.68rem] font-semibold text-rose-700">Overdue</span>}
                          {t.assignee && <span>· {t.assignee}</span>}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0">
                      <TaskSignoff taskId={t.id} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Activity feed */}
          <div className={card}>
            <h3 className={sectionHead}>Recent activity</h3>
            {cc.ops.activity.length === 0 ? (
              <p className="mt-4 text-[.85rem] text-ink-2">No recent activity.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2.5 text-[.85rem]">
                {cc.ops.activity.map((a, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0">
                      <span className="truncate">{titleCase(a.action)}</span>
                      {a.actorName && <span className="text-ink-2"> · {a.actorName}</span>}
                    </span>
                    <span className="shrink-0 text-[.74rem] text-ink-2 tabular-nums">{shortWhen(a.at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ── GOALS ── */}
      {cc.goals.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className={sectionHead}>Goals</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cc.goals.map((g) => {
              const hit = g.pct >= 100;
              const warn = g.pct < 50;
              const isMoney = g.metric === "revenue";
              const fmt = (n: number) => (isMoney ? gbpFromPence(n) : String(n));
              return (
                <div key={g.metric} className={card}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[.85rem] font-medium">{titleCase(g.metric)}</span>
                    <span className="text-[.8rem] tabular-nums text-ink-2">{fmt(g.actual)} / {fmt(g.target)}</span>
                  </div>
                  <span className="mt-2.5 block h-2.5 overflow-hidden rounded-full bg-paper">
                    <span className={cn("block h-full rounded-full", hit ? "bg-emerald-500" : warn ? "bg-amber-500" : "bg-blue-500")} style={{ width: `${Math.min(100, g.pct)}%` }} />
                  </span>
                  <div className="mt-1.5 text-[.76rem] font-semibold tabular-nums text-ink-2">{g.pct}% of target</div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
