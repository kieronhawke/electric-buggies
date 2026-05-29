# Electric Buggies — Forensic Audit Findings (independent review)

**Reviewer view:** senior/principal web engineer. **Method:** live crawl + HTML/metadata/structured-data/link/routing inspection of representative routes of every type, plus verification of the previous audit's claimed fixes. **Boundary (important):** this pass cannot execute JavaScript, render visually, or measure real cross-browser/responsive/Lighthouse/accessibility/load behaviour — those require a headless browser runner (see §5), which is the necessary complement to this report.

---

## 1. Verification of the previous audit's "fixed" claims (trust, but verify)
Most P0 security work appears done; however, two P1 SEO fixes are **incomplete**, caught by checking the actual routes:

| Claimed fixed | Reality on live site | Verdict |
|---|---|---|
| Dynamic per-page OG (model/location/post) | Blog **posts** have per-page OG ✓. **Model** (`/range/the-six`), **location** (`/locations/dubai`) and **sector** (`/sectors/golf-clubs`) pages still serve the **generic** `/opengraph-image`. | ❌ Incomplete — only posts |
| Meta descriptions de-truncated | Models ✓ and blog ✓ have clean descriptions. **Locations** still truncated mid-word ("…increasingly expect"). | ❌ Incomplete — locations missed |
| Security headers, form protection, skip link, manifest, /studio noindex, cookie consent | Skip link present ✓. Headers/CSP, rate-limit, consent not directly inspectable via HTML. | ⚠️ Verify with tools (securityheaders.com; live form test) |
| Structured data (Org/AutoDealer, Product, Service, BlogPosting, FAQPage, Breadcrumb, WebSite) | Present per report; not fully validated here. | ⚠️ Validate via Rich Results test |

**Lesson:** apply the OG + description fixes across **all** dynamic route types and re-verify each on the live URL, not just one.

---

## 2. What's working well
- **Routing & IA:** every sampled route returns 200; consistent header/footer; breadcrumbs on inner pages; sensible URL structure.
- **Content quality:** model spec tables (seats/range/battery/top speed/dimensions/charge time); **genuinely localized** location copy (Dubai climate/Palm/villa communities — not a thin doorway); blog posts with author, date, reading time, categories, and per-post OG.
- **Configurator:** server-rendered with all 8 steps (Model→Colour→Roof→Wheels→Interior→Accessories→**Branding**→Summary), running indicative price + breakdown, save/share/request-quote, model picker.
- **Accessibility baseline:** skip-to-content link present; viewport set; semantic headings.
- **Metadata:** clean canonical tags; mostly clean titles/descriptions (except locations).

---

## 3. Issues found (by severity)

### P1 — fix before promoting the site
1. **Both lead forms render "Loading…"** (`/request-a-quote` **and** `/contact`). The primary lead-capture is a client-only island with no SSR fallback. Risks: blank form if JS slow/fails, weaker no-JS/SEO, poor perceived performance, and a stuck "Loading…" if hydration errors. **Make it robust** — render server-side or guarantee a fast, fail-safe mount; never allow a permanent "Loading…" state; test submission end-to-end.
2. **Per-page OG incomplete** — add dynamic OG images to **model** and **location** pages (posts already done).
3. **Location meta descriptions truncated** — give every `/locations/[slug]` a clean, self-contained description (CMS-overridable).
4. **Placeholder contact details live** — `+44 20 3936 0000` and `enquiries@electricbuggies.co.uk` (domain not owned). Replace with real details; the email implies a domain that must be secured before launch.
5. **Duplicate contact routes** — `/contact` resolves (200) but **duplicates** `/request-a-quote`: two competing lead pages, same placeholder phone/email, both with a "Loading…" form. Internal links are split (nav/footer → `/request-a-quote`; Ownership & About "Contact us" → `/contact`). Consolidate to **one** canonical contact/lead route, 301/redirect or repurpose the other, and fix all internal links sitewide (avoids duplicate-content + confused IA).
6. **Model imagery** — confirm **all six** model heroes + range cards show real images (earlier only The Four/The Six did); no placeholders in production.
7. **Testimonials must be genuine** — if the "In their words" quotes/clients are fabricated, replace with clearly-illustrative placeholders or remove until real testimonials exist (UK advertising/consumer-protection + brand trust).

