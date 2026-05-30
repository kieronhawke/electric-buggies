/**
 * Interim imagery (brief: tasteful Unsplash, every image CMS-swappable).
 * These URLs are the seed fallback; in the CMS each becomes a Sanity image.
 * The <Media> component always layers a dark gradient beneath, so a slow or
 * failed image degrades gracefully to an intentional placeholder.
 *
 * Unsplash hotlinking is permitted; the CMS path replaces these with owned/
 * licensed photography.
 */
const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const imagery = {
  heroEstate: U("1500627964684-141351970a7f"), // sweeping estate drive
  statement: U("1605540436563-5bca919ae766"),
  sectors: {
    estates: U("1416331108676-a22ccb276e35"),
    "resorts-hotels": U("1571896349842-33c89424de2d"),
    "golf-clubs": U("1587174486073-ae5e5cff23aa"),
    "festivals-events": U("1533174072545-7a4b6ad7a6c3"),
    "holiday-parks": U("1537726235470-8504e3beef77"),
    "film-tv": U("1485846234645-a62644f84728"),
  } as Record<string, string>,
  // Second, in-context photo per sector page (distinct from the hero).
  sectorSecondary: {
    estates: U("1470115636492-6d2b56f9146d"),
    "resorts-hotels": U("1500627964684-141351970a7f"),
    "golf-clubs": U("1416331108676-a22ccb276e35"),
    "festivals-events": U("1470115636492-6d2b56f9146d"),
    "holiday-parks": U("1571896349842-33c89424de2d"),
    "film-tv": U("1500627964684-141351970a7f"),
  } as Record<string, string>,
  locations: {
    "united-kingdom": U("1500627964684-141351970a7f"), // sweeping British estate drive
    dubai: U("1512453979798-5ea266f8880c"),
    scotland: U("1506905925346-21bda4d32df4"),
    bermuda: U("1505228395891-9a51e7e86bf6"),
    "new-york": U("1496442226666-8d4d0e62e6e9"),
  } as Record<string, string>,
  // Second, in-context photo per location page (distinct from the hero), reusing
  // proven on-brand venue/estate/golf/resort photography.
  locationSecondary: {
    "united-kingdom": U("1587174486073-ae5e5cff23aa"), // golf course
    dubai: U("1571896349842-33c89424de2d"), // resort
    scotland: U("1416331108676-a22ccb276e35"), // estate grounds
    bermuda: U("1571896349842-33c89424de2d"), // resort
    "new-york": U("1416331108676-a22ccb276e35"), // estate grounds
  } as Record<string, string>,
  // Reuse the on-brand venue/estate photography already proven across the site.
  // (The previous standalone IDs included an off-brand stock photo.)
  blog: [
    U("1500627964684-141351970a7f"), // sweeping estate drive
    U("1587174486073-ae5e5cff23aa"), // golf course
    U("1571896349842-33c89424de2d"), // resort
    U("1416331108676-a22ccb276e35"), // estate grounds
    U("1470115636492-6d2b56f9146d"), // country road
  ],
  ctaBand: U("1470115636492-6d2b56f9146d"),
};

/** Deterministic blog image by index. */
export const blogImage = (i: number) => imagery.blog[i % imagery.blog.length];
