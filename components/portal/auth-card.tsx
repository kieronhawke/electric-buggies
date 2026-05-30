import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

/** Centered auth shell: brand mark, heading, body, and a footer link row. */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Electric Buggies home">
            <Wordmark href={null} size="sm" />
          </Link>
        </div>
        <div className="rounded-lg border border-line bg-white p-7 shadow-[0_28px_60px_-44px_rgba(0,0,0,0.4)] sm:p-9">
          <h1 className="text-[1.6rem] font-semibold tracking-[-0.02em]">{title}</h1>
          {subtitle && <p className="mt-2 text-[.92rem] leading-relaxed text-ink-2">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-[.88rem] text-ink-2">{footer}</div>}
      </div>
    </div>
  );
}
