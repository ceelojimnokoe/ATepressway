import type { NextConfig } from "next";

/**
 * Content Security Policy. This is a static content site with no
 * user-generated HTML and no third-party scripts, so the policy is tight:
 * everything loads from 'self'. 'unsafe-inline' is required for
 * script/style because Next's App Router injects an inline bootstrap
 * script and inline styles (and a few data-driven inline styles here,
 * e.g. the gallery aspect ratios and the corridor handle transform); a
 * nonce-based policy would force every page to render dynamically, which
 * isn't worth it for a fully static build. `data:`/`blob:` on img-src
 * cover next/image's optimizer output.
 *
 * `'unsafe-eval'` is added in development ONLY — Next's dev/HMR runtime
 * evaluates code via eval(), so without it the dev server can't hydrate
 * (count-ups freeze, scroll-reveals stay hidden). The production policy
 * never allows eval.
 */
const isDev = process.env.NODE_ENV === "development";

const scriptSrc = isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    // Allowed next/image quality values used across the site: 65/70 for the
    // large hero and page-hero photos (softened, and masked by overlays),
    // 75 (the default) elsewhere.
    qualities: [65, 70, 75],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // /partners was renamed to /stakeholders. Permanent (308) so search
      // engines and any external links transfer to the new path.
      {
        source: "/partners",
        destination: "/stakeholders",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
