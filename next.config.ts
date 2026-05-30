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
  // No feature needs camera/mic/geo (logo upload is a file input, not getUserMedia).
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Isolate our browsing context. CORP is intentionally NOT set globally so OG
  // images / sitemap stay cross-origin fetchable by social + search crawlers.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

// Private / non-content routes: keep them out of search indexes defence-in-depth
// (they also redirect or are role-gated). robots.txt already disallows them.
const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  // Bundle the SQL migration files into the one-time DB setup function so the
  // drizzle migrator can read them at runtime on Vercel.
  outputFileTracingIncludes: {
    "/api/admin/setup": ["./lib/db/migrations/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/studio/:path*", headers: noindex },
      { source: "/admin/:path*", headers: noindex },
      { source: "/account/:path*", headers: noindex },
      { source: "/engineer/:path*", headers: noindex },
      { source: "/api/:path*", headers: noindex },
    ];
  },
  async redirects() {
    return [
      // Consolidate the duplicate lead route to one canonical /request-a-quote.
      { source: "/contact", destination: "/request-a-quote", permanent: true },
      // Journal was renamed to Guides; 301 the old paths.
      { source: "/blog", destination: "/guides", permanent: true },
      { source: "/blog/:path*", destination: "/guides/:path*", permanent: true },
      { source: "/journal", destination: "/guides", permanent: true },
      { source: "/journal/:path*", destination: "/guides/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
