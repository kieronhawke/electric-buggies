/**
 * Email-safe brand blocks for the Communications editor. Each is a table-based,
 * inline-styled snippet matching the approved templates, insertable into the
 * body. Merge tokens ({{...}}) and {{HERO}}/{{PREHEADER}} are preserved verbatim.
 */
export interface BrandBlock { id: string; label: string; html: string }

const PANEL = `style="margin:0 auto;width:100%;max-width:600px;"`;

export const BRAND_BLOCKS: BrandBlock[] = [
  { id: "hero", label: "Vehicle hero image", html: `\n{{HERO}}\n` },
  {
    id: "headline", label: "Headline",
    html: `\n<tr><td style="padding:8px 40px 0;"><h1 style="margin:0;font:600 26px/1.25 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;letter-spacing:-.02em;">Your headline here</h1></td></tr>\n`,
  },
  {
    id: "paragraph", label: "Paragraph",
    html: `\n<tr><td style="padding:14px 40px 0;font:400 15px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#3a3a3e;">Write your message here. Keep sentences short and warm.</td></tr>\n`,
  },
  {
    id: "button", label: "Button",
    html: `\n<tr><td style="padding:26px 40px 6px;"><a href="{{ctaLink}}" style="display:inline-block;background:#0a0a0b;color:#ffffff;text-decoration:none;font:600 14px/1 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:15px 26px;border-radius:6px;">View your account</a></td></tr>\n`,
  },
  {
    id: "detail", label: "Detail rows",
    html: `\n<tr><td style="padding:20px 40px 0;"><table role="presentation" width="100%" style="border-collapse:collapse;font:400 14px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <tr><td style="padding:9px 0;border-bottom:1px solid #ececee;color:#86868b;">Model</td><td style="padding:9px 0;border-bottom:1px solid #ececee;color:#0a0a0b;text-align:right;font-weight:600;">{{model}}</td></tr>
  <tr><td style="padding:9px 0;border-bottom:1px solid #ececee;color:#86868b;">Reference</td><td style="padding:9px 0;border-bottom:1px solid #ececee;color:#0a0a0b;text-align:right;font-weight:600;">{{orderRef}}</td></tr>
</table></td></tr>\n`,
  },
  {
    id: "bank", label: "Bank details",
    html: `\n<tr><td style="padding:20px 40px 0;"><table role="presentation" width="100%" style="border-collapse:collapse;background:#f5f6f7;border-radius:8px;font:400 14px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <tr><td style="padding:16px 18px 6px;color:#86868b;">Account name</td><td style="padding:16px 18px 6px;text-align:right;font-weight:600;color:#0a0a0b;">{{bankName}}</td></tr>
  <tr><td style="padding:6px 18px;color:#86868b;">Sort code</td><td style="padding:6px 18px;text-align:right;font-weight:600;color:#0a0a0b;">{{bankSort}}</td></tr>
  <tr><td style="padding:6px 18px;color:#86868b;">Account number</td><td style="padding:6px 18px;text-align:right;font-weight:600;color:#0a0a0b;">{{bankAccount}}</td></tr>
  <tr><td style="padding:6px 18px 16px;color:#86868b;">Payment reference</td><td style="padding:6px 18px 16px;text-align:right;font-weight:700;color:#0a0a0b;">{{paymentRef}}</td></tr>
</table></td></tr>\n`,
  },
  {
    id: "callout", label: "Callout panel",
    html: `\n<tr><td style="padding:20px 40px 0;"><table role="presentation" width="100%" style="border-collapse:collapse;background:#f5f6f7;border-radius:8px;"><tr><td style="padding:18px 20px;font:400 14px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#3a3a3e;">A helpful note or reassurance for the customer.</td></tr></table></td></tr>\n`,
  },
  {
    id: "divider", label: "Divider",
    html: `\n<tr><td style="padding:24px 40px;"><div style="height:1px;background:#ececee;line-height:1px;font-size:0;">&nbsp;</div></td></tr>\n`,
  },
];

/** The full document skeleton used when starting a custom email from scratch. */
export const CUSTOM_EMAIL_SKELETON = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#eef0f2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{{PREHEADER}}</div>
<table role="presentation" width="100%" style="border-collapse:collapse;background:#eef0f2;"><tr><td style="padding:28px 12px;">
<table role="presentation" ${PANEL} style="margin:0 auto;width:100%;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;">
  <tr><td style="padding:30px 40px 0;text-align:center;font:700 18px/1 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;letter-spacing:.02em;color:#0a0a0b;">Electric&nbsp;Buggies</td></tr>
  <tr><td style="padding:8px 40px 0;"><h1 style="margin:0;font:600 26px/1.25 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;letter-spacing:-.02em;">Hello {{firstName}}</h1></td></tr>
  <tr><td style="padding:14px 40px 0;font:400 15px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#3a3a3e;">Write your message here.</td></tr>
  <tr><td style="padding:30px 40px 34px;">
    <table role="presentation" width="100%" style="border-collapse:collapse;border-top:1px solid #ececee;"><tr><td style="padding:18px 0 0;font:400 12px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#9a9aa0;">
      <a href="{{accountLink}}" style="color:#9a9aa0;">Visit your account</a> &nbsp;·&nbsp; <a href="{{privacyLink}}" style="color:#9a9aa0;">Privacy</a> &nbsp;·&nbsp; <a href="{{unsubscribeLink}}" style="color:#9a9aa0;">Unsubscribe</a>
    </td></tr></table>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
