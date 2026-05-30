import Link from "next/link";
import { getServicesAdmin, getEngineers } from "@/lib/admin-data";
import { requireRole } from "@/lib/session";
import { formatDate } from "@/lib/orders";
import { serviceStatusStyle } from "@/lib/status-style";
import { AssignEngineer } from "@/components/portal/assign-engineer";
import { cn } from "@/lib/utils";

const SVC_LABEL: Record<string, string> = {
  received: "Received", acknowledged: "Acknowledged", engineer_assigned: "Engineer assigned", in_progress: "In progress", resolved: "Resolved",
};

export default async function AdminService() {
  await requireRole(["admin"]);
  const [services, engineers] = await Promise.all([getServicesAdmin(), getEngineers()]);
  return (
    <div>
      <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Service requests</h1>
      {services.length === 0 ? (
        <p className="mt-6 text-ink-2">No service requests yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[760px] border-collapse text-[.9rem]">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2">
                <th className="p-3.5">Ref</th><th className="p-3.5">Customer</th><th className="p-3.5">Vehicle</th><th className="p-3.5">Type</th><th className="p-3.5">Status</th><th className="p-3.5">Engineer</th><th className="p-3.5">Raised</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => {
                const style = serviceStatusStyle(s.status);
                return (
                  <tr key={s.id} className="border-b border-line last:border-0 hover:bg-paper/60">
                    <td className="p-3.5 font-semibold"><Link href={`/admin/service/${s.id}`} className="underline-offset-2 hover:underline">{s.reference}</Link></td>
                    <td className="p-3.5"><Link href={`/admin/service/${s.id}`} className="block">{s.customerName ?? "-"}</Link></td>
                    <td className="p-3.5"><Link href={`/admin/service/${s.id}`} className="block">{s.vehicle?.modelName ?? "-"}</Link></td>
                    <td className="p-3.5 capitalize"><Link href={`/admin/service/${s.id}`} className="block">{s.type}</Link></td>
                    <td className="p-3.5"><Link href={`/admin/service/${s.id}`} className="block"><span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.64rem] font-semibold uppercase tracking-[.08em]", style.badge)}><span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />{SVC_LABEL[s.status]}</span></Link></td>
                    <td className="p-3.5">{s.engineerName ?? <AssignEngineer serviceId={s.id} engineers={engineers} current={s.engineerId} />}</td>
                    <td className="p-3.5 text-ink-2">{formatDate(s.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
