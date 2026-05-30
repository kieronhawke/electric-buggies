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
