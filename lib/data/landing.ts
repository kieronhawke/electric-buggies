/**
 * Keyword-led SEO landing pages (brief §4/§5). CMS-editable in Phase 2 via the
 * Sanity `landingPage` schema; seeded here. Each links internally to range &
 * sectors for SEO.
 */

export interface LandingPage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  recommendedModels: string[];
  relatedSectors: string[];
}

export const landingPages: Record<string, LandingPage> = {
  "electric-buggies": {
    slug: "electric-buggies",
    metaTitle: "Electric Buggies — Bespoke & British",
    metaDescription:
      "Premium electric buggies built to order in Britain. Two to eight seats, bespoke finishes, UK-wide delivery. Configure yours and request a tailored quote.",
    eyebrow: "Electric Buggies",
    title: "Electric buggies, built to a higher standard.",
    intro:
      "Electric Buggies builds electric buggies for the places that judge every detail — estates, resorts, golf clubs and events. Each is bespoke, beautifully finished and supported across the UK.",
    sections: [
      { heading: "Bespoke, not off-the-shelf", body: "Choose your model, colour, roof, wheels and upholstery, or commission something entirely your own. Every buggy is built to order." },
      { heading: "Quiet, clean, capable", body: "Fully electric drivetrains deliver near-silent running, zero local emissions and the range to work all day on a single overnight charge." },
      { heading: "Supported UK-wide", body: "Delivered, commissioned and serviced the length of the country, with a standard 3-year warranty." },
    ],
    recommendedModels: ["mayfair-two", "mayfair-four", "mayfair-six"],
    relatedSectors: ["estates", "resorts-hotels", "golf-clubs"],
  },
  "electric-golf-buggies": {
    slug: "electric-golf-buggies",
    metaTitle: "Electric Golf Buggies for Clubs & Members",
    metaDescription:
      "Premium electric golf buggies for clubs and members — finished to club colours, full-round range, UK-wide support. Configure a fleet and request a quote.",
    eyebrow: "Electric Golf Buggies",
    title: "A golf fleet worthy of the course.",
    intro:
      "The buggy is the most-used and most-visible vehicle on any course. Electric Buggies electric golf buggies elevate the member experience while quietly serving green-keeping teams.",
    sections: [
      { heading: "Member-grade comfort", body: "Two- and four-seat carriages with the range to complete a round and the finish to enjoy it — in your club's colours." },
      { heading: "Course operations", body: "The Electric Buggies Utility supports green-keeping and marshalling without scarring turf or breaking the quiet." },
      { heading: "Fleet pricing & livery", body: "We work with clubs on full fleets, bespoke liveries and fleet terms. Select 'Business' on the quote form." },
    ],
    recommendedModels: ["mayfair-two", "mayfair-four", "mayfair-utility"],
    relatedSectors: ["golf-clubs", "estates"],
  },
  "electric-utility-vehicles": {
    slug: "electric-utility-vehicles",
    metaTitle: "Electric Utility Vehicles for Grounds & Estates",
    metaDescription:
      "Electric utility vehicles with tipping cargo beds for estates, parks and clubs. High torque, near-silent, estate-grade build. Configure yours and request a quote.",
    eyebrow: "Electric Utility Vehicles",
    title: "The working vehicle, held to the same standard.",
    intro:
      "Every estate runs a fleet that guests never see. Electric Buggies electric utility vehicles do that essential work in near silence — with the torque to haul and the finish you'd expect of the marque.",
    sections: [
      { heading: "Built to work", body: "A tipping cargo bed, high torque and a robust platform make light of grounds, maintenance and deliveries." },
      { heading: "Clean and quiet", body: "Run from dawn without diesel noise or fumes — ideal for sites where guests are never far away." },
      { heading: "Estate-grade finish", body: "The working vehicle shares the marque's drivetrain and finish, so standards never drop behind the scenes." },
    ],
    recommendedModels: ["mayfair-utility", "mayfair-two", "mayfair-four"],
    relatedSectors: ["estates", "holiday-parks", "golf-clubs"],
  },
  "event-festival-buggies": {
    slug: "event-festival-buggies",
    metaTitle: "Event & Festival Buggies — Electric & Quiet",
    metaDescription:
      "Electric buggies for festivals and events — artist and guest transport, site logistics and accessibility, all without diesel noise. Configure a fleet and request a quote.",
    eyebrow: "Event & Festival Buggies",
    title: "Move the moment, not the noise.",
    intro:
      "Across a festival site or a country-house event, Electric Buggies electric buggies move artists, crew and guests where vans and fumes would intrude — quiet, clean and quick to deploy.",
    sections: [
      { heading: "Artist & guest transport", body: "Discreet, silent movement from gate to stage to green room. The Electric Buggies Six and Eight carry groups gracefully." },
      { heading: "Site logistics", body: "The Electric Buggies Utility keeps a site running behind the scenes without diesel or disruption." },
      { heading: "Hire & fleet enquiries", body: "We support events with fleets and bespoke specifications. Tell us your dates and requirement." },
    ],
    recommendedModels: ["mayfair-eight", "mayfair-six", "mayfair-utility"],
    relatedSectors: ["festivals-events", "film-tv"],
  },
};
