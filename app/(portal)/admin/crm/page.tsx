import { requireRole } from "@/lib/session";
import { getDealsAdmin, getAbandonedLeadsAdmin } from "@/lib/admin-data";
import { addLeadToPipeline } from "@/lib/crm-actions";
import { vehicleImage } from "@/lib/vehicle-image";
import { formatDate } from "@/lib/format";
import { CrmBoard } from "@/components/portal/crm-board";
import Image from "next/image";

export default async function AdminCrm() {
  await requireRole(["admin"]);
  const [deals, leads] = await Promise.all([getDealsAdmin(), getAbandonedLeadsAdmin()]);

  async function pull(formData: FormData) {
    "use server";
    await addLeadToPipeline(String(formData.get("leadId")));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Pipeline</h1>
          <p className="mt-1 text-[.9rem] text-ink-2">Drag deals between stages. Won deals can convert to an order.</p>
        </div>
      </div>

      <section className="mt-6 rounded-lg border border-line bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[.7rem] font-semibold uppercase tracking-[.12em] text-ink-2">Abandoned leads</h2>
          <span className="text-[.72rem] text-ink-2">{leads.length} waiting</span>
        </div>
        {leads.length === 0 ? (
          <p className="mt-2 text-[.84rem] text-ink-2">Nothing to recover right now. People who start a quote, hire or airport form and drop off will show up here.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {leads.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 rounded-[6px] border border-line bg-paper p-2.5">
                <div className="relative h-10 w-14 flex-none overflow-hidden rounded bg-white"><Image src={vehicleImage(l.modelSlug)} alt="" fill sizes="56px" className="object-contain p-1" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[.88rem] font-semibold">{l.name || l.email}</div>
                  <div className="truncate text-[.76rem] text-ink-2">{l.email} · <span className="capitalize">{l.flow}</span> form{l.modelSlug ? ` · ${l.modelSlug}` : ""} · {formatDate(l.createdAt)}</div>
                </div>
                <form action={pull}>
                  <input type="hidden" name="leadId" value={l.id} />
                  <button type="submit" className="rounded-[2px] border border-line-2 px-3 py-1.5 text-[.68rem] font-semibold uppercase tracking-[.06em] text-ink-2 transition-colors hover:border-ink hover:text-ink">Add to pipeline</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6">
        {deals.length === 0 ? <p className="text-ink-2">No deals yet. Leads from the quote, hire and airport forms appear here.</p> : <CrmBoard deals={deals} />}
      </div>
    </div>
  );
}
