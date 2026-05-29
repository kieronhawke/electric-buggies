/**
 * Sectors — key SEO landing content (brief §5/§4). Sourced from Sanity
 * `sector` documents in Phase 2; seeded here as the fallback.
 */

export interface Sector {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  sections: { heading: string; body: string }[];
  useCases: string[];
  recommendedModels: string[]; // model slugs
  plate: string;
}

export const sectors: Sector[] = [
  {
    slug: "estates",
    name: "Estates",
    tagline: "Quiet movement across great grounds.",
    intro:
      "From the principal drive to the furthest boundary, an estate runs on discreet, dependable movement. Our electric vehicles carry family, guests and grounds teams without noise, fumes or fuss.",
    sections: [
      {
        heading: "Front of house",
        body: "Collect arriving guests in a carriage finished to match the house — the Electric Buggies Four and Six are specified most often for this role.",
      },
      {
        heading: "Behind the scenes",
        body: "The Electric Buggies Utility hauls tools, timber and tackle across the grounds in near silence, sparing the lawns and the calm alike.",
      },
    ],
    useCases: ["Guest transfers", "Grounds maintenance", "Boundary patrols", "Garden tours"],
    recommendedModels: ["mayfair-four", "mayfair-six", "mayfair-utility"],
    plate: "#1c2b22",
  },
  {
    slug: "resorts-hotels",
    name: "Resorts & Hotels",
    tagline: "Hospitality that glides.",
    intro:
      "A resort is judged in its first hundred metres. A silent, beautifully finished electric carriage to greet and ferry guests sets the tone before a word is spoken.",
    sections: [
      {
        heading: "Arrival & transfers",
        body: "Move guests between reception, rooms, spa and grounds in comfort. The Electric Buggies Six and Eight shuttle groups gracefully across larger sites.",
      },
      {
        heading: "Branded to your house",
        body: "Liveries, upholstery and detailing finished to your brand — a bespoke commission turns transport into part of the welcome.",
      },
    ],
    useCases: ["Guest transfers", "Spa & grounds shuttle", "Branded fleets", "Event transport"],
    recommendedModels: ["mayfair-six", "mayfair-eight", "mayfair-four"],
    plate: "#2a2620",
  },
  {
    slug: "festivals-events",
    name: "Festivals & Events",
    tagline: "Move the moment, not the noise.",
    intro:
      "Across a festival site or a country-house wedding, electric vehicles move artists, crew and guests where vans and fumes would intrude. Quiet, clean and quick to deploy.",
    sections: [
      {
        heading: "Artist & guest transport",
        body: "Discreet, silent movement from gate to stage to green room — the Electric Buggies Six and Eight carry groups without breaking the atmosphere.",
      },
      {
        heading: "Site operations",
        body: "The Electric Buggies Utility keeps a site running behind the scenes, from production to grounds, without diesel or disruption.",
      },
    ],
    useCases: ["Artist transport", "Guest shuttles", "Production logistics", "Accessibility"],
    recommendedModels: ["mayfair-eight", "mayfair-six", "mayfair-utility"],
    plate: "#23211b",
  },
  {
    slug: "golf-clubs",
    name: "Golf Clubs",
    tagline: "A fleet worthy of the course.",
    intro:
      "The buggy is the most-used vehicle on any course — and the most visible. A Electric Buggies fleet elevates the member experience while quietly serving the green-keeping team.",
    sections: [
      {
        heading: "Member fleets",
        body: "Two- and four-seat carriages finished to club colours, with the range to complete a round and the comfort to enjoy it.",
      },
      {
        heading: "Course operations",
        body: "The Electric Buggies Utility supports green-keeping and marshalling without scarring the turf or shattering the quiet.",
      },
    ],
    useCases: ["Member buggies", "Green-keeping", "Marshalling", "Club fleets"],
    recommendedModels: ["mayfair-two", "mayfair-four", "mayfair-utility"],
    plate: "#1c2b22",
  },
  {
    slug: "holiday-parks",
    name: "Holiday Parks",
    tagline: "Welcome, deliver, depart — silently.",
    intro:
      "Holiday parks move guests, luggage and staff all day, every day. Electric vehicles do it cleanly, cheaply and without the engine noise that breaks a holiday calm.",
    sections: [
      {
        heading: "Guest services",
        body: "Check-in transfers, lodge drop-offs and grounds tours in comfortable four- and six-seat carriages.",
      },
      {
        heading: "Park operations",
        body: "Housekeeping, maintenance and deliveries handled by the Electric Buggies Utility — quiet enough to run from dawn.",
      },
    ],
    useCases: ["Guest transfers", "Luggage & deliveries", "Housekeeping", "Grounds upkeep"],
    recommendedModels: ["mayfair-four", "mayfair-six", "mayfair-utility"],
    plate: "#2a2620",
  },
  {
    slug: "film-tv",
    name: "Film & TV",
    tagline: "Built for the set, quiet on the take.",
    intro:
      "Production runs on movement: cast to set, crew to base, equipment to location. Silent electric vehicles do it without spoiling a take or a location's air quality.",
    sections: [
      {
        heading: "Unit transport",
        body: "Move cast and crew across a location quietly and quickly — the Electric Buggies Eight is a true unit shuttle.",
      },
      {
        heading: "Picture vehicles & conversions",
        body: "Bespoke commissions deliver period liveries, branded set dressing and engineered conversions to a production's exact brief.",
      },
    ],
    useCases: ["Unit transport", "Equipment moves", "Picture vehicles", "On-set conversions"],
    recommendedModels: ["mayfair-eight", "mayfair-six", "bespoke"],
    plate: "#16150f",
  },
];

export const sectorBySlug = (slug: string) => sectors.find((s) => s.slug === slug);
