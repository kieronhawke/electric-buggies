import { requireRole } from "@/lib/session";
import { canSeeFinancials, canSeeCrm } from "@/lib/access";
import { cn } from "@/lib/utils";

const card = "rounded-lg border border-line bg-white p-5";
const sectionHead = "text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2";

/** Default range: start of the current year to today. */
function defaultRange() {
  const now = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(new Date(now.getFullYear(), 0, 1)), to: iso(now) };
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const user = await requireRole(["admin", "finance", "sales"]);
  const sp = await searchParams;
  const def = defaultRange();
  const from = sp.from || def.from;
  const to = sp.to || def.to;

  const fin = canSeeFinancials(user.role);
  const crm = canSeeCrm(user.role);
  const qs = `from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  const exports = [
    { type: "orders", label: "Orders", desc: "Confirmed and realised orders with value and estimated cost.", show: fin },
    { type: "quotes", label: "Quotes", desc: "Issued quotes with status and margin snapshot.", show: crm },
    { type: "deals", label: "Deals", desc: "Pipeline deals with stage, value and owner.", show: crm },
  ].filter((e) => e.show);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[clamp(1.6rem,4vw,2.1rem)] font-semibold tracking-[-0.02em]">Reports</h1>
        <p className="mt-1 text-[.9rem] text-ink-2">Export your data as CSV for a chosen date range. Figures are indicative estimates, not accounting-grade.</p>
      </div>

      {/* Date range */}
      <section className={card}>
        <h2 className={sectionHead}>Date range</h2>
        <form method="GET" className="mt-4 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[.78rem] font-medium text-ink-2">From</span>
            <input type="date" name="from" defaultValue={from} className="rounded-md border border-line bg-white px-3 py-2 text-[.9rem] tabular-nums focus:border-line-2 focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[.78rem] font-medium text-ink-2">To</span>
            <input type="date" name="to" defaultValue={to} className="rounded-md border border-line bg-white px-3 py-2 text-[.9rem] tabular-nums focus:border-line-2 focus:outline-none" />
          </label>
          <button type="submit" className="rounded-md border border-line bg-paper px-4 py-2 text-[.85rem] font-semibold transition-colors hover:border-line-2 hover:bg-white">Apply</button>
        </form>
      </section>

      {/* Exports */}
      <section className="flex flex-col gap-4">
        <h2 className={sectionHead}>Exports</h2>
        {exports.length === 0 ? (
          <p className={cn(card, "text-[.85rem] text-ink-2")}>You do not have access to any exports.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exports.map((e) => (
              <div key={e.type} className={cn(card, "flex flex-col gap-3")}>
                <div>
                  <h3 className="text-[.95rem] font-semibold">{e.label}</h3>
                  <p className="mt-1 text-[.82rem] text-ink-2">{e.desc}</p>
                </div>
                <a
                  href={`/api/admin/reports/export?type=${e.type}&${qs}`}
                  download
                  className="inline-flex w-fit items-center gap-1.5 rounded-md border border-line bg-paper px-3.5 py-2 text-[.82rem] font-semibold transition-colors hover:border-line-2 hover:bg-white"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M8 2v8m0 0l3-3m-3 3L5 7M3 13h10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download CSV
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-[.78rem] text-ink-2">PDF export and saved report views are planned and not yet available.</p>
    </div>
  );
}
