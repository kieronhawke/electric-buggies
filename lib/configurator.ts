import { models, modelBySlug } from "./data/models";
import {
  exteriorColours,
  roofs,
  wheels,
  upholstery,
  accessories,
} from "./data/options";

export interface BuildState {
  model: string;
  colour: string;
  roof: string;
  wheels: string;
  upholstery: string;
  accessories: string[];
}

export const defaultBuild = (modelSlug?: string): BuildState => ({
  model: modelSlug && modelBySlug(modelSlug) ? modelSlug : models[0].slug,
  colour: exteriorColours[3].id, // Hyde Park Green
  roof: roofs[0].id,
  wheels: wheels[0].id,
  upholstery: upholstery[0].id,
  accessories: [],
});

/** Running indicative price: base + all option deltas (brief §6). */
export function priceBuild(b: BuildState): number {
  const model = modelBySlug(b.model);
  if (!model) return 0;
  let total = model.basePrice;
  total += exteriorColours.find((c) => c.id === b.colour)?.priceDelta ?? 0;
  total += roofs.find((r) => r.id === b.roof)?.priceDelta ?? 0;
  total += wheels.find((w) => w.id === b.wheels)?.priceDelta ?? 0;
  total += upholstery.find((u) => u.id === b.upholstery)?.priceDelta ?? 0;
  for (const a of b.accessories) {
    total += accessories.find((x) => x.id === a)?.priceDelta ?? 0;
  }
  return total;
}

/** Encode a build into compact URL query params (shareable — brief §6). */
export function encodeBuild(b: BuildState): string {
  const params = new URLSearchParams({
    m: b.model,
    c: b.colour,
    r: b.roof,
    w: b.wheels,
    u: b.upholstery,
  });
  if (b.accessories.length) params.set("a", b.accessories.join(","));
  return params.toString();
}

/** Decode a build from URL query params, falling back to defaults. */
export function decodeBuild(search: string): BuildState {
  const p = new URLSearchParams(search);
  const base = defaultBuild(p.get("m") ?? undefined);
  return {
    model: base.model,
    colour: exteriorColours.some((c) => c.id === p.get("c")) ? p.get("c")! : base.colour,
    roof: roofs.some((r) => r.id === p.get("r")) ? p.get("r")! : base.roof,
    wheels: wheels.some((w) => w.id === p.get("w")) ? p.get("w")! : base.wheels,
    upholstery: upholstery.some((u) => u.id === p.get("u")) ? p.get("u")! : base.upholstery,
    accessories: (p.get("a")?.split(",") ?? []).filter((id) =>
      accessories.some((x) => x.id === id),
    ),
  };
}

/** Human-readable spec lines for the summary, quote and downloadable sheet. */
export function buildSpecLines(b: BuildState): { label: string; value: string }[] {
  const model = modelBySlug(b.model);
  return [
    { label: "Model", value: model?.name ?? b.model },
    { label: "Exterior", value: exteriorColours.find((c) => c.id === b.colour)?.name ?? "—" },
    { label: "Roof", value: roofs.find((r) => r.id === b.roof)?.name ?? "—" },
    { label: "Wheels", value: wheels.find((w) => w.id === b.wheels)?.name ?? "—" },
    { label: "Upholstery", value: upholstery.find((u) => u.id === b.upholstery)?.name ?? "—" },
    {
      label: "Accessories",
      value:
        b.accessories.length === 0
          ? "None"
          : b.accessories
              .map((id) => accessories.find((x) => x.id === id)?.name)
              .filter(Boolean)
              .join(", "),
    },
  ];
}
