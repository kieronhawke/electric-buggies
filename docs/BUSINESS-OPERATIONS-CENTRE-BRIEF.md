# Electric Buggies — Business Operations Centre (Inventory + Quote Generator + Command Centre)

**For:** Claude Code (autonomous). **Goal:** turn the admin into a full **business operations centre / CRM** — managing inventory, pricing & profit, quotes, deals, customers, finances, revenue and reporting in one place. This brief expands the inventory manager and quote generator and adds the command-centre layer. Build in sensible chunks; keep `main` deployable; deploy + verify live; demo-populate; cool-monochrome with **functional colour**; no em-dashes; no fabricated data. **All cost/duty/fee figures are ESTIMATES the admin edits; add a note to verify duty/commodity code/VAT with a customs broker/accountant. Not financial/tax advice.**

Researched against real platforms (Cin7, Fishbowl, Unleashed, Xero for inventory; Salesforce/HubSpot/monday/Pipedrive patterns for CRM + dashboards). Implement the high-value features; list anything deferred.

---

## PART 1 — Inventory Manager (expanded; every feature considered)
**Core management:** add / edit / remove buggies; edit **specifications inline**; manage **photos** (add/replace/remove, set primary, click to manage, real transparent PNGs); status (active/draft/archived); search/filter/sort; bulk actions; duplicate an item.
**Per-item landed cost & pricing (the profit must be crystal clear):**
- Cost stack (labelled rows, running subtotal): **Factory price (FOB)** → **Shipping/freight + insurance** → **= Customs value (CIF)** → **Import duty (10%, HS 8703 10 18, editable; flag anti-dumping possibility)** → **Import VAT (20% of CIF+duty; "reclaimable" flag)** → **other fees** (clearance, THC, documentation, drayage, etc.) → **UK delivery / PDI / branding / warranty reserve** → **= Total cost to us** (all-in landed).
- **Recommended retail price (RRP)** — set manually or auto from target margin.
- **ESTIMATED PROFIT — make this the standout element:** a large, clearly-styled, colour-coded figure (green = healthy margin, amber = thin, red = loss) showing **profit £ and margin %**, visible both in the item detail and as a **column in the inventory list**. It must be impossible to miss.
**Proven inventory features to include (from research):**
- **Landed-cost tracking against each SKU** (freight, duties, fees baked into true cost) — core to pricing accuracy.
- **Stock / units:** quantity on hand, on order, allocated/reserved, available; **reorder point + low-stock alerts**; incoming-stock/expected-arrival; optional **serial/VIN tracking** per physical unit; multi-location/warehouse (even if one for now).
- **Supplier & purchase orders:** supplier records (Suzhou Eagle etc.), **create/track POs**, expected vs received, supplier lead time, cost history per supplier.
- **Inventory analytics:** stock value (at cost and at RRP), **potential profit of total stock**, sell-through, aging stock, slow-movers, units sold, best-sellers, margin by model.
- **Status workflow:** ordered → in production → in transit → in stock → reserved → sold/delivered (ties to the order pipeline).
- Cost history / price-change log; notes/attachments (invoices, supplier docs) per item; export (CSV).
**Design:** clean, modern, scannable list + rich detail view; the profit figure and stock status use functional colour; great on desktop, usable on mobile.

## PART 2 — Quote Generator (full; see also INVENTORY-AND-QUOTE-GENERATOR-BRIEF.md)
Pick/search buggy → loads its costs/fees/total-cost/RRP. Pricing panel: cost stack (collapsible); **auto-recommended RRP** (covers fees + target margin); **+10% / +20% / +50%** markup buttons; **apply discount** (£/%) shown to customer as was/now + saving; **add fees from a 30+ pre-written dropdown** (+ custom), shown in the customer quote; **inclusions tick-boxes** (2yr/5yr warranty, 6-month service plan, free UK/worldwide delivery, extendable); estimated delivery; quantity. **Estimated profit shown live** (after discount/fees/qty), clearly + colour-coded. **Safeguards:** full **preview** → **"Would you like to send this quote?"** confirm with summary → **Confirm + Send**; block/ warn on below-cost/negative margin or missing fields; optional **approval/second sign-off** for low-margin/high-value. **Send** → emails customer + adds to account; log sender+time. **Sales follow-up:** required follow-up email + phone-call actions with **date + sign-off**; quote sent/viewed/accepted; expiry + reminder; activity timeline; tasks on dashboard.

