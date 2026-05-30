import { site } from "./site";

const SLUG_TO_IMG: Record<string, string> = {
  "the-two": "two", "the-four": "four", "the-six": "six",
  "the-eight": "eight", "the-utility": "utility", bespoke: "bespoke",
};

/** Absolute URL of the transparent buggy PNG for a model (email-safe). */
export function emailHeroUrl(modelSlug?: string | null): string {
  const name = (modelSlug && SLUG_TO_IMG[modelSlug]) || "six";
  return `${site.url}/img/email/${name}.png`;
}

/**
 * Hero cell HTML. The real transparent PNG sits in a soft panel that keeps its
 * height + background, so if the image is missing or fails to load the slot
 * degrades to a clean placeholder rather than a broken icon or collapsed space.
 */
export function heroHtml(modelSlug?: string | null, modelName?: string | null): string {
  const url = emailHeroUrl(modelSlug);
  const alt = `Your Electric Buggies ${modelName || "vehicle"}`;
  if (!url) return placeholderHero();
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f7;border:1px solid #e3e5e8;border-radius:8px;"><tr><td align="center" style="padding:20px;min-height:150px;height:150px;"><img src="${url}" alt="${alt}" width="380" style="display:block;width:100%;max-width:380px;height:auto;border:0;outline:none;text-decoration:none;margin:0 auto;"></td></tr></table>`;
}

function placeholderHero(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f7;border:1px solid #e3e5e8;border-radius:8px;"><tr><td align="center" style="padding:46px 20px;height:150px;"><div style="font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#aeb4ba;">Electric Buggies</div><div style="font-size:11px;letter-spacing:.04em;color:#c2c7cc;margin-top:6px;">Your vehicle</div></td></tr></table>`;
}

export { SLUG_TO_IMG };
