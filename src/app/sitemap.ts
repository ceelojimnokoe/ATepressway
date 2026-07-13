import type { MetadataRoute } from "next";
import { routes } from "@/content/seo";
import { SITE_URL } from "@/lib/site";

/**
 * /styleguide is deliberately absent — it's noindex, not a public route.
 * No lastModified: we don't track real per-page update timestamps
 * anywhere, and a uniform build-time date would falsely imply every page
 * changes together when only /progress actually updates weekly.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes).map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    changeFrequency: route.path === "/progress" ? "weekly" : "monthly",
    priority: route.path === "/" ? 1 : 0.7,
  }));
}
