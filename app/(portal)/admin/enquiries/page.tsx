import Link from "next/link";
import { requireRole } from "@/lib/session";
import { getEnquiries } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";
import { EnquiryForm } from "@/components/portal/marketing-forms";
import { MarkHandled } from "@/components/portal/enquiry-actions";
import { cn } from "@/lib/utils";

const SRC_STYLE: Record<string, string> = { web: "bg-blue-50 text-blue-700 border-blue-200", phone: "bg-emerald-50 text-emerald-700 border-emerald-200", email: "bg-violet-50 text-violet-700 border-violet-200", event: "bg-amber-50 text-amber-800 border-amber-200" };
const FILTERS = [{ key: "new", label: "Open" }, { key: "handled", label: "Handled" }, { key: "all", label: "All" }];

export default async function AdminEnquiries({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireRole(["admin"]);
  const { status } = await searchParams;
  const filter = status === "handled" || status === "all" ? status : "new";
  const enquiries = await getEnquiries();
  const open = enquiries.filter((e) => e.status === "new");
  const shown = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Customer enquiries</h1>
          <p className="mt-1 text-[.9rem] text-ink-2">{open.length} open of {enquiries.length} logged. Capture every question that comes in.</p>
        </div>
        <EnquiryForm />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((t) => (
          <Link key={t.key} href={t.key === "new" ? "/admin/enquiries" : `/admin/enquiries?status=${t.key}`}
            className={cn("rounded-full border px-3.5 py-1.5 text-[.7rem] font-semibold uppercase tracking-[.06em] transition-colors", filter === t.key ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink hover:text-ink")}>
            {t.label}
          </Link>
        ))}
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {shown.length === 0 && <li className="rounded-lg border border-line bg-white p-6 text-ink-2">No {filter === "all" ? "" : filter === "new" ? "open " : "handled "}enquiries.</li>}
        {shown.map((e) => (
          <li key={e.id} className={cn("rounded-lg border bg-white p-5", e.status === "new" ? "border-line" : "border-line opacity-70")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2"><span className="font-semibold">{e.name}</span><span className={cn("rounded-full border px-2 py-0.5 text-[.6rem] font-semibold uppercase tracking-[.06em]", SRC_STYLE[e.source])}>{e.source}</span>{e.status === "handled" && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[.6rem] font-semibold uppercase tracking-[.06em] text-emerald-700">Handled</span>}</div>
                <div className="text-[.82rem] text-ink-2">{e.email}{e.subject ? ` · ${e.subject}` : ""}</div>
                <p className="mt-2 text-[.92rem]">{e.message}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[.76rem] text-ink-2">{formatDate(e.createdAt)}</span>
                {e.status === "new" && <MarkHandled id={e.id} />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
