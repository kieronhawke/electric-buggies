import { models, modelBySlug } from "./data/models";
import { exteriorColours, roofs, wheels, upholstery, accessories } from "./data/options";

export interface BuildState {
  model: string;
  colour: string;
  roof: string;
  wheels: string;
  upholstery: string;
  accessories: string[];
  /** Branding (brief §G): chosen logo placement zone + scale (0.5–1.5). The
   *  uploaded image itself is kept in localStorage, not the URL. */
  logoZone: string | null;
  logoScale: number;
}

export const defaultBuild = (modelSlug?: string): BuildState => ({
  model: modelSlug && modelBySlug(modelSlug) ? modelSlug : "the-four",
  colour: exteriorColours[0].id,
  roof: roofs[1].id, // canopy
  wheels: wheels[0].id,
  upholstery: upholstery[0].id,
  accessories: [],
  logoZone: null,
  logoScale: 1,
});

export function priceBuild(b: BuildState): number {
  const model = modelBySlug(b.model);
  if (!model) return 0;
  let total = model.basePrice;
  total += exteriorColours.find((c) => c.id === b.colour)?.priceDelta ?? 0;
  total += roofs.find((r) => r.id === b.roof)?.priceDelta ?? 0;
  total += wheels.find((w) => w.id === b.wheels)?.priceDelta ?? 0;
  total += upholstery.find((u) => u.id === b.upholstery)?.priceDelta ?? 0;
  for (const a of b.accessories) total += accessories.find((x) => x.id === a)?.priceDelta ?? 0;
  return total;
}

export function encodeBuild(b: BuildState): string {
  const params = new URLSearchParams({ m: b.model, c: b.colour, r: b.roof, w: b.wheels, u: b.upholstery });
  if (b.accessories.length) params.set("a", b.accessories.join(","));
  if (b.logoZone) { params.set("lz", b.logoZone); params.set("ls", String(b.logoScale)); }
  return params.toString();
}

export function decodeBuild(search: string): BuildState {
  const p = new URLSearchParams(search);
  const base = defaultBuild(p.get("m") ?? undefined);
  return {
    model: base.model,
    colour: exteriorColours.some((c) => c.id === p.get("c")) ? p.get("c")! : base.colour,
    roof: roofs.some((r) => r.id === p.get("r")) ? p.get("r")! : base.roof,
    wheels: wheels.some((w) => w.id === p.get("w")) ? p.get("w")! : base.wheels,
    upholstery: upholstery.some((u) => u.id === p.get("u")) ? p.get("u")! : base.upholstery,
    accessories: (p.get("a")?.split(",") ?? []).filter((id) => accessories.some((x) => x.id === id)),
    logoZone: p.get("lz"),
    logoScale: Number(p.get("ls")) || 1,
  };
}

export function buildSpecLines(b: BuildState): { label: string; value: string; price?: number }[] {
  const model = modelBySlug(b.model);
  const colour = exteriorColours.find((c) => c.id === b.colour);
  const lines = [
    { label: "Model", value: model?.name ?? b.model, price: model?.basePrice },
    { label: "Exterior", value: colour ? `${colour.name} · ${colour.finish}` : "—", price: colour?.priceDelta },
    { label: "Roof", value: roofs.find((r) => r.id === b.roof)?.name ?? "—", price: roofs.find((r) => r.id === b.roof)?.priceDelta },
    { label: "Wheels", value: wheels.find((w) => w.id === b.wheels)?.name ?? "—", price: wheels.find((w) => w.id === b.wheels)?.priceDelta },
    { label: "Interior", value: upholstery.find((u) => u.id === b.upholstery)?.name ?? "—", price: upholstery.find((u) => u.id === b.upholstery)?.priceDelta },
    {
      label: "Accessories",
      value: b.accessories.length === 0 ? "None" : b.accessories.map((id) => accessories.find((x) => x.id === id)?.name).filter(Boolean).join(", "),
      price: b.accessories.reduce((sum, id) => sum + (accessories.find((x) => x.id === id)?.priceDelta ?? 0), 0),
    },
  ];
  if (b.logoZone) lines.push({ label: "Branding", value: `Logo — ${b.logoZone}`, price: 0 });
  return lines;
}
