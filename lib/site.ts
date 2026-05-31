/**
 * Site-wide settings + navigation. CMS-overridable via Sanity `siteSettings`;
 * these are the build-time fallback.
 */

function resolveUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Electric Buggies",
  strapline: "Electric · Bespoke · British",
  description:
    "Premium electric golf and utility buggies for estates, resorts, golf clubs and events. Specified to your brief, branded as your own, and delivered worldwide.",
  url: resolveUrl(),
  contact: {
    email: "enquiries@electricbuggies.co.uk",
    phone: "+44 20 3936 0000",
    phoneDisplay: "+44 (0)20 3936 0000",
    // Placeholder uses the UK Ofcom reserved-fiction mobile range (07700 900xxx)
    // so it can never reach a real person. Owner replaces with a real WhatsApp number.
    whatsapp: "+447700900123",
    address: { line1: "Electric Buggies", line2: "London", country: "United Kingdom" },
  },
  warrantyTerm: "3-year",
  social: { instagram: "https://instagram.com/", linkedin: "https://linkedin.com/" },
} as const;

export interface MegaColumn {
  heading: string;
  links: { label: string; href: string; note?: string }[];
}
export interface NavItem {
  label: string;
  href: string;
  columns?: MegaColumn[];
  feature?: { eyebrow?: string; title: string; href: string };
}

/** Primary navigation with mega-menu data (matches v2 prototype + addendum). */
export const primaryNav: NavItem[] = [
  {
    label: "Vehicles",
    href: "/range",
    columns: [
      {
        heading: "By size",
        links: [
          { label: "The Two", href: "/range/the-two", note: "Intimate · estate & personal" },
          { label: "The Four", href: "/range/the-four", note: "The all-rounder" },
          { label: "The Six", href: "/range/the-six", note: "Hospitality & touring" },
          { label: "The Eight", href: "/range/the-eight", note: "People-moving shuttle" },
        ],
      },
      {
        heading: "By purpose",
        links: [
          { label: "Utility & Cargo", href: "/range/the-utility", note: "Grounds & estates" },
          { label: "Bespoke Build", href: "/bespoke", note: "Made entirely to order" },
          { label: "Compare models", href: "/compare", note: "Specs & price side by side" },
          { label: "View all models", href: "/range", note: "The complete collection" },
        ],
      },
    ],
    feature: { eyebrow: "New", title: "The Four-Seater", href: "/range/the-four" },
  },
  {
    label: "Sectors",
    href: "/sectors",
    columns: [
      {
        heading: "Where they work",
        links: [
          { label: "Country Estates", href: "/sectors/estates" },
          { label: "Resorts & Hotels", href: "/sectors/resorts-hotels" },
          { label: "Golf Clubs", href: "/sectors/golf-clubs" },
        ],
      },
      {
        heading: "More sectors",
        links: [
          { label: "Theme Parks", href: "/sectors/theme-parks", note: "Worldwide, branded & accessible" },
          { label: "Festivals & Events", href: "/sectors/festivals-events" },
          { label: "Holiday Parks", href: "/sectors/holiday-parks" },
          { label: "Airports", href: "/sectors/airports", note: "Airside & accessible PRM" },
          { label: "Film & Television", href: "/sectors/film-tv" },
        ],
      },
      {
        heading: "Business & public",
        links: [
          { label: "Healthcare & Care", href: "/sectors/healthcare", note: "Accessible & PRM" },
          { label: "Universities & Campuses", href: "/sectors/universities-campuses" },
          { label: "Warehouses & Work Sites", href: "/sectors/warehouses-work-sites" },
          { label: "Parks & Public Spaces", href: "/sectors/parks-public-spaces" },
        ],
      },
    ],
    feature: { eyebrow: "Services", title: "Shuttle, VIP & Hire", href: "/services/shuttle" },
  },
  {
    label: "Locations",
    href: "/locations",
    columns: [
      {
        heading: "Where we deliver",
        links: [
          { label: "Dubai", href: "/locations/dubai", note: "Resorts & hospitality" },
          { label: "Scotland", href: "/locations/scotland", note: "Estates & Highland golf" },
          { label: "Bermuda", href: "/locations/bermuda", note: "Island & eco resorts" },
          { label: "New York", href: "/locations/new-york", note: "Estates, events & campuses" },
        ],
      },
      {
        heading: "Worldwide",
        links: [
          { label: "All locations", href: "/locations", note: "Delivered from the UK" },
          { label: "United Kingdom", href: "/locations/united-kingdom", note: "Nationwide delivery" },
        ],
      },
    ],
    feature: { title: "Delivered worldwide from Britain", href: "/locations" },
  },
  {
    label: "Ownership",
    href: "/ownership",
    columns: [
      {
        heading: "The promise",
        links: [
          { label: "Extended warranty", href: "/ownership" },
          { label: "UK-wide delivery", href: "/ownership" },
          { label: "Servicing & support", href: "/ownership" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "Frequently asked questions", href: "/ownership" },
          { label: "The Guides", href: "/guides", note: "Guides & insight" },
          { label: "Contact us", href: "/request-a-quote" },
        ],
      },
    ],
    feature: { title: "Looked after, long term", href: "/ownership" },
  },
  {
    label: "Services",
    href: "/services/shuttle",
    columns: [
      {
        heading: "Services",
        links: [
          { label: "Hire", href: "/services/hire", note: "Events & business, fleet or single" },
          { label: "Custom Shuttle", href: "/services/shuttle", note: "Move guests around your venue" },
          { label: "VIP Chauffeur", href: "/services/vip-chauffeur", note: "White-glove event experience" },
          { label: "Service Plan", href: "/services/service-plan", note: "24-hour call-out, worldwide" },
        ],
      },
      {
        heading: "Enquire",
        links: [
          { label: "Request a hire quote", href: "/services/hire#enquire" },
          { label: "Request a quote", href: "/request-a-quote" },
        ],
      },
    ],
    feature: { eyebrow: "New", title: "VIP chauffeur experiences", href: "/services/vip-chauffeur" },
  },
  { label: "Guides", href: "/guides" },
  { label: "Bespoke", href: "/bespoke" },
];

export const footerNav = {
  Explore: [
    { label: "Vehicles", href: "/range" },
    { label: "Configure (preview)", href: "/configure" },
    { label: "Bespoke", href: "/bespoke" },
    { label: "Ownership", href: "/ownership" },
    { label: "Guides", href: "/guides" },
  ],
  Sectors: [
    { label: "Estates", href: "/sectors/estates" },
    { label: "Resorts & Hotels", href: "/sectors/resorts-hotels" },
    { label: "Golf Clubs", href: "/sectors/golf-clubs" },
    { label: "Theme Parks", href: "/sectors/theme-parks" },
  ],
  Locations: [
    { label: "Dubai", href: "/locations/dubai" },
    { label: "Scotland", href: "/locations/scotland" },
    { label: "Bermuda", href: "/locations/bermuda" },
    { label: "New York", href: "/locations/new-york" },
  ],
  Contact: [
    { label: "Request a quote", href: "/request-a-quote" },
    { label: "Email us", href: "mailto:enquiries@electricbuggies.co.uk" },
    { label: "Call us", href: "tel:+442039360000" },
  ],
} as const;
