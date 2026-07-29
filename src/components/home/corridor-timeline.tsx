"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { projectFacts, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { formatLongDate } from "@/lib/format";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { ImageSlideshow, type SlideshowImage } from "@/components/ui/image-slideshow";
import { mediaRegistry, type MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";

/**
 * Five real construction photographs spanning different stages/aspects of
 * the works — underpass, bridge deck, pier, overpass, corridor-wide — not
 * five near-identical frames. Drawn straight from the media registry, so
 * alt text and dimensions come with them.
 */
const journeySlides: readonly SlideshowImage[] = (
  [
    "atelJunctionUnderpass",
    "atelBridgeDeckRebar",
    "atelPierConcreting",
    "atelOverpassDeck",
    "atelCorridorPiersWide",
  ] as const satisfies readonly MediaKey[]
).map((key) => {
  const asset = mediaRegistry[key];
  return { src: asset.src, alt: asset.alt, width: asset.width, height: asset.height };
});

type MilestoneState = "done" | "current" | "upcoming";

const overallPct = isPlaceholder(progress.overallPercentComplete) ? 46 : progress.overallPercentComplete;
const asOf = isPlaceholder(progress.asOf) ? "May 2026" : progress.asOf;

const milestones: readonly {
  readonly date: string;
  readonly title: string;
  readonly detail: string;
  readonly state: MilestoneState;
}[] = [
  {
    date: formatLongDate(projectFacts.contractAwardDate),
    title: "Contract awarded",
    detail: "The reconstruction contract is awarded to begin the delivery programme.",
    state: "done",
  },
  {
    date: formatLongDate(projectFacts.commencementDate),
    title: "Construction commenced",
    detail: `The ${projectFacts.constructionWindowMonths}-month construction window begins on Section 1.`,
    state: "done",
  },
  {
    date: asOf,
    title: `${overallPct}% complete`,
    detail: "Latest reported physical progress across the Section 1 corridor.",
    state: "current",
  },
  {
    date: formatLongDate(projectFacts.scheduledCompletionDate),
    title: "Scheduled completion",
    detail: "Target completion of the Section 1 reconstruction works.",
    state: "upcoming",
  },
];

/**
 * The corridor journey as a vertical timeline. A lime line fills down the
 * rail in step with scroll (scroll-linked, library-managed); the current
 * milestone is emphasised. Naturally vertical, so it reads the same on
 * mobile. Under reduced motion the line is shown filled and static, and
 * the nodes simply appear.
 */
export function CorridorTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 55%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="border-b border-hairline bg-surface-raised">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-14 flex flex-col gap-4">
          <span className="figure text-caption text-accent tracking-[0.2em] uppercase">02 — The journey</span>
          <TextReveal
            as="h2"
            text="From award to completion, on a fixed programme"
            className="max-w-3xl text-heading-3 text-fg sm:text-heading-2"
          />
        </div>

        {/*
         * Timeline and slideshow sit side by side from `lg`, with the
         * slideshow given the larger share (~57%). On mobile they stack with
         * the slideshow LAST: the milestones are the substance of the section
         * and should follow the heading directly, the imagery as context.
         */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12">
        <ol ref={ref} className="relative flex flex-col gap-12">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-2 w-px bg-hairline" />
          <motion.span
            aria-hidden="true"
            style={reduced ? { scaleY: 1 } : { scaleY }}
            className="absolute top-2 bottom-2 left-2 w-px origin-top bg-lime"
          />

          {milestones.map((milestone) => (
            <li key={milestone.title} className="relative pl-12">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1 left-0 block h-4 w-4 rounded-full border-2",
                  milestone.state === "current" ? "border-accent bg-lime" : "border-hairline bg-surface",
                )}
              />
              <Reveal direction="up" distance={20} className="flex flex-col gap-1">
                <span className="figure text-caption text-fg-muted">
                  {milestone.date}
                  {milestone.state === "current" && (
                    <span className="text-accent"> · current</span>
                  )}
                </span>
                <h3 className="text-heading-4 text-fg">{milestone.title}</h3>
                <p className="max-w-xl text-small text-fg-muted">{milestone.detail}</p>
              </Reveal>
            </li>
          ))}
        </ol>

          <figure className="flex flex-col gap-3">
            <ImageSlideshow
              slides={journeySlides}
              ariaLabel="Construction stages along the corridor"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="aspect-[4/3] w-full border border-hairline"
            />
            <figcaption className="text-caption text-fg-faint">
              Construction under way across the Section 1 corridor.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
