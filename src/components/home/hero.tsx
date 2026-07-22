import { mediaRegistry } from "@/content/media";
import { projectFacts, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { HeroSlider, type Slide } from "./hero-slider";
import { ScrollCue } from "./scroll-cue";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { CtaLink } from "@/components/ui/cta-link";

// Approved slide order for the hero backdrop.
const slides: readonly Slide[] = (
  ["teshieLinkRemodel", "flowerPotRemodel", "ogHeroBg", "routeAlignmentMap"] as const
).map((key) => {
  const asset = mediaRegistry[key];
  return { src: asset.src, alt: asset.alt, width: asset.width, height: asset.height };
});

const overallPct = isPlaceholder(progress.overallPercentComplete) ? 46 : progress.overallPercentComplete;

const heroMetadata = [
  { value: `${projectFacts.corridorLengthKm} km`, label: "Design corridor" },
  { value: `${projectFacts.section1LengthKm} km`, label: "Section 1 under construction" },
  { value: `${overallPct}%`, label: "Physical progress" },
] as const;

/**
 * Cinematic hero. The approved 4-image slider is the backdrop; the content
 * enters in sequence on load (eyebrow → headline reveal → intro → calls to
 * action → project metadata) and a discreet scroll cue loops at the base.
 * The h1 is the page's single top-level heading. Everything above the fold
 * is server-rendered text, so it reads before any animation runs.
 */
export function Hero() {
  return (
    <HeroSlider slides={slides} className="border-b border-rule">
      <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-5xl flex-col justify-end gap-6 px-4 pt-32 pb-28 sm:px-8">
        <Reveal direction="up" distance={12} delay={0.05}>
          <span className="text-caption text-lime tracking-[0.2em] uppercase">
            Accra–Tema Motorway and Extensions Project
          </span>
        </Reveal>

        <TextReveal
          as="h1"
          text="Accra–Tema Expressway Ltd."
          delay={0.15}
          className="max-w-4xl text-heading-2 text-ink-1 sm:text-heading-1"
        />

        <Reveal direction="up" distance={16} delay={0.5} className="max-w-2xl">
          <p className="text-lead text-ink-1">
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
          <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-rule pt-6">
            {heroMetadata.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="figure text-heading-4 text-ink-1">{item.value}</dt>
                <dd className="text-caption text-ink-2 tracking-wide uppercase">{item.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto hidden w-full max-w-5xl justify-end px-4 pb-6 sm:flex sm:px-8">
        <ScrollCue />
      </div>
    </HeroSlider>
  );
}
