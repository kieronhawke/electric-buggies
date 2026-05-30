# Electric Buggies — Audit & Polish Report

**Site:** https://electric-buggies.vercel.app · **Repo:** github.com/kieronhawke/electric-buggies (auto-deploy on push)
**Date:** 2026-05-29 · **Against:** `AUDIT-AND-POLISH-BRIEF.md` + `FORENSIC-AUDIT-FINDINGS.md`

---

## Expansion v3 — progress (against EXPANSION-BUILD-BRIEF.md)
**All six batches shipped & live (69 routes, harness green).**
- **B1 imagery/hero/voice:** real product photos optimised (`/public/img/vehicles`, 12 MB→1.1 MB); all models use them; cinematic photographic hero; em-dash purge (source + 22 Sanity docs) + guard `pnpm check:copy`; de-AI pass.
- **B2 conversion:** config-driven multi-step **LeadWizard** (quote/hire/airport) with image vehicle-select, branding, Companies House + Google Places + intl-phone; **abandoned-lead capture** (`/api/lead` upsert by email, partial=abandoned, submit=submitted+Zapier); protected **`/admin`** dashboard (filters + CSV). `/request-a-quote` is the wizard.
- **B3:** `/hire` + hire flow; `/sectors/airports` (airside + accessible PRM, "aim to beat any like-for-like quote") + airport quiz; integration proxies env-gated with graceful manual fallback.
- **B4:** `/services/shuttle`, `/services/vip-chauffeur`, `/services/service-plan` (24h call-out, team-comes-to-you, intl 24–48h); enriched **About** + "Speak to a member of the team" block (team-photo placeholder).
- **B5:** **+15 location pages** (USA, Abu Dhabi, Saudi, Qatar, Switzerland, Monaco, French Riviera, Marbella, Lake Como, Algarve, Maldives, Mauritius, Singapore, Australia, Bahamas) — unique localized copy, Service+areaServed + FAQ + per-page OG; content layer made seed-union so new entries show without re-seeding (Sanity edits still win). Journal +4 SEO posts.
- **B6 harness:** Playwright (crawl + wizard + a11y + perf) updated for new pages. **Chromium 54/54, WebKit+Firefox crawl 74/74, axe 0 serious/critical, 69 routes 200, 64 links 0×404, em-dash guard clean.**

**New owner keys (all degrade gracefully):** `ADMIN_PASSWORD` (enables `/admin`), `COMPANIES_HOUSE_API_KEY` (free, UK business autocomplete), `GOOGLE_PLACES_API_KEY` (address finder), `RESEND_API_KEY` (form emails; Zapier instant-notify already live). Asset: a real **team photo** for the About/contact block.

## Forensic round 2 — fixes (before → after)

| Item | Before | After | Verified |
|---|---|---|---|
| Lead forms | `/request-a-quote` **and** `/contact` rendered a stuck **"Loading…"** (client-only behind Suspense) | Form removed `useSearchParams` → **renders server-side**, no Suspense gate, can't stick; attached build read post-mount | [live] SSR HTML now contains `name="email"/"message"`, no "Loading…" |
| Duplicate lead routes | `/contact` duplicated `/request-a-quote`; split internal links | `/contact` → **308 redirect** to canonical `/request-a-quote`; all links repointed (nav/footer/about/ownership); removed dup page; dropped from sitemap | [live] `/contact` → 308 |
| Sector OG | sectors served the generic OG | **dynamic per-sector OG** added (model/location already done) | [live] 200 image/png |
| Location meta | "…increasingly expect" (mid-word) | dedicated `metaDescription` per location | [live] clean |
| Contact details | hardcoded placeholder phone/email | **CMS-driven** via `siteSettings` (footer + quote sidebar); seed = placeholder | [code] — **owner must set real details + secure the domain** |
| Testimonials | could read as real | relabelled **"Illustrative examples … not attributed to specific clients"** | [code] |
| Model imagery | the-four/six photos, others render | **uniform render across all six** (no placeholder/empty); real photos = CMS swap | [code] |
| Configurator step number | ink @50% `#858585` (3.69:1) — **fails AA** | `text-ink-2` (passes) | axe + [live] |

## Assessment pass — performance (measured, fixed)
| Metric | Before | After |
|---|---|---|
| Homepage initial transfer | **~2,967 KB** | **~209 KB** (~93% ↓) |
| Image bytes / files (initial) | 2,926 KB / 15 files (raw 1400px CSS-bg) | 168 KB / 2 files (AVIF via `/_next/image`; rest lazy) |

Cause: `Media` used CSS `background-image` with full-size Unsplash URLs (no optimisation/lazy). Fix: `Media` → `next/image` (AVIF/WebP, responsive `sizes`, lazy below-fold, `priority` on the LCP hero only). Also confirmed in this pass: exactly 1 `<h1>`/route, **no console warnings**, immutable caching on hashed assets, proper 404 status, unique page titles.

