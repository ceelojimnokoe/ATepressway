"use client";

import { useId } from "react";
import { GalleryLightbox, type LightboxImage } from "@/components/gallery/gallery-lightbox";
import { SafeBoundary } from "@/components/gallery/safe-boundary";
import { AnimatedProgressBar } from "@/components/ui/animated-progress-bar";

interface StructureProgressProps {
  readonly label: string;
  readonly percent: number;
  readonly sublabel?: string;
  readonly images: readonly LightboxImage[];
}

/**
 * A progress bar whose label opens a lightbox of that structure's design
 * images. Reuses GalleryLightbox — same focus trap, Esc, arrow paging and
 * focus-return-to-trigger. The bar is a SIBLING of the lightbox inside a
 * scoping container: the lightbox is scoped by `rootId` so that, with four
 * of these on the Progress page, each responds only to its own trigger. If
 * the lightbox ever fails to hydrate, the bar (server-rendered) is
 * untouched — it's wrapped in SafeBoundary. A structure with no images
 * degrades to a plain, non-clickable bar.
 */
export function StructureProgress({ label, percent, sublabel, images }: StructureProgressProps) {
  const rawId = useId();
  const rootId = `structure-lightbox-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  if (images.length === 0) {
    return <AnimatedProgressBar label={label} percent={percent} sublabel={sublabel} />;
  }

  const noun = `design image${images.length > 1 ? "s" : ""}`;
  return (
    <div id={rootId}>
      <AnimatedProgressBar
        label={label}
        percent={percent}
        sublabel={sublabel}
        lightboxIndex={0}
        triggerAriaLabel={`${label}: view ${images.length} ${noun}`}
        cue={`View ${images.length} ${noun}`}
      />
      <SafeBoundary label="structure lightbox">
        <GalleryLightbox images={images} rootId={rootId} />
      </SafeBoundary>
    </div>
  );
}
