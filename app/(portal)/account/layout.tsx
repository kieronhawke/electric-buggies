import { requireUser } from "@/lib/session";
import { AccountTopBar, AccountBottomNav } from "@/components/portal/account-nav";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/account");
  return (
    <div className="min-h-screen bg-paper pb-[calc(58px+env(safe-area-inset-bottom))] lg:pb-0">
      <AccountTopBar name={user.name} />
      <main className="mx-auto max-w-[1100px] px-5 py-7 sm:py-9">{children}</main>
      <AccountBottomNav />
    </div>
  );
}
