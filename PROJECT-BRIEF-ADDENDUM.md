# Electric Buggies — Brief Addendum (v2.2)

**Use alongside `PROJECT-BRIEF.md` (v2).** Where this addendum adds or refines detail, it takes precedence. It expands: (A) mobile excellence, (B) the configurator, (C) the blog, (D) location subsites, (E) SEO & keyword strategy, (F) sector subpages, (G) customer **logo/branding** in the configurator, (H) the **3D rendering** plan, (I) a **page-by-page completion standard**. Reference files in `/references`: `prototype-homepage-v2.html` (overall look), `configurator-prototype.html` (configurator UX + live recolour to replicate with photographic assets). Companion doc: **`3D-RENDERING-STRATEGY.md`** (read it for §H).

---

## A. Mobile experience — must equal or exceed Porsche / Land Rover
Mobile is a first-class target, not a shrink of desktop. Study the reference screenshots for exact patterns and match that quality.
- **Mobile-first & fluid:** design at 380px first; fluid type/spacing via `clamp()`; tap targets ≥ 44px; safe-area insets honoured.
- **Slick, modern motion (60fps, transform/opacity only):**
  - Scroll-reveal on every section (staggered), with a subtle parallax on hero/feature imagery.
  - Full-screen slide-in nav with staggered item reveal and a smooth open/close; body scroll lock while open.
  - Sticky **bottom action bar** on key pages (e.g. "Request a quote" / "Configure") that appears on scroll.
  - Swipeable, momentum carousels for model galleries and the range (horizontal snap).
  - Micro-interactions: gentle scale/opacity on tap; animated counters for stats; smooth number tween for prices.
  - Page/route transitions (fade/slide) via `motion`.
- **Performance budget:** Lighthouse mobile ≥ 95; LCP < 2.5s; preconnect + self-hosted fonts; `next/image` with correct `sizes`; lazy-load below the fold; ship minimal JS (configurator is the only heavy island, code-split). Always honour `prefers-reduced-motion`.
- **Layout patterns:** full-bleed image sections; generous whitespace; sticky section labels; large legible type; never cramped.

---

## B. Configurator — "Start a new build" (centrepiece; match LR/Porsche exactly)
Replicate the UX in `configurator-prototype.html`, elevated with photographic assets. Reachable from nav ("Configure"), each model page ("Configure this model"), and a prominent home CTA.
- **Layout:** large live **preview stage** + **step rail**. Desktop = two columns + sticky summary bar; mobile = preview pinned top, options in a scrollable panel / bottom sheet, sticky price bar at the bottom. Step tabs scroll horizontally on mobile.
- **Steps (with progress + Back/Next):** Model → Exterior colour → Roof/canopy → Wheels → Interior & upholstery → Accessories (multi-select) → Summary.
- **Live preview:** the selected option updates the preview **instantly** with a smooth cross-fade. v1 uses **photographic recolour** of the buggy bodywork via a per-model PNG alpha **mask** composited on `<canvas>` (hue/saturation-preserving tint), plus overlay layers for roof/wheels/accessories where assets exist; anything without a layer is reflected in the spec + summary. **Finish types** (solid / metallic / matte) visibly affect sheen. Build the `<PreviewStage>` with a **pluggable asset source** so per-colour pre-rendered images or a **Three.js 3D model (360° rotation + true material swaps)** drop in later **without rewriting** the configurator — document this interface.
- **Options data** (colours w/ poetic names + hex + finish, roofs, wheel sets w/ visuals, upholstery, accessories, battery/range) live in the **CMS** with editable prices.
- **Pricing:** base + option deltas → running **indicative total** with an animated tween and a line-item breakdown drawer; labelled "Indicative — final price on quotation." Includes Reset.
- **Persistence & hand-off:** **Save** (config encoded in URL + `localStorage`), **Share** (copy link), **Download spec** (branded PDF of the build), **Request a quote** (carries the full configuration into the Personal/Business quote form).
- **Polish:** animated tab/option transitions, selected-state rings, keyboard accessible, focus states, AA contrast. The bar for quality is Land Rover / Porsche — if a photographic tint ever looks poor, prefer a clean swatch + spec representation and comment where 3D/per-colour renders would raise fidelity.

