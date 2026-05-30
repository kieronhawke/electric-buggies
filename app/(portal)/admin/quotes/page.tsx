import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/lib/session";
import { getQuotesAdmin } from "@/lib/admin-data";
import { gbpFromPence, formatDate } from "@/lib/orders";
import { vehicleImage } from "@/lib/vehicle-image";
import { quoteStatusStyle } from "@/lib/status-style";
import { QuoteCreate } from "@/components/portal/quote-create";
import { cn } from "@/lib/utils";

const Q_LABEL: Record<string, string> = { draft: "Draft", sent: "Sent", viewed: "Viewed", accepted: "Accepted", declined: "Declined", expired: "Expired" };

export default async function AdminQuotes() {
  await requireRole(["admin"]);
  const quotes = await getQuotesAdmin();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Quotes</h1>
        <QuoteCreate />
      </div>
      {quotes.length === 0 ? (
        <p className="mt-6 text-ink-2">No quotes yet. Create one above, or from a deal in the CRM.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[700px] border-collapse text-[.9rem]">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2">
                <th className="p-3.5">Ref</th><th className="p-3.5">Customer</th><th className="p-3.5">Total</th><th className="p-3.5">Status</th><th className="p-3.5">Sent</th><th className="p-3.5">Valid until</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const st = quoteStatusStyle(q.status);
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
                    <td className="p-3.5"><span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.08em]", st.badge)}><span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />{Q_LABEL[q.status]}</span></td>
                    <td className="p-3.5 text-ink-2">{formatDate(q.sentAt) ?? "-"}</td>
                    <td className="p-3.5 text-ink-2">{formatDate(q.validUntil) ?? "-"}</td>
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
