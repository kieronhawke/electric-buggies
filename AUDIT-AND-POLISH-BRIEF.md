# Electric Buggies — Deep-Dive Audit & Polish Brief

**For:** Claude Code (autonomous). **Site:** https://electric-buggies.vercel.app · repo connected to Vercel (auto-deploy on push).
**Objective:** Take the working "bare-bones" site to a polished, secure, fully-functional, SEO-complete, Google-ready product that stands next to Land Rover / Porsche / Tesla. Be exhaustive — review **every page, every component, every line of code, and especially the UX**. You may decide the best implementation, but cover everything below. Work autonomously; only pause for a missing credential or a genuine brand/business decision.

## 0. Process (how to run this)
1. **Crawl every route** (list from `app/` + sitemap). For each, check desktop + mobile rendering, console errors/warnings, network failures, and Lighthouse (Performance/SEO/Best-Practices/Accessibility) on mobile *and* desktop.
2. **Produce `AUDIT-REPORT.md`** in the repo: a table of every issue found (route, severity, description), then fix them, then re-verify and tick them off. Keep it updated as the source of truth.
3. **Fix in priority order:** (P0) broken/security/legal → (P1) content/UX/SEO correctness → (P2) competitor-gap features → (P3) nice-to-have polish.
4. Commit in logical batches with clear messages; keep `main` deployable; verify on the live URL after deploy.
5. Don't overwrite the owner's Sanity content; extend schemas/seed rather than replacing edited data.

## 1. Concrete issues already identified (fix first)
- **Stat counter bug:** homepage "100%" renders as **"0%"** at rest (animated counter base value). Render the true final value in the DOM and animate from it (or animate only when in view without resetting the static value). Audit all animated counters/price tweens for the same no-JS/SSR issue.
- **Inconsistent model imagery:** only `the-four` and `the-six` have real images; `the-two`, `the-eight`, `the-utility`, `bespoke` show placeholders. Provide a consistent lead image for **every** model (interim stock or processed Eagle catalogue cut-outs) and ensure every range card + model hero + related-model card has one.
- **Model pages lack a hero image** — add a proper lead visual above/alongside the spec block.
- **Per-page Open Graph images are generic** (all use the homepage `/opengraph-image`). Generate **dynamic per-page OG images** (model name/price, location name, post title) via Next OG image generation.
- **Meta descriptions truncated mid-word** (e.g. Dubai: "…increasingly expect"). Every page needs a **clean, self-contained meta description** (~150–160 chars), CMS-overridable — not a hard slice of body copy.
- **Not yet CMS-editable:** add Sanity **schemas for Locations and Journal/Posts**, wire those pages to read from Sanity (ISR + seed fallback), and migrate the seed content in. Also wire **configurator options** and **RSS** to Sanity so everything is editable.

## 2. Page-by-page review (every route — verify & polish each)
For **each** page: correct H1 (one per page), sensible heading order, no lorem/placeholder/broken links, no empty/blank states, responsive at 360/390/768/1024/1440, animations smooth + `prefers-reduced-motion` honoured, unique title + clean meta description + per-page OG, valid structured data, fast LCP, no console errors, all CTAs work.
- **Home:** hero (consider video), positioning, range (consistent imagery), difference/stats (fix counters), configurator+branding teaser, sectors, locations strip, latest-from-Journal strip, quote CTA, footer. `Organization`+`AutoDealer` JSON-LD.
- **Range index:** filters work, all 6 models, consistent cards, loading/empty states.
- **Model detail ×6:** hero image, full spec table, image **gallery with lightbox + zoom**, tech-data drawer, Configure CTA, related models, sticky enquire bar, per-model OG, `Product` JSON-LD with price/brand. Consider **brochure PDF download** + **compare** entry point.
- **Configurator (+ per-model):** full step flow incl. **Branding/logo upload** (validate file type/size; preview; carried to quote); live preview correct; indicative price + breakdown; **save/share (URL) + download spec PDF + reset**; quote hand-off pre-fills the build; flawless mobile (preview pinned, bottom-sheet options, sticky price); keyboard accessible. Verify the engine-agnostic PreviewStage is ready for the R3F/3D drop-in.
- **Bespoke:** story, example builds, CTA.
- **Ownership:** warranty (CMS term), delivery, servicing, FAQ accordion; `FAQPage` JSON-LD.
- **Sectors index + 6 sector pages:** problem→solution copy, recommended models, imagery, FAQ, CTA, internal links; `Service`/`areaServed` JSON-LD.
- **Locations index + 4 location pages:** unique localized copy (good already), localized imagery, fleet, delivery note, FAQ, CTA; `Service`+`areaServed` JSON-LD; **make CMS-editable**.
- **Journal index + post + category:** grid, category filters, **search**; post = hero image, TOC, author, date, reading time, related, share, prev/next; `BlogPosting` JSON-LD; RSS valid; **make CMS-editable**.
- **About:** brand story, ethos, team/contact, trust elements.
- **Contact / Request-a-Quote:** Personal/Business toggle; fields validate; **submits and emails via Resend** (test end-to-end once key is set); accepts a saved build; success state + what-happens-next; spam protection (see Security).
- **Legal:** privacy, terms, cookies — real content; **add cookie-consent banner**. **404:** on-brand, helpful links. **sitemap.xml / robots.txt:** complete and correct; **`/studio` set to noindex**.

