import { interchanges, progress } from "@/content/project";
import { interchangeRenders } from "@/content/design";
import { isPlaceholder } from "@/content/placeholder";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { DesignRenderSlot } from "./design-render-slot";

const workPackages = isPlaceholder(progress.workPackages) ? [] : progress.workPackages;
const source = isPlaceholder(progress.signOffSource) ? null : progress.signOffSource;

function percentFor(id: string): number | null {
  return workPackages.find((pkg) => pkg.id === id)?.percentComplete ?? null;
}

/**
 * One section per interchange: the design render slot, plus its real
 * completion percentage as a quiet data point (ink-2, not the lime
 * signal — this page is about design, not live progress). Name and kind
 * come from project.ts, the render caption from design.ts, and the
 * percentage from the MPR progress data — joined on the shared id, so no
 * fact is duplicated.
 */
export function InterchangeDesigns() {
  return (
    <section className="border-b border-rule">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-4 text-ink-1">Interchanges</h2>
          {source && <span className="text-caption text-ink-3">Completion figures · {source}</span>}
        </div>

        <div className="flex flex-col gap-14">
          {interchanges.map((interchange) => {
            const render = interchangeRenders[interchange.id];
            const percent = percentFor(interchange.id);
            return (
              <div key={interchange.id} className="grid gap-6 md:grid-cols-2 md:gap-10">
                <div className="flex flex-col gap-3">
                  <span className="text-caption text-ink-3 tracking-wide uppercase">
                    {interchange.kind === "reconstruction" ? "Reconstruction" : "New interchange"}
                  </span>
                  <h3 className="text-heading-3 text-ink-1">{interchange.name}</h3>
                  {percent !== null && (
                    <div className="flex items-baseline gap-2">
                      <Figure value={`${percent}%`} className="text-heading-4 text-ink-2" />
                      <span className="text-small text-ink-3">complete</span>
                    </div>
                  )}
                </div>
                {render && <DesignRenderSlot render={render} />}
              </div>
            );
          })}
        </div>
      </ViewportReveal>
    </section>
  );
}
