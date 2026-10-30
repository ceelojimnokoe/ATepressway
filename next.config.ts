import type { NextConfig } from "next";

/**
 * Content Security Policy. This is a static content site with no
 * user-generated HTML and no third-party scripts, so the policy is tight:
 * everything loads from 'self'. 'unsafe-inline' is required for
 * script/style because Next's App Router injects an inline bootstrap
 * script and inline styles (and a few data-driven inline styles here,
 * e.g. the gallery aspect ratios and the corridor handle transform); a
 * nonce-based policy would force every page to render dynamically, which
 * isn't worth it for a fully static build. `data:` covers the generated
 * inline icons and Open Graph image; `blob:` remains available for
 * browser-created images.
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
  // The contact page embeds OpenStreetMap's own iframe for the corridor map
  // (no API key, no tracker). Without this, default-src 'self' blocks it.
  // Scoped to that single host — nothing else may be framed.
  "frame-src https://www.openstreetmap.org",
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
  // Next's own image optimizer is never used (custom loader below), so its
  // native image library (sharp/libvips, ~18-30 MB) has no reason to be
  // packed into any serverless function. `sharp` stays a devDependency purely
  // for `pnpm images:build` on a developer machine. Originals (assets-src/)
  // and source documents (docs-src/) are outside public/ and not imported
  // at runtime, so nothing else needs excluding.
  outputFileTracingExcludes: {
    "*": ["./node_modules/@img/**", "./node_modules/sharp/**", "./node_modules/.pnpm/@img*/**", "./node_modules/.pnpm/sharp*/**"],
  },
  images: {
    // Every image is a pre-built static WebP in /public/img (with AVIF sources
    // selected by StaticImage; see docs/IMAGES.md) - nothing goes through
    // Next's /_next/image optimizer, so this works on any host.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Kept identical to LADDER in scripts/build-images.mjs, so every srcset
    // entry the browser sees is a width that really exists on disk. The
    // small `imageSizes` list is empty on purpose: the smallest derivative
    // is already 320px wide.
    deviceSizes: [320, 480, 640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [],
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
