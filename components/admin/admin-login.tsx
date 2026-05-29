"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const json = await res.json();
      if (res.ok && json.ok) router.refresh();
      else setError(json.error || "Login failed");
    } catch { setError("Login failed"); }
    setBusy(false);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">Electric Buggies, Admin</h1>
      <p className="mt-2 text-sm text-ink-2">Enquiries dashboard, authorised access only.</p>
      {!configured && <p className="mt-4 rounded-lg bg-paper p-3 text-sm text-ink-2">Set <code>ADMIN_PASSWORD</code> in the environment to enable access.</p>}
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
          className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-ink" autoFocus />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-[3px] bg-ink py-3 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white disabled:opacity-50">
          {busy ? "…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
