/**
 * Keyword-led SEO landing pages. CMS-editable via the Sanity `landingPage`
 * schema; seeded here. Each targets a head term and links internally to the
 * range and sectors. Model references use the live slugs (the-two ... the-utility).
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
    metaTitle: "Electric Buggies | Bespoke & British",
    metaDescription:
      "Premium electric buggies built to order in Britain. Two to eight seats, bespoke finishes, custom fleet branding, worldwide delivery. Request a tailored quote.",
    eyebrow: "Electric Buggies",
    title: "Electric buggies, built to a higher standard.",
    intro:
      "We build premium electric buggies for the places that judge every detail: estates, resorts, golf clubs and events. Each one is made to order in Britain, beautifully finished to your specification, and supported across the UK and worldwide. From a compact two-seater to an eight-seat shuttle and a hard-working utility model, the range is designed to move people and kit quietly and cleanly.",
    sections: [
      { heading: "Bespoke, not off-the-shelf", body: "Choose your model, colour, roof, wheels and upholstery, or commission something entirely your own. Every electric buggy is built to order, so a fleet arrives consistent, on-brand and finished to a standard a guest notices. The only real limit is your imagination." },
      { heading: "Quiet, clean and capable", body: "Fully electric drivetrains run near-silently with zero local emissions, ideal for sites where guests are never far away. Lithium batteries give an impressive range and charge from a standard supply, ready for a full day's use. The result moves people and equipment without the noise and fumes of a petrol engine." },
      { heading: "The range, from two to eight seats", body: "The Two suits private drives and the tightest paths; The Four is the all-rounder most clients configure first; The Six and The Eight carry larger groups and shuttle guests; The Utility takes on grounds and cargo. Whatever the use, there is a configuration to match." },
      { heading: "Custom fleet branding", body: "Custom colours, livery, upholstery and your logo are a core part of what we do, so a buggy becomes part of your welcome rather than just a vehicle. Branded fleets stay consistent across every unit, applied through the configurator and confirmed at quotation." },
      { heading: "Built in Britain, delivered worldwide", body: "We build to order in Britain and deliver across the UK and internationally, coordinating freight and import where needed. Whether you need one vehicle or a large fleet, delivery and commissioning are handled so it arrives ready to use." },
      { heading: "Supported long after delivery", body: "Every electric buggy comes with a 3-year warranty as standard and access to our 24-hour VIP call-out, with servicing and support across the UK and worldwide. We aim to beat any genuine like-for-like quote, and to look after you long after the vehicle arrives." },
    ],
    recommendedModels: ["the-two", "the-four", "the-six"],
    relatedSectors: ["estates", "resorts-hotels", "golf-clubs"],
  },
  "electric-golf-buggies": {
    slug: "electric-golf-buggies",
    metaTitle: "Electric Golf Buggies for Clubs & Members",
    metaDescription:
      "Premium electric golf buggies for clubs and members, finished to club colours with full-round range and worldwide support. Configure a fleet and request a quote.",
    eyebrow: "Electric Golf Buggies",
    title: "A golf fleet worthy of the course.",
    intro:
      "The buggy is the most-used and most-visible vehicle on any course, so it should reflect the club rather than let it down. Our electric golf buggies give members a refined ride and give green-keeping teams a quiet, capable workhorse. Finished to your club's colours and built for a full round in changeable weather, they raise the standard of the member experience.",
    sections: [
      { heading: "Member-grade comfort", body: "Two- and four-seat carriages with the range to complete a round and the finish to enjoy it, in your club's colours. The ride is quiet and composed across fairway, path and the short stretches of road within a resort's grounds. A golf buggy this well finished becomes part of how members judge the club." },
      { heading: "Course operations and green-keeping", body: "The Utility supports green-keeping, marshalling and course maintenance without scarring turf or breaking the quiet. Electric torque handles slopes and soft ground, and there is no diesel noise to intrude on play. The same marque finish runs behind the scenes as out on the course." },
      { heading: "Fleet pricing and club livery", body: "We work with clubs on full fleets, bespoke liveries and fleet terms, so every buggy carries the club identity consistently. Select Business on the quote form and we will build a fleet quote around your numbers, and we aim to beat any genuine like-for-like quote." },
      { heading: "Range, charging and a full day's play", body: "Lithium batteries are specified for a complete round and a busy day, and charge overnight from a standard supply. We confirm the right range and charging setup for your course and how hard the fleet works, so buggies are ready when members are." },
      { heading: "Where they can be driven", body: "Golf buggies are designed for the course and private club grounds. Use on public roads depends on local classification and type approval, and we will advise honestly on what is permitted for your site. Our road-legal guide sets out the position in plain terms." },
      { heading: "Warranty and 24-hour support", body: "Every electric golf buggy comes with a 3-year warranty and access to our 24-hour VIP call-out, with servicing and parts available across the UK and worldwide. For a club that depends on its fleet daily, uptime is everything, and that is what the support is built around." },
    ],
    recommendedModels: ["the-two", "the-four", "the-utility"],
    relatedSectors: ["golf-clubs", "estates"],
  },
  "electric-utility-vehicles": {
    slug: "electric-utility-vehicles",
    metaTitle: "Electric Utility Vehicles for Grounds & Estates",
    metaDescription:
      "Electric utility vehicles with cargo beds for estates, farms, parks and clubs. High torque, near-silent, estate-grade build. Configure yours and request a quote.",
    eyebrow: "Electric Utility Vehicles",
    title: "The working vehicle, held to the same standard.",
    intro:
      "Every estate, farm and club runs a fleet that guests never see, and it needs to be dependable rather than disruptive. Our electric utility vehicles do that essential work in near silence, with the torque to haul and the finish you would expect of the marque. From grounds maintenance to deliveries and patrol, the Utility keeps a site running cleanly.",
    sections: [
      { heading: "Built to work", body: "A practical cargo bed, high torque and a robust platform make light of grounds, maintenance and deliveries across gravel, grass and rough tracks. The electric utility vehicle is specified for real daily work, not occasional use. It is the model that quietly keeps an estate or course moving." },
      { heading: "Clean and quiet, all day", body: "Run from dawn without diesel noise or fumes, ideal for sites where guests, members or residents are never far away. Lithium power gives the range for a full working day and charges overnight from a standard supply. Electric torque also handles slopes and soft ground with ease." },
      { heading: "Estate-grade finish", body: "The working vehicle shares the marque's drivetrain and finish, so standards never drop behind the scenes. It can be specified and branded to match the rest of your fleet, keeping everything consistent. A utility vehicle that looks the part is still welcome where guests can see it." },
      { heading: "Who it is for", body: "Country estates, farms, golf clubs, holiday parks, resorts and work sites use the Utility for transport, grounds work, maintenance and security patrol. Wherever there is large private ground to cover and loads to move, it earns its place. We will help you specify the right configuration for the task." },
      { heading: "Towing, payload and terrain", body: "The platform is built for carrying and for the kinds of ground estates and farms cover daily. We confirm payload, towing and the right setup for your terrain and loads, so the vehicle suits the work rather than the other way round. Write to us with what you need to move." },
      { heading: "Warranty and worldwide support", body: "Every electric utility vehicle comes with a 3-year warranty and access to our 24-hour VIP call-out, with servicing and parts across the UK and worldwide. Built to order in Britain and delivered wherever you are, it is supported for the long term, and we aim to beat any genuine like-for-like quote." },
    ],
    recommendedModels: ["the-utility", "the-two", "the-four"],
    relatedSectors: ["estates", "holiday-parks", "golf-clubs"],
  },
  "event-festival-buggies": {
    slug: "event-festival-buggies",
    metaTitle: "Event & Festival Buggies | Electric & Quiet",
    metaDescription:
      "Electric buggies for festivals and events: artist and guest transport, site logistics and accessibility, without diesel noise. Configure a fleet or hire, and request a quote.",
    eyebrow: "Event & Festival Buggies",
    title: "Move the moment, not the noise.",
    intro:
      "Across a festival site or a country-house event, our electric buggies move artists, crew and guests where vans and fumes would intrude. Quiet, clean and quick to deploy, they keep a site flowing without breaking the atmosphere. From gate to stage to green room, and behind the scenes, they do the moving so the moment can land.",
    sections: [
      { heading: "Artist and guest transport", body: "Discreet, silent movement from gate to stage to green room, with the presentation an event deserves. The Six and The Eight carry groups gracefully, and a branded carriage adds to the experience rather than detracting from it. Drivers can be provided or you can use your own." },
      { heading: "Site logistics and crew", body: "The Utility keeps a site running behind the scenes, moving kit, crew and equipment without diesel noise or disruption. Electric torque handles soft ground and the long days a build demands. It is the quiet workhorse that lets the show go on." },
      { heading: "Accessibility and PRM", body: "Events increasingly need accessible transport, and a buggy can be specified for assisted boarding and PRM movement across a large site. We will help you plan accessible routes and the right vehicles, so every guest is looked after. Tell us the requirement and we will configure for it." },
      { heading: "Hire or buy, single unit or fleet", body: "We supply anything from a single vehicle to a large fleet, to hire for your dates or to own. Tell us the event, the numbers and whether you need drivers, and we will build a quote around it. For one-off and seasonal events, hire is often the most cost-effective route." },
      { heading: "Branded and quick to deploy", body: "Vehicles can be finished in event or sponsor livery and are ready to work on arrival, with delivery, set-up and collection handled. A branded fleet reads as part of the production rather than hired-in transport. We coordinate the logistics so your team can focus on the event." },
      { heading: "Support through the run", body: "Every vehicle is backed by a 3-year warranty and our 24-hour VIP call-out, with support across the UK and worldwide for larger events. For dates you cannot afford to lose, that responsiveness matters, and it is built into how we work." },
    ],
    recommendedModels: ["the-eight", "the-six", "the-utility"],
    relatedSectors: ["festivals-events", "film-tv"],
  },
};
