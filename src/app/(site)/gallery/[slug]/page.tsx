import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { galleryFolders, getGalleryFolder, formatFolderDate } from "@/content/folders";
import { resolveGalleryCaption } from "@/content/gallery";
import { GalleryCard } from "@/components/gallery/gallery-tile";
import { FolderVideo } from "@/components/gallery/folder-video";
import { GalleryLightbox, type LightboxImage } from "@/components/gallery/gallery-lightbox";
import { FolderShowMore } from "@/components/gallery/folder-show-more";
import { SafeBoundary } from "@/components/gallery/safe-boundary";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { buildMetadata } from "@/lib/page-metadata";
import { BRAND } from "@/content/seo";

/** Past this many images, the rest load progressively behind "Show more" rather than all at once. */
const PAGE_SIZE = 30;

/** Every folder with at least one image — static params for all /gallery/[slug] routes at build time. */
export function generateStaticParams() {
  return galleryFolders.map((folder) => ({ slug: folder.slug }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const folder = getGalleryFolder(slug);
  if (!folder) return {};
  const count = folder.items.length;
  const date = formatFolderDate(folder);
  const photos = `${count} photo${count === 1 ? "" : "s"}${folder.video ? " and a video" : ""}`;
  return buildMetadata({
    path: `/gallery/${folder.slug}`,
    title: `${folder.title} — Gallery — ${BRAND}`,
    description: date
      ? `${folder.title} (${date}) — ${photos} from the Accra–Tema Motorway and Extensions Project.`
      : `${folder.title} — ${folder.description ?? "Archive material."} ${photos} from the Accra–Tema Motorway and Extensions Project.`,
  });
}

/**
 * One folder's images (client instruction, 24 Oct 2026, replacing the old
 * paginated flat Gallery). Static — every folder is known at build time via
 * generateStaticParams, so this prerenders exactly like every other page,
 * and only loads this ONE folder's images, never the rest of the gallery.
 *
 * `showHeading={false}` on event folders (see GalleryCard): every photo in
 * an event folder shares the same caption heading — the event's own title —
 * which the page's own <h1> already states, so repeating it on all 20 tiles
 * (the Minister inspection folder, for example) would be pure noise. A
 * construction/design folder's photos have distinct per-photo titles, so
 * those keep showing.
 */
export default async function GalleryFolderPage({
  params,
}: {
  readonly params: Promise<{ readonly slug: string }>;
}) {
  const { slug } = await params;
  const folder = getGalleryFolder(slug);
  if (!folder) notFound();

  const isEventFolder = folder.def.source.kind === "event";
  const visible = folder.items.slice(0, PAGE_SIZE);
  const overflow = folder.items.slice(PAGE_SIZE);
  const count = folder.items.length;

  // The lightbox gets every image in the folder, not just the first 30 —
  // arrow-key stepping covers the whole folder regardless of how much of
  // the grid has been expanded; only the grid's own mounted <Image>s (and
  // therefore what's actually downloaded) are gated by PAGE_SIZE/"Show more".
  const lightboxImages: LightboxImage[] = folder.items.map(({ item, asset }) => ({
    src: asset.src,
    alt: asset.alt,
    width: asset.width,
    height: asset.height,
    caption: resolveGalleryCaption(item).full,
  }));

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/gallery"
          className="w-fit text-small text-fg-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          ← All folders
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-3 text-fg sm:text-heading-2">{folder.title}</h1>
          {folder.description && <p className="text-small text-fg-muted">{folder.description}</p>}
          <p className="figure text-small text-fg-muted">
            {[formatFolderDate(folder), `${count} photo${count === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {folder.video && (
        <div className="flex flex-col gap-3">
          <FolderVideo video={folder.video} label={folder.video.alt} />
          <p className="text-caption text-fg-faint tracking-wide uppercase">Video · plays only when you press play</p>
        </div>
      )}

      <ViewportReveal>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ item }, index) => (
            <li key={item.id}>
              <GalleryCard item={item} lightboxIndex={index} showHeading={!isEventFolder} isLcp={index === 0} />
            </li>
          ))}
          <FolderShowMore items={overflow} startIndex={visible.length} showHeading={!isEventFolder} />
        </ul>
      </ViewportReveal>

      <SafeBoundary label="lightbox">
        <GalleryLightbox images={lightboxImages} />
      </SafeBoundary>
    </section>
  );
}
