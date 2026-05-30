import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDealAdmin } from "@/lib/admin-data";
import { gbpFromPence, formatDate } from "@/lib/format";
import { vehicleImage } from "@/lib/vehicle-image";
import { avatarStyle, DEAL_STAGE_STYLE } from "@/lib/status-style";
import { QuoteCreate } from "@/components/portal/quote-create";
import { ConvertDeal } from "@/components/portal/convert-deal";
import { cn } from "@/lib/utils";

const STAGE_LABEL: Record<string, string> = { new: "New enquiry", contacted: "Contacted", quote_sent: "Quote sent", negotiation: "Negotiation", won: "Won", lost: "Lost" };

export default async function DealDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getDealAdmin(id);
  if (!data) notFound();
  const { deal, activity } = data;
  const av = avatarStyle(deal.assigneeName || "EB");
  const style = DEAL_STAGE_STYLE[deal.stage];

  return (
    <div className="max-w-[900px]">
      <Link href="/admin/crm" className="text-[.8rem] font-medium text-ink-2 hover:text-ink">&larr; Pipeline</Link>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <div className="relative h-20 w-28 flex-none overflow-hidden rounded-lg border border-line bg-paper"><Image src={vehicleImage(deal.modelSlug)} alt="" fill sizes="112px" className="object-contain p-1.5" /></div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold">{deal.name}</h1>
          <p className="text-[.9rem] text-ink-2">{deal.company ?? "Individual"} · {deal.email}{deal.phone ? ` · ${deal.phone}` : ""}</p>
        </div>
        <span className={cn("rounded-full border px-3 py-1.5 text-[.66rem] font-semibold uppercase tracking-[.08em]", style.ring, style.tint)}>{STAGE_LABEL[deal.stage]}</span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[["Value", deal.value != null ? gbpFromPence(deal.value) : "-"], ["Source", deal.source], ["Next action", deal.nextAction ?? "-"]].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-line bg-white p-4"><div className="text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2">{l}</div><div className="mt-1 font-semibold capitalize">{v}</div></div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-white p-4">
        <span className={cn("grid h-8 w-8 place-items-center rounded-full text-[.7rem] font-bold text-white", av.bg)}>{av.initials}</span>
        <span className="text-[.9rem]">Owned by <b>{deal.assigneeName || "Unassigned"}</b></span>
      </div>

      {deal.note && <div className="mt-4 rounded-lg border border-line bg-white p-5"><h2 className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Notes</h2><p className="mt-2 text-[.95rem]">{deal.note}</p></div>}

      {deal.orderId ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-[.92rem] text-emerald-800">This deal has been converted to an order.</div>
      ) : (
        <div className="mt-4">{deal.stage === "won" ? <ConvertDeal dealId={deal.id} /> : null}</div>
      )}

      {/* Create a quote straight from the deal */}
      <div className="mt-4">
        <h2 className="mb-2 text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Issue a quote</h2>
        <QuoteCreate prefill={{ name: deal.name, email: deal.email, modelSlug: deal.modelSlug ?? undefined, basePounds: deal.value ? deal.value / 100 : undefined, dealId: deal.id }} />
      </div>

      <section className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Activity</h2>
        <ul className="mt-3 flex flex-col gap-1.5 text-[.84rem]">
          {activity.length === 0 && <li className="text-ink-2">No activity yet.</li>}
          {activity.map((a) => <li key={a.id} className="flex items-center justify-between gap-2"><span>{a.action} · {a.actorName}</span><span className="text-ink-2">{formatDate(a.createdAt)}</span></li>)}
        </ul>
      </section>
    </div>
  );
}
