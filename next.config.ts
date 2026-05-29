import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity image CDN (brief §3/§8) + Eagle EV source for the image pipeline.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
