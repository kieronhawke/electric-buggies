import { ImageResponse } from "next/og";

export const alt = "Electric Buggies — Electric · Bespoke · British";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded default Open Graph image. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0b 0%, #20262d 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
          <div style={{ width: 34, height: 34, border: "3px solid #fff", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 13, height: 13, background: "#fff" }} />
          </div>
          <div style={{ fontSize: 26, letterSpacing: 10, fontWeight: 700 }}>ELECTRIC BUGGIES</div>
        </div>
        <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -2, maxWidth: 900, textAlign: "center", lineHeight: 1.05 }}>
          The quiet way to move, beautifully made.
        </div>
        <div style={{ fontSize: 24, letterSpacing: 6, color: "rgba(255,255,255,0.6)", marginTop: 28 }}>
          ELECTRIC · BESPOKE · BRITISH
        </div>
      </div>
    ),
    { ...size },
  );
}
