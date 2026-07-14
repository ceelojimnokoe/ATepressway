import { organization, statementOfIntent, progress, projectFacts } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { heroVideo } from "@/content/stock-media";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { Corridor } from "@/components/corridor/Corridor";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { HeroVideo } from "@/components/home/hero-video";

export function Hero() {
  return (
    <section className="relative border-b border-rule">
      <HeroVideo video={heroVideo} />

      <ViewportReveal className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-24">
        <p className="text-caption text-ink-2 tracking-wide uppercase">{organization.shortName}</p>

        <div className="flex flex-col gap-2">
          <span className="text-caption text-ink-2 tracking-wide uppercase">Overall completion</span>
          <PlaceholderNotice value={progress.overallPercentComplete}>
            {(value) => <AnimatedFigure value={value} suffix="%" signal className="text-figure" />}
          </PlaceholderNotice>
          {!isPlaceholder(progress.asOf) && !isPlaceholder(progress.signOffSource) && (
            <span className="text-small text-ink-2">
              as of {progress.asOf} · reported by {progress.signOffSource}
            </span>
          )}
        </div>

        {/*
          The one spend of --font-serif on the entire site — only in the
          real-value branch. The TBC branch below stays in the standard
          placeholder treatment, so the reservation isn't wasted on an
          empty promise while the real line is still unwritten.
        */}
        <PlaceholderNotice value={statementOfIntent}>
          {(value) => <p className="font-serif text-lead text-ink-1 sm:text-heading-3">{value}</p>}
        </PlaceholderNotice>

        <p className="text-body text-ink-1">
          Began {projectFacts.reconstructionStartYear} · {projectFacts.constructionWindowMonths}-month
          window
        </p>

        <Corridor variant="hero" />
      </ViewportReveal>
    </section>
  );
}
