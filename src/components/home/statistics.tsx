"use client";

import { useState } from "react";
import { sectionStatGroups } from "@/content/project";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { TextReveal } from "@/components/motion/text-reveal";
import { cn } from "@/lib/cn";

/**
 * The project at scale. A segmented control switches between the three
 * sections and a combined total; the figures swap in place and the count-ups
 * re-run for the newly selected group (the `key` on the figure forces a fresh
 * mount, so the run-up plays again rather than snapping).
 *
 * Sections 2 and 3 deliberately carry fewer figures than Section 1: they are
 * Phase 2 and the client has published only length, lane count and phase for
 * them. Padding the grid with estimates would be inventing facts — see
 * sectionStatGroups in src/content/project.ts.
 */
export function Statistics() {
  const [activeId, setActiveId] = useState(sectionStatGroups[0]?.id ?? "s1");
  const active = sectionStatGroups.find((group) => group.id === activeId) ?? sectionStatGroups[0];

  return (
    <section className="border-b border-hairline bg-surface">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-10 flex flex-col gap-4">
          <span className="figure text-caption text-accent tracking-[0.2em] uppercase">04 — By the numbers</span>
          <TextReveal
            as="h2"
            text="The scale of the works"
            className="text-heading-3 text-fg sm:text-heading-2"
          />
        </div>

        <div
          role="group"
          aria-label="Choose a section"
          className="mb-8 flex flex-wrap gap-2"
        >
          {sectionStatGroups.map((group) => {
            const isActive = group.id === active.id;
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveId(group.id)}
                className={cn(
                  "border px-4 py-2 text-caption uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  isActive
                    ? "border-accent bg-lime text-void"
                    : "border-hairline text-fg-muted hover:border-fg-muted hover:text-fg",
                )}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        <p className="mb-12 max-w-3xl text-body text-fg-muted">{active.summary}</p>

        <div className="grid grid-cols-1 gap-x-16 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {active.stats.map((stat) => (
            <div
              key={`${active.id}-${stat.label}`}
              className="flex flex-col items-center gap-3 border-t border-hairline pt-6 text-center"
            >
              <div className="flex items-baseline justify-center gap-1.5">
                <AnimatedFigure
                  key={`${active.id}-${stat.label}-figure`}
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  separator={stat.separator}
                  className="text-heading-1 lg:text-heading-2"
                />
                {stat.unit && <span className="text-small text-fg-muted">{stat.unit}</span>}
              </div>
              <span className="text-caption text-fg-muted tracking-wide uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
