"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MERGE_FIELDS, SAMPLE_DATA } from "@/lib/emails/registry";
import { BRAND_BLOCKS } from "@/lib/emails/blocks";
import { saveTemplate, resetTemplate, revertToVersion, sendTestTemplate } from "@/lib/comms-actions";
import { cn } from "@/lib/utils";

interface Version { id: string; subject: string; editedByName: string | null; createdAt: string }
interface Props {
  templateKey: string;
  name: string;
  purpose: string;
  trigger: string;
  subject: string;
  preheader: string;
  html: string;
  customised: boolean;
  heroUrl: string;
  modelName: string;
  testTo: string;
  versions: Version[];
}

function buildPreview(html: string, heroUrl: string, modelName: string) {
  const hero = `<table role="presentation" width="100%" style="border-collapse:collapse"><tr><td style="padding:18px 40px 0"><table role="presentation" width="100%" style="border-collapse:collapse;background:#f5f6f7;border-radius:12px"><tr><td align="center" style="padding:22px"><img src="${heroUrl}" alt="${modelName}" style="display:block;width:100%;max-width:420px;height:auto;min-height:150px"></td></tr></table></td></tr></table>`;
  let out = html.split("{{HERO}}").join(hero).split("{{PREHEADER}}").join("");
  out = out.replace(/\{\{(\w+)\}\}/g, (_, k: string) => SAMPLE_DATA[k] ?? "");
  return out;
}

