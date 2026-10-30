# Images: how they work and how to add one

The site never resizes images while it is running. Every photo is turned into
AVIF and WebP files **once, on your computer**, and those files are committed to
git. Browsers that support AVIF use it; WebP remains the fallback. That way any
host can serve them, and no image service is involved.

- Originals live in `assets-src/images/` (keep them as they are). This folder is outside `public/`, so originals are **not deployed**.
- The generated files live in `public/img/` (never edit these by hand).
- `src/content/image-manifest.ts` is a generated list of what exists.
- `src/components/ui/static-image.tsx` serves AVIF at responsive sizes, and
  `src/lib/image-loader.ts` picks the corresponding WebP fallback.

## Adding a new photo

1. Copy the photo into `assets-src/images/` (for example
   `assets-src/images/atel60.jpg`).
2. Register it in `src/content/media.ts` as you do today (path, alt text,
   width, height). The path stays `/images/atel60.jpg`: that is the name the
   site uses, not a real URL.
3. Run `pnpm images:build`. It only processes new or changed photos, so it is
   quick after the first run.
4. Commit the new original, the AVIF and WebP files in `public/img/`, and the
   updated `src/content/image-manifest.ts`.

Only photos the site actually mentions get files made: if no code or content
refers to `/images/atel60.jpg`, `pnpm images:build` lists it as "unreferenced"
and skips it.

If you forget step 3, `pnpm build` stops and prints the name of the photo that
has no generated files. Run `pnpm images:build` and commit the result.

## Good to know

- Sizes made: 320, 480, 640, 828, 1080, 1280, 1600, 1920 and 2400 pixels wide
  (never larger than the original). Very small originals get one file.
- Quality: 78 for files 1080px wide and up, 74 for smaller ones.
- AVIF quality: 55 for files 1080px wide and up, 52 for smaller ones.
- Photo orientation is applied and all metadata (including GPS) is removed.
- `scripts/image-widths.json` (optional, generated) lists sizes that no layout
  on the site ever picks for a few photos; those sizes are skipped. A new photo
  has no entry and gets every size.
- SVG files are not converted; they are served as they are.
- To keep a photo off the site, add its path to `SKIP` in
  `scripts/build-images.mjs` (that is how `header3.png` is held back).
- If you change the list of sizes, change it in **both**
  `scripts/build-images.mjs` (`LADDER`) and `next.config.ts` (`deviceSizes`),
  then run `pnpm images:build`.
