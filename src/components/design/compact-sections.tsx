import { compactDesignSections } from "@/content/design";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { DesignRenderSlot } from "./design-render-slot";

/** Footbridges, toll plazas, drainage — compact, three across on desktop. */
export function CompactSections() {
  return (
    <section className="border-b border-rule">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Structures &amp; drainage</h2>

        <div className="grid gap-10 sm:grid-cols-3">
          {compactDesignSections.map((sectionItem) => (
            <div key={sectionItem.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-body text-ink-1">{sectionItem.title}</h3>
                {sectionItem.stat && (
                  <div className="flex items-baseline gap-2">
                    <Figure value={sectionItem.stat.value} className="text-heading-4" />
                    <span className="text-caption text-ink-3">{sectionItem.stat.label}</span>
                  </div>
                )}
                <p className="text-small text-ink-2">{sectionItem.description}</p>
              </div>
              <DesignRenderSlot render={sectionItem.render} compact />
            </div>
          ))}
        </div>
      </ViewportReveal>
    </section>
  );
}
