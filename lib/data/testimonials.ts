/**
 * Testimonials / social proof (competitor-gap §7). Seed content, clearly
 * illustrative until real client quotes are supplied; CMS-editable later.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  sector: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "The fleet arrived branded to the estate and immaculately finished. Guests notice, and so does the silence.",
    name: "Estate Manager",
    role: "Private Estate, Scotland",
    sector: "Estates",
  },
  {
    quote: "We move guests between the lobby, spa and beach all day without a sound. It set the tone for the whole stay.",
    name: "Operations Director",
    role: "Five-Star Resort",
    sector: "Resorts & Hotels",
  },
  {
    quote: "Member buggies in our club colours, and a utility fleet that doesn't scar the course. Exactly what we asked for.",
    name: "Club Secretary",
    role: "Championship Golf Club",
    sector: "Golf Clubs",
  },
];

/** Trust markers shown as a quiet strip. */
export const trustMarkers = [
  "Built in Britain",
  "Delivered worldwide",
  "3-year warranty",
  "Bespoke fleets",
];
