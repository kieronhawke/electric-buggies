import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Atmospheric media tile. Renders the (CMS-swappable) image via next/image
 * (AVIF/WebP, responsive srcset, lazy below the fold) layered over a dark
 * gradient base — so a slow/failed image degrades to an intentional placeholder
 * rather than a broken icon. `priority` marks the LCP hero; everything else
 * lazy-loads. `sizes` should reflect the rendered width for right-sized images.
 */
export function Media({
  src,
  className,
  overlay = true,
  rounded = true,
  children,
  priority,
  sizes = "100vw",
  alt = "",
}: {
  src?: string | null;
  className?: string;
  overlay?: boolean;
  rounded?: boolean;
  children?: React.ReactNode;
  priority?: boolean;
  sizes?: string;
  alt?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", rounded && "rounded-lg", className)}
      style={{ background: "radial-gradient(110% 120% at 72% 8%, #3a424b 0%, #20262d 42%, #0c0f13 100%)" }}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}
      {overlay && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(8,10,12,.18), rgba(8,10,12,.66))" }}
        />
      )}
      {children}
    </div>
  );
}
