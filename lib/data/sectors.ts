/**
 * Sectors — deep, solution-led pages (brief §F). Problem → solution framing,
 * recommended models, FAQs (FAQPage schema), internal links. CMS-editable.
 */
export interface Sector {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  problem: string;
  sections: { heading: string; body: string }[];
  useCases: string[];
  recommendedModels: string[];
  relatedPosts: string[];
  faqs: { q: string; a: string }[];
  plate: string;
}

export const sectors: Sector[] = [
  {
    slug: "estates",
    name: "Country Estates",
    tagline: "Quiet movement across great grounds.",
    intro: "From the principal drive to the furthest boundary, an estate runs on discreet, dependable movement. Our electric vehicles carry family, guests and grounds teams without noise, fumes or fuss.",
    problem: "Estates need to move people and materials across large, sometimes rough ground — without petrol noise and fumes intruding on the calm that defines them, and without scarring lawns or disturbing wildlife.",
    sections: [
      { heading: "Front of house", body: "Collect arriving guests in a carriage finished to match the house — The Four and The Six are specified most often for this role." },
      { heading: "Behind the scenes", body: "The Utility hauls tools, timber and tackle across the grounds in near silence, sparing the lawns and the calm alike." },
      { heading: "The whole estate, one fleet", body: "A single, consistent fleet — branded to the estate — covers guest transport, grounds work and security patrol." },
    ],
    useCases: ["Guest transfers", "Grounds maintenance", "Boundary patrols", "Garden tours"],
    recommendedModels: ["the-four", "the-six", "the-utility"],
    relatedPosts: ["choosing-electric-utility-vehicle-country-estate", "lithium-vs-lead-acid-range-lifespan"],
    faqs: [
      { q: "Will they cope with rough estate tracks?", a: "Yes — The Utility and The Four are specified for gravel, grass and rough ground, with the torque and weatherproofing estate use demands." },
      { q: "Can the fleet be branded to the estate?", a: "Yes — liveries, upholstery and your crest or logo are applied via the configurator's Branding step and confirmed at quotation." },
    ],
    plate: "#23433a",
  },
  {
    slug: "resorts-hotels",
    name: "Resorts & Hotels",
    tagline: "Hospitality that glides.",
    intro: "A resort is judged in its first hundred metres. A silent, beautifully finished electric carriage to greet and ferry guests sets the tone before a word is spoken.",
    problem: "Hospitality sites must move guests comfortably between lobby, rooms, spa and grounds — at all hours — without engine noise, fumes or anything that undercuts a premium welcome.",
    sections: [
      { heading: "Arrival & transfers", body: "Move guests between reception, rooms, spa and grounds in comfort. The Six and The Eight shuttle groups gracefully across larger sites." },
      { heading: "Branded to your house", body: "Liveries, upholstery and detailing finished to your brand — a bespoke commission turns transport into part of the welcome." },
      { heading: "Always ready", body: "We help operators plan fleet size, overnight charging and servicing so a vehicle is always ready for the next guest." },
    ],
    useCases: ["Guest transfers", "Spa & grounds shuttle", "Branded fleets", "Event transport"],
    recommendedModels: ["the-six", "the-eight", "the-four"],
    relatedPosts: ["electric-buggies-resorts-hotels-buyers-guide", "how-much-does-an-electric-golf-buggy-cost-uk"],
    faqs: [
      { q: "Can you brand the fleet to our resort?", a: "Absolutely — branded fleets are a core service. Place your logo via the Branding step and we produce it exactly at build." },
      { q: "How many vehicles will we need?", a: "It depends on site size and peak demand; we help you plan fleet size and charging so vehicles are always available." },
    ],
    plate: "#27364f",
  },
  {
    slug: "golf-clubs",
    name: "Golf Clubs",
    tagline: "A fleet worthy of the course.",
    intro: "The buggy is the most-used vehicle on any course — and the most visible. A fleet from Electric Buggies elevates the member experience while quietly serving the green-keeping team.",
    problem: "Clubs need member buggies that complete a round comfortably in changeable weather, look the part in club colours, and a working fleet that maintains the course without damaging turf.",
    sections: [
      { heading: "Member fleets", body: "Two- and four-seat carriages finished to club colours, with the range to complete a round and the comfort to enjoy it." },
      { heading: "Course operations", body: "The Utility supports green-keeping and marshalling without scarring the turf or shattering the quiet." },
      { heading: "Weatherproof options", body: "Canopies, screens and enclosed options keep members comfortable through a full round in any conditions." },
    ],
    useCases: ["Member buggies", "Green-keeping", "Marshalling", "Club fleets"],
    recommendedModels: ["the-two", "the-four", "the-utility"],
    relatedPosts: ["are-golf-buggies-road-legal-uk", "lithium-vs-lead-acid-range-lifespan"],
    faqs: [
      { q: "Will the battery last a full round?", a: "Yes — range and weatherproofing are specified for a complete round, with lithium for reliable all-day use." },
      { q: "Are they road-legal between course and clubhouse?", a: "Most operate on private land needing no registration; where a public road is crossed we advise on what specification is required." },
    ],
    plate: "#23433a",
  },
  {
    slug: "festivals-events",
    name: "Festivals & Events",
    tagline: "Move the moment, not the noise.",
    intro: "Across a festival site or a country-house wedding, electric vehicles move artists, crew and guests where vans and fumes would intrude. Quiet, clean and quick to deploy.",
    problem: "Event sites need to move artists, crew, guests and equipment quickly and discreetly — without diesel noise or fumes breaking the atmosphere, and with the flexibility to scale up for the dates.",
    sections: [
      { heading: "Artist & guest transport", body: "Discreet, silent movement from gate to stage to green room — The Six and The Eight carry groups without breaking the atmosphere." },
      { heading: "Site operations", body: "The Utility keeps a site running behind the scenes, from production to grounds, without diesel or disruption." },
      { heading: "Hire & fleet for the dates", body: "We support events with fleets and bespoke specifications, planned around your dates and site." },
    ],
    useCases: ["Artist transport", "Guest shuttles", "Production logistics", "Accessibility"],
    recommendedModels: ["the-eight", "the-six", "the-utility"],
    relatedPosts: ["electric-buggies-resorts-hotels-buyers-guide"],
    faqs: [
      { q: "Can you supply a fleet for specific event dates?", a: "Yes — tell us your dates, site and requirement and we'll plan a fleet and specification around them." },
      { q: "Are they quiet enough for live events?", a: "Fully electric drivetrains are near-silent — ideal for moving people near stages and audiences without intrusion." },
    ],
    plate: "#3a424b",
  },
  {
    slug: "holiday-parks",
    name: "Holiday Parks",
    tagline: "Welcome, deliver, depart — silently.",
    intro: "Holiday parks move guests, luggage and staff all day, every day. Electric vehicles do it cleanly, cheaply and without the engine noise that breaks a holiday calm.",
    problem: "Parks run constant transport — check-in transfers, lodge drop-offs, housekeeping and deliveries — and need it clean, quiet and inexpensive to run from dawn to dusk.",
    sections: [
      { heading: "Guest services", body: "Check-in transfers, lodge drop-offs and grounds tours in comfortable four- and six-seat carriages." },
      { heading: "Park operations", body: "Housekeeping, maintenance and deliveries handled by The Utility — quiet enough to run from dawn." },
      { heading: "Low running costs", body: "Electric running costs and minimal maintenance keep a busy park fleet affordable year-round." },
    ],
    useCases: ["Guest transfers", "Luggage & deliveries", "Housekeeping", "Grounds upkeep"],
    recommendedModels: ["the-four", "the-six", "the-utility"],
    relatedPosts: ["lithium-vs-lead-acid-range-lifespan", "how-much-does-an-electric-golf-buggy-cost-uk"],
    faqs: [
      { q: "How much do they cost to run?", a: "Electric running costs are a fraction of petrol, with far less maintenance — we'll model the running cost for your park." },
      { q: "Can they run all day?", a: "Yes — lithium models are specified for all-day stop-start use on an overnight charge, with fast-charge options." },
    ],
    plate: "#5b6066",
  },
  {
    slug: "film-tv",
    name: "Film & Television",
    tagline: "Built for the set, quiet on the take.",
    intro: "Production runs on movement: cast to set, crew to base, equipment to location. Silent electric vehicles do it without spoiling a take or a location's air quality.",
    problem: "Productions must move cast, crew and equipment around locations fast and silently — without engine noise ruining a take or fumes affecting sensitive sites — plus bespoke picture vehicles on demand.",
    sections: [
      { heading: "Unit transport", body: "Move cast and crew across a location quietly and quickly — The Eight is a true unit shuttle." },
      { heading: "Picture vehicles & conversions", body: "Bespoke commissions deliver period liveries, branded set dressing and engineered conversions to a production's exact brief." },
      { heading: "Silent on location", body: "Near-silent drivetrains keep vehicles usable during takes and on noise-sensitive locations." },
    ],
    useCases: ["Unit transport", "Equipment moves", "Picture vehicles", "On-set conversions"],
    recommendedModels: ["the-eight", "the-six", "bespoke"],
    relatedPosts: ["choosing-electric-utility-vehicle-country-estate"],
    faqs: [
      { q: "Can you build a bespoke picture vehicle?", a: "Yes — bespoke commissions cover period liveries, set dressing and engineered conversions to your production's brief." },
      { q: "Are they quiet enough to use during takes?", a: "Electric drivetrains are near-silent, so vehicles can move on or near set without spoiling sound." },
    ],
    plate: "#0a0a0b",
  },
];

export const sectorBySlug = (slug: string) => sectors.find((s) => s.slug === slug);
