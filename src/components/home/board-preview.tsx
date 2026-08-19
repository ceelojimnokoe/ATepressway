"use client";

import { useState } from "react";
import { boardMembers } from "@/content/project";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/ui/cta-link";
import { BoardMemberCard } from "@/components/stakeholders/board-member-card";

const PER_PAGE = 2;

/**
 * Management teaser on the home page. Shows a couple of board members at a
 * time and pages through the rest IN PLACE (next/prev), so a visitor can see
 * the whole board without leaving the page; a "View all" link still leads to
 * the full list on /stakeholders. It reuses the Board of Directors data and
 * BoardMemberCard, so every seat renders the same honest "to be confirmed"
 * state — no name is fabricated.
 */
export function BoardPreview() {
  const members = boardMembers;
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
            <span className="figure text-caption text-accent tracking-[0.2em] uppercase">08 — Management</span>
            <TextReveal
              as="h2"
              text="Board of Directors"
              className="text-heading-3 text-fg sm:text-heading-2"
            />
          </div>
          <Reveal direction="up" distance={12}>
            <CtaLink href="/stakeholders#board" variant="secondary">
              View all
            </CtaLink>
          </Reveal>
        </div>

        {/* Two seats per page; the same cards keep their grid slot as pages
            change so nothing below jumps. */}
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
          {shown.map((member, i) => (
            <BoardMemberCard key={`board-seat-${start + i + 1}`} member={member} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-small text-fg-faint">
            A preview of the Board of Directors. See every member and their full profile on the
            stakeholders page.
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
