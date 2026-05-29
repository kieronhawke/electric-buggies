import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "light" | "lightOutline";
type Size = "md" | "lg";

// Rectangular, uppercase, letter-spaced, matches v2 prototype buttons.
const base =
  "inline-flex items-center justify-center gap-[.55em] font-semibold uppercase tracking-[.06em] rounded-[2px] border transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:translate-y-0 active:scale-[0.99]";

// min-h keeps every button at a comfortable >=44px tap target on touch.
const sizes: Record<Size, string> = {
  md: "text-[.72rem] px-5 py-3 min-h-[44px]",
  lg: "text-[.78rem] px-8 py-[1.02em] min-h-[52px]",
};

const variants: Record<Variant, string> = {
  primary: "border-ink bg-ink text-white hover:bg-black hover:-translate-y-px",
  outline: "border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
  light: "border-white bg-white text-ink hover:bg-transparent hover:text-white",
  lightOutline: "border-white/50 bg-transparent text-white hover:bg-white hover:text-ink hover:border-white",
};

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export function Button({
  children, href, onClick, type = "button", variant = "primary", size = "md", className, disabled, ...rest
}: ButtonProps) {
  const cls = cn(base, sizes[size], variants[variant], className);
  if (href) {
    return <Link href={href} className={cls} {...rest}>{children}</Link>;
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} {...rest}>
      {children}
    </button>
  );
}

/** Inline arrow link (uppercase, slides on hover). */
export function ArrowLink({ href, children, className, light }: { href: string; children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-[2px] text-[.76rem] font-semibold uppercase tracking-[.04em] outline-none transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current",
        light ? "text-white" : "text-ink",
        className,
      )}
    >
      {children}
      <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden>
        <path d="M1 5h15M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-4 w-4", className)} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
