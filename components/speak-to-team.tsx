import { Button, Arrow } from "./ui/button";

/**
 * "Speak to a member of the team" trust block: friendly team photo (placeholder
 * until a real one is supplied, clearly swappable) beside the phone + email.
 */
export function SpeakToTeam({ phone, email, className = "" }: { phone: string; email: string; className?: string }) {
  const tel = phone.replace(/[^+\d]/g, "");
  return (
    <div className={`grid items-center gap-8 rounded-lg border border-line bg-white p-8 md:grid-cols-[260px_1fr] ${className}`}>
      <div className="relative flex aspect-[4/3] items-end overflow-hidden rounded-lg ph--dark md:aspect-square">
        <span className="relative z-10 p-4 text-[.6rem] font-semibold uppercase tracking-[.2em] text-white/70">Team photo to follow</span>
      </div>
      <div>
        <p className="eyebrow">Speak to a member of the team</p>
        <a href={`tel:${tel}`} className="mt-3 block text-3xl font-semibold hover:underline">{phone}</a>
        <a href={`mailto:${email}`} className="mt-1 block text-ink-2 hover:text-ink">{email}</a>
        <p className="mt-3 text-sm text-ink-2">Real people who know the vehicles. We typically reply within a few working hours.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href="/request-a-quote">Request a quote <Arrow /></Button>
          <Button href={`tel:${tel}`} variant="outline">Call us</Button>
        </div>
      </div>
    </div>
  );
}
