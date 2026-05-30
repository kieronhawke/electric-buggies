import { getCurrentUser } from "@/lib/session";
import { NotificationsForm } from "@/components/portal/notifications-form";

export default async function NotificationsPage() {
  const user = (await getCurrentUser())!;
  const events = (user.notifyEvents as Record<string, boolean> | null) ?? {
    orderUpdates: true, contract: true, payment: true, service: true, marketing: false,
  };
  return (
    <div className="max-w-[560px]">
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Notifications</h1>
      <p className="mt-1 text-ink-2">Choose how we reach you, and what we reach you about.</p>
      <div className="mt-7">
        <NotificationsForm
          defaults={{ notifyEmail: user.notifyEmail, notifySms: user.notifySms, notifyWhatsapp: user.notifyWhatsapp, events }}
        />
      </div>
    </div>
  );
}
