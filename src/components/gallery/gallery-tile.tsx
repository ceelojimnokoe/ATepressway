import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import { galleryCategories, type GalleryItem } from "@/content/gallery";

const CATEGORY_LABEL = new Map(galleryCategories.map((category) => [category.id, category.label]));

const TILE_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Server-rendered gallery card. The image is lazy-loaded with a reserved
 * 16:10 box (no layout shift) — larger and closer to the 16:9 source
 * ratio than the old 3:2, so tiles show more of each frame with less
 * cropping. Wrapped in a <button> the client lightbox opens by delegation.
 */
export function GalleryCard({
  item,
  lightboxIndex,
}: {
  readonly item: GalleryItem;
  readonly lightboxIndex: number;
}) {
  const asset = mediaRegistry[item.media];
  return (
    <figure className="flex flex-col gap-3">
      {/* The button is the block-level wrapper; the aspect box is the DIRECT
          parent of the fill image, so the image always has a real height
          (aspect-ratio) and a positioned parent — it can never collapse to
          zero height. */}
      <button
        type="button"
        data-lightbox-index={lightboxIndex}
        aria-label={`View larger: ${item.title}`}
        className="block w-full cursor-zoom-in overflow-hidden border border-hairline bg-surface-sunk focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image src={asset.src} alt={asset.alt} fill sizes={TILE_SIZES} loading="lazy" className="object-cover" />
        </div>
      </button>
      <figcaption className="flex flex-col gap-1">
        <span className="text-small text-fg">{item.title}</span>
        <span className="text-caption text-fg-faint tracking-wide uppercase">
          {CATEGORY_LABEL.get(item.category)} · {item.type}
        </span>
      </figcaption>
    </figure>
  );
}
