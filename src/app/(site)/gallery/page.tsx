import type { Metadata } from "next";
import { galleryItems, galleryCategories, type GalleryCategoryId } from "@/content/gallery";
import { mediaRegistry, isRenderable } from "@/content/media";
import { GalleryFilter } from "@/components/gallery/gallery-filter";
import { GalleryTile } from "@/components/gallery/gallery-tile";
import { GalleryLightbox, type LightboxImage } from "@/components/gallery/gallery-lightbox";
import { PageTransitionLink } from "@/components/layout/page-transition-link";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.gallery);

const VALID_CATEGORIES = new Set<string>(galleryCategories.map((category) => category.id));

function normalizeCategory(raw: string | string[] | undefined): GalleryCategoryId | "all" {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && VALID_CATEGORIES.has(value) ? (value as GalleryCategoryId) : "all";
}

export default async function GalleryPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ readonly [key: string]: string | string[] | undefined }>;
}) {
  const active = normalizeCategory((await searchParams).category);
  const items = active === "all" ? galleryItems : galleryItems.filter((item) => item.category === active);

  // Only renderable images are lightbox-navigable; build the ordered list
  // and a lookup so each tile knows its position within it.
  const lightboxImages: LightboxImage[] = [];
  const lightboxIndexById = new Map<string, number>();
  for (const item of items) {
    const asset = mediaRegistry[item.media];
    if (isRenderable(asset)) {
      lightboxIndexById.set(item.id, lightboxImages.length);
      lightboxImages.push({
        src: asset.src,
        alt: asset.alt,
        width: asset.width,
        height: asset.height,
        caption: item.caption,
      });
    }
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-16 sm:px-8">
        <h1 className="text-heading-1 text-ink-1">Gallery</h1>
        <p className="max-w-2xl text-body text-ink-2">
          Construction photography from along the corridor, by category.
        </p>
      </div>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <GalleryFilter active={active} />

        {items.length === 0 ? (
          <div className="flex flex-col items-start gap-4 border border-dashed border-rule bg-raised px-6 py-16 sm:items-center sm:text-center">
            <p className="text-body text-ink-1">No photographs in this category yet.</p>
            <p className="max-w-md text-small text-ink-2">
              Photography is added as each part of the works is documented. Check back, or view the
              full set.
            </p>
            <PageTransitionLink
              href="/gallery"
              className="text-small text-ink-1 underline underline-offset-4"
            >
              View all photographs →
            </PageTransitionLink>
          </div>
        ) : (
          <GalleryLightbox images={lightboxImages}>
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.id}>
                  <GalleryTile item={item} lightboxIndex={lightboxIndexById.get(item.id)} />
                </li>
              ))}
            </ul>
          </GalleryLightbox>
        )}
      </section>
    </>
  );
}
