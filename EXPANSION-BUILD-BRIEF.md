# Electric Buggies — Expansion & Conversion Build Brief (v3)

**For:** Claude Code (autonomous). **Site:** https://electric-buggies.vercel.app (repo → Vercel auto-deploy).
**Purpose:** Turn the polished brochure into a **lead-generating sales engine**: richer content, stronger imagery, persuasive new pages, slick multi-step quote/hire/airport enquiry flows with autocomplete and abandoned-lead capture, more sectors and locations, and a deeper SEO blog. Maintain the established cool-monochrome, Land-Rover/Porsche-grade aesthetic. You may choose the best implementation, but cover everything below. Keep `main` deployable; deploy and re-verify live after each batch; run the existing Playwright/axe/crawl harness against new pages; record in `AUDIT-REPORT.md`.

**Owner assets:** product images live in a desktop folder named **"electric vehicle images"** — copy them into the repo (e.g. `/public/img/vehicles/`), optimise (next/image, AVIF/WebP), and use them everywhere a mock/placeholder buggy currently appears. **Reuse** across cards/heroes when they run out; ensure tasteful, consistent crops that look good on cards. No fabricated content anywhere.

---

## 1. Imagery & hero overhaul (P1 — visual credibility)
- **Replace ALL mock/illustrated buggies** with the owner's real photos (the "electric vehicle images" folder). Every range card, model hero, related-model card, sector "recommended" card, configurator preview fallback, and home range strip. Consistent aspect ratios; no layout shift; descriptive `alt`.
- **Homepage hero:** the current background isn't good enough. Replace with a **strong hero** — options, in order of preference: (a) a high-quality cinematic **buggy photo** from the owner's folder, well-treated (subtle gradient scrim for text legibility); (b) a short **muted auto-play loop video** (silent, `playsinline`, poster image, reduced-motion fallback to a still) of a buggy in an estate/resort setting if suitable footage exists; (c) a refined photographic composition. Avoid generic gradients/abstract backgrounds. Ensure mobile framing works (art-directed crop).
- Add lifestyle imagery to bare sections (estates/resorts/events/golf/airport) from available assets; where none exist, use tasteful interim stock clearly swappable via CMS, and flag to the owner what professional photography to commission.

## 2. Voice & copy cleanup (P1 — "doesn't sound like AI")
- **Remove em-dashes (—) sitewide** from all visible copy (home, models, sectors, locations, journal, about, ownership, forms, meta). Replace with full stops, commas, "and", or brackets as reads best. Apply to **Sanity content + hardcoded strings + meta descriptions + seed data**. Add a lint/check so they don't creep back in.
- **De-AI the tone:** vary sentence length, cut throat-clearing ("In today's world", "Whether you're…"), remove repetitive triads and over-balanced "not X, but Y" constructions, kill clichés. Read like a confident British marque written by a person. Keep it benefit-led and concrete.
- **Weave in keywords naturally** while editing (per `KEYWORD-MAP.md`): electric golf buggy, electric buggies UK, utility vehicles, resort/estate/event fleet, street-legal (where accurate), bespoke, etc. Headings, intros, alt text, meta — never stuffed.

## 3. NEW: Slick multi-step "Request a Quote" experience (P1 — core conversion)
Build a **full-page, multi-step** quote flow (keep it fast, modern, minimal friction; progress indicator; back/next; mobile-first; keyboard accessible; autosave between steps). Suggested order (refine for best UX):
1. **Your details:** first name, last name, email. *(Capture happens once email is entered — see abandoned-lead capture.)*
2. **Which buggies are you interested in?** Show **selectable image cards** (the real photos) — multi-select, effortless tapping.
3. **How many** are you looking for? (ranges or stepper.)
4. **Custom design/branding?** Yes/No. If yes, reveal: logos/branding, colour, roof/canopy, wheels, interior, seating layout, accessories, and other desirable options — easy chips/toggles.
5. **When do you need them?** Date / timeframe.
6. **Personal or Business?** If Business: **business name with Companies House autocomplete** (see §7) — type-ahead from the UK register; if not found, free-type is fine (no dead end).
7. **Delivery location / contact:** address (with finder, §7), phone (with country code if overseas, §7), notes.
8. **Review & submit:** summary + success state explaining what happens next; pre-fill from any configurator build (`Attached build · £x`).
- Validate server-side (zod), keep the existing rate-limit/honeypot/injection protections, email via Resend (once key set), and persist the lead.

