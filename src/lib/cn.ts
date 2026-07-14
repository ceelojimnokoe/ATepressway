import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Plain twMerge doesn't know this project's custom --text-* scale
 * (text-caption/text-lead/text-heading-1..4/text-figure — see
 * globals.css). Without this extension it buckets those alongside text
 * COLOR utilities (text-lime, text-ink-1, ...) as one generic "unknown
 * text-*" conflict group, so combining e.g. text-lime with
 * text-heading-2 silently drops text-lime instead of keeping both —
 * exactly the kind of bug that makes the site's signal colour quietly
 * stop rendering. Declaring the scale as its own font-size group fixes
 * that at the root instead of working around it at every call site.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-caption",
        "text-small",
        "text-body",
        "text-lead",
        "text-heading-1",
        "text-heading-2",
        "text-heading-3",
        "text-heading-4",
        "text-figure",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
