import { getQuotesAdmin } from "@/lib/admin-data";
import { gbpFromPence, formatDate } from "@/lib/orders";
import { QuoteCreate } from "@/components/portal/quote-create";

const Q_LABEL: Record<string, string> = { draft: "Draft", sent: "Sent", viewed: "Viewed", accepted: "Accepted", declined: "Declined", expired: "Expired" };

export default async function AdminQuotes() {
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
          <table className="w-full min-w-[640px] border-collapse text-[.9rem]">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2">
                <th className="p-3.5">Ref</th><th className="p-3.5">Customer</th><th className="p-3.5">Total</th><th className="p-3.5">Status</th><th className="p-3.5">Sent</th><th className="p-3.5">Valid until</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-line last:border-0">
                  <td className="p-3.5 font-semibold">{q.reference}</td>
                  <td className="p-3.5">{q.customerName}<div className="text-[.78rem] text-ink-2">{q.customerEmail}</div></td>
                  <td className="p-3.5 tabular-nums">{gbpFromPence(q.total)}</td>
                  <td className="p-3.5"><span className="rounded-full border border-line-2 px-2.5 py-1 text-[.64rem] font-semibold uppercase tracking-[.08em] text-ink-2">{Q_LABEL[q.status]}</span></td>
                  <td className="p-3.5 text-ink-2">{formatDate(q.sentAt) ?? "-"}</td>
                  <td className="p-3.5 text-ink-2">{formatDate(q.validUntil) ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
