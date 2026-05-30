import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { getOrdersForUser, isActiveOrder, STAGE_META, gbpFromPence, deliveryWindow, type OrderStage } from "@/lib/orders";
import { OrderTracker, StageBadge } from "@/components/portal/order-tracker";
import { orderStageStyle } from "@/lib/status-style";
import { vehicleImage } from "@/lib/vehicle-image";

const ACTION_FOR: Partial<Record<OrderStage, { label: string; cta: string }>> = {
  contract_sent: { label: "Action needed: sign your contract", cta: "Review & sign" },
  payment_pending: { label: "Action needed: complete your payment", cta: "Make payment" },
  ready_for_delivery: { label: "Action needed: choose your delivery date", cta: "Choose date" },
};

export default async function AccountHome() {
  const user = (await getCurrentUser())!;
  const orders = await getOrdersForUser(user.id);
  const firstName = user.name.split(" ")[0];
  const active = orders.filter((o) => isActiveOrder(o.stage as OrderStage));
  const actionOrders = orders.filter((o) => ACTION_FOR[o.stage as OrderStage]);
  const headline = active[0] ?? orders[0];

  return (
    <div>
      <p className="text-[.74rem] font-semibold uppercase tracking-[.18em] text-ink-2">Your account</p>
      <h1 className="mt-1 text-[clamp(1.7rem,4vw,2.4rem)] font-semibold tracking-[-0.02em]">Welcome back, {firstName}.</h1>

      {/* Required actions, surfaced in amber */}
      {actionOrders.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {actionOrders.map((o) => {
            const a = ACTION_FOR[o.stage as OrderStage]!;
            return (
              <Link key={o.id} href={`/account/orders/${o.reference}`} className="flex items-center gap-4 rounded-lg border border-amber-300 bg-amber-50 p-4 transition-colors hover:bg-amber-100/70">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-amber-500 text-white"><BellIcon /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[.95rem] font-semibold text-amber-900">{a.label}</span>
                  <span className="block text-[.82rem] text-amber-800">{o.reference} · {o.modelName}</span>
                </span>
                <span className="flex-none rounded-[2px] bg-ink px-4 py-2 text-[.7rem] font-semibold uppercase tracking-[.06em] text-white">{a.cta}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Active order summary with photo */}
      {headline ? (
        <Link href={`/account/orders/${headline.reference}`} className="mt-6 block overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-[0_24px_44px_-32px_rgba(0,0,0,0.32)]">
          <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
            <div className={`relative aspect-[16/11] sm:aspect-auto ${orderStageStyle(headline.stage as OrderStage).badge.split(" ")[0]}`}>
              <Image src={vehicleImage(headline.modelSlug)} alt={headline.modelName} fill sizes="200px" className="object-contain p-3" />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-ink-2">{headline.reference}</div>
                  <h2 className="mt-1 text-xl font-semibold">{STAGE_META[headline.stage as OrderStage].headline}</h2>
                  <p className="mt-1 text-[.92rem] text-ink-2">{headline.modelName} · {gbpFromPence(headline.totalAmount)}</p>
                </div>
                <StageBadge stage={headline.stage as OrderStage} />
              </div>
              <div className="mt-5"><OrderTracker stage={headline.stage as OrderStage} /></div>
              {(() => { const w = deliveryWindow(headline as never); return w && !w.overdue ? <p className="mt-5 text-[.84rem] text-ink-2">Estimated delivery <span className="font-semibold text-ink">{w.start} to {w.end}</span></p> : null; })()}
            </div>
          </div>
        </Link>
      ) : (
        <div className="mt-6 rounded-lg border border-line bg-white p-7 text-center">
          <p className="text-ink-2">You have no orders yet.</p>
          <Link href="/configure" className="mt-3 inline-block text-[.8rem] font-semibold uppercase tracking-[.06em] underline-offset-4 hover:underline">Configure a vehicle</Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { href: "/account/orders", label: "Orders", note: `${orders.length} total` },
          { href: "/account/fleet", label: "My fleet", note: "Vehicles & service" },
          { href: "/account/quotes", label: "Quotes", note: "Saved & received" },
          { href: "/account/profile", label: "Profile", note: "Your details" },
          { href: "/account/notifications", label: "Notifications", note: "How we reach you" },
          { href: "/account/help", label: "Help centre", note: "Answers & contact" },
        ].map((t) => (
          <Link key={t.href} href={t.href} className="rounded-lg border border-line bg-white p-4 transition-colors hover:border-line-2">
            <div className="text-[.95rem] font-semibold">{t.label}</div>
            <div className="mt-0.5 text-[.78rem] text-ink-2">{t.note}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BellIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></svg>;
}
