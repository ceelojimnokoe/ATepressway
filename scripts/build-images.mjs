// Pre-generates the site's image derivatives: reads originals from
// assets-src/images/** (kept out of public/ so they are not deployed) and writes
// AVIF and WebP files to public/img/**, plus a manifest (src/content/image-manifest.ts)
// the custom loader and StaticImage component read. Run with
// `pnpm images:build`, then commit public/img/ and the manifest.
// Never runs during `pnpm build`. See docs/IMAGES.md.

import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { referencedImages } from "./referenced-images.mjs";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "assets-src", "images");
const OUT_DIR = path.join(ROOT, "public", "img");
const MANIFEST = path.join(ROOT, "src", "content", "image-manifest.ts");
const CACHE = path.join(ROOT, "scripts", "image-hashes.json");
// Optional per-image width overrides (see scripts/analyze-image-widths.mjs).
const WIDTHS = path.join(ROOT, "scripts", "image-widths.json");

// Must match images.deviceSizes in next.config.ts.
const LADDER = [320, 480, 640, 828, 1080, 1280, 1600, 1920, 2400];
const MAX_WIDTH = LADDER[LADDER.length - 1];
// Sources at or under this size get a single native-width file, not a ladder.
const SMALL_BYTES = 40 * 1024;
// WebP quality: 78 for rungs of 1080px and up (hero / large), 74 below (thumbnails).
const quality = (w) => (w >= 1080 ? 78 : 74);
const avifQuality = (w) => (w >= 1080 ? 55 : 52);
// Bump to force a rebuild of everything when the recipe above changes.
const RECIPE = "v2-avif";

// Originals deliberately held back from the site (client has not approved them):
// no derivatives are made, so nothing publishes them by accident.
const SKIP = new Set(["/images/header3.png"]);

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** "/images/Hon. Kwame (MP).png" -> "hon-kwame-mp" (derivative stem). */
function stemFor(logical) {
  return logical
    .replace(/^\/images\//, "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const cache = JSON.parse(await readFile(CACHE, "utf8").catch(() => "{}"));
const nextCache = {};
const widthOverrides = JSON.parse(await readFile(WIDTHS, "utf8").catch(() => "{}"));
const referenced = await referencedImages();
const unreferenced = [];
const manifest = {};
const stems = new Map();
let built = 0;
let reused = 0;

for (const file of (await walk(SRC_DIR)).sort()) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTS.has(ext)) continue; // SVGs and anything else are served as-is
  const logical = "/images/" + path.relative(SRC_DIR, file).split(path.sep).join("/");
  if (SKIP.has(logical)) continue;
  // Only images the site actually refers to get derivatives.
  if (!referenced.has(logical)) { unreferenced.push(logical); continue; }
  const stem = stemFor(logical);
  if (stems.has(stem)) throw new Error(`Derivative name clash: ${logical} and ${stems.get(stem)} both map to "${stem}"`);
  stems.set(stem, logical);

  const bytes = await readFile(file);
  const hash = createHash("sha1").update(RECIPE).update(JSON.stringify(widthOverrides[logical] ?? null)).update(bytes).digest("hex").slice(0, 16);
  const meta = await sharp(bytes).rotate().metadata(); // .rotate() applies EXIF orientation
  // metadata() reports the pre-rotation size; swap for 90/270-degree orientations.
  const swap = meta.orientation && meta.orientation >= 5;
  const srcW = swap ? meta.height : meta.width;
  const srcH = swap ? meta.width : meta.height;

  let widths;
  if (bytes.length <= SMALL_BYTES) widths = [Math.min(srcW, MAX_WIDTH)];
  else {
    widths = LADDER.filter((w) => w < srcW);
    if (srcW <= MAX_WIDTH && !widths.includes(srcW)) widths.push(srcW); // native top rung, never upscaled
    if (widths.length === 0) widths = [srcW];
    // Drop rungs no layout ever selects (generated list; absent = keep all).
    const keep = widthOverrides[logical];
    if (keep) widths = widths.filter((w) => keep.includes(w));
    if (widths.length === 0) widths = [Math.max(...LADDER.filter((w) => w < srcW), srcW)];
  }

  const dir = path.join(OUT_DIR, path.dirname(stem));
  await mkdir(dir, { recursive: true });
  const upToDate =
    cache[logical] === hash &&
    (
      await Promise.all(
        widths.flatMap((w) =>
          [".avif", ".webp"].map((ext) =>
            stat(path.join(OUT_DIR, `${stem}-${w}${ext}`)).then(
              () => true,
              () => false,
            ),
          ),
        ),
      )
    ).every(Boolean);

  if (upToDate) reused++;
  else {
    for (const w of widths) {
      // No .withMetadata(): sharp drops EXIF/GPS/ICC by default.
      await sharp(bytes)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: quality(w), effort: 5 })
        .toFile(path.join(OUT_DIR, `${stem}-${w}.webp`));
      await sharp(bytes)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .avif({ quality: avifQuality(w), effort: 3 })
        .toFile(path.join(OUT_DIR, `${stem}-${w}.avif`));
    }
    built++;
  }
  nextCache[logical] = hash;
  manifest[logical] = { stem, w: srcW, h: srcH, widths };
}

// Prune derivatives that no longer belong to any source.
const wanted = new Set(
  Object.values(manifest).flatMap((m) =>
    m.widths.flatMap((w) => [".avif", ".webp"].map((ext) => path.join(OUT_DIR, `${m.stem}-${w}${ext}`))),
  ),
);
let pruned = 0;
for (const f of await walk(OUT_DIR).catch(() => [])) {
  if (!wanted.has(f)) { await rm(f); pruned++; }
}

const body = Object.entries(manifest)
  .map(([k, m]) => `  ${JSON.stringify(k)}: { stem: ${JSON.stringify(m.stem)}, w: ${m.w}, h: ${m.h}, widths: [${m.widths.join(", ")}] },`)
  .join("\n");
await writeFile(
  MANIFEST,
  `// GENERATED by scripts/build-images.mjs (pnpm images:build) - do not edit by hand.
// Maps each original (/images/...) to its AVIF and WebP derivatives in /img/.
// For width W, the files are \`/img/\${stem}-\${W}.avif\` and \`.webp\`.
// w/h are the original's intrinsic size.

export interface ImageManifestEntry {
  readonly stem: string;
  readonly w: number;
  readonly h: number;
  readonly widths: readonly number[];
}

export const imageManifest: Readonly<Record<string, ImageManifestEntry>> = {
${body}
};
`,
);
await writeFile(CACHE, JSON.stringify(nextCache, null, 1) + "\n");

const files = [...wanted];
let total = 0;
for (const f of files) total += (await stat(f)).size;
if (unreferenced.length) console.log(`skipped ${unreferenced.length} unreferenced originals:\n  ${unreferenced.join("\n  ")}`);
console.log(`images:build - ${Object.keys(manifest).length} sources (${built} built, ${reused} unchanged), ${files.length} derivatives, ${(total / 1048576).toFixed(1)} MB, ${pruned} pruned`);
