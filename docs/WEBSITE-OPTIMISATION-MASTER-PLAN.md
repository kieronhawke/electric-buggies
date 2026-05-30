# WEBSITE OPTIMISATION MASTER PLAN — Electric Buggies

**Version 1.0.** The page-by-page system for optimising every page on the site for front-page ranking. Built on Google's own published guidance (the AI optimisation guide, the helpful-content guide, the image SEO guide, and the title-link and snippet guidance, all read in full) and on the keyword and competitor data gathered for this project. This is the build spec the content is written to.

**A realistic word on "rank first for everything".** Every page here is built to best-practice standard and ordered by how winnable it is. Most of our target terms are genuinely winnable, because the competitor analysis showed weak incumbents and a wide-open premium gap. But ranking is never guaranteed on any single page: it depends on the domain being live and indexed, on links and trust building over time, and on what competitors do. So the plan maximises the odds page by page. It does not promise a fixed position, because no honest plan can.

**Voice and compliance rules (apply everywhere, no exceptions).** No em-dashes anywhere. British English throughout. No fabricated testimonials, statistics, or client names. Standard buggies are private-land vehicles and are not road-legal in standard form, so all road-legal and insurance content must be accurate and carefully worded, as it is the closest thing we have to a Your Money or Your Life topic. The "beat any genuine like-for-like quote" line is always hedged with "genuine like-for-like".

---

## PART 1: THE UNIVERSAL OPTIMISATION SYSTEM

Every page, whatever its type, is built from the same eight components. The page-specific sections later in this document fill in the detail for each.

### 1. URL

Short, lowercase, hyphenated, descriptive, no dates, no parameters. Keep the existing clean structure (/range/the-four, /sectors/estates). When model names are adopted, decide whether to move model URLs to the river names with 301 redirects, or keep descriptive slugs. Recommendation: keep slugs descriptive and stable, and carry the river name in the title and on the page, since changing URLs always carries some risk and the slug is not where the brand name needs to live.

### 2. Title tag (the single most important on-page keyword signal)

Format: **{Primary keyword near the front} | {short qualifier or model name} | Electric Buggies**

Rules, from Google's title-link guidance: make every title unique, descriptive, and concise; lead with the keyword; avoid boilerplate repeated across pages; avoid keyword stuffing; keep it roughly 50 to 60 characters so it does not truncate in results. Google may rewrite a title it considers unhelpful, so a clean descriptive title is also how we keep control of what shows.

### 3. Meta description

Roughly 150 to 160 characters. Not a direct ranking factor, but it drives click-through, which matters. Include the primary keyword naturally, state the single clearest reason to choose us, and end with a soft call to action ("Request a tailored quote"). Unique on every page.

### 4. H1 (one per page)

One H1 only. It carries the premium brand voice and the primary keyword together. The title tag can be plainer and more keyword-led; the H1 is where voice and keyword meet for the human reader.

### 5. Heading structure (H2 and H3)

H2s do two jobs: they capture secondary keywords, and they answer the related questions Google's AI features fan out to (the "query fan-out" behaviour). So each page's H2s should map to the real sub-questions a buyer asks. Descriptive, not clever. H3s break down detail underneath.

### 6. Body content (the biggest lever of all)

Google is explicit that unique, non-commodity, experience-led content influences ranking and AI visibility more than any other single factor. So every page must say something only a genuine premium British dealer could say: real specifics on configuration, fleet branding, total cost of ownership, sector use in practice, the ownership promise. No generic filler that an AI or a competitor could have written. There is no ideal word count; write enough to cover the topic completely and no more. Weave keywords naturally into prose, never forced.

### 7. Images (full spec in Part 2)

Every image: descriptive hyphenated filename, information-rich alt text, WebP where possible, compressed, responsive, placed next to the text it illustrates, and one chosen preview image per page via og:image.

### 8. Structured data (for rich results, not as an AI trick)

Per page type (full list in Part 5). Google has confirmed schema is not required for AI features, so we use it only for the rich-result and entity-clarity benefit it genuinely gives in normal Search.

### 9. Internal linking

Every page links naturally to its logical neighbours: models link to relevant sectors and to the configurator and quote; sectors link to the models that suit them and to relevant guides; guides link to the product and sector pages they discuss. This spreads authority and helps Google understand the site. Use descriptive anchor text, never "click here".

### 10. The single conversion goal

