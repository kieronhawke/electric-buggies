import { getCurrentUser } from "@/lib/session";
import { ProfileForm } from "@/components/portal/profile-form";

export default async function ProfilePage() {
  const user = (await getCurrentUser())!;
  return (
    <div className="max-w-[520px]">
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Your profile</h1>
      <p className="mt-1 text-ink-2">Keep your contact details up to date so we can reach you about your orders.</p>
      <div className="mt-7">
        <ProfileForm defaults={{ name: user.name, email: user.email, phone: user.phone ?? "", company: user.company ?? "" }} />
      </div>
    </div>
  );
}
