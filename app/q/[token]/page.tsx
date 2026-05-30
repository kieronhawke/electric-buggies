import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { gbpFromPence, formatDate } from "@/lib/orders";
import { Wordmark } from "@/components/wordmark";
import { QuoteRespond } from "@/components/portal/quote-respond";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PublicQuote({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!db) notFound();
  // Select ONLY customer-facing columns. Internal commercial fields
  // (costSnapshot, profitSnapshot, itemId, markupPct, unitPrice) are never
  // fetched here, so they cannot reach the customer's HTML or payload.
  const [q] = await db.select({
    id: schema.quote.id, reference: schema.quote.reference, customerName: schema.quote.customerName,
    status: schema.quote.status, lineItems: schema.quote.lineItems, inclusions: schema.quote.inclusions,
    originalTotal: schema.quote.originalTotal, discountPct: schema.quote.discountPct, total: schema.quote.total,
    estDelivery: schema.quote.estDelivery, validUntil: schema.quote.validUntil,
  }).from(schema.quote).where(eq(schema.quote.accessToken, token)).limit(1);
  if (!q) notFound();

  // Mark as viewed on first open.
  let status: string = q.status;
  if (status === "sent") {
    await db.update(schema.quote).set({ status: "viewed", viewedAt: new Date() }).where(eq(schema.quote.id, q.id));
    status = "viewed";
  }
  const expired = !!q.validUntil && new Date(q.validUntil).getTime() < Date.now() && status === "viewed";
  const items = (q.lineItems ?? []) as { label: string; amount: number }[];
  const inclusions = (q.inclusions ?? []) as string[];
  const hasDiscount = q.discountPct > 0 && !!q.originalTotal && q.originalTotal > q.total;
  const responded = status === "accepted" || status === "declined";

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-[640px] px-5 py-12">
        <div className="mb-8 flex justify-center"><Wordmark href="/" size="sm" /></div>
        <div className="rounded-xl border border-line bg-white p-7 sm:p-9">
          <div className="text-[.72rem] font-semibold uppercase tracking-[.16em] text-ink-2">Quote {q.reference}</div>
          <h1 className="mt-2 text-2xl font-semibold">Prepared for {q.customerName}</h1>
          <table className="mt-6 w-full border-collapse text-[.95rem]">
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-b border-line"><td className="py-3 pr-4">{it.label}</td><td className="py-3 text-right font-medium tabular-nums">{gbpFromPence(it.amount)}</td></tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 rounded-[6px] border border-line bg-paper p-4">
            {hasDiscount ? (
              <p className="flex flex-wrap items-baseline gap-x-2">
                <s className="text-ink-2 tabular-nums">{gbpFromPence(q.originalTotal!)}</s>
                <span className="text-2xl font-semibold tabular-nums">{gbpFromPence(q.total)}</span>
                <span className="text-[.82rem] font-semibold text-emerald-700">save {gbpFromPence(q.originalTotal! - q.total)} ({q.discountPct}% off)</span>
              </p>
            ) : (
              <p className="flex items-baseline justify-between"><span className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Total</span><span className="text-2xl font-semibold tabular-nums">{gbpFromPence(q.total)}</span></p>
            )}
            {inclusions.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">{inclusions.map((i) => <li key={i} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[.7rem] font-medium text-emerald-700">{i}</li>)}</ul>
            )}
            {q.estDelivery && <p className="mt-3 text-[.84rem]"><span className="font-semibold">Estimated delivery:</span> {formatDate(q.estDelivery)}</p>}
          </div>

          <p className="mt-4 text-[.82rem] text-ink-2">Valid until {formatDate(q.validUntil) ?? "-"}. Indicative; final pricing confirmed on order.</p>

          <div className="mt-7">
            {responded ? (
              <p className="rounded-[4px] border border-line bg-paper px-4 py-3 text-[.95rem] font-medium">
                {status === "accepted" ? "Thank you. You have accepted this quote and our team will be in touch to confirm next steps." : "You have declined this quote. If that was a mistake, contact our team."}
              </p>
            ) : expired ? (
              <p className="rounded-[4px] border border-amber-200 bg-amber-50 px-4 py-3 text-[.92rem] text-amber-800">This quote has expired. Please contact us for an updated quote.</p>
            ) : (
              <QuoteRespond token={token} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
