import { NextResponse } from "next/server";

/**
 * Companies House company-name autocomplete proxy (brief §7). Key server-side
 * only (COMPANIES_HOUSE_API_KEY, Basic auth: key as username). Degrades to an
 * empty list (→ free-text) when no key is set. Never a dead end.
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ items: [] });

  const key = process.env.COMPANIES_HOUSE_API_KEY;
  if (!key) return NextResponse.json({ items: [], configured: false });

  try {
    const res = await fetch(
      `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(q)}&items_per_page=6`,
      { headers: { Authorization: "Basic " + Buffer.from(`${key}:`).toString("base64") } },
    );
    if (!res.ok) return NextResponse.json({ items: [] });
    const data = await res.json();
    const items = (data.items ?? []).map((c: { title: string; company_number: string; address_snippet?: string }) => ({
      name: c.title,
      number: c.company_number,
      address: c.address_snippet ?? "",
    }));
    return NextResponse.json({ items, configured: true });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
