import Link from "next/link";

export default function QuotesPage() {
  return (
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">Quotes</h1>
      <p className="mt-1 text-ink-2">Quotes you have requested or that our team has prepared for you.</p>
      <div className="mt-7 rounded-lg border border-line bg-white p-8 text-center">
        <p className="text-ink-2">You have no quotes yet.</p>
        <Link href="/request-a-quote" className="mt-3 inline-block text-[.8rem] font-semibold uppercase tracking-[.06em] underline-offset-4 hover:underline">
          Request a quote
        </Link>
      </div>
    </div>
  );
}
