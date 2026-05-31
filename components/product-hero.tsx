import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Button, Arrow } from "@/components/ui/button";
import { VehicleRender } from "@/components/vehicle-render";
import { SpecStrip } from "@/components/spec-strip";
import type { Model } from "@/lib/data/models";

const seatCount = (cat: string) => (cat === "2-seater" || cat === "utility" ? 2 : 4);

/**
 * Full-bleed product hero (Tesla pattern 1 + 2): a large buggy image, a big
 * light model-name headline, two quote-led buttons, and a 3-figure spec strip.
 * Mobile-first, centred. Uses our own imagery only.
 */
export function ProductHero({ model }: { model: Model }) {
  const isBespoke = model.basePrice === 0;
  const specItems = [
    { label: "Seats", value: model.specs.seats.replace(/\s*seats?$/i, "") },
    { label: "Range", value: model.specs.range },
    { label: "Top speed", value: model.specs.topSpeed },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-paper-2 to-paper pt-[calc(var(--header-h)+1.5rem)]">
      <div className="mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center justify-center gap-2 text-[.68rem] uppercase tracking-[.14em] text-ink-2">
            <li><Link href="/" className="hover:text-ink">Home</Link></li>
            <li className="text-line-2">/</li>
            <li><Link href="/range" className="hover:text-ink">The Range</Link></li>
            <li className="text-line-2">/</li>
            <li className="text-ink">{model.name}</li>
          </ol>
        </nav>

        <div className="text-center">
          <Reveal>
            <p className="eyebrow">{model.categoryLabel}</p>
            <h1 className="mx-auto mt-3 max-w-[16ch] text-[clamp(2.8rem,8vw,5.5rem)] font-light leading-[1.0] tracking-[-0.03em] text-ink">
              {model.name}
            </h1>
            <p className="mx-auto mt-4 max-w-[40ch] text-[clamp(1.02rem,2.2vw,1.25rem)] font-light text-ink-2">
              {model.tagline}
            </p>
          </Reveal>
        </div>

        {/* Large buggy image (our own asset) */}
        <Reveal delay={0.1}>
          <div className="relative mx-auto mt-2 aspect-[16/10] w-full max-w-[920px] sm:aspect-[16/9]">
            {model.image ? (
              <Image
                src={model.image}
                alt={`${model.name} electric buggy, ${model.categoryLabel.toLowerCase()}`}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 920px"
                className="object-contain drop-shadow-[0_40px_60px_rgba(10,10,11,0.16)]"
              />
            ) : (
              <VehicleRender
                colour={model.plate}
                roof="hard-roof"
                wheels="noble"
                seats={seatCount(model.category)}
                title={model.name}
                className="drop-shadow-[0_40px_60px_rgba(10,10,11,0.16)]"
              />
            )}
          </div>
        </Reveal>

        {/* Two clear buttons */}
        <Reveal delay={0.16}>
          <div className="mt-2 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button href="/request-a-quote" size="lg">Get a Quote <Arrow /></Button>
            <Button href="#details" variant="outline" size="lg">Learn More</Button>
          </div>
        </Reveal>

        {/* 3-spec strip (real figures only) */}
        {!isBespoke && (
          <Reveal delay={0.22}>
            <div className="mx-auto mt-10 max-w-[560px] border-t border-line pt-7 pb-12">
              <SpecStrip items={specItems} />
            </div>
          </Reveal>
        )}
        {isBespoke && <div className="pb-12" />}
      </div>
    </section>
  );
}
