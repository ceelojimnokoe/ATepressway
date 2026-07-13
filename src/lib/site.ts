/**
 * Canonical site origin, used for metadataBase, canonical URLs, the
 * sitemap, and JSON-LD. The real production domain hasn't been
 * confirmed by the client yet — same category of unresolved fact as
 * contact email or hotline, just not one that fits the Placeholder<T>
 * pattern (this has to be a plain string at module-eval time for
 * Next's metadataBase, sitemap, and robots files, all of which run
 * outside any component tree). Set NEXT_PUBLIC_SITE_URL once the real
 * domain is confirmed; every consumer reads through here, not a
 * hardcoded string, so that's a one-line change when it lands.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