## Automated test harness — RESULTS (executed)
Harness committed: **Playwright** (`tests/`), **axe-core**, **Lighthouse CI** (`lighthouserc.json`), node HTTP crawler (`scripts/crawl-check.mjs`). Scripts: `pnpm crawl | test:e2e | test:a11y | lhci`.

| Suite | Result |
|---|---|
| HTTP crawl (full sitemap) | **44/44 routes 200**, **43 internal links, 0 × 404** |
| Playwright crawl + console-errors (Chromium) | **all routes pass, 0 console errors**; no horizontal overflow at 360/390/768/1024/1440 |
| Configurator E2E (Chromium/WebKit/Firefox) | **pass** — model→colour→branding(logo upload+placement)→summary→save/share→**quote hand-off carries the build** (verified `Attached build · indicative £15,350`) |
| Quote form submit (mocked) | **pass** — success state shows |
| Cross-browser | **Chromium 40/40, Firefox 30/30, WebKit 30/30** (1 transient WebKit timeout under parallel load; passes on retry) |
| axe-core a11y (10 routes, WCAG 2 A/AA) | **10/10 pass, 0 serious/critical** (settled/reduced-motion state) |
| Live security headers | CSP/HSTS/nosniff/Referrer/X-Frame/Permissions **all present** |
| Client bundle secret scan | **clean** — no token/key in `.next/static` |
| `pnpm audit` | **0 high/critical** (3 moderate, transitive) |
| Lighthouse | **configured** (`lighthouserc.json`); run in CI/owner env with Chrome — not runnable in this sandbox (no standalone Chrome). Code structured for ≥95: static+ISR, self-hosted fonts, avif/webp, lazy media, single heavy island. |

---


## Method & honest scope
- **Code audit** of every route in `app/` + components + lib.
- **Live verification** via HTTP: route status sweep (26+ routes), response headers, structured-data presence, metadata/OG, manifest/icons. Each fix re-verified on the production URL after deploy (GitHub pipeline).
- **Not run in this environment:** headless Lighthouse, axe, and real cross-browser/device matrices require a browser runner. Where I couldn't execute them, I fixed the underlying causes from code and flagged a final automated pass as an **owner/CI step** (see Owner actions). Claims below are marked **[verified live]** or **[code]** accordingly.

Severity: **P0** broken/security/legal · **P1** content/UX/SEO correctness · **P2** competitor-gap · **P3** polish.

---

## Issues found & status

| # | Route(s) | Sev | Issue | Status |
|---|---|---|---|---|
| 1 | Home | P1 | "100%" stat rendered **0%** at rest (counter base) | ✅ Fixed — renders true value, animates in-view only [verified live: HTML shows `100%`] |
| 2 | Range, model, related cards | P1 | Inconsistent lead imagery (only the-four/six had photos) | ✅ Fixed — uniform recolourable render per model (distinct by colour); real photos reserved for galleries/CMS swap |
| 3 | Model ×6 | P1 | No hero lead visual | ✅ Fixed — render hero present on every model page |
| 4 | All | P1 | Generic OG image everywhere | ✅ Fixed — dynamic per-page OG for model/location/post [verified live: 200 image/png] |
| 5 | Locations, Sectors | P1 | Meta descriptions truncated mid-word | ✅ Fixed — dedicated `metaDescription` per page + `clampWords` safety net [verified live] |
| 6 | Locations, Journal | P1 | Not CMS-editable | ✅ Fixed — `location`/`post`/`category` schemas + pages wired (ISR + seed-merge); content seeded |
| 7 | Configurator options | P2 | Options not wired to CMS | ⏳ Deferred — see Deferred §; schemas exist + seeded (editable in Studio), live-wiring through the client island deferred to protect the centrepiece |
| 8 | RSS | P1 | Read from seed only | ✅ Fixed — reads Sanity via content layer (seed fallback) |
| 9 | Global | P0 | No HTTP security headers | ✅ Fixed — CSP/HSTS/nosniff/Referrer/X-Frame/Permissions [verified live] |
| 10 | /api/quote | P0 | No rate-limit/bot/injection guard | ✅ Fixed — per-IP limit, honeypot, CR/LF guard, length caps |
| 11 | Global | P1 | No skip-to-content link / `main` landmark | ✅ Fixed |
| 12 | Global | P1 | No web manifest / app icon | ✅ Fixed — `manifest.webmanifest` + generated `/icon` [verified live: 200] |
| 13 | /studio | P1 | Must be noindex | ✅ Confirmed — page `robots: noindex` + robots.txt disallow |
| 14 | Legal | P1 | No cookie-consent banner (GDPR/PECR) | ✅ Fixed — consent banner gating analytics, choice persisted |
| 15 | Home | P2 | No social proof (B2B credibility gap) | ✅ Added — testimonials section (marked illustrative until real quotes) |
| 16 | Build | P3 | 3 moderate `pnpm audit` advisories (transitive, dev/build) | ◑ Noted — no high/critical; monitor and bump with Next/Sanity |

