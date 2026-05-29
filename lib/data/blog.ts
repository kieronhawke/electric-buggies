/**
 * Journal / blog (brief §C). Cornerstone SEO posts at launch. CMS-authored in
 * Sanity (Portable Text) when connected; these are the seed fallback.
 * Body uses a simple block model {type, text} rendered by the post page; the
 * Sanity path renders Portable Text with the same visual treatment.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

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
      "A clear, honest breakdown of what electric golf buggies cost in the UK in 2026 — from entry models to bespoke fleets — and what actually drives the price.",
    category: "Buying Guides",
    categorySlug: "buying-guides",
    author: "The Electric Buggies Team",
    date: "2026-05-12",
    readingTime: 7,
    body: [
      { type: "p", text: "“How much does an electric golf buggy cost?” is the first question almost every buyer asks — and the honest answer is that it depends on configuration, build quality and whether you're buying one vehicle or a branded fleet. This guide sets out the real ranges and what moves the price." },
      { type: "h2", text: "Typical UK price ranges in 2026" },
      { type: "p", text: "A new two-seat electric buggy built to a premium standard starts from around £11,500. Four-seat carriages — the most popular configuration — sit around £15,000, with six- and eight-seat people-movers rising to the low-to-mid £20,000s. Utility models with cargo beds fall in between." },
      { type: "list", items: ["Two-seat: from ~£11,500", "Four-seat: from ~£14,900", "Six-seat: from ~£18,900", "Eight-seat: from ~£23,500", "Utility & cargo: from ~£15,900"] },
      { type: "h2", text: "What actually drives the price" },
      { type: "p", text: "Battery chemistry and capacity (lithium costs more than lead-acid but lasts far longer), seating and platform size, roof and weather protection, wheels, upholstery, and any bespoke livery or branding all move the figure. Fleet orders and ongoing servicing also factor in." },
      { type: "quote", text: "The cheapest buggy is rarely the least expensive to own — lithium, build quality and warranty decide the ten-year cost." },
      { type: "h2", text: "Lead-acid vs lithium: the cost that matters" },
      { type: "p", text: "Lead-acid batteries are cheaper up front but heavier, slower to charge and shorter-lived. Lithium costs more initially but delivers more range, faster charging and a longer service life — usually the better total cost of ownership for a vehicle used regularly." },
      { type: "p", text: "The most reliable way to get a real figure for your use is to configure a vehicle and request a tailored quote — the indicative total updates as you choose, and final pricing is confirmed on quotation." },
    ],
    related: ["are-golf-buggies-road-legal-uk", "lithium-vs-lead-acid-range-lifespan"],
    keywords: ["electric golf buggy cost UK", "electric golf buggy price", "how much electric golf cart"],
  },
  {
    slug: "are-golf-buggies-road-legal-uk",
    title: "Are golf buggies road-legal in the UK?",
    excerpt:
      "What the law actually says about driving an electric buggy on UK roads — private land, licensing, and what 'street-legal' really requires.",
    category: "Regulations",
    categorySlug: "regulations",
    author: "The Electric Buggies Team",
    date: "2026-05-06",
    readingTime: 6,
    body: [
      { type: "p", text: "It's one of the most common questions we're asked: can you drive an electric buggy on the road in the UK? The short answer is that most buggies are designed for private land — but road use is possible with the right specification and registration." },
      { type: "h2", text: "On private land" },
      { type: "p", text: "On private land — an estate, golf course, resort, holiday park or event site — a buggy needs no registration, road tax or licence, which is exactly where the vast majority operate." },
      { type: "h2", text: "On public roads" },
      { type: "p", text: "To use public roads legally, a buggy must meet specific requirements: lighting, indicators, mirrors, a horn, and registration with the DVLA, plus insurance and a valid driving licence. This is achievable on suitably specified vehicles but is the exception rather than the rule." },
      { type: "quote", text: "Most of our clients never need road registration — but where they do, we advise honestly on what's required." },
      { type: "p", text: "If your use involves crossing or travelling on a public road, tell us at enquiry and we'll set out exactly what specification and paperwork would be needed for your situation." },
    ],
    related: ["how-much-does-an-electric-golf-buggy-cost-uk", "choosing-electric-utility-vehicle-country-estate"],
    keywords: ["are golf buggies road legal UK", "street-legal golf buggy UK", "drive golf buggy on road"],
  },
  {
    slug: "choosing-electric-utility-vehicle-country-estate",
    title: "Choosing an electric utility vehicle for a country estate",
    excerpt:
      "Payload, terrain, range and finish — how to choose the right electric utility vehicle for the working side of a country estate.",
    category: "By Sector",
    categorySlug: "sectors",
    author: "The Electric Buggies Team",
    date: "2026-04-28",
    readingTime: 6,
    body: [
      { type: "p", text: "Every estate runs a working fleet that guests never see — and increasingly it's electric. Here's how to choose a utility vehicle that earns its keep across grounds, gardens and tracks." },
      { type: "h2", text: "Start with payload and terrain" },
      { type: "p", text: "Be realistic about loads — tools, timber, feed, equipment — and the ground you cross. A tipping cargo bed, adequate payload and the torque for grass and gravel matter more than top speed." },
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
    title: "Electric buggies for resorts & hotels: a buyer's guide",
    excerpt:
      "From guest transfers to branded fleets — what hospitality operators should look for when choosing electric buggies.",
    category: "Buying Guides",
    categorySlug: "buying-guides",
    author: "The Electric Buggies Team",
    date: "2026-04-20",
    readingTime: 7,
    body: [
      { type: "p", text: "A resort is judged in its first hundred metres. A silent, beautifully finished electric carriage to greet and move guests sets the tone before a word is spoken — here's how to choose one." },
      { type: "h2", text: "Match capacity to the journey" },
      { type: "p", text: "Six- and eight-seat carriages suit larger sites moving groups between lobby, rooms, spa and grounds; four-seaters suit smaller properties and VIP transfers." },
      { type: "h2", text: "Brand it to your house" },
      { type: "p", text: "Liveries, upholstery and your logo turn transport into part of the welcome. Our configurator's Branding step lets you place your logo and see it applied before you order." },
      { type: "h2", text: "Plan the fleet and the charging" },
      { type: "p", text: "Think about how many vehicles run at peak, where they charge overnight, and the servicing arrangement. We help operators plan fleets that are always ready for guests." },
    ],
    related: ["how-much-does-an-electric-golf-buggy-cost-uk", "lithium-vs-lead-acid-range-lifespan"],
    keywords: ["resort golf carts", "hotel shuttle buggies", "electric buggies for hotels"],
  },
  {
    slug: "lithium-vs-lead-acid-range-lifespan",
    title: "Lithium vs lead-acid: range & lifespan explained",
    excerpt:
      "The single most important decision in buying an electric buggy — battery chemistry — explained in plain terms.",
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
      { type: "p", text: "Lithium charges faster, tolerates partial charging, and lasts far more cycles — often years longer in regular use. Lead-acid is slower to charge and wears faster, especially if run down regularly." },
      { type: "quote", text: "Lithium costs more up front and usually less over the life of the vehicle." },
      { type: "p", text: "For anything used regularly — a resort fleet, a working estate vehicle, a daily golf buggy — lithium is almost always the better total-cost-of-ownership choice." },
    ],
    related: ["how-much-does-an-electric-golf-buggy-cost-uk", "choosing-electric-utility-vehicle-country-estate"],
    keywords: ["lithium vs lead acid golf buggy", "golf buggy battery range", "lithium golf buggy"],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const postsByCategory = (catSlug: string) => posts.filter((p) => p.categorySlug === catSlug);
