import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { getQuotesForUser } from "@/lib/orders";
import { gbpFromPence, formatDate } from "@/lib/format";
import { vehicleImage } from "@/lib/vehicle-image";
import { quoteStatusStyle } from "@/lib/status-style";
import { cn } from "@/lib/utils";

const Q_LABEL: Record<string, string> = { draft: "Draft", sent: "Sent", viewed: "Viewed", accepted: "Accepted", declined: "Declined", expired: "Expired" };

export default async function QuotesPage() {
  const user = (await getCurrentUser())!;
  const quotes = await getQuotesForUser(user.id, user.email);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Quotes</h1>
          <p className="mt-1 text-ink-2">Quotes our team has prepared for you.</p>
        </div>
        <Link href="/account/request-quote" className="rounded-[2px] bg-ink px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black">Request a new quote</Link>
      </div>

      {quotes.length === 0 ? (
        <div className="mt-7 rounded-lg border border-line bg-white p-8 text-center">
          <p className="text-ink-2">You have no quotes yet.</p>
          <Link href="/account/request-quote" className="mt-3 inline-block text-[.8rem] font-semibold uppercase tracking-[.06em] underline-offset-4 hover:underline">Configure a vehicle to request one</Link>
        </div>
      ) : (
        <ul className="mt-7 grid gap-4 lg:grid-cols-2">
          {quotes.map((q) => {
            const inclusions = (q.inclusions ?? []) as string[];
            return (
              <li key={q.id} className="overflow-hidden rounded-lg border border-line bg-white">
                <div className="grid grid-cols-[120px_1fr] gap-0">
                  <div className="relative bg-paper"><Image src={vehicleImage(q.modelSlug)} alt="Quote vehicle" fill sizes="120px" className="object-contain p-2" /></div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[.72rem] font-semibold uppercase tracking-[.12em] text-ink-2">{q.reference}</span>
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.08em]", quoteStatusStyle(q.status).badge)}><span className={cn("h-1.5 w-1.5 rounded-full", quoteStatusStyle(q.status).dot)} />{Q_LABEL[q.status]}</span>
                    </div>
                    {q.discountPct > 0 && q.originalTotal ? (
                      <p className="mt-2"><s className="text-ink-2">{gbpFromPence(q.originalTotal)}</s> <span className="text-xl font-semibold">{gbpFromPence(q.total)}</span> <span className="text-[.78rem] font-semibold text-emerald-700">save {gbpFromPence(q.originalTotal - q.total)}</span></p>
                    ) : <p className="mt-2 text-xl font-semibold">{gbpFromPence(q.total)}</p>}
                    {inclusions.length > 0 && <ul className="mt-2 flex flex-wrap gap-1.5">{inclusions.map((i) => <li key={i} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[.66rem] font-medium text-emerald-700">{i}</li>)}</ul>}
                    <p className="mt-2 text-[.78rem] text-ink-2">Valid until {formatDate(q.validUntil) ?? "-"}</p>
                    <Link href={`/q/${q.accessToken}`} className="mt-3 inline-block text-[.76rem] font-semibold uppercase tracking-[.06em] underline-offset-4 hover:underline">View & respond &rarr;</Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
