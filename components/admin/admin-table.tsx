"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export interface Lead {
  _id: string; email?: string; status?: string; flow?: string;
  firstName?: string; lastName?: string; phone?: string; type?: string;
  company?: string; quantity?: string; models?: string[]; timeframe?: string;
  address?: string; country?: string; message?: string; build?: string;
  createdAt?: string; updatedAt?: string; submittedAt?: string;
}

const COLS = ["status", "flow", "email", "firstName", "lastName", "phone", "type", "company", "quantity", "models", "timeframe", "address", "message", "build", "createdAt", "updatedAt"];

export function AdminTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [flow, setFlow] = useState("all");

  const rows = useMemo(() => leads.filter((l) =>
    (status === "all" || l.status === status) && (flow === "all" || l.flow === flow)), [leads, status, flow]);

  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(Array.isArray(v) ? v.join("; ") : (v ?? "")).replace(/"/g, '""')}"`;
    const csv = [COLS.join(","), ...rows.map((r) => COLS.map((c) => esc((r as unknown as Record<string, unknown>)[c])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const signOut = async () => { await fetch("/api/admin-login", { method: "DELETE" }); router.refresh(); };
  const counts = { total: leads.length, submitted: leads.filter((l) => l.status === "submitted").length, abandoned: leads.filter((l) => l.status === "abandoned").length };

  return (
    <div className="min-h-screen bg-paper p-5 md:p-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Enquiries</h1>
            <p className="text-sm text-ink-2">{counts.total} total, {counts.submitted} submitted, {counts.abandoned} abandoned</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-line bg-white px-3 py-2 text-sm">
              <option value="all">All statuses</option><option value="submitted">Submitted</option><option value="abandoned">Abandoned</option>
            </select>
            <select value={flow} onChange={(e) => setFlow(e.target.value)} className="rounded-lg border border-line bg-white px-3 py-2 text-sm">
              <option value="all">All flows</option><option value="quote">Quote</option><option value="hire">Hire</option><option value="airport">Airport</option><option value="contact">Contact</option><option value="newsletter">Newsletter</option>
            </select>
            <button onClick={exportCsv} className="rounded-[3px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white">Export CSV</button>
            <button onClick={signOut} className="rounded-[3px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink">Sign out</button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-[.66rem] uppercase tracking-[.12em] text-ink-2">
              <tr>{["Status", "Flow", "When", "Name", "Email", "Phone", "Vehicles", "Qty", "Company", "Notes"].map((h) => <th key={h} className="whitespace-nowrap px-3 py-2.5 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={10} className="px-3 py-8 text-center text-ink-2">No enquiries yet.</td></tr>
              ) : rows.map((l) => (
                <tr key={l._id} className="border-b border-line align-top">
                  <td className="px-3 py-2.5"><span className={`rounded-full px-2 py-0.5 text-[.62rem] font-semibold uppercase ${l.status === "submitted" ? "bg-ink text-white" : "bg-line text-ink-2"}`}>{l.status}</span></td>
                  <td className="px-3 py-2.5 capitalize">{l.flow}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-ink-2">{(l.updatedAt || l.createdAt || "").slice(0, 16).replace("T", " ")}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">{[l.firstName, l.lastName].filter(Boolean).join(" ")}</td>
                  <td className="px-3 py-2.5"><a href={`mailto:${l.email}`} className="underline">{l.email}</a></td>
                  <td className="whitespace-nowrap px-3 py-2.5">{l.phone}</td>
                  <td className="px-3 py-2.5">{(l.models || []).join(", ")}</td>
                  <td className="px-3 py-2.5">{l.quantity}</td>
                  <td className="px-3 py-2.5">{l.company}</td>
                  <td className="max-w-[220px] px-3 py-2.5 text-ink-2">{l.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
