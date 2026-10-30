// Fails the build if the site refers to an /images/... file that has no
// AVIF and WebP derivatives in src/content/image-manifest.ts (or on disk).
// Runs automatically before `pnpm build` (the "prebuild" script) and is fast:
// it does no image work. Fix: run `pnpm images:build` and commit the output.

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { referencedImages } from "./referenced-images.mjs";

const manifestText = await readFile("src/content/image-manifest.ts", "utf8");
const manifest = new Map(
  [...manifestText.matchAll(/^ {2}("[^"]+"): \{ stem: ("[^"]+"), .*widths: \[([\d, ]+)\] \},$/gm)].map((m) => [
    JSON.parse(m[1]),
    { stem: JSON.parse(m[2]), widths: m[3].split(",").map(Number) },
  ]),
);

const problems = [];
const used = await referencedImages();
for (const [logical, file] of used) {
  const entry = manifest.get(logical);
  if (!entry) problems.push(`${logical}  (used in ${file}) is not in the image manifest`);
  else
    for (const w of entry.widths)
      for (const ext of [".avif", ".webp"])
        if (!existsSync(`public/img/${entry.stem}-${w}${ext}`))
          problems.push(`${logical}  is missing public/img/${entry.stem}-${w}${ext}`);
}
if (problems.length) {
  console.error("\nImage check failed:\n  " + problems.join("\n  ") + "\n\nRun `pnpm images:build`, then commit public/img/ and src/content/image-manifest.ts.\n");
  process.exit(1);
}
console.log(`images:check - ${used.size} referenced images all have derivatives`);
