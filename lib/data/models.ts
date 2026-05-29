/**
 * Model lineup — seed content. CMS-sourced from Sanity `model` documents when
 * connected; this is the fallback so the range is never empty.
 *
 * Imagery: the supplied product photos live in /public/fleet and are used where
 * they fit; remaining slots use the recolourable SVG render. Every image is
 * CMS-swappable (the `image` field becomes a Sanity image in the CMS).
 */

export type ModelCategory =
  | "2-seater" | "4-seater" | "6-seater" | "8-seater" | "utility" | "bespoke";

export interface ModelSpec {
  seats: string;
  range: string;
  battery: string;
  topSpeed: string;
  dimensions: string;
  charge: string;
}

export interface Model {
  slug: string;
  name: string;
  category: ModelCategory;
  categoryLabel: string;
  tagline: string;
  summary: string;
  body: string[];
  specs: ModelSpec;
  basePrice: number;
  /** Cool-grey tone used for the SVG render bodywork. */
  plate: string;
  /** Interim photo (public path or remote URL); null → SVG render. */
  image: string | null;
  highlights: string[];
  recommendedSectors: string[];
}

export const models: Model[] = [
  {
    slug: "the-two",
    name: "The Two",
    category: "2-seater",
    categoryLabel: "Two-Seater",
    tagline: "Intimate, effortless, quietly assured.",
    summary: "A two-seat electric companion for grounds, greens and private drives — compact in footprint, generous in finish.",
    body: [
      "The Two distils the marque to its essence: two seats, a whisper-quiet drivetrain and a finish that belongs at the front of a country house.",
      "Compact enough for the tightest paths, composed enough for the longest day — the natural choice for the estate manager and the discerning private owner.",
    ],
    specs: { seats: "2", range: "Up to 80 km", battery: "5.0 kWh lithium", topSpeed: "25 mph", dimensions: "2.45 × 1.20 × 1.78 m", charge: "6–8 hrs (13A)" },
    basePrice: 11500,
    plate: "#9aa0a6",
    image: null,
    highlights: ["2 seats", "Lithium", "Compact"],
    recommendedSectors: ["estates", "golf-clubs", "film-tv"],
  },
  {
    slug: "the-four",
    name: "The Four",
    category: "4-seater",
    categoryLabel: "Four-Seater",
    tagline: "The defining model. Composed for four.",
    summary: "Our signature four-seat carriage — the natural choice for resorts, clubs and estates that carry guests in comfort.",
    body: [
      "The Four is the heart of the range: four seats arranged for conversation, a forward canopy that shelters without enclosing, and a ride tuned for gravel, grass and tarmac alike.",
      "It is the model most clients configure first — equally at home on a hotel forecourt or touring the boundary of a private estate.",
    ],
    specs: { seats: "4", range: "Up to 90 km", battery: "7.5 kWh lithium", topSpeed: "25 mph", dimensions: "3.10 × 1.27 × 1.90 m", charge: "7–9 hrs (13A)" },
    basePrice: 14900,
    plate: "#5b6066",
    image: "/fleet/four-grey.png",
    highlights: ["4 seats", "Canopy", "All-terrain"],
    recommendedSectors: ["resorts-hotels", "estates", "golf-clubs", "holiday-parks"],
  },
  {
    slug: "the-six",
    name: "The Six",
    category: "6-seater",
    categoryLabel: "Six-Seater",
    tagline: "Six aboard, in unbroken comfort.",
    summary: "A six-seat carriage for resorts and events that move groups with grace rather than haste.",
    body: [
      "Two rows, six seats and a measured wheelbase make The Six the considered choice where guests travel together — between a hotel and its grounds, or across a festival site at dusk.",
      "The longer platform brings a planted, reassuring ride, while the raised canopy keeps every passenger sheltered.",
    ],
    specs: { seats: "6", range: "Up to 85 km", battery: "10.5 kWh lithium", topSpeed: "25 mph", dimensions: "3.95 × 1.27 × 1.95 m", charge: "8–10 hrs (13A)" },
    basePrice: 18900,
    plate: "#27364f",
    image: "/fleet/six-blue.png",
    highlights: ["6 seats", "Two rows", "Raised canopy"],
    recommendedSectors: ["resorts-hotels", "festivals-events", "holiday-parks"],
  },
  {
    slug: "the-eight",
    name: "The Eight",
    category: "8-seater",
    categoryLabel: "Eight-Seater",
    tagline: "The grand tourer of the grounds.",
    summary: "Eight seats of shuttle capability for the largest estates, resorts and events — without sacrificing restraint.",
    body: [
      "When the brief is to move a full party in one quiet pass, The Eight answers. Three forward-facing rows, a long sheltered canopy and a substantial battery give it true shuttle credentials.",
      "Specified by the grandest of clients — championship courses, country-house hotels and the production sites that move crews between sets.",
    ],
    specs: { seats: "8", range: "Up to 80 km", battery: "13.5 kWh lithium", topSpeed: "25 mph", dimensions: "4.60 × 1.50 × 2.00 m", charge: "9–11 hrs (13A)" },
    basePrice: 23500,
    plate: "#23433a",
    image: null,
    highlights: ["8 seats", "Long canopy", "Big battery"],
    recommendedSectors: ["resorts-hotels", "golf-clubs", "festivals-events", "film-tv"],
  },
  {
    slug: "the-utility",
    name: "The Utility",
    category: "utility",
    categoryLabel: "Utility & Cargo",
    tagline: "A quiet workhorse for the grounds.",
    summary: "A working electric vehicle with a tipping cargo bed — for the grounds team that maintains the estate behind the scenes.",
    body: [
      "Every estate runs a fleet that guests never see. The Utility serves that quiet, essential role: a load bed, a tipping mechanism and the torque to haul across the grounds in near silence.",
      "It shares the marque's finish and drivetrain, so the working vehicle is held to the same standard as the carriage at the front door.",
    ],
    specs: { seats: "2", range: "Up to 70 km", battery: "9.0 kWh lithium", topSpeed: "22 mph", dimensions: "3.40 × 1.30 × 1.92 m", charge: "8–10 hrs (13A)" },
    basePrice: 15900,
    plate: "#3a424b",
    image: null,
    highlights: ["Cargo bed", "Payload", "Rugged"],
    recommendedSectors: ["estates", "holiday-parks", "golf-clubs"],
  },
  {
    slug: "bespoke",
    name: "Bespoke",
    category: "bespoke",
    categoryLabel: "Made to Order",
    tagline: "Specified entirely around you.",
    summary: "When the range is a starting point rather than an answer — commission a vehicle built entirely to your brief.",
    body: [
      "Beyond the configured range lies the bespoke commission: liveries matched to a house, bodywork reworked for a film, accessibility conversions, branded fleets and security specifications.",
      "We begin with a conversation, not a catalogue. Tell us what the vehicle must do, and where, and we will engineer the answer.",
    ],
    specs: { seats: "To specification", range: "To specification", battery: "To specification", topSpeed: "To specification", dimensions: "To specification", charge: "To specification" },
    basePrice: 0,
    plate: "#0a0a0b",
    image: null,
    highlights: ["Any livery", "Film & TV", "Fleet"],
    recommendedSectors: ["film-tv", "estates", "resorts-hotels"],
  },
];

export const modelBySlug = (slug: string) => models.find((m) => m.slug === slug);

export const modelCategories: { value: ModelCategory | "all"; label: string }[] = [
  { value: "all", label: "All Models" },
  { value: "2-seater", label: "2 Seat" },
  { value: "4-seater", label: "4 Seat" },
  { value: "6-seater", label: "6 Seat" },
  { value: "8-seater", label: "8 Seat" },
  { value: "utility", label: "Utility" },
  { value: "bespoke", label: "Bespoke" },
];
