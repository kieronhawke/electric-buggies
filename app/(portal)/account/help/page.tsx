import Link from "next/link";
import { site } from "@/lib/site";

export default function HelpPage() {
  const tel = site.contact.phone.replace(/[^+\d]/g, "");
  const items = [
    { label: "Call the team", note: site.contact.phoneDisplay, href: `tel:${tel}` },
    { label: "Email us", note: site.contact.email, href: `mailto:${site.contact.email}` },
    { label: "Request a quote", note: "Start a tailored enquiry", href: "/request-a-quote" },
  ];
  return (
    <div className="max-w-[560px]">
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Help &amp; support</h1>
      <p className="mt-1 text-ink-2">We are here Monday to Friday, and for urgent service matters around the clock.</p>
      <ul className="mt-7 flex flex-col gap-3">
        {items.map((i) => (
          <li key={i.label}>
            <Link href={i.href} className="flex items-center justify-between rounded-lg border border-line bg-white p-5 transition-colors hover:border-line-2">
              <span>
                <span className="block text-[.98rem] font-semibold">{i.label}</span>
                <span className="block text-[.85rem] text-ink-2">{i.note}</span>
              </span>
              <span aria-hidden className="text-ink-2">&rarr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
