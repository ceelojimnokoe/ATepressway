import { imageManifest } from "@/content/image-manifest";

/**
 * Global next/image loader (wired up in next.config.ts as `loaderFile`).
 * Instead of asking a server to resize images on demand, it points at the
 * WebP files pre-built into /public/img by `pnpm images:build`, so no image
 * ever goes through /_next/image and any static host can serve them.
 *
 * For a requested width it picks the smallest derivative at or above that
 * width, or the largest one if none is big enough - so it always names a
 * real file. An image missing from the manifest fails loudly on the server
 * (which is what stops the build) and is only a console warning in the
 * browser, where throwing would blank the page.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  // Remote URLs and SVGs are not ours to resize; pass them through.
  if (/^https?:\/\//.test(src) || src.endsWith(".svg")) return src;

  const entry = imageManifest[src];
  if (!entry) {
    const message = `[images] "${src}" is not in the image manifest - run \`pnpm images:build\` and commit public/img/ and src/content/image-manifest.ts.`;
    if (typeof window === "undefined") throw new Error(message);
    console.warn(message);
    return src;
  }
  const chosen = entry.widths.find((w) => w >= width) ?? entry.widths[entry.widths.length - 1];
  return `/img/${entry.stem}-${chosen}.webp`;
}
