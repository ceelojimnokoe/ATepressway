import { organization, statementOfIntent, progress, projectFacts } from "@/content/project";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { Figure } from "@/components/ui/figure";
import { Corridor } from "@/components/corridor/Corridor";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

export function Hero() {
  return (
    <section className="border-b border-rule">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-24">
        <p className="text-caption text-ink-3 tracking-wide uppercase">{organization.shortName}</p>

        {/*
          The one spend of --font-serif on the entire site — only in the
          real-value branch. The TBC branch below stays in the standard
          placeholder treatment, so the reservation isn't wasted on an
          empty promise while the real line is still unwritten.
        */}
        <PlaceholderNotice value={statementOfIntent}>
          {(value) => <p className="font-serif text-lead text-ink-1 sm:text-heading-3">{value}</p>}
        </PlaceholderNotice>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-caption text-ink-3 tracking-wide uppercase">Overall completion</span>
            <PlaceholderNotice value={progress.overallPercentComplete}>
              {(value) => <Figure value={`${value}%`} signal className="text-heading-2" />}
            </PlaceholderNotice>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-caption text-ink-3 tracking-wide uppercase">Schedule</span>
            <p className="text-body text-ink-1">
              Began {projectFacts.reconstructionStartYear} · {projectFacts.constructionWindowMonths}
              -month window
            </p>
          </div>
        </div>

        <Corridor variant="hero" />
      </ViewportReveal>
    </section>
  );
}
