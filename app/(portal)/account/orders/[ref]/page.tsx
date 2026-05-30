import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import {
  getOrderByRef, STAGE_META, STAGE_LABEL, gbpFromPence, deliveryWindow, formatDate, type OrderStage,
} from "@/lib/orders";
import Image from "next/image";
import { OrderTracker, OrderTimeline, StageBadge } from "@/components/portal/order-tracker";
import { ContractSign } from "@/components/portal/contract-sign";
import { PaymentPanel } from "@/components/portal/payment-panel";
import { DeliveryPicker } from "@/components/portal/delivery-picker";
import { BANK_DETAILS } from "@/lib/portal-ops";
import { vehicleImage } from "@/lib/vehicle-image";

export default async function OrderDetailPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const user = (await getCurrentUser())!;
  const order = await getOrderByRef(user.id, ref);
  if (!order) notFound();

  const stage = order.stage as OrderStage;
  const showContract = order.contract && order.contract.status === "sent";
  const showPayment = order.payment && order.payment.status !== "received";
  const meta = STAGE_META[stage];
  const window = deliveryWindow(order as never);
  const config = (order.configuration ?? {}) as Record<string, string | number>;
  const configEntries = Object.entries(config);

  return (
    <div className="max-w-[760px]">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-[.8rem] font-medium text-ink-2 hover:text-ink">
        <span aria-hidden>&larr;</span> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="relative h-20 w-28 flex-none overflow-hidden rounded-lg border border-line bg-paper">
          <Image src={vehicleImage(order.modelSlug)} alt={order.modelName} fill sizes="112px" className="object-contain p-1.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[.74rem] font-semibold uppercase tracking-[.16em] text-ink-2">{order.reference}</div>
          <h1 className="mt-0.5 text-[clamp(1.4rem,3.6vw,2.1rem)] font-semibold tracking-[-0.02em]">{meta.headline}</h1>
          <p className="mt-1 text-ink-2">{order.modelName} · {gbpFromPence(order.totalAmount)}</p>
        </div>
        <StageBadge stage={stage} />
      </div>

      {/* Action required: contract / payment / delivery / delivered */}
      {showContract && (
        <div className="mt-6"><ContractSign orderId={order.id} reference={order.reference} model={order.modelName} total={gbpFromPence(order.totalAmount)} tncsVersion={order.contract!.tncsVersion} /></div>
      )}
      {showPayment && (
        <div className="mt-6"><PaymentPanel orderId={order.id} reference={order.payment!.reference} amount={gbpFromPence(order.payment!.amount)} status={order.payment!.status} bank={BANK_DETAILS} /></div>
      )}
      {stage === "ready_for_delivery" && (
        <div className="mt-6"><DeliveryPicker orderId={order.id} chosen={(order.deliveryDates as string[] | null) ?? null} slot={order.deliverySlot} /></div>
      )}
      {stage === "delivered" && (
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6 sm:p-7">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-emerald-900"><Tick /> Delivered, enjoy every journey</h2>
          <p className="mt-2 text-[.95rem] leading-relaxed text-emerald-800">Your {order.modelName} has been delivered. It now lives in <Link href="/account/fleet" className="font-semibold underline underline-offset-2">Manage my fleet</Link>, where you can book servicing and view your warranty and documents.</p>
        </div>
      )}

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

function Tick() {
  return <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" /><path d="M4.5 8.5l2.2 2.2L11.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
