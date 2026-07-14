"use client";

import { motion } from "motion/react";
import { reveal, viewport } from "@/lib/motion";
import { progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { Figure } from "@/components/ui/figure";
import { AnimatedFigure } from "@/components/ui/animated-figure";

function TbcChip({ label }: { readonly label: string }) {
  return (
    <div className="inline-flex w-fit items-center gap-2 border border-dashed border-rule bg-raised px-3 py-1.5 text-caption text-ink-3 tracking-wide uppercase">
      <span aria-hidden="true">—</span>
      {label} · to be confirmed
    </div>
  );
}

/**
 * The only Client Component among the Home sections — built to hold a
 * live, animated figure once progress.overallPercentComplete resolves.
 * Today, with everything still a placeholder, it renders two honest TBC
 * blocks rather than five fabricated work-package cards: the breakdown
 * (interchanges vs. contract packages) was never confirmed, so there's
 * nothing real to list.
 */
export function ProgressTracker() {
  return (
    <section className="border-b border-rule bg-raised">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={reveal}
        className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8"
      >
        <h2 className="text-heading-4 text-ink-1">Progress</h2>

        <div className="flex flex-col gap-2">
          <span className="text-caption text-ink-3 tracking-wide uppercase">Overall completion</span>
          {isPlaceholder(progress.overallPercentComplete) ? (
            <TbcChip label="Overall progress percentage" />
          ) : (
            <div className="flex items-baseline gap-3">
              <AnimatedFigure value={progress.overallPercentComplete} suffix="%" signal className="text-heading-2" />
              {!isPlaceholder(progress.asOf) && !isPlaceholder(progress.signOffSource) && (
                <span className="text-small text-ink-2">
                  as of {progress.asOf} · reported by {progress.signOffSource}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-caption text-ink-3 tracking-wide uppercase">Work packages</span>
          {isPlaceholder(progress.workPackages) ? (
            <TbcChip label="Work package breakdown & progress" />
          ) : (
            <ul className="flex flex-col gap-2">
              {progress.workPackages.map((pkg) => (
                <li
                  key={pkg.id}
                  className="flex items-center justify-between border border-rule bg-raised px-4 py-3"
                >
                  <span className="text-body text-ink-1">{pkg.name}</span>
                  <Figure value={`${pkg.percentComplete}%`} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </section>
  );
}
