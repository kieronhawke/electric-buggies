import Link from "next/link";
import { site } from "@/lib/site";

const SECTIONS: { title: string; faqs: { q: string; a: string }[] }[] = [
  {
    title: "Orders",
    faqs: [
      { q: "How do I track my order?", a: "Open Orders, then your order. The coloured tracker shows your current stage, with a full dated timeline below and a clear note on what happens next." },
      { q: "What does each stage mean?", a: "Confirmed, contract, payment, production, quality check, ready for delivery, in transit, then delivered. We notify you as each stage is reached, by the channels you choose in Notifications." },
      { q: "Can I change my specification after ordering?", a: "Minor changes are sometimes possible before production begins. Contact the team as early as you can and we will advise." },
    ],
  },
  {
    title: "Vehicles & maintenance",
    faqs: [
      { q: "Where do I find my warranty and VIN?", a: "In Manage my fleet. Each delivered vehicle shows its VIN, registration, delivery date, warranty expiry and specification." },
      { q: "How do I book a service?", a: "In Manage my fleet, choose Request a service on your vehicle. Pick a tier (Interim, Full or Major), or report a fault, and give us up to three preferred dates." },
      { q: "What service tiers do you offer?", a: "Interim (every six months or light use), Full (annual, comprehensive) and Major (every two years or heavy use). We will recommend the right one for your usage." },
      { q: "How long does a service take?", a: "An interim service is usually the same day; a major service may take longer. Your assigned engineer will confirm timing." },
    ],
  },
  {
    title: "Delivery",
    faqs: [
      { q: "How do I choose my delivery date?", a: "Once your order is ready for delivery you will see a Choose your delivery date prompt. Pick up to three preferred dates and a morning or afternoon slot, and we confirm one with you." },
      { q: "Do you deliver internationally?", a: "Yes. We deliver and commission worldwide from the UK. International timescales are confirmed on your order." },
      { q: "What happens on delivery day?", a: "We deliver and commission the vehicle, hand over the documentation, and the vehicle then appears in Manage my fleet." },
    ],
  },
  {
    title: "Payments",
    faqs: [
      { q: "How do I pay?", a: "By bank transfer. After signing your contract, your payment page shows our bank details, your unique payment reference and the amount, with a downloadable invoice." },
      { q: "What happens after I mark a payment as sent?", a: "Your order shows awaiting finance confirmation. Once our finance team confirms receipt, you see Payment received and production is scheduled." },
      { q: "Is my deposit refundable?", a: "Deposit, cancellation and refund terms are set out in your order agreement. Contact the team if you have any questions before you sign." },
    ],
  },
];

export default function HelpPage() {
  const tel = site.contact.phone.replace(/[^+\d]/g, "");
  return (
    <div className="max-w-[720px]">
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Help centre</h1>
      <p className="mt-1 text-ink-2">Answers to common questions, and ways to reach the team.</p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Call the team", note: site.contact.phoneDisplay, href: `tel:${tel}` },
          { label: "Email us", note: site.contact.email, href: `mailto:${site.contact.email}` },
          { label: "Request a quote", note: "Start an enquiry", href: "/account/request-quote" },
        ].map((i) => (
          <Link key={i.label} href={i.href} className="rounded-lg border border-line bg-white p-4 transition-colors hover:border-line-2">
            <div className="text-[.92rem] font-semibold">{i.label}</div>
            <div className="mt-0.5 truncate text-[.8rem] text-ink-2">{i.note}</div>
          </Link>
        ))}
      </div>

      <div className="mt-9 flex flex-col gap-7">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">{s.title}</h2>
            <div className="mt-3 divide-y divide-line rounded-lg border border-line bg-white">
              {s.faqs.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-xl leading-none text-ink-2 transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-[.92rem] leading-relaxed text-ink-2">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
