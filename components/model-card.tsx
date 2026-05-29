import Link from "next/link";
import { VehicleRender } from "./vehicle-render";
import { gbp } from "@/lib/utils";
import type { Model } from "@/lib/data/models";

const seatCount = (m: Model) => (m.category === "2-seater" || m.category === "utility" ? 2 : 4);

/**
 * Range card. Uses the recolourable render uniformly across all models for a
 * consistent lead image (distinct per model via colour). Real per-model
 * photography swaps in via the CMS `image`/`baseImage` field when supplied.
 */
export function ModelCard({ model }: { model: Model }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_26px_44px_-30px_rgba(0,0,0,0.28)]">
      <Link href={`/range/${model.slug}`} className="relative block aspect-[16/11] overflow-hidden ph" aria-label={`${model.name} — view model`}>
        <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-[1.05]">
          <VehicleRender colour={model.plate} seats={seatCount(model)} title={`${model.name} — ${model.categoryLabel}`} className="max-h-[80%]" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <span className="text-[.64rem] font-semibold uppercase tracking-[.2em] text-ink-2">{model.categoryLabel}</span>
        <h3 className="mt-2 text-2xl">{model.name}</h3>
        <p className="mt-1.5 text-[.95rem] text-ink-2">{model.tagline}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {model.highlights.slice(0, 3).map((h) => (
            <li key={h} className="rounded-full border border-line-2 px-3 py-1 text-[.64rem] tracking-wide text-ink-2">{h}</li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-[1.1rem]" style={{ marginTop: "1.3rem" }}>
          <div>
            {model.basePrice > 0 ? (
              <>
                <span className="block text-[.64rem] font-semibold uppercase tracking-[.16em] text-ink-2">From</span>
                <span className="text-[1.05rem] font-semibold">{gbp(model.basePrice)}</span>
              </>
            ) : (
              <span className="text-[1.05rem] font-semibold">On request</span>
            )}
          </div>
          <div className="flex gap-4">
            <Link href={`/range/${model.slug}`} className="text-[.74rem] font-semibold uppercase tracking-[.04em] hover:underline hover:underline-offset-4">Enquire</Link>
            <Link href={model.basePrice > 0 ? `/configure/${model.slug}` : "/bespoke"} className="text-[.74rem] font-semibold uppercase tracking-[.04em] hover:underline hover:underline-offset-4">
              {model.basePrice > 0 ? "Configure" : "Discover"}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