## 3. UI / UX polish standards
- Consistent type scale, spacing rhythm, and a single accent discipline (cool monochrome per brief). Audit for inconsistent margins/font-sizes/button styles across pages.
- Every interactive element has hover, focus-visible, active, and disabled states; links/buttons obviously tappable (≥44px).
- Loading, empty, and error states designed for all async UI (configurator, forms, galleries).
- Motion: one coherent system; no jank; GPU-friendly (transform/opacity); reduced-motion fallback.
- Microcopy pass: clear, on-brand, no dummy text; consistent British English; correct prices/specs.
- Imagery: consistent treatment, correct aspect ratios, no layout shift (set width/height), descriptive `alt` everywhere.
- Forms: inline validation, helpful errors, labelled inputs, logical tab order, success confirmation.

## 4. Functionality & cross-platform QA (test, then fix)
- **Click every link and CTA** on every page (nav, mega-menus, footer, in-body) — zero 404s/dead links.
- **Mega-menu dropdowns:** open/close on hover (desktop) + tap (touch), keyboard accessible, close on outside-click/Escape; mobile full-screen menu with scroll-lock works.
- **Configurator:** complete a full build incl. logo upload and placement; save/share/PDF; price math correct; quote hand-off carries the config.
- **Quote/contact form:** submit succeeds, validation works, email arrives (after Resend key), success state shows.
- **Journal:** category filter + search work; post navigation works.
- **Cross-browser:** Chrome, Safari, Firefox, Edge. **Devices:** iOS Safari, Android Chrome. **Viewports:** 360, 390, 768, 1024, 1440. Document and fix breakages.

## 5. Mobile excellence (Porsche/LR bar)
- Mobile-first; fluid type/spacing; safe-area insets; no horizontal scroll; tap targets ≥44px.
- Slick 60fps motion: section reveals, sticky bottom action bar on key pages, swipeable galleries/carousels, smooth menu.
- Configurator fully usable one-handed (pinned preview, bottom-sheet, sticky price).
- Mobile Lighthouse ≥95; LCP < 2.5s; lazy-load below the fold; defer the 3D island.

## 6. Bug hunt (look everywhere)
- Hydration mismatches, console errors/warnings, failed network requests, broken images, layout shift (CLS), z-index/overlay issues, sticky-bar overlaps, focus traps, scroll-lock leaks, double-fetching, ISR/caching correctness, 404s in sitemap, mixed-content, oversized bundles/images. Log each in `AUDIT-REPORT.md` and fix.

## 7. Competitor gap analysis — features to add (Land Rover / Porsche / Tesla)
Implement the high-value ones; note any deferred. Prioritised:
**High value**
- **3D / 360° configurator + AR** ("view in your space" via `<model-viewer>`/USDZ) — wire the planned R3F engine into the existing PreviewStage when models exist; keep 2D fallback. (See `3D-RENDERING-STRATEGY.md`.)
- **Model comparison** — select 2–3 models, compare specs/price side by side (LR/Porsche/Tesla all have this).
- **Save & compare builds** — saved configurations (URL + localStorage now; optional accounts later); "your saved builds".
- **High-res image gallery with zoom + 360 spin + video** on model pages (Porsche/LR media richness).
- **Downloadable brochure (PDF)** per model and a build spec PDF (LR/Porsche).
- **Book a consultation / demo / site visit** (LR "book a test drive" equivalent) with calendar/booking.
- **Trust & social proof** — testimonials, client logos, case studies/projects, press/awards (currently none; major credibility gap for B2B).
- **Cookie consent + privacy compliance** (GDPR/PECR) — legal + Google-ready.
**Medium value**
- **Finance / lease / ROI** framing (LR/Tesla payment estimators) — even an indicative monthly or fleet-ROI explainer suited to the quote model.
- **Newsletter signup** (lead capture) wired to an email provider.
- **Live chat / concierge / WhatsApp** contact option.
- **Coverage / delivery map** (LR dealer-locator equivalent: where we deliver, lead times by region).
- **Region/currency awareness** for international location pages (display indicative prices in local currency where helpful; consider `hreflang` only if non-English content is added).
- **Enquiry basket** — add multiple models/builds to one enquiry.
**Lower value**
- Account login & saved garage; sustainability page; AR business-card/quick-view; comparison with petrol equivalents.

