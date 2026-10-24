import type { MetadataRoute } from "next";
import { routes, type RouteMeta } from "@/content/seo";
import { galleryFolders } from "@/content/folders";
import { SITE_URL } from "@/lib/site";

/**
 * /styleguide is deliberately absent — it's noindex, not a public route.
 * No lastModified: we don't track real per-page update timestamps
 * anywhere, and a uniform build-time date would falsely imply every page
 * changes together when only /progress actually updates weekly.
 *
 * Draft routes (provisional copy awaiting client sign-off — see
 * RouteMeta.draft) are left out too, and carry noindex on the page itself.
 *
 * Gallery folder pages (added 24 Oct 2026) are listed individually — each
 * has its own unique title/description (see generateMetadata in
 * gallery/[slug]/page.tsx) — read from the same `galleryFolders` list the
 * pages themselves and generateStaticParams use, so a folder can never be
 * live without being in the sitemap or vice versa.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = Object.values<RouteMeta>(routes)
    .filter((route) => !route.draft)
    .map((route) => ({
      url: new URL(route.path, SITE_URL).toString(),
      changeFrequency: (route.path === "/progress" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route.path === "/" ? 1 : 0.7,
    }));

  const folderEntries = galleryFolders.map((folder) => ({
    url: new URL(`/gallery/${folder.slug}`, SITE_URL).toString(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...folderEntries];
}
