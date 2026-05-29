/**
 * Location subsites (brief §D). Unique, genuinely-localised content per market
 *, NOT thin doorway pages. CMS-editable; new locations added in minutes.
 * Honest positioning: delivered worldwide from the UK (no implied local depot).
 */
export interface LocationFaq { q: string; a: string }
export interface Location {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  /** Clean, self-contained meta description (~150 chars). */
  metaDescription: string;
  /** Optional CMS hero image URL; falls back to curated imagery when absent. */
  hero?: string | null;
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
    metaDescription: "British-built electric buggies for Dubai's resorts, hotels and villa communities, branded, climate-specified and delivered fully built from the UK.",
    intro:
      "From beachfront resorts on the Palm to desert-edge developments and private villa communities, Dubai moves its guests in the heat, and increasingly expects to do so without engine noise or fumes. Our electric buggies bring British-built refinement to Emirati hospitality, finished and branded to your property.",
    sections: [
      { heading: "Built for hospitality at scale", body: "Five-star resorts and hotels use our six- and eight-seat carriages to shuttle guests between lobby, beach, spa and villa, cooled, quiet and immaculately finished. Branded to your house, they become part of the welcome." },
      { heading: "Engineered for the climate", body: "Specified for high ambient temperatures with shaded canopies, ventilated seating options and battery management suited to the heat. We advise on the right configuration for year-round Gulf operation." },
      { heading: "Desert-edge & villa communities", body: "Master-planned communities and desert resorts use our fleet for estate management, security patrol and resident transport across large, low-speed sites." },
    ],
    useCases: ["Resort guest transfers", "Beach & spa shuttles", "Villa community transport", "Estate & security patrol"],
    delivery:
      "Delivered worldwide from our UK workshop, fully built and branded, with freight, documentation and import handled in partnership with regional logistics. We are honest that we operate from Britain, we ship to Dubai rather than holding local stock, and we make the process simple.",
    recommendedModels: ["the-six", "the-eight", "the-four"],
    relatedSectors: ["resorts-hotels", "estates"],
    faqs: [
      { q: "Do you have a depot in Dubai?", a: "We build and finish every vehicle in Britain and ship worldwide. We do not hold local stock in Dubai; we deliver fully built and branded, and coordinate freight and import." },
      { q: "Can the buggies handle the heat?", a: "Yes, we specify shaded canopies, ventilated seating and heat-suited battery management. We'll advise the right configuration for year-round Gulf use." },
      { q: "Can you brand them to our resort?", a: "Absolutely. Branded fleets are a core service: liveries, upholstery and your logo applied via the configurator's Branding step and confirmed at quotation." },
    ],
    currencyNote: "Pricing quoted in GBP; AED equivalent provided on request.",
  },
  {
    slug: "scotland",
    name: "Scotland",
    region: "United Kingdom",
    tagline: "For Highland estates, links golf and island resorts.",
    metaDescription: "Electric buggies for Scotland's sporting estates, links courses and Highland resorts, built for rough ground and changeable weather, delivered UK-wide.",
    intro:
      "Scotland's great sporting estates, championship links and Highland resorts cover vast, beautiful, often rugged ground. Our electric buggies move guests, guns and grounds teams across it quietly, leaving the landscape, and the peace, undisturbed.",
    sections: [
      { heading: "Sporting & country estates", body: "From the glens to the lodge, our utility and four-seat models carry parties, equipment and keepers across sporting estates without the intrusion of a petrol engine, and with the torque for rough ground." },
      { heading: "Links & Highland golf", body: "Member and buggy fleets for some of the world's most storied courses, finished to club colours and built for a full round in changeable weather, with weatherproofing and enclosed options." },
      { heading: "Island & Highland resorts", body: "Resorts from Argyll to the islands use our six- and eight-seat carriages to move guests between lodge, spa and shore, clean, quiet and dependable in the conditions." },
    ],
    useCases: ["Sporting estate transport", "Links & members' golf fleets", "Highland resort shuttles", "Grounds & gamekeeping"],
    delivery:
      "Delivered and commissioned across Scotland, mainland and, by arrangement, the islands, as part of our UK-wide delivery. Servicing and support are coordinated with your estate or club team.",
    recommendedModels: ["the-utility", "the-four", "the-eight"],
    relatedSectors: ["estates", "golf-clubs"],
    faqs: [
      { q: "Can they cope with rough estate ground?", a: "Yes, the Utility and Four are specified for gravel, grass and rough tracks, with the torque and weatherproofing Highland use demands." },
      { q: "Do you deliver to the islands?", a: "Mainland Scotland is part of our standard UK delivery; islands are served by arrangement, coordinated with your team." },
      { q: "Are they suitable for a full round of golf?", a: "Yes, range and weatherproofing are specified for a complete round in changeable conditions, with enclosed and canopy options." },
    ],
  },
  {
    slug: "bermuda",
    name: "Bermuda",
    region: "Atlantic",
    tagline: "Clean island transport for eco-conscious resorts.",
    metaDescription: "Silent, zero-emission electric buggies for Bermuda's eco-conscious resorts and private estates, corrosion-specified for the island and shipped from Britain.",
    intro:
      "Bermuda's strict approach to vehicles and its eco-conscious resorts make quiet, zero-emission electric buggies an ideal fit for island hospitality and private estates. We build to your brief in Britain and ship to the island, finished and ready.",
    sections: [
      { heading: "Eco-conscious resorts", body: "Island resorts use our electric carriages to move guests across grounds, to the beach and between cottages, silent, emission-free and gentle on a fragile environment." },
      { heading: "Private estates & residences", body: "Bermuda's private estates use our two- and four-seat models for grounds transport and guest movement, finished to a residential standard." },
      { heading: "Suited to island conditions", body: "We advise on corrosion protection, weatherproofing and battery specification appropriate to a humid, salt-air island setting." },
    ],
    useCases: ["Eco-resort guest transport", "Beach & cottage shuttles", "Private estate grounds", "Low-emission island mobility"],
    delivery:
      "Built and branded in Britain and shipped to Bermuda with freight and import coordinated. We're transparent that we serve the island from the UK rather than a local base, and we make delivery straightforward.",
    recommendedModels: ["the-four", "the-six", "the-two"],
    relatedSectors: ["resorts-hotels", "estates"],
    faqs: [
      { q: "Are electric buggies suited to Bermuda?", a: "Very, their silence and zero local emissions suit the island's eco-conscious resorts and its approach to vehicles. We specify corrosion and salt-air protection for the setting." },
      { q: "How are they delivered?", a: "Built and branded in the UK, then shipped to Bermuda with freight and import coordinated on your behalf." },
    ],
  },
  {
    slug: "new-york",
    name: "New York",
    region: "United States",
    tagline: "For Hamptons estates, campuses and events.",
    metaDescription: "British-built electric buggies for New York estates, campuses and private events, from the Hamptons to the Hudson Valley, shipped and branded to order.",
    intro:
      "From Hamptons estates and Hudson Valley properties to university campuses and large private events, New York moves people across substantial private grounds. Our British-built electric buggies bring a quiet, refined alternative, configured and branded to the property.",
    sections: [
      { heading: "Estates & private residences", body: "Hamptons and Hudson Valley estates use our four- and six-seat carriages for guest transport and grounds management across large, low-speed private land." },
      { heading: "Campuses & institutions", body: "Universities, corporate campuses and institutions use our shuttles to move people across expansive sites cleanly and quietly, branded to the institution." },
      { heading: "Events & hospitality", body: "Large private events and venues use our fleet for guest and VIP movement, discreet, silent and immaculately presented." },
    ],
    useCases: ["Estate & residence transport", "Campus & institutional shuttles", "Event & VIP movement", "Grounds management"],
    delivery:
      "Built and branded in Britain and shipped to the US East Coast, with freight, duties and import documentation coordinated. We operate from the UK and deliver to New York, we don't imply a local depot we don't have.",
    recommendedModels: ["the-four", "the-six", "the-eight"],
    relatedSectors: ["estates", "festivals-events"],
    faqs: [
      { q: "Can you deliver to the Hamptons / upstate?", a: "Yes, we ship to the US East Coast from Britain, fully built and branded, coordinating freight and import to your property." },
      { q: "Are they street-legal in New York?", a: "Our vehicles are designed for private land and low-speed estate/campus use. Road use depends on local classification; we'll advise honestly on what's permitted for your site." },
    ],
    currencyNote: "Pricing quoted in GBP; USD equivalent provided on request.",
  },
  ...([
    {
      slug: "usa", name: "USA", region: "United States", tagline: "Estates, resorts and campuses, coast to coast.",
      md: "Electric buggies for US estates, resorts, golf clubs and campuses, built in Britain and shipped to either coast, branded and ready.",
      intro: "From California vineyards to Florida resorts and Hamptons estates, American properties move people across large private grounds. Our British-built electric carriages bring a refined, quiet alternative, configured and branded to the property.",
      secs: [["Resorts and golf", "Member and guest fleets finished to club colours, specified for a full round and the climate."], ["Estates and campuses", "Quiet transport across vineyards, ranch-style estates and corporate or university campuses."]],
      uses: ["Resort transfers", "Golf fleets", "Estate transport", "Campus shuttles"], models: ["the-four", "the-six", "the-eight"], sectors: ["resorts-hotels", "golf-clubs"], cur: "USD equivalent provided on request.",
    },
    {
      slug: "abu-dhabi", name: "Abu Dhabi", region: "United Arab Emirates", tagline: "Island resorts and cultural destinations.",
      md: "Electric buggies for Abu Dhabi resorts, islands and cultural destinations, climate-specified and branded, delivered from the UK.",
      intro: "Abu Dhabi's island resorts, cultural districts and master-planned communities move guests in the heat and increasingly expect to do it silently. We supply heat-specified, branded fleets to suit.",
      secs: [["Resorts and islands", "Guest transfers across resort islands and waterfront developments, cooled and quiet."], ["Cultural and leisure venues", "Visitor transport across large cultural and leisure destinations."]],
      uses: ["Resort transfers", "Island transport", "Visitor shuttles", "Estate patrol"], models: ["the-six", "the-eight", "the-four"], sectors: ["resorts-hotels", "estates"], cur: "AED equivalent provided on request.",
    },
    {
      slug: "saudi-arabia", name: "Saudi Arabia", region: "Middle East", tagline: "Giga-projects, resorts and heritage sites.",
      md: "Electric buggies for Saudi Arabia's resorts, giga-projects and heritage sites, heat-specified and branded, delivered from Britain.",
      intro: "Saudi Arabia's new resorts, giga-projects and heritage destinations are built around walkable, low-emission movement. We supply quiet, dignified electric fleets specified for the climate and scale.",
      secs: [["Resorts and developments", "Guest and resident transport across large new developments and resorts."], ["Heritage and visitor sites", "Dignified visitor movement across heritage and cultural destinations."]],
      uses: ["Resort transfers", "Development transport", "Visitor shuttles", "Accessibility"], models: ["the-eight", "the-six", "the-four"], sectors: ["resorts-hotels", "estates"], cur: "SAR equivalent provided on request.",
    },
    {
      slug: "qatar", name: "Qatar", region: "Middle East", tagline: "Hospitality, sport and waterfront living.",
      md: "Electric buggies for Qatar's resorts, sporting venues and waterfront communities, heat-specified, branded and delivered from the UK.",
      intro: "Doha's resorts, sporting venues and waterfront communities move guests and crowds in the heat. We supply branded, climate-specified fleets for hospitality and event use.",
      secs: [["Hospitality", "Guest transfers across resorts, hotels and waterfront developments."], ["Sport and events", "Spectator, official and accessibility transport at large venues."]],
      uses: ["Resort transfers", "Event transport", "Accessibility", "Estate patrol"], models: ["the-six", "the-eight", "the-four"], sectors: ["resorts-hotels", "festivals-events"], cur: "QAR equivalent provided on request.",
    },
    {
      slug: "switzerland", name: "Switzerland", region: "Europe", tagline: "Alpine resorts, estates and private clubs.",
      md: "Electric buggies for Swiss alpine resorts, lakeside estates and private clubs, quiet and discreet, delivered from Britain.",
      intro: "Switzerland's alpine resorts, lakeside estates and private members' clubs prize discretion and quiet. Silent electric carriages move guests and members without intruding on the setting.",
      secs: [["Alpine and lakeside resorts", "Guest transport across resorts and grounds, specified for the terrain."], ["Private estates and clubs", "Discreet movement for members and residents."]],
      uses: ["Resort transfers", "Estate transport", "Members' fleets", "Grounds work"], models: ["the-four", "the-six", "the-utility"], sectors: ["resorts-hotels", "estates"], cur: "CHF equivalent provided on request.",
    },
    {
      slug: "monaco", name: "Monaco", region: "Europe", tagline: "For the Riviera's most exclusive addresses.",
      md: "Electric buggies for Monaco's private residences, yacht clubs and events, white-glove and branded, delivered from Britain.",
      intro: "Monaco moves a discerning clientele across a compact, exclusive setting. Branded, white-glove electric carriages suit private residences, yacht clubs and event hospitality.",
      secs: [["Private and hospitality", "Discreet guest transport for residences, clubs and hospitality."], ["Events", "VIP movement during the season's events and galas."]],
      uses: ["VIP transfers", "Event transport", "Residence shuttles", "Hospitality"], models: ["the-two", "the-four", "the-six"], sectors: ["resorts-hotels", "festivals-events"], cur: "EUR equivalent provided on request.",
    },
    {
      slug: "french-riviera", name: "French Riviera", region: "France", tagline: "Côte d'Azur estates, resorts and events.",
      md: "Electric buggies for the French Riviera's estates, resorts and events, from Cannes to Saint-Tropez, branded and delivered from Britain.",
      intro: "The Côte d'Azur's villas, resorts and events move guests across coastal estates and venues. Quiet electric carriages, branded to the property, fit the setting from Cannes to Saint-Tropez.",
      secs: [["Coastal estates and villas", "Guest and grounds transport across coastal properties."], ["Resorts and events", "Hospitality and event transport through the season."]],
      uses: ["Estate transport", "Resort transfers", "Event fleets", "VIP shuttles"], models: ["the-four", "the-six", "the-two"], sectors: ["estates", "festivals-events"], cur: "EUR equivalent provided on request.",
    },
    {
      slug: "marbella", name: "Marbella", region: "Spain", tagline: "Costa del Sol resorts, golf and estates.",
      md: "Electric buggies for Marbella and the Costa del Sol, resort, golf and estate fleets, branded and delivered from Britain.",
      intro: "Marbella and the Costa del Sol move guests across golf resorts, beach clubs and gated estates in a warm climate. Our branded electric fleets suit hospitality and residential use alike.",
      secs: [["Golf and resorts", "Member and guest fleets for the region's many courses and resorts."], ["Gated estates", "Resident and grounds transport across private communities."]],
      uses: ["Golf fleets", "Resort transfers", "Estate transport", "Beach club shuttles"], models: ["the-four", "the-six", "the-utility"], sectors: ["golf-clubs", "resorts-hotels"], cur: "EUR equivalent provided on request.",
    },
    {
      slug: "lake-como", name: "Lake Como", region: "Italy", tagline: "Lakeside villas, hotels and weddings.",
      md: "Electric buggies for Lake Como's villas, grand hotels and weddings, discreet and branded, delivered from Britain.",
      intro: "Lake Como's villas, grand hotels and destination weddings move guests across steep, beautiful lakeside grounds. Quiet electric carriages handle the gradients without breaking the calm.",
      secs: [["Villas and hotels", "Guest transport across lakeside estates and grand hotels."], ["Weddings and events", "Discreet guest movement for destination events."]],
      uses: ["Villa transport", "Hotel transfers", "Wedding fleets", "Grounds work"], models: ["the-four", "the-six", "the-two"], sectors: ["resorts-hotels", "festivals-events"], cur: "EUR equivalent provided on request.",
    },
    {
      slug: "algarve", name: "Algarve", region: "Portugal", tagline: "Golf resorts and coastal estates.",
      md: "Electric buggies for the Algarve's golf resorts and coastal estates, branded fleets specified for the climate, delivered from Britain.",
      intro: "The Algarve's golf resorts and coastal estates move members and guests across sun-warmed grounds. Our electric fleets, branded to the resort, suit a full day in the heat.",
      secs: [["Golf resorts", "Member and buggy fleets for the region's championship courses."], ["Coastal estates", "Guest and grounds transport across resort estates."]],
      uses: ["Golf fleets", "Resort transfers", "Estate transport", "Grounds work"], models: ["the-two", "the-four", "the-utility"], sectors: ["golf-clubs", "resorts-hotels"], cur: "EUR equivalent provided on request.",
    },
    {
      slug: "maldives", name: "Maldives", region: "Indian Ocean", tagline: "Island resorts that move on foot and by buggy.",
      md: "Electric buggies for Maldivian island resorts, silent, salt-air-specified guest transport, shipped from Britain.",
      intro: "Maldivian resorts move guests across island walkways and jetties where silence and zero emissions matter. We specify corrosion and salt-air protection for the setting.",
      secs: [["Island guest transport", "Quiet transfers between villas, restaurants and the jetty."], ["Island-suited build", "Corrosion and salt-air protection for a marine environment."]],
      uses: ["Villa transfers", "Jetty transport", "Staff and ops", "Accessibility"], models: ["the-four", "the-six", "the-two"], sectors: ["resorts-hotels"], cur: "USD equivalent provided on request.",
    },
    {
      slug: "mauritius", name: "Mauritius", region: "Indian Ocean", tagline: "Eco-conscious island resorts and estates.",
      md: "Electric buggies for Mauritius resorts and estates, silent and eco-conscious, salt-air-specified, shipped from Britain.",
      intro: "Mauritius's resorts and private estates favour quiet, eco-conscious transport across tropical grounds. We supply salt-air-specified electric fleets to match.",
      secs: [["Resorts", "Guest transfers across resort grounds and beaches."], ["Estates", "Grounds and guest transport for private estates."]],
      uses: ["Resort transfers", "Estate transport", "Grounds work", "Accessibility"], models: ["the-six", "the-four", "the-utility"], sectors: ["resorts-hotels", "estates"], cur: "USD equivalent provided on request.",
    },
    {
      slug: "singapore", name: "Singapore", region: "Asia", tagline: "Resorts, campuses and integrated developments.",
      md: "Electric buggies for Singapore resorts, campuses and integrated developments, branded and delivered from Britain.",
      intro: "Singapore's resorts, corporate campuses and integrated developments move people across landscaped, walkable grounds in a humid climate. Quiet electric fleets fit the setting.",
      secs: [["Resorts and attractions", "Visitor and guest transport across resorts and attractions."], ["Campuses", "People-moving across corporate and institutional campuses."]],
      uses: ["Resort transfers", "Campus shuttles", "Visitor transport", "Accessibility"], models: ["the-six", "the-eight", "the-four"], sectors: ["resorts-hotels", "estates"], cur: "SGD equivalent provided on request.",
    },
    {
      slug: "australia", name: "Australia", region: "Oceania", tagline: "Wineries, resorts, golf and estates.",
      md: "Electric buggies for Australian wineries, resorts, golf clubs and estates, branded and shipped from Britain.",
      intro: "Australia's wineries, coastal resorts, golf clubs and rural estates move guests across large, sun-exposed grounds. Our electric fleets suit a full day outdoors, branded to the property.",
      secs: [["Wineries and resorts", "Guest transport and tastings transport across estates and resorts."], ["Golf and rural estates", "Member fleets and grounds vehicles for large properties."]],
      uses: ["Winery tours", "Resort transfers", "Golf fleets", "Estate work"], models: ["the-four", "the-six", "the-utility"], sectors: ["resorts-hotels", "golf-clubs"], cur: "AUD equivalent provided on request.",
    },
    {
      slug: "bahamas", name: "Bahamas", region: "Caribbean", tagline: "Island resorts and private cays.",
      md: "Electric buggies for Bahamian resorts and private cays, silent and salt-air-specified, shipped from Britain.",
      intro: "Bahamian resorts and private islands move guests across cays and beach grounds where quiet, clean transport suits the setting. We specify for salt air and island use.",
      secs: [["Resorts and cays", "Guest transfers across island resorts and private cays."], ["Island-suited build", "Corrosion and salt-air protection for the environment."]],
      uses: ["Resort transfers", "Cay transport", "Staff and ops", "Accessibility"], models: ["the-four", "the-six", "the-two"], sectors: ["resorts-hotels"], cur: "USD equivalent provided on request.",
    },
  ].map((x) => ({
    slug: x.slug, name: x.name, region: x.region, tagline: x.tagline, metaDescription: x.md, intro: x.intro,
    sections: x.secs.map(([heading, body]) => ({ heading, body })),
    useCases: x.uses,
    delivery: `Built and branded in Britain and shipped to ${x.name}, with freight, documentation and import coordinated. We operate from the UK and deliver to ${x.name}; we do not imply a local depot we do not have.`,
    currencyNote: `Pricing quoted in GBP; ${x.cur}`,
    recommendedModels: x.models, relatedSectors: x.sectors,
    faqs: [
      { q: `Do you deliver to ${x.name}?`, a: `Yes. We build and brand every vehicle in Britain and ship to ${x.name}, coordinating freight and import on your behalf.` },
      { q: "Can the fleet be branded to our property?", a: "Yes. Liveries, upholstery and your logo are applied via the configurator's Branding step and confirmed at quotation." },
    ],
  })) as Location[]),
];

export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug);
