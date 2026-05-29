import { ImageResponse } from "next/og";
import { posts, postBySlug } from "@/lib/data/blog";

export const alt = "Electric Buggies Journal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "linear-gradient(135deg, #0a0a0b 0%, #20262d 100%)", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, fontWeight: 700 }}>
          <span>ELECTRIC BUGGIES</span><span style={{ color: "rgba(255,255,255,0.6)" }}>THE JOURNAL</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, letterSpacing: 4, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>{p?.category ?? ""}</div>
          <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05, marginTop: 10 }}>{p?.title ?? "Journal"}</div>
        </div>
        <div style={{ fontSize: 22, letterSpacing: 4, color: "rgba(255,255,255,0.5)" }}>{p ? `${p.readingTime} min read · ${p.author}` : ""}</div>
      </div>
    ),
    { ...size },
  );
}
