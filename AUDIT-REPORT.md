# Electric Buggies — Audit & Polish Report

**Site:** https://electric-buggies.vercel.app · **Repo:** github.com/kieronhawke/electric-buggies (auto-deploy on push)
**Date:** 2026-05-29 · **Against:** `AUDIT-AND-POLISH-BRIEF.md`

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
**Implemented:** save/share builds (URL + localStorage), branding/logo step, cookie consent, testimonials/social proof, engine-agnostic PreviewStage (R3F-ready).
**Deferred (with rationale):**
- **3D/360° + AR** — needs GLB models produced first (see `3D-RENDERING-STRATEGY.md`); PreviewStage is already built to drop the R3F engine in without a rewrite.
- **Model comparison** & **enquiry basket** — high value; scoped next (spec-diff UI + selection state).
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
