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
      <PageHero
        media="atelCarriagewaySection"
        title="FAQ"
        subtitle="Answers about the corridor, the works, funding, tolling and who is responsible — drawn from the project record. Where something has not been published, the answer says so."
      />

      <FaqSection />
    </>
  );
}
