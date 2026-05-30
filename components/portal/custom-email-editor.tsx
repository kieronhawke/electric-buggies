"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MERGE_FIELDS, SAMPLE_DATA } from "@/lib/emails/registry";
import { BRAND_BLOCKS } from "@/lib/emails/blocks";
import { saveCustomEmail, sendTestTemplate } from "@/lib/comms-actions";
import { cn } from "@/lib/utils";

interface Props { id?: string; name: string; subject: string; preheader: string; html: string; heroUrl: string; testTo: string }

function buildPreview(html: string, heroUrl: string) {
  const hero = `<table role="presentation" width="100%" style="border-collapse:collapse"><tr><td style="padding:18px 40px 0"><table role="presentation" width="100%" style="border-collapse:collapse;background:#f5f6f7;border-radius:12px"><tr><td align="center" style="padding:22px"><img src="${heroUrl}" alt="Vehicle" style="display:block;width:100%;max-width:420px;height:auto;min-height:150px"></td></tr></table></td></tr></table>`;
  let out = html.split("{{HERO}}").join(hero).split("{{PREHEADER}}").join("");
  return out.replace(/\{\{(\w+)\}\}/g, (_, k: string) => SAMPLE_DATA[k] ?? "");
}

export function CustomEmailEditor(props: Props) {
  const router = useRouter();
  const [id, setId] = useState(props.id);
  const [name, setName] = useState(props.name);
  const [subject, setSubject] = useState(props.subject);
  const [preheader, setPreheader] = useState(props.preheader);
  const [html, setHtml] = useState(props.html);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [to, setTo] = useState(props.testTo);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const htmlRef = useRef<HTMLTextAreaElement>(null);
  const preview = useMemo(() => buildPreview(html, props.heroUrl), [html, props.heroUrl]);

  function insert(snippet: string) {
    const el = htmlRef.current;
    if (!el) { setHtml((h) => h + snippet); return; }
    const s = el.selectionStart ?? html.length; const e = el.selectionEnd ?? html.length;
    setHtml(html.slice(0, s) + snippet + html.slice(e));
    requestAnimationFrame(() => { el.focus(); const p = s + snippet.length; el.setSelectionRange(p, p); });
  }
  function flash(r: { ok: boolean; error?: string; message?: string } | null) {
    setMsg(r ? { ok: r.ok, text: r.ok ? r.message || "Done." : r.error || "Error." } : { ok: false, text: "No response." });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-4">
        <div className="rounded-lg border border-line bg-white p-4">
          <label htmlFor="ce-name" className="block text-[.7rem] font-semibold uppercase tracking-[.08em] text-ink-2">Internal name</label>
          <input id="ce-name" aria-label="Internal name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-md border border-line-2 px-3 py-2 text-[.9rem] focus:border-ink focus:outline-none" />
          <label htmlFor="ce-subject" className="mt-3 block text-[.7rem] font-semibold uppercase tracking-[.08em] text-ink-2">Subject line</label>
          <input id="ce-subject" aria-label="Subject line" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1.5 w-full rounded-md border border-line-2 px-3 py-2 text-[.9rem] focus:border-ink focus:outline-none" />
          <label htmlFor="ce-preheader" className="mt-3 block text-[.7rem] font-semibold uppercase tracking-[.08em] text-ink-2">Preheader</label>
          <input id="ce-preheader" aria-label="Preheader" value={preheader} onChange={(e) => setPreheader(e.target.value)} className="mt-1.5 w-full rounded-md border border-line-2 px-3 py-2 text-[.9rem] focus:border-ink focus:outline-none" />
        </div>
        <div className="rounded-lg border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line p-2.5">
            {(["preview", "code"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={cn("rounded px-3 py-1 text-[.78rem] font-medium", view === v ? "bg-ink text-white" : "text-ink-2")}>{v === "code" ? "Raw HTML" : "Preview"}</button>
            ))}
          </div>
          {view === "preview" ? (
            <div className="flex justify-center bg-[#eef0f2] p-4"><iframe title="Preview" srcDoc={preview} className="h-[560px] w-full max-w-[640px] rounded border border-line bg-white" /></div>
          ) : (
            <textarea ref={htmlRef} aria-label="Email HTML source" value={html} onChange={(e) => setHtml(e.target.value)} spellCheck={false} className="h-[560px] w-full resize-none rounded-b-lg bg-[#0d1117] p-4 font-mono text-[.78rem] leading-relaxed text-[#c9d1d9] focus:outline-none" />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button disabled={pending} onClick={() => start(async () => { const r = await saveCustomEmail({ id, name, subject, preheader, html }); flash(r); if (r?.ok && r.id && r.id !== id) { setId(r.id); router.replace(`/admin/communications/custom/${r.id}`); } })}
            className="rounded-md bg-ink px-4 py-2 text-[.82rem] font-semibold text-white disabled:opacity-40">{pending ? "Saving…" : "Save draft"}</button>
          {msg && <span className={cn("text-[.8rem]", msg.ok ? "text-emerald-700" : "text-rose-700")}>{msg.text}</span>}
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border border-line bg-white p-4">
          <h3 className="text-[.72rem] font-semibold uppercase tracking-[.08em] text-ink-2">Insert block</h3>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {BRAND_BLOCKS.map((b) => <button key={b.id} onClick={() => { setView("code"); insert(b.html); }} className="rounded-full border border-line-2 bg-paper px-2.5 py-1 text-[.74rem] text-ink hover:border-ink">{b.label}</button>)}
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white p-4">
          <h3 className="text-[.72rem] font-semibold uppercase tracking-[.08em] text-ink-2">Merge fields</h3>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {MERGE_FIELDS.map((f) => <button key={f.token} onClick={() => { setView("code"); insert(`{{${f.token}}}`); }} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-[.72rem] text-blue-700 hover:border-blue-400">{f.label}</button>)}
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white p-4">
          <h3 className="text-[.72rem] font-semibold uppercase tracking-[.08em] text-ink-2">Send a test</h3>
          <input aria-label="Test recipient email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-md border border-line-2 px-3 py-2 text-[.85rem] focus:border-ink focus:outline-none" />
          <button disabled={pending} onClick={() => start(async () => flash(await sendTestTemplate(to, { subject, preheader, html })))} className="mt-2 w-full rounded-md border border-ink px-3 py-2 text-[.8rem] font-semibold text-ink hover:bg-ink hover:text-white disabled:opacity-40">Send test email</button>
        </div>
      </aside>
    </div>
  );
}
