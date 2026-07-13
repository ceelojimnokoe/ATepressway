import { reconstructionRationale } from "@/content/project";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const distressList = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
  reconstructionRationale.distressTypes,
);

export function WhyReconstruction() {
  return (
    <section className="border-b border-rule">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Why reconstruction</h2>
        <p className="text-lead text-ink-1">
          The pavement was designed for a{" "}
          <Figure value={reconstructionRationale.designLifeYears} className="text-lead" />
          -year life. It now shows {distressList}.
        </p>
      </ViewportReveal>
    </section>
  );
}
