import type { NextConfig } from "next";

// Content-Security-Policy. Scoped to self + Sanity (CDN/API/Studio) + Unsplash
// (interim imagery) + Vercel analytics. 'unsafe-eval'/'unsafe-inline' are
// required by the embedded Sanity Studio and Next's inline bootstrap; a
// nonce-based stricter policy is a documented future hardening.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://*.sanity.io",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sanity.io https://*.api.sanity.io https://api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src 'self' https://*.sanity.io",
  "media-src 'self' https://cdn.sanity.io",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
