import type { Metadata } from "next";
import { galleryFolders, folderGroupLabel, type GalleryFolderGroup } from "@/content/folders";
import { FolderCard } from "@/components/gallery/folder-card";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.gallery);

const GROUP_ORDER: readonly GalleryFolderGroup[] = ["visits-events", "construction-design", "archives"];

/**
 * The Gallery index — folder cards, grouped, replacing the old flat
 * category-filtered + paginated grid (client instruction, 24 Oct 2026).
 * Fully static: folders are resolved at build time from content/folders.ts,
 * which itself reads content/events.ts and content/gallery.ts — there is no
 * per-request data here, so this prerenders like every other page. Only the
 * folder covers (one `next/image` per folder) load on this page; a folder's
 * other images live on its own /gallery/[slug] route and never ship here.
 *
 * The old flat gallery's `?page=N` / `?category=…` URLs are redirected to
 * plain `/gallery` in middleware.ts (src/), not here — handling it there
 * keeps this page free of `searchParams`, which is what keeps it static
 * (a Server Component that reads `searchParams` opts out of prerendering).
 */
export default function GalleryPage() {
  return (
    <>
      {/* Hero → atel11.jpg (client instruction, 24 Oct 2026; was
          progRetainingKm12120B). Same media key the Interchanges folder's
          grid also uses — one registration, not a duplicate. Bottom-left
          luminance measured at ~116 (canvas sample, same method as every
          other hero) — "medium" tier. */}
      <PageHero
        media="octoberBatch11"
        scrimIntensity="medium"
        title="Gallery"
        subtitle="Construction photography and proposed designs from along the Accra–Tema motorway corridor, by folder."
      />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-16 sm:px-8">
        {GROUP_ORDER.map((group) => {
          const folders = galleryFolders.filter((folder) => folder.group === group);
          if (folders.length === 0) return null;
          return (
            <ViewportReveal key={group} className="flex flex-col gap-6">
              <h2 className="text-heading-4 text-fg">{folderGroupLabel[group]}</h2>
              <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {folders.map((folder) => (
                  <li key={folder.slug}>
                    <FolderCard folder={folder} />
                  </li>
                ))}
              </ul>
            </ViewportReveal>
          );
        })}
      </section>
    </>
  );
}
