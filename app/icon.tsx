import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Generated app icon — brand glyph (square with inner square) on ink. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0a0a0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 300, height: 300, border: "30px solid #fff", borderRadius: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 130, height: 130, background: "#fff" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
