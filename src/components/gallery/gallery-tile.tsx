import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import { resolveGalleryCaption, type GalleryItem } from "@/content/gallery";

const TILE_SIZES = "(min-width: 1216px) 340px, (min-width: 1024px) 29vw, (min-width: 640px) 44vw, 91vw";

/**
 * Server-rendered gallery card. The image is lazy-loaded with a reserved
 * 16:10 box (no layout shift) — larger and closer to the 16:9 source
 * ratio than the old 3:2, so tiles show more of each frame with less
 * cropping. Wrapped in a <button> the client lightbox opens by delegation.
 */
export function GalleryCard({
  item,
  lightboxIndex,
  showHeading = true,
  isLcp = false,
}: {
  readonly item: GalleryItem;
  readonly lightboxIndex: number;
  /**
   * False inside an event folder page (src/app/(site)/gallery/[slug]/page.tsx),
   * where every tile's caption heading would otherwise repeat the exact
   * same event title the folder's own `<h1>` already states — the meta
   * line (category · date) still renders, since that's per-photo useful.
   */
  readonly showHeading?: boolean;
  /** True for the one tile that is the page's Largest Contentful Paint: fetched eagerly at high priority. Every other tile stays lazy. */
  readonly isLcp?: boolean;
}) {
  const asset = mediaRegistry[item.media];
  const caption = resolveGalleryCaption(item);
  // A portrait photo cropped to 16:10 would show only its middle band, so
  // it gets a 3:4 box instead (still reserved up front — no layout shift).
  const portrait = asset.height > asset.width;
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
        <div className={`relative w-full overflow-hidden ${portrait ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            sizes={TILE_SIZES}
            loading={isLcp ? "eager" : "lazy"}
            fetchPriority={isLcp ? "high" : undefined}
            decoding="async"
            className="object-cover"
          />
        </div>
      </button>
      <figcaption className="flex flex-col gap-1">
        {showHeading && <span className="text-small text-fg">{caption.heading}</span>}
        <span className="text-caption text-fg-faint tracking-wide uppercase">{caption.meta}</span>
      </figcaption>
    </figure>
  );
}
