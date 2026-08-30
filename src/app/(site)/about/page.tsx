import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { CtaLink } from "@/components/ui/cta-link";
import { mediaRegistry } from "@/content/media";
import { organization } from "@/content/project";
import {
  aboutIntro,
  visionMission,
  approach,
  investmentHighlights,
  whyAtel,
  internalStrengths,
  beyondTheCorridor,
} from "@/content/about";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.about);

const logo = mediaRegistry.logoAtel;
const identityImage = mediaRegistry.progUnderpassKm16105A;

export default function AboutPage() {
  return (
    <>
      <PageHero
        media="atelJunctionRoundabout"
        scrimIntensity="light"
        title="About Us"
        subtitle="A.T. Expressway Ltd. (ATEL) is the concessionaire delivering the Accra–Tema Motorway & Extensions PPP Project — Ghana’s first road public–private partnership."
      />

      {/* Identity: the mark at scale, alongside who ATEL is. */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div className="flex items-center justify-center bg-paper p-8 sm:p-12">
            <Image
              src={logo.src}
              alt={`${organization.name} logo`}
              width={logo.width}
              height={logo.height}
              sizes="(min-width: 1024px) 30vw, 70vw"
              className="h-auto w-full max-w-[18rem] object-contain"
              priority
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">
              {aboutIntro.eyebrow}
            </span>
            <h2 className="text-heading-3 text-fg sm:text-heading-2">{aboutIntro.headline}</h2>
            {aboutIntro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body text-fg-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Vision · Mission · Commitment */}
      <section className="border-b border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-8">
          <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-3">
            {visionMission.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 bg-surface-raised p-6">
                <h2 className="text-heading-4 text-fg">{item.title}</h2>
                <p className="text-small text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Approach */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:items-start md:gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-heading-4 text-fg">{approach.title}</h2>
            <p className="text-body text-fg">{approach.lead}</p>
            {approach.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body text-fg-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-hairline bg-surface-sunk">
              <Image
                src={identityImage.src}
                alt={identityImage.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <ul className="flex flex-col gap-1">
              {internalStrengths.map((strength) => (
                <li key={strength} className="flex gap-2 text-small text-fg-muted">
                  <span aria-hidden="true" className="text-accent">
                    —
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </ViewportReveal>
      </section>

      {/* Why ATEL */}
      <section className="border-b border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Why ATEL</h2>
          <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {whyAtel.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 bg-surface-raised p-6">
                <h3 className="text-body text-fg">{item.title}</h3>
                <p className="text-small text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Investment highlights */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Investment highlights</h2>
          <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {investmentHighlights.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 bg-surface p-6">
                <h3 className="text-body text-fg">{item.title}</h3>
                <p className="text-small text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Beyond the corridor — confirmed intent, explicit TBC for the pipeline. */}
      <section className="border-b border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Beyond the Accra–Tema corridor</h2>
          <p className="max-w-3xl text-body text-fg-muted">{beyondTheCorridor.intent}</p>
          <div className="flex flex-col gap-2 border border-dashed border-hairline bg-surface px-5 py-4">
            <span className="text-caption text-fg-faint tracking-wide uppercase">
              Further projects
            </span>
            <PlaceholderNotice value={beyondTheCorridor.otherProjects}>
              {(value) => (
                <ul className="flex flex-col gap-1">
                  {value.map((entry) => (
                    <li key={entry} className="text-small text-fg">
                      {entry}
                    </li>
                  ))}
                </ul>
              )}
            </PlaceholderNotice>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <CtaLink href="/project" variant="primary">
              Explore the project
            </CtaLink>
            <CtaLink href="/stakeholders" variant="secondary">
              Meet the stakeholders
            </CtaLink>
          </div>
        </ViewportReveal>
      </section>
    </>
  );
}
