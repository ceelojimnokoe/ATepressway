"use client";

import { motion } from "motion/react";
import { reveal, viewport, barFill } from "@/lib/motion";
import { progress } from "@/content/project";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { Figure } from "@/components/ui/figure";

/**
 * The only Client Component on this page — bars animate via barFill
 * (scaleX), which needs whileInView. Today progress.workPackages is a
 * placeholder with an empty-array fallback (the breakdown — interchanges
 * vs. contract packages — was never confirmed), so this renders one
 * honest TBC block, not five fabricated bars. The bar-rendering branch
 * below is real and ready; it activates the moment the data resolves.
 */
export function WorkPackages() {
  return (
    <section className="border-b border-rule">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={reveal}
        className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8"
      >
        <h2 className="text-heading-4 text-ink-1">Work packages</h2>

        <PlaceholderNotice value={progress.workPackages} size="display">
          {(packages) => (
            <ul className="flex flex-col gap-6">
              {packages.map((pkg) => (
                <li key={pkg.id} className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-body text-ink-1">{pkg.name}</span>
                    <Figure value={`${pkg.percentComplete}%`} />
                  </div>
                  <div className="h-2 w-full overflow-hidden bg-raised">
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
          )}
        </PlaceholderNotice>
      </motion.div>
    </section>
  );
}