### P2 — high value, mostly asset/credential-gated
8. **Imagery is interim stock/gradients** — the biggest available premium uplift is real **product photography** (Eagle catalogue cut-outs on neutral stages) and **lifestyle** shots (estates/resorts/events). Wire into the existing CMS image fields.
9. **Configurator realism** — 2D recolour stand-in today; **3D/360°/AR** is the headline gap vs Porsche/Land Rover (gated on GLB models — see `3D-RENDERING-STRATEGY.md`).
10. **Competitor features** (see §6).

### P3 — polish
11. Microcopy consistency, empty/loading/error states for all async UI, consistent motion, lightbox/zoom on galleries, OG alt text per page.

---

## 4. Backend / functional checks to run (couldn't be fully verified from HTML)
- **Quote API:** submission path works; emails actually send (after Resend key); rate-limit + honeypot + injection guards behave; graceful failure + success states.
- **Logo upload:** type/size validation; SVG sanitisation; safe storage; preview + carry-through to quote.
- **ISR/caching:** edits in Sanity propagate within the ISR window on **all** wired routes; confirm locations/journal now read from Sanity end-to-end.
- **Sitemap.xml / robots.txt:** fetch and confirm every indexable route is listed and `/studio` + utility routes are noindex (not directly fetchable in this pass).

---

## 5. Required automated test pass (set this up and run it)
To genuinely "stress test across browsers, sizes, every page and link," add a headless test harness in the repo and run it in CI:
- **Playwright** end-to-end: crawl every route (from the sitemap), assert 200 + no console errors; click every internal link and assert no 404s; run the **full configurator flow** (select model, change colour/roof/wheels/interior, upload a test logo, place it, save/share, download spec, hand off to quote); submit the **quote form** (mocked) and assert success; open mega-menus (hover + tap), mobile menu, lightbox.
- **Cross-browser / viewport:** run the suite on Chromium, WebKit (Safari), and Firefox, at 360 / 390 / 768 / 1024 / 1440 widths; capture screenshots; flag overflow/overlap/layout breaks.
- **Lighthouse CI:** Performance/SEO/Best-Practices/Accessibility on Home, a Model page, the Configurator, a Location, and a Blog post — mobile + desktop; target ≥95; record scores.
- **axe-core** accessibility scan per route; fix violations (contrast, labels, roles, focus order).
- **Security:** verify response headers (CSP/HSTS/nosniff/Referrer/Frame/Permissions) on live; check no secret leaks in the client bundle; `pnpm audit` and patch.
- Record all results in `AUDIT-REPORT.md` with before/after.

---

## 6. Competitor gap analysis (Land Rover / Porsche / Tesla) — prioritised
**High value:** 3D/360° configurator + **AR** ("view in your space"); **model comparison** (specs/price side by side); **save & compare builds**; **gallery with zoom + 360 spin + video**; **downloadable brochure (PDF)** per model + build spec PDF; **book a consultation/demo**; **genuine testimonials / case studies / client logos** (trust). 
**Medium:** finance/lease/ROI framing; newsletter capture; live chat / WhatsApp concierge; coverage/delivery map; region/currency awareness on international location pages. 
**Lower:** account/saved garage; sustainability page; enquiry basket (multi-model).

---

## 7. Action list for Claude Code (precise)
1. Complete **per-page OG** on model + location routes; verify each live.
2. Fix **location meta descriptions** (clean, self-contained, CMS-overridable); verify live.
3. Make the **quote form robust** — no permanent "Loading…", SSR/fail-safe mount, test submit path.
4. **Consolidate /contact and /request-a-quote** into one canonical lead route; redirect/repurpose the other; fix all internal links.
5. Replace **placeholder phone/email** with CMS-driven values; flag the domain decision to the owner.
6. Ensure **all six models** have real hero + card imagery.
7. **Testimonials:** remove/illustrative-mark any fabricated content.
8. Stand up the **Playwright + Lighthouse CI + axe** harness (§5), run it across browsers/sizes/all routes/all links + backend flows, fix what it surfaces, and record results.
9. Continue scoped **P2 features**: model comparison and wiring configurator options to the CMS (no new assets/keys needed); list the rest as asset/credential-gated.
Keep `main` deployable; deploy and re-verify on the live URL after each batch; update `AUDIT-REPORT.md`.
