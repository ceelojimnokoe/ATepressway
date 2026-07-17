import { buildSpec } from "@/content/design";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { DesignRenderSlot } from "./design-render-slot";

// Summed from the breakdown so the headline can't drift from the parts.
const totalLanes = buildSpec.carriageways.reduce((sum, cw) => sum + cw.count * cw.lanes, 0);

function carriagewayLine(count: number, access: string, lanes: number, type: string): string {
  return `${count} × ${access} ${lanes}-lane ${count > 1 ? `${type}s` : type}`;
}

/** Lead of /design: the 10-lane cross-section, with a typical-section render slot. */
export function BuildSummary() {
  return (
    <section className="border-b border-rule">
      <ViewportReveal className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-heading-4 text-ink-1">{buildSpec.heading}</h2>

          <div className="flex items-baseline gap-2">
            <Figure value={totalLanes} className="text-heading-1" />
            <span className="text-small text-ink-2">lane configuration</span>
          </div>

          <ul className="flex flex-col gap-2 border-t border-rule pt-6">
            {buildSpec.carriageways.map((cw) => (
              <li key={cw.type} className="text-body text-ink-1">
                {carriagewayLine(cw.count, cw.access, cw.lanes, cw.type)}
              </li>
            ))}
          </ul>

          <p className="border-t border-rule pt-6 text-small text-ink-2">{buildSpec.pavementNote}</p>
        </div>

        <DesignRenderSlot render={buildSpec.render} />
      </ViewportReveal>
    </section>
  );
}
