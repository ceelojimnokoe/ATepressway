import { mediaRegistry } from "@/content/media";
import { organization, projectFacts, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { HeroSlider, type Slide } from "./hero-slider";
import { ScrollCue } from "./scroll-cue";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { CtaLink } from "@/components/ui/cta-link";
import { AnimatedFigure } from "@/components/ui/animated-figure";

// Approved slide order for the hero backdrop.
const slides: readonly Slide[] = (
  ["progAshaiman", "progUnderpassKm16105A", "flowerPotRemodel", "progTBeam"] as const
).map((key) => {
  const asset = mediaRegistry[key];
  return { src: asset.src, alt: asset.alt, width: asset.width, height: asset.height };
});

const overallPct = isPlaceholder(progress.overallPercentComplete) ? 46 : progress.overallPercentComplete;

/**
 * Physical progress leads — it's the figure the page exists to report, and
 * the only one carrying the lime signal treatment. The other two stay in
 * standard ink so the signal keeps its meaning.
 */
const heroMetadata = [
  { value: overallPct, decimals: 0, suffix: "%", unit: null, label: "Physical progress", signal: true },
  {
    value: projectFacts.corridorLengthKm,
    decimals: 1,
    suffix: "",
    unit: "km",
    label: "Design corridor",
    signal: false,
  },
  {
    value: projectFacts.section1LengthKm,
    decimals: 1,
    suffix: "",
    unit: "km",
    label: "Section 1 under construction",
    signal: false,
  },
] as const;

/**
 * The hero text block — eyebrow, headline, intro, calls to action and the
 * project metadata (including the count-up completion figure). Identical
 * across both hero variants; only its wrapper differs. Everything is
 * server-rendered text, so it reads before any animation runs.
 */
function HeroContent() {
  return (
    <>
      <Reveal direction="up" distance={12} delay={0.05}>
        <span className="text-caption text-accent tracking-[0.2em] uppercase">
          Accra–Tema Motorway and Extensions Project
        </span>
      </Reveal>

      <TextReveal
        as="h1"
        text={organization.name}
        delay={0.15}
        className="max-w-4xl text-heading-2 text-fg sm:text-heading-1"
      />

      <Reveal direction="up" distance={16} delay={0.5} className="max-w-2xl">
        <p className="text-lead text-fg">
          Your guide to the design, construction progress and key developments shaping the{" "}
          {projectFacts.corridorLengthKm} km corridor, including the {projectFacts.section1LengthKm}{" "}
          km Section 1 currently under construction.
        </p>
      </Reveal>

      <StaggerContainer className="flex flex-wrap gap-3" delay={0.72} stagger={0.1} amount={0.1}>
        <StaggerItem>
          <MagneticButton>
            <CtaLink href="/progress" variant="primary">
              Explore progress
            </CtaLink>
          </MagneticButton>
        </StaggerItem>
        <StaggerItem>
          <MagneticButton>
            <CtaLink href="/project" variant="secondary">
              View the project
            </CtaLink>
          </MagneticButton>
        </StaggerItem>
      </StaggerContainer>

      <Reveal direction="up" distance={16} delay={0.95}>
        <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-hairline pt-6">
          {heroMetadata.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <dt className="flex items-baseline gap-1.5">
                <AnimatedFigure
                  value={item.value}
                  decimals={item.decimals}
                  suffix={item.suffix}
                  signal={item.signal}
                  trigger="load"
                  className="text-heading-3"
                />
                {item.unit && <span className="text-small text-fg-muted">{item.unit}</span>}
              </dt>
              <dd className="text-caption text-fg-muted tracking-wide uppercase">{item.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </>
  );
}

/**
 * Cinematic hero over the approved 4-image slider. The old full-image dark
 * wash is gone: the photo shows at its natural brightness, and legibility
 * comes from the shared localised corner scrim (`.hero-scrim`) behind the
 * bottom-left text plus a soft text-shadow — the same treatment every hero
 * uses. The text column is capped at ~672px so most of the image stays
 * uncovered. Slider behaviour, priority/lazy slide loading, reduced-motion
 * and the completion-figure count-up are unchanged.
 */
export function Hero() {
  return (
    <HeroSlider slides={slides} overlay="scrim" className="border-b border-hairline">
      <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-5xl flex-col justify-end px-4 pt-24 pb-28 sm:px-8">
        <div className="hero-text-shadow flex w-full max-w-[42rem] flex-col gap-6">
          <HeroContent />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto hidden w-full max-w-5xl justify-end px-4 pb-6 sm:flex sm:px-8">
        <ScrollCue />
      </div>
    </HeroSlider>
  );
}
