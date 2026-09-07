import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { mediaRegistry } from "@/content/media";
import { organization } from "@/content/project";
import {
  aboutIntro,
  // visionMission intentionally not imported — its section is hidden below,
  // pending final client content. Data stays put in content/about.ts.
  approach,
  whyAtmp,
  internalStrengths,
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
        // "toll road" added 4 Sept 2026 (client instruction) — completes the
        // broader "Ghana's first road public–private partnership" replace
        // begun 3 Sept 2026.
        subtitle="A.T. Expressway Ltd. (ATEL) is the concessionaire delivering the Accra–Tema Motorway & Extensions PPP Project — Ghana’s first toll road public–private partnership."
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

      {/* Vision · Mission · Commitment — intentionally hidden (client
          instruction, 2 Sept 2026): this content hasn't been finalized and
          will likely be replaced later. The data stays in
          src/content/about.ts (`visionMission`) untouched; only the render
          is removed. Restore this section (and the `visionMission` import
          above) once the client supplies final copy. */}

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

      {/* Why ATMP — merged 7 Sept 2026 (client instruction) from the former
          separate "Why ATEL" and "Investment highlights" sections into one
          flat 10-item grid under one renamed heading; see whyAtmp in
          content/about.ts for the merge order. This is now the page's last
          section — "Beyond the Accra–Tema corridor" (and its two closing
          CTAs) was removed outright in the same instruction, not hidden. */}
      <section className="bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Why ATMP (Accra Tema-Motorway &amp; Extensions Project)</h2>
          {/* Independently bordered cards + a real gap (matching the Progress
              page's activity-highlights grid), not the earlier shared
              container-background "mortar line" technique — that technique
              only looks right when every row is full, and 10 items over 3
              columns leaves the last row's unused tracks exposed, which
              rendered as a grey block (client instruction, 7 Sept 2026, to
              remove it). A per-card border never leaks a background into a
              cell that has no card. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyAtmp.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 border border-hairline bg-surface-raised p-6">
                <h3 className="text-body text-fg">{item.title}</h3>
                <p className="text-small text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </section>
    </>
  );
}
