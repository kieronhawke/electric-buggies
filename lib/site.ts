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
    "Bespoke electric buggies and utility vehicles, built to order in Britain for estates, resorts, golf clubs and events. Configure yours, brand it, and request a tailored quote.",
  url: resolveUrl(),
  contact: {
    email: "enquiries@electricbuggies.co.uk",
    phone: "+44 20 3936 0000",
    phoneDisplay: "+44 (0)20 3936 0000",
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
    label: "The Range",
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
          { label: "View all models", href: "/range", note: "The complete collection" },
        ],
      },
    ],
    feature: { eyebrow: "New", title: "The Four-Seater", href: "/range/the-four" },
  },
  {
    label: "Configure",
    href: "/configure",
    columns: [
      {
        heading: "Build yours",
        links: [
          { label: "Start a new build", href: "/configure", note: "Colour, wheels, seats & branding" },
          { label: "Configure the Four", href: "/configure/the-four" },
          { label: "Configure the Six", href: "/configure/the-six" },
        ],
      },
      {
        heading: "Personalisation",
        links: [
          { label: "Colours & finishes", href: "/configure" },
          { label: "Wheels", href: "/configure" },
          { label: "Upholstery & trim", href: "/configure" },
          { label: "Logo & branding", href: "/configure", note: "Brand your fleet" },
        ],
      },
    ],
    feature: { eyebrow: "Live", title: "See it change in real time", href: "/configure" },
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
          { label: "Festivals & Events", href: "/sectors/festivals-events" },
          { label: "Holiday Parks", href: "/sectors/holiday-parks" },
          { label: "Film & Television", href: "/sectors/film-tv" },
        ],
      },
    ],
    feature: { title: "Trusted across Britain", href: "/sectors" },
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
          { label: "United Kingdom", href: "/locations", note: "Nationwide delivery" },
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
          { label: "The Journal", href: "/blog", note: "Guides & insight" },
          { label: "Contact us", href: "/contact" },
        ],
      },
    ],
    feature: { title: "Looked after, long term", href: "/ownership" },
  },
  { label: "Journal", href: "/blog" },
  { label: "Bespoke", href: "/bespoke" },
];

export const footerNav = {
  Explore: [
    { label: "The Range", href: "/range" },
    { label: "Configure", href: "/configure" },
    { label: "Bespoke", href: "/bespoke" },
    { label: "Ownership", href: "/ownership" },
    { label: "Journal", href: "/blog" },
  ],
  Sectors: [
    { label: "Estates", href: "/sectors/estates" },
    { label: "Resorts & Hotels", href: "/sectors/resorts-hotels" },
    { label: "Golf Clubs", href: "/sectors/golf-clubs" },
    { label: "Festivals & Events", href: "/sectors/festivals-events" },
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