## PART 3 — Business Command Centre (the operations dashboard / full CRM)
A home dashboard that runs the business at a glance. Clean, uncluttered, real-time, **action-oriented** (each metric can be clicked to drill in).

### Financial overview
- **Revenue:** this month / quarter / year, vs previous period, trend line; **estimated monthly revenue** and a **weighted pipeline forecast** (pipeline value × stage probability).
- **Profit & margin:** total and average margin per order/model; **gross profit** trend; cost vs revenue.
- **Cash position indicators:** outstanding/awaiting payments, payments received, deposits due/balance due; orders awaiting payment confirmation. (Indicative, not accounting-grade; can integrate Xero/QuickBooks later.)
- **Order value:** total order value by stage; average order value; units sold.
- **Inventory value:** stock at cost and at RRP, potential profit in stock.

### Sales / CRM metrics (research-backed KPIs)
- **Pipeline value** (total potential revenue in open deals), **win rate**, **average deal size**, **sales-cycle length / pipeline velocity**, **quote-to-order conversion**, leads by source/sector/country, **conversion funnel** (enquiry → quote → negotiation → won), reason-for-loss analytics, per-rep performance, **stale-deal flags** (no activity in N days), forecast vs actual.
- These power the existing **CRM deal pipeline** (drag-drop board) — surface the metrics above it.

### Operational overview
- Orders by stage (with the colour-coded pipeline), **overdue/at-risk** flags, upcoming deliveries, open **service requests** (and SLA/age), **tasks & reminders** due (follow-ups, sign-offs), recent activity feed, new enquiries.
- Alerts/exceptions: low stock, below-cost quote attempts, overdue payments, stale deals, overdue follow-ups.

### Reporting
- Date-range **reports** (sales, revenue, profit, by model/sector/location/rep), **scheduled/exportable** (CSV/PDF), saved views. Keep visual + clean (trend lines, bar charts, funnels, gauges) but uncluttered and fast.

### Customers (CRM records)
- Full customer/company records: contact + business (Companies House), their orders/quotes/vehicles/service history/payments/activity/notes; lifetime value; segment/tags; communication log; link to deals.

### Other business-ops features worth including (research-informed; implement high-value, list deferred)
- **Team management & roles** (admin/finance/sales/engineer), per-rep targets/quota, activity tracking.
- **Tasks/reminders & calendar** across deals, orders, service, follow-ups.
- **Documents hub** (invoices, contracts, POs, supplier docs).
- **Goals/targets** (monthly revenue/units target with progress).
- **Audit log** of financial/price/quote/stage actions.
- **Notifications** (in-app + the existing Zapier email/SMS/WhatsApp) for key events (new order, payment, new enquiry, stale deal, low stock).
- Future-integration hooks noted (accounting like Xero/QuickBooks; analytics; not built now).

---

## ACCESS CONTROL — who sees what (critical; enforce server-side, then test)
The single most important rule: **customers must NEVER see internal commercial data** — not factory/FOB cost, not landed cost, not fees breakdown, not margin, not profit, not supplier info, not other customers' data, not the cost stack behind a quote. They see **only** the final customer-facing figures (their price, any discount shown as was/now, inclusions, delivery, their own orders/quotes/vehicles/invoices). This separation must be enforced **on the server** (the data must not even be sent to the customer's browser), not just hidden in the UI.

