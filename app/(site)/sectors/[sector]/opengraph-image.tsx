import { ImageResponse } from "next/og";
import { sectors, sectorBySlug } from "@/lib/data/sectors";

export const alt = "Electric Buggies sector";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return sectors.map((s) => ({ sector: s.slug }));
}

export default async function OG({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const s = sectorBySlug(sector);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "linear-gradient(135deg, #0a0a0b 0%, #20262d 100%)", color: "#fff" }}>
        <div style={{ fontSize: 22, letterSpacing: 8, fontWeight: 700 }}>ELECTRIC BUGGIES</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, letterSpacing: 6, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Sector</div>
          <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>{s?.name ?? "Sectors"}</div>
          <div style={{ fontSize: 34, marginTop: 20, color: "rgba(255,255,255,0.8)" }}>{s?.tagline ?? ""}</div>
        </div>
        <div style={{ fontSize: 22, letterSpacing: 6, color: "rgba(255,255,255,0.5)" }}>ELECTRIC · BESPOKE · BRITISH</div>
      </div>
    ),
    { ...size },
  );
}
