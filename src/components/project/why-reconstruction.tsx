import { reconstructionRationale } from "@/content/project";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const distressList = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
  reconstructionRationale.distressTypes,
);

/**
 * The site's one --color-paper section (see CLAUDE.md "break the black")
 * — the only genuinely long-form-reading passage, not a stat block. Lime
 * is forbidden on paper, so the design-life figure uses --color-signal-ink
 * instead: it's the one number this section builds its whole argument on.
 */
export function WhyReconstruction() {
  return (
    <section className="border-b border-paper-rule bg-paper">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-paper-ink-1">Why reconstruction</h2>
        <p className="text-lead text-paper-ink-1">
          The pavement was designed for a{" "}
          <Figure value={reconstructionRationale.designLifeYears} className="text-lead text-signal-ink" />
          -year life. It now shows {distressList}.
        </p>
      </ViewportReveal>
    </section>
  );
}