Role visibility matrix (enforce server-side on every route, API, and field):
- **Customer:** only their own account data — their quotes (customer-facing price + inclusions only), orders + tracker, fleet/vehicles, service requests, invoices, profile. **No** cost, margin, profit, fees breakdown, supplier, inventory, CRM, financials, or other customers.
- **Sales:** CRM pipeline, deals, quotes, customer records, follow-ups, their targets/activity. Sees customer-facing pricing and can build quotes; **cost/profit visibility per your choice** — default: sales **can** see margin/profit while quoting (so they price sensibly) but confirm if you'd rather restrict. **No** raw factory invoices/supplier banking unless permitted.
- **Finance:** all financials, payments, costs, margins, profit, reports.
- **Engineer:** only assigned **service** jobs + engineer log + the vehicle/customer info needed for the job. **No** CRM, quotes, financials, costs, or pipeline.
- **Admin:** everything (full visibility + management).
Implementation: server-side authorisation on every route/API; **field-level control** so internal fields (cost, profit, fees, supplier) are stripped from any customer/engineer response payload; never rely on client-side hiding; audit-log access to sensitive financial data. The customer's quote view and the customer email must render only customer-facing fields — verify the cost stack/profit is absent from the HTML/JSON they receive.

## DOCUMENTATION standard (so the build agent / terminal can follow it cleanly)
- Keep this brief and its companions (`INVENTORY-AND-QUOTE-GENERATOR-BRIEF.md`) in the repo (e.g. `docs/`).
- Maintain a concise **`docs/ADMIN-OPERATIONS.md`** documenting: the data model (entities + key fields, which fields are internal-only), the role/permission matrix above, where cost/profit calculations live and how landed cost + RRP + profit are computed (with the formulae), the quote-generator flow + safeguards, and how to run/seed/test. Update it as features land.
- Code: clear, commented where non-obvious; consistent naming; calculations centralised (one costing/pricing module, server-side) so they're auditable and testable.
- Update **`AUDIT-REPORT.md`** per area with status and test results.
- Document the **demo accounts/data** and any env/secrets needed, and list owner actions clearly.

## TESTING standard (fully tested, including the access boundaries)
Beyond the per-area QA below, explicitly **test the visibility boundaries**:
- Log in as a **customer** and assert that cost, landed cost, fees breakdown, margin, profit, supplier, inventory, CRM, financials and other customers' data are **not present anywhere in the page or network responses** (check the rendered HTML *and* the API/JSON payloads, not just that it's visually hidden).
- Log in as an **engineer** and assert no access to CRM/quotes/financials/costs (routes redirect/403; payloads exclude them).
- Log in as **finance/sales/admin** and assert they see what they should.
- Attempt to access an admin/finance API directly as a lower role and assert it is **denied server-side**.
Make these assertions part of the Playwright suite so a regression that leaks profit to a customer fails the build.

## Data, security, QA
- Store inventory, costs/fees, suppliers/POs, quotes/follow-ups, deals, customers, financial-summary data in the DB; **admin/finance role-gated** server-side (sensitive cost/profit/financials limited appropriately; sales per the matrix; engineers excluded; customers customer-facing only); **server-validate all money math**; audit-log cost/price/quote/stage/financial actions; nothing secret client-side.
- **Demo-populate everything** so it's inspectable: inventory with full cost stacks + RRP + profit + stock + a supplier and a PO; several quotes/deals at different stages with follow-ups; orders across stages; service requests; a populated command-centre dashboard with realistic (clearly demo) revenue/forecast/KPIs.
- **QA (Playwright + axe, all roles + mobile):** inventory add/edit/remove with photo + specs + full cost stack (verify total-cost, RRP, and the prominent profit/margin calculate correctly and the list profit column shows); Quote Generator pick→costs load→RRP recommends→+20%+discount→add 2 fees→profit recalcs→preview→confirm→send (mocked)→in customer account, below-cost warning fires, a follow-up signed off; command centre renders revenue/forecast/pipeline/win-rate/conversion + drill-in works; **the visibility-boundary tests above (customer/engineer cannot see cost/profit/CRM/financials in HTML or payloads; direct API access denied server-side by role)**; role gating; no dead buttons, no console errors, mobile passes. Design must be **clean, simple and easy to use** throughout (uncluttered, scannable, functional colour, premium). Update `AUDIT-REPORT.md` and `docs/ADMIN-OPERATIONS.md` per area; deploy + verify live; report status + anything stubbed.

**Owner note:** all duty/VAT/fee/financial figures are estimates and editable; confirm commodity code, duty (anti-dumping can apply), and VAT treatment with a customs broker/accountant before relying on profit/financials. Accounting integration (Xero/QuickBooks) can come later.
