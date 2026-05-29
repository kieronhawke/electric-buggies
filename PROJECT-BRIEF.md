# Mayfair Vehicles — Website Build Brief

**Audience:** Claude Code (autonomous build agent)
**Goal:** Build and deploy a premium, fully-functional electric-vehicle dealer website + live configurator + admin CMS for **Mayfair Vehicles**, a UK seller of bespoke electric buggies and utility vehicles.
**Quality bar:** Match the polish of the Land Rover, Porsche and Tesla sites (reference screenshots are in `/references` — study them before and during the build).

---

## 0. How to use this brief

1. Read this whole document first. Then read every image in `/references/`.
2. Build in the **phases** in §11. Deploy after Phase 2 so the owner can see progress at a live URL, then keep shipping.
3. Treat §2 (Design Language) as non-negotiable. Everything must feel restrained, expensive and confident. When in doubt, do *less*, with more whitespace.
4. Where this brief and the reference screenshots disagree, the screenshots win on *look*; this brief wins on *features and structure*.
5. Content data to seed from: `/data/eagle-catalog.json` (187 listings, categorised). Curated image selections will be provided by the owner.

---

## 1. Project overview

Mayfair Vehicles sources electric vehicles from a manufacturer (Eagle EV) and sells them in the UK as a bespoke, white-label premium brand, to **estates, resorts & hotels, festivals & events, golf clubs, holiday parks, film & TV, and private land**. The site must:

- Present the range like a luxury automotive marque (not a golf-cart catalogue).
- Let customers **configure a vehicle** (colour, seats, roof, wheels, upholstery, accessories) with a **real-time visual preview**, see a running spec & indicative price, save/share the build, and **request a tailored quote** (Personal or Business). The final action is always a *quote request*, never a checkout — sales are bespoke/B2B.
- Give the owner a **simple admin** to edit all content, photos, ordering and SEO with no code.
- Rank in Google: fast, semantic, structured-data-rich, with dedicated keyword landing pages.

Primary conversion goal: **qualified quote requests.** Secondary: brochure downloads, saved builds, enquiry calls.

---

## 2. Design language (non-negotiable)

We have already forensically analysed Land Rover, Porsche and Tesla. Apply this synthesis:

**Take from each:**
- **Land Rover** → *structure*: step-tab configurator, a sticky price/CTA bar, a "Next Steps" card stack, a Personal vs Business split, named finish/spec tiers, and a two-layer site (an editorial "dream" layer + a precise "transact" layer).
- **Porsche** → *aesthetic ceiling*: a distinctive high-contrast serif for display, giant-numeral statistics with small unit labels, pill-shaped chips, cards where the product render bleeds beyond the card edge, poetic names for colour groups, and a slide-in technical-data drawer.
- **Tesla** → *transaction discipline*: ruthless minimalism, a single accent colour reserved for the primary CTA, sticky bars, and a simple, quiet mega-menu.

**Locked brand tokens:**
- **Palette:** warm paper `#f5f3ef`, secondary paper `#efece5`, white `#ffffff`, near-black ink `#16150f`, soft ink `#57534a`, hairline `#dcd6ca`, single accent (champagne) `#9a8150` / deep `#7c6638`. Near-monochrome. The accent appears only in tiny doses (eyebrows, hairlines, the primary CTA).
- **Type:** Display serif **Cormorant Garamond** (echoes the logo); UI/body sans **Jost** (letter-spaced for labels/eyebrows/nav). Self-host both via `next/font`. Never use Inter, Roboto, Arial or system-default fonts.
- **Logo:** wordmark = serif "MAYFAIR" over letter-spaced sans "VEHICLES". Asset in `/references/logo/`. Also render as live text where appropriate (it scales crisper).
- **Strapline:** *Electric · Bespoke · British.*
- **Motion:** slow, understated. One well-orchestrated staggered reveal per section on scroll (Framer Motion / `motion`), refined hover states, a transparent header that solidifies on scroll. Respect `prefers-reduced-motion`.
- **Layout:** generous negative space, large editorial imagery, full-bleed heroes, 2px-gap image grids, big type scale via `clamp()`. One `<h1>` per page.

A polished static prototype of the homepage already exists and captures the intended look — use it as the visual baseline and elevate it: `/references/prototype-homepage.html`.

---

## 3. Tech stack & architecture

