"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignEngineer } from "@/lib/admin-actions";
import { avatarStyle } from "@/lib/status-style";
import { cn } from "@/lib/utils";

export function AssignEngineer({ serviceId, engineers, current }: { serviceId: string; engineers: { id: string; name: string }[]; current: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const filtered = engineers.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));

  function assign(id: string) {
    setOpen(false); setQuery(""); setError("");
    start(async () => {
      const r = await assignEngineer(serviceId, id);
      if (r?.ok) router.refresh();
      else setError(r?.error || "Could not assign.");
    });
  }

  if (!open) {
    return (
      <div className="flex flex-col gap-1">
        <button onClick={() => { setError(""); setOpen(true); }} disabled={pending} className="self-start rounded-[3px] border border-line-2 px-3 py-1.5 text-[.78rem] font-medium text-ink-2 transition-colors hover:border-ink hover:text-ink disabled:opacity-60">{pending ? "Assigning…" : (current ? "Reassign…" : "Assign engineer…")}</button>
        {error && <p className="text-[.76rem] text-rose-600">{error}</p>}
      </div>
    );
  }
  return (
    <div className="relative w-56">
      <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onBlur={() => setTimeout(() => setOpen(false), 150)} placeholder="Search engineers…" className="w-full rounded-[3px] border border-ink bg-white px-2.5 py-1.5 text-[.82rem] outline-none" />
      <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-[4px] border border-line bg-white shadow-lg">
        {filtered.length === 0 && <li className="px-3 py-2 text-[.8rem] text-ink-2">No engineers found.</li>}
        {filtered.map((e) => {
          const av = avatarStyle(e.name);
          return (
            <li key={e.id}>
              <button onMouseDown={() => assign(e.id)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[.84rem] hover:bg-paper">
                <span className={cn("grid h-6 w-6 place-items-center rounded-full text-[.6rem] font-bold text-white", av.bg)}>{av.initials}</span>
                {e.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
