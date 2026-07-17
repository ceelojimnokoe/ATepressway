import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import { galleryCategories, type GalleryItem } from "@/content/gallery";

const CATEGORY_LABEL = new Map(galleryCategories.map((category) => [category.id, category.label]));

const TILE_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Server-rendered gallery card. The image is lazy-loaded with a reserved
 * 3:2 box (no layout shift) and wrapped in a <button> that the client
 * lightbox opens by delegation. Title, category and type sit beneath.
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
      <div className="relative aspect-[3/2] w-full overflow-hidden border border-rule bg-sunk">
        <button
          type="button"
          data-lightbox-index={lightboxIndex}
          aria-label={`View larger: ${item.title}`}
          className="absolute inset-0 block cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime"
        >
          <Image src={asset.src} alt={asset.alt} fill sizes={TILE_SIZES} loading="lazy" className="object-cover" />
        </button>
      </div>
      <figcaption className="flex flex-col gap-1">
        <span className="text-small text-ink-1">{item.title}</span>
        <span className="text-caption text-ink-3 tracking-wide uppercase">
          {CATEGORY_LABEL.get(item.category)} · {item.type}
        </span>
      </figcaption>
    </figure>
  );
}
