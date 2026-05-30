import { requireRole } from "@/lib/session";
import { AdminTopBar } from "@/components/portal/admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["admin", "finance", "sales"], "/admin");
  return (
    <div className="min-h-screen bg-paper">
      <AdminTopBar name={user.name} role={user.role} />
      <main className="mx-auto max-w-[1280px] px-5 py-7">{children}</main>
    </div>
  );
}