---

## C. Blog / editorial (modern, slick, SEO engine)
A genuinely modern blog that doubles as the organic-search engine.
- **Routes:** `/blog` (index) and `/blog/[slug]` (post); category routes `/blog/category/[slug]`; optional tag routes.
- **Index design:** featured/hero post, clean card grid, category filter, search, pagination/infinite scroll; modern, image-led, lots of whitespace — same design language.
- **Post design:** large editorial hero, highly readable measure and typography, sticky table-of-contents on long posts, author + date + reading time, inline images/pull-quotes/figures, related posts, share buttons, prev/next, and a contextual CTA (configurator / quote / relevant location).
- **Authoring:** posts created in **Sanity** (Portable Text with image, quote, and callout blocks; categories, tags, author, cover image, excerpt, and a per-post **SEO** object). Easy for a non-technical editor.
- **SEO:** `BlogPosting`/`Article` JSON-LD, `BreadcrumbList`, canonical, per-post OG image, included in `sitemap.xml`, plus an **RSS feed** at `/rss.xml`. Each post targets a keyword cluster (see §E) and internally links to range / sectors / locations.
- **Seed content (cornerstone posts at launch):** e.g. "How much does an electric golf buggy cost in the UK?", "Are golf buggies road-legal in the UK?", "Choosing an electric utility vehicle for a country estate", "Electric buggies for resorts & hotels: a buyer's guide", "Lithium vs lead-acid: range & lifespan explained". Then an ongoing cadence.

---

## D. Location subsites (geo landing pages, SEO from day one)
- **Routes:** `/locations` (index) + `/locations/[location]`. Launch set: **Dubai, Scotland, Bermuda, New York**, with the data model built so new locations are added in the CMS in minutes.
- **Each page includes:** a localized hero (place-specific imagery + headline), an intro on serving that market, the **fleet/range** relevant to it, **local use-cases** (e.g. Dubai → resorts, hospitality, desert-edge developments; Scotland → estates, golf, Highland resorts; Bermuda → eco-conscious resorts, island transport; New York → estates, events, campuses), delivery/shipping notes for the region, location-specific FAQs, and a strong enquiry CTA. Localised internal links to relevant sectors and blog posts.
- **Schema:** `Service` with `areaServed` (and `LocalBusiness` where a real presence exists), plus `BreadcrumbList`. Currency/units shown appropriately per region where helpful.
- **⚠️ Critical SEO discipline:** these must be **substantial, genuinely localised, unique** pages — **not thin or duplicated "doorway" pages**, which Google penalises. Each needs original copy, local imagery, and real local relevance. Generate distinct content per location; never clone one page with the place-name swapped.
- **Honest business note for the owner (surface in README):** publishing a location page captures search interest and routes enquiries, but actually *serving* Dubai/Bermuda/New York involves shipping, duties, and possibly local compliance — a commercial decision. Pages should be truthful about what's offered (e.g. "delivered worldwide from the UK") rather than implying a local depot that doesn't exist.

---