## 8. Security hardening (make it tight)
- **HTTP security headers** (via `next.config` headers or middleware): `Content-Security-Policy` (scoped to self + Sanity CDN + fonts + analytics), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options`/CSP `frame-ancestors`, `Permissions-Policy` (lock down camera/mic/geo unless needed for AR).
- **Secrets:** confirm `SANITY_API_WRITE_TOKEN`, `RESEND_API_KEY` and any token are **server-only** (never `NEXT_PUBLIC_`, never in the client bundle); audit the built client bundle to be sure. Confirm `.env*` is gitignored (it is) and nothing secret is committed.
- **Forms (quote/contact):** server-side **zod** validation + sanitisation; **rate-limit** the API route; **bot protection** (honeypot + Cloudflare Turnstile/hCaptcha); prevent email header/HTML injection into Resend; never reflect raw user input.
- **Logo upload:** restrict to PNG/SVG, enforce size limits, validate/sanitise (SVG can carry scripts — sanitise or rasterise), don't execute, store safely.
- **Sanity:** keep CORS to the **specific origins** already added (no wildcards); public dataset is fine for published read; write token server-only; confirm only intended members can edit the Studio.
- **Dependencies:** run `npm/pnpm audit`, patch high/criticals, keep Next/React/Sanity current. Remove unused deps.
- **Hygiene:** strip `console.log`/debug in prod; don't expose source maps publicly; ensure HTTPS-only (Vercel default); add a `/.well-known/security.txt` (optional). Enable Vercel deployment protection on **preview** deployments.
- **Studio:** ensure `/studio` is `noindex` and not exposing schema/data publicly beyond authenticated use.

## 9. SEO & Google-readiness (get it ready to publish)
- **Search Console:** add verification (meta tag or DNS); **submit `sitemap.xml`**. **Analytics:** add **GA4** (privacy-compliant, behind cookie consent). Document these as owner steps where a login is required.
- **Metadata:** unique title + clean self-contained meta description per page (fix truncations), all CMS-overridable; **per-page OG/Twitter images** (dynamic).
- **Structured data (validate with Rich Results test):** `Organization` + `AutoDealer`/`LocalBusiness` (site), `Product` (models, with offers/price), `BreadcrumbList`, `FAQPage`, `BlogPosting` (posts), `Service`+`areaServed` (sectors/locations), `WebSite` + `SearchAction`.
- **Sitemap** includes every indexable route (home, range, models, configurator, sectors, locations, blog + posts + categories, landing pages, legal); **robots.txt** correct; **`/studio` and any preview/utility routes noindex**; canonicals correct (good already).
- **Internal linking** depth (models↔sectors↔locations↔posts) and descriptive anchor text.
- **Images:** descriptive `alt`, correct dimensions (no CLS), next-gen formats, lazy-load.
- **Performance/CWV:** Lighthouse ≥95 mobile+desktop; LCP < 2.5s, CLS < 0.1, INP good; self-host fonts; compress/resize images; code-split heavy islands.
- **Mobile-friendly** (passes Google's test). **Favicon / app icons / web manifest** present.
- Keep targeting the groups in `KEYWORD-MAP.md`; ensure each target maps to a page/section.

## 10. Accessibility (WCAG AA)
- AA colour contrast throughout (check the cool-grey text on white); visible focus states; full keyboard operability (menus, configurator, forms, lightbox); proper labels/roles/alt; logical heading order; skip-to-content link; respect reduced-motion; forms announce errors. Run an automated a11y pass (axe) per route and fix.

## 11. Deliverables
1. `AUDIT-REPORT.md` — every issue found, severity, status (fixed/deferred), with notes; competitor-gap decisions; security + SEO checklists ticked.
2. All P0/P1 fixes implemented and live; P2 features implemented or clearly listed as deferred with rationale.
3. Locations + Journal + configurator options + RSS wired to Sanity (CMS-editable).
4. Security headers, form protection, and SEO/structured-data complete and validated.
5. A short **owner action list** for anything only the owner can do (GA4/Search Console verification, custom domain, Resend key, any paid services).
After each batch, deploy and re-verify on the live URL. Be thorough — the goal is a site that genuinely holds its own against the reference brands.
