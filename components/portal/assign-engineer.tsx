"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignEngineer } from "@/lib/admin-actions";

export function AssignEngineer({ serviceId, engineers, current }: { serviceId: string; engineers: { id: string; name: string }[]; current: string | null }) {
  const router = useRouter();
  const [value, setValue] = useState(current ?? "");
  const [pending, start] = useTransition();
  function assign(id: string) {
    setValue(id);
    start(async () => { await assignEngineer(serviceId, id); router.refresh(); });
  }
  return (
    <select
      value={value}
      onChange={(e) => e.target.value && assign(e.target.value)}
      disabled={pending}
      className="rounded-[3px] border border-line-2 bg-white px-2.5 py-1.5 text-[.82rem] outline-none focus:border-ink disabled:opacity-60"
    >
      <option value="">Assign engineer…</option>
      {engineers.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
    </select>
  );
}
