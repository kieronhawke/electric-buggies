/**
 * Three big figures with small labels (Tesla-style spec strip).
 * Values are passed verbatim from real model data, never computed or invented.
 */
export function SpecStrip({
  items,
  className = "",
  light = false,
}: {
  items: { label: string; value: string }[];
  className?: string;
  light?: boolean;
}) {
  return (
    <dl
      className={`grid grid-cols-3 ${light ? "divide-white/15" : "divide-line"} divide-x ${className}`}
    >
      {items.map((it) => (
        <div key={it.label} className="px-2 text-center first:pl-0 last:pr-0">
          <dd
            className={`text-[clamp(1.4rem,5.5vw,2.3rem)] font-light leading-none tracking-[-0.02em] tabular-nums ${
              light ? "text-white" : "text-ink"
            }`}
          >
            {it.value}
          </dd>
          <dt
            className={`mt-2 text-[.62rem] font-semibold uppercase tracking-[.16em] ${
              light ? "text-white/70" : "text-ink-2"
            }`}
          >
            {it.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
