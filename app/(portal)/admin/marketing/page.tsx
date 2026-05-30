import { getCampaigns } from "@/lib/admin-data";
import { gbpFromPence, formatDate } from "@/lib/format";
import { CampaignForm } from "@/components/portal/marketing-forms";
import { cn } from "@/lib/utils";

const CH_STYLE: Record<string, string> = { email: "bg-blue-50 text-blue-700 border-blue-200", google_ads: "bg-violet-50 text-violet-700 border-violet-200", social: "bg-cyan-50 text-cyan-700 border-cyan-200", other: "bg-paper text-ink-2 border-line-2" };
const ST_STYLE: Record<string, string> = { active: "bg-emerald-50 text-emerald-700 border-emerald-200", paused: "bg-amber-50 text-amber-800 border-amber-200", completed: "bg-paper text-ink-2 border-line-2" };

export default async function AdminMarketing() {
  const campaigns = await getCampaigns();
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalConv = campaigns.reduce((s, c) => s + c.conversions, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Marketing operations</h1>
          <p className="mt-1 text-[.9rem] text-ink-2">Track campaigns across email and Google Ads, with spend and results.</p>
        </div>
        <CampaignForm />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["Total budget", gbpFromPence(totalBudget)], ["Total spent", gbpFromPence(totalSpent)], ["Leads", String(totalLeads)], ["Conversions", String(totalConv)]].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-line bg-white p-5"><div className="text-[1.7rem] font-semibold tracking-[-0.02em] tabular-nums">{v}</div><div className="mt-1 text-[.8rem] text-ink-2">{l}</div></div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-[.9rem]">
          <thead><tr className="border-b border-line bg-paper text-left text-[.66rem] font-semibold uppercase tracking-[.1em] text-ink-2"><th className="p-3.5">Campaign</th><th className="p-3.5">Channel</th><th className="p-3.5">Status</th><th className="p-3.5">Budget</th><th className="p-3.5">Spent</th><th className="p-3.5">Leads</th><th className="p-3.5">Conv.</th><th className="p-3.5">Dates</th></tr></thead>
          <tbody>
            {campaigns.length === 0 && <tr><td colSpan={8} className="p-5 text-ink-2">No campaigns yet. Add one above.</td></tr>}
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="p-3.5 font-medium">{c.name}{c.note && <div className="text-[.78rem] font-normal text-ink-2">{c.note}</div>}</td>
                <td className="p-3.5"><span className={cn("rounded-full border px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.06em]", CH_STYLE[c.channel])}>{c.channel.replace("_", " ")}</span></td>
                <td className="p-3.5"><span className={cn("rounded-full border px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.06em]", ST_STYLE[c.status])}>{c.status}</span></td>
                <td className="p-3.5 tabular-nums">{c.budget ? gbpFromPence(c.budget) : "-"}</td>
                <td className="p-3.5 tabular-nums">{gbpFromPence(c.spent)}</td>
                <td className="p-3.5 tabular-nums">{c.leads}</td>
                <td className="p-3.5 tabular-nums font-semibold text-emerald-700">{c.conversions}</td>
                <td className="p-3.5 text-[.8rem] text-ink-2">{formatDate(c.startDate)} - {formatDate(c.endDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
