# Electric Buggies: Page-by-Page On-Page Specification

The authoritative per-page on-page spec. For every page it gives the recommended URL, search intent, primary and secondary keywords, page title, meta description, H1, H2 set, hero image filename and alt text, og:image, and schema. Hand this to Claude Code as the build spec. Where the live site already has a title, meta, H1 or image, replace it with the value here.

## How to read this and how it was built

These values come from the agreed information architecture in the handover, the real model prices, and the keyword data gathered so far. I could not crawl the live deployment directly (it is not publicly indexed and the fetch tool would not reach it), so treat every value here as the target state, not a diff against the current page. If you can later paste the current titles, or make a preview indexable, I can produce a before-and-after for each page.

Two working assumptions, both easy to change:

1. Model names use the proposed British river family (provisional, pending your sign-off and a trademark check). Crucially, the ranking power lives in the descriptive keyword in the title and H1, not in the name. If a name changes, only the brand-layer token changes, never the keyword. So a rename is a one-token edit per page, not a re-optimisation.
2. This document specifies the on-page frame (titles, meta, headings, image metadata). The body copy that fills each H2 is the next step and will be written to the voice and compliance rules separately. A few metas reference real differentiators (3-year warranty, 24-hour VIP call-out, bespoke builds, custom fleet branding, beat any genuine like-for-like quote). Those are brand promises and are safe to use. Do not invent client names, testimonials or statistics anywhere.

## Site-wide conventions (apply to every page)

**Title formula.** `{primary keyword near the front} | {qualifier or model name} | Electric Buggies`. Target 50 to 60 characters so it does not truncate in Google. Front-load the keyword. The brand token "Electric Buggies" already contains the term "electric buggies", so most titles carry the brand term for free.

**Meta description.** One or two sentences, 150 to 160 characters, written for click-through, including the primary keyword once and a real differentiator and a soft call to action. Meta descriptions are not a ranking factor but they drive clicks, so write them for a human.

**H1.** Exactly one per page. It carries the premium voice and contains the primary keyword naturally. The title can be terse and keyword-led; the H1 can read more like the brand speaking.

**H2s.** Each H2 maps to a real sub-question a buyer or an AI query fan-out would ask (price, range, who it is for, road legality, warranty). This is good structure for readers and is what helps the page surface in AI answers. Do not add H2s as an AI trick; add them because a buyer wants that section.

**Images.** Use real HTML `<img>` elements, never CSS background images, or Google will not index them. Filenames lowercase, hyphenated, descriptive, no `IMG_0423.JPG`. Serve WebP with a JPEG or PNG fallback, compress hard (images are the biggest page-weight cost and speed is a page-experience signal), and use responsive `srcset` with a plain `src` fallback. Add every page image to an image sitemap and reference the same image by the same URL site-wide for crawl and cache efficiency. Alt text must be information-rich and keyword-appropriate but never stuffed: describe what makes this image different from the others on the page. Purely decorative images get `alt=""`.

**og:image.** One representative, high-resolution preview image per page, set via `og:image` and `schema primaryImageOfPage`. Not the logo, not text-heavy, not an extreme aspect ratio.

**Hard rules.** No em-dashes anywhere in any copy (use commas, colons, parentheses, or restructure); enforce this in a build guard. One H1 per page. Unique title and unique meta on every page (no duplicates across pages); enforce both in the build guard. British English throughout.

**Schema (for rich results only, not as an AI lever).** Site-wide: Organization or LocalBusiness, plus BreadcrumbList on every page. Model pages: Product with an Offer carrying the genuine "from" price and GBP currency. Guides: Article. FAQPage only where a real, visible Q&A block exists on the page.

**Compliance to respect in copy under these frames.** Standard buggies are private-land only and are not road legal in standard form; only type-approved or certain single-seat models can be made road legal (category L, IVA, DVLA). Never imply otherwise. Road-legal and insurance content is accuracy-critical. Hedge any price-beating claim as "beat any genuine like-for-like quote".

## Keyword volume confidence (read before trusting any volume in this document)

Not every keyword in this spec carries the same evidential weight. Treat them in three tiers.

**Tier 1: SEMrush-verified, UK, real demand.** These figures came from the SEMrush exports we pulled and are the ones to plan around: golf buggy (5,400, KD22), golf buggy for sale (2,400, KD24), golf buggies for sale (1,900, KD16), electric buggy (1,000, KD8), electric golf buggy (720, KD15), single seat golf buggy (590, KD3), golf buggy insurance (590, KD9), electric utility vehicle (590, KD9), golf buggies for sale uk (480, KD9), electric golf buggies (390, KD29), electric utility vehicles (390, KD10), utility vehicles for sale uk (260, KD3), electric utility vehicle uk (170, KD9), farm utility vehicles (170, KD15), golf buggy hire (170, KD10), golf buggy hire uk (110, KD16). Most of this volume sits in a small number of head terms.

**Tier 2: not yet pulled, estimated, confirm in SEMrush before relying on them.** The model-page descriptors (2 / 4 / 6 / 8 seater electric golf buggy), almost every sector keyword, almost every location keyword, and the new-guide targets (branded golf buggies, custom fleet branding) have not had their volume or difficulty pulled. They are sensible, high-intent terms worth targeting, but I cannot tell you they carry meaningful search volume until they are checked. Do not assume traffic from them. The right way to verify these is a SEMrush pull, not a web search (public volume tools disagree wildly and SEMrush is what the rest of this plan is calibrated to).

