import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * /styleguide is intentionally not Disallow'd here even though it's
 * noindex (see its own metadata export) — combining the two is a known
 * footgun: Disallow stops crawlers from ever fetching the page, which
 * means they never see the noindex directive either. noindex alone is
 * the correct, sufficient signal for "don't index this," and it's
 * already in place.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
