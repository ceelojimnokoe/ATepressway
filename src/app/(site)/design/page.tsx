import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { DesignSectionCard } from "@/components/design/design-section";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import {
  corridorOverview,
  interchangeSections,
  structureSections,
  DESIGN_DISCLAIMER,
  type DesignSection,
} from "@/content/design";
import { interchanges, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.design);

const workPackages = isPlaceholder(progress.workPackages) ? [] : progress.workPackages;

interface Entry {
  readonly section: DesignSection;
  readonly chainage?: string;
  readonly percent?: number | null;
}

const entries: readonly Entry[] = [
  { section: corridorOverview },
  ...interchangeSections.map((section): Entry => {
    const interchange = interchanges.find((i) => i.id === section.interchangeId);
    const pkg = workPackages.find((w) => w.id === section.interchangeId);
    return { section, chainage: interchange?.chainageLabel, percent: pkg?.percentComplete ?? null };
  }),
  ...structureSections.map((section): Entry => ({ section })),
];

export default function DesignPage() {
  return (
    <>
      <PageHero
        media="heroCorridorAerial"
        title="Design & Infrastructure"
        subtitle={
          <>
            How the corridor is engineered — the cross-section, the interchanges, and the structures
            that carry and drain it. {DESIGN_DISCLAIMER}
          </>
        }
      />

      <div className="border-b border-rule bg-void">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-16 sm:px-8">
          {entries.map((entry, index) => (
            <ViewportReveal key={entry.section.id}>
              <DesignSectionCard
                section={entry.section}
                reverse={index % 2 === 1}
                chainage={entry.chainage}
                percent={entry.percent}
              />
            </ViewportReveal>
          ))}
        </div>
      </div>
    </>
  );
}