**Tier 3: present, but read loosely.** SEMrush keyword difficulty looks overstated in this niche (Golf Car UK ranks top-three for terms rated KD30 to KD50). That is good news for winnability, but it means you should read every KD as approximate, not precise.

**Where the real volume actually lives.** The Tier 1 head terms map mostly to the homepage, the range hub, the Tamar (utility) page and a few guides, not to the individual model pages. The model pages target descriptive long-tail. So the honest picture is: a handful of competitive head terms carry most of the discoverable demand, and the long-tail pages each capture small, specific intent. If the mental model was "each model page ranks for a high-volume term", that is not the case; set expectations accordingly.

---

# 1. Homepage

- **URL:** `/`
- **Intent:** Brand entry and category capture. Must establish the premium positioning and capture the core category terms (electric buggies, electric golf buggies) without forfeiting "golf buggy", which is the word the British public types.
- **Primary keyword:** electric buggies / electric golf buggies
- **Secondary:** electric buggy (1,000, KD8), golf buggy (5,400, KD22), electric golf buggy (720, KD15), premium / luxury golf buggies, electric utility vehicle
- **Title:** `Electric Buggies UK | Premium Golf & Utility Buggies` (~52)
- **Meta:** `Premium electric golf and utility buggies in the UK. Bespoke builds, custom fleet branding, a 3-year warranty and 24-hour VIP support. Request a tailored quote.` (~158)
- **H1:** `Premium Electric Buggies, Built to Order in Britain`
- **H2s:**
  - The range at a glance (2 to 8 seats, utility, bespoke)
  - Electric golf buggies for estates, resorts, clubs and events
  - Electric utility vehicles for work and grounds
  - Bespoke builds and custom fleet branding
  - Ownership: 3-year warranty, 24-hour VIP call-out, servicing
  - Why choose Electric Buggies (British marque, beat any genuine like-for-like quote)
  - Request a tailored quote
- **Hero image:** `premium-electric-golf-buggy-estate.webp` | alt: `Premium electric golf buggy parked on a country estate driveway`
- **og:image:** the hero above
- **Schema:** Organization or LocalBusiness, BreadcrumbList
- **Note:** The H1 carries the premium voice; the golf and cart terms are captured in the H2s, body and FAQ rather than the H1, so the page reads premium while still ranking for the high-demand generic terms. The live site's "no golf carts here" stance currently forfeits that traffic; soften it in body copy.

---

# 2. Range hub

- **URL:** `/range`
- **Intent:** Category and comparison page; routes to each model; should rank for the plural and "for sale" category terms.
- **Primary keyword:** electric golf buggies / electric buggies for sale
- **Secondary:** golf buggies for sale uk (480, KD9), electric golf buggies (390, KD29), 2 / 4 / 6 / 8 seater electric buggy
- **Title:** `Electric Buggies for Sale | The Full Range | Electric Buggies` (~60; if tight, drop the trailing brand: `Electric Buggies for Sale UK | The Full Range`)
- **Meta:** `Browse the full range of premium electric buggies, from 2 to 8 seats plus utility and bespoke models. Compare specs, prices and uses, then request a tailored quote.` (~160)
- **H1:** `The Electric Buggies Range`
- **H2s:**
  - Compare the range at a glance (comparison table: seats, range, from-price, best use)
  - 2 seater electric golf buggy: The Wye
  - 4 seater electric golf buggy: The Avon
  - 6 seater electric buggy: The Severn
  - 8 seater electric buggy: The Thames
  - Electric utility vehicle: The Tamar
  - Bespoke electric vehicles
  - How to choose the right model
  - Request a tailored quote
- **Hero image:** `electric-buggies-range-lineup.webp` | alt: `Line-up of the full electric buggies range from two to eight seats`
- **og:image:** the range line-up
- **Schema:** BreadcrumbList; optionally ItemList linking each model

---

# 3. Model pages

A single model template applied with model-specific values below. Shared H2 spine for every model page (adjust wording per model):

- The {Name} at a glance (key specs)
- Who the {Name} is for (seats and best uses)
- Range, battery and charging
- Performance and terrain
- Comfort and premium features
- Customisation and fleet branding
- Price and what is included (state the genuine from-price)
- Warranty, servicing and 24-hour VIP support
- Is it road legal? (link to the road-legal guide; standard models are private-land only)
- Request a tailored quote
- FAQ (real questions only; enables FAQPage schema)

Shared image pattern per model: hero `{seats}-seater-electric-golf-buggy-{name-lower}.webp`, alt describing the differentiator (seat count, finish, setting). Add 2 to 4 secondary images (interior, rear/cargo, charging, a branded-fleet example) each with a distinct alt. Schema on every model page: Product with an Offer carrying the from-price in GBP, plus BreadcrumbList.

### 3.1 The Wye (2 seater)

