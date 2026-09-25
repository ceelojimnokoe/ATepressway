/**
 * Canonical site origin, used for metadataBase, canonical URLs, the
 * sitemap, robots.txt, and JSON-LD (this has to be a plain string at
 * module-eval time for Next's metadataBase, sitemap, and robots files,
 * all of which run outside any component tree).
 *
 * The domain is now live and confirmed: https://www.atexpresswayltd.com
 * (verified 25 Sept 2026 — resolves, serves the site). That's the
 * fallback below, not "http://localhost:3000" as it was before — the
 * old fallback shipped to PRODUCTION (canonical, og:url, og:image,
 * twitter:image all served as localhost:3000 on the live site) because
 * NEXT_PUBLIC_SITE_URL was never actually set in Vercel's production
 * environment; docs/DEPLOY.md said to set it, but nothing enforced it,
 * so a missing env var silently downgraded every URL on the site to an
 * unreachable one instead of failing loudly. Defaulting to the real
 * domain instead means a missing env var now does the right thing
 * automatically. NEXT_PUBLIC_SITE_URL still overrides this — set it to
 * http://localhost:3000 in .env.local for local dev if you want exact
 * local URLs, and Vercel preview deployments can set it to their own
 * preview URL if that's ever needed.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.atexpresswayltd.com";
