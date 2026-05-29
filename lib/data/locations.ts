/**
 * Location subsites (brief §D). Unique, genuinely-localised content per market
 * — NOT thin doorway pages. CMS-editable; new locations added in minutes.
 * Honest positioning: delivered worldwide from the UK (no implied local depot).
 */
export interface LocationFaq { q: string; a: string }
export interface Location {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  intro: string;
  sections: { heading: string; body: string }[];
  useCases: string[];
  delivery: string;
  recommendedModels: string[];
  relatedSectors: string[];
  faqs: LocationFaq[];
  currencyNote?: string;
}

export const locations: Location[] = [
  {
    slug: "dubai",
    name: "Dubai",
    region: "United Arab Emirates",
    tagline: "Silent luxury for the Emirates' finest resorts.",
    intro:
      "From beachfront resorts on the Palm to desert-edge developments and private villa communities, Dubai moves its guests in the heat — and increasingly expects to do so without engine noise or fumes. Our electric buggies bring British-built refinement to Emirati hospitality, finished and branded to your property.",
    sections: [
      { heading: "Built for hospitality at scale", body: "Five-star resorts and hotels use our six- and eight-seat carriages to shuttle guests between lobby, beach, spa and villa — cooled, quiet and immaculately finished. Branded to your house, they become part of the welcome." },
      { heading: "Engineered for the climate", body: "Specified for high ambient temperatures with shaded canopies, ventilated seating options and battery management suited to the heat. We advise on the right configuration for year-round Gulf operation." },
      { heading: "Desert-edge & villa communities", body: "Master-planned communities and desert resorts use our fleet for estate management, security patrol and resident transport across large, low-speed sites." },
    ],
    useCases: ["Resort guest transfers", "Beach & spa shuttles", "Villa community transport", "Estate & security patrol"],
    delivery:
      "Delivered worldwide from our UK workshop, fully built and branded, with freight, documentation and import handled in partnership with regional logistics. We are honest that we operate from Britain — we ship to Dubai rather than holding local stock — and we make the process simple.",
    recommendedModels: ["the-six", "the-eight", "the-four"],
    relatedSectors: ["resorts-hotels", "estates"],
    faqs: [
      { q: "Do you have a depot in Dubai?", a: "We build and finish every vehicle in Britain and ship worldwide. We do not hold local stock in Dubai; we deliver fully built and branded, and coordinate freight and import." },
      { q: "Can the buggies handle the heat?", a: "Yes — we specify shaded canopies, ventilated seating and heat-suited battery management. We'll advise the right configuration for year-round Gulf use." },
      { q: "Can you brand them to our resort?", a: "Absolutely. Branded fleets are a core service: liveries, upholstery and your logo applied via the configurator's Branding step and confirmed at quotation." },
    ],
    currencyNote: "Pricing quoted in GBP; AED equivalent provided on request.",
  },
  {
    slug: "scotland",
    name: "Scotland",
    region: "United Kingdom",
    tagline: "For Highland estates, links golf and island resorts.",
    intro:
      "Scotland's great sporting estates, championship links and Highland resorts cover vast, beautiful, often rugged ground. Our electric buggies move guests, guns and grounds teams across it quietly — leaving the landscape, and the peace, undisturbed.",
    sections: [
      { heading: "Sporting & country estates", body: "From the glens to the lodge, our utility and four-seat models carry parties, equipment and keepers across sporting estates without the intrusion of a petrol engine — and with the torque for rough ground." },
      { heading: "Links & Highland golf", body: "Member and buggy fleets for some of the world's most storied courses, finished to club colours and built for a full round in changeable weather, with weatherproofing and enclosed options." },
      { heading: "Island & Highland resorts", body: "Resorts from Argyll to the islands use our six- and eight-seat carriages to move guests between lodge, spa and shore — clean, quiet and dependable in the conditions." },
    ],
    useCases: ["Sporting estate transport", "Links & members' golf fleets", "Highland resort shuttles", "Grounds & gamekeeping"],
    delivery:
      "Delivered and commissioned across Scotland — mainland and, by arrangement, the islands — as part of our UK-wide delivery. Servicing and support are coordinated with your estate or club team.",
    recommendedModels: ["the-utility", "the-four", "the-eight"],
    relatedSectors: ["estates", "golf-clubs"],
    faqs: [
      { q: "Can they cope with rough estate ground?", a: "Yes — the Utility and Four are specified for gravel, grass and rough tracks, with the torque and weatherproofing Highland use demands." },
      { q: "Do you deliver to the islands?", a: "Mainland Scotland is part of our standard UK delivery; islands are served by arrangement, coordinated with your team." },
      { q: "Are they suitable for a full round of golf?", a: "Yes — range and weatherproofing are specified for a complete round in changeable conditions, with enclosed and canopy options." },
    ],
  },
  {
    slug: "bermuda",
    name: "Bermuda",
    region: "Atlantic",
    tagline: "Clean island transport for eco-conscious resorts.",
    intro:
      "Bermuda's strict approach to vehicles and its eco-conscious resorts make quiet, zero-emission electric buggies an ideal fit for island hospitality and private estates. We build to your brief in Britain and ship to the island, finished and ready.",
    sections: [
      { heading: "Eco-conscious resorts", body: "Island resorts use our electric carriages to move guests across grounds, to the beach and between cottages — silent, emission-free and gentle on a fragile environment." },
      { heading: "Private estates & residences", body: "Bermuda's private estates use our two- and four-seat models for grounds transport and guest movement, finished to a residential standard." },
      { heading: "Suited to island conditions", body: "We advise on corrosion protection, weatherproofing and battery specification appropriate to a humid, salt-air island setting." },
    ],
    useCases: ["Eco-resort guest transport", "Beach & cottage shuttles", "Private estate grounds", "Low-emission island mobility"],
    delivery:
      "Built and branded in Britain and shipped to Bermuda with freight and import coordinated. We're transparent that we serve the island from the UK rather than a local base — and we make delivery straightforward.",
    recommendedModels: ["the-four", "the-six", "the-two"],
    relatedSectors: ["resorts-hotels", "estates"],
    faqs: [
      { q: "Are electric buggies suited to Bermuda?", a: "Very — their silence and zero local emissions suit the island's eco-conscious resorts and its approach to vehicles. We specify corrosion and salt-air protection for the setting." },
      { q: "How are they delivered?", a: "Built and branded in the UK, then shipped to Bermuda with freight and import coordinated on your behalf." },
    ],
  },
  {
    slug: "new-york",
    name: "New York",
    region: "United States",
    tagline: "For Hamptons estates, campuses and events.",
    intro:
      "From Hamptons estates and Hudson Valley properties to university campuses and large private events, New York moves people across substantial private grounds. Our British-built electric buggies bring a quiet, refined alternative — configured and branded to the property.",
    sections: [
      { heading: "Estates & private residences", body: "Hamptons and Hudson Valley estates use our four- and six-seat carriages for guest transport and grounds management across large, low-speed private land." },
      { heading: "Campuses & institutions", body: "Universities, corporate campuses and institutions use our shuttles to move people across expansive sites cleanly and quietly, branded to the institution." },
      { heading: "Events & hospitality", body: "Large private events and venues use our fleet for guest and VIP movement — discreet, silent and immaculately presented." },
    ],
    useCases: ["Estate & residence transport", "Campus & institutional shuttles", "Event & VIP movement", "Grounds management"],
    delivery:
      "Built and branded in Britain and shipped to the US East Coast, with freight, duties and import documentation coordinated. We operate from the UK and deliver to New York — we don't imply a local depot we don't have.",
    recommendedModels: ["the-four", "the-six", "the-eight"],
    relatedSectors: ["estates", "festivals-events"],
    faqs: [
      { q: "Can you deliver to the Hamptons / upstate?", a: "Yes — we ship to the US East Coast from Britain, fully built and branded, coordinating freight and import to your property." },
      { q: "Are they street-legal in New York?", a: "Our vehicles are designed for private land and low-speed estate/campus use. Road use depends on local classification; we'll advise honestly on what's permitted for your site." },
    ],
    currencyNote: "Pricing quoted in GBP; USD equivalent provided on request.",
  },
];

export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug);
