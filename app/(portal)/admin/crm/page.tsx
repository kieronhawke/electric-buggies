import { getDealsAdmin } from "@/lib/admin-data";
import { CrmBoard } from "@/components/portal/crm-board";

export default async function AdminCrm() {
  const deals = await getDealsAdmin();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Pipeline</h1>
          <p className="mt-1 text-[.9rem] text-ink-2">Drag deals between stages. Won deals can convert to an order.</p>
        </div>
      </div>
      <div className="mt-6">
        {deals.length === 0 ? <p className="text-ink-2">No deals yet. Leads from the quote, hire and airport forms appear here.</p> : <CrmBoard deals={deals} />}
      </div>
    </div>
  );
}
