import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand wordmark, geometric glyph + letter-spaced "ELECTRIC BUGGIES" text
 * (matches v2 prototype). Rendered as live text so it inherits colour (light
 * over hero, dark when solid) and scales crisply.
 */
export function Wordmark({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string | null;
  size?: "sm" | "md";
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "grid place-items-center rounded-[3px] border-[1.5px] border-current",
          size === "sm" ? "h-5 w-5" : "h-[22px] w-[22px]",
        )}
      >
        <span className={cn("bg-current", size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2")} />
      </span>
      <span
        className={cn(
          "font-bold uppercase tracking-[0.2em]",
          size === "sm" ? "text-[.82rem]" : "text-[.92rem]",
        )}
      >
        Electric&nbsp;Buggies
      </span>
    </span>
  );
  if (href === null) return content;
  return (
    <Link href={href} aria-label="Electric Buggies, home" className="inline-block">
      {content}
    </Link>
  );
}
