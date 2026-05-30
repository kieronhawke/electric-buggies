# Electric Buggies — Email System & Admin Communications Editor (Build Brief)

**For:** Claude Code (autonomous). **Goal:** wire the transactional email templates into the live system (send via Resend), and build an **admin → Communications** section where the team can edit those emails in a visual/HTML editor, drag in placeholders, and create custom emails from clean modules. Keep `main` deployable; deploy + verify; update `AUDIT-REPORT.md`. Brand: cool-monochrome, Tesla-clean. No em-dashes. No fabricated data.

## 0. Source templates
Eleven finished, proofed HTML templates are provided (in `/email-templates`, also previewable): 01 order-confirmed, 02 welcome/next-steps, 03 contract-ready, 04 payment-details, 05 payment-received, 06 order-update (reusable per stage), 07 ready-for-delivery, 08 delivered, 09 quote-received (the "critical" one, with a Why-Electric-Buggies block), 10 enquiry-received, 11 quote-abandoned (recovery email: thanks them, gentle marketing, "can we help?", with Continue-your-quote + Explore-the-range CTAs). They use a centered wordmark, a hero buggy image, short headline, plain copy, labelled detail rows, one primary button (two on the abandoned-quote email), quiet footer with unsubscribe. Use these as the base designs; the wording is approved as-is.

**Hero image (important):** use the project's real **transparent PNG buggy images** (the same clean cutouts already used on the website, from the image folder) for the hero — selected dynamically to match the **model the customer ordered or enquired about** (order/contract/payment/delivery emails show their configured build's model; quote/enquiry/abandoned emails show the model of interest or a default hero). Do NOT use a flattened/black-background copy. (Uploads into the chat get converted to JPEG and lose transparency, which is why the previews here couldn't show it; pulling the real PNGs from disk avoids this entirely.) Place on white; the transparent PNG sits cleanly with no panel needed.

## 1. Wire transactional sending (Resend)
- Convert the templates into the app's email layer as **reusable, data-driven templates** (merge fields filled at send time): customer name, order reference, model, build spec (colour/wheels/interior/branding), price/discount/total, bank details + payment reference, current stage, estimated delivery, dates, links to the relevant account page, etc.
- **Trigger points** (fire the right email automatically): account welcome/verification; quote issued; quote-request received (auto-reply 09); general enquiry received (auto-reply 10); **abandoned quote (11) — when a lead enters a valid email in a quote/hire/airport flow but does not submit, send the recovery email after a sensible delay (e.g. a few hours/next day), once, only if not completed**; contract ready; contract signed → payment-details; payment received/confirmed; each order stage change (06, using the stage's template/message); ready-for-delivery (07); delivered (08). Respect the customer's **notification preferences** and the admin **notify / don't-notify** choice from the order flow.
- **Email-client safe:** inline styles, table layout, fixed 600px width, alt text, plain-text fallback/multipart, preheader text per email, dark-mode sensible. Test renders in the harness.
- Sender uses the verified domain (`EMAIL_FROM`); degrade gracefully (log) if keys/domain absent.

## 2. Admin → Communications (the editor)
A new section in the admin dashboard. Two parts:

### 2.1 Template manager
- List the transactional templates (the 10 above) with name, purpose, last-edited, and which trigger uses them.
- **Edit a template** in a visual editor (see 2.3): change copy, images, buttons, colours, modules. **Save** updates the version used by the live sends. Keep a **version history / revert**, and a **"reset to default"**.
- **Preview** (desktop + mobile) with sample data, and **send a test email** to a chosen address before saving live.
- Guard the **merge-field placeholders** so editing copy can't break them (show them as protected tokens/chips, not raw text).

### 2.2 Custom emails / campaigns
- **Create a new email from scratch** using the same modules; save it; preview; send a test. (For one-off internal/manual sends, or as drafts.)
- Note: bulk *marketing* campaigns to lists are better handled in the dedicated marketing tool (e.g. Brevo) — this composer is for transactional/template editing and ad-hoc sends. If a simple "send to a segment" is wanted later, flag it; don't build a full ESP here.

### 2.3 The editor itself (drag-and-drop + HTML)
- Use a proven, MIT/open-source **email editor library** that supports **drag-and-drop blocks + merge tags** and exports email-safe HTML — e.g. **GrapesJS (MJML/newsletter preset)**, **react-email-editor / Unlayer**, or **Maily/MJML-based** editors. Pick one that: runs in React/Next, exports inline-styled table HTML, supports custom **merge-field/placeholder tokens**, and lets us register **brand blocks**. (Don't hand-build a drag-drop engine from zero.)
- **Drag-and-drop modules** (clean, branded, reusable): wordmark header, hero image, headline, paragraph, button, detail-rows (label/value), steps/numbered list, callout/tip box, bank-details block, divider/spacer, two-column, image, "Why Electric Buggies" block, footer (with unsubscribe). Each styled to the brand.
- **Placeholders/merge fields** draggable into any text/area: {{firstName}}, {{lastName}}, {{orderRef}}, {{model}}, {{buildSummary}}, {{colour}}, {{wheels}}, {{interior}}, {{branding}}, {{price}}, {{discount}}, {{total}}, {{bankDetails}}, {{paymentRef}}, {{stage}}, {{estDelivery}}, {{deliveryDate}}, {{accountLink}}, {{quoteLink}}, {{contractLink}}, {{paymentLink}} — show them as tokens; fill at send.
- **Also allow raw HTML editing** (a code view) for power users, with the visual view kept in sync where feasible.
- Output must stay **email-safe** (inline styles, tables) on export/save.

## 3. Data & security
- Store templates (and custom emails) in the DB (or Sanity if cleaner for editing) with versioning. Persist: subject, preheader, the editor JSON/MJML, the compiled HTML, last-edited-by/at.
- Communications section is **admin-only** (role-gated, server-side); editing/sending audit-logged. Sanitise any custom HTML; never allow script injection. Test-send and live-send rate-limited. Keys server-side; nothing secret in the client bundle.

## 4. QA & deliverables
- Playwright: open Communications, edit a template (change copy + drag a module + drop a merge field), save, preview desktop+mobile, send a test (mocked/sandbox), and confirm a triggered transactional send uses the edited version with fields filled. axe on the new admin screens. Render-test all 10 templates (structure + inline styles + alt + preheader). Confirm merge fields resolve and none are left raw in a real send.
- Update `AUDIT-REPORT.md`. Deploy + verify live. List any owner items (e.g. verify the Resend sending domain so emails reach external inboxes — currently only the account email/test addresses work until the domain is verified).
