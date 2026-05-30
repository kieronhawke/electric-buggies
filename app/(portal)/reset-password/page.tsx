import Link from "next/link";
import { AuthCard } from "@/components/portal/auth-card";
import { ResetPasswordForm } from "@/components/portal/reset-forms";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthCard
      title="Choose a new password"
      footer={<Link href="/login" className="font-semibold text-ink underline-offset-4 hover:underline">Back to sign in</Link>}
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
