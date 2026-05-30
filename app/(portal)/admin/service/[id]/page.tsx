import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getServiceAdmin, getEngineers } from "@/lib/admin-data";
import { formatDate } from "@/lib/orders";
import { serviceStatusStyle } from "@/lib/status-style";
import { vehicleImageByName } from "@/lib/vehicle-image";
import { AssignEngineer } from "@/components/portal/assign-engineer";
import { cn } from "@/lib/utils";

const SVC_LABEL: Record<string, string> = {
  received: "Received", acknowledged: "Acknowledged", engineer_assigned: "Engineer assigned", in_progress: "In progress", resolved: "Resolved",
};

export default async function AdminServiceDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["admin"]);
  const { id } = await params;
  const [data, engineers] = await Promise.all([getServiceAdmin(id), getEngineers()]);
  if (!data) notFound();
  const { svc, customer, vehicle, engineerName, logs } = data;
  const style = serviceStatusStyle(svc.status);
  const preferred = Array.isArray(svc.preferredDates) ? (svc.preferredDates as string[]) : [];

  return (
    <div>
      <Link href="/admin/service" className="text-[.8rem] font-medium text-ink-2 hover:text-ink">&larr; Service requests</Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-ink-2">{svc.reference}</div>
          <h1 className="mt-1 text-2xl font-semibold capitalize">{vehicle?.modelName ?? "Vehicle"} · {svc.type}</h1>
          <p className="mt-1 text-[.9rem] text-ink-2">{customer?.name ?? "-"}{customer?.email ? ` · ${customer.email}` : ""}</p>
        </div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[.66rem] font-semibold uppercase tracking-[.08em]", style.badge)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />{SVC_LABEL[svc.status]}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-4">
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Reported issue</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-[.7rem] font-semibold uppercase tracking-[.06em]">
              <span className="rounded-full border border-line-2 px-2.5 py-1 capitalize text-ink-2">{svc.type}</span>
              {svc.tier && <span className="rounded-full border border-line-2 px-2.5 py-1 text-ink-2">Tier: {svc.tier}</span>}
              {svc.faultType && <span className="rounded-full border border-line-2 px-2.5 py-1 text-ink-2">{svc.faultType}</span>}
              {svc.severity && <span className="rounded-full border border-line-2 px-2.5 py-1 capitalize text-ink-2">Severity: {svc.severity}</span>}
            </div>
            <p className="mt-3 text-[.95rem] leading-relaxed">{svc.description}</p>
            {preferred.length > 0 && (
              <p className="mt-3 text-[.85rem] text-ink-2">Preferred dates: {preferred.map((d) => formatDate(d)).join(", ")}</p>
            )}
            <p className="mt-3 text-[.78rem] text-ink-2">Raised {formatDate(svc.createdAt)} · Updated {formatDate(svc.updatedAt)}</p>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
            <h2 className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Engineer work log</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {logs.length === 0 && <li className="text-[.88rem] text-ink-2">No work logged yet.</li>}
              {logs.map((l) => (
                <li key={l.id} className="rounded-[4px] border border-line p-3.5">
                  <div className="flex items-center justify-between gap-2 text-[.74rem] text-ink-2">
                    <span>{l.engineerName} · {formatDate(l.createdAt)}{l.minutesSpent ? ` · ${l.minutesSpent} min` : ""}</span>
                    {!l.customerVisible && <span className="rounded-full border border-line-2 px-2 py-0.5 text-[.58rem] font-semibold uppercase">Internal</span>}
                  </div>
                  <p className="mt-1.5 text-[.92rem]">{l.workDone}</p>
                  {l.diagnosis && <p className="mt-1 text-[.85rem] text-ink-2">Diagnosis: {l.diagnosis}</p>}
                  {l.parts && <p className="mt-0.5 text-[.85rem] text-ink-2">Parts: {l.parts}</p>}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Vehicle</h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-16 w-24 flex-none overflow-hidden rounded-md bg-paper">
                <Image src={vehicleImageByName(vehicle?.modelName)} alt={vehicle?.modelName ?? "Vehicle"} fill sizes="96px" className="object-contain p-1.5" />
              </div>
              <div className="min-w-0 text-[.85rem]">
                <div className="font-semibold">{vehicle?.modelName ?? "-"}</div>
                {vehicle?.vin && <div className="text-ink-2">VIN {vehicle.vin}</div>}
                {vehicle?.registration && <div className="text-ink-2">{vehicle.registration}</div>}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Assigned engineer</h2>
            <div className="mt-3">
              {engineerName && <p className="mb-2 text-[.9rem] font-medium">{engineerName}</p>}
              <AssignEngineer serviceId={svc.id} engineers={engineers} current={svc.engineerId} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
