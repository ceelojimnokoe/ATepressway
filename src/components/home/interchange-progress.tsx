"use client";

import { motion } from "motion/react";
import { reveal, viewport, barFill } from "@/lib/motion";
import { progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { Figure } from "@/components/ui/figure";

/**
 * Per-structure progress for the four interchanges, straight from the
 * May 2026 MPR. The interchange packages are the percentage-based ones
 * (no unit tally); the footbridge and culvert packages carry a
 * units-complete/units-total count and live on /progress, not here.
 * Bars animate via barFill (scaleX from origin-left — transform only).
 * The MPR source is rendered visibly, not footnoted: an unsourced
 * percentage has no place on this site.
 */
export function InterchangeProgress() {
  const packages = isPlaceholder(progress.workPackages) ? [] : progress.workPackages;
  const interchanges = packages.filter((pkg) => pkg.unitsTotal === undefined);
  const source = isPlaceholder(progress.signOffSource) ? null : progress.signOffSource;

  return (
    <section className="border-b border-rule bg-void">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={reveal}
        className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8"
      >
        <h2 className="text-heading-4 text-ink-1">Interchange progress</h2>

        <ul className="flex flex-col gap-6">
          {interchanges.map((pkg) => (
            <li key={pkg.id} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-body text-ink-1">{pkg.name}</span>
                <Figure value={`${pkg.percentComplete}%`} />
              </div>
              <div
                className="h-2 w-full overflow-hidden bg-sunk"
                role="progressbar"
                aria-valuenow={pkg.percentComplete}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pkg.name} progress`}
              >
                <motion.div
                  initial={barFill.hidden}
                  whileInView={barFill.visible(pkg.percentComplete / 100)}
                  viewport={viewport}
                  className="h-full w-full origin-left bg-lime"
                />
              </div>
            </li>
          ))}
        </ul>

        {source && (
          <p className="text-caption text-ink-3">
            Interchange progress figures reflect the {source}.
          </p>
        )}
      </motion.div>
    </section>
  );
}
