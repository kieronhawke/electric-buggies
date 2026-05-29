# Mayfair Vehicles

Premium electric-vehicle dealer website, live configurator and admin CMS for **Mayfair Vehicles** — a UK seller of bespoke electric buggies and utility vehicles.

**Live:** https://mayfair-vehicles.vercel.app
**Studio (admin):** https://mayfair-vehicles.vercel.app/studio _(activates once Sanity is connected — see below)_

Built with Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Motion + Sanity, deployed on Vercel.

---

## Build status

| Phase | Scope | Status |
|---|---|---|
| **0 — Setup** | Next.js + TS + Tailwind, brand tokens, fonts, layout, repo, Vercel live URL | ✅ Done |
| **1 — Static premium pages** | Home, Range + 6 models, Sectors, Bespoke, Ownership, About, Contact, Quote, SEO landing pages, legal, sitemap/robots, OG image | ✅ Done |
| **2 — Sanity CMS** | Schemas, embedded Studio at `/studio`, GROQ + content layer, seed script | ✅ Scaffolded — needs Sanity keys to connect & seed (below) |
| **Configurator** (brief §6) | Step tabs, live recolour preview, indicative pricing, save/share/print, quote hand-off | ✅ Working (built early) |
| 3 — Image pipeline | Import & process Eagle EV photography | ⏳ Next |
| 4 — Configurator polish | Options from CMS, per-colour/3D asset upgrade | ⏳ |
| 5 — SEO + polish | Resend emails, Lighthouse/a11y pass | ◑ Mostly in place |
| 6 — Handover | This README + owner checklist | ◑ In progress |

---

## ⚠️ Notes for the owner

1. **The supplied prototype was the wrong file.** `references/prototype-homepage.html` is an unrelated "Electoral Commission" prototype, not a Mayfair homepage. The design was instead built directly from the brief's §2 design language (which is fully specified). If you have the real Mayfair prototype or the Land Rover/Porsche/Tesla reference screenshots, drop them into `references/` and I can refine against them.
2. **Vehicle imagery is placeholder.** Until the curated Eagle EV photos are imported (Phase 3), models use a clean recolourable **SVG render** — this also powers the configurator's live colour preview. Image slots are CMS-swappable.
3. **Legal pages are generic placeholders** — have them reviewed before relying on them.

---

## To take it fully live (owner to-dos)

These are the credential/decision steps only you can do. Each is quick.

### 1. Connect Sanity (unlocks the `/studio` admin + live editing)
1. Create a project at [sanity.io](https://sanity.io) (free tier is fine). Note the **Project ID** and use dataset **`production`**.
2. Create a write token: Sanity → API → Tokens → **Editor** permissions.
3. Add these to Vercel (Project → Settings → Environment Variables) and re-deploy:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<your project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=<your write token>
   ```
4. Seed starter content (run locally with the same vars in `.env.local`):
   ```bash
   pnpm seed
   ```
   The site automatically switches from seed content to live CMS content once the project ID is set.

### 2. Email delivery for quote requests (Resend)
Add to Vercel env and redeploy:
```
RESEND_API_KEY=<from resend.com>
QUOTE_NOTIFICATION_EMAIL=<where quote requests should arrive>
```
Until set, quote submissions succeed and are logged server-side (nothing is lost).

### 3. GitHub → Vercel auto-deploy
Install the **Vercel GitHub App** and authorise the `mayfair-vehicles` repo (Vercel → Project → Settings → Git). After that, every push to `main`/`master` auto-deploys.

### 4. Optional / later
- `REMOVE_BG_API_KEY` — one-click background removal in the admin.
- Verify the site in **Google Search Console**, submit `sitemap.xml`, add **GA4**.
- Confirm the **warranty term** and **contact details** in `/studio` → Site settings.
- Buy a domain and point it at Vercel.

---

## Environment variables

See `.env.example`. None are required to run or deploy — the site falls back to seed content and logs quote requests — but they unlock the CMS and email.

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000  (Studio at /studio)
pnpm build        # production build
pnpm seed         # seed Sanity (needs project id + write token)
```

## Project structure

```
app/(site)/      Marketing routes (Header/Footer chrome)
app/studio/      Embedded Sanity Studio (no chrome)
app/api/quote/   Quote-request handler (Resend)
components/       UI + configurator + vehicle render
lib/             site config, seed data, SEO, structured data, content layer
sanity/          schemas, studio config, client, GROQ queries
scripts/         seed-sanity.ts (+ Phase 3 image pipeline)
data/            eagle-ev-image-manifest.txt (Phase 3 source)
references/       brief assets — NOT shipped
```

## Editing content (once Sanity is connected)

Everything the owner can change lives in `/studio`: models, specs, prices, galleries (drag-to-reorder), sectors, landing pages, FAQs, configurator options, homepage sections, site settings, and a per-page **SEO** object on every document.
