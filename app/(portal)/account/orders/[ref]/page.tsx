import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import {
  getOrderByRef, STAGE_META, STAGE_LABEL, gbpFromPence, deliveryWindow, formatDate, type OrderStage,
} from "@/lib/orders";
import { OrderTracker, OrderTimeline } from "@/components/portal/order-tracker";

export default async function OrderDetailPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const user = (await getCurrentUser())!;
  const order = await getOrderByRef(user.id, ref);
  if (!order) notFound();

  const stage = order.stage as OrderStage;
  const meta = STAGE_META[stage];
  const window = deliveryWindow(order as never);
  const config = (order.configuration ?? {}) as Record<string, string | number>;
  const configEntries = Object.entries(config);

  return (
    <div className="max-w-[760px]">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-[.8rem] font-medium text-ink-2 hover:text-ink">
        <span aria-hidden>&larr;</span> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[.74rem] font-semibold uppercase tracking-[.16em] text-ink-2">{order.reference}</div>
          <h1 className="mt-1 text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">{meta.headline}</h1>
          <p className="mt-1 text-ink-2">{order.modelName} · {gbpFromPence(order.totalAmount)}</p>
        </div>
        <span className="rounded-full bg-ink px-3.5 py-1.5 text-[.68rem] font-semibold uppercase tracking-[.1em] text-white">
          {STAGE_LABEL[stage]}
        </span>
      </div>

      {/* Tracker */}
      <section className="mt-8 rounded-lg border border-line bg-white p-6 sm:p-7">
        <OrderTracker stage={stage} />
      </section>

      {/* Delivery + what's next */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Estimated delivery</h2>
          {window ? (
            window.overdue ? (
              <>
                <p className="mt-2 text-lg font-semibold">Updated estimate coming soon</p>
                <p className="mt-1 text-[.86rem] text-ink-2">We are refining your delivery date and will confirm it here shortly.</p>
              </>
            ) : (
              <>
                <p className="mt-2 text-lg font-semibold">{window.start} to {window.end}</p>
                <p className="mt-1 text-[.86rem] text-ink-2">This window narrows as your build progresses.</p>
              </>
            )
          ) : (
            <p className="mt-2 text-[.9rem] text-ink-2">Confirmed once your build is scheduled.</p>
          )}
        </div>
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">What happens next</h2>
          <p className="mt-2 text-[.95rem] leading-relaxed">{meta.whatsNext}</p>
        </div>
      </div>

      {/* Design details */}
      {configEntries.length > 0 && (
        <section className="mt-4 rounded-lg border border-line bg-white p-6 sm:p-7">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Your design details</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {configEntries.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line pb-2.5">
                <dt className="text-[.88rem] capitalize text-ink-2">{k.replace(/([A-Z])/g, " $1")}</dt>
                <dd className="text-right text-[.9rem] font-medium">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Timeline */}
      <section className="mt-4 rounded-lg border border-line bg-white p-6 sm:p-7">
        <h2 className="mb-5 text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Order timeline</h2>
        <OrderTimeline events={order.events} />
      </section>

      <p className="mt-6 text-[.82rem] text-ink-2">
        Need help with this order? <Link href="/account/help" className="font-semibold text-ink underline-offset-4 hover:underline">Contact the team</Link>.
      </p>
    </div>
  );
}
