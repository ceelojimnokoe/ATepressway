"use client";

import { motion } from "motion/react";
import { reveal, viewport, barFill } from "@/lib/motion";
import { progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { Figure } from "@/components/ui/figure";

/**
 * Per-structure progress from the May 2026 MPR: the four interchanges,
 * the footbridges, and the culverts. Unit-based structures also show
 * their raw tally (e.g. 3.15 / 10) beside the percentage. Bars animate
 * via barFill (scaleX from origin-left — transform only). Every row
 * carries its own source line: a figure without a citation has no place
 * here.
 */
export function WorkPackages() {
  const packages = isPlaceholder(progress.workPackages) ? [] : progress.workPackages;

  return (
    <section className="border-b border-rule bg-raised">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={reveal}
        className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8"
      >
        <h2 className="text-heading-4 text-ink-1">Per-structure progress</h2>

        <ul className="flex flex-col gap-8">
          {packages.map((pkg) => (
            <li key={pkg.id} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-body text-ink-1">{pkg.name}</span>
                <div className="flex items-baseline gap-3">
                  {pkg.unitsComplete !== undefined && pkg.unitsTotal !== undefined && (
                    <span className="figure text-small text-ink-2">
                      {pkg.unitsComplete} / {pkg.unitsTotal}
                    </span>
                  )}
                  <Figure value={`${pkg.percentComplete}%`} />
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden bg-sunk">
                <motion.div
                  initial={barFill.hidden}
                  whileInView={barFill.visible(pkg.percentComplete / 100)}
                  viewport={viewport}
                  className="h-full w-full origin-left bg-lime"
                />
              </div>
              <span className="text-caption text-ink-3">{pkg.source}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
