"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { latestMonthlyUpdate } from "@/content/project";
import { mediaRegistry } from "@/content/media";
import { CtaLink } from "@/components/ui/cta-link";
import { Modal } from "@/components/ui/modal";

/** Marks the "new activity" dot as seen for the rest of this browser session. */
const SEEN_KEY = "atel-updates-seen";

const LINKS = [
  { href: "/progress", label: "Full progress report" },
  { href: "/gallery", label: "Latest photography" },
  { href: "/project", label: "About the project" },
] as const;

/**
 * The featured 4th action (client instruction, 4 Sept 2026) — jumps straight
 * to the Progress page's "This month and next" section (id + scroll-mt-24
 * added there). Kept separate from LINKS rather than a 4th entry in that
 * array because it renders with the primary (lime) CtaLink variant instead
 * of secondary — see the render below for why.
 */
const FEATURED_LINK = { href: "/progress#this-month-and-next", label: "This month and next" } as const;

/**
 * "Latest updates" — a nav-triggered summary of what has changed recently.
 *
 * It deliberately introduces NO new content model: everything comes from
 * `monthlyUpdates` in src/content/project.ts, the same structure the Progress
 * page uses for its completed/planned split. Updating that one array updates
 * the Progress page and this panel together.
 *
 * Opens only on click (never automatically). The dialog behavior — role /
 * aria-modal, focus in, Tab trap, Esc, scroll lock, the entrance/exit motion
 * and its reduced-motion handling — lives in the shared Modal
 * (src/components/ui/modal.tsx), extracted from this component on 20 Sept
 * 2026 so the Progress history dialog reuses it rather than copying it.
 * Focus returns to the trigger on close.
 */
export function LatestUpdates() {
  const [open, setOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  // Client-only check, so the dot is absent from the server-rendered HTML and
  // only appears once we know it hasn't been seen this session — never a
  // hydration mismatch, and a blocked/private-mode storage simply means the
  // dot doesn't show (fails toward "quiet", not toward "stuck forever").
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) !== "1") setShowDot(true);
    } catch {
      /* storage unavailable — no dot, nothing breaks */
    }
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    // Seeing the panel is what makes the activity "not new" any more — the
    // dot's job is done, so it stops blinking and disappears rather than
    // pulsing indefinitely regardless of whether it's already been seen.
    setShowDot(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable — dot simply reappears next reload, harmless */
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  if (!latestMonthlyUpdate) return null;
  const update = latestMonthlyUpdate;
  const images = (update.completedImages ?? []).slice(0, 4);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPanel}
        className="relative shrink-0 border border-fg bg-surface-raised px-3 py-1.5 text-caption font-medium tracking-wide text-fg uppercase transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Updates
        {showDot && (
          <span
            aria-hidden="true"
            className="absolute -top-1.5 -right-1.5 flex h-3 w-3 items-center justify-center"
          >
            {/* Solid lime fill — legal on any surface per the lime rule (a
                fill, not lime text/icon on light). The border keeps its edge
                perceivable against the paper surface. */}
            {reduced ? (
              <span className="h-2.5 w-2.5 rounded-full border border-accent bg-lime" />
            ) : (
              <>
                <motion.span
                  className="absolute h-2.5 w-2.5 rounded-full bg-lime"
                  animate={{ opacity: [1, 0.35, 1], scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="h-2.5 w-2.5 rounded-full border border-accent bg-lime" />
              </>
            )}
          </span>
        )}
      </button>

      <Modal open={open} onClose={close} label="Latest project updates">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-caption text-accent tracking-wide uppercase">
              Last updated: {update.month}
            </span>
            <h2 className="text-heading-4 text-fg">What&rsquo;s new on the corridor</h2>
          </div>
          {/* First focusable in the panel, so Modal gives it the initial focus. */}
          <button
            type="button"
            onClick={close}
            className="figure -mt-1 shrink-0 px-2 text-body text-fg-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            aria-label="Close latest updates"
          >
            ×
          </button>
        </div>

        <div className="flex items-baseline gap-2 border-y border-hairline py-4">
          <span className="figure text-heading-2 text-accent tabular-nums">
            {update.overallPct}%
          </span>
          <span className="text-small text-fg-muted">overall physical progress for Section 1</span>
        </div>

        {update.completed.length > 0 && (
          <ul className="flex flex-col gap-2">
            {update.completed.slice(0, 4).map((entry) => (
              <li key={entry} className="flex gap-2 text-small text-fg-muted">
                <span aria-hidden="true" className="text-accent">
                  —
                </span>
                <span>{entry}</span>
              </li>
            ))}
          </ul>
        )}

        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((key) => {
              const asset = mediaRegistry[key];
              return (
                <li
                  key={key}
                  className="relative aspect-[4/3] overflow-hidden border border-hairline bg-surface-sunk"
                >
                  <Image
                    src={asset.src}
                    alt={asset.alt}
                    fill
                    sizes="(min-width: 640px) 20vw, 45vw"
                    className="object-cover"
                  />
                </li>
              );
            })}
          </ul>
        )}

        {/* Buttons (client instruction, 4 Sept 2026) — same shape as
            Home's "Explore progress" CtaLink, arrow omitted since four
            equal-weight-looking actions don't need the nudge. Full
            width and stacked below 640px so four buttons never crowd
            at 360px; row-wrapped from sm: up, where there's room. The
            featured link uses the primary (lime) variant so it's the
            one thing that stands out — matches "lime marks the single
            most important thing on a screen" (see globals.css) rather
            than making all four compete for the same signal colour. */}
        <div className="flex flex-col gap-3 border-t border-hairline pt-5 sm:flex-row sm:flex-wrap">
          {LINKS.map((link) => (
            <CtaLink
              key={link.href}
              href={link.href}
              onClick={close}
              variant="secondary"
              showArrow={false}
              className="w-full justify-center sm:w-auto"
            >
              {link.label}
            </CtaLink>
          ))}
          <CtaLink
            href={FEATURED_LINK.href}
            onClick={close}
            variant="primary"
            showArrow={false}
            className="w-full justify-center sm:w-auto"
          >
            {FEATURED_LINK.label}
          </CtaLink>
        </div>
      </Modal>
    </>
  );
}
