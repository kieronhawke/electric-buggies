import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { getVehiclesForUser, getServiceRequestsForUser, formatDate } from "@/lib/orders";
import { RequestService } from "@/components/portal/request-service";
import { vehicleImageByName } from "@/lib/vehicle-image";
import { serviceStatusStyle } from "@/lib/status-style";
import { cn } from "@/lib/utils";

const SVC_STEPS = ["received", "acknowledged", "engineer_assigned", "in_progress", "resolved"];
const SVC_LABEL: Record<string, string> = { received: "Received", acknowledged: "Acknowledged", engineer_assigned: "Engineer assigned", in_progress: "In progress", resolved: "Resolved" };

export default async function FleetPage() {
  const user = (await getCurrentUser())!;
  const [vehicles, services] = await Promise.all([getVehiclesForUser(user.id), getServiceRequestsForUser(user.id)]);

  return (
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Manage my fleet</h1>
      <p className="mt-1 text-ink-2">Your delivered vehicles, with specification, warranty and service.</p>

      {vehicles.length === 0 ? (
        <div className="mt-7 rounded-lg border border-line bg-white p-8 text-center">
          <p className="text-ink-2">Your vehicles will appear here once your first order is delivered.</p>
          <Link href="/account/orders" className="mt-3 inline-block text-[.8rem] font-semibold uppercase tracking-[.06em] underline-offset-4 hover:underline">View your orders</Link>
        </div>
      ) : (
        <ul className="mt-7 grid gap-4 lg:grid-cols-2">
          {vehicles.map((v) => {
            const spec = (v.spec ?? {}) as Record<string, string | number>;
            return (
              <li key={v.id} className="overflow-hidden rounded-lg border border-line bg-white">
                <div className="relative aspect-[16/9] bg-paper">
                  <Image src={vehicleImageByName(v.modelName)} alt={v.modelName} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-contain p-4" />
                  <span className="absolute left-3 top-3 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[.6rem] font-semibold uppercase tracking-[.08em] text-emerald-700">Delivered</span>
                </div>
                <div className="p-5 sm:p-6">
                <h2 className="text-lg font-semibold">{v.modelName}</h2>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[.86rem]">
                  {v.vin && <><dt className="text-ink-2">VIN</dt><dd className="text-right font-medium">{v.vin}</dd></>}
                  {v.registration && <><dt className="text-ink-2">Registration</dt><dd className="text-right font-medium">{v.registration}</dd></>}
                  <dt className="text-ink-2">Delivered</dt><dd className="text-right font-medium">{formatDate(v.deliveredAt) ?? "-"}</dd>
                  <dt className="text-ink-2">Warranty until</dt><dd className="text-right font-medium">{formatDate(v.warrantyEnd) ?? "-"}</dd>
                  {Object.entries(spec).slice(0, 4).map(([k, val]) => (
                    <div key={k} className="contents"><dt className="capitalize text-ink-2">{k.replace(/([A-Z])/g, " $1")}</dt><dd className="text-right font-medium">{String(val)}</dd></div>
                  ))}
                </dl>
                <RequestService vehicleId={v.id} modelName={v.modelName} />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {services.length > 0 && (
        <section className="mt-9">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Service requests</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {services.map((s) => {
              const idx = SVC_STEPS.indexOf(s.status);
              return (
                <li key={s.id} className="rounded-lg border border-line bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">{s.reference}</div>
                      <div className="mt-0.5 font-medium capitalize">{s.type}</div>
                      <p className="mt-1 text-[.88rem] text-ink-2">{s.description}</p>
                    </div>
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.08em]", serviceStatusStyle(s.status).badge)}><span className={cn("h-1.5 w-1.5 rounded-full", serviceStatusStyle(s.status).dot)} />{SVC_LABEL[s.status]}</span>
                  </div>
                  <ol className="mt-4 flex items-center gap-1">
                    {SVC_STEPS.map((st, i) => (
                      <li key={st} className="flex flex-1 items-center gap-1">
                        <span className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-emerald-400" : "bg-line-2"}`} />
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 text-[.76rem] text-ink-2">Raised {formatDate(s.createdAt)}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
