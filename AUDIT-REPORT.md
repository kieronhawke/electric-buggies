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

---

## Site-wide pass: stress-test + security + SEO (phase 2)

**Part 1 — rendered stress-test [done]:** Full Playwright matrix vs LIVE across
Chromium/WebKit/Firefox/Pixel7/iPhone14 = 235/235 pass (every route, 0 console
errors, no overflow at 360/390/430/768/1024/1440, axe 0 serious/critical). Deep
integrity crawl: 70 routes, 37 images all 200, 79 internal links 0 bad, 0 console
errors. One mobile overflow found (new guide comparison table) -> fixed with
min-w-0; re-verified 0px live.

**Part 2 — security [done]:**
- Per-IP rate limiter (lib/rate-limit) now on admin-login (+ constant-time
  compare), Google Places & Companies House proxies (paid-API abuse), poll &
  feedback writes. Quote/lead/newsletter already limited; better-auth limits its
  own endpoints.
- Fail-closed BETTER_AUTH_SECRET in production; generic /api/admin/setup error;
  PII console logs gated to non-production.
- Verified: no server secret in the client bundle; logo upload is type+size
  capped and rendered via <img> only (no SVG script sink); no wildcard CORS;
  /studio, /admin, /account + auth routes noindex + robots-disallowed.
- pnpm audit: 0 high/critical (4 moderate, transitive/dev tooling).

**Part 3 — SEO [mostly done]:**
- clampWords now wired into buildMetadata: no meta description truncates
  mid-sentence; no em-dashes in any metadata.
- Fixed brand duplication on sector/location/landing titles (absoluteTitle).
- robots disallow extended to /account + auth routes.
- Sitemap: /guides + posts + categories + services + new post; zero /blog;
  correct priorities. Structured data verified incl. BlogPosting + FAQPage +
  BreadcrumbList on guide posts. Per-post OG returns image/png. favicon + icon +
  manifest present.
- Deferred (P2, graceful fallback): Service schema + dedicated dynamic OG for the
  three /services pages.

**Owner-only / external steps:**
- Lighthouse mobile+desktop >=95: run on the live URL with a Chrome runner (not
  available in this sandbox). Code is structured for it (static homepage, ISR
  elsewhere, AVIF/WebP + sized images, lazy below-fold, self-hosted fonts, single
  heavy island). Validate structured data in Google Rich Results Test.
- Verified Resend sending domain (real customer email); Search Console + GA4;
  custom domain.

**Still open in Part 5 (Guides):** Sanity portable-text authoring schema for the
interactive components (currently seed-rendered); index search/tag-filter +
popular; video/gallery embeds; more SEO posts.

---

## Portal stages 5-9 complete (order lifecycle + operations) [live-verified]

Full cross-role lifecycle driven end to end (confirmed -> contract -> payment ->
production -> quality -> delivery -> delivered -> fleet -> service), verified by
an automated multi-role Playwright run.

- **5 Contract signing:** customer reviews + e-signs (name + tick + T&Cs version
  + timestamp + IP stored); print/download; advances to payment.
- **6 Wire payment:** company bank details + payment reference + invoice (print)
  + "payment sent" -> finance confirmation -> production. Finance-only confirm.
- **7 Admin order ops:** dashboard KPIs/tasks; orders list + detail; STRICT
  stage-advance dialog (from->to, which notifications + to whom, per-channel +
  notify toggle, live preview); internal vs customer-visible notes; per-channel
  Zapier notifications + notification log; full audit log; role-gated.
- **8 Fleet + service + engineer:** vehicle created on delivery; "request a
  service" -> team alert -> admin assigns engineer -> engineer logs work
  (history) -> customer tracks status. Engineer role scoped out of CRM/finance
  (verified: engineer redirected away from /admin/crm).
- **9 CRM + quotes:** drag-and-drop pipeline (new..won/lost) seeded from leads;
  convert won deal to order; admin issues quotes (emailed, tokenised public
  accept/decline view with viewed tracking).

**Needs owner input:** real **company bank details** (COMPANY_BANK_* env) for the
payment panel; the order **T&Cs / deposit / cancellation** wording.

**Stage 10 (extras) outstanding:** factory stage photos, document hub, in-app
per-order messaging UI (table exists), saved configurator builds + reorder,
deposit option, multi-user business accounts, email templates, CSV export.
Also pending: wire the live quote/hire/airport forms to upsert CRM deals
(currently demo deals are seeded; lead capture still flows to Sanity/Zapier).

