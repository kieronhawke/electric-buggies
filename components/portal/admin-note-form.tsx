"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addNote } from "@/lib/admin-actions";

export function AdminNoteForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setError("");
    start(async () => {
      const r = await addNote(orderId, body, visible);
      if (r?.ok) { setBody(""); setVisible(false); router.refresh(); }
      else setError(r?.error || "Could not save note.");
    });
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Add a note…" className="w-full rounded-[3px] border border-line-2 bg-white p-3 text-[.9rem] outline-none focus:border-ink" />
      <div className="mt-2 flex items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-[.82rem] text-ink-2">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-4 w-4 accent-[#0a0a0b]" />
          Visible to customer
        </label>
        <button type="submit" disabled={pending || !body.trim()} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Saving…" : "Add note"}</button>
      </div>
      {error && <p className="mt-1 text-[.8rem] text-red-600">{error}</p>}
    </form>
  );
}
