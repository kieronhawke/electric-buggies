import { requireRole } from "@/lib/session";
import { EngineerTopBar } from "@/components/portal/engineer-nav";

export const dynamic = "force-dynamic";

export default async function EngineerLayout({ children }: { children: React.ReactNode }) {
  // Scoped role: engineers (and admins) only. No CRM/finance/quotes here.
  const user = await requireRole(["engineer", "admin"], "/engineer");
  return (
    <div className="min-h-screen bg-paper">
      <EngineerTopBar name={user.name} />
      <main className="mx-auto max-w-[900px] px-5 py-7">{children}</main>
    </div>
  );
}
