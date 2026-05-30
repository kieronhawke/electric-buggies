import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/lib/session";
import { getQuotesAdmin } from "@/lib/admin-data";
import { listInventory } from "@/lib/inventory-data";
import { gbpFromPence, formatDate } from "@/lib/format";
import { vehicleImage } from "@/lib/vehicle-image";
import { quoteStatusStyle } from "@/lib/status-style";
import { labelForBand, type ProfitBand } from "@/lib/costing";
import { QuoteGenerator, type PickerItem } from "@/components/portal/quote-generator";
import { QuoteApprove } from "@/components/portal/quote-approve";
import { cn } from "@/lib/utils";

const Q_LABEL: Record<string, string> = { draft: "Draft", sent: "Sent", viewed: "Viewed", accepted: "Accepted", declined: "Declined", expired: "Expired" };

const BAND_CELL: Record<ProfitBand, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  red: "border-rose-200 bg-rose-50 text-rose-900",
};
const BAND_DOT: Record<ProfitBand, string> = { green: "bg-emerald-500", amber: "bg-amber-500", red: "bg-rose-500" };

type ProfitSnapshot = { profit: number; marginPct: number; band: ProfitBand } | null;

export default async function AdminQuotes() {
  const actor = await requireRole(["admin", "finance", "sales"]);
  const canApprove = actor.role === "admin" || actor.role === "finance";

  const [quotes, inventory] = await Promise.all([getQuotesAdmin(), listInventory()]);

  // Only active stock in the picker; cost is fine to pass (these roles see costing).
  const items: PickerItem[] = inventory
    .filter((e) => e.item.status === "active")
    .map((e) => ({
      id: e.item.id,
      name: e.item.name,
      sku: e.item.sku,
      modelSlug: e.item.modelSlug ?? null,
      unitCostPence: e.stack.totalCost,
      rrpPence: e.rrp,
      available: e.available,
      status: e.item.status,
    }));

  return (
    <div>
      <div>
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Quote Generator</h1>
        <p className="mt-1 text-[.9rem] text-ink-2">Build an inventory-aware quote with live, colour-coded margin. Profit is recomputed server-side and never shown to the customer.</p>
      </div>

      <div className="mt-6">
        <QuoteGenerator items={items} />
      </div>

      <h2 className="mt-10 text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Recent quotes</h2>
      {quotes.length === 0 ? (
        <p className="mt-4 text-ink-2">No quotes yet. Build one above, or from a deal in the CRM.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[860px] border-collapse text-[.9rem]">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-[.66rem] font-semibold uppercase tracking-[.1em] text-ink-2">
                <th className="p-3.5">Ref</th><th className="p-3.5">Customer</th><th className="p-3.5">Total</th><th className="p-3.5">Margin</th><th className="p-3.5">Status</th><th className="p-3.5">Approval</th><th className="p-3.5">Sent</th><th className="p-3.5">Viewed</th><th className="p-3.5">Accepted</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const st = quoteStatusStyle(q.status);
                const snap = q.profitSnapshot as ProfitSnapshot;
                return (
                  <tr key={q.id} className="border-b border-line transition-colors last:border-0 hover:bg-paper">
                    <td className="p-3.5">
                      <Link href={`/q/${q.accessToken}`} className="flex items-center gap-3 font-semibold underline-offset-4 hover:underline">
                        <span className="relative h-9 w-12 flex-none overflow-hidden rounded bg-paper"><Image src={vehicleImage(q.modelSlug)} alt="" fill sizes="48px" className="object-contain p-0.5" /></span>
                        {q.reference}
                      </Link>
                    </td>
                    <td className="p-3.5">{q.customerName}<div className="text-[.78rem] text-ink-2">{q.customerEmail}</div></td>
                    <td className="p-3.5 tabular-nums">{gbpFromPence(q.total)}</td>
                    <td className="p-3.5">
                      {snap ? (
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.74rem] font-semibold tabular-nums", BAND_CELL[snap.band])} title={labelForBand[snap.band]}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", BAND_DOT[snap.band])} />
                          {`${snap.profit < 0 ? "-" : ""}${gbpFromPence(Math.abs(snap.profit))}`}
                          <span className="font-normal">{`${Math.round(snap.marginPct)}%`}</span>
                        </span>
                      ) : <span className="text-ink-2">-</span>}
                    </td>
                    <td className="p-3.5"><span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.08em]", st.badge)}><span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />{Q_LABEL[q.status] ?? q.status}</span></td>
                    <td className="p-3.5">
                      {q.approvalRequired ? (
                        <span className="inline-flex flex-col items-start gap-1.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.08em] text-amber-900"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Approval needed</span>
                          <QuoteApprove quoteId={q.id} canApprove={canApprove} />
                        </span>
                      ) : q.approvedBy ? (
                        <span className="text-[.78rem] text-emerald-900">Approved by {q.approvedBy}</span>
                      ) : <span className="text-ink-2">-</span>}
                    </td>
                    <td className="p-3.5 text-ink-2">{formatDate(q.sentAt) ?? "-"}</td>
                    <td className="p-3.5 text-ink-2">{formatDate(q.viewedAt) ?? "-"}</td>
                    <td className="p-3.5 text-ink-2">{formatDate(q.acceptedAt) ?? "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
