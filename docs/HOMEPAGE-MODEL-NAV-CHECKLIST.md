# Electric Buggies — Homepage, Model Pages, Nav & Email: DEFINITIVE CHECKLIST

**For:** Claude Code. **This is a precise checklist of EVERY change requested. Action every numbered item, then report DONE / NOT DONE per item with the exact live text/element to look for, verified in PRODUCTION HTML (not localhost, not preview).** Several of these were asked for before and not completed, so treat this as a careful, complete pass. Keep `main` deployable, deploy to production, and verify each item live. Cool-monochrome brand. No em-dashes. No fabricated specs.

**Important context:** the Configurator is being DELAYED / switched off for now. So anything that sends customers into "Configure" must be removed from the public journey and replaced with quote/enquiry CTAs. Pricing on vehicles is also being hidden for now. The desktop model-page layout must be REVERTED to its original (pre-Tesla-redesign) formatting; the mobile model-page layout stays as the new version.

---

## 1. BUTTONS — homepage + model cards + model pages (HIGH PRIORITY, currently NOT done)
1.1 On the homepage model cards, the two buttons are still "Enquire" and "Configure/Discover". CHANGE the primary button to **"Request a Quote"** (or "Get a Quote") and the secondary to **"Learn More"**. Remove any "Configure" button.
1.2 On each individual model page, the buttons must be **"Get a Quote"** (black/primary) and **"Learn More"** (white/secondary). No "Configure this model" button anywhere.
1.3 The buttons must look genuinely good and easy to click: clear tap targets (min 44px height), obvious primary vs secondary styling, good spacing, hover/active states, and they should sit comfortably (blend in) within the design from a usability and visual standpoint. Also place the two buttons at the BOTTOM of the model page as well (sticky or repeated), so there is always a clear action.
1.4 Apply consistently everywhere a model is presented (home cards, range hub, model pages, sticky bar). The sticky bar CTA = "Request a tailored quote" (already partly done) — make sure it is NOT a Configure action.

## 2. CONFIGURE — remove from the public journey (currently NOT done)
2.1 Remove **"Configure"** from the navigation bar entirely.
2.2 Remove the **"Configure Yours" / "Configure this model" / "Configure"** buttons from the homepage hero, model cards, and model pages.
2.3 Leave a Configure link in the FOOTER only (as previously agreed).
2.4 If a model's configure option is off, the configure button must not appear anywhere on that page (this rule applies generally now since configurator is delayed).
2.5 Update the footer wording appropriately to reflect these changes.

## 3. PRICING — hide on vehicles for now (currently NOT done)
3.1 Remove the visible **"From £X"** prices from the homepage model cards, the range hub, and the model pages — anywhere a price currently shows on a vehicle.
3.2 Build this as an **admin setting / toggle** so prices can be switched back ON later per the original request: when ON, the price shows on that buggy across the site; when OFF (default for now), no price shows anywhere. Make sure it is well configured so toggling works cleanly.
3.3 Where pricing context is useful without a number, use reassuring copy instead, e.g. pricing depends on configuration and "we aim to offer the best vehicles at the most competitive, affordable rate" (truthful, hedged, no fabricated figures).

## 4. DESKTOP MODEL-PAGE LAYOUT — REVERT (new instruction)
4.1 Revert the **desktop** vehicle/model page layout back to its ORIGINAL formatting (before the Tesla-style redesign). 
4.2 KEEP the new **mobile** model-page layout (it looks good). So: mobile = new Tesla-style; desktop = original. Make sure the two are cleanly separated responsively and neither breaks the other.

