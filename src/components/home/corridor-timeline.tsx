"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { projectFacts, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { formatLongDate } from "@/lib/format";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { ImageSlideshow, type SlideshowImage } from "@/components/ui/image-slideshow";
import { cn } from "@/lib/cn";
import { galleryItems, resolveGalleryItems } from "@/content/gallery";

const JOURNEY_SLIDE_COUNT = 4;

/**
 * The latest real construction photographs, newest first — driven entirely by
 * `addedOn` on each gallery item via the SAME sort `resolveGalleryItems`
 * already uses for the Gallery page (src/content/gallery.ts), not a second
 * copy of the sort logic. Restricted to "Construction Photo" so a proposed
 * design render (a drawing, not built work) can never lead the "journey" — the
 * whole point of this section is showing progress on the ground. Adding a new,
 * later-dated construction photo to the registry makes it appear here with no
 * code change: this array is recomputed from the live gallery data, not
 * hand-picked.
 */
const journeySlides: readonly SlideshowImage[] = resolveGalleryItems(
  galleryItems.filter((item) => item.type === "Construction Photo"),
)
  .slice(0, JOURNEY_SLIDE_COUNT)
  .map(({ asset }) => ({ src: asset.src, alt: asset.alt, width: asset.width, height: asset.height }));

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
    // Verbatim replacement (client instruction, 3 Sept 2026).
    detail: "The 30-year concession agreement was awarded to begin the delivery of the project",
    state: "done",
  },
  {
    date: formatLongDate(projectFacts.commencementDate),
    // "EPC Commences" (client instruction, 3 Sept 2026) — was "Construction
    // commenced"; same change applied to the Progress page's own milestone
    // timeline (src/components/progress/milestone-timeline.tsx) for
    // consistency, since both describe the same event.
    title: "EPC Commences",
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
      <div className="py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="mb-10 flex flex-col gap-4">
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">03 — The journey</span>
            <TextReveal
              as="h2"
              // "project" (not "programme") — client instruction, 4 Sept 2026.
              text="From award to completion, on a fixed project"
              className="max-w-3xl text-heading-3 text-fg sm:text-heading-2"
            />
          </div>
        </div>

        {/*
         * The slideshow leads, near the full viewport width and tall — 16:9
         * (the source ratio, so no crop) from `sm`, capped to 4:3 on mobile
         * so it stays large without pushing the programme off-screen. The
         * milestones follow directly beneath it, left-aligned: the imagery is
         * the headline, the fixed programme the substance below it. The lime
         * rail still fills with scroll and is shown static under reduced motion.
         */}
        <figure className="mx-auto flex w-full max-w-[96rem] flex-col gap-3 px-4 sm:px-6">
          <ImageSlideshow
            slides={journeySlides}
            ariaLabel="Construction stages along the corridor"
            sizes="(min-width: 1024px) 92vw, 100vw"
            className="aspect-[4/3] w-full border border-hairline sm:aspect-[16/9]"
          />
          <figcaption className="text-caption text-fg-faint">
            Construction under way across the Section 1 corridor.
          </figcaption>
        </figure>

        <div className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-8">
          <ol ref={ref} className="relative flex max-w-2xl flex-col gap-12">
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
        </div>
      </div>
    </section>
  );
}