- **Framework:** Next.js (latest, App Router) + TypeScript + React.
- **Styling:** Tailwind CSS (latest) with the brand tokens above defined as CSS variables / Tailwind theme.
- **Animation:** `motion` (Framer Motion).
- **CMS / admin:** **Sanity** (v3+). Embed Sanity Studio at `/studio`. Use Sanity's image CDN for all responsive image transforms (format, quality, crop, hotspot). Content is fetched via GROQ with ISR for SEO + speed.
- **Forms:** react-hook-form + zod.
- **Email (quote requests):** Resend.
- **Background removal:** admin one-click via remove.bg API (env key) **and** a local batch script using `rembg` (Python) for the initial catalogue. Store both original and cut-out versions.
- **Hosting/CI:** GitHub repo → Vercel, auto-deploy on push to `main`. Preview deploys on PRs.
- **Analytics:** Vercel Analytics; instructions for the owner to add Google Search Console + GA4.
- **Saved/shared builds:** encode the configuration in the URL (no auth/DB needed). "Save" also persists to `localStorage`. "Email my build" sends the config via Resend.

**Repo structure (guide):**
```
/app            # routes (App Router)
/components     # UI components
/components/configurator
/components/admin (if any custom)
/sanity         # schemas, studio config, client, queries
/lib            # utils, seo, structured-data
/public         # static assets, fonts, favicon
/references     # design screenshots, logo, prototype (DO NOT ship)
/data           # eagle-catalog.json + seed scripts
/scripts        # image download/optimise/bg-removal, sanity seed
```

---

## 4. Information architecture / sitemap

- `/` Home
- `/range` The Range (all models)
- `/range/[model]` Model detail (e.g. `/range/mayfair-four`)
- `/configure` and `/configure/[model]` The Configurator
- `/bespoke` Bespoke service
- `/ownership` Ownership & Warranty
- `/sectors` Sectors index → `/sectors/[sector]` (estates, resorts-hotels, festivals-events, golf-clubs, holiday-parks, film-tv)
- `/about`
- `/contact` & `/request-a-quote` (quote form, Personal/Business)
- **SEO landing pages:** `/electric-buggies`, `/electric-golf-buggies`, `/electric-utility-vehicles`, `/event-festival-buggies` (keyword-targeted, CMS-editable)
- `/studio` (admin)
- Legal: `/privacy`, `/terms`, `/cookies`
- `sitemap.xml`, `robots.txt`, `404`

---

## 5. Page-by-page specification

**Home** — full-bleed hero (editable image + headline + 2 CTAs: "Explore the Range", "Request a Tailored Quote"); short positioning statement; The Range (model cards, render bleeding past card, pill chips, "Enquire/Configure"); Sectors grid (image tiles); The Mayfair Difference (dark band, giant-numeral stats: 100% Electric, Bespoke, Warranty term, UK-wide); Bespoke/Configurator teaser; closing quote CTA; footer. All text/images/order CMS-driven.

**Range index** — filterable grid by category (2/4/6/8-seater, utility, cargo, food & beverage, security/patrol, special). Each card → model detail.

**Model detail** — editorial hero of the model; spec table (seats, range, battery, dimensions, top speed — fields editable); gallery (reorderable, lazy, lightbox); "Configure this model" CTA → configurator; technical-data slide-in drawer (Porsche-style); related models; sticky enquire bar. JSON-LD `Product`.

**Configurator** — see §6 (the centrepiece).

**Bespoke** — the made-to-order story; example builds; CTA to configurator/quote.

**Ownership & Warranty** — extended warranty (term is a CMS field — owner to confirm; placeholder "3-year"), delivery UK-wide, servicing/support, FAQs (accordion). JSON-LD `FAQPage`.

**Sectors** — index + one rich page per sector with sector-specific copy, imagery, recommended models, and use-cases. These are key SEO pages.

**About** — brand story, British/bespoke ethos, contact.

**Request a Quote** — Personal vs Business toggle (Land-Rover style). Fields adapt (Business adds company, fleet size). Accepts an attached saved configuration. Sends via Resend; optionally stores submission in Sanity. Success state + what-happens-next.

**SEO landing pages** — keyword-led, CMS-editable hero/intro/sections, internal links to range & sectors.

---

## 6. The Configurator (centrepiece)

UX modelled on Land Rover (step tabs + sticky summary) with Porsche-level finish.

