"use client";

import { GalleryLightbox, type LightboxImage } from "@/components/gallery/gallery-lightbox";
import { AnimatedProgressBar } from "@/components/ui/animated-progress-bar";

interface StructureProgressProps {
  readonly label: string;
  readonly percent: number;
  readonly sublabel?: string;
  readonly images: readonly LightboxImage[];
}

/**
 * A progress bar whose label opens a lightbox of that structure's design
 * images. Reuses GalleryLightbox wholesale — same focus trap, Esc, arrow
 * paging and focus-return-to-trigger — rather than a second modal system.
 * When a structure has no images it degrades to a plain, non-clickable bar.
 */
export function StructureProgress({ label, percent, sublabel, images }: StructureProgressProps) {
  if (images.length === 0) {
    return <AnimatedProgressBar label={label} percent={percent} sublabel={sublabel} />;
  }

  const noun = `design image${images.length > 1 ? "s" : ""}`;
  return (
    <GalleryLightbox images={images}>
      <AnimatedProgressBar
        label={label}
        percent={percent}
        sublabel={sublabel}
        lightboxIndex={0}
        triggerAriaLabel={`${label}: view ${images.length} ${noun}`}
        cue={`View ${images.length} ${noun}`}
      />
    </GalleryLightbox>
  );
}