## 5. HOMEPAGE H1 + HERO COPY (currently NOT done)
5.1 Change the H1 — it still reads "Premium electric buggies, beautifully made to order." Replace with a better H1 that does NOT lean on "beautifully made to order" (which makes us look smaller than we are), KEEPS strong SEO (include "Electric Buggies" and key terms like golf buggies / utility vehicles UK), and reads well. Example direction (refine): something leading with "Electric Buggies" and the premium golf/utility angle.
5.2 Improve the hero subtext accordingly, keeping it premium and benefit-led.
5.3 Replace the **"built in Britain, delivered around the world"** line — move away from "built in Britain". Use a worldwide delivery/support angle instead (e.g. "Delivered and supported worldwide").
5.4 If we offer free worldwide delivery, state it clearly and correctly (e.g. "Free delivery, worldwide") — only if true; otherwise hedge.

## 6. "BUILD IT, BRAND IT, SEE IT, CHANGE LIVE" SECTION TITLE (currently NOT done)
6.1 That title relates to the configurator (being delayed), so either remove/replace the section, or re-title it with a better, non-configurator title that fits the current journey. Give it a strong, premium title and supporting copy.

## 7. NAVIGATION (currently NOT done)
7.1 Rename **"The Range"** to **"Vehicles"** in the navigation.
7.2 Remove **"Configure"** from the nav (see §2).
7.3 Ensure the nav is clean, mobile-friendly, and the header is not covered/overlapped (see §9.2).

## 8. LOGIN BUTTON (currently NOT done)
8.1 Add a **Login** (account) button/link to the **navigation bar**.
8.2 Add a **Login** link to the **footer** as well.
8.3 It should route to the account login. Make it clear and consistent with the design.

## 9. MODEL-PAGE BUGS (currently NOT done)
9.1 **Technical Data popup (desktop):** clicking "Technical Data" opens a side popup on desktop that does not make sense there — fix so technical data displays appropriately on desktop (inline/section, not an odd side popup). 
9.2 **Mobile header overlap:** on mobile model pages the top header is being covered/overlapped by the navigation bar — fix the layering/spacing so nothing is obscured. Also ensure "Technical Data" is properly configured on mobile (it currently is not).

## 10. MODEL-PAGE MOBILE CONTENT (Tesla-style) — confirm done well
10.1 The mobile model page should match the Tesla-style experience: big image, model name, then the 3 key facts as a spec strip: **Seats, Range (in MILES), Top Speed (mph)** as the headline sellers, with the rest of the specs below.
10.2 Range must display in **miles** (and mph for speed). Confirm units are correct across the site.
10.3 Two buttons: **Get a Quote** (black) and **Learn More** (white), also repeated at the bottom of the page.

## 11. WHATSAPP BUTTON (currently NOT done)
11.1 Remove the **WhatsApp floating button** from the site.

## 12. MOBILE OPTIMISATION (homepage + model pages)
12.1 Fully optimise the **homepage** for mobile (layout, spacing, hero, sections, tap targets) to a premium Tesla-grade standard.
12.2 Fully optimise each **model page** for mobile (per §10), easy to use, fast, no overflow.

## 13. WELCOME EMAIL (currently NOT done)
13.1 Reword the account-registration "Welcome to Electric Buggies" email: do NOT say plainly "you registered an account". Instead lead with warmth and journey framing, e.g. "Congratulations on starting your electric journey", note it will guide them every step "whether you are looking to buy or hire a buggy", and invite them to "go to your account to track every step of the way". Keep it premium, friendly, no em-dashes.
13.2 The **"Go to my account"** button must link straight INTO the account (the dashboard), not a generic page.

## 14. HOMEPAGE SEO (enhance)
14.1 Review the homepage for additional SEO/keyword opportunities (golf buggies and utility vehicles UK, electric golf buggy, etc.) woven naturally into the H1, headings, intro copy, alt text and meta — without keyword stuffing and without fabricated claims. Coordinate with the broader SEO overhaul.

---

## REPORTING REQUIREMENT
Do NOT report "done" globally. For EACH numbered item (1.1, 1.2, ... 14.1), state DONE / NOT DONE / PARTIAL, and for each DONE give the exact live text or element to look for so it can be verified in the production HTML. Deploy to production and verify live. If anything cannot be done, say why plainly. Do not mark an item done unless it is live on the production site.
