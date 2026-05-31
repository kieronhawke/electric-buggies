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
    slug: "united-kingdom",
    name: "United Kingdom",
    region: "United Kingdom",
    tagline: "Britain's own marque, delivered to estates, golf clubs, resorts and events nationwide.",
    metaDescription: "Electric buggies UK and golf buggies UK, built to order in Britain with nationwide delivery, custom branding and a 3-year warranty. No import, fast UK delivery.",
    hero: null,
    intro:
      "We design, build and finish our electric buggies in Britain, then deliver and commission them across England, Scotland, Wales and Northern Ireland. From sporting estates and championship golf clubs to country-house resorts, holiday parks and large private events, our fleet moves people and equipment quietly across grounds where a petrol engine has no place. As a British marque selling direct, there is no import to manage and no implied middleman, just a bespoke build, fast delivery and support that stays close.",
    sections: [
      { heading: "A British marque, built to order", body: "Every vehicle is built to your specification in Britain rather than pulled from a generic catalogue. You choose the model, seating, canopy, colour, upholstery and branding, and we assemble and finish it to that brief. Because we sell direct as the maker, the price you pay reflects the build and not a chain of resellers. We aim to beat any genuine like-for-like quote." },
      { heading: "Estates, golf clubs and resorts", body: "Country estates use our utility and four-seat models for grounds work, shoot days and guest transport across gravel, grass and rough tracks. Golf clubs run member and visitor fleets finished in club colours and weatherproofed for a full round in changeable British weather. Resorts, hotels and spas use our six- and eight-seat carriages to move guests between reception, rooms, restaurant and grounds without noise or fumes." },
      { heading: "Holiday parks and events", body: "Holiday parks and caravan estates use our fleet for reception transfers, housekeeping rounds and moving guests across large low-speed sites. Event organisers, marquees and festival sites hire and buy our buggies for VIP movement, production logistics and accessible transport. With custom branding applied before delivery, a fleet can carry a venue's identity from the moment it arrives." },
      { heading: "Custom fleet branding", body: "Branding is a core part of what we do, not an afterthought. We apply your livery, logo, colourways and upholstery so a fleet reads as part of the estate, club or brand rather than a hired-in vehicle. Multi-vehicle orders are finished to a consistent house standard, which matters when a row of buggies sits at a clubhouse or resort entrance. Branding is confirmed at quotation and applied in our workshop before the vehicles leave us." },
      { heading: "Fast nationwide delivery and commissioning", body: "As the build happens here, there is no shipping across oceans and no import paperwork. We deliver across the UK mainland and, by arrangement, to Northern Ireland and the islands, with the vehicles commissioned and handed over ready to use. Lead time depends on specification and how busy the workshop is, and we will give you an honest delivery window at quotation. For urgent events we will always tell you what is genuinely achievable rather than over-promise." },
      { heading: "Servicing, warranty and VIP call-out", body: "Every vehicle is covered by a 3-year warranty, and we back it with servicing and parts support UK-wide. Our 24-hour VIP call-out exists for the moments when a fleet simply has to keep running, a tournament weekend, a wedding season or a fully booked resort. We would rather keep a known fleet on the road than chase new sales at the expense of the customers we have. Service intervals and support are arranged around your operating calendar." },
    ],
    useCases: [
      "Country and sporting estate grounds transport",
      "Golf club member and visitor fleets",
      "Resort, hotel and spa guest shuttles",
      "Holiday park and caravan estate transport",
      "Wedding and private event VIP movement",
      "Festival and marquee production logistics",
      "Grounds, gardens and maintenance teams",
      "Accessible transport across large private sites",
    ],
    delivery:
      "Built to order in Britain and delivered nationwide, with no import and no overseas freight. We deliver and commission across England, Scotland, Wales and, by arrangement, Northern Ireland and the islands, handing each vehicle over ready to use and branded to your specification. We will give you an honest delivery window at quotation and tell you what is genuinely achievable for events with tight dates.",
    recommendedModels: ["the-four", "the-six", "the-utility", "the-eight"],
    relatedSectors: ["estates", "golf-clubs", "resorts-hotels"],
    faqs: [
      { q: "How quickly can you deliver in the UK?", a: "Because we build in Britain there is no import or ocean freight, so UK delivery is fast. Exact lead time depends on the specification and the workshop's current order book, and we give you an honest delivery window at quotation. For events with fixed dates we will tell you what is genuinely achievable rather than over-promise." },
      { q: "Where in the UK do you deliver?", a: "We deliver and commission across the UK mainland as standard, covering England, Scotland and Wales. Northern Ireland and the islands are served by arrangement, coordinated with your team. Vehicles are handed over ready to use." },
      { q: "Are the buggies road-legal in the UK?", a: "Our standard vehicles are built for private land and low-speed estate, club, park and resort use. Use on the public road depends on type approval and local classification, so we will advise honestly on what is permitted for your site rather than make a blanket claim. If you need a specific road-legal arrangement, tell us and we will be clear about what is and is not possible." },
      { q: "Can you brand the fleet to our estate, club or brand?", a: "Yes. Custom branding is a core service: we apply your livery, logo, colours and upholstery in our workshop before delivery. Multi-vehicle orders are finished to a consistent house standard, and branding is confirmed at quotation." },
      { q: "What does the warranty and support cover?", a: "Every vehicle carries a 3-year warranty, backed by UK-wide servicing and parts. We also offer a 24-hour VIP call-out for fleets that cannot afford downtime, such as during tournaments, wedding season or peak resort weeks. Service intervals are arranged around your operating calendar." },
      { q: "Can we hire rather than buy?", a: "Buying suits estates, clubs and resorts that want a permanent branded fleet, while hire suits one-off events, peak seasons or trialling a model before committing. Tell us your dates and use, and we will advise which makes sense for you. Both routes use the same British-built vehicles." },
      { q: "How much do they cost?", a: "Pricing is in GBP and depends on configuration, specification and branding, so we confirm it on a tailored quote. Custom builds are quoted to your brief, and we aim to beat any genuine like-for-like quote. There is no import duty or overseas freight to add for UK delivery." },
    ],
  },
  {
    slug: "dubai",
    name: "Dubai",
    region: "United Arab Emirates",
    tagline: "Silent luxury for the Emirates' finest resorts.",
    metaDescription: "British-built electric buggies for Dubai's resorts, hotels and villa communities, branded, climate-specified and delivered fully built from the UK.",
    intro:
      "From beachfront resorts on the Palm to desert-edge developments and gated villa communities, Dubai moves its guests in the heat, and increasingly expects to do so without engine noise or fumes. Our electric buggies bring British-built refinement to Emirati hospitality, specified for high temperatures and finished to your property's standard. We build to your brief in Britain, brand the fleet before it leaves us, and coordinate freight and import so it arrives ready to work.",
    sections: [
      { heading: "Built for hospitality at scale", body: "Five-star resorts and hotels use our six- and eight-seat carriages to shuttle guests between lobby, beach, spa and villa, cooled, quiet and immaculately finished. Branded to your house, a fleet becomes part of the welcome rather than back-of-house transport. Consistent finish across multiple vehicles matters where a line of buggies greets arriving guests. We finish every vehicle to the same house standard before it ships." },
      { heading: "Engineered for the climate", body: "We specify for high ambient temperatures with shaded canopies, ventilated seating options and battery management suited to sustained heat. Sand, glare and dust all inform how a vehicle should be configured for year-round Gulf operation. We will advise the right canopy, seating and protection for where and how you run it. The aim is a fleet that performs as well in August as in January." },
      { heading: "Desert-edge and villa communities", body: "Master-planned communities and desert-edge developments use our fleet for estate management, security patrol and resident transport across large low-speed sites. The four-seat and utility models suit grounds teams, while six- and eight-seat carriages move residents and guests. Quiet running suits residential settings where noise carries in the evening calm. Branding keeps a community fleet coherent across a large development." },
      { heading: "Custom branding for Gulf properties", body: "Branding is central to how we work: we apply your livery, logo, colourways and upholstery in our workshop before the fleet ships. For groups operating several properties, vehicles can be finished to a single brand standard or tailored per resort. This is confirmed at quotation and applied before freight, so nothing needs finishing on arrival. The result reads as part of the property, not a hired-in vehicle." },
      { heading: "Delivery, freight and import to the UAE", body: "We are honest that we operate from Britain and ship to Dubai rather than holding local stock. Vehicles are built and branded in the UK, then freighted with documentation and import coordinated in partnership with regional logistics. We give you a realistic delivery window at quotation that accounts for build and shipping. The intention is a simple, well-managed process that ends with a fleet ready to use." },
      { heading: "Service, support and warranty", body: "Every vehicle carries a 3-year warranty, and we support fleets internationally with parts and guidance. For properties that cannot afford downtime during peak season, our 24-hour VIP call-out and remote support help keep a fleet running. We arrange servicing around your occupancy calendar so work happens at the quietest time. We would rather keep a known fleet operating than leave a customer stranded." },
    ],
    useCases: [
      "Resort and hotel guest transfers",
      "Beach, pool and spa shuttles",
      "Villa community resident transport",
      "Estate management and security patrol",
      "Desert-edge development grounds teams",
      "VIP and event movement at venues",
      "Golf and leisure facility transport",
      "Branded arrival and concierge vehicles",
    ],
    delivery:
      "Delivered worldwide from our UK workshop, fully built and branded, with freight, documentation and import handled in partnership with regional logistics. We are honest that we operate from Britain: we ship to Dubai rather than holding local stock, and we coordinate the process end to end. You receive a realistic delivery window at quotation, and the fleet arrives finished and ready to use.",
    recommendedModels: ["the-six", "the-eight", "the-four"],
    relatedSectors: ["resorts-hotels", "estates"],
    faqs: [
      { q: "Do you have a depot in Dubai?", a: "We build and finish every vehicle in Britain and ship worldwide, and we do not hold local stock in Dubai. We deliver fully built and branded, and coordinate freight and import on your behalf. You will know the realistic delivery window at quotation." },
      { q: "Can the buggies handle the heat?", a: "Yes. We specify shaded canopies, ventilated seating options and battery management suited to sustained high temperatures, with protection against sand and dust. We will advise the right configuration for year-round Gulf operation so the fleet performs reliably in summer as well as winter." },
      { q: "How are import and duties handled?", a: "Vehicles ship from the UK with documentation prepared and import coordinated in partnership with regional logistics. Duties and local charges depend on current UAE regulations, so we will be transparent about what applies to your order. The aim is a managed process with no surprises." },
      { q: "Can you brand them to our resort or group?", a: "Yes, branded fleets are a core service. We apply your livery, upholstery and logo in our workshop, and groups with several properties can have vehicles finished to one standard or tailored per resort. Branding is confirmed at quotation and applied before the fleet ships." },
      { q: "Are they suitable for use on the road?", a: "Our standard vehicles are built for private land and low-speed resort, community and estate use rather than the public highway. Road use depends on local classification, so we will advise honestly on what is permitted for your site. We do not make blanket road-legal claims." },
      { q: "What about servicing and warranty in the UAE?", a: "Every vehicle carries a 3-year warranty, and we support international fleets with parts, remote guidance and a 24-hour VIP call-out for peak periods. Servicing is arranged around your occupancy so work happens during quieter spells. We would rather keep a fleet running than leave it idle." },
      { q: "What currency do you quote in?", a: "Pricing is quoted in GBP, with an AED equivalent provided on request. Pricing depends on size, specification, branding and freight, and is confirmed on a tailored quote. Custom builds are quoted to your brief." },
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
      "Scotland's great sporting estates, championship links and Highland resorts cover vast, beautiful and often rugged ground. Our electric buggies move guests, guns and grounds teams across it quietly, leaving the landscape and the peace undisturbed. As a British marque we build to your brief and, with no import to manage, deliver and commission across the Scottish mainland as part of our UK service, the islands by arrangement.",
    sections: [
      { heading: "Sporting and country estates", body: "From the glens to the lodge, our utility and four-seat models carry parties, equipment and keepers across sporting estates without the intrusion of a petrol engine. Torque and weatherproofing suit gravel, grass and rough hill tracks, and silent running matters on a stalking or shoot day. Estates also use the fleet for grounds work, guest transfers and moving game and kit. Each vehicle can be finished to the estate's own colours." },
      { heading: "Links and Highland golf", body: "We build member and visitor fleets for clubs across Scotland, finished to club colours and specified for a full round in changeable weather. Canopy and enclosed options keep players dry on exposed links, and the vehicles run quietly past neighbouring greens. A consistent branded fleet reads well at the clubhouse and on the first tee. We weatherproof for the conditions a Scottish round can throw up." },
      { heading: "Island and Highland resorts", body: "Resorts from Argyll to the islands use our six- and eight-seat carriages to move guests between lodge, spa and shore. Clean, quiet running suits remote settings where the appeal is the calm of the place. The fleet handles the gradients and surfaces of Highland grounds dependably through the seasons. Branding keeps a resort fleet coherent and on-message from arrival onwards." },
      { heading: "Climate, terrain and weatherproofing", body: "Scottish operation means rain, wind, gradient and rough ground, often in a single day. We specify weatherproofing, canopy or enclosed options and battery management to suit a full day's use in those conditions. The torque of the utility and four-seat models is matched to hill tracks and soft ground. We will advise the configuration that fits your estate, course or resort." },
      { heading: "Custom branding for estates and clubs", body: "Branding is a core service, not an extra: we apply estate or club colours, crests, logos and upholstery in our workshop before delivery. Multi-vehicle orders are finished to a consistent standard, which matters across a large estate or a busy clubhouse. Branding is confirmed at quotation and applied before the fleet leaves us. The fleet then reads as part of the place rather than hired-in." },
      { heading: "Delivery, servicing and warranty", body: "We deliver and commission across mainland Scotland as part of our UK-wide service, with no import and no overseas freight, and serve the islands by arrangement. Every vehicle carries a 3-year warranty, backed by UK servicing and parts. Our 24-hour VIP call-out supports fleets through tournament weekends and peak season. Service intervals are arranged around your sporting and golfing calendar." },
    ],
    useCases: [
      "Sporting and country estate transport",
      "Stalking, shoot day and keepering support",
      "Links and members' golf fleets",
      "Highland and island resort shuttles",
      "Grounds, gardens and maintenance teams",
      "Lodge and guest transfers",
      "Game and equipment movement",
      "Event and gathering transport on estates",
    ],
    delivery:
      "Delivered and commissioned across Scotland, mainland as standard and the islands by arrangement, as part of our UK-wide service. As we build in Britain there is no import or overseas freight, and vehicles are handed over ready to use and branded to your specification. Servicing and support are coordinated with your estate or club team and arranged around your calendar.",
    recommendedModels: ["the-utility", "the-four", "the-eight"],
    relatedSectors: ["estates", "golf-clubs"],
    faqs: [
      { q: "Can they cope with rough estate ground?", a: "Yes. The Utility and Four are specified for gravel, grass, soft ground and rough hill tracks, with the torque and weatherproofing Highland use demands. We will advise the configuration that suits your terrain. Silent running also matters on stalking and shoot days." },
      { q: "Do you deliver to the islands?", a: "Mainland Scotland is part of our standard UK delivery, with no import to manage. The islands are served by arrangement, coordinated with your team and timed around access and ferries. Vehicles are handed over ready to use." },
      { q: "Are they suitable for a full round of golf?", a: "Yes. Range and weatherproofing are specified for a complete round in changeable Scottish conditions, with canopy and enclosed options to keep players dry. Fleets are finished to club colours for a consistent look at the clubhouse." },
      { q: "Are they road-legal in Scotland?", a: "Our standard vehicles are built for private land and low-speed estate, course and resort use rather than the public road. Use on the road depends on type approval and local classification, so we will advise honestly on what is permitted for your site. We do not make blanket road-legal claims." },
      { q: "Can you brand them to our estate or club?", a: "Yes, branding is a core service. We apply estate or club colours, crests, logos and upholstery in our workshop before delivery, finishing multi-vehicle orders to a consistent standard. Branding is confirmed at quotation." },
      { q: "What does the warranty and support include?", a: "Every vehicle carries a 3-year warranty, backed by UK-wide servicing and parts. Our 24-hour VIP call-out supports fleets through tournament weekends and peak season, and service intervals are arranged around your calendar. We would rather keep a known fleet running than leave it idle." },
      { q: "Can we hire for an event or season instead of buying?", a: "Buying suits estates and clubs wanting a permanent branded fleet, while hire suits gatherings, peak weeks or trialling a model first. Tell us your dates and use, and we will advise which makes sense. Both use the same British-built vehicles." },
    ],
  },
  {
    slug: "bermuda",
    name: "Bermuda",
    region: "Atlantic",
    tagline: "Clean island transport for eco-conscious resorts.",
    metaDescription: "Silent, zero-emission electric buggies for Bermuda's eco-conscious resorts and private estates, corrosion-specified for the island and shipped from Britain.",
    intro:
      "Bermuda's measured approach to vehicles and its eco-conscious resorts make quiet, zero-emission electric buggies a natural fit for island hospitality and private estates. We build to your brief in Britain, specify for a humid salt-air setting, and ship to the island finished and ready. We are transparent that we serve Bermuda from the UK rather than a local base, and we coordinate freight and import so the process is straightforward.",
    sections: [
      { heading: "Eco-conscious resorts", body: "Island resorts use our electric carriages to move guests across grounds, to the beach and between cottages, silent and free of local emissions. Quiet, clean running suits a fragile island environment and the calm guests come for. Branded to the resort, a fleet reads as part of the welcome rather than service transport. We finish every vehicle to the same standard before it ships." },
      { heading: "Private estates and residences", body: "Bermuda's private estates use our two- and four-seat models for grounds transport and moving guests across the property. Finished to a residential standard, they suit homes where presentation matters as much as utility. Quiet running matters in close residential settings where sound carries. Each vehicle can be specified and finished to the owner's preference." },
      { heading: "Suited to island conditions", body: "Humidity, salt air and exposure inform how a vehicle should be built for Bermuda. We specify corrosion protection, weatherproofing and battery management appropriate to the setting so the fleet lasts. The aim is a vehicle that copes with the island's climate rather than one merely shipped there. We will advise the right protection for where and how you run it." },
      { heading: "Custom branding for resorts and estates", body: "Branding is a core service: we apply your livery, logo, colourways and upholstery in our workshop before the fleet ships. For resorts this keeps arrival and grounds transport on-message, and for estates it allows a finish in keeping with the property. Branding is confirmed at quotation and applied before freight. Nothing needs finishing once the fleet reaches the island." },
      { heading: "Delivery, freight and import to Bermuda", body: "Vehicles are built and branded in Britain, then shipped to Bermuda with freight and import coordinated on your behalf. We are honest that we serve the island from the UK rather than a local depot. You receive a realistic delivery window at quotation that accounts for build and shipping. The intention is a simple, well-managed process ending in a fleet ready to use." },
      { heading: "Service, support and warranty", body: "Every vehicle carries a 3-year warranty, and we support island fleets with parts, remote guidance and a 24-hour VIP call-out for peak periods. Servicing is arranged around your occupancy so work happens during quieter spells. Corrosion-aware servicing helps a fleet last in the salt-air setting. We would rather keep a known fleet running than leave a customer without transport." },
    ],
    useCases: [
      "Eco-resort guest transport",
      "Beach and cottage shuttles",
      "Private estate grounds transport",
      "Residence and guest movement",
      "Low-emission island mobility",
      "Spa and leisure facility transfers",
      "Branded arrival and concierge vehicles",
      "Grounds and gardens teams",
    ],
    delivery:
      "Built and branded in Britain and shipped to Bermuda, with freight and import coordinated on your behalf. We are transparent that we serve the island from the UK rather than a local base, and we specify for the salt-air setting before the fleet leaves us. You receive a realistic delivery window at quotation, and the fleet arrives finished and ready to use.",
    recommendedModels: ["the-four", "the-six", "the-two"],
    relatedSectors: ["resorts-hotels", "estates"],
    faqs: [
      { q: "Are electric buggies suited to Bermuda?", a: "Very much so. Their silence and lack of local emissions suit the island's eco-conscious resorts and its measured approach to vehicles. We specify corrosion and salt-air protection so the fleet copes with the island setting rather than merely being shipped there." },
      { q: "How are they delivered and imported?", a: "Vehicles are built and branded in the UK, then shipped to Bermuda with freight and import coordinated on your behalf. Duties and local charges depend on current Bermudian regulations, so we will be transparent about what applies. You will know the realistic delivery window at quotation." },
      { q: "Will they cope with the salt air and humidity?", a: "Yes, this is exactly what we specify for. We apply corrosion protection, weatherproofing and battery management suited to a humid, exposed, salt-air setting. We will advise the right protection for where and how the fleet runs." },
      { q: "Can you brand them to our resort or estate?", a: "Yes, branding is a core service. We apply your livery, logo, colours and upholstery in our workshop before the fleet ships, finished to a consistent standard for multi-vehicle orders. Branding is confirmed at quotation." },
      { q: "Are they suitable for use on the road?", a: "Our standard vehicles are built for private land and low-speed resort and estate use rather than the public road. Road use depends on local classification, so we will advise honestly on what is permitted for your site. We do not make blanket road-legal claims." },
      { q: "What about servicing and warranty on the island?", a: "Every vehicle carries a 3-year warranty, backed by parts, remote guidance and a 24-hour VIP call-out for peak periods. Servicing is arranged around your occupancy and is corrosion-aware to suit the setting. We would rather keep a known fleet running than leave it idle." },
      { q: "What currency do you quote in?", a: "Pricing is quoted in GBP, with a local equivalent provided on request. Pricing depends on size, specification, branding and freight, and is confirmed on a tailored quote. Custom builds are quoted to your brief." },
    ],
    currencyNote: "Pricing quoted in GBP; USD equivalent provided on request.",
  },
  {
    slug: "new-york",
    name: "New York",
    region: "United States",
    tagline: "For Hamptons estates, campuses and events.",
    metaDescription: "British-built electric buggies for New York estates, campuses and private events, from the Hamptons to the Hudson Valley, shipped and branded to order.",
    intro:
      "From Hamptons estates and Hudson Valley properties to university campuses and large private events, New York moves people across substantial private grounds. Our British-built electric buggies bring a quiet, refined alternative, configured and branded to the property. We build to your brief in Britain, finish and brand the fleet before it leaves us, and coordinate freight, duties and import to the US East Coast so it arrives ready to use.",
    sections: [
      { heading: "Estates and private residences", body: "Hamptons and Hudson Valley estates use our four- and six-seat carriages for guest transport and grounds management across large, low-speed private land. Quiet running suits residential settings where engine noise would intrude on the calm. Vehicles are finished to a residential standard in keeping with the property. Each can be specified and branded to the owner's preference." },
      { heading: "Campuses and institutions", body: "Universities, corporate campuses and institutions use our shuttles to move people across expansive sites cleanly and quietly. Six- and eight-seat carriages suit higher-volume movement between buildings, while four-seat models suit facilities and security teams. Branding to the institution keeps a fleet consistent across a large site. Clean, silent running suits campuses focused on lowering local emissions." },
      { heading: "Events and hospitality", body: "Large private events, weddings and venues use our fleet for guest and VIP movement, discreet, silent and immaculately presented. Vehicles can carry a venue's or host's branding from the moment they arrive. For seasonal or one-off use, hire can suit better than purchase. We finish every vehicle to a consistent standard so a fleet looks coherent at the entrance." },
      { heading: "Climate and seasons", body: "New York's range from humid summers to cold, snowy winters informs how a vehicle should be configured. We specify weatherproofing, canopy or enclosed options and battery management suited to seasonal use. The aim is a fleet that runs reliably through the property's active months. We will advise the configuration that fits your site and how you use it." },
      { heading: "Custom branding for estates, campuses and venues", body: "Branding is a core service, applied in our workshop before the fleet ships. We finish vehicles in your colours with your logo and upholstery, to a consistent standard across multi-vehicle orders. For institutions and venues this keeps a fleet on-brand across a large site. Branding is confirmed at quotation and applied before freight." },
      { heading: "Delivery, duties and support", body: "Vehicles are built and branded in Britain and shipped to the US East Coast, with freight, duties and import documentation coordinated. We operate from the UK and deliver to New York; we do not imply a local depot we do not have. Every vehicle carries a 3-year warranty, backed by parts, remote guidance and a 24-hour VIP call-out for peak periods. Servicing is arranged around your season." },
    ],
    useCases: [
      "Estate and residence guest transport",
      "Hamptons and Hudson Valley grounds management",
      "University and corporate campus shuttles",
      "Institutional and facilities transport",
      "Wedding and private event VIP movement",
      "Venue and hospitality guest transfers",
      "Security and grounds team support",
      "Branded arrival and concierge vehicles",
    ],
    delivery:
      "Built and branded in Britain and shipped to the US East Coast, with freight, duties and import documentation coordinated. We operate from the UK and deliver to New York; we do not imply a local depot we do not have. You receive a realistic delivery window at quotation, and the fleet arrives finished and ready to use.",
    recommendedModels: ["the-four", "the-six", "the-eight"],
    relatedSectors: ["estates", "festivals-events"],
    faqs: [
      { q: "Can you deliver to the Hamptons or upstate?", a: "Yes. We ship to the US East Coast from Britain, fully built and branded, coordinating freight and import to your property. You will know the realistic delivery window at quotation, accounting for build and shipping. The fleet arrives finished and ready to use." },
      { q: "How are duties and import handled?", a: "Vehicles ship from the UK with documentation prepared and freight, duties and import coordinated. Duties and local charges depend on current US regulations, so we will be transparent about what applies to your order. The aim is a managed process with no surprises." },
      { q: "Are they street-legal in New York?", a: "Our standard vehicles are built for private land and low-speed estate, campus and venue use rather than the public road. Road use depends on local classification, so we will advise honestly on what is permitted for your site. We do not make blanket road-legal claims." },
      { q: "Will they cope with the winters?", a: "We specify weatherproofing, canopy or enclosed options and battery management suited to New York's seasonal range, from humid summers to cold winters. We will advise the configuration that fits how and when you use the fleet. The aim is reliable running through your active months." },
      { q: "Can you brand them to our estate, campus or venue?", a: "Yes, branding is a core service. We apply your colours, logo and upholstery in our workshop before the fleet ships, finished to a consistent standard across multi-vehicle orders. Branding is confirmed at quotation." },
      { q: "Can we hire for an event rather than buy?", a: "Buying suits estates, campuses and venues wanting a permanent branded fleet, while hire suits weddings, seasonal use or one-off events. Tell us your dates and use, and we will advise which makes sense. Both use the same British-built vehicles." },
      { q: "What about servicing and warranty in the US?", a: "Every vehicle carries a 3-year warranty, backed by parts, remote guidance and a 24-hour VIP call-out for peak periods. Servicing is arranged around your season so work happens at quieter times. We would rather keep a known fleet running than leave it idle." },
      { q: "What currency do you quote in?", a: "Pricing is quoted in GBP, with a USD equivalent provided on request. Pricing depends on size, specification, branding and freight, and is confirmed on a tailored quote. Custom builds are quoted to your brief." },
    ],
    currencyNote: "Pricing quoted in GBP; USD equivalent provided on request.",
  },
];

export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug);