---

## Portal admin revision (chunks 1-2) [live-verified]

Addressed the hands-on review: functional colour, vehicle images, reachable +
demo-populated screens, no dead ends.

**Chunk 1 (live):** colour system (status badges, green-tick success, amber
alerts) across customer + admin; vehicle images on dashboard / orders / fleet /
admin cards / CRM / quotes; customer dashboard rebuilt with prominent amber
'action needed' cards (sign / pay / choose-delivery); contract auto-advances to
payment (no dead end); delivery-date picker + warm Delivered state rolling into
Fleet; richer Request Service (Interim/Full/Major tiers, fault list + severity,
inspection, three preferred dates); colour-coded order tracker + timeline both
sides; admin order cards with photos + colour-coded status. Seed expanded to 6
orders across every stage + services + quotes + deals (with salespeople) +
campaigns + enquiries.

**Chunk 2 (live):** create-a-quote (model auto-populate, % discount with live
savings preview, tick-box inclusions, validity/expiry, emailed + in account);
customer quotes page real; CRM upgrade (colour columns, deal cards with model
image + salesperson avatar + next action, add-deal, click-to-open full deal,
issue-quote-from-deal, convert won->order); Marketing operations (campaigns with
budget/spend/leads/conversions); customer enquiries log.

**Still to do (flagged):** admin order-detail visual pipeline view + one-click
colour advance row (advance works via the confirm dialog today); help centre /
FAQ content (orders/vehicles/maintenance/delivery/payments); full in-account
quote stepper (currently links to the configurator); engineer search on assign
(dropdown today); pull live abandoned Sanity leads into CRM (demo deals seeded);
photo upload on fault reports (needs blob storage); full Playwright lifecycle +
axe + mobile re-run for the revised screens.

## Portal admin revision (chunk 3 + full test sweep) [live-verified]

Completed the remaining flagged items and ran a full multi-role + mobile + axe sweep.

**Built:** help centre with FAQ accordions (orders / vehicles & maintenance /
delivery / payments); in-account quote request (pick a model from image cards,
choose use case / quantity / timeframe, feeds CRM + enquiries, green-tick
confirmation); admin order detail now shows the colour pipeline tracker +
StageBadge + vehicle photo; engineer assignment is a searchable combobox with
avatars; live quote-form submissions upsert a CRM deal.

**Test sweep (live):** ~25 screens across customer / admin / engineer loaded with
**0 console or page errors**; **axe 0 serious/critical** after fixing the fleet
`<dl>` structure, the CRM scrollable region (focusable) and darkening salesperson
avatars to AA contrast; **0 horizontal overflow** at 390px on every screen;
engineer correctly redirected away from /admin/crm (scoping holds); deal-card
click opens the full deal; create-a-quote, in-account quote, delivery picker,
help, admin pipeline all verified.

**Still deferred (needs owner / external):** fault-report photo upload (needs a
blob store, e.g. Vercel Blob); real company bank details (COMPANY_BANK_* env);
order T&Cs / deposit / cancellation wording; a verified Resend sending domain for
real customer email.

## Email system + Communications editor [live-verified]

Executed docs/EMAIL-SYSTEM-AND-EDITOR-BRIEF.md: 11 data-driven transactional
templates wired through Resend, plus an admin Communications manager/editor.

**Transactional core (§1):** all 11 approved templates tokenized into
`lib/emails/defaults` and stored in the `email_template` table (DB override else
bundled default). `lib/emails/render.ts` fills `{{merge}}` fields, the hidden
`{{PREHEADER}}`, and a model-matched transparent-PNG `{{HERO}}` on a soft panel
(`public/img/email/*.png`); a graceful placeholder slot with `min-height` means a
missing/failed image never collapses or shows a broken icon. Every send logs to
`notification_log`. **Render-tested all 11: 0 raw tokens, hero present** (the
payment-details template intentionally uses an action badge, no hero).

**Triggers:** welcome (account verification), contract-ready / payment-details /
payment-received / order-update / ready-for-delivery / delivered (stage changes,
admin + auto on contract sign), order-confirmed (deal→order conversion),
quote-received auto-reply (public quote form + in-account request), and
quote-abandoned recovery via a daily Vercel cron (`/api/cron/abandoned-quotes`,
CRON_SECRET-gated, fail-closed) over leads mirrored to `abandoned_lead`. All
respect each customer's `notifyEmail` preference and the admin's per-stage
notify-channel choice.

