"use client";

import { useState } from "react";
import { team } from "@/content/project";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/ui/cta-link";
import { TeamMemberCard } from "@/components/stakeholders/team-member-card";

const PER_PAGE = 2;

/**
 * Project Team teaser on the home page — the project professionals (Ing.
 * Kwadwo Bempong and Koffi Togbenou), drawn from the Team dataset. It reuses
 * the same paginated slider mechanism as before (with two members they sit on
 * a single page) and TeamMemberCard. The full Project Team and Board of
 * Directors sections live, unchanged, on /stakeholders.
 */
export function TeamPreview() {
  const members = team;
  const pageCount = Math.ceil(members.length / PER_PAGE);
  const [page, setPage] = useState(0);

  if (members.length === 0) return null;

  const start = page * PER_PAGE;
  const shown = members.slice(start, start + PER_PAGE);

  return (
    <section className="border-b border-hairline bg-surface">
      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">08 — People</span>
            <TextReveal
              as="h2"
              text="Project Team"
              className="text-heading-3 text-fg sm:text-heading-2"
            />
          </div>
          <Reveal direction="up" distance={12}>
            <CtaLink href="/stakeholders" variant="secondary">
              All stakeholders
            </CtaLink>
          </Reveal>
        </div>

        {/* Same slider grid; the cards keep their slot as pages change so
            nothing below jumps. */}
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
          {shown.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-small text-fg-faint">
            The project professionals leading delivery. See the full team and the Board of Directors
            on the stakeholders page.
          </p>
          {pageCount > 1 && (
            <div className="flex items-center gap-3">
              <span className="figure text-caption text-fg-muted" aria-live="polite">
                {page + 1} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
                aria-label="Previous members"
                className="figure border border-hairline px-3 py-2 text-body text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => (p + 1) % pageCount)}
                aria-label="Next members"
                className="figure border border-hairline px-3 py-2 text-body text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
