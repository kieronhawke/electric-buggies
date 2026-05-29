import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** Eyebrow + heading + optional lede (v2). */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-[62ch]", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow", light && "!text-white/70")}>{eyebrow}</p>}
      <h2 className={cn("mt-3 text-[clamp(1.9rem,4vw,3.1rem)]", light ? "text-white" : "text-ink")}>{title}</h2>
      {lede && <p className={cn("mt-4 text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed", light ? "text-white/75" : "text-ink-2")}>{lede}</p>}
    </Reveal>
  );
}
