import { cn } from "@/lib/utils";

/**
 * Atmospheric media tile. Renders the (CMS-swappable) image as a CSS background
 * layered over a dark gradient, so a slow/failed image degrades to an
 * intentional placeholder — never a broken-image icon. Children sit on top.
 */
export function Media({
  src,
  className,
  overlay = true,
  rounded = true,
  children,
  priority,
}: {
  src?: string | null;
  className?: string;
  overlay?: boolean;
  rounded?: boolean;
  children?: React.ReactNode;
  priority?: boolean;
}) {
  const layers = [
    overlay ? "linear-gradient(180deg, rgba(8,10,12,.18), rgba(8,10,12,.66))" : null,
    src ? `url("${src}")` : null,
    "radial-gradient(110% 120% at 72% 8%, #3a424b 0%, #20262d 42%, #0c0f13 100%)",
  ].filter(Boolean).join(", ");

  return (
    <div
      className={cn("relative overflow-hidden bg-cover bg-center", rounded && "rounded-lg", className)}
      style={{ backgroundImage: layers }}
      // eslint-disable-next-line @next/next/no-img-element
    >
      {/* Hint the browser to prioritise above-the-fold media. */}
      {priority && src && <link rel="preload" as="image" href={src} />}
      {children}
    </div>
  );
}
