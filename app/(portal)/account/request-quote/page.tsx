import Link from "next/link";
import { AccountQuoteRequest } from "@/components/portal/account-quote-request";

export default function RequestQuotePage() {
  return (
    <div className="max-w-[900px]">
      <Link href="/account/quotes" className="text-[.8rem] font-medium text-ink-2 hover:text-ink">&larr; Quotes</Link>
      <h1 className="mt-3 text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Request a quote</h1>
      <p className="mt-1 text-ink-2">Choose a model and tell us a little about your needs. Our team will prepare a tailored quote.</p>
      <div className="mt-7"><AccountQuoteRequest /></div>
    </div>
  );
}
