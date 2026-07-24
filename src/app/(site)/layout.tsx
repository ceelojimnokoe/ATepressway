import { SiteHeader } from "@/components/layout/site-header";
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
 * Navigation is a conventional sticky top header (SiteHeader). Content
 * flows normally beneath it — no side inset.
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <MotionProvider>
      <JsonLd data={organizationJsonLd()} />
      <ScrollProgress />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <ScrollToTop />
    </MotionProvider>
  );
}