## 4. NEW: Hire section + hire enquiry flow (P1)
- **/hire landing page:** explains hiring buggies for events/business — one unit to a full fleet, passenger transport and operations vehicles, cost-effective. **No prices on the page** (quote-led). Persuasive, benefit-led, with imagery, use-cases (weddings, festivals, corporate, film/TV, sporting events), FAQ, and a clear **"Request a hire quote"** CTA.
- **Hire quote flow** (same slick multi-step pattern as §3, tailored): select vehicles by image, quantity, **hire dates (from/to)**, **delivery address** (UK finder + overseas finder for top countries), do you need **drivers** (we provide / you provide), event type, contact details (with overseas area code). Review + submit + abandoned-lead capture.

## 5. NEW: Airport sector + dedicated airport quote (P1)
- **/sectors/airports page:** specialist **airside transport** — passenger transfer, crew transport, and **Passengers of Reduced Mobility (PRM)** assistance with **adapted/accessible vehicles** (ramps, wheelchair-accessible, assisted boarding). Research-informed copy on PRM duties and the kind of specialist/adapted vehicles airports use; position us as supplying compliant, dignified, reliable fleets. Include the line that **we beat any genuine like-for-like quote on price** (phrase carefully and truthfully, e.g. "we'll aim to beat any like-for-like quote"). FAQ, recommended models, imagery, internal links.
- **Dedicated "Get an airport quote" button → short quiz:** model interested in, estimated number of vehicles, location (**address finder autocomplete**), then name, organisation, phone, email. Slick, few steps, abandoned-lead capture.

## 6. NEW: Custom shuttle service + VIP chauffeur pages (P1)
- **/services/shuttle (Custom Shuttle Service):** we design a **shuttle solution** with a fleet that moves guests around private land and venues — an all-VIP experience or an **accessibility** function. Two models: (a) **complimentary/branded** shuttle; (b) **paid per-ride** option (guests pay per ride, minimal cost to the business). **Drivers:** we provide, or you provide. Sales-led copy, use-cases, how-it-works, FAQ, CTA to enquire.
- **/services/vip-chauffeur (VIP Chauffeur Buggy Service):** a polished **sales pitch** page — "Enhance your event with a VIP experience": chauffeured buggies for guests/VIPs, branded, white-glove. Imagery, benefits, occasions (weddings, galas, hospitality, golf days), testimonial slot (illustrative until real), CTA.

## 7. Autocomplete & data integrations (use these specific tools)
- **UK business autocomplete → Companies House Public Data API** (official, **free** API key, search-as-you-type; rate limit ~2 req/sec). Use the **company search** endpoint for type-ahead on business name; on select, capture name + registered address + company number; **always allow free-text** fallback if not registered. Key is server-side only; proxy via an API route to protect it and handle rate-limiting/debounce.
- **Address finder → Google Places Autocomplete (New)** as the primary (covers **UK + international**; restrict/bias by country; session-token pricing). Detect overseas vs UK and, when overseas, surface a **country/area-code selector** for phone. Cheaper UK-only alternative if preferred: **getAddress.io** (UK postcode lookup, freemium). Make the provider swappable behind one component; key server-side via an API route. (Both are **owner-credential items** — wire the integration, gate behind env keys, and add to the owner action list; degrade gracefully to manual entry if no key yet.)
- **Phone input:** international format with country-code dropdown (e.g. an intl-tel style component); default UK, auto-switch if an overseas address is detected.

