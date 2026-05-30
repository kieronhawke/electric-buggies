# Electric Buggies — Site-Wide Testing, Speed & Security Hardening Brief

**For:** Claude Code (autonomous). **Goal:** extensively test the ENTIRE product (public site + customer portal + admin/operations centre), find and fix anything broken or sub-par, make **load speed genuinely fast (industry-leading targets)**, and put **industry-leading security** in place — all measured, not assumed. Keep `main` deployable; deploy + verify on the LIVE url; record everything in `AUDIT-REPORT.md` with before/after numbers. Do not weaken the existing access-control boundaries.

This is a measurement-and-fix pass: run the real tools, record the actual numbers, fix the gaps, re-measure.

---

## 1. Full functional & cross-browser/device testing (with evidence)
Run the Playwright harness against the **live site** on **Chromium, WebKit (Safari), Firefox** at **360 / 390 / 430 / 768 / 1024 / 1440**:
- **Crawl every route** (from sitemap + app dir): assert 200, **zero console errors/warnings**, no failed network requests, no horizontal overflow, no hydration mismatches.
- **Click every interactive element**: nav + mega-menus (hover + tap, no flicker), mobile menu, every internal link (zero 404s), every CTA/button, accordions, tabs, lightbox/gallery, carousels, cookie consent, WhatsApp FAB.
- **Exercise every flow end-to-end:** the configurator (model→colour→roof→wheels→interior→branding logo upload+placement→save/share→quote hand-off); all multi-step forms (quote, hire, airport) incl. validation + submit; /compare; account auth (register→verify→login→reset) across all roles; the full order lifecycle (quote→accept→sign→payment→stages→delivery→delivered); a full service request (report-a-fault→assign engineer→engineer log→resolved); the Quote Generator (incl. below-cost warning + follow-up sign-off); CRM add/drag/open/convert; inventory add/edit/remove; command-centre drill-ins; the Communications editor (edit→preview→test send).
- **Capture screenshots** of every page at mobile + desktop; **review them** and fix layout breaks, overlap, spacing, truncation, small tap targets (<44px), placeholder/broken images, anything unfinished or off.
- Record a pass/fail matrix (route × browser × viewport) in `AUDIT-REPORT.md`; fix everything that fails; re-run.

## 2. Backend / data integrity testing
- All API routes: correct behaviour, validation (zod), error handling, and **rate-limiting** under repeated calls; quote/hire/airport/newsletter submissions persist + email (where keys present) + abandoned-lead capture fires; logo upload validates type/size and sanitises SVG.
- **ISR/caching:** confirm content changes propagate within the ISR window on all wired routes; no stale-cache regressions (a stale-prerender bug happened before — verify fresh content live).
- **Money math (server-side):** verify costing/RRP/profit and quote totals compute correctly and cannot be tampered from the client.
- **Auth/session:** session expiry, password reset, verification, and role gating all behave; no broken states.

## 3. Performance / Core Web Vitals — make it genuinely fast (industry-leading)
Measure with **Lighthouse** (mobile + desktop) on Home, a Model page, the Configurator, a Sector, a Location, a Guides post, and a representative portal/admin page. **Targets:** Performance **≥95 desktop, ≥90+ mobile**; **LCP < 2.5s** (aim < 2.0s), **CLS < 0.1**, **INP < 200ms**, TTFB low. Record before/after.
Optimisations to apply where they help:
- **Images:** next/image everywhere; AVIF/WebP; correct width/height (no CLS); responsive `sizes`; lazy-load below the fold; compress the real product PNGs; preload the LCP image; avoid huge data-URI/base64 images.
- **Fonts:** self-hosted, `font-display: swap`, preload key weights, subset if possible.
- **JS/bundles:** code-split heavy islands (configurator 3D/preview, the email editor, charts); defer/async non-critical; tree-shake; remove unused deps; analyse bundle size; lazy-load the admin/editor chunks so the marketing site stays light.
- **Rendering:** static/ISR for marketing pages; stream where useful; minimise client components; cache headers sensible; CDN/edge via Vercel.
- **Third-party:** load analytics/consent/chat efficiently (after consent, deferred).
- **Network:** confirm compression (gzip/brotli), HTTP/2/3, no render-blocking resources.
Re-measure and record the improved scores.

## 4. Security — industry-leading hardening (measured)
- **Headers:** verify and tighten on live (test with a header scanner): a strong **Content-Security-Policy** (lock down script/style/img/connect/frame-ancestors to self + known sources; no unsafe-inline scripts where avoidable), **Strict-Transport-Security** (long max-age, includeSubDomains, preload), **X-Content-Type-Options: nosniff**, **Referrer-Policy: strict-origin-when-cross-origin**, **X-Frame-Options/frame-ancestors**, **Permissions-Policy** (lock camera/mic/geo unless needed), and a sensible **COOP/CORP** where applicable. Aim for an A/A+ on a headers grader.
- **Secrets:** scan the client bundle — **no keys/tokens/DB strings** client-side; confirm all server-only; `.env*` gitignored; no secrets in logs.
- **Auth/session security:** secure HttpOnly SameSite cookies, session expiry, rate-limited + lockout on login/reset, strong password policy, email verification, 2FA-ready; no user enumeration on login/reset; CSRF protection on state-changing requests.
- **Input/output:** zod validation server-side on all inputs; output encoding (no XSS); sanitise any stored/admin HTML (the email editor) — strip script/iframe/on*/javascript:; parameterised DB queries (no injection); safe file uploads (type/size/SVG sanitisation).
- **Access control:** re-confirm the **role boundaries hold server-side** (customer/engineer never receive cost/profit/CRM/financials in HTML or payloads; direct API calls by lower roles are denied) — keep these in the test suite.
- **Abuse protection:** rate-limit public APIs + auth + quote/contact; honeypot + (recommend) CAPTCHA/Turnstile on public forms; protect the cron + setup endpoints (secret-gated).
- **Dependencies:** `pnpm audit` — patch high/criticals; update outdated critical deps; remove unused.
- **Surface:** `/studio`, `/admin`, `/account`, `/engineer`, cron/setup, and any utility routes are noindex + not publicly exposing data; error pages don't leak stack traces; source maps not public in prod.
- **Privacy/compliance:** cookie consent present and gating non-essential scripts; privacy policy covers accounts/CRM; data export/deletion path exists.
Record a security checklist (pass/fail + the header-grader and audit results) in `AUDIT-REPORT.md`.

## 5. Accessibility (keep AA)
Re-run **axe** per route (public + portal + admin); fix any serious/critical: contrast, focus-visible, labels/roles/alt, keyboard operability (menus, configurator, forms, lightbox, editor), heading order, reduced-motion. Record results.

## 6. Deliverables
- `AUDIT-REPORT.md` updated with: the route×browser×viewport pass/fail matrix; bugs found + fixed; **before/after Lighthouse scores** (mobile + desktop) for the sampled pages; the **security checklist + header-grader result + pnpm audit result**; axe results; and any items deferred with rationale.
- All fixes deployed and re-verified on the live URL.
- A short **owner action list** for anything only the owner can do (e.g. verify a CAPTCHA key, the Resend sending domain, custom domain, Search Console/GA4) — non-blocking.
Be thorough and evidence-based: run the tools, show the numbers, fix the gaps, re-measure, and don't claim a result without a measurement behind it.
