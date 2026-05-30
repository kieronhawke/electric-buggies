import { NextResponse } from "next/server";
import { rateLimited, clientIp } from "@/lib/rate-limit";

/**
 * Google Places Autocomplete (New) proxy for UK + international address finding
 * (brief §7). Key server-side only (GOOGLE_PLACES_API_KEY). `?q=` returns
 * predictions; `?placeId=` returns the formatted address + country. Degrades to
 * empty (→ manual entry) when no key. getAddress.io is a swappable UK-only
 * alternative behind the same shape.
 */
export async function GET(req: Request) {
  if (rateLimited("places", clientIp(req), 30, 60 * 1000)) {
    return NextResponse.json({ items: [], error: "rate limited" }, { status: 429 });
  }
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const placeId = url.searchParams.get("placeId");
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return NextResponse.json({ items: [], configured: false });

  try {
    if (placeId) {
      const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
        headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "formattedAddress,addressComponents" },
      });
      const d = await res.json();
      const country = (d.addressComponents ?? []).find((c: { types: string[] }) => c.types?.includes("country"));
      return NextResponse.json({ address: d.formattedAddress ?? "", countryCode: country?.shortText ?? "" });
    }
    if (q.length < 3) return NextResponse.json({ items: [] });
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
      body: JSON.stringify({ input: q }),
    });
    const d = await res.json();
    const items = (d.suggestions ?? []).map((s: { placePrediction?: { placeId: string; text?: { text: string } } }) => ({
      id: s.placePrediction?.placeId,
      label: s.placePrediction?.text?.text ?? "",
    })).filter((i: { id?: string }) => i.id);
    return NextResponse.json({ items, configured: true });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
