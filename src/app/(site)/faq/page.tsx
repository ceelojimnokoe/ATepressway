import type { Metadata } from "next";
import { FaqSection } from "@/components/contact/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.faq);

/**
 * Dedicated FAQ route. It reuses the same accordion component that used to
 * sit on /contact (no content change — the answers still assemble from
 * src/content/project.ts) inside the standard page shell, so it matches
 * every other page's hero, spacing and typography.
 */
export default function FaqPage() {
  return (
    <>
      {/* Hero image → progress-image11.png (client instruction, 20 Sept 2026;
          it was `retainingWall` before). Subtitle's tail — "drawn from the
          project record. Where something has not been published, the answer
          says so." — removed with the identical claim in FaqSection, per the
          same instruction to remove that wording entirely. */}
      <PageHero
        media="progressImage11"
        title="FAQ"
        subtitle="Answers about the corridor, the works, funding, tolling and who is responsible."
      />

      <FaqSection />
    </>
  );
}
