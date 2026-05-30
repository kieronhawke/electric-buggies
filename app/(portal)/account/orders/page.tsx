import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getOrdersForUser, STAGE_LABEL, gbpFromPence, isActiveOrder, type OrderStage } from "@/lib/orders";
import { OrderTracker } from "@/components/portal/order-tracker";

export default async function OrdersPage() {
  const user = (await getCurrentUser())!;
  const orders = await getOrdersForUser(user.id);

  return (
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Your orders</h1>
      {orders.length === 0 ? (
        <div className="mt-7 rounded-lg border border-line bg-white p-7 text-center text-ink-2">
          No orders yet. <Link href="/configure" className="font-semibold text-ink underline-offset-4 hover:underline">Configure a vehicle</Link> to begin.
        </div>
      ) : (
        <ul className="mt-7 flex flex-col gap-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/account/orders/${o.reference}`} className="block rounded-lg border border-line bg-white p-5 transition-shadow hover:shadow-[0_24px_44px_-32px_rgba(0,0,0,0.3)] sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-ink-2">{o.reference}</div>
                    <h2 className="mt-1 text-lg font-semibold">{o.modelName}</h2>
                    <p className="mt-0.5 text-[.9rem] text-ink-2">{gbpFromPence(o.totalAmount)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[.66rem] font-semibold uppercase tracking-[.1em] ${isActiveOrder(o.stage as OrderStage) ? "bg-ink text-white" : "border border-line-2 text-ink-2"}`}>
                    {STAGE_LABEL[o.stage as OrderStage]}
                  </span>
                </div>
                <div className="mt-5">
                  <OrderTracker stage={o.stage as OrderStage} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
