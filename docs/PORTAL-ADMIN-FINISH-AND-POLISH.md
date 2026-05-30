# Electric Buggies — Portal & Admin: Finish, Verify & Polish (Outstanding Work)

**For:** Claude Code (autonomous). **Goal:** make the **entire customer portal and admin dashboard** fully functional, correct, sensible for their purpose, good-looking, and a streamlined, easy-to-understand experience. Go through **every screen and every side** of the admin and customer portal. Fix anything broken, thin, confusing, or unfinished. Make every screen **reachable and demo-populated** so it can be inspected. Keep `main` deployable; deploy and verify on the **live URL** (not localhost); update `AUDIT-REPORT.md`. Brand: cool-monochrome, but use **functional colour** (status badges, success ticks, alerts). Human copy, no em-dashes, no fabricated data (demo data clearly seeded).

This consolidates outstanding items from the portal/admin revision brief and the email work. Treat it as the definitive "make it all work and look good" pass.

---

## A. Customer portal — every screen working, clear, streamlined
1. **Dashboard / overview:** at-a-glance state; any required action (sign contract, make payment, choose delivery date) shown **prominently** with a clear button and functional colour/icons (green tick = done, attention colour = action needed). No dead ends.
2. **Order journey + tracker:** colour-coded stages (not flat black); clear current stage; what's-happening + what's-needed per stage; estimated-delivery (narrowing) with delay handling; build/spec "view design details"; documents at the right stage; update log visible to the customer. Contract → after signing, **auto-advance to payment** (no vague "we'll be in touch" dead end).
3. **Payment page:** clear, professional; wire-transfer bank details + auto-generated reference + amount + invoice + "Payment sent" → "awaiting finance confirmation" → confirmed → tracker advances.
4. **Delivery:** when ready, customer picks preferred date(s) + AM/PM slot via a nice calendar; "Delivered" state with a warm message; vehicle rolls into Fleet.
5. **Fleet ("My vehicles"):** **image of each vehicle** (real transparent PNG per model), spec/VIN/warranty/documents, service plan + history.
6. **Request service flows (rich + clear):** Report a Fault (selectable common-fault list + severity + description + photos), Inspection (reason), Service (tier dropdowns — Basic/Interim, Full, Major/Extensive), **three preferred technician dates**; confirmation message; routes to admin/engineers; customer tracks status.
7. **Request a quote in-account:** select vehicle from **images**, go through the steps in-account; quote appears in their Quotes. Vehicle image shown everywhere (not just the name).
8. **Quotes:** list with statuses; open to view full detail; Accept → Order.
9. **Help & support:** help centre / FAQs covering orders, vehicles, maintenance/service, delivery, payments; contact options.
10. **Profile + notification preferences:** edit personal/business info (Companies House lookup for business); granular notification prefs (email/SMS/WhatsApp × event types).
11. **Mobile:** app-like fixed bottom nav; everything flawless and premium at 360/390/430; no dead buttons; tasteful UI polish, icons, micro-feedback.

## B. Admin dashboard — every side correct, functional, easy to understand
1. **Orders list:** colour-coded status labels **+ a model image** on each card; filter/sort (stage, customer, date, value, overdue); scannable.
2. **Order detail (must be genuinely functional):** a **visually clear pipeline/customer-journey view** (current stage obvious at a glance); **easy colour-coded advance-stage buttons** with the confirmation dialog stating from→to + exactly which notifications send + a **notify / don't-notify** + per-channel choice; the **order log**; customer + vehicle + documents; **internal vs customer-visible notes** (timestamped, attributed).
3. **Service requests:** seed a few so they're visible; inside each show the issue/details; **assign to an engineer (with engineer search)** → sends the engineer the job details + notifies the customer; track to resolved.
4. **Engineer side:** engineer login + focused **service dashboard** + **engineer log** (work done, diagnosis, parts, time, notes → builds service history); scoped so engineers **cannot** see CRM/finance/quotes.
5. **CRM pipeline:** **add deals** (clear action); drag across stages (New→Contacted→Quote sent→Negotiation→Won→Lost); **more colour**; each card shows an **image** (model of interest) + **assigned salesperson's profile photo**; **click to open the full deal** (contact/business/vehicles/quantities/value/source/activity timeline/notes/next action); pull in existing **abandoned-quote/hire/airport leads**; **create a quote from a card**; convert won → order/account.
6. **Create-a-quote (full builder):** select model (auto-populates photo + base spec/price); enter price + **% discount** (show original/discount/final, reflected in the emailed quote); estimated delivery date; **tick-box inclusions** (2yr/5yr warranty, 6-month complimentary service plan, free UK delivery, free worldwide delivery, extendable) that appear in the deal + email; tasteful marketing tactics (validity/expiry, savings shown). Issue → emails customer + appears in their account.
7. **Marketing Operations page:** add + track campaigns (email + Google Ads), fields like total spent, budget, dates, channel, results/notes, simple totals/overview.
8. **Customer enquiries log:** log enquiries (contact + enquiry + source + status/notes); surface site enquiries here; tie into CRM where sensible.
9. **Communications (email) section:** already built — confirm it's correct and consistent with the rest of the admin (list 11 templates, edit, preview, test-send, version/revert, custom composer).
10. **Roles & access:** customer / admin / finance / engineer — every admin/engineer route + action **server-side role-gated**; sensible per-role visibility (finance confirms payment; engineers limited to service).

## C. Cross-cutting quality bar (apply everywhere)
- **Everything reachable + demo-populated** — orders at various stages, several service requests, CRM deals with assignees/images, quotes, a delivery-date prompt, a delivered order, the payment page, engineer jobs, a logged enquiry, a tracked campaign. So every screen can be inspected end to end.
- **No dead buttons / no placeholder-only screens / no confusing dead ends.** Every action does something sensible and gives feedback (loading/success/error states).
- **Consistent, streamlined UX:** consistent layout, spacing, button styles, and **functional colour** (status badges, green ticks, attention/alert colours) so it's easy to understand at a glance — not flat black-and-white.
- **Good-looking + on-brand** (cool-monochrome), **flawless mobile** (360/390/430), **WCAG AA** (keyboard, focus, contrast, labels), good performance.
- **Vehicle images** (real transparent PNG per model) shown wherever a vehicle appears, both sides.
- **Copy:** human, clear, no em-dashes, no fabricated data.

## D. QA & deliverables (self-verify, then report)
Run Playwright across **customer / admin / finance / engineer** roles + mobile, covering the full journeys end to end:
- Order lifecycle: quote issued (with inclusions + discount) → customer accepts → signs contract → **auto-advances to payment** → payment sent → finance confirms → stage advances (with confirmation dialog + notify/don't-notify) → delivery-date pick → delivered → vehicle in Fleet.
- Service: report-a-fault (and inspection, and a service tier) → admin assigns engineer (search) → engineer logs work → customer sees status to resolved.
- CRM: add a deal → drag across stages → open full deal → create a quote from it.
- Marketing-ops: add + track a campaign. Enquiries: log one.
- Role isolation: confirm engineer cannot reach CRM/finance; confirm server-side gating.
- axe per screen; confirm no dead buttons, no raw placeholders, no console errors; mobile passes.
Update `AUDIT-REPORT.md` with a per-screen status (working / fixed / notes). Deploy and verify on the live URL. Then report: every screen's status, anything still stubbed, and confirm the whole portal + admin is functional, sensible, good-looking, and streamlined.
