import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain files to out/ for Cloudflare's
  // static-asset hosting. Security headers moved to public/_headers and the
  // /partners redirect to public/_redirects (same values as before).
  output: "export",
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
};

export default nextConfig;
