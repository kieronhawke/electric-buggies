# Electric Buggies

Premium electric-buggy marque: marketing site, a Land-Rover/Porsche-grade **configurator with logo branding**, a Sanity-authored **Journal**, **location subsites** and deep **sector** pages — SEO-complete and CMS-editable.

**Live:** https://electric-buggies.vercel.app
**Repo:** https://github.com/kieronhawke/electric-buggies
**Studio (admin):** `/studio` (activates once Sanity is connected — below)

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Motion · Sanity · Vercel. Design: cool monochrome, Hanken Grotesk (per `references/prototype-homepage-v2.html`).

> Separate project from `mayfair-vehicles` — its own repo and Vercel project; that project was left untouched.

---

## What's built

- **Design & nav** — cool-monochrome v2 look, mega-menu (desktop dropdowns with columns + feature), animated full-screen mobile menu (scroll-lock), transparent→solid header, sticky mobile action bar, scroll reveals, animated counters.
- **Home** — dark hero, statement, range, stats, configurator+branding teaser, sectors, locations strip, Journal strip, CTA.
- **Range + 6 model pages** — real product photos, spec, tech-data drawer, sticky enquire bar, related, `Product` JSON-LD.
- **Configurator** (`/configure`) — Model→Colour→Roof→Wheels→Interior→Accessories→**Branding**→Summary, live recolour preview with finish sheen, **logo upload + placement (front/sides/rear/bonnet) + scale**, animated price tween, breakdown drawer, save/share/print/reset, quote hand-off. Built on an **engine-agnostic `PreviewStage`** documented for a drop-in **React Three Fiber + drei `<Decal>`** 3D engine (`3D-RENDERING-STRATEGY.md`) — no rewrite needed.
- **Sectors** — deep problem→solution pages, recommended fleet, FAQ (`FAQPage`), `Service`+`areaServed`, internal links.
- **Locations** — Dubai / Scotland / Bermuda / New York: unique localised content, fleet, delivery, FAQs, `Service`+`areaServed`. *Honest positioning: built in Britain, delivered worldwide — no implied local depot.*
- **Journal** — index, post (sticky TOC, author, reading time, related, share, prev/next), categories, `BlogPosting` JSON-LD, **RSS at `/rss.xml`**. 5 cornerstone posts.
- **Ownership, Bespoke, About, Contact, Request-a-Quote** (Personal/Business, accepts a saved build incl. logo), legal, 404, dynamic `sitemap.xml`, `robots.txt`.
- **SEO** — per-page metadata/canonical/OG, full JSON-LD set, `KEYWORD-MAP.md`.
- **Imagery** — interim Unsplash via a gradient-fallback `Media` component + supplied product photos in `/public/fleet`. **Every image CMS-swappable.**

---

## ⚠️ Deploy status note

The latest content deploy (configurator branding, Journal, locations, deep sectors — all committed & pushed) is **pending a Vercel deploy cooldown**: rapid deploys earlier in setup tripped the Hobby-plan anti-abuse throttle, so new production deploys are temporarily `BLOCKED`. The code is complete and builds cleanly (56 routes). It goes live on the next successful deploy. To force sooner: wait ~30–60 min then `vercel deploy --prod`, **or** install the Vercel GitHub App so pushes auto-deploy.

---

## Owner to-dos (credentials & decisions)

1. **Connect Sanity** (unlocks `/studio` + live content): create a project at sanity.io, set on Vercel and redeploy:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=…
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=…
   ```
   then `pnpm seed`. The site serves seed content until connected.
2. **Resend** (quote emails): `RESEND_API_KEY`, `QUOTE_NOTIFICATION_EMAIL`. Until set, submissions succeed and are logged.
3. **Vercel GitHub App** — authorise the `electric-buggies` repo so pushes auto-deploy.
4. **3D configurator (later)** — produce GLB models (AI image-to-3D → Blender, marketplace base, or commission; photogrammetry once a unit exists), add `model3d` + `decalZones` per model in the CMS; `PreviewStage` is ready to drop in R3F. See `3D-RENDERING-STRATEGY.md`.
5. Confirm warranty term & contact in `/studio`; verify Google Search Console, submit `sitemap.xml`, add GA4; buy a domain and point at Vercel.

## Local dev

```bash
pnpm install
pnpm dev      # http://localhost:3000  (Studio at /studio)
pnpm build
pnpm seed     # seed Sanity (needs project id + write token)
```

## Structure

```
app/(site)/   Marketing routes (chrome)
app/studio/   Sanity Studio
app/api/quote Quote handler (Resend)
app/rss.xml   Journal RSS
components/    UI, header/mega-menu, configurator (+ PreviewStage), media
lib/          site/nav, seed data, seo, structured-data, configurator, images
sanity/       schemas, studio config, queries
KEYWORD-MAP.md  ·  3D-RENDERING-STRATEGY.md
```
