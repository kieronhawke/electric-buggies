import Link from "next/link";
import { getAllOrdersAdmin } from "@/lib/admin-data";
import { STAGE_LABEL, gbpFromPence, isActiveOrder, type OrderStage } from "@/lib/orders";

export default async function AdminOrders() {
  const orders = await getAllOrdersAdmin();
  return (
    <div>
      <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-6 text-ink-2">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[640px] border-collapse text-[.9rem]">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2">
                <th className="p-3.5">Reference</th><th className="p-3.5">Customer</th><th className="p-3.5">Model</th><th className="p-3.5">Total</th><th className="p-3.5">Stage</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-paper/60">
                  <td className="p-3.5"><Link href={`/admin/orders/${o.reference}`} className="font-semibold underline-offset-2 hover:underline">{o.reference}</Link></td>
                  <td className="p-3.5">{o.customer?.name ?? "-"}</td>
                  <td className="p-3.5">{o.modelName}</td>
                  <td className="p-3.5 tabular-nums">{gbpFromPence(o.totalAmount)}</td>
                  <td className="p-3.5"><span className={`rounded-full px-2.5 py-1 text-[.64rem] font-semibold uppercase tracking-[.08em] ${isActiveOrder(o.stage as OrderStage) ? "bg-ink text-white" : "border border-line-2 text-ink-2"}`}>{STAGE_LABEL[o.stage as OrderStage]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
