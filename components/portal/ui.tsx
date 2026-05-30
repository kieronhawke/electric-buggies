"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Labelled input with error + optional password reveal. Brand: cool monochrome. */
export function Field({
  label,
  error,
  hint,
  className,
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && reveal ? "text" : type;
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">{label}</span>
      <span className="relative block">
        <input
          type={inputType}
          className={cn(
            "h-12 w-full rounded-[3px] border bg-white px-3.5 text-[.95rem] text-ink outline-none transition-colors placeholder:text-ink-2/60 focus:border-ink",
            error ? "border-red-500" : "border-line-2",
            isPassword && "pr-16",
          )}
          aria-invalid={!!error}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="absolute inset-y-0 right-0 grid w-14 place-items-center text-[.68rem] font-semibold uppercase tracking-[.08em] text-ink-2 hover:text-ink"
            tabIndex={-1}
          >
            {reveal ? "Hide" : "Show"}
          </button>
        )}
      </span>
      {hint && !error && <span className="mt-1.5 block text-[.78rem] text-ink-2">{hint}</span>}
      {error && <span className="mt-1.5 block text-[.78rem] text-red-600" role="alert">{error}</span>}
    </label>
  );
}

export function FormBanner({ kind, children }: { kind: "error" | "success"; children: ReactNode }) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-[3px] border px-4 py-3 text-[.85rem]",
        kind === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800",
      )}
    >
      {children}
    </div>
  );
}

export function SubmitButton({ loading, children, className }: { loading?: boolean; children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[2px] bg-ink px-6 text-[.78rem] font-semibold uppercase tracking-[.08em] text-white transition-colors hover:bg-black disabled:opacity-60",
        className,
      )}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
      )}
      {children}
    </button>
  );
}
