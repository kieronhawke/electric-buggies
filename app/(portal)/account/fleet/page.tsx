import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getOrdersForUser } from "@/lib/orders";

export default async function FleetPage() {
  const user = (await getCurrentUser())!;
  const orders = await getOrdersForUser(user.id);
  const delivered = orders.filter((o) => o.stage === "delivered");

  return (
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Manage my fleet</h1>
      <p className="mt-1 text-ink-2">Your delivered vehicles, with specifications, warranty and service history.</p>
      {delivered.length === 0 ? (
        <div className="mt-7 rounded-lg border border-line bg-white p-8 text-center">
          <p className="text-ink-2">Your vehicles will appear here once your first order is delivered.</p>
          <Link href="/account/orders" className="mt-3 inline-block text-[.8rem] font-semibold uppercase tracking-[.06em] underline-offset-4 hover:underline">
            View your orders
          </Link>
        </div>
      ) : (
        <ul className="mt-7 grid gap-4 sm:grid-cols-2">
          {delivered.map((o) => (
            <li key={o.id} className="rounded-lg border border-line bg-white p-5">
              <div className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-ink-2">{o.reference}</div>
              <h2 className="mt-1 text-lg font-semibold">{o.modelName}</h2>
              <p className="mt-1 text-[.85rem] text-ink-2">Servicing and maintenance options are coming to your fleet soon.</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
