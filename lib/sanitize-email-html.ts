/**
 * Conservative email-HTML sanitiser: strips script/style-injection vectors while
 * preserving the table + inline-style markup email templates rely on. Not a full
 * DOM sanitiser, but blocks the dangerous sinks for admin-authored email HTML.
 */
export function sanitizeEmailHtml(html: string): string {
  let out = html;
  out = out.replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, "");
  out = out.replace(/<\s*script[^>]*>/gi, "");
  out = out.replace(/<\s*iframe[\s\S]*?<\s*\/\s*iframe\s*>/gi, "");
  out = out.replace(/<\s*(object|embed|form|base|meta[^>]*http-equiv)[^>]*>/gi, "");
  // Inline event handlers: on*="..." / on*='...'
  out = out.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");
  // javascript:/data:text-html URLs in href/src
  out = out.replace(/(href|src)\s*=\s*"(\s*javascript:|\s*data:text\/html)[^"]*"/gi, '$1="#"');
  out = out.replace(/(href|src)\s*=\s*'(\s*javascript:|\s*data:text\/html)[^']*'/gi, "$1='#'");
  return out;
}
