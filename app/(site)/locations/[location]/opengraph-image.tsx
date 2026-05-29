import { ImageResponse } from "next/og";
import { locations, locationBySlug } from "@/lib/data/locations";

export const alt = "Electric Buggies location";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locations.map((l) => ({ location: l.slug }));
}

export default async function OG({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const l = locationBySlug(location);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "linear-gradient(135deg, #0a0a0b 0%, #20262d 100%)", color: "#fff" }}>
        <div style={{ fontSize: 22, letterSpacing: 8, fontWeight: 700 }}>ELECTRIC BUGGIES</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, letterSpacing: 6, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>{l?.region ?? ""}</div>
          <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>{`Electric Buggies in ${l?.name ?? ""}`}</div>
        </div>
        <div style={{ fontSize: 22, letterSpacing: 6, color: "rgba(255,255,255,0.5)" }}>BUILT IN BRITAIN · DELIVERED WORLDWIDE</div>
      </div>
    ),
    { ...size },
  );
}
