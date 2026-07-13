import type { Metadata } from "next";
import { organization } from "@/content/project";
import type { RouteMeta } from "@/content/seo";

/**
 * The root-level app/opengraph-image.tsx does NOT auto-inject an og:image
 * meta tag into nested route segments — verified live: the image route
 * itself served a valid PNG, but zero <meta property="og:image"> showed
 * up on any page until it was referenced explicitly here. One shared
 * image, referenced by every page, rather than five duplicate files.
 */
const SHARED_OG_IMAGE = "/opengraph-image";

/** Builds a page's full metadata (title, description, canonical, OG, Twitter) from one RouteMeta entry. */
export function buildMetadata(route: RouteMeta): Metadata {
  return {
    title: route.title,
    description: route.description,
    alternates: { canonical: route.path },
    openGraph: {
      title: route.title,
      description: route.description,
      url: route.path,
      siteName: organization.shortName,
      type: "website",
      images: [SHARED_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [SHARED_OG_IMAGE],
    },
  };
}
