import { ImageResponse } from "next/og";
import { models, modelBySlug } from "@/lib/data/models";
import { gbp } from "@/lib/utils";

export const alt = "Electric Buggies model";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return models.map((m) => ({ model: m.slug }));
}

/** Dynamic per-model Open Graph image (name + price). */
export default async function OG({ params }: { params: Promise<{ model: string }> }) {
  const { model: slug } = await params;
  const m = modelBySlug(slug);
  const name = m?.name ?? "Electric Buggies";
  const price = m && m.basePrice > 0 ? `From ${gbp(m.basePrice)}` : "Made to order";
  const cat = m?.categoryLabel ?? "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "linear-gradient(135deg, #0a0a0b 0%, #20262d 100%)", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 8, fontWeight: 700 }}>
          <div style={{ width: 26, height: 26, border: "3px solid #fff", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 10, height: 10, background: "#fff" }} /></div>
          ELECTRIC BUGGIES
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>{cat}</div>
          <div style={{ fontSize: 110, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>{name}</div>
          <div style={{ fontSize: 40, marginTop: 24, color: "rgba(255,255,255,0.85)" }}>{price}</div>
        </div>
        <div style={{ fontSize: 22, letterSpacing: 6, color: "rgba(255,255,255,0.5)" }}>ELECTRIC · BESPOKE · BRITISH</div>
      </div>
    ),
    { ...size },
  );
}
