import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getServiceDetail } from "@/lib/engineer-data";
import { formatDate } from "@/lib/orders";
import { ServiceStatus, ServiceLogForm } from "@/components/portal/engineer-tools";

export default async function EngineerServiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = (await getCurrentUser())!;
  const data = await getServiceDetail(id);
  if (!data) notFound();
  // Scope: engineers can only open jobs assigned to them.
  if (me.role === "engineer" && data.svc.engineerId !== me.id) notFound();
  const { svc, customer, vehicle, logs } = data;

  return (
    <div>
      <Link href="/engineer" className="text-[.8rem] font-medium text-ink-2 hover:text-ink">&larr; Dashboard</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-ink-2">{svc.reference}</div>
          <h1 className="mt-1 text-2xl font-semibold capitalize">{vehicle?.modelName ?? "Vehicle"} · {svc.type}</h1>
          <p className="mt-1 text-[.9rem] text-ink-2">{customer?.name}{vehicle?.vin ? ` · VIN ${vehicle.vin}` : ""}</p>
        </div>
      </div>

      <section className="mt-5 rounded-lg border border-line bg-white p-5">
        <h2 className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Reported issue</h2>
        <p className="mt-2 text-[.95rem] leading-relaxed">{svc.description}</p>
      </section>

      <section className="mt-4 rounded-lg border border-line bg-white p-5">
        <h2 className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Status</h2>
        <div className="mt-3"><ServiceStatus serviceId={svc.id} current={svc.status} /></div>
      </section>

      <section className="mt-4 rounded-lg border border-line bg-white p-5 sm:p-6">
        <h2 className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Log work</h2>
        <div className="mt-4"><ServiceLogForm serviceId={svc.id} /></div>
      </section>

      <section className="mt-4 rounded-lg border border-line bg-white p-5 sm:p-6">
        <h2 className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Service history</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {logs.length === 0 && <li className="text-[.88rem] text-ink-2">No work logged yet.</li>}
          {logs.map((l) => (
            <li key={l.id} className="rounded-[4px] border border-line p-3.5">
              <div className="flex items-center justify-between gap-2 text-[.74rem] text-ink-2"><span>{l.engineerName} · {formatDate(l.createdAt)}{l.minutesSpent ? ` · ${l.minutesSpent} min` : ""}</span>{!l.customerVisible && <span className="rounded-full border border-line-2 px-2 py-0.5 text-[.58rem] font-semibold uppercase">Internal</span>}</div>
              <p className="mt-1.5 text-[.92rem]">{l.workDone}</p>
              {l.diagnosis && <p className="mt-1 text-[.85rem] text-ink-2">Diagnosis: {l.diagnosis}</p>}
              {l.parts && <p className="mt-0.5 text-[.85rem] text-ink-2">Parts: {l.parts}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