## 8. NEW: Abandoned-lead capture + admin dashboard (P1)
- **Persist partial leads:** the moment a valid **email** is entered in any quote/hire/airport flow, save the lead server-side (email + whatever's been entered so far), then keep updating as they progress. If they don't submit, it's an **abandoned enquiry**.
- **Admin dashboard** (protected route, e.g. `/admin`, auth-gated — simple password/Sanity auth/NextAuth as appropriate; never public): list **submitted** and **abandoned** enquiries with all captured fields, timestamps, source flow, and configurator build if attached. Sortable/filterable; export (CSV) is a plus.
- Store leads safely (Sanity dataset or a lightweight DB); GDPR-minded (only what's needed, a privacy note on the forms, the existing cookie consent). Don't expose lead data publicly or in the client bundle.

## 9. Expand LOCATIONS — rank where we deliver (P1 — SEO reach)
- Keep Dubai/Scotland/Bermuda/New York. **Add 15 more country/region pages** for the markets most likely to buy premium electric buggies/golf carts. Suggested set (confirm/adjust): **USA, UAE (Abu Dhabi), Saudi Arabia, Qatar, Switzerland, Monaco, France (French Riviera), Spain (Marbella/Costa del Sol), Italy (Lake Como/Sardinia), Portugal (Algarve), Maldives, Mauritius, Singapore, Australia, Caribbean (Bahamas/Barbados)**. 
- Each page: **unique, localized copy** (climate, terrain, resort/estate/golf context, typical use-cases, delivery & shipping note, lead time), localized imagery, recommended models, FAQ, CTA, `Service`+`areaServed` JSON-LD, clean self-contained meta description, **per-page OG**, internal links. **Not thin/duplicated** — write each with genuine local specifics. Make all CMS-editable (extend the location schema) and add to sitemap + Locations mega-menu/index ("All locations").

## 10. Expand SECTORS & content depth (P1)
- **Festivals & Events:** much more content — detailed use-cases (artist transport, accessibility, VIP, production/ops, medical), more Q&A, imagery, social-proof slot, internal links to Hire/Shuttle/VIP. 
- Ensure **every sector page** (Estates, Resorts & Hotels, Golf Clubs, Festivals & Events, + new Airports) is rich: problem→solution, recommended models, FAQ (`FAQPage` JSON-LD), imagery, CTA, internal links — no bare pages.
- Cross-link sectors ↔ services (shuttle, VIP, hire) ↔ models ↔ locations.

## 11. NEW: Service plan / 24-hour callout (P1)
- **/ownership/service-plan (or /services/service-plan):** a stronger service story — **24-hour call-out**, **VIP technical team that comes to your location** to repair, **operating 24/7**. **Buying from outside the UK is no problem** — the team aims to be with you **within 24–48 hours**. "The experts come to you." Tiered service-plan framing (what's included), reassurance for international buyers, FAQ, CTA. Link from Ownership and model pages.

## 12. Improve ABOUT + all bare sections (P1)
- **About:** currently too bare. Add depth — the founding story, the standard/ethos, how bespoke works (source proven platforms → rebuild to a British marque), why electric, the warranty/service promise, the sectors served, and a **"Speak to a member of the team"** block with a **friendly team photo** beside the phone number (see §13). Add tasteful graphics/animation, stats, and a clear CTA. Make it want-to-buy, not just informative.
- Sweep the whole site for **bare/thin sections** and enrich them: more persuasive copy, supporting imagery, subtle scroll animations/interactive elements (without hurting performance or reduced-motion users).

## 13. "Speak to a member of the team" (P1 — trust)
- Promote a **human contact** option prominently (quote pages, contact, footer, about): a **friendly team photo** next to the **phone number** and email, with a warm line ("Speak to a member of the team"). Until a real photo exists, use a tasteful placeholder and flag it as an asset to provide. Consider a small "we typically reply within X hours" reassurance.

## 14. Journal/blog — deepen for SEO (P1)
- **Add more posts** targeting buyer questions and the new sectors/locations (e.g. airport PRM transport, hiring buggies for events, shuttle solutions, running-cost/ROI vs petrol, choosing a fleet for a resort, country-specific guides). 
- **Fully SEO-optimised front + back:** unique title/description (no truncation, **no em-dashes**), per-post OG, `BlogPosting` JSON-LD, reading time, author, TOC, related posts, internal links to money pages, RSS. Audit existing posts for the same and fix.
- See what comparable premium/auto/fleet sites cover that we don't (buying guides, comparisons, total-cost, case studies, FAQs hub) and fill the gaps.

## 15. Site-wide "make it better" review (P1)
Do a full pass for opportunities to add depth, persuasion, and polish: richer module designs, interactive elements (e.g. configurator teasers, comparison, maps, galleries with zoom), trust signals, clearer CTAs, consistent premium motion, and stronger storytelling. List anything substantial you defer. Keep performance (Lighthouse ≥95 target), accessibility (WCAG AA), and the cool-monochrome aesthetic intact.

---

## Build order (suggested)
1. Imagery overhaul + hero + em-dash/voice cleanup (immediate visual + tone lift).
2. New multi-step Quote flow + abandoned-lead capture + admin dashboard.
3. Hire section + hire flow; Airport sector + airport quiz; integrations (Companies House, Google Places, phone).
4. Shuttle + VIP chauffeur + Service plan pages; expand Festivals/Events + sectors; enrich About + bare sections + team block.
5. +15 location pages; deepen Journal.
6. Run full test harness on everything; update `AUDIT-REPORT.md`.

## Owner action list (add to it; non-blocking where possible)
- **Companies House API key** (free) — for UK business autocomplete.
- **Google Places API key** (or getAddress.io) — for the address finder (UK + international).
- **Resend key** — so all the new forms actually email leads.
- **Real assets to provide:** professional product photography, a friendly **team photo**, any **video** footage for the hero, and genuine **testimonials/case studies** when available.
- Previously noted: real **domain + email + phone**, **GA4 + Search Console**, **3D models**.
Wire every integration behind env keys and **degrade gracefully** (manual entry / logged leads) so the site keeps working before keys are added.
