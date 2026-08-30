import type { Metadata } from "next";
import {
  organization,
  stakeholders,
  projectFacts,
  sections,
  interchanges,
  statementOfIntent,
} from "@/content/project";
import { Section } from "./_components/section";
import { ColorTokens } from "./_components/color-tokens";
import { LimeLegibilityDemo } from "./_components/lime-legibility";
import { TypeScale, type TypeScaleStep } from "./_components/type-scale";
import { FigureTicker } from "./_components/figure-ticker";
import { RevealDemo } from "./_components/motion/reveal-demo";
import { StaggerDemo } from "./_components/motion/stagger-demo";
import { BarFillDemo } from "./_components/motion/bar-fill-demo";
import {
  SpringPressDemo,
  SpringDragDemo,
  SpringToggleDemo,
} from "./_components/motion/spring-demos";
import { EasingCompareDemo } from "./_components/motion/easing-demo";
import { ViewportReveal } from "./_components/motion/viewport-reveal";
import { MotionProvider } from "./_components/motion/motion-provider";
import { PlaceholderStateDemo } from "./_components/placeholder-state";

export const metadata: Metadata = { robots: { index: false } };

const typeScaleSteps: readonly TypeScaleStep[] = [
  {
    token: "caption",
    className: "text-caption",
    sample: `${sections[0].label} · ${sections[0].from} → ${sections[0].to}`,
  },
  {
    token: "small",
    className: "text-small",
    sample: `${stakeholders.epcContractor.name} — ${stakeholders.epcContractor.role}`,
  },
  {
    token: "body",
    className: "text-body",
    sample: organization.description,
  },
  {
    token: "lead",
    className: "text-lead",
    sample: `${sections[1].name} (${sections[1].road}), ${sections[1].lengthKm}km`,
  },
  {
    token: "heading-4",
    className: "text-heading-4",
    sample: interchanges[2].name,
  },
  {
    token: "heading-3",
    className: "text-heading-3",
    sample: sections[2].name,
  },
  {
    token: "heading-2",
    className: "text-heading-2",
    sample: organization.name,
  },
  {
    token: "heading-1",
    className: "text-heading-1",
    sample: sections[0].name,
  },
  {
    token: "figure",
    className: "figure text-figure",
    sample: String(projectFacts.corridorLengthKm),
  },
];

export default function StyleguidePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col px-8 py-12">
      <header className="flex flex-col gap-1 pb-12">
        <span className="text-caption tracking-wide text-ink-3 uppercase">
          {organization.shortName} — internal
        </span>
        <h1 className="text-heading-2 text-ink-1">Styleguide</h1>
        <p className="text-small text-ink-2">
          Design system review. Not indexed, not linked from the public site.
        </p>
      </header>

      <MotionProvider>
        <Section
          title="Color tokens"
          description="Every token in src/styles/globals.css, measured live from the DOM. Ratio is against --color-void unless noted."
        >
          <div className="flex flex-col gap-10">
            <ColorTokens />
            <LimeLegibilityDemo />
          </div>
        </Section>

        <Section
          title="Type scale"
          description="Caption through figure. Content is real: section labels, stakeholder names, project facts — not lorem ipsum."
        >
          <TypeScale steps={typeScaleSteps} />
        </Section>

        <Section
          title=".figure treatment"
          description="0 → 46, mono + tabular-nums. Digits should hold their column as the value changes — watch for jitter."
        >
          <FigureTicker />
        </Section>

        <Section
          title="Motion — reveal"
          description="12px rise + fade, duration.base, ease.out."
        >
          <RevealDemo
            sampleText={`${stakeholders.employersRepAgent.name} — ${stakeholders.employersRepAgent.role}`}
          />
        </Section>

        <Section
          title="Motion — stagger"
          description="reveal as child variant, 40ms stagger."
        >
          <StaggerDemo
            items={interchanges.map((interchange) => interchange.name)}
          />
        </Section>

        <Section
          title="Motion — bar fill"
          description="scaleX, not width. transform-origin: left."
        >
          <BarFillDemo />
        </Section>

        <Section
          title="Motion — springs"
          description="drag, press, toggle — for elements the user directly manipulates."
        >
          <div className="flex flex-col gap-10">
            <SpringDragDemo />
            <SpringPressDemo />
            <SpringToggleDemo />
          </div>
        </Section>

        <Section
          title="Motion — easing"
          description="The three curves, raced side by side over duration.slow."
        >
          <EasingCompareDemo />
        </Section>

        <ViewportReveal>
          <Section
            title="Placeholder state"
            description="isPlaceholder() rendering, real value alongside for contrast. This section itself animates in via whileInView + the real viewport config — scroll to trigger."
          >
            <PlaceholderStateDemo
              realLabel="Real value"
              realValue={stakeholders.epcContractor.name}
              realPath="stakeholders.epcContractor.name"
              unresolvedValue={statementOfIntent}
              unresolvedPath="statementOfIntent"
            />
          </Section>
        </ViewportReveal>
      </MotionProvider>
    </main>
  );
}
