import Link from "next/link";
import Image from "next/image";
import { VehicleRender } from "./vehicle-render";
import { gbp } from "@/lib/utils";
import type { Model } from "@/lib/data/models";

const seatCount = (m: Model) => (m.category === "2-seater" || m.category === "utility" ? 2 : 4);

/** Range card, real product photo (render fallback if none). `showPrice` gates
 * the "From £X" line (admin pricing toggle; default hidden). */
export function ModelCard({ model, showPrice = false }: { model: Model; showPrice?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[0_26px_44px_-30px_rgba(0,0,0,0.28)]">
      <Link href={`/range/${model.slug}`} className="relative block aspect-[16/11] overflow-hidden bg-white" aria-label={`${model.name}, view the ${model.categoryLabel.toLowerCase()}`}>
        {model.image ? (
          <Image
            src={model.image}
            alt={`${model.name} electric buggy, ${model.categoryLabel.toLowerCase()}`}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 ph transition-transform duration-500 group-hover:scale-[1.05]">
            <VehicleRender colour={model.plate} seats={seatCount(model)} title={`${model.name}, ${model.categoryLabel}`} className="max-h-[80%]" />
          </div>
        )}
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

        <div className="mt-auto pt-[1.3rem]">
          {showPrice && model.basePrice > 0 ? (
            <div className="mb-3">
              <span className="block text-[.64rem] font-semibold uppercase tracking-[.16em] text-ink-2">From</span>
              <span className="text-[1.05rem] font-semibold">{gbp(model.basePrice)}</span>
            </div>
          ) : (
            <p className="mb-3 text-[.82rem] text-ink-2">Pricing on request, tailored to your configuration.</p>
          )}
          <div className="flex gap-2.5 border-t border-line pt-4">
            <Link href="/request-a-quote" className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-[2px] bg-ink px-4 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white transition-colors hover:bg-black">
              Get a Quote
            </Link>
            <Link href={`/range/${model.slug}`} className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-[2px] border border-ink px-4 text-[.72rem] font-semibold uppercase tracking-[.06em] text-ink transition-colors hover:bg-ink hover:text-white">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
