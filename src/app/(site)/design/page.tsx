import type { Metadata } from "next";
import { BuildSummary } from "@/components/design/build-summary";
import { InterchangeDesigns } from "@/components/design/interchange-designs";
import { CompactSections } from "@/components/design/compact-sections";
import { DESIGN_DISCLAIMER } from "@/content/design";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.design);

export default function DesignPage() {
  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-16 sm:px-8">
        <h1 className="text-heading-1 text-ink-1">Design &amp; Infrastructure</h1>
        <p className="max-w-2xl text-body text-ink-2">
          How the corridor is engineered — the cross-section, the interchanges, and the structures
          that carry and drain it. {DESIGN_DISCLAIMER}
        </p>
      </div>

      <div className="pt-16">
        <BuildSummary />
        <InterchangeDesigns />
        <CompactSections />
      </div>
    </>
  );
}