**Communications admin (§2):** `/admin/communications` lists the 11 with
purpose / trigger / status / last-edited. The per-template editor gives subject +
preheader + HTML, a live desktop/mobile preview (iframe), a raw-HTML view,
click-to-insert merge-field chips and branded email-safe blocks (hero, headline,
paragraph, button, detail rows, bank details, callout, divider), a rate-limited
test-send on sample data, version history with one-click revert, and reset to the
bundled default. A custom-email composer builds one-off emails from the same
blocks. Visual editing is delivered as block-insertion + instant preview over a
hardened HTML model rather than a third-party drag-drop canvas (GrapesJS/Unlayer),
which keeps every output email-client-safe and avoids shipping a heavy editor
bundle; the raw-HTML view and brand blocks cover the same authoring needs.

**Security (§3):** all Communications routes + server actions are `requireRole
(["admin"])` gated; every save snapshots a version and is audit-logged; custom
HTML is sanitised (`lib/sanitize-email-html.ts` strips script/iframe/object,
on* handlers and javascript:/data:text-html URLs); test-sends are rate-limited
per actor; the Resend key stays server-side. Seeding reconciles only
never-edited ("system") rows so admin edits are never clobbered.

**QA (§4):** `tests/communications.spec.ts` (live, Chromium) logs in as the demo
admin, opens a template, asserts the preview renders the correct vehicle hero
with **0 leftover {{tokens}}**, exercises raw-HTML + merge insertion, and confirms
the test-send control; **axe 0 serious/critical** on the editor (the email-preview
iframe is excluded from the app-UI scan as it renders the approved artwork).
Both specs pass against the live deploy.

**Owner action required:** verify a Resend sending domain (set `EMAIL_FROM` to an
address on it) so transactional + test emails deliver to external inboxes; until
then only the Resend account owner address receives. Set `CRON_SECRET` to enable
the daily abandoned-quote recovery cron (it is fail-closed until then). On the
Hobby plan the cron is daily (09:00 UTC); Pro unlocks higher frequency.

## Portal + admin finish-and-polish pass [live-verified]

Definitive pass over every screen on both sides. Four parallel read-only audits
produced a punch-list; fixes were implemented, built green, deployed, and
verified live with Playwright (4 roles + mobile) + axe. Status per screen:

### Customer portal
| Screen | Status | Notes |
|---|---|---|
| Dashboard | fixed | Required-action CTA now visible on mobile (was hidden < sm); amber attention + green-done colour. |
| Orders list | working | Cards with transparent PNG, colour StageBadge, tracker. |
| Order detail | fixed | Current stage now labelled above the tracker; per-stage what-next; customer-visible update log; removed unused imports. |
| Contract signing | working | Auto-advances to payment (creates payment + reference, moves to payment_pending). |
| Payment page | fixed | "Mark sent" now has loading + success + error feedback (was silent); awaiting state now amber. Bank details + auto reference + amount. |
| Delivery | fixed | Three dates + AM/PM; confirmed dates now formatted (was raw ISO). |
| Fleet | working | Transparent vehicle image, VIN/warranty/spec, service plan + history. |
| Service flows | fixed | Fault list + severity, inspection reason, service tiers, three dates; date inputs now block past dates. |
| In-account quote | working | Select vehicle from images; feeds CRM + auto-reply. |
| Quotes | working | Status, savings, inclusions; deep-link to public quote. |
| Help / FAQs | working | Orders/vehicles/service/delivery/payments; contact tiles. |
| Profile | fixed | Now reachable from nav (was dashboard-tile only). |
| Notifications | fixed | Now reachable from nav; email/SMS/WhatsApp x event types. |
| Mobile | working | Fixed bottom nav (Home/Orders/Fleet/Help/Profile); 0 horizontal overflow at 390px. |

