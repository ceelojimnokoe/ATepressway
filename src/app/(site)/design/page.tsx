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
  /** Short display date the percent is as of, e.g. "August 2026" — per structure, not one shared label. */
  readonly asOf?: string;
}

// Toll plazas hidden from display (client instruction, 4 Sept 2026) — the
// design/render section only, not the scope-fact toll plaza COUNT used
// elsewhere (e.g. the FAQ's "{tollPlazaCount} toll plazas" sentence, left
// untouched). structureSections in content/design.ts keeps the toll-plazas
// entry fully intact; it's filtered out here at the render level only, so
// restoring it later is a one-line change.
const visibleStructureSections = structureSections.filter((section) => section.id !== "toll-plazas");

const entries: readonly Entry[] = [
  { section: corridorOverview },
  ...interchangeSections.map((section): Entry => {
    const interchange = interchanges.find((i) => i.id === section.interchangeId);
    const pkg = workPackages.find((w) => w.id === section.interchangeId);
    return {
      section,
      chainage: interchange?.chainageLabel,
      percent: pkg?.percentComplete ?? null,
      asOf: pkg?.asOf,
    };
  }),
  ...visibleStructureSections.map((section): Entry => ({ section })),
];

export default function DesignPage() {
  return (
    <>
      <PageHero
        media="progBridgeKm16556B"
        scrimIntensity="strong"
        title="Design & Infrastructure"
        subtitle={
          <>
            How the corridor is engineered — the cross-section, the interchanges, and the structures
            that carry and drain it. {DESIGN_DISCLAIMER}
          </>
        }
      />

      <div className="border-b border-hairline bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-8">
          {entries.map((entry, index) => (
            <ViewportReveal key={entry.section.id}>
              <DesignSectionCard
                section={entry.section}
                reverse={index % 2 === 1}
                chainage={entry.chainage}
                percent={entry.percent}
                asOf={entry.asOf}
              />
            </ViewportReveal>
          ))}
        </div>
      </div>
    </>
  );
}
