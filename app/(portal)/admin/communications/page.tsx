import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listTemplates, listCustomEmails } from "@/lib/comms-data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCommunications() {
  await requireRole(["admin"]);
  const [templates, custom] = await Promise.all([listTemplates(), listCustomEmails()]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Communications</h1>
          <p className="mt-1 text-[.9rem] text-ink-2">Edit the transactional emails customers receive. Changes apply to new sends immediately.</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[720px] border-collapse text-[.9rem]">
          <thead><tr className="border-b border-line bg-paper text-left text-[.66rem] font-semibold uppercase tracking-[.1em] text-ink-2">
            <th className="p-3.5">Email</th><th className="p-3.5">Sends when</th><th className="p-3.5">Status</th><th className="p-3.5">Last edited</th><th className="p-3.5"></th>
          </tr></thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.key} className="border-b border-line last:border-0">
                <td className="p-3.5"><div className="font-medium text-ink">{t.name}</div><div className="text-[.78rem] text-ink-2">{t.purpose}</div></td>
                <td className="p-3.5 text-[.82rem] text-ink-2">{t.trigger}</td>
                <td className="p-3.5">
                  <span className={cn("rounded-full border px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.06em]", t.customised ? "border-violet-200 bg-violet-50 text-violet-700" : "border-line-2 bg-paper text-ink-2")}>{t.customised ? "Customised" : "Default"}</span>
                </td>
                <td className="p-3.5 text-[.8rem] text-ink-2">{t.customised ? `${formatDate(t.updatedAt)}${t.updatedByName ? ` · ${t.updatedByName}` : ""}` : "-"}</td>
                <td className="p-3.5 text-right"><Link href={`/admin/communications/${t.key}`} className="rounded-md border border-line-2 px-3 py-1.5 text-[.78rem] font-semibold text-ink hover:border-ink">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-[1.05rem] font-semibold tracking-[-.01em]">Custom emails</h2>
        <p className="mt-1 text-[.85rem] text-ink-2">Ad-hoc one-off emails composed from brand blocks. Drafts are saved here.</p>
        <div className="mt-3 flex items-center gap-3">
          <Link href="/admin/communications/custom/new" className="rounded-md bg-ink px-4 py-2 text-[.82rem] font-semibold text-white">Compose a custom email</Link>
        </div>
        {custom.length > 0 && (
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {custom.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0"><div className="truncate font-medium text-ink">{c.name}</div><div className="truncate text-[.78rem] text-ink-2">{c.subject}</div></div>
                <Link href={`/admin/communications/custom/${c.id}`} className="shrink-0 rounded-md border border-line-2 px-3 py-1.5 text-[.78rem] font-semibold text-ink hover:border-ink">Open</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
