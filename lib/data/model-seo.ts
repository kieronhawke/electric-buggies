/**
 * Keyword-led on-page SEO for model pages (PAGE-BY-PAGE-ONPAGE-SPEC §3).
 *
 * The ranking power is the DESCRIPTIVE KEYWORD, not the model name, so this is
 * deliberately name-independent: the page title and H1 interpolate the model's
 * display name (from the lib/model-names token), so a rename never touches the
 * keyword and never re-optimises the page.
 *
 *   title = `${keyword} | ${model.name} | Electric Buggies`
 *   H1    = `${model.name}: ${descriptor}`
 *   meta  = description (keyword-led, name-free so it survives a rename)
 */
export interface ModelSeo {
  keyword: string;     // the descriptive, rankable head term
  descriptor: string;  // H1 suffix after "Name: "
  description: string;  // meta, 150-160 chars, name-free
}

export const MODEL_SEO: Record<string, ModelSeo> = {
  "the-two": {
    keyword: "2 Seater Electric Golf Buggy",
    descriptor: "A Premium 2 Seater Electric Golf Buggy",
    description:
      "Our 2 seater electric golf buggy: compact, quiet and beautifully finished. From £11,500, with bespoke fleet branding, a 3-year warranty and 24-hour VIP support.",
  },
  "the-four": {
    keyword: "4 Seater Electric Golf Buggy",
    descriptor: "A Refined 4 Seater Electric Golf Buggy",
    description:
      "Our 4 seater electric golf buggy: refined and quiet, built for estates, resorts and clubs. From £14,900, with bespoke fleet branding and a 3-year warranty.",
  },
  "the-six": {
    keyword: "6 Seater Electric Buggy",
    descriptor: "A Spacious 6 Seater Electric Buggy",
    description:
      "Our 6 seater electric buggy for larger groups across estates, resorts and venues. From £18,900, with bespoke fleet branding and a 3-year warranty.",
  },
  "the-eight": {
    keyword: "8 Seater Electric Buggy",
    descriptor: "Our Flagship 8 Seater Electric Buggy",
    description:
      "Our flagship 8 seater electric buggy for shuttle and group transport. From £23,500, with bespoke branding, a 3-year warranty and 24-hour VIP support.",
  },
  "the-utility": {
    keyword: "Electric Utility Vehicle UK",
    descriptor: "A Hard-Working Electric Utility Vehicle",
    description:
      "Our electric utility vehicle for estates, farms, grounds and work sites: cargo-ready, quiet and tough. From £15,900, with a 3-year warranty and VIP support.",
  },
  bespoke: {
    keyword: "Bespoke Electric Buggies",
    descriptor: "Built Entirely to Order",
    description:
      "Bespoke electric buggies built to your specification, with custom fleet branding, finishes and fit-out. Tell us your requirements and request a tailored quote.",
  },
};
