import { getPosts } from "@/lib/content";
import { site } from "@/lib/site";

/** RSS 2.0 feed for the Journal, reads Sanity (seed fallback) via content layer. */
export const revalidate = 300;

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET() {
  const posts = await getPosts();
  const items = [...posts]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(
      (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>${site.url}/blog/${p.slug}</link>
      <guid>${site.url}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${escape(p.category)}</category>
      <description>${escape(p.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(site.name)}, The Journal</title>
    <link>${site.url}/blog</link>
    <description>Guides, insight and buyer's advice on electric buggies.</description>
    <language>en-GB</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
