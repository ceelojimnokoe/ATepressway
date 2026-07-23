import { SiteRail } from "@/components/layout/site-rail";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { organizationJsonLd } from "@/content/structured-data";

/**
 * Wraps public site routes only (this route group, "/", "/progress",
 * etc.) — not /styleguide, which is an internal tool and stays outside
 * it, inheriting just the root layout's fonts and globals. Organization
 * JSON-LD lives here rather than the root layout for the same reason:
 * it's a public-site identity claim, not something that belongs on the
 * internal tool.
 *
 * Navigation is the right-docked SiteRail — there is no header bar. All
 * page content is padded by --rail-collapsed so nothing renders beneath
 * the permanently-visible strip, at any breakpoint.
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <MotionProvider>
      <JsonLd data={organizationJsonLd()} />
      <ScrollProgress />
      <SiteRail />
      <div style={{ paddingRight: "var(--rail-collapsed)" }}>
        <main>{children}</main>
        <SiteFooter />
      </div>
      <ScrollToTop />
    </MotionProvider>
  );
}
