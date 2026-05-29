/**
 * Configurator options, match configurator-prototype.html, CMS-editable later
 * (Sanity `configuratorOption` documents with editable prices). The hex drives
 * the live recolour preview; finish affects sheen in the PreviewStage.
 */

export type Finish = "Solid" | "Metallic" | "Matte";

export interface ColourOption {
  id: string;
  name: string;
  group: string;
  hex: string;
  finish: Finish;
  priceDelta: number;
}

export interface Option {
  id: string;
  name: string;
  description?: string;
  priceDelta: number;
  /** Visual swatch colour for list rows. */
  swatch?: string;
  /** Wheel rim colour / sport flag for the preview. */
  rim?: string;
  sport?: boolean;
  /** Seat colour for the preview. */
  seat?: string;
}

export const exteriorColours: ColourOption[] = [
  { id: "pearl-white", name: "Pearl White", group: "Solid", hex: "#eef0f1", finish: "Solid", priceDelta: 0 },
  { id: "storm-grey", name: "Storm Grey", group: "Metallic", hex: "#6c727a", finish: "Metallic", priceDelta: 450 },
  { id: "racing-green", name: "British Racing Green", group: "Metallic", hex: "#23433a", finish: "Metallic", priceDelta: 450 },
  { id: "midnight", name: "Midnight", group: "Metallic", hex: "#15171b", finish: "Metallic", priceDelta: 450 },
  { id: "oxford-blue", name: "Oxford Blue", group: "Metallic", hex: "#27364f", finish: "Metallic", priceDelta: 450 },
  { id: "claret", name: "Claret", group: "Metallic", hex: "#5a2733", finish: "Metallic", priceDelta: 450 },
  { id: "matte-graphite", name: "Matte Graphite", group: "Matte", hex: "#3a3f45", finish: "Matte", priceDelta: 650 },
];

export const roofs: Option[] = [
  { id: "open", name: "Open", description: "No roof, open air", priceDelta: 0, swatch: "#dfe2e6" },
  { id: "canopy", name: "Canopy", description: "Standard sun canopy", priceDelta: 0, swatch: "#9aa0a6" },
  { id: "hardtop", name: "Hardtop", description: "Fully enclosed roof", priceDelta: 750, swatch: "#5b6066" },
];

export const wheels: Option[] = [
  { id: "classic-silver", name: "Classic Silver", description: "Refined 10-inch", priceDelta: 0, rim: "#c7ccd1", sport: false },
  { id: "sport-machined", name: "Sport Machined", description: "Multi-spoke alloy", priceDelta: 600, rim: "#aeb4ba", sport: true },
  { id: "onyx-black", name: "Onyx Black", description: "Gloss black alloy", priceDelta: 600, rim: "#23282e", sport: true },
];

export const upholstery: Option[] = [
  { id: "stone", name: "Stone", description: "Hard-wearing weave", priceDelta: 0, seat: "#b9bcc1" },
  { id: "graphite", name: "Graphite", description: "Dark weave", priceDelta: 0, seat: "#4a4f56" },
  { id: "tan-leather", name: "Tan Leather", description: "Premium hide", priceDelta: 900, seat: "#9c6b3f" },
  { id: "oxblood-leather", name: "Oxblood Leather", description: "Premium hide", priceDelta: 900, seat: "#5c2a30" },
];

export const accessories: Option[] = [
  { id: "windscreen", name: "Windscreen", description: "Tempered glass", priceDelta: 250 },
  { id: "lighting", name: "Lighting pack", description: "LED front & rear", priceDelta: 350 },
  { id: "audio", name: "Bluetooth audio", description: "Weatherproof speakers", priceDelta: 300 },
  { id: "rain-doors", name: "Rain doors", description: "Quick-fit side doors", priceDelta: 550 },
  { id: "fast-charge", name: "Fast-charge upgrade", description: "Faster turnaround", priceDelta: 1100 },
];

/**
 * Customer logo placement zones (brief §G). The 2D phase composites the logo
 * onto these hotspots; the 3D phase maps them to drei <Decal> anchors / UV
 * zones. `x`/`y` are % positions on the side-profile preview.
 */
export interface LogoZone {
  id: string;
  label: string;
  x: number;
  y: number;
}
export const logoZones: LogoZone[] = [
  { id: "front", label: "Front panel", x: 78, y: 62 },
  { id: "sides", label: "Both sides", x: 47, y: 60 },
  { id: "rear", label: "Rear", x: 20, y: 58 },
  { id: "bonnet", label: "Bonnet", x: 70, y: 45 },
];

export const configSteps = [
  { id: "model", label: "Model" },
  { id: "colour", label: "Colour" },
  { id: "roof", label: "Roof" },
  { id: "wheels", label: "Wheels" },
  { id: "upholstery", label: "Interior" },
  { id: "accessories", label: "Accessories" },
  { id: "branding", label: "Branding" },
  { id: "summary", label: "Summary" },
] as const;