Every page leads to one action: request a tailored quote. Not checkout. The call to action is present early and repeated at the foot of the page.

---

## PART 2: THE IMAGE OPTIMISATION SPEC (applies to every image on the site)

Grounded directly in Google's image SEO guidance. This is the "down to the image detail" layer.

### Filenames

Short, descriptive, lowercase, hyphen-separated, no underscores, no spaces, never generic. The extension must match the file type.

- Pattern: `{model-or-subject}-{descriptor}-{context}.webp`
- Good: `the-avon-4-seater-electric-golf-buggy-estate-driveway.webp`
- Good: `electric-utility-vehicle-loading-bay-the-tamar.webp`
- Bad: `IMG_0421.jpg`, `image1.png`, `buggy-buggy-golf-buggy-best.jpg`

### Alt text

Describe what is genuinely in the image, in context, with the keyword used naturally and never stuffed. Where several images are similar, describe the differentiator (angle, colour, setting, feature). Decorative-only images get an empty alt (`alt=""`) so screen readers skip them.

- Good: `alt="The Avon four seater electric golf buggy parked on a country estate driveway"`
- Good (differentiated sibling image): `alt="The Avon four seater buggy from the rear showing the rear-facing flip seat"`
- Bad (stuffed): `alt="golf buggy electric golf buggy buggy for sale uk best golf buggy cheap"`
- Bad (useless): `alt="image"` or `alt="buggy1"`

### Format, quality and speed

WebP is the preferred format for its compression, with a JPEG or PNG fallback for older clients. Images are usually the largest contributor to page weight, and page speed is part of the page-experience signal, so every image is compressed and sized correctly. Use responsive images (srcset or the picture element) with a plain src fallback so every browser and crawler gets an image. Check pages in PageSpeed Insights. The site's Core Web Vitals target (95 or above) depends heavily on this.

### Discovery and indexing

Use real HTML img elements, never CSS background images, for anything we want Google to index, because Google does not index CSS images. Maintain an image sitemap so Google can find images it might otherwise miss. Reference the same image by the same URL site-wide so it can be cached rather than re-crawled.

### The preview image (one per page)

