# Admin Operations Centre

Inventory, pricing/profit, the Quote Generator and the Business Command Centre.
All cost / duty / VAT / fee / financial figures are **editable estimates**.
Confirm the commodity code, duty (anti-dumping can apply) and VAT treatment with
a customs broker or accountant before relying on profit/financials. **Not
financial or tax advice.** Accounting integration (Xero/QuickBooks) is future work.

## Data model (entities + internal-only fields)

Internal-only fields must NEVER reach a customer or engineer (stripped server-side).

- **inventory_item** - sku, name, modelSlug, status (active/draft/archived), specs,
  photos. **Internal:** factoryFob, freightInsurance, dutyPct, antiDumping, vatPct,
  vatReclaimable, otherFees, ukDelivery, pdi, branding, warrantyReserve, rrp,
  targetMarginPct, autoPrice, stockOnHand/onOrder/allocated, reorderPoint, supplierId.
- **supplier** - name, country, contact, leadTimeDays. **Internal (entire row).**
- **inventory_unit** - VIN, status (in_stock/reserved/sold). Internal.
- **purchase_order** - reference, supplier, item, qty, unitCost, status, expected/received. Internal.
- **price_change_log** - field, old->new, actor. Internal audit of cost/price edits.
- **quote** - customer-facing: reference, customerName, lineItems, inclusions,
  originalTotal, discountPct, total, estDelivery, validUntil, status.
  **Internal:** itemId, costSnapshot, profitSnapshot, markupPct, unitPrice,
  feesApplied (internal copy), approvalRequired/approvedBy, accessToken.
- **task** - follow-ups/reminders with dueDate, assignee, signOff. Internal.
- **goal** - period, metric (revenue/units/deals), target. Internal.

## Role / permission matrix (enforced server-side)

Helpers: `lib/access.ts` (`canSeeCosting`, `canSeeFinancials`, `canManageInventory`,
`canSeeCrm`, `toCustomerQuote`). Pages gate with `requireRole` (`lib/session.ts`);
the admin nav (`components/portal/admin-nav.tsx`) shows only permitted items.

| Area | customer | engineer | sales | finance | admin |
| --- | --- | --- | --- | --- | --- |
| Own account / orders / fleet / quotes (customer-facing) | yes | no | no | no | yes |
| Assigned service jobs + engineer log | no | yes | no | no | yes |
| CRM pipeline / deals / customer records | no | no | yes | yes | yes |
| Quote Generator (incl. cost/margin/profit) | no | no | yes | yes | yes |
| Inventory manager (cost stack, suppliers, POs) | no | no | no | yes | yes |
| Financial overview (revenue/profit/cash) + orders list | no | no | no | yes | yes |
| Command centre - sales/ops sections | no | no | yes | yes | yes |
| Command centre - financial section | no | no | no | yes | yes |
| Marketing / Communications | no | no | no | no | yes |
| Reports: orders CSV | no | no | no | yes | yes |
| Reports: quotes/deals CSV | no | no | yes | yes | yes |

Customer-facing surfaces (`/account/*`, `/q/[token]`, customer emails) select
ONLY customer-facing columns, so internal fields are never fetched into the
page/RSC payload. The reports export API (`/api/admin/reports/export`) re-checks
the role server-side and returns 403 for customer/engineer (and for sales on
financial exports). Verified by `tests/access-boundary.spec.ts`.

## Costing / pricing / profit (centralised: `lib/costing.ts`)

One server-side module, pure + deterministic, money in pence:

```
CIF            = factoryFob + freightInsurance
dutyAmount     = CIF * dutyPct/100                 (default 10%, HS 8703 10 18)
vatAmount      = (CIF + dutyAmount) * vatPct/100    (default 20%)
vatInCost      = vatReclaimable ? 0 : vatAmount     (reclaimable VAT excluded from cost-to-us)
otherFeesTotal = sum(otherFees)
landedExtras   = ukDelivery + pdi + branding + warrantyReserve
totalCost      = CIF + dutyAmount + vatInCost + otherFeesTotal + landedExtras
RRP            = manual, or rrpFromMargin(totalCost, targetMarginPct) = totalCost / (1 - margin/100)
profit         = price - cost ; marginPct = profit/price*100
band           = green (margin >= 25) / amber (>= 12) / red (below, or below cost)
```

Inventory profit is computed in `lib/inventory-data.ts` (`enrich`). Quote profit
is recomputed **server-side and authoritatively** in `generateQuote`
(`lib/quote-actions.ts`) - the client's estimate is for UX only and is never
trusted. Command-centre aggregates: `lib/command-data.ts`.

## Quote Generator flow + safeguards

Pick/search a buggy -> loads its landed cost + recommended RRP -> markup
(+10/+20/+50%) -> discount (shown to the customer as was/now/saving) -> named
fees (30+ in `lib/fee-library.ts` + custom) -> inclusions -> est delivery ->
quantity -> live colour-coded profit. **Safeguards:** below-cost is blocked
until explicitly confirmed; low-margin (< 12%) or high-value (>= £50k) sets
`approvalRequired` for a second sign-off (`approveQuote`, admin/finance);
preview -> "Would you like to send this quote?" -> Confirm + send. Sending emails
the customer (customer-facing only), records sender + time, and auto-creates two
follow-up tasks (email + call) on the command centre. Customers see was/now,
inclusions, delivery and total only.

## Run / seed / test

- Migrate + seed prod (idempotent): `POST /api/admin/setup?secret=$REVALIDATE_SECRET`.
- Demo logins (password `EbDemo!2026x`): `customer@`, `admin@`, `finance@`,
  `engineer@`, `sales@` `demo.electric-buggies.dev`.
- Seeded: 6 inventory items with full cost stacks + RRP + profit + stock + VIN
  units, 2 suppliers, 2 POs, tasks (one signed off), goals, plus the existing
  orders/quotes/deals/services/campaigns/enquiries.
- Tests (Playwright, live): `access-boundary.spec.ts` (the visibility guardrail),
  `inventory.spec.ts`, `quote-generator.spec.ts`, `quote-flow.spec.ts`,
  `ops-a11y.spec.ts`, plus the portal suite. Run: `pnpm exec playwright test --project=chromium`.

## Deferred (high-value, not yet built)
PDF export + saved report views; multi-warehouse; reason-for-loss analytics;
documents hub; scheduled reports; accounting (Xero/QuickBooks) integration;
per-person salesperson photos.
