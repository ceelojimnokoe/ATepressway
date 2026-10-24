"use client";

import { useState } from "react";
import { GalleryCard } from "./gallery-tile";
import type { ResolvedGalleryItem } from "@/content/gallery";

/**
 * The overflow past a folder's first 30 images (client instruction, 24 Oct
 * 2026 — "if any folder exceeds about 30 images, load progressively with a
 * 'Show more' button inside it, not numbered pages"). None of today's
 * folders are over 30, so this renders nothing for any of them right now —
 * it only activates once one grows past that count.
 *
 * A small client leaf, not the whole grid: the first 30 render directly in
 * the server-rendered folder page; these extra `<GalleryCard>`s (and their
 * `next/image`s) aren't mounted until the button is clicked.
 */
export function FolderShowMore({
  items,
  startIndex,
  showHeading,
}: {
  readonly items: readonly ResolvedGalleryItem[];
  readonly startIndex: number;
  readonly showHeading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  if (items.length === 0) return null;

  if (expanded) {
    return (
      <>
        {items.map(({ item }, i) => (
          <li key={item.id}>
            <GalleryCard item={item} lightboxIndex={startIndex + i} showHeading={showHeading} />
          </li>
        ))}
      </>
    );
  }

  return (
    <li className="sm:col-span-2 lg:col-span-3">
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="border border-hairline px-4 py-2.5 text-caption text-fg-muted uppercase tracking-wide hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        Show {items.length} more photo{items.length === 1 ? "" : "s"}
      </button>
    </li>
  );
}
