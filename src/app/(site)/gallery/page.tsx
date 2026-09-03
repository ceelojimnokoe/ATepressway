import type { Metadata } from "next";
import { galleryItems, resolveGalleryItems } from "@/content/gallery";
import { GalleryFilter } from "@/components/gallery/gallery-filter";
import { GalleryCard } from "@/components/gallery/gallery-tile";
import { GalleryLightbox, type LightboxImage } from "@/components/gallery/gallery-lightbox";
import { SafeBoundary } from "@/components/gallery/safe-boundary";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.gallery);

/**
 * The gallery is FULLY STATIC. It has no per-request data — every image is
 * known at build time — so it prerenders at build exactly like every other
 * page (no `searchParams`, no dynamic render). Category filtering is a
 * client-side progressive enhancement (see GalleryFilter): the grid below
 * is pure server HTML that renders every tile and never depends on client
 * code to be visible.
 */
export default function GalleryPage() {
  // Validate + resolve so a bad entry skips gracefully instead of crashing.
  // Toll plaza design hidden from display (client instruction, 4 Sept
  // 2026) — galleryItems in content/gallery.ts keeps the "d-toll" entry
  // intact; filtered out here at the render level only.
  const resolved = resolveGalleryItems(galleryItems).filter(({ item }) => item.id !== "d-toll");

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
        media="progRetainingKm12120B"
        title="Gallery"
        subtitle="Construction photography and proposed designs from along the Accra–Tema motorway corridor by category."
      />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8">
        {/* Filter scope. Carries data-gallery-filter="all" by default, so with
            JS off — or if the filter fails to hydrate — every tile is shown.
            The client filter toggles this attribute and CSS hides the tiles
            that don't match; the grid itself never depends on client code. */}
        <div data-gallery-filter="all" className="flex flex-col gap-8">
          {/* Interactive leaf — isolated so a hydration failure here can't
              blank the grid below (a pure server-rendered sibling). */}
          <SafeBoundary label="filter">
            <GalleryFilter />
          </SafeBoundary>

          {/* Plain server-rendered list. Every tile carries its category for
              the CSS filter and a data-lightbox-index the standalone lightbox
              listens for. It does NOT depend on any client component. */}
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {resolved.map(({ item }, index) => (
              <li key={item.id} data-gallery-cat={item.category}>
                <GalleryCard item={item} lightboxIndex={index} />
              </li>
            ))}
          </ul>

          {/* Standalone, isolated. If it fails to hydrate the grid is
              untouched; it renders nothing until a tile is opened. */}
          <SafeBoundary label="lightbox">
            <GalleryLightbox images={lightboxImages} />
          </SafeBoundary>
        </div>
      </section>
    </>
  );
}