## E. SEO architecture & keyword strategy (embedded from day one)
**Technical infrastructure (backend for ranking):**
- Server-rendered / statically generated pages (Next.js) for fast, crawlable HTML.
- Per-page unique title + meta description via `generateMetadata`, all **CMS-overridable** (every document has an `seo` object: title, description, OG image, canonical, `noindex`).
- JSON-LD per page type: `Organization` + `AutoDealer` (site-wide), `Product` (models), `Service`+`areaServed` (sectors & locations), `BlogPosting` (posts), `FAQPage` (ownership/sector/location FAQs), `BreadcrumbList`, `WebSite` + `SearchAction`.
- Dynamic `app/sitemap.ts` including models, sectors, locations, blog, landing pages; `robots.ts`; canonical tags; a maintained **301 redirect map**; clean human-readable URLs; breadcrumbs everywhere.
- Core Web Vitals green; descriptive image `alt`; logical heading hierarchy (one `<h1>`/page); accessible, semantic markup.
- A reusable **internal-linking** system (related models, "buggies for [sector]", "[model] in [location]", related posts) to build topical authority.
- Owner README to-do: verify **Google Search Console**, submit sitemap, add **GA4**, validate structured data (Rich Results test).

**Site structure = pillar + cluster.** Pillars: The Range, the Configurator, each **Sector**, each **Location**, and the **Blog**. Clusters (model pages, blog posts, FAQs) link inward to their pillar and across to relevant locations/sectors.

**Keyword groups to target (build pages/sections/posts around these — go broad):**
- **Category / product:** electric buggies, electric golf buggies, electric golf carts UK, electric utility vehicles, off-road electric buggy, lithium golf buggy, street-legal golf buggy UK, luxury electric buggy.
- **Use / sector:** golf club buggies, resort golf carts, hotel shuttle buggies, festival & event buggies, holiday park buggies, country estate utility vehicles, grounds-keeping vehicles, security/patrol vehicles, airport/campus shuttle carts.
- **Commercial intent:** buy / for sale / price / cost / hire / lease / suppliers + the above (e.g. "electric golf buggy for sale UK", "electric utility vehicle price").
- **Location:** the above + Dubai / Scotland / Bermuda / New York / UK / London (e.g. "electric vehicles Dubai", "golf buggies Scotland").
- **Informational (blog):** cost guides, road-legal/regulation explainers, buying guides, battery & range explainers, comparisons (vs petrol; brand vs brand), maintenance, "best [vehicle] for [use]".
Map each target group to a specific page or post; track and expand over time.

---

## F. Sector subpages (deep, solution-led)
Every sector gets its **own rich page** under `/sectors/[sector]` — **Country Estates, Resorts & Hotels, Golf Clubs, Festivals & Events, Holiday Parks, Film & Television** (extend in CMS). Each page:
- Frames the sector's **problem → solution** ("what we offer / the solutions we provide"): the specific needs of that setting and how the fleet meets them.
- Shows **recommended models/configurations** for that use, with links to configure.
- Includes sector-specific imagery, example use-cases/mini case studies, an FAQ (`FAQPage` schema), and a tailored enquiry CTA.
- Targets the sector keyword group (§E) and links internally to relevant **locations** and **blog** posts.
All sector content is CMS-editable (copy, imagery, recommended models, SEO).

---

## Navigation additions
Add to the header/menus from the v2 prototype: a **Locations** entry (mega-menu listing Dubai / Scotland / Bermuda / New York + "All locations") and a **Blog/Journal** entry (top-level or within an "Explore" group). Keep the persistent **Request a Quote** button. Reflect all new sections in the footer too.

---

## G. Customer logo / branding in the configurator
A core B2B feature (branded fleets for resorts, estates, events, golf clubs). Add a **Branding** step to the configurator:
- Customer **uploads a logo** (transparent PNG/SVG), then chooses **placement** from predefined zones — e.g. **front panel, both sides, rear, bonnet** — with scale/position adjustment, and sees it applied on the preview.
- **2D phase (now):** composite the uploaded logo onto defined **hotspots** per photo view (front/side/rear), scaled to the zone.
- **3D phase (later):** project the logo onto the mesh via drei **`<Decal>`** at a chosen anchor, or map to predefined **UV decal zones** per model.
- The chosen logo + placement are saved into the build and **carried into the quote** so the team produces it exactly. The CMS defines available logo zones per model and stores the uploaded asset with the configuration.
- Sensible guards: accepted file types/size, a note that final artwork is confirmed at quotation.