### Admin dashboard
| Screen | Status | Notes |
|---|---|---|
| Dashboard | fixed | Recent-orders pills now colour-coded StageBadge. |
| Orders list | fixed | Added stage filter + sort (newest/oldest/value) + overdue-only toggle + amber overdue flag; transparent PNG + StageBadge per card. Visible to finance for payment work. |
| Order detail | fixed | Advance button now colour-coded by destination stage; confirmation dialog (from->to, which notifications, notify/don't-notify, per-channel) intact; order log; internal vs customer-visible notes. |
| Service list | fixed | Colour-coded status; rows link to a new detail page. |
| Service detail | new | Issue/description/severity/fault, preferred dates, status, assigned engineer + assign control, engineer work logs. |
| Engineer dashboard | fixed | Colour-coded status; status-change now surfaces errors. Scoped away from CRM/finance (verified live redirect). |
| CRM board | fixed | Drag + add-deal now surface errors + add has a loading state; abandoned-leads section with add-to-pipeline; colour columns; model image + assignee avatar. |
| CRM deal detail | fixed | Salesperson assign/reassign control; vehicles + quantity block; activity/notes. |
| Create-a-quote | fixed | Model -> photo + price; % discount with original/final/savings; est delivery; inclusions incl. new "extendable warranty"; validity. Emails customer + appears in account. |
| Public quote page | fixed | Now shows discount/savings + inclusions + estimated delivery (were stored but hidden). |
| Quotes list | fixed | Colour status + vehicle image + row links to the quote. |
| Marketing ops | fixed | Add campaigns + editable spent/leads/conversions (metrics action now has UI); totals overview. |
| Enquiries | fixed | Mark-handled error feedback + Open/Handled/All filter; site enquiries surfaced. |
| Communications | working | 11 templates, edit/preview/test-send/version-revert/reset, custom composer. |
| Roles & access | fixed | Admin-only pages server-gated (requireRole); admin nav is finance-aware (finance sees Dashboard + Orders only); engineer scoped to service. Verified live. |

### QA (live, electric-buggies.vercel.app)
- Playwright `tests/portal-finish.spec.ts`: 6/6 pass - every customer + admin
  screen renders with real content and is axe (WCAG 2 A/AA) clean; order
  lifecycle action panels present across seeded stages; engineer cannot reach
  CRM/orders (redirected); finance scoped (CRM redirects, orders reachable);
  mobile bottom nav with 0 horizontal overflow at 390px. No uncaught page errors.
- Vehicle imagery: transparent PNG cutouts now used wherever a vehicle appears
  on both sides (slug + name resolvers point at /img/email/*.png).

### Still stubbed / owner-dependent (not blockers)
- "Download invoice / contract" uses the browser print dialog, not a generated PDF.
- Salesperson avatars are initials monograms (no per-person photo assets).
- Notification prefs are channel-wide + event-wide lists, not a full per-event-per-channel matrix.
- New demo rows added to the seed (orders at quality_check + in_transit; three
  abandoned leads) require one `POST /api/admin/setup` re-seed to appear on prod
  (gated by REVALIDATE_SECRET, owner-held). The existing demo data already covers
  the four crucial stages, fleet, services, quotes, CRM, campaigns, enquiries.
- Real customer email delivery still needs a verified Resend sending domain.

## Business Operations Centre (inventory + quote generator + command centre) [live-verified]

Built per docs/BUSINESS-OPERATIONS-CENTRE-BRIEF.md in five deployed chunks. New
`sales` role added (admin/finance/sales/engineer/customer). All cost/duty/VAT/fee
figures are editable estimates with a verify-with-broker note; not financial advice.

| Area | Status | Notes |
|---|---|---|
| Costing module (lib/costing.ts) | new | Single server-side source: landed-cost stack (FOB->CIF->duty 10% HS 8703 10 18->VAT 20% reclaimable->fees->UK delivery/PDI/branding/warranty->total), RRP (manual or auto from margin), profit + margin + colour band. |
| Inventory list | new | Colour-coded profit column + margin %, analytics (stock value at cost/RRP, potential profit, low-stock), search/filter/sort, add buggy. |
| Inventory detail | new | Live cost-stack editor (recomputes profit as you type), manual/auto RRP, standout profit badge, specs/photos (transparent PNG)/stock/VIN/supplier/PO editors, price-change log, status/duplicate/archive. |
| Suppliers + POs | new | Supplier records, create/receive POs (adjusts stock), cost history. |
| Quote Generator | new (replaces create-a-quote) | Pick buggy -> loads cost/RRP; collapsible internal cost stack; +10/+20/+50% markup; discount was/now; 30+ named fees + custom; inclusions; est delivery; qty; live colour-coded profit; safeguards (below-cost block+confirm, low-margin/high-value approval, preview->confirm->send); follow-up tasks; customer email customer-facing only. |
| Quote profit integrity | new | Cost + profit recomputed SERVER-SIDE in generateQuote; client estimate never trusted; internal snapshots stored, never serialised to customer. |
| Command centre (/admin) | rebuilt | Financial overview (revenue month/qtr/year + trend, est monthly, gross profit/margin, cash, order value by stage, inventory value) - finance/admin only; sales/CRM KPIs (pipeline, weighted forecast, win rate, avg deal, quote-to-order, sales cycle, conversion funnel, leads by source, per-rep, stale deals); operations (orders by stage, overdue, deliveries, open services w/ age, tasks due w/ sign-off, activity feed, enquiries); alerts; goals progress. Drill-in links. |
| Reports | new | Date-range CSV export (orders/quotes/deals), role-gated server-side. PDF + saved views deferred. |
| Roles & access | enforced + tested | sales role + role-aware nav; field-level customer/engineer stripping (lib/access.ts, toCustomerQuote, customer-facing column selects); export API 403s for customer/engineer + sales-on-financials. |

### Access-boundary QA (the critical guardrail)
`tests/access-boundary.spec.ts` (live): customer pages + RSC payload contain no
internal markers (Suzhou/Factory price/costSnapshot/profitSnapshot/landed cost/
Estimated profit/marginPct/...); public quote view has no cost/profit; customer
+ engineer redirected from /admin/inventory/crm/quotes/reports and get 403 from
the export API; sales sees pipeline but not the financial overview and cannot
export financial orders; finance sees financials; admin exports CSV. All pass.

### Other QA (live, Chromium + mobile viewport)
inventory.spec, quote-generator.spec, quote-flow.spec (below-cost warning ->
preview -> send -> follow-up sign-off), ops-a11y.spec (command centre/inventory/
quotes/reports axe WCAG 2 A/AA clean after fixing two faded-text contrast notes),
plus the existing portal-finish + communications suites. No console/page errors.

### Still stubbed / owner-dependent
PDF export + saved report views; multi-warehouse; reason-for-loss analytics;
documents hub; scheduled reports; accounting integration; per-person sales photos.
The separate INVENTORY-AND-QUOTE-GENERATOR-BRIEF.md companion file was not present
in Downloads; built from the business-ops brief + the task spec, which cover it.
Owner: verify duty/commodity-code/VAT with a customs broker/accountant; figures
are editable estimates.

## Site-wide testing, speed & security pass [live, measured]

Evidence-based pass per docs/SITE-TESTING-SPEED-SECURITY-BRIEF.md. Tools: Lighthouse 12 (headless Chrome via Playwright), Playwright (Chromium/WebKit/Firefox), axe-core, curl header inspection, pnpm audit. All measured on the live URL; access boundaries re-confirmed unweakened.

### 1. Functional + cross-browser/device (route x browser x viewport)
- `crawl.spec.ts` + `a11y.spec.ts` run across **Chromium, WebKit, Firefox** and viewports **360/390/768/1024/1440**: representative public routes (/, /range/[model], /configure, /sectors/*, /locations/*, /guides, /guides/[post], /request-a-quote, /ownership, /compare) return 200 with **zero console errors** and **no horizontal overflow**. Result: **141 passed** across the three engines (one transient networkidle nav-timeout under parallel load, green on isolated re-run). Matrix = PASS for all sampled routes x 3 browsers x 5 viewports.
- Flows verified green this and prior runs: configurator (incl. lazy-loaded preview), Quote Generator (below-cost warning -> preview -> send -> follow-up sign-off), order lifecycle panels, CRM, inventory, command-centre, Communications editor, all roles. `mobile-audit.spec.ts` + `assess.spec.ts` pass.

### 2. Backend / data integrity (measured)
- **Rate limiting**: 9 rapid POSTs to /api/quote returned `400 400 400 400 400 429 429 429 429` - the 5/10min/IP limit engages at request 6 (429); the 400s confirm server-side **zod validation** rejecting an incomplete payload.
- **Money math**: server-authoritative in `generateQuote` + `lib/costing.ts`; client estimate never trusted (proven by `access-boundary.spec.ts`).
- **Secret-gating**: /api/admin/setup and /api/cron/abandoned-quotes both return **401** without the secret.

### 3. Performance / Core Web Vitals (Lighthouse 12, live)
Mobile (before -> after where changed); CLS was 0.000 on every page both runs.

| Page | Mobile perf | Mobile LCP | Desktop perf | Desktop LCP |
|---|---|---|---|---|
| Home | 100 | 1.40s | 99 | 0.63s |
| Model (/range/the-six) | 98 | 2.49s | 92 | 0.74s |
| Configurator | 88 -> **91** | 3.35s -> **2.95s** | 100 | 0.47s |
| Sector | 94 -> **98** | 3.05s -> **2.43s** | 100 | 0.52s |
| Location | 90-95 | 2.7-3.3s | 100 | 0.69s |
| Guides post | 98 | 2.14s | 100 | 0.49s |
| Login (portal) | 95 | 2.50s | 100 | 0.41s |

- **Fix applied**: code-split the configurator `PreviewStage` island (`next/dynamic`, fixed-height container so CLS stays 0) -> Configurator mobile **88 -> 91** (now meets >=90), Sector LCP **3.05 -> 2.43s**. Targets: desktop >=95 met on all but Model (92, image-LCP bound); mobile >=90 met on all. LCP <2.5 met on most; image-hero pages (Sector/Location) sit ~2.4-3.3s mobile under 4x throttle (over the <2.0 stretch goal) - further PNG compression noted as future work. CLS <0.1 and INP/TBT comfortably met everywhere (TBT 5-58ms).
- Already in place: next/image + AVIF/WebP, self-hosted next/font (swap), static/ISR marketing pages, **Brotli** on static assets with immutable 1yr cache, HTTP/2.

### 4. Security (measured)
| Check | Result |
|---|---|
| CSP | Present, locked to self + Sanity + Unsplash + Vercel; frame-ancestors/base-uri/form-action/object-src set. `unsafe-inline`/`unsafe-eval` retained for Next bootstrap + Sanity Studio (documented; nonce-CSP deferred) |
| HSTS | `max-age=63072000; includeSubDomains; preload` |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| X-Frame-Options / frame-ancestors | SAMEORIGIN / 'self' |
| Permissions-Policy | **camera=()** (tightened from self), microphone/geolocation/browsing-topics=() |
| Cross-Origin-Opener-Policy | **same-origin** (added). CORP intentionally not global (OG/sitemap stay crawlable) |
| HTTP version / compression | HTTP/2; Brotli on static assets |
| Secret scan of client bundle | **PASS** - no secret values; only Next's env-guard getter for the var name `BETTER_AUTH_SECRET` (throws on client access). `.env*` gitignored |
| Source maps in prod | **Not public** (.js.map -> 403) |
| poweredByHeader | off |
| noindex private routes | X-Robots-Tag noindex on /studio /admin /account /engineer /api (added); robots.txt disallows; admin/account/engineer also redirect 307 |
| Auth/session | better-auth: HttpOnly+SameSite cookies, 7-day expiry, login 8/min + signup 5/min + reset 5/min rate limits, 10-char min password, email verification, 2FA plugin; no enumeration |
| Input/output | zod on all API inputs; React output encoding; admin email HTML sanitised (script/iframe/on*/javascript: stripped, `lib/sanitize-email-html.ts`); Drizzle parameterised queries |
| Abuse protection | per-IP rate limits on quote/lead/auth; honeypot on public forms; setup+cron secret-gated |
| Access control | customer/engineer receive no cost/profit/CRM/financials in HTML or payload; lower-role direct API calls denied 403 - enforced server-side, in `access-boundary.spec.ts` |
| pnpm audit | 0 high, 0 critical. Moderates **4 -> 1** (patched uuid/postcss/esbuild via overrides; remaining js-yaml is Sanity-CLI dev-only, 3.x->4.x override would break it) |
| Cookie consent | present, gates non-essential scripts |

### 5. Accessibility (axe WCAG 2 A/AA, live)
Public routes (`a11y.spec.ts`, 3 browsers) and portal/admin (`ops-a11y`, `communications`, `portal-finish`) report **0 serious/critical**. Earlier OKLCH badge-contrast and form-label issues on the ops screens were fixed in the prior pass and re-confirmed here.

### Deferred (with rationale)
- Nonce-based CSP to drop `unsafe-inline`/`unsafe-eval` - Sanity Studio + Next inline bootstrap need them; current CSP grades A. High-risk rewrite.
- Further mobile LCP on image-hero pages (Sector/Location) below 2.0s - needs tighter PNG/source compression; currently passes perf >=90.
- js-yaml moderate (Sanity CLI dev-only) - 3.x->4.x override would break the CLI.
- Self-serve data export/deletion UI - privacy policy covers it; no in-app erase flow yet (owner/legal decision).

### Owner action list (non-blocking)
- Add a CAPTCHA/Turnstile key for public forms (honeypot + rate-limits are in place; CAPTCHA is the recommended next layer).
- Verify a Resend sending domain + set EMAIL_FROM (external email delivery).
- Connect a custom domain (then re-run HSTS preload submission).
- Add Search Console + GA4 (GA4 loads after cookie consent).
- Decide on a self-serve data export/deletion flow vs request-by-email (GDPR).

## SEO overhaul, pass 1 (structure + homepage) [live, tested]

Per the SEO brief (docs/PAGE-BY-PAGE-ONPAGE-SPEC.md + owner decisions). Executed and tested in deployable chunks; golden rule (no URL 404s) verified live.

### Done this pass
- **Homepage `/`** on-page to spec: keyword-led title (52ch) + meta (160ch), H1 now carries the primary keyword in premium voice, "no golf carts here" stance softened to capture golf-buggy + utility search vocabulary; worldwide + made-to-order positioning.
- **Locations consolidated** from 19 to the 4 with genuinely-unique localised content (Dubai, Scotland, Bermuda, New York). The 4 already carry full on-page SEO: Service+areaServed schema, FAQPage, BreadcrumbList, internal links to recommended models + related sectors, per-page OG. The 15 thin expanded pages removed and 301'd to /locations.
- **Hire** moved `/hire` -> `/services/hire` (301), keyword-led title, Service+areaServed schema; nav + sitemap + mobile CTA re-linked.
- **Model names centralised** in `lib/model-names.ts` (single token; one-edit rename once signed off). Current names kept (The Two/Four/Six/Eight/Utility) pending owner sign-off + trademark check.

### Route / redirect / link matrix (verified live)
| Check | Result |
|---|---|
| Sitemap routes return 200 | **55/55** (0 non-200) |
| 15 removed locations -> 301 -> /locations -> 200 | **15/15** clean (no chain/loop) |
| /hire -> 308 -> /services/hire -> 200 | pass |
| Kept locations (dubai/scotland/bermuda/new-york) | 200 |
| Sitemap excludes removed slugs + bare /hire | pass |
| Existing 301s (/journal, /blog, /contact) | intact |

### Model-name proposals (owner to choose + trademark-check)
- **British rivers**: The Wye, The Avon, The Severn, The Thames, The Tamar
- **British peaks**: The Scafell, The Snowdon, The Ben, The Cairn, The Pike
- **Estate/heritage**: The Warden, The Ranger, The Steward, The Keeper, The Marque
Once chosen, it is a one-line change in `lib/model-names.ts`.

### [CONFIRM] list (facts the owner must supply, not invented)
Per the "facts vs copy" rule, these are written-around for now and must be filled before stating as fact:
- Warranty length + terms + exclusions
- Per-model specs: range, battery capacity, charge time, top speed, dimensions, payload, towing
- Delivery / lead times (UK + worldwide), import handling per territory
- Finance / lease options and terms
- What is included at each from-price
- Servicing intervals + call-out terms
- Any showroom / address
- Road-legal classification per model (which, if any, are type-approved)

### Remaining (SEO overhaul, next passes)
On-page frames + body copy for: 6 model pages, 6 sectors, 3 existing service pages (+ Service schema), ownership/about/bespoke/range-hub/configurator/request-a-quote; the 3 new priority guides (insurance, custom fleet branding, servicing/warranty); resorts/hotels guide differentiation; per-page OG verification across all types. These are name- and (mostly) fact-independent SEO frames plus written copy; they continue in the next pass.

## SEO overhaul, pass 2 (content + on-page frames) [live, tested]

### Done this pass
- **Model pages (6)**: keyword-led title + H1 + meta, name-independent via the token (e.g. "4 Seater Electric Golf Buggy | The Four | Electric Buggies", H1 "The Four: A Refined 4 Seater Electric Golf Buggy"). `lib/data/model-seo.ts` holds the rankable keywords so a rename never re-optimises.
- **Range hub**: Tier-1 "Electric Buggies for Sale UK | The Full Range".
- **Service pages**: Service+areaServed schema on hire, shuttle, vip-chauffeur, service-plan.
- **3 new priority guides** live + in sitemap: `golf-buggy-insurance-uk`, `custom-fleet-branding-golf-buggies`, `golf-buggy-servicing-warranty-call-out` (premium voice, no em-dashes, FAQ + keystats + CTA, internal links, real author/date).
- **Resorts/hotels guides** differentiated into a buyer's guide vs an operations guide (distinct titles confirmed live), cross-linked.
- **OG images**: every page type now serves a per-page OG (200 image). Fixed the services + about/ownership/bespoke/configure/compare/request-a-quote/range pages, which previously had none.

### Verified live (pass 2)
| Check | Result |
|---|---|
| Sitemap routes -> 200 | **58/58**, zero 404s |
| 3 new guides + resorts guides | 200, in sitemap, distinct titles |
| Model titles keyword-led + unique | confirmed (per-model) |
| OG image per page type (model/sector/location/guide/service/home + content pages) | 200 image (png/webp) |
| No em-dashes in source | pass |
| Existing 301s (locations x15, /hire, /journal, /blog, /contact) | intact |

### Consolidated [CONFIRM] list (owner supplies; nothing invented)
Brand facts (per-model): range, battery capacity, charge time, top speed, dimensions, payload, towing.
Warranty: exact length, terms, exclusions, battery-warranty period.
Commercial: finance/lease options, what is included at each from-price, delivery + lead times (UK + worldwide), import handling per territory, any showroom/address.
Service: recommended service interval (standard + high-use fleet), claims/call-out specifics.
Insurance guide: typical premium range, secure-storage discounts, typical claims excess/process.
Legal: road-legal classification per model (which, if any, are type-approved).

### Still open (lower priority, next pass if wanted)
Sector/about/ownership/bespoke/configurator/request-a-quote body-copy upgrades to the full spec H2 spine (current copy is unique and on-brand; titles/metas/OG/schema are all in place). Model-page deep body copy + FAQ blocks per the spec spine. Add a single-seat target via the road-legal guide (per owner decision: no product page).

## SEO deep-dive: AI-readiness, crawlability, structured data, E-E-A-T [live, validated]

Aligned to docs/GOOGLE-AND-AI-SEO-PLAYBOOK.md (Google-grounded). The playbook's verdict: the biggest lever is non-commodity, experience-led content on a technically sound, trustworthy site, NOT keyword-chasing, llms.txt, or FAQ schema as an AI trick. So this pass weighted content quality, crawlability and trust, and added keywords only through genuine content.

### Added / fixed
- **Model FAQs (6 pages)**: genuine buyer Q&A (cost, road legality, branding, range, warranty, worldwide delivery) with **FAQPage schema**. Natural keyword coverage + rich-result eligibility + clean answers AI engines can cite. Unknown specs written around (no invented numbers); road-legal copy stays accurate (private land by default).
- **Organization schema** enriched: logo + image + **contactPoint** (sales, worldwide, English) + areaServed; placeholder social URLs filtered out of sameAs so we never point at a generic homepage.
- **E-E-A-T**: guide BlogPosting author now links to /about, publisher carries a logo ImageObject.
- **Crawlability**: robots.txt unblocks the public legal/trust pages (privacy/terms/cookies stay crawlable, which supports trust); only app/auth/utility surfaces gated; all search + AI crawlers welcome on public content (no AI bot blocked, no llms.txt needed per Google).

### Structured-data coverage (validated live, 0 parse errors on every page type)
| Page type | Schema present |
|---|---|
| Home | Organization, AutoDealer (+Offer/Product), WebSite+SearchAction, ContactPoint |
| Model | + Product+Offer (GBP from-price), Brand, BreadcrumbList, FAQPage |
| Sector | + Service+areaServed, BreadcrumbList, FAQPage |
| Location | + Service+areaServed, BreadcrumbList, FAQPage |
| Guide | + BlogPosting (author->/about, ImageObject), BreadcrumbList, FAQPage |
| Service | + Service+areaServed, FAQPage |

Every JSON-LD block parsed valid (Python json.loads) across /, model, sector, location, guide and service pages.

### Owner actions for AI/search visibility (cannot be done in code; from the playbook)
1. Verify **Google Search Console** and submit the sitemap.
2. Verify **Bing Webmaster Tools** (ChatGPT leans on Bing, so this is the main ChatGPT lever).
3. Connect the **custom domain** (the .vercel.app is not indexed; this gates everything).
4. Add **real social profiles** (then sameAs auto-populates; placeholders are filtered today).
5. **Google Business Profile** if/when there is a showroom or service address.
6. Earn **authentic trade/sector mentions and links** (digital PR), the cross-engine authority lever. Never bought or faked.
7. Supply the **[CONFIRM] facts** (specs, warranty terms, lead times, insurance/service figures) so the guides and model pages can state them precisely.
