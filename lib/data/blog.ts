/**
 * Guides (cornerstone SEO posts). CMS-authored in Sanity (Portable Text) when
 * connected; these are the seed fallback. Body uses a small block model
 * rendered by the post page, including editorial + interactive blocks.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "pullquote"; text: string; cite?: string }
  | { type: "callout"; tone?: "note" | "tip" | "warn"; title?: string; text: string }
  | { type: "keystats"; items: { value: string; label: string }[] }
  | { type: "comparison"; caption?: string; columns: string[]; rows: { label: string; cells: string[] }[] }
  | { type: "cta"; title: string; text?: string; href: string; label: string; secondaryHref?: string; secondaryLabel?: string }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "poll"; id: string; question: string; options: string[] };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  author: string;
  date: string; // ISO
  readingTime: number; // minutes
  body: Block[];
  related: string[];
  keywords: string[];
}

export const categories = [
  { slug: "buying-guides", name: "Buying Guides" },
  { slug: "regulations", name: "Regulations" },
  { slug: "battery-range", name: "Battery & Range" },
  { slug: "sectors", name: "By Sector" },
];

export const posts: Post[] = [
  {
    slug: "how-much-does-an-electric-golf-buggy-cost-uk",
    title: "How much does an electric golf buggy cost in the UK?",
    excerpt:
      "A clear, honest breakdown of what electric golf buggies cost in the UK in 2026, from entry models to bespoke fleets, and what actually drives the price.",
    category: "Buying Guides",
    categorySlug: "buying-guides",
    author: "The Electric Buggies Team",
    date: "2026-05-12",
    readingTime: 7,
    body: [
      { type: "p", text: "“How much does an electric golf buggy cost?” is the first question almost every buyer asks, and the honest answer is that it depends on configuration, build quality and whether you're buying one vehicle or a branded fleet. This guide sets out the real ranges and what moves the price." },
      { type: "h2", text: "Typical UK price ranges in 2026" },
      { type: "p", text: "A new two-seat electric buggy built to a premium standard starts from around £11,500. Four-seat carriages, the most popular configuration, sit around £15,000, with six- and eight-seat people-movers rising to the low-to-mid £20,000s. Utility models with cargo beds fall in between." },
      { type: "list", items: ["Two-seat: from ~£11,500", "Four-seat: from ~£14,900", "Six-seat: from ~£18,900", "Eight-seat: from ~£23,500", "Utility & cargo: from ~£15,900"] },
      { type: "h2", text: "What actually drives the price" },
      { type: "p", text: "Battery chemistry and capacity (lithium costs more than lead-acid but lasts far longer), seating and platform size, roof and weather protection, wheels, upholstery, and any bespoke livery or branding all move the figure. Fleet orders and ongoing servicing also factor in." },
      { type: "quote", text: "The cheapest buggy is rarely the least expensive to own, lithium, build quality and warranty decide the ten-year cost." },
      { type: "keystats", items: [
        { value: "~£14.9k", label: "Typical four-seat starting point" },
        { value: "8 to 10 yr", label: "Lithium pack service life" },
        { value: "3 year", label: "Standard warranty" },
        { value: "UK-wide", label: "Delivery and support" },
      ] },
      { type: "h2", text: "Lead-acid vs lithium: the cost that matters" },
      { type: "p", text: "Lead-acid batteries are cheaper up front but heavier, slower to charge and shorter-lived. Lithium costs more initially but delivers more range, faster charging and a longer service life, usually the better total cost of ownership for a vehicle used regularly." },
      { type: "comparison", caption: "At a glance", columns: ["Lead-acid", "Lithium"], rows: [
        { label: "Up-front cost", cells: ["Lower", "Higher"] },
        { label: "Charging", cells: ["Slower", "Faster, partial-charge friendly"] },
        { label: "Lifespan", cells: ["3 to 5 years", "8 to 10 years"] },
        { label: "Weight", cells: ["Heavier", "Lighter"] },
        { label: "Best for", cells: ["Light, occasional use", "Regular daily use"] },
      ] },
      { type: "callout", tone: "tip", title: "Tip", text: "If the vehicle will be used most days, lithium almost always wins on cost per year once you account for replacement cycles and charging time." },
      { type: "poll", id: "guide-cost-battery-2026", question: "Which matters most to you when choosing a buggy?", options: ["Lowest up-front price", "Lowest cost over 10 years", "Range and charging speed", "Looks and finish"] },
      { type: "p", text: "The most reliable way to get a real figure for your use is to configure a vehicle and request a tailored quote, the indicative total updates as you choose, and final pricing is confirmed on quotation." },
      { type: "cta", title: "See your real number", text: "Configure a vehicle and the indicative total updates as you choose. Carry the build into a tailored quote.", href: "/configure", label: "Configure a buggy", secondaryHref: "/request-a-quote", secondaryLabel: "Request a quote" },
      { type: "faq", items: [
        { q: "Are electric buggies cheaper to run than petrol?", a: "Yes. Electricity per mile is a fraction of petrol, there are far fewer moving parts to service, and there is no fuel storage or engine maintenance." },
        { q: "Do prices include delivery?", a: "Delivery is quoted per destination. We deliver and commission UK-wide and internationally; your quote sets it out clearly." },
        { q: "Can I spread the cost?", a: "Fleet and finance options are available for business buyers. Ask the team when you request your quote." },
      ] },
    ],
    related: ["are-golf-buggies-road-legal-uk", "lithium-vs-lead-acid-range-lifespan"],
    keywords: ["electric golf buggy cost UK", "electric golf buggy price", "how much electric golf cart"],
  },
  {
    slug: "are-golf-buggies-road-legal-uk",
    title: "Are golf buggies road-legal in the UK?",
    excerpt:
      "What the law actually says about driving an electric buggy on UK roads, private land, licensing, and what 'street-legal' really requires.",
    category: "Regulations",
    categorySlug: "regulations",
    author: "The Electric Buggies Team",
    date: "2026-05-06",
    readingTime: 6,
    body: [
      { type: "p", text: "It's one of the most common questions we're asked: can you drive an electric buggy on the road in the UK? The short answer is that most buggies are designed for private land, but road use is possible with the right specification and registration." },
      { type: "h2", text: "On private land" },
      { type: "p", text: "On private land, an estate, golf course, resort, holiday park or event site, a buggy needs no registration, road tax or licence, which is exactly where the vast majority operate." },
      { type: "h2", text: "On public roads" },
      { type: "p", text: "To use public roads legally, a buggy must meet specific requirements: lighting, indicators, mirrors, a horn, and registration with the DVLA, plus insurance and a valid driving licence. This is achievable on suitably specified vehicles but is the exception rather than the rule." },
      { type: "quote", text: "Most of our clients never need road registration, but where they do, we advise honestly on what's required." },
      { type: "p", text: "If your use involves crossing or travelling on a public road, tell us at enquiry and we'll set out exactly what specification and paperwork would be needed for your situation." },
    ],
    related: ["how-much-does-an-electric-golf-buggy-cost-uk", "choosing-electric-utility-vehicle-country-estate"],
    keywords: ["are golf buggies road legal UK", "street-legal golf buggy UK", "drive golf buggy on road"],
  },
  {
    slug: "choosing-electric-utility-vehicle-country-estate",
    title: "Choosing an electric utility vehicle for a country estate",
    excerpt:
      "Payload, terrain, range and finish, how to choose the right electric utility vehicle for the working side of a country estate.",
    category: "By Sector",
    categorySlug: "sectors",
    author: "The Electric Buggies Team",
    date: "2026-04-28",
    readingTime: 6,
    body: [
      { type: "p", text: "Every estate runs a working fleet that guests never see, and increasingly it's electric. Here's how to choose a utility vehicle that earns its keep across grounds, gardens and tracks." },
      { type: "h2", text: "Start with payload and terrain" },
      { type: "p", text: "Be realistic about loads, tools, timber, feed, equipment, and the ground you cross. A tipping cargo bed, adequate payload and the torque for grass and gravel matter more than top speed." },
      { type: "h2", text: "Range for a full working day" },
      { type: "p", text: "Look for the range to cover a full day of stop-start work on one overnight charge. Lithium makes this comfortably achievable and avoids the downtime of slow lead-acid charging." },
      { type: "h2", text: "Finish to the estate standard" },
      { type: "p", text: "A working vehicle that shares the estate's standard of finish quietly raises the whole operation. It should be quiet enough to run at dawn without disturbing guests or wildlife." },
    ],
    related: ["how-much-does-an-electric-golf-buggy-cost-uk", "electric-buggies-resorts-hotels-buyers-guide"],
    keywords: ["electric utility vehicle estate", "grounds keeping vehicle", "estate utility buggy"],
  },
  {
    slug: "electric-buggies-resorts-hotels-buyers-guide",
    title: "Buying electric buggies for a resort: a buyer's guide",
    excerpt:
      "Which models, how many seats, and what they cost: a buyer's guide to choosing the right electric buggies for a resort or hotel before you order.",
    category: "Buying Guides",
    categorySlug: "buying-guides",
    author: "The Electric Buggies Team",
    date: "2026-04-20",
    readingTime: 7,
    body: [
      { type: "p", text: "Choosing the right buggies for a resort comes down to a few decisions: how many seats, which models for which jobs, lithium or lead-acid, and what to budget. This buyer's guide focuses on getting the specification right before you order. For running a fleet once it arrives, see our companion operations guide." },
      { type: "h2", text: "Which model and how many seats?" },
      { type: "p", text: "Match capacity to the journey. Six- and eight-seat carriages suit larger sites moving groups between lobby, rooms, spa and grounds; four-seaters suit smaller properties and VIP transfers. Most resorts settle on a small mixed fleet, a few passenger carriages for guests and one or two utility models for luggage, housekeeping and grounds." },
      { type: "comparison", caption: "Choosing by job", columns: ["Passenger carriage", "Utility model"], rows: [
        { label: "Primary use", cells: ["Guest transfers, events", "Grounds, housekeeping, luggage"] },
        { label: "Seats", cells: ["4 to 8", "2 plus cargo bed"] },
        { label: "Finish", cells: ["Premium, branded", "Hard-wearing"] },
        { label: "Priority", cells: ["Comfort and image", "Payload and durability"] },
      ] },
      { type: "h2", text: "Lithium or lead-acid for a resort fleet?" },
      { type: "p", text: "For vehicles in regular guest service, lithium is almost always the better choice. It charges faster, tolerates partial charging between transfers, and lasts far longer than lead-acid, which usually makes it cheaper over the life of the fleet despite the higher up-front cost." },
      { type: "h2", text: "What should a resort budget?" },
      { type: "p", text: "As a starting point, four-seat carriages begin from around £14,900, with six- and eight-seat people-movers from £18,900 and £23,500, and utility models from £15,900. Branding, upholstery and roof options move the figure. We aim to beat any genuine like-for-like quote, and final pricing is confirmed on quotation." },
      { type: "keystats", items: [
        { value: "from £14.9k", label: "Four-seat carriage" },
        { value: "from £18.9k", label: "Six-seat people-mover" },
        { value: "Lithium", label: "Best for daily guest use" },
        { value: "3 year", label: "Standard warranty" },
      ] },
      { type: "h2", text: "What to look for before you order" },
      { type: "p", text: "Beyond seats and price, weigh the finish, the branding options, the battery and the after-sales support, warranty, servicing and call-out, since a resort fleet has to look the part and stay reliable in front of guests. The clearest way to see a real number for your property is to configure a vehicle and request a tailored quote." },
      { type: "cta", title: "Specify your resort fleet", text: "Configure a vehicle to see an indicative price, then carry the build into a tailored quote for your property.", href: "/configure", label: "Configure a buggy", secondaryHref: "/request-a-quote", secondaryLabel: "Request a quote" },
      { type: "faq", items: [
        { q: "How many buggies does a resort need?", a: "It depends on grounds size, guest numbers and how you split passenger and utility duties. Most resorts run a small mixed fleet; we can help you size it when you request a quote." },
        { q: "What do resort buggies cost?", a: "Four-seat carriages start from around £14,900, rising to the low-to-mid £20,000s for larger people-movers. Branding and options move the figure, with final pricing confirmed on quotation." },
        { q: "Once we have bought, how do we run the fleet?", a: "Our companion operations guide covers routing, charging, branding upkeep, servicing and the guest experience day to day." },
      ] },
    ],
    related: ["electric-buggies-for-hotels-and-resorts", "how-much-does-an-electric-golf-buggy-cost-uk"],
    keywords: ["resort golf carts", "buying resort buggies", "electric buggies for hotels"],
  },
  {
    slug: "lithium-vs-lead-acid-range-lifespan",
    title: "Lithium vs lead-acid: range & lifespan explained",
    excerpt:
      "The single most important decision in buying an electric buggy, battery chemistry, explained in plain terms.",
    category: "Battery & Range",
    categorySlug: "battery-range",
    author: "The Electric Buggies Team",
    date: "2026-04-10",
    readingTime: 5,
    body: [
      { type: "p", text: "Battery chemistry is the decision that most affects how an electric buggy performs and what it costs to own. Here's lithium versus lead-acid, without the jargon." },
      { type: "h2", text: "Range and weight" },
      { type: "p", text: "Lithium batteries are lighter and deliver more usable range from the same weight, which also improves handling and efficiency. Lead-acid is heavier and gives less usable capacity." },
      { type: "h2", text: "Charging and lifespan" },
      { type: "p", text: "Lithium charges faster, tolerates partial charging, and lasts far more cycles, often years longer in regular use. Lead-acid is slower to charge and wears faster, especially if run down regularly." },
      { type: "quote", text: "Lithium costs more up front and usually less over the life of the vehicle." },
      { type: "p", text: "For anything used regularly, a resort fleet, a working estate vehicle, a daily golf buggy, lithium is almost always the better total-cost-of-ownership choice." },
    ],
    related: ["how-much-does-an-electric-golf-buggy-cost-uk", "choosing-electric-utility-vehicle-country-estate"],
    keywords: ["lithium vs lead acid golf buggy", "golf buggy battery range", "lithium golf buggy"],
  },
  {
    slug: "hiring-electric-buggies-for-events",
    title: "Hiring electric buggies for events: a practical guide",
    excerpt: "What to think about when hiring electric buggies for a wedding, festival or corporate event, from fleet size to drivers and delivery.",
    category: "Buying Guides", categorySlug: "buying-guides", author: "The Electric Buggies Team", date: "2026-05-18", readingTime: 6,
    body: [
      { type: "p", text: "Hiring is the fastest way to put a clean, quiet fleet on the ground for an event, without owning vehicles you only need for the dates. Here is how to plan it." },
      { type: "h2", text: "Work out what you actually need to move" },
      { type: "p", text: "Separate passenger transport (guests, VIPs, artists) from operations (crew, equipment, site). They often need different vehicles, and counting both tells you the fleet size." },
      { type: "h2", text: "Drivers: provided or your own" },
      { type: "p", text: "Decide early whether you want trained drivers supplied or will crew the fleet yourself. It affects cost and logistics, and we can do either." },
      { type: "h2", text: "Book the dates, plan the charging" },
      { type: "p", text: "Lock in dates as early as you can for peak season, and plan overnight charging on site so vehicles are ready each morning." },
      { type: "quote", text: "The best event fleets are sized for the peak, not the average." },
    ],
    related: ["electric-buggies-resorts-hotels-buyers-guide", "how-much-does-an-electric-golf-buggy-cost-uk"],
    keywords: ["hire electric buggies events", "event buggy hire UK", "festival buggy hire"],
  },
  {
    slug: "airport-prm-transport-accessible-vehicles",
    title: "Airport PRM transport: choosing accessible vehicles",
    excerpt: "Passengers of Reduced Mobility deserve dignified, reliable assistance. What to look for in accessible, wheelchair-friendly airside vehicles.",
    category: "By Sector", categorySlug: "sectors", author: "The Electric Buggies Team", date: "2026-05-16", readingTime: 6,
    body: [
      { type: "p", text: "Assisting Passengers of Reduced Mobility well is both a duty and a mark of a good operation. The vehicles matter as much as the people." },
      { type: "h2", text: "What accessible airside vehicles need" },
      { type: "list", items: ["Wheelchair access with a ramp or lift", "Assisted, dignified boarding", "Secure wheelchair positioning", "Comfortable, clear space for a companion"] },
      { type: "h2", text: "Why electric suits the airside" },
      { type: "p", text: "Near-silent, zero local emissions and easy to operate, electric vehicles are well suited to enclosed and busy airside environments where air quality and noise count." },
      { type: "h2", text: "Reliability through the day" },
      { type: "p", text: "PRM demand is constant, so vehicles must run all day with charging planned around shift patterns. We specify fleets for exactly that." },
    ],
    related: ["choosing-electric-utility-vehicle-country-estate", "electric-buggies-resorts-hotels-buyers-guide"],
    keywords: ["airport PRM transport", "accessible airport vehicles", "wheelchair accessible buggy"],
  },
  {
    slug: "shuttle-solutions-for-venues",
    title: "Shuttle solutions for venues: branded or pay-per-ride",
    excerpt: "Two ways to run a guest shuttle at your venue, a branded complimentary service or a low-cost pay-per-ride model, and how to choose.",
    category: "By Sector", categorySlug: "sectors", author: "The Electric Buggies Team", date: "2026-05-14", readingTime: 5,
    body: [
      { type: "p", text: "A well-run shuttle quietly lifts the whole guest experience. There are two common ways to fund and run one." },
      { type: "h2", text: "Branded, complimentary" },
      { type: "p", text: "The shuttle is part of the welcome, finished in your livery and included for guests. It suits resorts and venues where the experience is the priority." },
      { type: "h2", text: "Pay-per-ride" },
      { type: "p", text: "Guests pay a small fare per ride, so the service runs at minimal cost to you while still feeling premium. It suits high-footfall sites." },
      { type: "h2", text: "Drivers and accessibility" },
      { type: "p", text: "Either model can be crewed by us or your team, and designed around accessibility with wheelchair-friendly vehicles." },
    ],
    related: ["hiring-electric-buggies-for-events", "electric-buggies-resorts-hotels-buyers-guide"],
    keywords: ["venue shuttle service", "resort shuttle buggy", "guest shuttle solution"],
  },
  {
    slug: "electric-vs-petrol-buggies-running-cost",
    title: "Electric vs petrol buggies: the running-cost case",
    excerpt: "Fuel, maintenance, noise and emissions, why electric buggies usually win on total cost of ownership for fleets that work hard.",
    category: "Battery & Range", categorySlug: "battery-range", author: "The Electric Buggies Team", date: "2026-05-10", readingTime: 6,
    body: [
      { type: "p", text: "For a fleet that runs every day, the purchase price is only part of the story. Running cost is where electric pulls ahead." },
      { type: "h2", text: "Fuel and energy" },
      { type: "p", text: "Charging from the grid costs a fraction of petrol, and prices are far steadier. Across a busy fleet that difference adds up quickly." },
      { type: "h2", text: "Maintenance" },
      { type: "p", text: "Electric drivetrains have far fewer moving parts than petrol engines, so servicing is lighter, cheaper and more predictable." },
      { type: "h2", text: "Noise and emissions" },
      { type: "p", text: "Silent running and zero local emissions are not just nice to have. They let you operate early, indoors and near guests without complaint." },
      { type: "quote", text: "Cheaper to run, quieter to live with, and ready for where the rules are heading." },
    ],
    related: ["lithium-vs-lead-acid-range-lifespan", "how-much-does-an-electric-golf-buggy-cost-uk"],
    keywords: ["electric vs petrol golf buggy", "buggy running costs", "fleet total cost of ownership"],
  },
  {
    slug: "electric-buggies-for-hotels-and-resorts",
    title: "Running a resort buggy fleet: an operations guide",
    excerpt:
      "Routing, charging, branding upkeep, servicing and the guest experience: a day-to-day operations guide to running an electric buggy fleet at a hotel or resort.",
    category: "By Sector",
    categorySlug: "sectors",
    author: "The Electric Buggies Team",
    date: "2026-05-28",
    readingTime: 8,
    body: [
      { type: "p", text: "Once a resort fleet is on the ground, the work is keeping it running smoothly: vehicles where guests need them, charged and ready, looking the part, and never out of action at the wrong moment. This operations guide covers the day-to-day, routing, charging, branding upkeep, servicing and the guest experience. For choosing models, seats and budget in the first place, see our companion buyer's guide." },
      { type: "h2", text: "Routing and deployment" },
      { type: "p", text: "Map the journeys guests actually take, reception to rooms, spa, restaurants and grounds, and position vehicles where demand peaks. Keep luggage and housekeeping runs on a separate rhythm from guest transfers so the two do not compete. Knowing how many vehicles you need running at peak, rather than on average, is what keeps waiting times down." },
      { type: "keystats", items: [
        { value: "Peak-sized", label: "Plan for busy periods, not averages" },
        { value: "Silent", label: "Run early or late, near rooms" },
        { value: "24/7", label: "Service plan and call-out, worldwide" },
        { value: "Branded", label: "Kept consistent across the fleet" },
      ] },
      { type: "h2", text: "Charging around the day" },
      { type: "p", text: "Plan charging around quiet hours so vehicles are full each morning, and use top-up charging in lulls for buggies in constant service. Lithium suits this well, as it tolerates partial charging between transfers without harm. A simple charging routine, and a designated store, keeps the fleet ready without staff having to think about it." },
      { type: "callout", tone: "tip", title: "Tip", text: "Standardise on one platform and battery type across the fleet where you can. It simplifies charging, spares and driver training, and keeps the look consistent." },
      { type: "pullquote", text: "Guests remember how they were moved. A silent, branded arrival sets the tone before they reach the door.", cite: "On hospitality first impressions" },
      { type: "h2", text: "Keeping the branding sharp" },
      { type: "p", text: "A branded fleet only looks deliberate if it stays clean and consistent. Build a regular wash and inspection into the routine, attend to scuffs and worn trim promptly, and hold to the original specification when you add vehicles so the fleet still reads as one. The livery is part of the guest experience and worth maintaining." },
      { type: "h2", text: "Servicing and keeping vehicles ready" },
      { type: "p", text: "Downtime in front of guests is the real cost, so prevention matters. A short daily check, tyres, brakes, charge and a visual once-over, catches most issues early, and a service plan keeps the formal work on schedule. A 24-hour VIP call-out means a fault never strands a transfer. International resorts should confirm delivery, commissioning and call-out cover for their location." },
      { type: "poll", id: "guide-resorts-priority-2026", question: "Running a resort fleet, what is hardest to get right?", options: ["Vehicles ready at peak", "Charging around the day", "Keeping branding sharp", "Avoiding downtime in front of guests"] },
      { type: "h2", text: "The guest experience" },
      { type: "p", text: "Every detail of how a fleet is run reaches the guest: a clean, quiet, branded vehicle that arrives when expected, a driver who knows the route, and a transfer that feels effortless. Run well, the fleet becomes part of why guests remember the stay, and a reason they return." },
      { type: "cta", title: "Plan how you run the fleet", text: "Tell us how and where you operate and we will help you plan charging, servicing and call-out so the fleet stays ready for guests.", href: "/sectors/resorts-hotels", label: "Explore resorts and hotels", secondaryHref: "/services/service-plan", secondaryLabel: "See service plans" },
      { type: "faq", items: [
        { q: "How do we keep buggies ready at peak times?", a: "Size the fleet for the busy periods rather than the average, position vehicles where demand peaks, and keep a charging routine so they are always full when needed." },
        { q: "How do we keep a branded fleet looking sharp?", a: "Build a regular wash and inspection into the routine, attend to scuffs and trim promptly, and hold to the original specification when you add vehicles so the look stays consistent." },
        { q: "Do you deliver and service internationally?", a: "Yes. We deliver and commission worldwide from the UK, with a service plan that includes call-out cover. Timescales are confirmed on quotation." },
      ] },
    ],
    related: ["electric-buggies-resorts-hotels-buyers-guide", "shuttle-solutions-for-venues"],
    keywords: ["resort buggy fleet operations", "running hotel buggies", "hotel guest transport buggy", "branded resort buggy fleet"],
  },
  {
    slug: "golf-buggy-insurance-uk",
    title: "Golf buggy insurance in the UK: what you need to know",
    excerpt:
      "Do you need insurance for a golf buggy? A clear guide to cover on private land and public roads, the types of policy, what affects premiums, and fleet cover.",
    category: "Regulations",
    categorySlug: "regulations",
    author: "The Electric Buggies Team",
    date: "2026-05-27",
    readingTime: 6,
    body: [
      { type: "p", text: "Golf buggy insurance is not legally required on private land, but it is widely recommended, and it becomes a legal requirement the moment a buggy is used on a public road. The practical answer for most owners is that some form of cover is worth having for theft, accidental damage and liability, even where the law does not compel it. This guide sets out where cover is needed, the types of policy available, and what tends to affect the premium." },
      { type: "h2", text: "Do you need insurance for a golf buggy?" },
      { type: "p", text: "On private land, an estate, golf course, resort or holiday park, there is no legal obligation to insure a buggy, in the way there is for a car on the road. That said, most owners choose to, because a buggy is a valuable asset that can be stolen, damaged or involved in an incident with a third party. On a public road, insurance is a legal requirement alongside registration and the correct vehicle specification." },
      { type: "keystats", items: [
        { value: "Private land", label: "No legal insurance requirement" },
        { value: "Public road", label: "Insurance legally required" },
        { value: "Theft + damage", label: "Common reasons owners insure" },
        { value: "Fleet cover", label: "Available for business use" },
      ] },
      { type: "h2", text: "Private land versus public road" },
      { type: "p", text: "The distinction that matters most is where the buggy is used. Standard buggies are built for private-land use, where they can be driven without registration, road tax or a licence. Cover here is optional but sensible. Using a buggy on or across a public road is a different matter: that requires a suitably specified, registered vehicle and a road-use insurance policy. If any part of your route touches a public road, treat insurance as essential and tell us at enquiry so the specification is right." },
      { type: "callout", tone: "warn", title: "Important", text: "Do not assume a private-land policy covers public-road use, or the reverse. The two are priced and underwritten differently. Confirm exactly what your intended use needs before you rely on a policy." },
      { type: "h2", text: "Types of cover available" },
      { type: "p", text: "Policies are usually built from a few familiar components, and you can combine them to suit how the buggy is used and where it is kept." },
      { type: "list", items: ["Theft: cover against the vehicle being stolen, which matters for buggies stored on open sites", "Accidental damage: repair or replacement after collision, tipping or mishandling", "Public liability: cover if the buggy injures someone or damages property", "Fleet cover: a single policy across several vehicles for a business or estate", "Road-use cover: required where a buggy is registered and used on public roads"] },
      { type: "h2", text: "What affects the premium?" },
      { type: "p", text: "Premiums vary with use and value rather than following a single fixed rate. The vehicle's value, where it is stored overnight, how it is used (private leisure versus commercial hire), the number of vehicles, and the claims history all play a part. A buggy kept in a secure store on a managed estate is generally viewed differently from one left out on an open public-access site. Specialist providers will price each case on its own facts. [CONFIRM: typical premium range for a single buggy] and [CONFIRM: whether secure storage discounts are common] are best confirmed with an insurer rather than quoted as fixed figures." },
      { type: "comparison", caption: "Cover at a glance", columns: ["Private land", "Public road"], rows: [
        { label: "Legally required", cells: ["No", "Yes"] },
        { label: "Registration needed", cells: ["No", "Yes"] },
        { label: "Typical reasons to insure", cells: ["Theft, damage, liability", "Legal requirement plus the above"] },
        { label: "Who usually buys", cells: ["Owners protecting an asset", "Anyone using the road legally"] },
      ] },
      { type: "h2", text: "Business and fleet cover" },
      { type: "p", text: "Resorts, clubs, estates and hire operators usually insure a fleet under one policy rather than vehicle by vehicle. Fleet cover can be simpler to administer and is often arranged alongside a maintenance and call-out plan, so that a vehicle off the road is repaired and back in service quickly. If you run vehicles commercially, mention the use and the fleet size when you arrange cover, as commercial and hire use is rated differently from private leisure use." },
      { type: "quote", text: "Cover is widely available for buggies on both private land and the road. The right policy follows from being clear about where and how the vehicle is used." },
      { type: "h2", text: "Making a claim" },
      { type: "p", text: "Keep a record of the vehicle's identification details, photographs of its condition, and proof of where it is stored, as these help if you ever need to claim. Report incidents promptly and follow the insurer's process. [CONFIRM: typical claims excess and process] varies between providers, so check the policy wording when you take cover out." },
      { type: "poll", id: "guide-insurance-priority-2026", question: "What would you most want a buggy policy to cover?", options: ["Theft from site", "Accidental damage", "Public liability", "A whole fleet at once"] },
      { type: "p", text: "We can point you towards the right specification for your use, including where a vehicle needs to be road-ready, and help you plan ownership so that cover, servicing and call-out fit together. Tell us how and where you will use the buggy and we will set out what is sensible." },
      { type: "cta", title: "Plan ownership properly", text: "From cover to servicing, we help you plan how a buggy is owned and looked after. Request a tailored quote and we will set it out clearly.", href: "/ownership", label: "Explore ownership", secondaryHref: "/request-a-quote", secondaryLabel: "Request a quote" },
      { type: "faq", items: [
        { q: "Do I legally need insurance for a golf buggy on private land?", a: "No. There is no legal requirement to insure a buggy used solely on private land, though many owners choose to for theft, damage and liability cover." },
        { q: "Is insurance required to drive a buggy on the road?", a: "Yes. Public-road use requires a suitably specified, registered vehicle and a road-use insurance policy, alongside the other legal requirements." },
        { q: "Can I insure a whole fleet under one policy?", a: "Yes. Fleet cover is widely available for businesses, estates and hire operators, and is often arranged alongside a servicing and call-out plan." },
      ] },
    ],
    related: ["are-golf-buggies-road-legal-uk", "how-much-does-an-electric-golf-buggy-cost-uk"],
    keywords: ["golf buggy insurance", "golf buggy insurance uk", "electric buggy insurance"],
  },
  {
    slug: "custom-fleet-branding-golf-buggies",
    title: "Custom fleet branding for electric and golf buggies",
    excerpt:
      "How branded golf buggies are made, from livery and wraps to upholstery and logos, and why a consistent custom fleet matters for resorts, clubs and estates.",
    category: "Buying Guides",
    categorySlug: "buying-guides",
    author: "The Electric Buggies Team",
    date: "2026-05-28",
    readingTime: 6,
    body: [
      { type: "p", text: "A branded fleet turns transport into part of the experience. Bodywork colour, a crest on the doors, upholstery and roof style can all be specified to match a property or brand, so that every vehicle looks deliberate rather than borrowed. This guide explains what can be branded, why a consistent custom fleet matters, and how the process works from design to delivery." },
      { type: "h2", text: "What can be branded on a buggy?" },
      { type: "p", text: "Almost every visible surface can carry your identity. The result is a vehicle that reads as part of your estate or brand from the first glance." },
      { type: "list", items: ["Bodywork colour matched to your palette", "A crest or logo on the doors, bonnet or rear", "Full or partial vinyl wraps for graphics and detail", "Upholstery colour and finish", "Roof style and colour", "Wheels and trim to complete the look"] },
      { type: "keystats", items: [
        { value: "Bespoke", label: "Built to your specification" },
        { value: "Fleet-wide", label: "Consistent across every vehicle" },
        { value: "Colour-matched", label: "To your brand palette" },
        { value: "3 year", label: "Warranty on the build" },
      ] },
      { type: "h2", text: "Why branded fleets matter for resorts, clubs and estates" },
      { type: "p", text: "For a resort, a club or an estate, the fleet is part of the welcome. A silent, branded arrival sets the tone before a guest reaches the door, and a consistent livery across every vehicle signals care and quality. A branded fleet also reinforces ownership and reduces the feeling of borrowed or hired equipment, which matters where presentation is the point. Guests remember how they were moved, and a fleet finished to the house standard quietly raises the whole operation." },
      { type: "quote", text: "A configured, branded fleet looks deliberate rather than borrowed, and it reinforces the experience at every transfer." },
      { type: "h2", text: "How the branding process works" },
      { type: "p", text: "Branding runs alongside the bespoke build rather than being added afterwards, so the finish is integrated and durable. The steps are straightforward." },
      { type: "list", items: ["Design: we take your colours, logo and any brand guidelines and propose a livery", "Approve: you review the specification and finish before anything is built", "Build: the vehicles are produced to the agreed specification as a matched set", "Deliver: the fleet arrives commissioned and ready, finished to the same standard"] },
      { type: "callout", tone: "tip", title: "Tip", text: "Standardise colour, upholstery and trim across the fleet from the outset. A matched set is far easier to extend later than trying to align vehicles bought at different times." },
      { type: "h2", text: "Durability and finish" },
      { type: "p", text: "A branded vehicle has to keep looking the part through daily use and the weather. Bodywork finishes and wraps are chosen to wear well outdoors, and because branding is specified as part of the build it sits properly rather than looking applied. Where a fleet grows over time, keeping to the original specification means later vehicles match the first." },
      { type: "h2", text: "Keeping a fleet consistent" },
      { type: "p", text: "Consistency is what makes a branded fleet read as one. Holding to a single platform, colour and trim across vehicles keeps the look uniform, simplifies servicing and spares, and makes the whole operation feel considered. We hold your specification so that repeat and additional orders match what you already run." },
      { type: "poll", id: "guide-branding-priority-2026", question: "What matters most to you in a branded fleet?", options: ["Exact colour match", "Logo and crest placement", "Consistency across vehicles", "Premium upholstery and trim"] },
      { type: "p", text: "The clearest way to see your brand on a vehicle is to configure one. The Branding step lets you place your logo and see it applied before you order, and you can carry the build into a bespoke conversation for a full fleet." },
      { type: "cta", title: "See your brand on a buggy", text: "Configure a vehicle and place your logo on the bodywork, then talk to us about a matched, branded fleet built to your specification.", href: "/bespoke", label: "Explore bespoke builds", secondaryHref: "/configure", secondaryLabel: "Configure a buggy" },
      { type: "faq", items: [
        { q: "Can you match our exact brand colour?", a: "Yes. Bodywork can be colour-matched to your palette, and upholstery, roof and trim specified to suit, so the fleet matches your brand." },
        { q: "Can we add our logo to the buggies?", a: "Yes. A crest or logo can be placed on the bodywork, and the configurator's Branding step lets you see it applied before you order." },
        { q: "Will later vehicles match our existing fleet?", a: "Yes. We hold your specification so that additional and repeat orders are built to the same colour, trim and finish as your current vehicles." },
      ] },
    ],
    related: ["choosing-electric-utility-vehicle-country-estate", "electric-buggies-resorts-hotels-buyers-guide"],
    keywords: ["branded golf buggies", "custom fleet branding", "custom golf buggies"],
  },
  {
    slug: "golf-buggy-servicing-warranty-call-out",
    title: "Servicing, warranty and call-out for electric buggies",
    excerpt:
      "What buggy servicing involves, how the 3-year warranty and 24-hour VIP call-out work, plus battery care and parts, so your buggy or fleet keeps running.",
    category: "Regulations",
    categorySlug: "regulations",
    author: "The Electric Buggies Team",
    date: "2026-05-26",
    readingTime: 6,
    body: [
      { type: "p", text: "Looking after an electric buggy comes down to three things: regular servicing to keep it running well, a warranty that covers the build, and call-out support for when something needs attention quickly. Our vehicles carry a 3-year warranty and a 24-hour VIP call-out, and a service plan ties the rest together. This guide explains what each part covers and how to keep a single buggy or a whole fleet on the road." },
      { type: "h2", text: "What does servicing involve?" },
      { type: "p", text: "A service keeps the vehicle safe, efficient and presentable. It typically covers the battery and charging system, brakes, tyres, steering and suspension, lights and electrics, and the bodywork and trim. Electric drivetrains have far fewer moving parts than petrol engines, so servicing is lighter and more predictable, but regular checks still matter, especially for a vehicle in daily use." },
      { type: "keystats", items: [
        { value: "3 year", label: "Standard warranty" },
        { value: "24-hour", label: "VIP call-out" },
        { value: "Bespoke", label: "Service plans for fleets" },
        { value: "UK-wide", label: "Support and delivery" },
      ] },
      { type: "h2", text: "How often should a buggy be serviced?" },
      { type: "p", text: "Service intervals depend on how hard the vehicle works. A buggy used most days on a resort or estate needs attention more often than one used occasionally. As a general guide, an annual service suits light use, with more frequent checks for heavy or commercial use. [CONFIRM: recommended service interval for standard models] and [CONFIRM: interval for high-use fleet vehicles] are best confirmed for your specific vehicles and usage." },
      { type: "callout", tone: "tip", title: "Tip", text: "A short daily check, tyres, brakes, charge level and a visual once-over, catches most issues early and keeps a fleet reliable between formal services." },
      { type: "h2", text: "What the 3-year warranty covers" },
      { type: "p", text: "Our vehicles come with a 3-year warranty covering the build and its components against defects in normal use. As with any warranty, there are conditions: it covers faults rather than wear-and-tear items or damage from misuse, and it relies on the vehicle being maintained as recommended. [CONFIRM: exact warranty exclusions] and [CONFIRM: battery warranty terms and any separate coverage period] are set out in the warranty documentation supplied with the vehicle." },
      { type: "comparison", caption: "Support at a glance", columns: ["Covered", "Arranged separately"], rows: [
        { label: "Build defects", cells: ["Warranty", "Not applicable"] },
        { label: "Routine servicing", cells: ["Service plan", "Per visit"] },
        { label: "Urgent faults", cells: ["24-hour VIP call-out", "Not applicable"] },
        { label: "Wear items and consumables", cells: ["As needed", "Replaced as needed"] },
      ] },
      { type: "h2", text: "The 24-hour VIP call-out" },
      { type: "p", text: "Some uses cannot wait for a routine appointment. A fault on a resort or at an event needs a fast response so a vehicle off the road does not strand a guest transfer. Our 24-hour VIP call-out is built for exactly that, getting attention to a vehicle quickly so the operation keeps moving. For fleets, this sits alongside the service plan as part of keeping vehicles always ready." },
      { type: "h2", text: "Battery care and parts" },
      { type: "p", text: "The battery is the heart of an electric buggy, and a little care extends its life. Charge regularly rather than running fully flat, keep terminals and connections clean, and store the vehicle charged where you can. Lithium packs tolerate partial charging well and last far longer than lead-acid in regular use. For repairs, using correct parts keeps the vehicle reliable and protects the warranty, so source parts and work through us or an approved route." },
      { type: "quote", text: "A maintained buggy holds its value, runs reliably and stays warranted. The plan matters as much as the vehicle." },
      { type: "h2", text: "Keeping a fleet running" },
      { type: "p", text: "For a fleet, downtime is the real cost, so the aim is to prevent faults and fix them fast when they happen. A service plan across the fleet, a simple daily check routine, and call-out cover together mean vehicles stay ready. Standardising on one platform and battery type also simplifies spares and servicing across the whole fleet." },
      { type: "poll", id: "guide-servicing-priority-2026", question: "What matters most to you in keeping a buggy running?", options: ["A clear service plan", "Fast call-out for faults", "Long battery life", "Genuine parts and repairs"] },
      { type: "p", text: "We can put a service plan in place that fits how you use your vehicles, from a single buggy to a managed fleet, with the warranty and call-out built in. Tell us what you run and we will set out a plan that keeps it reliable." },
      { type: "cta", title: "Keep your buggy running", text: "Put a service plan in place that fits your vehicles, with the warranty and 24-hour call-out built in. We will tailor it to how you use them.", href: "/services/service-plan", label: "See service plans", secondaryHref: "/ownership", secondaryLabel: "Explore ownership" },
      { type: "faq", items: [
        { q: "How long is the warranty?", a: "Our vehicles come with a 3-year warranty covering the build and components against defects in normal use, with the full terms set out in the documentation supplied with the vehicle." },
        { q: "What is the 24-hour VIP call-out?", a: "It is a fast-response service for urgent faults, so a vehicle off the road is attended to quickly and your operation keeps moving. It sits alongside the service plan for fleets." },
        { q: "How do I look after the battery?", a: "Charge regularly rather than running fully flat, keep connections clean, and store the vehicle charged. Lithium packs in particular last far longer when looked after this way." },
      ] },
    ],
    related: ["lithium-vs-lead-acid-range-lifespan", "electric-vs-petrol-buggies-running-cost"],
    keywords: ["golf buggy servicing", "golf buggy warranty", "golf buggy repair"],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const postsByCategory = (catSlug: string) => posts.filter((p) => p.categorySlug === catSlug);