Choose one relevant, representative image per page as the social and search preview, set via the og:image meta tag (and, where used, the schema primaryImageOfPage or the image property of the page's main entity). It must be relevant and high resolution, must not be the bare logo, must not be an image that is mostly text, and must not have an extreme aspect ratio.

### Practical fleet rule for this site

When real photography arrives, shoot each model in the sectors it sells into (a buggy on an estate, the same model at a resort entrance, the utility model at a working loading bay), so that image filenames and alt text can carry both the product term and the sector term truthfully. Until then, any placeholder must still follow the filename and alt rules above, and must never imply real clients we do not have.

---

## PART 3: THE MODEL NAMES (recommended family, for sign-off)

A proper name strengthens the brand but does not by itself help ranking, because nobody searches a made-up name. Ranking comes from the descriptive keyword in the title and H1. So each model leads with its keyword and carries the river name as the brand layer. The family below is a recommended starting point. A trademark and domain check should be run before adoption, as a couple of names carry faint historic motoring echoes.

| Current | Proposed name | Seats / type | Real price | Title keyword (leads the title tag) |
|---|---|---|---|---|
| The Two | **The Wye** | 2 seat | £11,500 | 2 Seater Electric Golf Buggy |
| The Four | **The Avon** | 4 seat (core model) | £14,900 | 4 Seater Electric Golf Buggy |
| The Six | **The Severn** | 6 seat | £18,900 | 6 Seater Electric Buggy |
| The Eight | **The Thames** | 8 seat (flagship) | £23,500 | 8 Seater Electric Buggy |
| The Utility | **The Tamar** | utility / cargo | £15,900 | Electric Utility Vehicle |
| Bespoke | **Bespoke Collection** | custom / larger people movers | On request | Bespoke Electric Vehicles |

Rationale: the 2 and 4 seaters carry "golf buggy", the category's highest-volume public term, because those formats are what people picture and search. The 6 and 8 seaters carry "electric buggy" and shuttle or people-mover language, because at that size buyers are resorts, venues and events, not golfers, and "electric buggy" (around 1,000 searches, difficulty only 8) is a priority term the broad-market incumbent barely holds. The Tamar carries "electric utility vehicle" (590, winnable). Bespoke carries the premium custom and larger-vehicle demand.

Product gap to resolve: the lowest-difficulty term in the whole set, "single seat golf buggy" (590, difficulty 3), has no model to map to, and single-seat ties directly to the road-legal question. Decide whether to add a single-seat model or to address that demand through a guide plus the Wye.

---

## PART 4: PAGE-BY-PAGE BRIEFS (priority pages)

These are the pages that drive ranking and revenue, so each gets a full brief. Titles are written to the formula; adjust the river names if the family changes.

### Homepage

- **Primary keyword:** electric buggy / electric buggies (plus brand)
- **Title:** Electric Buggies UK | Premium Electric Buggies & Golf Buggies
- **Meta:** British-built premium electric buggies for estates, resorts, venues and golf. Bespoke configuration, fleet branding, three-year warranty. Request a tailored quote.
- **H1:** premium voice carrying "electric buggies", for example: Britain's Premium Electric Buggies, Built to Order
- **H2s:** the range at a glance (linking each model); who we build for (sectors); bespoke and fleet branding; ownership, warranty and support; why choose us. These H2s must capture "golf buggy", "golf cart" and the sector terms in natural prose, because the homepage is where we stop forfeiting the generic category traffic the live site currently turns away.
- **Body:** the brand story and the genuine differentiators (premium feel, bespoke build, branded fleets, three-year warranty, twenty-four-hour call-out, beat any genuine like-for-like quote). Non-commodity throughout.
- **Images:** hero of the flagship in a premium setting; one representative image per sector; model thumbnails. All named and alt-tagged to the spec.
- **Schema:** Organization and WebSite. LocalBusiness only if there is a real showroom address.
- **Internal links:** to all six model pages, the top sectors, the configurator, and the quote page.

### Range hub (/range)

- **Primary keyword:** electric golf buggies / electric buggies range
- **Title:** Electric Buggy Range | 2 to 8 Seaters & Utility | Electric Buggies
- **Meta:** Compare our full range of electric buggies, from the two-seat Wye to the eight-seat Thames, plus the Tamar utility vehicle. Built to order. Request a tailored quote.
- **H1:** The Electric Buggy Range
- **Body:** short, useful framing of the whole range, a comparison the buyer actually needs (seats, use, indicative price, sector fit), each row linking to its model page.
- **Images:** one clean image per model, consistent treatment, named per model.
- **Schema:** BreadcrumbList; optionally ItemList of the models.

### Model pages (one brief, applied to all six)

Apply this to each model, swapping in the model's keyword, seats, price and character.

- **Title:** {Seat/type keyword} | {River name} | Electric Buggies
  - The Wye: 2 Seater Electric Golf Buggy | The Wye | Electric Buggies
  - The Avon: 4 Seater Electric Golf Buggy | The Avon | Electric Buggies
  - The Severn: 6 Seater Electric Buggy | The Severn | Electric Buggies
  - The Thames: 8 Seater Electric Buggy | The Thames | Electric Buggies
  - The Tamar: Electric Utility Vehicle | The Tamar | Electric Buggies
  - Bespoke: Bespoke Electric Vehicles | Custom Fleets | Electric Buggies
- **Meta:** lead with the keyword and the strongest single fact (seats, range, build-to-order, indicative "from" price), end with the quote call to action.
- **H1:** premium voice plus keyword, for example: The Avon, a Four Seater Electric Golf Buggy Built to Order
- **H2s:** specifications; range and battery; configuration and finishes; who it suits (sectors); ownership and warranty; price and how to order; frequently asked questions. The FAQ exists because buyers genuinely ask, and it naturally captures question keywords.
- **Body:** real specifics, written from genuine product knowledge: dimensions, seating, battery and range, charging, terrain, build and configuration options, fleet branding, the indicative price and the quote route. Non-commodity throughout. State plainly that it is a private-land vehicle and not road-legal in standard form, since accuracy here is non-negotiable.
- **Images:** hero, several gallery images showing the differentiators (interior, rear, finishes, in its sector), each with a distinct descriptive filename and differentiated alt text. One og:image preview.
- **Schema:** Product with brand, image, description, and an Offer carrying the genuine "from" price shown on the page, availability, and the quote URL. Keep it honest and matching the visible price. BreadcrumbList. Product-specific FAQ only if the questions are genuinely on the page.
- **Internal links:** to the sectors this model suits, the configurator, relevant guides, and the quote.

### Configurator (/configure)

- **Primary keyword:** build your own electric buggy / configure
- **Title:** Build Your Electric Buggy | Configurator | Electric Buggies
- **Meta:** Configure your electric buggy: seats, finish, fleet branding and accessories, then request a tailored quote. Built to order in Britain.
- **H1:** Build Your Electric Buggy
- **Body:** brief, clear framing of how configuration works and what can be customised, leading into the tool. The page should still carry indexable text describing the options, not only the interactive tool, so Google has something to read.
- **Schema:** BreadcrumbList.

### Sector pages (one brief, applied to all six: estates, resorts-hotels, golf-clubs, festivals-events, holiday-parks, film-tv)

- **Title:** {Sector keyword} | Electric Buggies for {Sector} | Electric Buggies
  - Estates: Electric Buggies for Country Estates | Estate Vehicles | Electric Buggies
  - Resorts and hotels: Electric Buggies for Resorts & Hotels | Electric Buggies
  - Golf clubs: Electric Golf Buggies for Golf Clubs | Fleet Supply | Electric Buggies
  - Festivals and events: Electric Buggies for Events & Festivals | Electric Buggies
  - Holiday parks: Electric Buggies for Holiday Parks | Electric Buggies
  - Film and TV: Electric Buggies for Film & TV Production | Electric Buggies
- **Meta:** lead with the sector use, name the models that suit it, end with the quote call to action.
- **H1:** premium voice plus the sector keyword.
- **H2s:** the sector's real needs; which models suit and why; fleet branding for this sector; ownership and support; relevant guidance; request a quote. Capture "people mover", "passenger transport", "shuttle" and similar terms naturally where the sector calls for them.
- **Body:** genuine, sector-specific insight, not a reworded template across all six. What this sector actually needs from a buggy, how ours meets it, real examples of configuration and use. This is exactly the non-commodity content Google rewards, and it is also our wedge against the industrial incumbents who have no premium sector content at all.
- **Images:** the relevant model shown in that sector, named and alt-tagged with both product and sector terms truthfully.
- **Schema:** BreadcrumbList; FAQPage only if genuine FAQs are present.
- **Internal links:** to the suited models, relevant guides, and the quote.

### Request a quote (/request-a-quote)

- **Primary keyword:** request a quote / get a quote electric buggy
- **Title:** Request a Tailored Quote | Electric Buggies
- **Meta:** Tell us your needs and we will build a tailored quote, for a single buggy or a branded fleet. Personal or business. British-built, fully supported.
- **H1:** Request a Tailored Quote
- **Body:** reassure and reduce friction: what happens next, response time, that it covers both personal and business and both single units and fleets. Keep the form short.
- **Schema:** BreadcrumbList; optionally ContactPage.

---

## PART 5: TEMPLATED PAGE TYPES (so every remaining page is covered)

These page types repeat, so they get a consistent pattern rather than an individual brief. Every page still ends up optimised; the pattern just keeps them consistent and efficient.

### Location pages (the nineteen international markets) — with an important caution

**The caution first.** Nineteen pages targeting locations, built on a shared template, are a doorway-page and scaled-content risk under Google's spam policy, and thin location pages are a common cause of quiet suppression. We keep a location page only if it can carry genuinely unique, useful content for that market. If it cannot, we consolidate it into a regional page or drop it. Better to have eight strong market pages than nineteen thin ones.

For each location page we do keep:
- **Title:** Electric Buggies in {Location} | Supply & Delivery | Electric Buggies
- **H1:** premium voice plus the location.
- **Body, and this is the condition of publishing:** content that is genuinely specific to that market: which local sectors buy (resorts, estates, private islands, hospitality), delivery and import realities, climate and terrain suitability, any market-specific configuration. Never the same paragraphs with the place name swapped in.
- **Images:** the relevant model in a setting credible for that market, named and alt-tagged honestly.
- **Schema:** BreadcrumbList and WebPage. Not LocalBusiness, because we have no premises there.
- **Internal links:** to the models and sectors most relevant to that market.

### Services pages (hire, shuttle, VIP chauffeur, service plan)

- **Title:** {Service keyword} | Electric Buggies, for example: Electric Buggy Hire | Events & Venues | Electric Buggies
- **Body:** what the service is, who it suits, how it works, what is included, the genuine differentiators. The hire page should capture "golf buggy hire" and "electric buggy hire" naturally. The service-plan page is where the three-year warranty and twenty-four-hour call-out get their full, accurate treatment.
- **Schema:** BreadcrumbList; Service where it applies.
- **Internal links:** to relevant models, sectors and the quote.

### Guides (the content hub: ten live, plus the briefed gap posts)

- **Title:** lead with the question or topic keyword, for example: How Much Does an Electric Golf Buggy Cost in the UK? | Electric Buggies
- **Structure:** answer the core question clearly and early (good writing, and it helps the AI engines), then go deeper than any competitor with genuine expertise. Descriptive H2s mapping to the real sub-questions.
- **Body:** non-commodity and experience-led. The road-legal and the planned insurance guide must be accurate and carefully worded, given they are the closest to a Your Money or Your Life topic. Resolve the two near-duplicate resorts-and-hotels guides by consolidating them, since duplication wastes crawl budget and splits ranking signals.
- **Author and trust:** real byline linking to author background, genuine datePublished and dateModified. Update genuinely when facts change; never fake a date to look fresh.
- **Images:** relevant, named and alt-tagged; diagrams where they help.
- **Schema:** Article or BlogPosting with author and dates. BreadcrumbList.
- **Internal links:** to the product and sector pages the guide discusses, and to the quote.
- **Priority new guides (from the content calendar):** the fleet-branding guide, the servicing, warranty and call-out guide, and the golf-buggy-insurance guide (590 searches, high commercial value, currently untapped).

### About

- **Title:** About Electric Buggies | British-Built Electric Vehicles
- **Body:** the genuine "who and why" Google's E-E-A-T guidance asks for: who is behind the brand, the British-marque positioning, the supplier relationship handled honestly, the ownership promise. This page does real trust work for the whole site.
- **Schema:** AboutPage and Organization.

### Ownership

- **Title:** Ownership, Warranty & Support | Electric Buggies
- **Body:** the full ownership promise in detail: three-year warranty, twenty-four-hour VIP call-out, servicing, finance and the quote route. Accurate and specific.
- **Schema:** BreadcrumbList; FAQPage if genuine FAQs.

---

## PART 6: SITE-WIDE TECHNICAL AND TRUST CHECKLIST

- One H1 per page; logical H2 and H3 structure throughout.
- Unique title and meta description on every single page; no boilerplate duplication.
- Clean, stable, descriptive URLs; 301 redirects for any that change (the Journal-to-Guides redirects are the model to follow).
- Image spec applied to every image site-wide; image sitemap maintained.
- Core Web Vitals at 95 or above; images compressed; WebP with fallback.
- Structured data per page type, for rich results only, validated in the Rich Results Test.
- Resolve the resorts-and-hotels guide duplication.
- Resolve the location-page doorway risk (make genuinely unique or consolidate).
- Real author and About information for trust; genuine reviews added when they exist, never fabricated.
- Verify the site in Google Search Console and submit to Bing Webmaster Tools (Bing is the route to ChatGPT visibility) once the custom domain is live.
- Pursue authentic trade, sector, event and directory mentions for authority and AI visibility, following the legitimate sources the competitor analysis identified. Never buy links.

---

## PART 7: PRIORITY ORDER (what we write, and in what sequence)

Ordered by winnability and revenue impact, so the pages most likely to rank and convert get done first.

1. **Homepage** — the brand's front door and where we stop turning away category traffic. Anchors "electric buggies" and the whole positioning.
2. **The six model pages** — highest commercial intent, and the model-name and title fix unlocks the most here. Lead with the Avon (the core four-seater, "4 seater electric golf buggy") and the terms we can most plausibly win, including "electric buggy" via the Severn and Thames.
3. **The range hub** — ties the models together and captures range and comparison searches.
4. **The priority sector pages** — estates, resorts and hotels, and golf clubs first, since they carry the clearest demand and the strongest premium wedge.
5. **The priority guides** — the insurance guide, the cost guide refresh, and the fleet-branding guide, plus fixing the road-legal accuracy and the resorts duplication.
6. **Services, ownership, about, quote** — the supporting trust and conversion pages.
7. **Location pages** — last, and only those that pass the genuine-usefulness test, because of the doorway risk.

Everything is written to the helpful-content standard in the SEO playbook: original, experience-led, specific, accurate, clearly authored, and genuinely useful. That standard, applied to every page above, is what gives each its best shot at the front page.
