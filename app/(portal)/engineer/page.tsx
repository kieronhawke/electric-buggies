import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getEngineerServices } from "@/lib/engineer-data";
import { formatDate } from "@/lib/orders";

const SVC_LABEL: Record<string, string> = {
  received: "Received", acknowledged: "Acknowledged", engineer_assigned: "Assigned", in_progress: "In progress", resolved: "Resolved",
};

export default async function EngineerDashboard() {
  const me = (await getCurrentUser())!;
  const services = await getEngineerServices(me.id, me.role === "admin");
  const open = services.filter((s) => s.status !== "resolved");
  const done = services.filter((s) => s.status === "resolved");

  return (
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.1rem)] font-semibold tracking-[-0.02em]">Service dashboard</h1>
      <p className="mt-1 text-ink-2">Jobs assigned to you. Log your work to build the service history.</p>

      <h2 className="mt-7 text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Open ({open.length})</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {open.length === 0 && <li className="text-[.9rem] text-ink-2">No open jobs assigned to you.</li>}
        {open.map((s) => (
          <li key={s.id}>
            <Link href={`/engineer/${s.id}`} className="block rounded-lg border border-line bg-white p-5 transition-shadow hover:shadow-[0_22px_40px_-32px_rgba(0,0,0,0.3)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">{s.reference}</div>
                  <div className="mt-1 font-semibold">{s.vehicle?.modelName ?? "Vehicle"} · <span className="capitalize">{s.type}</span></div>
                  <p className="mt-1 line-clamp-2 text-[.88rem] text-ink-2">{s.description}</p>
                </div>
                <span className="rounded-full bg-ink px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.08em] text-white">{SVC_LABEL[s.status]}</span>
              </div>
              <div className="mt-2 text-[.78rem] text-ink-2">{s.customerName} · raised {formatDate(s.createdAt)}</div>
            </Link>
          </li>
        ))}
      </ul>

      {done.length > 0 && (
        <>
          <h2 className="mt-8 text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Resolved ({done.length})</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {done.map((s) => (
              <li key={s.id}><Link href={`/engineer/${s.id}`} className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-[.88rem] hover:border-line-2"><span>{s.reference} · {s.vehicle?.modelName}</span><span className="text-ink-2">{formatDate(s.updatedAt)}</span></Link></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