## Structured data — [verified live]
`Organization` + `AutoDealer` (home), `Product` (models), `Service`+`areaServed` (sectors & locations), `BlogPosting` (posts), `FAQPage` (ownership/sectors/locations), `BreadcrumbList`, `WebSite`+`SearchAction`. **Owner step:** validate with Google Rich Results Test post-launch.

## Security checklist
- ✅ CSP (self + Sanity + Unsplash + Vercel; `unsafe-eval` only for the embedded Studio), HSTS preload, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`, `poweredByHeader: false`. **[verified live]**
- ✅ Secrets server-only: `SANITY_API_WRITE_TOKEN`/`RESEND_API_KEY` never `NEXT_PUBLIC`; Sanity client uses tokenless public read; `lib/content` is `server-only`. `.env*` gitignored; no secrets committed. **[code-verified: grep clean]**
- ✅ Forms: zod + length caps, honeypot, per-IP rate-limit, email-injection guard, no raw reflection.
- ✅ Logo upload: PNG/SVG only, ≤4MB, rendered solely via `<img>` (non-executing), never sent server-side.
- ✅ Sanity CORS scoped to the two specific origins (no wildcard).
- ⏳ **CAPTCHA** (Turnstile/hCaptcha) — recommended add-on, needs a key (owner).
- ⏳ Stricter nonce-based CSP (drop `unsafe-inline`/`unsafe-eval`) — future hardening; current policy is functional with the embedded Studio.

## SEO / Google-readiness
- ✅ Unique titles + clean meta descriptions (CMS-overridable), canonicals, per-page dynamic OG/Twitter.
- ✅ Sitemap includes home/range/models/configurator/sectors/locations/blog+posts+categories/landing/legal; robots correct; `/studio` + `/api` disallowed; `/privacy|terms|cookies` noindex.
- ✅ Full JSON-LD set (above). ✅ Self-hosted fonts (`next/font`). ✅ `next/image` formats avif/webp. ✅ Internal linking models↔sectors↔locations↔posts.
- ⏳ **GA4 + Search Console** verification — owner (login required); consent banner already gates analytics.
- ⏳ **Lighthouse ≥95 / CWV** — code is structured for it (static + ISR, lazy media, no blocking fonts); run the automated pass on the live URL to confirm scores.

## Accessibility (WCAG AA)
- ✅ Skip link + `main` landmark; one `<h1>`/page; global `:focus-visible` ring; `prefers-reduced-motion` honoured (Counter, Reveal, motion, float).
- ✅ Contrast [code]: ink `#0a0a0b` and ink-2 `#5b6066` on white/paper ≈ 5.3–5.6:1 (passes AA for body text); white/70 on ink passes.
- ✅ Mega-menu keyboard-operable (button + focus-within); mobile menu scroll-lock; alt text on content images; decorative hero backgrounds intentionally non-semantic.
- ⏳ Final automated **axe** pass per route — owner/CI step.

## Competitor-gap features
**Implemented:** save/share builds (URL + localStorage), branding/logo step, cookie consent, testimonials/social proof, engine-agnostic PreviewStage (R3F-ready), **model comparison** (`/compare`, up to 3 side by side), **configurator options CMS-wired** (editable in Studio → live; no regression).
**Deferred (with rationale):**
- **3D/360° + AR** — needs GLB models produced first (see `3D-RENDERING-STRATEGY.md`); PreviewStage is already built to drop the R3F engine in without a rewrite.
- **Enquiry basket** (multi-model) — scoped; medium value.
- **Gallery zoom / 360 spin / video**, **brochure & spec PDF** — pending real per-model media/assets; build-spec PDF currently via print.
- **Book-a-consultation** — needs a booking provider (Cal.com/Calendly) decision/key.
- **Finance/ROI, newsletter, live chat/WhatsApp, delivery map** — medium value; listed for a later phase.
Rationale: prioritised P0/P1 correctness, security, SEO and CMS-editability first; remaining P2s are scoped and mostly gated on assets or third-party keys.

---