- **URL:** `/range/the-two`
- **Primary keyword:** 2 seater electric golf buggy
- **Secondary:** 2 seater golf buggy, two seater electric buggy, compact electric buggy
- **Title:** `2 Seater Electric Golf Buggy | The Wye | Electric Buggies` (~57)
- **Meta:** `The Wye is our 2 seater electric golf buggy: compact, quiet and refined. From £11,500, with bespoke branding, a 3-year warranty and 24-hour VIP support.` (~152)
- **H1:** `The Wye: A Premium 2 Seater Electric Golf Buggy`
- **From-price (schema + price section):** £11,500
- **Hero image:** `2-seater-electric-golf-buggy-the-wye.webp` | alt: `Two seater electric golf buggy in dark green on a resort path`

### 3.2 The Avon (4 seater): lead model, build first

- **URL:** `/range/the-four`
- **Intent:** The core, most-searched configuration; the page Claude Code should build first as the model-page template.
- **Primary keyword:** 4 seater electric golf buggy
- **Secondary:** 4 seater golf buggy, four seater electric buggy, 4 seat golf buggy, family electric golf buggy
- **Title:** `4 Seater Electric Golf Buggy | The Avon | Electric Buggies` (~58)
- **Meta:** `The Avon is our 4 seater electric golf buggy: refined, quiet and built for estates, resorts and clubs. From £14,900, with bespoke branding and a 3-year warranty.` (~159)
- **H1:** `The Avon: A Refined 4 Seater Electric Golf Buggy`
- **From-price:** £14,900
- **H2s:** the shared spine above, with "Who the Avon is for" naming estates, resorts, golf clubs and events
- **Hero image:** `4-seater-electric-golf-buggy-the-avon.webp` | alt: `Four seater electric golf buggy with cream seats on an estate drive`
- **Secondary images:** `the-avon-interior-four-seats.webp` (alt: `Interior of the Avon four seater electric buggy showing cream upholstery`); `the-avon-rear-cargo.webp`; `the-avon-charging.webp`; `the-avon-branded-fleet-example.webp` (alt: `The Avon electric buggy with custom resort fleet branding`)
- **og:image:** the hero
- **Note:** This is the reference build. Get the schema, image set, internal links and FAQ right here, then clone the pattern to the other five.

### 3.3 The Severn (6 seater)

- **URL:** `/range/the-six`
- **Primary keyword:** 6 seater electric buggy
- **Secondary:** 6 seater electric golf buggy, six seater golf buggy, 6 seat buggy, people mover (light)
- **Title:** `6 Seater Electric Buggy | The Severn | Electric Buggies` (~55)
- **Meta:** `The Severn is our 6 seater electric buggy for larger groups across estates, resorts and venues. From £18,900, with bespoke branding and a 3-year warranty.` (~155)
- **H1:** `The Severn: A Spacious 6 Seater Electric Buggy`
- **From-price:** £18,900
- **Hero image:** `6-seater-electric-buggy-the-severn.webp` | alt: `Six seater electric buggy carrying guests along a hotel driveway`

### 3.4 The Thames (8 seater): flagship

- **URL:** `/range/the-eight`
- **Primary keyword:** 8 seater electric buggy
- **Secondary:** 8 seater electric golf buggy, eight seater golf buggy, 8 seat people mover, shuttle buggy
- **Title:** `8 Seater Electric Buggy | The Thames | Electric Buggies` (~55)
- **Meta:** `The Thames is our flagship 8 seater electric buggy for shuttle and group transport. From £23,500, with bespoke branding, a 3-year warranty and 24-hour VIP support.` (~160)
- **H1:** `The Thames: Our Flagship 8 Seater Electric Buggy`
- **From-price:** £23,500
- **H2s:** shared spine, with a stronger "Shuttle and group transport" angle under "Who it is for"
- **Hero image:** `8-seater-electric-buggy-the-thames.webp` | alt: `Eight seater electric shuttle buggy carrying guests at a resort`

### 3.5 The Tamar (electric utility vehicle)

