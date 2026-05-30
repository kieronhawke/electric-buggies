import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getOrdersForUser, isActiveOrder, STAGE_META, STAGE_LABEL, gbpFromPence, deliveryWindow, type OrderStage } from "@/lib/orders";
import { OrderTracker } from "@/components/portal/order-tracker";

export default async function AccountHome() {
  const user = (await getCurrentUser())!;
  const orders = await getOrdersForUser(user.id);
  const active = orders.find((o) => isActiveOrder(o.stage as OrderStage)) ?? orders[0];
  const firstName = user.name.split(" ")[0];

  return (
    <div>
      <p className="text-[.74rem] font-semibold uppercase tracking-[.18em] text-ink-2">Your account</p>
      <h1 className="mt-1 text-[clamp(1.7rem,4vw,2.4rem)] font-semibold tracking-[-0.02em]">Welcome back, {firstName}.</h1>

      {active ? (
        <Link
          href={`/account/orders/${active.reference}`}
          className="mt-7 block rounded-lg border border-line bg-white p-6 transition-shadow hover:shadow-[0_24px_44px_-32px_rgba(0,0,0,0.32)] sm:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-ink-2">{active.reference}</div>
              <h2 className="mt-1 text-xl font-semibold">{STAGE_META[active.stage as OrderStage].headline}</h2>
              <p className="mt-1 text-[.92rem] text-ink-2">{active.modelName} · {gbpFromPence(active.totalAmount)}</p>
            </div>
            <span className="rounded-full border border-line-2 px-3 py-1 text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2">
              {STAGE_LABEL[active.stage as OrderStage]}
            </span>
          </div>
          <div className="mt-6">
            <OrderTracker stage={active.stage as OrderStage} />
          </div>
          {(() => {
            const w = deliveryWindow(active as never);
            return w ? (
              <p className="mt-6 text-[.86rem] text-ink-2">
                {w.overdue ? "Updated delivery estimate coming shortly. " : "Estimated delivery "}
                {!w.overdue && <span className="font-semibold text-ink">{w.start} to {w.end}</span>}
              </p>
            ) : null;
          })()}
        </Link>
      ) : (
        <div className="mt-7 rounded-lg border border-line bg-white p-7 text-center">
          <p className="text-ink-2">You have no active orders yet.</p>
          <Link href="/configure" className="mt-3 inline-block text-[.8rem] font-semibold uppercase tracking-[.06em] underline-offset-4 hover:underline">
            Configure a vehicle
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { href: "/account/orders", label: "Orders", note: `${orders.length} total` },
          { href: "/account/fleet", label: "My fleet", note: "Vehicles & service" },
          { href: "/account/quotes", label: "Quotes", note: "Saved & received" },
          { href: "/account/profile", label: "Profile", note: "Your details" },
          { href: "/account/notifications", label: "Notifications", note: "How we reach you" },
          { href: "/account/help", label: "Help", note: "Talk to the team" },
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
