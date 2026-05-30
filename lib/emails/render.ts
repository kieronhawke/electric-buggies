import { heroHtml } from "../email-image";

/** Fill a tokenized template with data. {{HERO}} -> model image slot,
 *  {{PREHEADER}} -> preheader, {{token}} -> data[token] (missing -> ""). */
export function renderTemplate(html: string, data: Record<string, string | undefined> & { _modelSlug?: string; _preheader?: string }): string {
  let out = html;
  out = out.split("{{HERO}}").join(heroHtml(data._modelSlug, data.model));
  out = out.split("{{PREHEADER}}").join(escapeText(data._preheader ?? ""));
  out = out.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    const v = data[k];
    return v == null ? "" : String(v);
  });
  return out;
}

/** Plain-text fallback from the rendered HTML (links kept, structure flattened). */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<a [^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (_, href, txt) => `${strip(txt)}${href && href !== "#" ? ` (${href})` : ""}`)
    .replace(/<\/(tr|p|div|h1|h2|table)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&middot;/g, "·").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

const strip = (s: string) => s.replace(/<[^>]+>/g, "").trim();
function escapeText(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
