import type { Metadata } from "next";
import {
  galleryItems,
  galleryCategories,
  resolveGalleryItems,
  type GalleryCategoryId,
} from "@/content/gallery";
import { GalleryFilter } from "@/components/gallery/gallery-filter";
import { GalleryCard } from "@/components/gallery/gallery-tile";
import { GalleryLightbox, type LightboxImage } from "@/components/gallery/gallery-lightbox";
import { PageHero } from "@/components/ui/page-hero";
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
  const filtered = active === "all" ? galleryItems : galleryItems.filter((item) => item.category === active);

  // Validate + resolve so a bad entry skips gracefully instead of crashing.
  const resolved = resolveGalleryItems(filtered);

  const lightboxImages: LightboxImage[] = resolved.map(({ item, asset }) => ({
    src: asset.src,
    alt: asset.alt,
    width: asset.width,
    height: asset.height,
    caption: item.title,
  }));

  return (
    <>
      <PageHero
        media="atelJunctionUnderpass"
        title="Gallery"
        subtitle="Construction photography and proposed designs from along the Accra–Tema corridor, by category."
      />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8">
        <GalleryFilter active={active} />

        {resolved.length === 0 ? (
          <div className="flex flex-col items-start gap-4 border border-dashed border-hairline bg-surface-raised px-6 py-16 sm:items-center sm:text-center">
            <p className="text-body text-fg">No images in this category yet.</p>
            <PageTransitionLink href="/gallery" className="text-small text-fg underline underline-offset-4">
              View all images →
            </PageTransitionLink>
          </div>
        ) : (
          <GalleryLightbox images={lightboxImages}>
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {resolved.map(({ item }, index) => (
                <li key={item.id}>
                  <GalleryCard item={item} lightboxIndex={index} />
                </li>
              ))}
            </ul>
          </GalleryLightbox>
        )}
      </section>
    </>
  );
}