**Layout:** large live preview (left/top) + options panel (right/bottom). Sticky summary bar: running indicative price + "Save", "Share", "Download spec", "Request quote".

**Steps (tabs):** Model → Exterior colour → Roof/canopy → Wheels → Seats & upholstery → Accessories → Summary.

**Live preview (build asset-agnostic):**
- v1 (now): a `<PreviewStage>` component that renders the model's base image and **recolours the bodywork in real time** using a per-model body **mask** (PNG alpha mask) composited over the photo on a `<canvas>` (multiply/hue-preserving tint), so changing colour updates the image instantly. Wheels/roof/accessories shown via overlay layers where assets exist, else reflected in the spec list.
- The component must accept a pluggable asset source so we can later swap in: (a) per-colour pre-rendered images, or (b) a **Three.js 3D model** with 360° rotation and true material swaps — **without rewriting the configurator.** Document this interface.

**Options data:** colours (with poetic group names + hex + finish type), roofs, wheel sets, upholstery, accessories, battery options — all defined in the CMS so the owner can add/edit options and prices.

**Pricing:** base price per model + option deltas → running total labelled "Indicative — final price on quotation."

**Save / Share / Quote:** configuration encoded in URL (shareable) and `localStorage`; "Download spec" generates a branded PDF of the build; "Request quote" carries the full config into the quote form.

**Honest note for the agent:** do not fake realism. The recolour preview should look clean and intentional; if a tint looks poor on a given photo, prefer a tasteful swatch + spec representation over an ugly composite. Flag in code comments where 3D/per-colour renders would elevate fidelity.

---

## 7. Admin / CMS (Sanity) — content model & workflows

The owner must be able to do ALL of the following with no code, from `/studio`:

**Editing workflows required:**
- Edit any **title, description, body copy**.
- Upload photos easily (drag-drop); **reorder** photos via drag handles (ordered arrays).
- **Background removal:** on an image, a "Remove background" action that calls remove.bg and stores the cut-out as a variant (keep original too). Also a bulk option.
- Edit **per-page SEO**: every page/document has an `seo` object — meta title, meta description, OG image, canonical override, `noindex` toggle. Surfaced prominently.
- Reorder models, sectors, homepage sections, configurator options.

**Schemas (collections):**
- `model` — name, slug, category, summary, body, **gallery (ordered images, each with alt)**, baseImage, **bodyMask**, specs (seats/range/battery/dimensions/topSpeed/...), basePrice, configurable options refs, `seo`.
- `configuratorOption` (or grouped: `colour`, `roof`, `wheel`, `upholstery`, `accessory`) — label, swatch/hex, finish, priceDelta, image/overlay, sort order.
- `sector` — name, slug, hero, intro, sections, recommended models, `seo`.
- `landingPage` — slug, hero, sections (portable text + image blocks), `seo`.
- `page` (about/ownership/bespoke/legal) — flexible sections + `seo`.
- `homepage` (singleton) — ordered sections referencing the above.
- `siteSettings` (singleton) — logo, nav, footer, contact (email/phone/address), warranty term, social, default SEO/OG.
- `quoteRequest` — (optional storage of submissions) name, contact, type (personal/business), config snapshot, message, timestamp.
- `faq` — question, answer, category.

Every front-end string/image that the owner could plausibly want to change must come from Sanity, not be hard-coded. Provide sensible seed content so the site is never empty.

---

## 8. Image pipeline

Source: Eagle EV catalogue — `/data/eagle-catalog.json` (categorised; 824 image URLs across 187 listings). The owner curates which images to use (a curation tool was provided; selections will be supplied as a list of URLs mapped to models).

**`/scripts` must include:**
1. `download-images.ts/.py` — download the curated (or all) image URLs, retry/dedupe, save originals to `/scripts/_raw`.
2. `optimise-images` — resize to responsive widths, convert to WebP/AVIF, strip metadata.
3. `remove-bg` — run `rembg` over selected product shots → transparent PNG cut-outs on neutral stages; keep originals.
4. `seed-sanity.ts` — create/seed `model` documents from `eagle-catalog.json`, upload chosen images to Sanity with alt text, set base masks where available.

All front-end images use `next/image` + Sanity transforms, responsive `sizes`, `loading="lazy"` (except LCP hero), and descriptive `alt` (pulled from model + context). Provide an `og:image` per page.

