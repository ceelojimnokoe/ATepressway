import { organization, stakeholders } from "@/content/project";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const ECOSYSTEM = [
  stakeholders.contractor,
  stakeholders.designSupervision,
  stakeholders.electricalRelocation,
  stakeholders.waterRelocation,
  stakeholders.financier,
] as const;

/**
 * ATEL sits above the five, not beside them — this is the page the
 * reference demo got wrong by putting all six in one flat grid, which
 * reads as "ATEL is one contractor among many." The fix here is mostly
 * typographic: ATEL is a full-width, large-type block on its own; the
 * five are a visibly smaller, denser list underneath, introduced by a
 * sentence that names the relationship in words too.
 *
 * The five-item grid uses border-per-item (border-t/border-l on the
 * container, border-r/border-b on each cell), not the gap-color grid
 * trick — five is odd, and that trick paints a solid filled block in
 * whatever cell has no child to cover it. Same bug fixed on Home.
 */
export function DeliveryEcosystem() {
  return (
    <section className="border-b border-rule">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Delivery ecosystem</h2>

        <div className="flex flex-col gap-3 border border-rule bg-raised px-6 py-8 sm:px-8 sm:py-10">
          <span className="text-caption text-ink-3 tracking-wide uppercase">
            {stakeholders.client.role}
          </span>
          <h3 className="text-heading-2 text-ink-1">{organization.name}</h3>
          <p className="max-w-2xl text-body text-ink-2">{organization.description}</p>
        </div>

        <p className="text-small text-ink-2">
          {organization.shortName} appoints and oversees the following to deliver the works:
        </p>

        <div className="grid grid-cols-1 border-t border-l border-rule sm:grid-cols-2">
          {ECOSYSTEM.map((entity) => (
            <div
              key={entity.name}
              className="flex flex-col gap-1 border-r border-b border-rule px-6 py-5"
            >
              <span className="text-body text-ink-1">{entity.name}</span>
              <span className="text-small text-ink-2">{entity.role}</span>
            </div>
          ))}
        </div>
      </ViewportReveal>
    </section>
  );
}
