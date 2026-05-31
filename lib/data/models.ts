import { MODEL_NAMES } from "../model-names";

/**
 * Model lineup, seed content. CMS-sourced from Sanity `model` documents when
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
  sections?: { heading: string; body: string }[];
}

export const models: Model[] = [
  {
    slug: "the-two",
    name: MODEL_NAMES["the-two"],
    category: "2-seater",
    categoryLabel: "Two-Seater",
    tagline: "Intimate, effortless, quietly assured.",
    summary: "A two-seat electric companion for grounds, greens and private drives, compact in footprint, generous in finish.",
    body: [
      "The Two distils the marque to its essence: two seats, a whisper-quiet drivetrain and a finish that belongs at the front of a country house.",
      "Compact enough for the tightest paths, composed enough for the longest day, the natural choice for the estate manager and the discerning private owner.",
    ],
    specs: { seats: "2", range: "Up to 50 miles", battery: "5.0 kWh lithium", topSpeed: "25 mph", dimensions: "2.45 × 1.20 × 1.78 m", charge: "6–8 hrs (13A)" },
    basePrice: 11500,
    plate: "#9aa0a6",
    image: "/img/vehicles/two.webp",
    highlights: ["2 seats", "Lithium", "Compact"],
    recommendedSectors: ["estates", "golf-clubs", "film-tv"],
    sections: [
      {
        heading: "The Two at a glance",
        body: "The Two is a 2 seater electric golf buggy built for the moments when one or two people need to move quietly and quickly across private ground. It pairs a compact footprint with the finish you would expect from a British marque, so it looks as composed parked at a country house as it does on a fairway. If you want a single golf buggy that handles daily estate runs without fuss, this is the natural starting point. It is the smallest model in the range and, for many owners, the most useful.",
      },
      {
        heading: "Who the Two is for",
        body: "Estate managers, private owners and golf clubs choose the Two when the job is personal transport rather than group shuttling. It suits a head greenkeeper crossing the course at first light, a country-house owner moving between buildings, or a resort needing a discreet runabout for staff. Film and television productions value it for the same reasons: it is quiet, it is small, and it does not draw attention on a set. Anywhere a golf cart would normally be pressed into service, the Two does the work with considerably more polish.",
      },
      {
        heading: "Range, battery and charging",
        body: "The Two is fully electric, drawing on a lithium battery that gives an impressive range on a single charge. For most owners a full charge covers a comfortable day's use across the grounds, with capacity to spare. It charges from a standard 13A domestic supply, so there is no special installation to arrange before the vehicle earns its keep. We will confirm the exact range for your configuration, since terrain, load and accessories all play a part.",
      },
      {
        heading: "Performance and terrain",
        body: "The drivetrain is tuned for the surfaces an estate actually presents: gravel drives, mown grass, gentle slopes and paved paths. Power is delivered smoothly rather than abruptly, which keeps the ride settled and the vehicle quiet near guests. The compact wheelbase makes light work of tight turns and narrow service routes where a larger buggy would struggle. It is composed at speed and unobtrusive at a crawl, which is exactly what close-quarters work demands.",
      },
      {
        heading: "Comfort and premium features",
        body: "Despite its size, the Two carries the same standard of finish as the larger carriages. Seating is properly upholstered and the cabin is laid out for ease rather than economy. A canopy provides weather protection without enclosing the occupants, so the open, airy feel is preserved through the seasons. Every surface is chosen to wear well and look right at the front of a premium property.",
      },
      {
        heading: "Customisation and fleet branding",
        body: "The Two can be specified in a wide choice of colours, with upholstery selected to match a house style or a brand. Estates and resorts running several vehicles can carry a consistent livery across the fleet, with a logo applied where it sits naturally. The configurator lets you see your choices before you commit, so the finished vehicle is exactly the one you pictured. Branded fleets are part of what we do as standard, not an afterthought.",
      },
      {
        heading: "Price and what is included",
        body: "The Two starts from £11,500, with the final figure shaped by the options and finish you choose. The from-price covers the vehicle ready to use, with the lithium battery and charging equipment included rather than listed as extras. We will set out clearly what your configuration includes before anything is agreed, so there are no surprises. We aim to beat any genuine like-for-like quote.",
      },
      {
        heading: "Warranty, servicing and where you can drive it",
        body: "Every Two is backed by a 3-year warranty and our 24-hour VIP call-out, with support across the UK and worldwide. As standard the vehicle is intended for private land such as estates, resorts, golf courses and private grounds. Certain configurations can be made road legal subject to type approval, which we are happy to discuss for your site. You can read more in our road-legal guide before deciding how you intend to use the vehicle.",
      },
    ],
  },
  {
    slug: "the-four",
    name: MODEL_NAMES["the-four"],
    category: "4-seater",
    categoryLabel: "Four-Seater",
    tagline: "The defining model. Composed for four.",
    summary: "Our signature four-seat carriage, the natural choice for resorts, clubs and estates that carry guests in comfort.",
    body: [
      "The Four is the heart of the range: four seats arranged for conversation, a forward canopy that shelters without enclosing, and a ride tuned for gravel, grass and tarmac alike.",
      "It is the model most clients configure first, equally at home on a hotel forecourt or touring the boundary of a private estate.",
    ],
    specs: { seats: "4", range: "Up to 56 miles", battery: "7.5 kWh lithium", topSpeed: "25 mph", dimensions: "3.10 × 1.27 × 1.90 m", charge: "7–9 hrs (13A)" },
    basePrice: 14900,
    plate: "#5b6066",
    image: "/img/vehicles/four.webp",
    highlights: ["4 seats", "Canopy", "All-terrain"],
    recommendedSectors: ["resorts-hotels", "estates", "golf-clubs", "holiday-parks"],
    sections: [
      {
        heading: "The Four at a glance",
        body: "The Four is our defining model, a 4 seater electric golf buggy arranged so that four people can travel together in genuine comfort. Two rows face forward under a sheltering canopy, with a ride tuned to handle gravel, grass and tarmac in the same outing. It is the model most clients configure first, and the one that suits the widest range of grounds. If you are choosing a single golf buggy to do most of the work, the Four is the answer.",
      },
      {
        heading: "Who the Four is for",
        body: "Resorts, hotels, estates, golf clubs and holiday parks all gravitate to the Four because it carries guests rather than just staff. A hotel can run guests from the forecourt to the spa, a golf club can pair players and bags, and an estate can tour visitors along the boundary in one composed vehicle. Event organisers use it to move small groups around a site without the noise of a combustion buggy. Wherever a traditional golf cart falls short on finish or seating, the Four steps up.",
      },
      {
        heading: "Range, battery and charging",
        body: "The Four is fully electric, powered by a lithium battery sized to give an impressive range across a working day. For most operators a single charge is ready for a full day's use, ferrying guests without an anxious eye on the gauge. Charging is from a standard 13A supply, so the vehicle slots into existing facilities overnight with no special groundwork. The exact range is confirmed for your configuration, as canopy, load and accessories all influence the figure.",
      },
      {
        heading: "Performance and terrain",
        body: "The Four is set up to move confidently across the mixed surfaces a property presents in a single round: loose gravel, damp grass, gentle slopes and tarmac paths. Power arrives smoothly so guests are never jostled, and the electric drivetrain stays quiet near terraces and greens. The wheelbase strikes a balance between stability and manoeuvrability, planted on the move yet easy to place on narrow routes. It is the kind of drive that reassures a passenger and flatters a driver.",
      },
      {
        heading: "Comfort and premium features",
        body: "The cabin is finished to carry paying guests, with properly bolstered seating across both rows and a layout that makes conversation easy. The forward canopy shelters every occupant from sun and shower without closing in the open feel that makes these vehicles a pleasure to ride. Materials are selected for how they look on day one and how they hold up after a season of use. The result feels considered throughout rather than merely equipped.",
      },
      {
        heading: "Customisation and fleet branding",
        body: "The Four can be specified in a broad palette of colours, with upholstery and trim chosen to sit alongside an existing house style. Operators running several vehicles can apply a single livery across the fleet, with branding and a logo placed where it reads cleanly. The configurator shows each decision in context before you order, so the finished vehicle matches the brief precisely. Branded fleets are a core part of the service, built in from the first conversation.",
      },
      {
        heading: "Price and what is included",
        body: "The Four starts from £14,900, with the final price guided by the finish and options you select. That from-price delivers the vehicle ready to work, with the lithium battery and charging equipment included as part of the package. We set out exactly what your configuration covers before you commit, so the figure is clear and complete. We aim to beat any genuine like-for-like quote.",
      },
      {
        heading: "Warranty, servicing and where you can drive it",
        body: "Every Four is covered by a 3-year warranty and backed by our 24-hour VIP call-out, with support reaching across the UK and worldwide. As standard the vehicle is designed for private land, including estates, resorts, golf courses and private grounds. Certain configurations can be made road legal subject to type approval, which we will talk through for your particular site. Our road-legal guide explains the detail if you are weighing up how the vehicle will be used.",
      },
    ],
  },
  {
    slug: "the-six",
    name: MODEL_NAMES["the-six"],
    category: "6-seater",
    categoryLabel: "Six-Seater",
    tagline: "Six aboard, in unbroken comfort.",
    summary: "A six-seat carriage for resorts and events that move groups with grace rather than haste.",
    body: [
      "Two rows, six seats and a measured wheelbase make The Six the considered choice where guests travel together, between a hotel and its grounds, or across a festival site at dusk.",
      "The longer platform brings a planted, reassuring ride, while the raised canopy keeps every passenger sheltered.",
    ],
    specs: { seats: "6", range: "Up to 53 miles", battery: "10.5 kWh lithium", topSpeed: "25 mph", dimensions: "3.95 × 1.27 × 1.95 m", charge: "8–10 hrs (13A)" },
    basePrice: 18900,
    plate: "#27364f",
    image: "/fleet/six-blue.png",
    highlights: ["6 seats", "Two rows", "Raised canopy"],
    recommendedSectors: ["resorts-hotels", "festivals-events", "holiday-parks"],
    sections: [
      {
        heading: "The Six at a glance",
        body: "The Six is a 6 seater electric golf buggy built for the times when a whole group needs to travel together. Two generous rows and a measured wheelbase make it a graceful way to move six people across a resort, a festival site or a set of grounds. It carries the calm, planted feel of a larger vehicle while keeping the manners of a refined golf buggy. When the brief is groups rather than individuals, the Six is where the range opens up.",
      },
      {
        heading: "Who the Six is for",
        body: "Resorts, hotels, holiday parks and event organisers choose the Six when they regularly move parties rather than pairs. A hotel can take a family from reception to the grounds in one trip, and a holiday park can run guests between facilities without a second run. At festivals and events it shuttles teams and guests across a site at dusk, quietly and without fumes. Where a standard golf cart would need two journeys, the Six does it in one.",
      },
      {
        heading: "Range, battery and charging",
        body: "The Six is fully electric, with a lithium battery scaled to its larger body to deliver an impressive range. For most operators a single charge covers a full day's use moving groups around a site, with margin for the busiest periods. It charges from a standard 13A supply, so an overnight top-up readies it for the next day without special infrastructure. We confirm the exact range for your configuration, since passenger numbers, terrain and accessories all bear on it.",
      },
      {
        heading: "Performance and terrain",
        body: "The longer platform gives the Six a reassuring, settled ride that suits gravel drives, grass, gentle slopes and paved paths alike. With a full complement aboard the electric drivetrain stays smooth and quiet, which matters most when you are passing close to guests. The extended wheelbase keeps the vehicle stable through turns and over uneven ground, holding its line where a shorter buggy might fidget. It is built to feel composed when fully loaded, not just when empty.",
      },
      {
        heading: "Comfort and premium features",
        body: "Both rows are properly upholstered and spaced so that six passengers travel without crowding. The raised canopy sits high enough to shelter everyone aboard while preserving the open outlook that makes the ride enjoyable. Finishes are chosen to look right on a hotel forecourt and to withstand the wear of constant guest use. Nothing about the cabin feels like a compromise made to fit more people in.",
      },
      {
        heading: "Customisation and fleet branding",
        body: "The Six can be ordered in a wide range of colours, with upholstery and trim matched to a property or a brand identity. Operators running a fleet can carry one consistent livery across every vehicle, with a logo applied where it presents well on the larger bodywork. The configurator lets you preview each choice before ordering, so the delivered vehicle is exactly as specified. Branded fleets are part of the standard service, not a special request.",
      },
      {
        heading: "Price and what is included",
        body: "The Six starts from £18,900, with the final figure set by the finish and options you choose. The from-price provides the vehicle ready for service, with the lithium battery and charging equipment included rather than added on. We make clear what your configuration includes before anything is agreed, so the price is transparent. We aim to beat any genuine like-for-like quote.",
      },
      {
        heading: "Warranty, servicing and where you can drive it",
        body: "Every Six comes with a 3-year warranty and our 24-hour VIP call-out, supported across the UK and worldwide. As standard the vehicle is intended for private land such as estates, resorts, golf courses and private grounds. Certain configurations can be made road legal subject to type approval, which we are glad to discuss for your venue. Our road-legal guide covers the detail if road use is part of your plan.",
      },
    ],
  },
  {
    slug: "the-eight",
    name: MODEL_NAMES["the-eight"],
    category: "8-seater",
    categoryLabel: "Eight-Seater",
    tagline: "The grand tourer of the grounds.",
    summary: "Eight seats of shuttle capability for the largest estates, resorts and events, without sacrificing restraint.",
    body: [
      "When the brief is to move a full party in one quiet pass, The Eight answers. Three forward-facing rows, a long sheltered canopy and a substantial battery give it true shuttle credentials.",
      "Specified by the grandest of clients, championship courses, country-house hotels and the production sites that move crews between sets.",
    ],
    specs: { seats: "8", range: "Up to 50 miles", battery: "13.5 kWh lithium", topSpeed: "25 mph", dimensions: "4.60 × 1.50 × 2.00 m", charge: "9–11 hrs (13A)" },
    basePrice: 23500,
    plate: "#23433a",
    image: "/img/vehicles/eight.webp",
    highlights: ["8 seats", "Long canopy", "Big battery"],
    recommendedSectors: ["resorts-hotels", "golf-clubs", "festivals-events", "film-tv"],
    sections: [
      {
        heading: "The Eight at a glance",
        body: "The Eight is our largest model, an 8 seater electric golf buggy with true shuttle credentials. Three forward-facing rows sit under a long sheltering canopy, carried by a substantial battery sized for the work. It moves a full party in a single quiet pass, which makes it the grand tourer of the grounds. When the job is to shift people in numbers without losing composure, the Eight is the model that answers.",
      },
      {
        heading: "Who the Eight is for",
        body: "The largest estates, championship golf clubs, country-house hotels and major events specify the Eight when capacity is the priority. A resort can move a tour group from car park to entrance in one trip, and a course can shuttle a full party between the clubhouse and the first tee. Film and television productions value it for moving crews between sets quietly and in a single run. Where several trips with a smaller golf cart would slow operations, the Eight keeps everything moving.",
      },
      {
        heading: "Range, battery and charging",
        body: "The Eight is fully electric, with a substantial lithium battery that delivers an impressive range despite the larger body and load. For most operators a single charge supports a full day's use shuttling parties across a site, with reserve for peak periods. It charges from a standard 13A supply, so an overnight cycle returns it ready for service without special installation. The exact range is confirmed for your configuration, since occupancy, terrain and accessories all affect it.",
      },
      {
        heading: "Performance and terrain",
        body: "The long platform gives the Eight a planted, unhurried ride that copes with gravel, grass, gentle slopes and paved paths even when fully laden. The electric drivetrain stays quiet and smooth at capacity, which is exactly what you want when passing close to guests and greens. The extended wheelbase keeps the vehicle stable through turns and over changing surfaces, holding its composure under load. It is engineered to feel substantial and sure-footed rather than ponderous.",
      },
      {
        heading: "Comfort and premium features",
        body: "All three rows are properly upholstered and arranged so that eight passengers travel in comfort rather than merely fitting aboard. The long canopy shelters every seat from sun and rain while keeping the open, airy character that makes the ride pleasant. Finishes are chosen to suit the grandest settings and to endure the heavy use a shuttle vehicle attracts. The cabin reads as a considered whole, not a stretched compromise.",
      },
      {
        heading: "Customisation and fleet branding",
        body: "The Eight can be specified across a wide choice of colours, with upholstery and trim matched to a property or a brand. The generous bodywork gives ample room for a logo and livery, so a branded fleet looks deliberate and well presented. The configurator shows each decision in context before you order, so the delivered vehicle matches the brief exactly. Branded fleets are a standard part of the service for operators running multiple vehicles.",
      },
      {
        heading: "Price and what is included",
        body: "The Eight starts from £23,500, with the final figure shaped by the finish and options you select. The from-price covers the vehicle ready for shuttle duty, with the substantial lithium battery and charging equipment included as part of the package. We set out clearly what your configuration includes before anything is agreed, so the price is fully transparent. We aim to beat any genuine like-for-like quote.",
      },
      {
        heading: "Warranty, servicing and where you can drive it",
        body: "Every Eight is backed by a 3-year warranty and our 24-hour VIP call-out, with support across the UK and worldwide. As standard the vehicle is intended for private land such as estates, resorts, golf courses and private grounds. Certain configurations can be made road legal subject to type approval, which we are happy to talk through for your site. Our road-legal guide sets out the detail if road use forms part of your operation.",
      },
    ],
  },
  {
    slug: "the-utility",
    name: MODEL_NAMES["the-utility"],
    category: "utility",
    categoryLabel: "Utility & Cargo",
    tagline: "A quiet workhorse for the grounds.",
    summary: "A working electric vehicle with a tipping cargo bed, for the grounds team that maintains the estate behind the scenes.",
    body: [
      "Every estate runs a fleet that guests never see. The Utility serves that quiet, essential role: a load bed, a tipping mechanism and the torque to haul across the grounds in near silence.",
      "It shares the marque's finish and drivetrain, so the working vehicle is held to the same standard as the carriage at the front door.",
    ],
    specs: { seats: "2", range: "Up to 43 miles", battery: "9.0 kWh lithium", topSpeed: "22 mph", dimensions: "3.40 × 1.30 × 1.92 m", charge: "8–10 hrs (13A)" },
    basePrice: 15900,
    plate: "#3a424b",
    image: "/img/vehicles/utility.webp",
    highlights: ["Cargo bed", "Payload", "Rugged"],
    recommendedSectors: ["estates", "holiday-parks", "golf-clubs"],
    sections: [
      {
        heading: "The Utility at a glance",
        body: "The Utility is an electric utility vehicle built for the work that keeps an estate running behind the scenes. A tipping cargo bed, real payload and the torque to haul across the grounds make it the quiet workhorse of the range. It shares the marque's drivetrain and finish, so the working vehicle is held to the same standard as the carriages at the front door. When the task is moving tools, materials and loads rather than guests, the Utility is the model for the job.",
      },
      {
        heading: "Who the Utility is for",
        body: "Grounds teams on estates, holiday parks and golf clubs rely on the Utility for the maintenance that guests never see. It carries machinery to a far corner of the grounds, clears cuttings, and ferries supplies between buildings without the noise of a petrol vehicle. A golf club can move course furniture and materials between holes, and a park can keep its grounds in order quietly through the day. Where a working golf cart would run short on payload or finish, the Utility covers the gap.",
      },
      {
        heading: "Range, battery and charging",
        body: "The Utility is fully electric, with a lithium battery sized for a working shift rather than a short errand. For most teams a single charge gives an impressive range across a full day's use moving loads around the grounds. It charges from a standard 13A supply, so it returns to the yard and tops up overnight without special infrastructure. We confirm the exact range for your configuration, since payload, terrain and accessories all influence the figure.",
      },
      {
        heading: "Performance and terrain",
        body: "The Utility is set up to work the rougher edges of a property: loose gravel, wet grass, service tracks and gentle slopes, often with a load aboard. The torque-led drivetrain pulls steadily under weight while staying quiet enough to use near guests and accommodation. The chassis is built to take the knocks of daily work and keep its composure over uneven ground. It is rugged where it needs to be and refined where it counts.",
      },
      {
        heading: "Comfort and premium features",
        body: "Although it is a working vehicle, the Utility does not feel like a stripped-out one. The cab is properly finished and the seating is built for long shifts rather than short hops. A canopy provides weather protection so the crew can work through the seasons in reasonable comfort. The tipping bed and load area are engineered for everyday practicality, making the routine jobs quicker and easier.",
      },
      {
        heading: "Customisation and fleet branding",
        body: "The Utility can be specified in a range of colours, with the finish chosen to sit alongside the rest of an estate fleet. Grounds teams running several vehicles can carry one consistent livery, with a logo applied where it presents cleanly on the bodywork. The configurator lets you preview your choices before ordering, so the working vehicle arrives exactly as specified. Branded fleets are part of the standard service, even for the vehicles that stay out of sight.",
      },
      {
        heading: "Price and what is included",
        body: "The Utility starts from £15,900, with the final figure set by the finish and options you choose. The from-price provides the vehicle ready to work, with the lithium battery, charging equipment and tipping cargo bed included as part of the package. We make clear what your configuration covers before anything is agreed, so the price is transparent. We aim to beat any genuine like-for-like quote.",
      },
      {
        heading: "Warranty, servicing and where you can drive it",
        body: "Every Utility is covered by a 3-year warranty and our 24-hour VIP call-out, with support across the UK and worldwide. As standard the vehicle is intended for private land such as estates, resorts, golf courses and private grounds. Certain configurations can be made road legal subject to type approval, which we are happy to discuss for your site. Our road-legal guide explains the detail if you intend to use the vehicle beyond private ground.",
      },
    ],
  },
  {
    slug: "bespoke",
    name: "Bespoke",
    category: "bespoke",
    categoryLabel: "Made to Order",
    tagline: "Specified entirely around you.",
    summary: "When the range is a starting point rather than an answer, commission a vehicle built entirely to your brief.",
    body: [
      "Beyond the configured range lies the bespoke commission: liveries matched to a house, bodywork reworked for a film, accessibility conversions, branded fleets and security specifications.",
      "We begin with a conversation, not a catalogue. Tell us what the vehicle must do, and where, and we will engineer the answer.",
    ],
    specs: { seats: "To specification", range: "To specification", battery: "To specification", topSpeed: "To specification", dimensions: "To specification", charge: "To specification" },
    basePrice: 0,
    plate: "#0a0a0b",
    image: "/img/vehicles/shuttle.webp",
    highlights: ["Any livery", "Film & TV", "Fleet"],
    recommendedSectors: ["film-tv", "estates", "resorts-hotels"],
    sections: [
      {
        heading: "The bespoke commission at a glance",
        body: "A bespoke commission begins where the configured range ends, with a vehicle built entirely around your brief. It might be an electric golf buggy reworked for a particular house, an accessibility conversion, a security specification or a fleet of golf carts in a single livery. Seat count, bodywork and finish are decided by what the vehicle must do rather than by a fixed model. We start with a conversation, not a catalogue, and engineer the answer from there.",
      },
      {
        heading: "Who a bespoke build is for",
        body: "Bespoke suits clients whose needs sit beyond the standard range: film and television productions, the grandest estates, and resorts and hotels with a distinct identity to express. A production might need bodywork reworked for a scene, an estate might want a vehicle matched precisely to a house, and a resort might commission a fleet that carries its brand without compromise. Event organisers come to us for one-off vehicles that have to make a specific impression. Wherever an off-the-shelf golf buggy cannot meet the brief, a commission can.",
      },
      {
        heading: "What can be customised",
        body: "Almost every element of the vehicle is open to specification, from seat count and layout to bodywork, livery and interior trim. Liveries can be matched to a house or a brand, upholstery chosen to a precise colour, and accessibility or security features engineered in from the start. Branded fleets can be built to a single design across multiple vehicles so they read as one. If a requirement is unusual, the right approach is to tell us what the vehicle must do and where it must do it.",
      },
      {
        heading: "Range, battery and charging",
        body: "Like the rest of the range, a bespoke vehicle is fully electric and built around a lithium battery sized to the task you set it. Whether the brief calls for an impressive range for long days or a compact build for tight sites, the powertrain is specified to suit. Charging is arranged to fit your facilities, typically from a standard supply unless your requirements call for something different. The exact range and charging detail are confirmed for your build once the specification is settled.",
      },
      {
        heading: "Comfort and finish",
        body: "A commission is finished to whatever standard the brief demands, with the same care that defines the marque. Seating, canopy and weather protection are specified to the role, from a luxurious guest carriage to a hard-working production vehicle. Materials are chosen for how they look and how they last in the setting you describe. The result is a vehicle that feels purpose-made because it is.",
      },
      {
        heading: "The process and lead time",
        body: "We begin with a conversation about what the vehicle must do, and where, before any drawings are made. From there we agree a specification, confirm the detail and build the vehicle to order as a one-off or a matched fleet. Because each commission is made to order, lead time is set by the complexity of the brief and is confirmed before you commit. We keep you informed through the build so there are no surprises at handover.",
      },
      {
        heading: "Price and what is included",
        body: "A bespoke commission is priced on request, since the figure depends entirely on the specification you choose. We provide a clear quotation once the brief is agreed, setting out exactly what the build includes before any commitment. The lithium battery and charging equipment are part of every vehicle we make, alongside the bespoke elements you have specified. We aim to beat any genuine like-for-like quote.",
      },
      {
        heading: "Warranty, servicing and where you can drive it",
        body: "Every commission is backed by a 3-year warranty and our 24-hour VIP call-out, with support across the UK and worldwide. As standard the vehicles are intended for private land such as estates, resorts, golf courses and private grounds. Certain configurations can be made road legal subject to type approval, which we will engineer into the brief where it is required. Our road-legal guide sets out the detail if road use is part of your commission.",
      },
    ],
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
