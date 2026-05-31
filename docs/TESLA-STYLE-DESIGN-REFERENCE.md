# Electric Buggies — Tesla-Style Design Reference (mobile-first)

**For:** Claude Code. **Purpose:** reproduce the *layout, spacing and feel* of Tesla's mobile site (which the owner uses as the gold standard) in the Electric Buggies cool-monochrome brand. **Use our OWN buggy imagery and content — never copy Tesla's photos, text, or specs (copyright).** Quote-led, not checkout. No em-dashes. Verify on the live URL; mobile-first (360/390/430) then scale up.

The owner shared 15 reference screenshots of tesla.com mobile. Reproduce these PATTERNS (not the specifics):

## Patterns to reproduce
1. **Hero:** full-bleed large vehicle image, very little text, model name as a big light headline, two clear buttons side by side. Ours: a buggy hero + "Configure" / "Request a quote" (not "Order Now"/finance). Carousel dots if multiple heroes.
2. **3-spec strip:** under the model name, three big numbers side by side with small labels. Tesla uses Range / Top Speed / 0-60. **Ours: Range / Top Speed / Seats** (or Charge Time) — use real buggy figures or [CONFIRM] placeholders, never invented numbers.
3. **Sticky bottom bar (configurator/model pages):** a price/summary pinned to the bottom of the viewport that stays while scrolling, with an expand chevron and a primary button. **Ours ends in "Request a tailored quote"** (no monthly-payment/finance framing). Can show "From £X" only if we have a real figure, else just the CTA.
4. **Vertical-scroll configurator:** each option group (paint/finish, wheels, interior, roof, branding) is a scroll section with swatches and an "Included" or "+£X" label, big preview image updating above. Clean, one decision at a time. Keep our existing logo/branding step.
5. **Feature carousel ("Meet …"):** swipeable cards, each a strong lifestyle photo + a one-word label (Tesla: Safety / Convenience / Warranties / Utility) with a "+" to expand detail. **Ours:** use for our sectors (Estates / Resorts / Events / Golf / Airports) or ownership features (Warranty / 24hr Support / Bespoke / Service) — with our own imagery.
6. **Clean lead form:** first name, last name, email, phone (with country code), minimal consent tick-boxes, one big submit. Calm, lots of whitespace. Match our quote/enquiry/hire forms to this restraint.
7. **Region/country selector:** grouped by continent, clean typographic list — relevant for our international location pages.

## What to OMIT (Tesla-specific, not us)
Finance/APR/monthly-payment framing; test-drive scheduling; Supercharging; Full Self-Driving; trade-in; their exact specs and any of their photography or wording.

## Design language (from the screenshots)
Generous whitespace; large clean imagery dominates; minimal text; big light headlines over images, near-black headings on white; thin thumbnail swatches; a persistent bottom CTA; tasteful sectioning with "Included"-style small labels. This matches our cool-monochrome brand (white/near-black, refined sans). Keep functional colour minimal and purposeful.

## Rules
Our imagery only (real transparent/clean buggy PNGs + our lifestyle shots), our copy, our quote-led CTAs. No Tesla assets. No em-dashes, no fabricated specs (use [CONFIRM] placeholders). Mobile-first and flawless, then desktop. Keep performance/accessibility to the standards already in the repo. Verify live; update AUDIT-REPORT.md.