**Imagery gap to flag to the owner:** the catalogue gives clean *product* shots but no *lifestyle/environment* shots (estates, resorts, festivals) for heroes and sector tiles. Use tasteful placeholders/stock now; design so these slots are CMS-swappable when real photography arrives.

---

## 9. SEO & performance (must pass)

- Per-page unique `<title>` + meta description via Next `generateMetadata`, all overridable from the CMS `seo` object.
- Open Graph + Twitter cards on every page; per-page OG image.
- JSON-LD: `Organization` + `AutoDealer` (site-wide), `Product` (models), `BreadcrumbList`, `FAQPage` (ownership), `WebSite` + `SearchAction`.
- `app/sitemap.ts` (dynamic, includes CMS pages) + `robots.ts`.
- Semantic HTML, one `<h1>`/page, logical heading order, descriptive alt text, accessible nav, focus states, colour-contrast AA.
- Performance: target Lighthouse ≥95 across the board; LCP < 2.5s; preconnect fonts; self-hosted fonts; image optimisation; minimal client JS (configurator is the only heavy island).
- Clean, human-readable URLs; 301s set up where needed; canonical tags.
- Owner to-do (document in README): verify Google Search Console, submit sitemap, set up GA4.

---

## 10. Model lineup (seed)

Map catalogue categories → marque lineup (names editable later):
- **Mayfair Two** (2-seater) · **Mayfair Four** (4-seater) · **Mayfair Six** (6-seater) · **Mayfair Eight** (8-seater) · **Mayfair Utility** (utility/cargo) · **Bespoke** (made to order).
- Additional ranges available from the catalogue for later: Cargo/Box, Food & Beverage, Security/Patrol, Accessibility/Special. Build the data model so adding these is trivial.

---

## 11. Build phases (ship early, then iterate)

**Phase 0 — Setup:** init Next.js + TS + Tailwind + brand tokens + fonts; repo to GitHub; connect Vercel (live URL); base layout (header/footer/nav) matching the prototype.
**Phase 1 — Static premium pages:** Home, Range, Model detail, Sectors, Ownership, Bespoke, About, Contact/Quote — fully styled with seed content + placeholders. Deploy.
**Phase 2 — Sanity CMS:** schemas (§7), embedded Studio at `/studio`, wire all pages to CMS, seed content, SEO objects live. Owner can now edit everything. Deploy.
**Phase 3 — Image pipeline:** scripts (§8), import curated catalogue images, bg-removal, optimise, seed models. 
**Phase 4 — Configurator:** full UX (§6) with live recolour preview, options from CMS, pricing, save/share/PDF, quote hand-off. 
**Phase 5 — SEO + polish:** structured data, sitemap/robots, landing pages, Lighthouse pass, accessibility pass, motion polish, quote emails via Resend.
**Phase 6 — Handover:** README (how to edit content, add models, deploy), owner checklist (GSC/GA4, domain, API keys, warranty term confirmation).

Commit frequently with clear messages; keep `main` always deployable.

---

## 12. Definition of done

- Every page renders, is responsive (mobile-first), and matches the design language.
- Owner can, from `/studio`: edit titles/descriptions, upload + reorder photos, remove a background, and edit each page's SEO — verified end-to-end.
- Configurator changes colour (and other options) with an instant visual preview, shows indicative pricing, saves/shares, and submits a quote that arrives by email.
- Lighthouse ≥95 (Perf/SEO/Best-Practices/Accessibility) on Home, a Model page, and the Configurator.
- `sitemap.xml`/`robots.txt` valid; structured data passes Google's Rich Results test.
- Auto-deploys to Vercel on push; live URL works.
- README + owner checklist complete.

---

## 13. Accounts & environment variables

Owner provides (see SETUP.md). Expected env vars:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=
RESEND_API_KEY=
QUOTE_NOTIFICATION_EMAIL=
REMOVE_BG_API_KEY=        # optional (admin one-click bg removal)
NEXT_PUBLIC_SITE_URL=
```

---

## 14. Conventions

TypeScript strict; ESLint + Prettier; accessible, semantic components; no secrets in the repo (`.env.local` + Vercel env); meaningful commits; small, composable components; comments where an asset upgrade (3D/per-colour) would raise fidelity. Do not ship `/references`. Ask the owner only when blocked by a missing credential or a genuine brand decision — otherwise proceed using this brief and good taste.