- **URL:** `/range/the-utility`
- **Intent:** Owns the lowest-competition cluster on the site (avg KD9). One strong page can take the whole cluster.
- **Primary keyword:** electric utility vehicle
- **Secondary:** electric utility vehicle uk (170, KD9), electric utility vehicles (390, KD10), utility vehicles for sale uk (260, KD3), 4x4 / road-legal / small electric utility vehicle, farm utility vehicle (170, KD15)
- **Title:** `Electric Utility Vehicle UK | The Tamar | Electric Buggies` (~57)
- **Meta:** `The Tamar is our electric utility vehicle for estates, farms, grounds and work sites. Cargo-ready, quiet and tough. From £15,900, with a 3-year warranty.` (~153)
- **H1:** `The Tamar: A Hard-Working Electric Utility Vehicle`
- **From-price:** £15,900
- **H2s (tuned to the cluster's modifiers and use-cases):**
  - The Tamar at a glance
  - Who it is for: estates, farms, grounds, work sites and warehouses
  - Cargo bed, towing and payload
  - Drivetrain and terrain (including 4x4 options)
  - Range, battery and charging
  - Is it road legal? (links to the road-legal guide)
  - Price and what is included
  - Warranty, servicing and 24-hour VIP support
  - Request a tailored quote
  - FAQ
- **Hero image:** `electric-utility-vehicle-the-tamar.webp` | alt: `Electric utility vehicle with a loaded cargo bed on a working farm`
- **Note:** Cross-link hard to the road-legal guide; "road legal" and "street legal" recur strongly in this cluster.

### 3.6 Bespoke

- **URL:** `/range/bespoke`
- **Intent:** Captures the bespoke and custom-branding demand; B2B fleet entry point.
- **Primary keyword:** bespoke electric buggy / custom golf buggy
- **Secondary:** branded golf buggies, custom fleet golf buggies, personalised electric buggy, bespoke electric vehicles
- **Title:** `Bespoke Electric Buggies | Custom Builds | Electric Buggies` (~58)
- **Meta:** `Bespoke electric buggies built to your specification, with custom fleet branding, finishes and fit-out. Tell us your requirements and request a tailored quote.` (~158)
- **H1:** `Bespoke Electric Buggies, Built Around You`
- **H2s:**
  - What we can customise (colour, trim, branding, fit-out)
  - Custom fleet branding for businesses
  - The bespoke process, step by step
  - Lead times and what to expect
  - Warranty and support on bespoke builds
  - Request a tailored quote
- **Hero image:** `bespoke-electric-buggy-custom-branding.webp` | alt: `Bespoke electric buggy in custom livery with company branding`
- **Schema:** BreadcrumbList (no fixed Offer price; "on request")

---

# 4. Configurator

- **URL:** `/configure`
- **Intent:** Interactive tool and a strong "build your own" capture; conversion-adjacent.
- **Primary keyword:** build your own electric buggy / configure electric golf buggy
- **Secondary:** customise electric buggy, golf buggy configurator
- **Title:** `Build Your Electric Buggy | Configurator | Electric Buggies` (~58)
- **Meta:** `Build your own electric buggy: choose the model, seats, colour, trim and branding, then save your build and request a tailored quote.` (~133)
- **H1:** `Build Your Electric Buggy`
- **H2s:** (these double as the configurator steps)
  - Choose your model
  - Seats and layout
  - Colour and finish
  - Trim and comfort
  - Branding and fit-out
  - Save, share or download your build
  - Request a tailored quote for your build
- **Hero image:** the configurator UI itself needs no decorative hero; if a banner is used, `configure-electric-buggy-banner.webp` | alt: `Electric buggy configurator showing colour and trim options`
- **Note:** Ensure the configurator's saved-build and quote flow point to `/request-a-quote`. Keep the page indexable but light on prose; the tool is the content.

---

# 5. Sector pages

These are B2B fleet-intent pages. Volumes are low and several keywords need confirming, but intent is high-value. One sector template, applied per sector. Shared H2 spine:

- The challenge for {sector}
- Recommended models and fleet for {sector}
- Custom branding and fit-out
- Capacity, range and charging for {use}
- Compliance and where they can be driven
- Servicing, warranty and 24-hour VIP call-out
- Hire or buy (where relevant)
- Request a tailored quote
- FAQ

Shared image pattern: hero `electric-buggies-{sector}.webp`, alt describing buggies in that setting. Schema: BreadcrumbList; FAQPage if a real FAQ is shown.

| Sector | URL | Primary keyword | Title (~chars) | H1 |
|---|---|---|---|---|
| Estates | `/sectors/estates` | electric buggies for estates / estate utility vehicle | `Electric Buggies for Estates \| Electric Buggies` (~48) | `Electric Buggies for Country Estates` |
| Resorts & hotels | `/sectors/resorts-hotels` | resort buggies / hotel golf buggies | `Electric Buggies for Resorts & Hotels \| Electric Buggies` (~57) | `Electric Buggies for Resorts and Hotels` |
| Golf clubs | `/sectors/golf-clubs` | golf buggies for golf clubs / fleet golf buggies | `Golf Buggies for Golf Clubs \| Fleet Supply` (~42) | `Electric Golf Buggies for Golf Clubs` |
| Festivals & events | `/sectors/festivals-events` | electric buggies for events / event buggy hire | `Electric Buggies for Events \| Hire & Buy \| Electric Buggies` (~58) | `Electric Buggies for Festivals and Events` |
| Holiday parks | `/sectors/holiday-parks` | holiday park buggies / electric buggies for holiday parks | `Electric Buggies for Holiday Parks \| Electric Buggies` (~54) | `Electric Buggies for Holiday Parks` |
| Film & TV | `/sectors/film-tv` | buggies for film and TV / production buggies | `Electric Buggies for Film & TV \| Electric Buggies` (~50) | `Electric Buggies for Film and TV Production` |

**Meta pattern (write one per sector, ~155 chars):** `Premium electric buggies for {sector}: {one sector-specific benefit}. Bespoke fleet branding, a 3-year warranty and 24-hour VIP support. Request a tailored quote.`

Worked examples:
- Estates: `Premium electric buggies and utility vehicles for country estates: move people, kit and game with ease. Bespoke branding and a 3-year warranty. Request a quote.` (~158)
- Resorts & hotels: `Premium electric buggies for resorts and hotels: refined guest transport and shuttle fleets. Bespoke branding, a 3-year warranty and 24-hour VIP support.` (~154)
- Golf clubs: `Electric golf buggies for golf clubs: reliable fleets, club branding and a 3-year warranty, with 24-hour VIP call-out. Beat any genuine like-for-like quote.` (~157)

---

# 6. Location pages

**Read this before optimising any location page.** There are roughly nineteen of these, and as a set they are the single biggest scaled-content and doorway-page risk on the site. Google treats near-identical pages that differ only by place name as low-value. The honest recommendation: keep a location page only where you can put genuinely unique local content on it (real delivery and import detail, local compliance, local use-cases, local references when you have them). Consolidate the thin ones into a single "Worldwide Delivery" page that lists the territories. Pages with real search behind them and a real story (for example Australia, where "golf buggy" runs at 5,400 a month, and the Gulf and Mediterranean luxury markets) are the ones worth keeping as standalone.

If a page is kept, here is its frame. Shared H2 spine:

- Premium electric buggies in {location}
- Models and popular configurations for {location}
- Delivery, import and logistics to {location}
- Bespoke builds and fleet branding
- Service, warranty and support in {location}
- Compliance and where they can be driven in {location}
- Request a tailored quote

Shared image pattern: hero `electric-buggies-{location}.webp`, alt: `Premium electric buggy in {location} {recognisable local setting}`. Schema: BreadcrumbList.

**Title pattern:** `Electric Buggies {Location} | Premium Delivery` (the brand token sits at the front only; do not also append it at the end, or the title truncates).
**H1 pattern:** `Premium Electric Buggies in {Location}`.
**Meta pattern (~155 chars):** `Premium electric and golf buggies delivered to {location}. Bespoke builds, custom fleet branding and a 3-year warranty. Request a tailored quote.`

Per-location primary keyword and title (each page individually specified):

| Location | URL | Primary keyword | Title |
|---|---|---|---|
| Dubai | `/locations/dubai` | golf buggies dubai / electric buggies dubai | `Electric & Golf Buggies Dubai \| Premium Delivery` |
| Abu Dhabi | `/locations/abu-dhabi` | golf buggies abu dhabi | `Electric & Golf Buggies Abu Dhabi \| Premium Delivery` |
| Saudi Arabia | `/locations/saudi-arabia` | golf buggies saudi arabia | `Electric & Golf Buggies Saudi Arabia \| Delivery` |
| Qatar | `/locations/qatar` | golf buggies qatar | `Electric & Golf Buggies Qatar \| Premium Delivery` |
| Monaco | `/locations/monaco` | electric buggies monaco / luxury golf buggies monaco | `Luxury Electric Buggies Monaco \| Premium Delivery` |
| French Riviera | `/locations/french-riviera` | electric buggies french riviera | `Electric Buggies French Riviera \| Premium Delivery` |
| Switzerland | `/locations/switzerland` | electric buggies switzerland | `Electric Buggies Switzerland \| Premium Delivery` |
| Lake Como | `/locations/lake-como` | electric buggies lake como | `Electric Buggies Lake Como \| Premium Delivery` |
| Marbella | `/locations/marbella` | golf buggies marbella | `Electric & Golf Buggies Marbella \| Premium Delivery` |
| Algarve | `/locations/algarve` | golf buggies algarve | `Electric & Golf Buggies Algarve \| Premium Delivery` |
| Maldives | `/locations/maldives` | resort buggies maldives | `Electric Resort Buggies Maldives \| Premium Delivery` |
| Mauritius | `/locations/mauritius` | resort buggies mauritius | `Electric Resort Buggies Mauritius \| Delivery` |
| Bermuda | `/locations/bermuda` | electric buggies bermuda | `Electric Buggies Bermuda \| Premium Delivery` |
| Bahamas | `/locations/bahamas` | golf buggies bahamas | `Electric & Golf Buggies Bahamas \| Delivery` |
| Singapore | `/locations/singapore` | electric buggies singapore | `Electric Buggies Singapore \| Premium Delivery` |
| Australia | `/locations/australia` | golf buggies australia | `Golf Buggies Australia \| Premium Electric Buggies` |
| New York | `/locations/new-york` | luxury golf carts new york / imported electric buggies | `Luxury Electric Buggies & Golf Carts New York` |
| USA | `/locations/usa` | luxury golf carts usa / imported electric buggies | `Luxury Electric Buggies & Golf Carts USA` |
| Scotland | `/locations/scotland` | golf buggies scotland | `Golf Buggies Scotland \| Premium Electric Buggies` |

Worked meta examples (write the rest from the pattern, and only for pages you keep):
- Dubai: `Premium electric and golf buggies delivered across Dubai. Bespoke builds, custom fleet branding and a 3-year warranty. Request a tailored quote.` (~143)
- Australia: `Premium electric golf buggies delivered across Australia. Bespoke builds, custom branding and a 3-year warranty. Request a tailored quote.` (~138)
- Monaco: `Luxury electric buggies delivered to Monaco and the Riviera. Bespoke builds, custom branding and a 3-year warranty. Request a tailored quote.` (~140)

**Important for the US and Australia pages:** these markets say "golf cart" (US) and use "golf buggy" heavily (Australia). Let those pages use the local term in the title, H1 and body. But be realistic: the bare US head terms "golf carts usa" and "golf carts new york" are huge and owned by established US sellers, and a UK premium importer will not rank for them. Target the qualified luxury and import intent instead (as set above) and treat these two pages as positioning, not head-term capture. Australia is the stronger case, since "golf buggy" runs at 5,400 a month there, though that exact term still needs a SEMrush pull for Australia before you rely on it.

---

# 7. Services

Service-line pages. Slugs are unconfirmed in the handover; confirm the real slugs before building and update the URLs below. One template each. Schema: Service or BreadcrumbList; FAQPage if a real FAQ is shown.

### 7.1 Hire

- **URL:** `/services/hire` (confirm slug)
- **Primary keyword:** golf buggy hire uk
- **Secondary:** golf buggy hire (170, KD10), electric buggy hire, event buggy hire
- **Title:** `Golf Buggy Hire UK | Electric Buggy Hire | Electric Buggies` (~58)
- **Meta:** `Electric and golf buggy hire across the UK for events, venues and seasonal needs. Fully serviced fleets with custom branding. Request a tailored quote.` (~150)
- **H1:** `Electric and Golf Buggy Hire`
- **H2s:** What you can hire; hire for events and venues; seasonal and long-term hire; branding on hire fleets; delivery, servicing and support; hire or buy; request a tailored quote; FAQ
- **Hero image:** `golf-buggy-hire-event-fleet.webp` | alt: `Fleet of electric buggies on hire at an outdoor event`

### 7.2 Shuttle

- **URL:** `/services/shuttle` (confirm slug)
- **Primary keyword:** electric shuttle / shuttle buggies for venues
- **Secondary:** passenger transport vehicle, electric people mover, venue shuttle
- **Title:** `Electric Shuttle Buggies for Venues | Electric Buggies` (~54)
- **Meta:** `Electric shuttle buggies for venues, campuses and resorts: move groups quietly and on schedule. Branded fleets, a 3-year warranty and 24-hour support.` (~150)
- **H1:** `Electric Shuttle Buggies for Venues`
- **H2s:** Where shuttle buggies work; recommended models (the Thames, the Severn); capacity and routing; branding; servicing, warranty and VIP call-out; hire or buy; request a tailored quote; FAQ
- **Hero image:** `electric-shuttle-buggy-venue.webp` | alt: `Eight seater electric shuttle buggy collecting guests at a venue`

### 7.3 VIP chauffeur

- **URL:** `/services/vip-chauffeur` (confirm slug)
- **Primary keyword:** vip buggy service / chauffeured electric buggy
- **Secondary:** vip guest transport, luxury buggy service
- **Title:** `VIP Chauffeured Electric Buggies | Electric Buggies` (~50)
- **Meta:** `Chauffeured electric buggies for VIP guest transport at events, resorts and estates. Discreet, refined and reliable. Request a tailored quote.` (~141)
- **H1:** `VIP Chauffeured Electric Buggy Service`
- **H2s:** Where VIP transport is used; the experience; vehicles and fit-out; branding; reliability and support; request a tailored quote; FAQ
- **Hero image:** `vip-chauffeured-electric-buggy.webp` | alt: `Chauffeur driving guests in a premium electric buggy at an event`

### 7.4 Service plan (servicing, warranty, call-out)

- **URL:** `/services/service-plan` (confirm slug)
- **Primary keyword:** golf buggy servicing / golf buggy repair
- **Secondary:** electric buggy maintenance, golf buggy warranty, 24-hour call-out
- **Title:** `Golf Buggy Servicing & Repair | Service Plans` (~45)
- **Meta:** `Servicing, repair and warranty plans for electric and golf buggies, with a 3-year warranty and 24-hour VIP call-out. Keep your fleet running. Get a quote.` (~152)
- **H1:** `Servicing, Repair and Warranty Plans`
- **H2s:** What the service plan covers; the 3-year warranty; 24-hour VIP call-out; servicing schedule; parts and accessories; repairs; request a tailored quote; FAQ
- **Hero image:** `electric-golf-buggy-servicing.webp` | alt: `Technician servicing an electric golf buggy in a workshop`
- **Note:** This page also supports the servicing/warranty guide and the parts cluster; cross-link both.

---

# 8. Ownership

- **URL:** `/ownership`
- **Intent:** Trust and supporting hub covering warranty, finance, delivery, charging and running costs; strong internal-link target; lower direct search volume.
- **Primary keyword:** electric golf buggy ownership / running costs
- **Secondary:** electric buggy warranty, electric golf buggy charging, electric vs petrol running cost
- **Title:** `Owning an Electric Buggy | Warranty & Support` (~45)
- **Meta:** `Everything about owning an electric buggy: the 3-year warranty, 24-hour VIP call-out, charging, running costs, servicing and finance. Request a tailored quote.` (~157)
- **H1:** `Owning an Electric Buggy`
- **H2s:** The 3-year warranty; 24-hour VIP call-out; charging and battery care; running costs (electric vs petrol); servicing and parts; finance and delivery; request a tailored quote
- **Hero image:** `electric-buggy-charging-at-home.webp` | alt: `Electric buggy charging beside a country house`
- **Note:** Link out to the running-cost and lithium-vs-lead-acid guides; link in from every model page's ownership H2.

---

# 9. About

- **URL:** `/about`
- **Intent:** Brand and trust (E-E-A-T support). Not a keyword target; keep it human and credible.
- **Primary keyword:** about Electric Buggies (brand)
- **Title:** `About Electric Buggies | A British Marque` (~41)
- **Meta:** `Electric Buggies is a British marque building premium electric and golf buggies to order, backed by a 3-year warranty and 24-hour VIP support.` (~140)
- **H1:** `About Electric Buggies`
- **H2s:** Who we are; how we build (made to order in Britain); our standards and warranty; the people behind it; how to reach us
- **Hero image:** `electric-buggies-workshop-britain.webp` | alt: `Electric buggies being assembled in a British workshop`
- **Note:** This page carries trust for the whole site. Use real detail (people, process, standards). Do not invent clients or awards.

---

# 10. Request a Quote

- **URL:** `/request-a-quote`
- **Intent:** The single conversion route. Keep indexable but it is not a keyword battleground; the job is to convert and to receive saved builds from the configurator.
- **Primary keyword:** request a quote / electric buggy quote
- **Title:** `Request a Tailored Quote | Electric Buggies` (~43)
- **Meta:** `Tell us what you need and request a tailored quote for a premium electric or golf buggy, a fleet, hire or a bespoke build. We aim to beat any genuine like-for-like quote.` (~166; trim to ~160: drop "premium")
- **H1:** `Request a Tailored Quote`
- **H2s:** What to tell us; personal or business quote; for fleets and bespoke builds; what happens next
- **Hero image:** none required; keep the page fast and form-led. If a banner is used: `request-a-tailored-quote.webp` | alt: `Premium electric buggy ready for a tailored quote`
- **Note:** Personal vs business quote flow lives here. Ensure the configurator's saved build is passed into this form. Do not let this page cannibalise the model pages for product terms; keep its copy conversion-focused, not keyword-stuffed.

---

# 11. Guides hub

- **URL:** `/guides`
- **Intent:** Content hub; topical authority; internal-link distributor. (Renamed from Journal, with 301s already in place from `/journal`.)
- **Primary keyword:** electric buggy guides / golf buggy advice
- **Title:** `Electric & Golf Buggy Guides | Advice | Electric Buggies` (~55)
- **Meta:** `Practical guides on buying, running and hiring electric and golf buggies: costs, road rules, batteries, and choosing for your sector. Expert, no-nonsense advice.` (~159)
- **H1:** `Electric and Golf Buggy Guides`
- **H2s:** the guide categories as sections: Buying Guides; Battery & Range; Regulations; By Sector
- **Hero image:** `electric-golf-buggy-guides.webp` | alt: `Electric golf buggy on an estate, illustrating the guides section`
- **Schema:** BreadcrumbList; optionally ItemList of the guides

---

# 12. Guides (the 10 live posts)

Per-guide on-page values below. Shared guidance for every guide: H1 is a clear, plain-English version of the title; H2s are the real sub-questions the article answers (mirror the People Also Ask phrasing where it fits, because that is what surfaces in search and AI answers); open with a short key-takeaways block; one representative hero image with a descriptive alt; Article schema with a real author and a genuine published or updated date (do not fake freshness; a real update helps, a date change alone does not). Cross-link each guide to the relevant model, sector or service page.

| Guide | URL | Primary keyword | Title | H1 |
|---|---|---|---|---|
| Cost of an electric golf buggy | `/guides/how-much-does-an-electric-golf-buggy-cost-uk` | how much does an electric golf buggy cost uk | `How Much Does an Electric Golf Buggy Cost? (UK)` | `How Much Does an Electric Golf Buggy Cost in the UK?` |
| Electric vs petrol running cost | `/guides/electric-vs-petrol-buggies-running-cost` | electric vs petrol golf buggy running cost | `Electric vs Petrol Buggies: Running Costs Compared` | `Electric vs Petrol Buggies: Which Costs Less to Run?` |
| Are golf buggies road legal | `/guides/are-golf-buggies-road-legal-uk` | are golf buggies road legal uk | `Are Golf Buggies Road Legal in the UK?` | `Are Golf Buggies Road Legal in the UK?` |
| Lithium vs lead-acid | `/guides/lithium-vs-lead-acid-range-lifespan` | lithium vs lead acid golf buggy battery | `Lithium vs Lead-Acid Buggy Batteries: Range & Life` | `Lithium vs Lead-Acid Buggy Batteries: Range and Lifespan` |
| Choosing a utility vehicle for an estate | `/guides/choosing-electric-utility-vehicle-country-estate` | electric utility vehicle for country estate | `Choosing an Electric Utility Vehicle for an Estate` | `How to Choose an Electric Utility Vehicle for a Country Estate` |
| Buyers' guide: resorts & hotels | `/guides/electric-buggies-resorts-hotels-buyers-guide` | electric buggies for resorts and hotels | `Electric Buggies for Resorts & Hotels: Buyers' Guide` | `Electric Buggies for Resorts and Hotels: A Buyers' Guide` |
| Practical guide: hotels & resorts | `/guides/hotels-and-resorts` | electric buggies for hotels | `Electric Buggies for Hotels and Resorts: A Practical Guide` | `Electric Buggies for Hotels and Resorts` |
| Hiring buggies for events | `/guides/hiring-electric-buggies-for-events` | hiring electric buggies for events | `Hiring Electric Buggies for Events: What to Know` | `Hiring Electric Buggies for Events` |
| Airport PRM transport | `/guides/airport-prm-transport-accessible-vehicles` | airport prm transport vehicles | `Airport PRM Transport: Accessible Electric Vehicles` | `Airport PRM Transport and Accessible Electric Vehicles` |
| Shuttle solutions for venues | `/guides/shuttle-solutions-for-venues` | shuttle solutions for venues | `Shuttle Solutions for Venues: Electric Buggies` | `Electric Shuttle Solutions for Venues` |

**Meta pattern (~155 chars):** `{Direct answer to the question in one line}. {One practical detail}. Read our guide.` Write one per guide; keep the primary keyword in the first half.

**Two priorities flagged in the content audit, to handle during this pass:**
1. The two resorts/hotels guides (`electric-buggies-resorts-hotels-buyers-guide` and `hotels-and-resorts`) overlap and are competing with each other. Consolidate into one stronger guide and 301 the weaker URL, or sharply differentiate their angles (buyers' guide on choosing and cost vs practical operations guide). Do not leave both as near-duplicates.
2. The road-legal guide is accuracy-critical (YMYL-adjacent). Make sure it states clearly that standard buggies are private-land only and that only type-approved or certain single-seat models can be made road legal (category L, IVA, DVLA). Get this right before anything else on that page.

---

# 13. Three priority new guides (briefed, not yet written)

These were identified as high-value gaps. On-page frames so they are ready to slot into the hub.

### 13.1 Golf buggy insurance

- **URL:** `/guides/golf-buggy-insurance-uk`
- **Primary keyword:** golf buggy insurance (590, KD9; high CPC, untapped)
- **Title:** `Golf Buggy Insurance UK: A Complete Guide | Electric Buggies` (~58)
- **H1:** `Golf Buggy Insurance in the UK: What You Need to Know`
- **Note:** Accuracy-critical, same care as the road-legal guide.

### 13.2 Custom fleet branding

- **URL:** `/guides/custom-fleet-branding-golf-buggies`
- **Primary keyword:** branded golf buggies / custom fleet branding
- **Title:** `Custom Fleet Branding for Golf Buggies | Electric Buggies` (~56)
- **H1:** `Custom Fleet Branding for Electric and Golf Buggies`

### 13.3 Servicing, warranty and call-out

- **URL:** `/guides/golf-buggy-servicing-warranty-call-out`
- **Primary keyword:** golf buggy servicing / warranty
- **Title:** `Golf Buggy Servicing, Warranty & Call-Out | Electric Buggies` (~59)
- **H1:** `Servicing, Warranty and Call-Out for Electric Buggies`

---

# 14. Build priority for Claude Code

Implement in this order so the highest-value pages are live first:

1. Homepage
2. The six model pages (build the Avon first as the template, then clone)
3. Range hub
4. Priority sector pages: estates, resorts-hotels, golf-clubs
5. Priority guides plus the two fixes (resorts/hotels consolidation, road-legal accuracy)
6. Services, ownership, about, request-a-quote
7. Location pages last, and only the ones kept after the consolidation decision

Enforce in a build guard across all pages: no em-dashes; exactly one H1 per page; unique title and unique meta per page; real `<img>` with descriptive filename and non-empty alt (except decorative); og:image set; Product+Offer schema present on model pages with a GBP from-price.

---

# 15. Will this "definitely" rank and get traffic? An honest answer

No one can promise a number-one position or a specific amount of traffic, and you should distrust anyone who does. Here is the honest picture so you can plan with your eyes open.

What this spec controls, and does well: it makes every page technically and editorially correct, points each page at a defensible keyword, and structures the pages the way search and AI systems reward. In a niche this weak (the head-SERP incumbents are thin on both links and content), that genuinely tips the odds in your favour.

What it does not control: the live domain being connected and indexed, the body copy being written to the non-commodity standard, the trust and links that accrue over time, and what competitors do. On-page work is necessary but not sufficient.

A realistic, tiered expectation:
- The very-low-difficulty terms (single seat golf buggy KD3, utility vehicles for sale uk KD3, the electric-utility cluster around KD9 to KD10, road-legal terms KD0 to KD3, parts and batteries KD1 to KD8) are the most winnable and the fastest. A correct page plus a live, indexed site plus a little time should compete here.
- The mid-difficulty head terms that carry the big volume (golf buggy 5,400 at KD22, golf buggy for sale 2,400 at KD24, golf buggies for sale 1,900 at KD16) are winnable in this weak niche but are slower and depend on links and authority accruing after launch. Expect months, not days, and not on deploy day.
- The Tier 2 unverified terms cannot be promised traffic at all until their volume is confirmed in SEMrush.

A product gap worth your attention: the single most efficient term on the whole board is single seat golf buggy (590 searches, KD3, very easy), and there is currently no page or model to rank it because the range starts at two seats. Either add a single-seat model and page, or target that demand through the road-legal guide. Right now that easy win is unclaimed.

A safety note: the road-legal and golf buggy insurance guides touch on the law and on money, so verify their factual claims against current DVLA guidance before publishing. This spec gives you the frame and the headings, not legally checked copy.

Bottom line: build to this spec, write the real copy, connect the domain and the webmaster tools, and earn a few real trade and sector mentions. Do that and strong positions are a realistic outcome over the months after launch. They are not a guarantee, and they are not instant.
