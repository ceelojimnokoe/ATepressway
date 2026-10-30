// Shared by build-images.mjs and check-images.mjs: finds every original image
// the site refers to, i.e. every quoted "/images/....(jpg|jpeg|png|webp)" string
// in src/ (the registry in content/media.ts, content/project.ts, components...).
// The generated manifest is excluded so it can't vouch for itself.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    out.push(...(e.isDirectory() ? await walk(full) : [full]));
  }
  return out;
}

/** Map of logical path (e.g. "/images/atel11.jpg") to the first file that mentions it. */
export async function referencedImages(srcDir = "src") {
  const used = new Map();
  for (const file of (await walk(srcDir)).filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith("image-manifest.ts"))) {
    const text = await readFile(file, "utf8");
    for (const m of text.matchAll(/["'`](\/images\/[^"'`]+?\.(?:jpe?g|png|webp))["'`]/gi)) {
      if (!used.has(m[1])) used.set(m[1], file);
    }
  }
  return used;
}