## H. 3D rendering plan (see `3D-RENDERING-STRATEGY.md`)
The configurator's `<PreviewStage>` MUST be engine-agnostic so visualisation can advance **without a rewrite**. Implement in this order:
- **Now:** photographic **2D recolour** + 2D logo hotspots (works with existing photos).
- **Then:** integrate **GLB/glTF 3D models** rendered with **React Three Fiber + `@react-three/drei`** — real-time colour/material/part swaps, **`OrbitControls`** 360° rotation, **`Environment`** lighting, **`<Decal>`** logo placement; compress models (Draco/meshopt via `gltf-transform`); lazy-load the 3D island; 2D fallback on low-power devices; later add **AR** via Google `<model-viewer>`/USDZ.
- **Model sourcing** is a production task (AI image-to-3D → Blender cleanup, marketplace base models, photogrammetry once a unit exists, or commission) — see the strategy doc. Build the code so dropping in a model per `model` document "just works": store a `model3d` (GLB) field and `decalZones` on each `model` in the CMS, with the 2D assets as fallback. Do **not** block earlier phases on 3D.

## I. Page-by-page completion standard (review every page to a high bar)
Every page must be finished to a premium standard — no placeholder lorem, no broken links, no empty states, responsive and animated, with its own SEO. Checklist per page:
- **Home:** hero, positioning, range, sectors, difference/stats, configurator + branding teaser, locations strip, latest-from-blog strip, quote CTA, footer. One `<h1>`; `AutoDealer`/`Organization` JSON-LD.
- **Range index:** filterable grid, all models, consistent cards, empty/loading states handled.
- **Model detail (×each):** editorial hero, full spec table, reorderable gallery + lightbox, Configure CTA, tech-data drawer, related models, sticky enquire bar; `Product` JSON-LD.
- **Configurator:** all steps incl. **Branding**; live preview; indicative pricing w/ breakdown; save/share/PDF; quote hand-off; flawless on mobile (preview pinned, bottom-sheet options, sticky price).
- **Bespoke:** story + example builds + CTA.
- **Ownership:** warranty (CMS term), delivery, servicing, FAQ accordion; `FAQPage` JSON-LD.
- **Sectors index + each sector page:** problem→solution copy, recommended models, imagery, FAQ, CTA; `Service`/`areaServed` JSON-LD; internal links.
- **Locations index + each location (Dubai/Scotland/Bermuda/New York):** unique localized copy & imagery, fleet, local use-cases, delivery note, FAQ, CTA; `Service`+`areaServed`; **not thin/duplicated**.
- **Blog index + post:** modern grid, categories, search; post with TOC, author, reading time, related, share; `BlogPosting` JSON-LD + RSS.
- **About / Contact / Request-a-Quote:** brand story; Personal/Business quote flow that emails via Resend and accepts a saved build; success state.
- **Legal (privacy/terms/cookies), 404, sitemap.xml, robots.txt:** present and correct.
- **Global:** working mega-menu dropdowns (desktop + mobile), header scroll state, consistent motion, AA contrast, keyboard accessibility, Lighthouse ≥95 (incl. mobile), no console errors.
After building, the agent should **self-review each route against this list** and fix gaps before declaring done.

---

## Coverage note for the build agent
Definition-of-done now also requires: excellent animated mobile across all pages; a working configurator matching the prototype's UX with photographic recolour **and a Branding/logo step**; an engine-agnostic `<PreviewStage>` ready for **R3F 3D + drei `<Decal>`** per `3D-RENDERING-STRATEGY.md`; a fully functional Sanity-authored blog with Article schema + RSS; location subsites (Dubai/Scotland/Bermuda/New York) that are unique and SEO-complete; deep solution-led sector pages; the full SEO infrastructure + keyword mapping above; and **every page finished to the §I standard** — all verifiable, all CMS-editable, deployed to the `electric-buggies` Vercel project.
