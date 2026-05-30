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
  const [q] = await db.select().from(schema.quote).where(eq(schema.quote.accessToken, token)).limit(1);
  if (!q) notFound();

  // Mark as viewed on first open.
  let status: string = q.status;
  if (status === "sent") {
    await db.update(schema.quote).set({ status: "viewed", viewedAt: new Date() }).where(eq(schema.quote.id, q.id));
    status = "viewed";
  }
  const expired = !!q.validUntil && new Date(q.validUntil).getTime() < Date.now() && status === "viewed";
  const items = (q.lineItems ?? []) as { label: string; amount: number }[];
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
              <tr><td className="py-3 pr-4 text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Total</td><td className="py-3 text-right text-xl font-semibold tabular-nums">{gbpFromPence(q.total)}</td></tr>
            </tbody>
          </table>
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
