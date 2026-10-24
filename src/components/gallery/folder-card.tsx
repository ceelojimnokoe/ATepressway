"use client";

import { useState } from "react";
import type { PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { duration, easing } from "@/lib/motion";
import { formatFolderDate, type ResolvedGalleryFolder } from "@/content/folders";

const COVER_SIZES = "(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 90vw";
const PREVIEW_SIZES = "18vw";

/**
 * One folder tile on the Gallery index. Always shows the cover photo, a
 * "stacked photos" double-edge treatment (reads as a stack even before any
 * interaction, and is purely static — no animation applied to it), the
 * title, date and photo count.
 *
 * On hover (mouse only — `pointerType` is checked the same way
 * DesktopNav's dropdown does, so a tap that briefly fires `pointerenter`
 * before navigating away on touch never triggers this) or keyboard focus,
 * up to 3 more images from the folder cross-fade in as a 2×2 montage over
 * the cover — opacity only, duration/easing from `lib/motion.ts`. Those
 * extra `<Image>`s are not even mounted until the FIRST hover or focus
 * (`interacted`), so touch and reduced-motion visitors never fetch them.
 * Under `prefers-reduced-motion` the montage never mounts at all — the
 * cover alone is what shows, full stop.
 */
export function FolderCard({ folder }: { readonly folder: ResolvedGalleryFolder }) {
  const [interacted, setInteracted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const count = folder.items.length;
  const canPreview = !reducedMotion && folder.previews.length > 0;
  const montage = [folder.cover, ...folder.previews].slice(0, 4);

  function activate() {
    if (!canPreview) return;
    setInteracted(true);
    setHovered(true);
  }
  function onPointerEnter(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "mouse") activate();
  }
  function onPointerLeave(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "mouse") setHovered(false);
  }

  return (
    <Link
      href={`/gallery/${folder.slug}`}
      aria-label={`${folder.title}, ${count} photo${count === 1 ? "" : "s"}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={activate}
      onBlur={() => setHovered(false)}
      className="group flex flex-col gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-hairline bg-surface-sunk">
        {/* Static "stack of photos" edges — never animated, present at every breakpoint. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-[6px] -z-10 border border-hairline bg-surface-raised" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-[3px] -z-10 border border-hairline bg-surface-raised" />

        <Image
          src={folder.cover.asset.src}
          alt={folder.cover.asset.alt}
          fill
          sizes={COVER_SIZES}
          loading="lazy"
          className="object-cover"
        />

        {canPreview && interacted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: duration.base, ease: easing.out }}
            className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-hairline"
          >
            {montage.map((preview) => (
              <div key={preview.item.id} className="relative overflow-hidden bg-surface-sunk">
                <Image src={preview.asset.src} alt="" fill sizes={PREVIEW_SIZES} className="object-cover" />
              </div>
            ))}
          </motion.div>
        )}

        <span className="figure absolute right-2 bottom-2 z-10 border border-accent bg-lime px-2 py-1 text-caption text-void">
          {count} {count === 1 ? "photo" : "photos"}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-small text-fg transition-colors duration-150 ease-out group-hover:text-accent">
          {folder.title}
        </span>
        <span className="text-caption text-fg-faint tracking-wide uppercase">{formatFolderDate(folder)}</span>
      </div>
    </Link>
  );
}
