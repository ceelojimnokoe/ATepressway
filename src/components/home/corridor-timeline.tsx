"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { projectFacts, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { formatLongDate } from "@/lib/format";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { cn } from "@/lib/cn";

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
    <section className="border-b border-rule bg-raised">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-14 flex flex-col gap-4">
          <span className="figure text-caption text-lime tracking-[0.2em] uppercase">02 — The journey</span>
          <TextReveal
            as="h2"
            text="From award to completion, on a fixed programme"
            className="max-w-3xl text-heading-3 text-ink-1 sm:text-heading-2"
          />
        </div>

        <ol ref={ref} className="relative flex flex-col gap-12">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-2 w-px bg-rule" />
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
                  milestone.state === "current" ? "border-lime bg-lime" : "border-rule bg-void",
                )}
              />
              <Reveal direction="up" distance={20} className="flex flex-col gap-1">
                <span className="figure text-caption text-ink-2">
                  {milestone.date}
                  {milestone.state === "current" && (
                    <span className="text-lime"> · current</span>
                  )}
                </span>
                <h3 className="text-heading-4 text-ink-1">{milestone.title}</h3>
                <p className="max-w-xl text-small text-ink-2">{milestone.detail}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