export function CommsEditor(props: Props) {
  const router = useRouter();
  const [subject, setSubject] = useState(props.subject);
  const [preheader, setPreheader] = useState(props.preheader);
  const [html, setHtml] = useState(props.html);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [to, setTo] = useState(props.testTo);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const htmlRef = useRef<HTMLTextAreaElement>(null);

  const dirty = subject !== props.subject || preheader !== props.preheader || html !== props.html;
  const preview = useMemo(() => buildPreview(html, props.heroUrl, props.modelName), [html, props.heroUrl, props.modelName]);

  function insert(snippet: string) {
    const el = htmlRef.current;
    if (!el) { setHtml((h) => h + snippet); return; }
    const s = el.selectionStart ?? html.length;
    const e = el.selectionEnd ?? html.length;
    const next = html.slice(0, s) + snippet + html.slice(e);
    setHtml(next);
    requestAnimationFrame(() => { el.focus(); const pos = s + snippet.length; el.setSelectionRange(pos, pos); });
  }

  function flash(r: { ok: boolean; error?: string; message?: string } | null) {
    if (!r) return setMsg({ ok: false, text: "No response." });
    setMsg({ ok: r.ok, text: r.ok ? r.message || "Done." : r.error || "Something went wrong." });
    if (r.ok) router.refresh();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Main editor column */}
      <div className="min-w-0 space-y-4">
        <div className="rounded-lg border border-line bg-white p-4">
          <label className="block text-[.7rem] font-semibold uppercase tracking-[.08em] text-ink-2">Subject line</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1.5 w-full rounded-md border border-line-2 px-3 py-2 text-[.9rem] focus:border-ink focus:outline-none" />
          <label className="mt-3 block text-[.7rem] font-semibold uppercase tracking-[.08em] text-ink-2">Preheader <span className="font-normal normal-case text-ink-3">(inbox preview text)</span></label>
          <input value={preheader} onChange={(e) => setPreheader(e.target.value)} className="mt-1.5 w-full rounded-md border border-line-2 px-3 py-2 text-[.9rem] focus:border-ink focus:outline-none" />
        </div>

        <div className="rounded-lg border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-2.5">
            <div className="inline-flex rounded-md border border-line-2 p-0.5">
              {(["preview", "code"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={cn("rounded px-3 py-1 text-[.78rem] font-medium capitalize", view === v ? "bg-ink text-white" : "text-ink-2")}>{v === "code" ? "Raw HTML" : "Preview"}</button>
              ))}
            </div>
            {view === "preview" && (
              <div className="inline-flex rounded-md border border-line-2 p-0.5">
                {(["desktop", "mobile"] as const).map((d) => (
                  <button key={d} onClick={() => setDevice(d)} className={cn("rounded px-3 py-1 text-[.78rem] font-medium capitalize", device === d ? "bg-paper text-ink" : "text-ink-2")}>{d}</button>
                ))}
              </div>
            )}
          </div>
          {view === "preview" ? (
            <div className="flex justify-center bg-[#eef0f2] p-4">
              <iframe title="Email preview" srcDoc={preview} className={cn("h-[620px] rounded border border-line bg-white transition-all", device === "mobile" ? "w-[360px]" : "w-full max-w-[640px]")} />
            </div>
          ) : (
            <textarea ref={htmlRef} value={html} onChange={(e) => setHtml(e.target.value)} spellCheck={false} className="h-[620px] w-full resize-none rounded-b-lg bg-[#0d1117] p-4 font-mono text-[.78rem] leading-relaxed text-[#c9d1d9] focus:outline-none" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button disabled={pending || !dirty} onClick={() => start(async () => flash(await saveTemplate(props.templateKey, { subject, preheader, html })))}
            className="rounded-md bg-ink px-4 py-2 text-[.82rem] font-semibold text-white disabled:opacity-40">{pending ? "Saving…" : "Save template"}</button>
          {props.customised && (
            <button disabled={pending} onClick={() => { if (confirm("Reset this template to the original? Your current version is kept in history.")) start(async () => flash(await resetTemplate(props.templateKey))); }}
              className="rounded-md border border-line-2 px-4 py-2 text-[.82rem] font-medium text-ink-2 hover:border-ink hover:text-ink disabled:opacity-40">Reset to default</button>
          )}
          {dirty && <span className="text-[.78rem] text-amber-700">Unsaved changes</span>}
          {msg && <span className={cn("text-[.8rem]", msg.ok ? "text-emerald-700" : "text-rose-700")}>{msg.text}</span>}
        </div>
      </div>

      {/* Side panel: blocks, merge fields, test send, history */}
      <aside className="space-y-4">
        <div className="rounded-lg border border-line bg-white p-4">
          <h3 className="text-[.72rem] font-semibold uppercase tracking-[.08em] text-ink-2">Insert block</h3>
          <p className="mt-1 text-[.74rem] text-ink-3">Adds branded, email-safe HTML at your cursor (Raw HTML view).</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {BRAND_BLOCKS.map((b) => (
              <button key={b.id} onClick={() => { setView("code"); insert(b.html); }} className="rounded-full border border-line-2 bg-paper px-2.5 py-1 text-[.74rem] text-ink hover:border-ink">{b.label}</button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-4">
          <h3 className="text-[.72rem] font-semibold uppercase tracking-[.08em] text-ink-2">Merge fields</h3>
          <p className="mt-1 text-[.74rem] text-ink-3">Click to insert. Filled per recipient when sent.</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {MERGE_FIELDS.map((f) => (
              <button key={f.token} title={`{{${f.token}}}`} onClick={() => { setView("code"); insert(`{{${f.token}}}`); }} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-[.72rem] text-blue-700 hover:border-blue-400">{f.label}</button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-4">
          <h3 className="text-[.72rem] font-semibold uppercase tracking-[.08em] text-ink-2">Send a test</h3>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-md border border-line-2 px-3 py-2 text-[.85rem] focus:border-ink focus:outline-none" />
          <button disabled={pending} onClick={() => start(async () => flash(await sendTestTemplate(to, { subject, preheader, html })))}
            className="mt-2 w-full rounded-md border border-ink px-3 py-2 text-[.8rem] font-semibold text-ink hover:bg-ink hover:text-white disabled:opacity-40">Send test email</button>
          <p className="mt-1.5 text-[.72rem] text-ink-3">Uses sample data. Tip: unverified Resend domains only deliver to the account owner.</p>
        </div>

        {props.versions.length > 0 && (
          <div className="rounded-lg border border-line bg-white p-4">
            <h3 className="text-[.72rem] font-semibold uppercase tracking-[.08em] text-ink-2">Version history</h3>
            <ul className="mt-2 space-y-2">
              {props.versions.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2 border-b border-line pb-2 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="truncate text-[.78rem] text-ink">{v.subject}</div>
                    <div className="text-[.7rem] text-ink-3">{v.editedByName || "Edited"} · {new Date(v.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
                  </div>
                  <button disabled={pending} onClick={() => start(async () => flash(await revertToVersion(props.templateKey, v.id)))} className="shrink-0 rounded border border-line-2 px-2 py-1 text-[.72rem] text-ink-2 hover:border-ink hover:text-ink disabled:opacity-40">Restore</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
