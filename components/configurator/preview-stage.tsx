import { VehicleRender } from "@/components/vehicle-render";
import { exteriorColours } from "@/lib/data/options";
import { modelBySlug } from "@/lib/data/models";
import type { BuildState } from "@/lib/configurator";

/**
 * PreviewStage — the live configurator preview (brief §6).
 *
 * Asset-agnostic by design: it derives a colour/roof/wheels from the build and
 * hands them to <VehicleRender>. To raise fidelity later, swap the render for
 * (a) per-colour photography or (b) a Three.js model with true material swaps —
 * the props contract here does not change, so the configurator is not rewritten.
 */
export function PreviewStage({ build }: { build: BuildState }) {
  const model = modelBySlug(build.model);
  const colour = exteriorColours.find((c) => c.id === build.colour);
  const seats =
    model?.category === "2-seater" || model?.category === "utility" ? 2 : 4;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-paper-2 to-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.6), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-2xl px-8 transition-transform duration-500 ease-out">
        <VehicleRender
          colour={colour?.hex ?? "#1c2b22"}
          roof={build.roof}
          wheels={build.wheels}
          seats={seats}
          title={`${model?.name ?? "Electric Buggies"} in ${colour?.name ?? "selected colour"}`}
        />
      </div>
      <div className="absolute bottom-4 left-5">
        <p className="font-display text-lg text-ink">{model?.name}</p>
        <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
          {colour?.name} · {colour?.finish}
        </p>
      </div>
    </div>
  );
}
