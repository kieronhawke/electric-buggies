import Link from "next/link";
import { adminKpis } from "@/lib/portal-ops";
import { getServicesAdmin } from "@/lib/admin-data";
import { gbpFromPence, type OrderStage } from "@/lib/orders";
import { StageBadge } from "@/components/portal/order-tracker";

export default async function AdminDashboard() {
  const kpis = await adminKpis();
  const services = await getServicesAdmin();
  const openServices = services.filter((s) => s.status !== "resolved");

  const cards = [
    { label: "Active orders", value: kpis.activeOrders, href: "/admin/orders" },
    { label: "Awaiting payment", value: kpis.awaitingPayment, href: "/admin/orders" },
    { label: "Open service jobs", value: kpis.openServices, href: "/admin/service" },
    { label: "Open deals", value: kpis.openDeals, href: "/admin/crm" },
  ];

  return (
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.1rem)] font-semibold tracking-[-0.02em]">Operations</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-lg border border-line bg-white p-5 transition-colors hover:border-line-2">
            <div className="text-[2rem] font-semibold tracking-[-0.02em] tabular-nums">{c.value}</div>
            <div className="mt-1 text-[.8rem] text-ink-2">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Recent orders</h2>
          {kpis.recentOrders.length === 0 ? (
            <p className="mt-4 text-[.9rem] text-ink-2">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {kpis.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.reference}`} className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-ink">
                    <span>
                      <span className="block text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">{o.reference}</span>
                      <span className="text-[.92rem] font-medium">{o.modelName} · {gbpFromPence(o.totalAmount)}</span>
                    </span>
                    <StageBadge stage={o.stage as OrderStage} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Tasks</h2>
          <ul className="mt-4 flex flex-col gap-3 text-[.9rem]">
            {kpis.awaitingPayment > 0 && <li className="flex items-center justify-between gap-2"><span>{kpis.awaitingPayment} order(s) awaiting payment confirmation</span><Link href="/admin/orders" className="text-[.78rem] font-semibold underline-offset-2 hover:underline">View</Link></li>}
            {openServices.filter((s) => !s.engineerId).length > 0 && <li className="flex items-center justify-between gap-2"><span>{openServices.filter((s) => !s.engineerId).length} service job(s) need an engineer</span><Link href="/admin/service" className="text-[.78rem] font-semibold underline-offset-2 hover:underline">Assign</Link></li>}
            {kpis.openDeals > 0 && <li className="flex items-center justify-between gap-2"><span>{kpis.openDeals} open deal(s) in the pipeline</span><Link href="/admin/crm" className="text-[.78rem] font-semibold underline-offset-2 hover:underline">Open CRM</Link></li>}
            {kpis.awaitingPayment === 0 && openServices.length === 0 && kpis.openDeals === 0 && <li className="text-ink-2">Nothing needs attention. Nice.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
