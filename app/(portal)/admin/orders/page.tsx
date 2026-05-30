import Link from "next/link";
import Image from "next/image";
import { getAllOrdersAdmin } from "@/lib/admin-data";
import { requireRole } from "@/lib/session";
import { gbpFromPence, STAGE_ORDER, STAGE_LABEL, type OrderStage } from "@/lib/orders";
import { StageBadge } from "@/components/portal/order-tracker";
import { orderStageStyle } from "@/lib/status-style";
import { vehicleImage } from "@/lib/vehicle-image";
import { cn } from "@/lib/utils";

type Sort = "newest" | "oldest" | "value_high" | "value_low";
const SORTS: { key: Sort; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "value_high", label: "Value high" },
  { key: "value_low", label: "Value low" },
];

/**
 * An order is "overdue / at risk" when it still needs the customer or us to act:
 * either it sits on an action stage (orderStageStyle().isAction, e.g. awaiting
 * contract or payment) or its delivery window has passed without being delivered.
 */
function isOverdue(o: { stage: string; estDeliveryEnd: Date | null }): boolean {
  const stage = o.stage as OrderStage;
  if (orderStageStyle(stage).isAction) return true;
  if (stage !== "delivered" && o.estDeliveryEnd && new Date(o.estDeliveryEnd).getTime() < Date.now()) return true;
  return false;
}

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; sort?: string; overdue?: string }>;
}) {
  // Finance does not manage the orders list; the [ref] detail stays open to finance for payment.
  await requireRole(["admin"]);
  const sp = await searchParams;
  const stageFilter = sp.stage && STAGE_ORDER.includes(sp.stage as OrderStage) ? (sp.stage as OrderStage) : null;
  const sort: Sort = (SORTS.find((s) => s.key === sp.sort)?.key ?? "newest") as Sort;
  const overdueOnly = sp.overdue === "1";

  const all = await getAllOrdersAdmin();

  // Filter + sort in-page (demo scale): getAllOrdersAdmin returns every order.
  let orders = all;
  if (stageFilter) orders = orders.filter((o) => o.stage === stageFilter);
  if (overdueOnly) orders = orders.filter(isOverdue);
  orders = [...orders].sort((a, b) => {
    switch (sort) {
      case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "value_high": return b.totalAmount - a.totalAmount;
      case "value_low": return a.totalAmount - b.totalAmount;
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Build a URL that preserves the other params when changing one control.
  const hrefWith = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams();
    if (stageFilter) next.set("stage", stageFilter);
    if (sort !== "newest") next.set("sort", sort);
    if (overdueOnly) next.set("overdue", "1");
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    const q = next.toString();
    return q ? `/admin/orders?${q}` : "/admin/orders";
  };

  const chip = "rounded-full border px-3 py-1.5 text-[.7rem] font-semibold uppercase tracking-[.06em] transition-colors";

  return (
    <div>
      <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Orders</h1>

      <div className="mt-5 flex flex-col gap-4 rounded-lg border border-line bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2">Stage</span>
          <Link href={hrefWith({ stage: null })} className={cn(chip, !stageFilter ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink")}>All</Link>
          {STAGE_ORDER.map((st) => {
            const active = stageFilter === st;
            const style = orderStageStyle(st);
            return (
              <Link key={st} href={hrefWith({ stage: st })} className={cn(chip, active ? style.badge : "border-line-2 text-ink-2 hover:border-ink")}>
                {STAGE_LABEL[st]}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2">Sort</span>
          {SORTS.map((s) => (
            <Link key={s.key} href={hrefWith({ sort: s.key })} className={cn(chip, sort === s.key ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink")}>
              {s.label}
            </Link>
          ))}
          <span aria-hidden className="mx-1 hidden h-5 w-px bg-line-2 sm:block" />
          <Link href={hrefWith({ overdue: overdueOnly ? null : "1" })} className={cn(chip, "inline-flex items-center gap-1.5", overdueOnly ? "border-amber-200 bg-amber-50 text-amber-800" : "border-line-2 text-ink-2 hover:border-ink")}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Overdue only
          </Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="mt-6 text-ink-2">{all.length === 0 ? "No orders yet." : "No orders match these filters."}</p>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {orders.map((o) => {
            const overdue = isOverdue(o);
            return (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.reference}`} className="flex items-center gap-4 rounded-lg border border-line bg-white p-4 transition-shadow hover:shadow-[0_22px_40px_-32px_rgba(0,0,0,0.3)]">
                  <div className="relative h-16 w-24 flex-none overflow-hidden rounded-md bg-paper">
                    <Image src={vehicleImage(o.modelSlug)} alt={o.modelName} fill sizes="96px" className="object-contain p-1.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[.72rem] font-semibold uppercase tracking-[.12em] text-ink-2">
                        {overdue && <span title="At risk / overdue" className="h-2 w-2 flex-none rounded-full bg-amber-500" />}
                        {o.reference}
                      </span>
                      <StageBadge stage={o.stage as OrderStage} />
                    </div>
                    <div className="mt-1 font-semibold">{o.modelName} · {gbpFromPence(o.totalAmount)}</div>
                    <div className="mt-0.5 text-[.82rem] text-ink-2">{o.customer?.name ?? "-"}</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
