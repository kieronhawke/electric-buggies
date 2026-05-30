import Link from "next/link";
import Image from "next/image";
import { getAllOrdersAdmin } from "@/lib/admin-data";
import { gbpFromPence, type OrderStage } from "@/lib/orders";
import { StageBadge } from "@/components/portal/order-tracker";
import { vehicleImage } from "@/lib/vehicle-image";

export default async function AdminOrders() {
  const orders = await getAllOrdersAdmin();
  return (
    <div>
      <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-6 text-ink-2">No orders yet.</p>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/admin/orders/${o.reference}`} className="flex items-center gap-4 rounded-lg border border-line bg-white p-4 transition-shadow hover:shadow-[0_22px_40px_-32px_rgba(0,0,0,0.3)]">
                <div className="relative h-16 w-24 flex-none overflow-hidden rounded-md bg-paper">
                  <Image src={vehicleImage(o.modelSlug)} alt={o.modelName} fill sizes="96px" className="object-contain p-1.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[.72rem] font-semibold uppercase tracking-[.12em] text-ink-2">{o.reference}</span>
                    <StageBadge stage={o.stage as OrderStage} />
                  </div>
                  <div className="mt-1 font-semibold">{o.modelName} · {gbpFromPence(o.totalAmount)}</div>
                  <div className="mt-0.5 text-[.82rem] text-ink-2">{o.customer?.name ?? "-"}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
