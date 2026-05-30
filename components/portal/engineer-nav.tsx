"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { signOut } from "@/lib/auth-client";

export function EngineerTopBar({ name }: { name: string }) {
  const router = useRouter();
  async function logout() { await signOut(); router.push("/login"); router.refresh(); }
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-[58px] max-w-[900px] items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-3">
          <Link href="/engineer" aria-label="Engineer home"><Wordmark href={null} size="sm" /></Link>
          <span className="rounded-full bg-ink px-2.5 py-0.5 text-[.6rem] font-semibold uppercase tracking-[.12em] text-white">Engineer</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-[.82rem] text-ink-2 sm:inline">{name}</span>
          <button onClick={logout} className="rounded-[2px] border border-line-2 px-3 py-1.5 text-[.7rem] font-semibold uppercase tracking-[.06em] text-ink-2 hover:border-ink hover:text-ink">Sign out</button>
        </div>
      </div>
    </header>
  );
}
