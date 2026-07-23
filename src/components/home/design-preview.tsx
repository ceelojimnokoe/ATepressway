import { laneConfiguration } from "@/content/project";
import { mediaRegistry } from "@/content/media";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { ImageReveal } from "@/components/motion/image-reveal";
import { CtaLink } from "@/components/ui/cta-link";

const totalLanes = laneConfiguration.freeway.lanes + laneConfiguration.urban.lanes;

/**
 * Design summary on Home: the road configuration in the client's own
 * wording (lane counts and surface descriptions come from
 * laneConfiguration, never hardcoded), three design visuals, and a route
 * through to the full Design page. Renders are labelled as proposed
 * designs — never presented as as-built photographs.
 */
const slots = [
  {
    key: "designScheme",
    caption: "Typical road cross-section",
    kind: "Drawing",
  },
  {
    key: "tettehQuarshieRender",
    caption: "Tetteh Quarshie Interchange — proposed design",
    kind: "Design",
  },
  {
    key: "tollPlazaRender",
    caption: "Toll plaza — proposed design",
    kind: "Design",
  },
] as const;

export function DesignPreview() {
  return (
    <section className="border-b border-rule bg-raised">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-lime tracking-[0.2em] uppercase">05 — Design</span>
            <TextReveal
              as="h2"
              text="A ten-lane corridor, built in two surfaces"
              className="max-w-3xl text-heading-3 text-ink-1 sm:text-heading-2"
            />
            <Reveal direction="up" distance={16} delay={0.1}>
              <p className="max-w-2xl text-lead text-ink-2">
                The rebuilt corridor carries {totalLanes} lanes in total:{" "}
                {laneConfiguration.freeway.lanes} lanes of {laneConfiguration.freeway.surface} alongside{" "}
                {laneConfiguration.urban.lanes} lanes of {laneConfiguration.urban.surface}. The
                cross-section, interchanges and toll plazas are set out in full on the design page.
              </p>
            </Reveal>
          </div>
          <Reveal direction="up" distance={12} className="shrink-0">
            <CtaLink href="/design" variant="secondary">
              Explore the design
            </CtaLink>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {slots.map((slot, i) => {
            const asset = mediaRegistry[slot.key];
            return (
              <figure key={slot.key} className="flex flex-col gap-3">
                <ImageReveal
                  src={asset.src}
                  alt={asset.alt}
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="aspect-[4/3] w-full border border-rule"
                  delay={i * 0.08}
                />
                <figcaption className="flex items-baseline justify-between gap-3">
                  <span className="text-small text-ink-2">{slot.caption}</span>
                  <span className="text-caption text-ink-3 tracking-wide uppercase">{slot.kind}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
