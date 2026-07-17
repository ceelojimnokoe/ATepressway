import Image from "next/image";
import { mediaRegistry, isRenderable } from "@/content/media";
import { galleryCategories, type GalleryItem } from "@/content/gallery";
import { isPlaceholder } from "@/content/placeholder";

const CATEGORY_LABEL = new Map(galleryCategories.map((category) => [category.id, category.label]));

// Three across on desktop, two on tablet, one on mobile — so the browser
// requests roughly the right resolution and never over-fetches.
const TILE_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Server component. Renders a real image (next/image, lazy, sized, aspect
 * reserved from the registry so it can't shift layout) wrapped in a
 * <button> that the client lightbox opens by delegation; or, when the
 * file isn't on disk yet, a deliberate "photograph pending" frame — never
 * a broken image.
 */
export function GalleryTile({
  item,
  lightboxIndex,
}: {
  readonly item: GalleryItem;
  readonly lightboxIndex?: number;
}) {
  const asset = mediaRegistry[item.media];
  const renderable = isRenderable(asset) && lightboxIndex !== undefined;
  const aspectRatio = `${asset.width} / ${asset.height}`;

  return (
    <figure className="flex flex-col gap-3">
      <div
        className="relative w-full overflow-hidden border border-rule bg-sunk"
        style={{ aspectRatio }}
      >
        {renderable ? (
          <button
            type="button"
            data-lightbox-index={lightboxIndex}
            aria-label={`View larger: ${item.caption}`}
            className="absolute inset-0 block cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime focus-visible:-outline-offset-2"
          >
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              sizes={TILE_SIZES}
              loading="lazy"
              className="object-cover"
            />
          </button>
        ) : (
          <div className="absolute inset-0 bg-raised">
            <div className="absolute inset-2.5 border border-dashed border-rule" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-caption text-ink-3 uppercase tracking-wide">Photograph pending</span>
            </div>
          </div>
        )}
      </div>

      <figcaption className="flex flex-col gap-1">
        <span className="text-small text-ink-1">{item.caption}</span>
        <span className="text-caption text-ink-3 tracking-wide uppercase">
          {CATEGORY_LABEL.get(item.category)}
          {item.categoryProvisional && " · provisional"}
        </span>
        {isPlaceholder(item.date) ? (
          <span className="text-caption text-ink-3">Date to be confirmed</span>
        ) : (
          <span className="figure text-caption text-ink-2">{item.date}</span>
        )}
      </figcaption>
    </figure>
  );
}