## Owner action list (only you can do these)
1. **Resend** — add `RESEND_API_KEY` + `QUOTE_NOTIFICATION_EMAIL` (Vercel env) so quote emails actually send (they're validated + logged until then).
2. **Google Search Console** — verify the domain, submit `sitemap.xml`.
3. **GA4** — provide a measurement ID; analytics will load behind the existing cookie-consent.
4. **Custom domain** — point it at Vercel when ready (replaces the `vercel.app` URL).
5. **CAPTCHA key** (Turnstile/hCaptcha) — optional, to add to the quote form for stronger spam protection.
6. **3D modelling** — commission/produce GLB models to unlock the 3D/AR configurator.
7. **Run the automated passes** — Lighthouse (mobile+desktop) and axe on the live URL; validate structured data in the Rich Results Test. (Code is prepared for ≥95; this confirms real scores.)
8. **Real content** — replace illustrative testimonials with real client quotes/case studies; supply per-model photography (pipeline + CMS fields ready).

---

## Customer portal + operations (new phase) — progress

**Stack:** PostgreSQL + Drizzle ORM + better-auth. Degrades gracefully: the
marketing site builds and runs without `DATABASE_URL`; `/api/auth` returns 503
and `/account` redirects to `/login` until the DB is configured.

**Stage 1 — Auth + DB foundation [done, verified locally]**
- Drizzle schema: `user/session/account/verification/two_factor` (better-auth
  contract) + `order/order_event`. Role enum `customer/admin/finance/engineer`.
- better-auth: email/password, mandatory email verification, password reset,
  HTTP-only sessions, per-IP rate limiting (tighter on sign-in/up/reset), 2FA
  plugin, 10-char min policy. Server authz helpers (`requireUser/requireRole`).
- Resend email with graceful dev-console fallback.

**Stage 2 — Auth pages [done]** `/login /register /forgot-password
/reset-password`, on-brand, mobile-perfect, loading/error/success states,
password reveal, resend-verification, no stuck "Loading".

**Stage 3 — Account shell [done]** `/account` app shell with fixed mobile
bottom nav (Home/Fleet/Quotes/Orders/Help), profile editor, granular
notification preferences (email/SMS/WhatsApp + 5 event types).

**Stage 4 — Order journey [done]** horizontal tracker (near-black active step),
friendly per-stage headline, narrowing estimated-delivery window with delay
handling, what-happens-next, design details, dated visual timeline, single
reference. Demo order `EB-2026-0001` seeded end to end.

**QA:** login -> account -> order verified desktop + mobile; register + forgot
flows verified; axe 0 serious/critical on login/register/account/order/
notifications.

**Owner actions to go live:** (1) add a Neon Postgres in the Vercel dashboard
(Storage -> Neon -> Free) which auto-sets `DATABASE_URL`; (2) provide
`RESEND_API_KEY` + a verified sending domain for real email. Then the prod DB is
migrated + seeded and redeployed.

**Stubbed / pending:** contract signing (5), wire-transfer payment (6), admin
order ops (7), fleet + service + engineer (8), CRM + quotes (9), extras (10).
**Flagged (need from owner):** order T&Cs + deposit/cancellation policy copy;
company bank details for the payment step.

---

## Marketing pass: Guides rename + blog rebuild (phase 1 of the site-wide brief)

**Part 4 (rename) [done, live-verified]:** Journal renamed to Guides sitewide;
routes moved to /guides, /guides/[slug], /guides/category/[slug]; nav, footer,
homepage, sectors, sitemap, RSS, structured-data, OG and all internal links
updated. 301 redirects from /blog/* and /journal/*. Sitemap now lists /guides
with zero /blog references.

**Part 5 (Guides rebuild) [core done, live-verified]:**
- Reading-progress bar; editorial portable-text components (pull-quote, callout,
  key-stats, comparison table, in-article CTA, FAQ block emitting FAQPage JSON-LD).
- Reader poll with server-side persistence (poll_vote table; one vote per
  visitor via httpOnly cookie + unique index); results as bars. "Was this
  helpful" aggregate feedback (article_feedback table). /api/poll + /api/feedback
  validated and length-capped.
- New SEO post "electric-buggies-for-hotels-and-resorts" showcasing every
  feature; live poll vote persists to the prod DB; BlogPosting + BreadcrumbList +
  FAQPage JSON-LD present; per-post OG returns 200 image/png.

**Remaining in this brief (next phases):**
- Part 5: Sanity portable-text authoring schema for the interactive components
  (currently seed-rendered; existing Sanity post bodies override seed); modernise
  the index (search/tag filter, popular, loading states); more SEO posts; video/
  gallery embeds; per-post prev/next confirmed on new posts.
- Part 1: full cross-browser (Chromium/WebKit/Firefox) x 360/390/430/768/1024/
  1440 stress-test of every route with screenshot review and fixes.
- Part 2: security hardening pass (headers on all routes, client-bundle secret
  scan, harden every public API + logo-upload SVG sanitisation, CORS, noindex,
  pnpm audit, strip prod console logs).
- Part 3: SEO/Lighthouse (unique titles/meta audit, per-page OG verification,
  full structured-data validation, Lighthouse mobile+desktop >=95, favicon/
  manifest confirm).
