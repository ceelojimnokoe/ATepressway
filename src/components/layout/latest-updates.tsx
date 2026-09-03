"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { latestMonthlyUpdate } from "@/content/project";
import { mediaRegistry } from "@/content/media";
import { duration, easing } from "@/lib/motion";
import { PageTransitionLink } from "./page-transition-link";

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/** Marks the "new activity" dot as seen for the rest of this browser session. */
const SEEN_KEY = "atel-updates-seen";

const LINKS = [
  { href: "/progress", label: "Full progress report" },
  { href: "/gallery", label: "Latest photography" },
  { href: "/project", label: "About the project" },
] as const;

// The panel's entrance/exit — the site's standard `reveal` motion (12px rise +
// fade, duration.base, ease.out; see src/lib/motion.ts), not an invented one.
// The gallery lightbox itself has no entrance animation to borrow, so this
// reuses the same primitive every other reveal on the site is built from.
const panelVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.out } },
  exit: { opacity: 0, y: 8, transition: { duration: duration.fast, ease: easing.in } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: easing.out } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: easing.in } },
};

/**
 * "Latest updates" — a nav-triggered summary of what has changed recently.
 *
 * It deliberately introduces NO new content model: everything comes from
 * `monthlyUpdates` in src/content/project.ts, the same structure the Progress
 * page uses for its completed/planned split. Updating that one array updates
 * the Progress page and this panel together.
 *
 * Opens only on click (never automatically) and follows the dialog conventions
 * already used by the gallery lightbox: role="dialog" + aria-modal, focus moves
 * in on open, Tab is trapped, Esc closes, body scroll is locked, and focus
 * returns to the trigger on close. The entrance/exit reuse the site's
 * standard `reveal` motion values, skipped entirely under reduced motion.
 */
export function LatestUpdates() {
  const [open, setOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

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

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
            {/* Backdrop — pointer only; keyboard uses Esc or Close. */}
            <motion.button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={close}
              className="fixed inset-0 cursor-default bg-void/70"
              initial={reduced ? undefined : "hidden"}
              animate={reduced ? undefined : "visible"}
              exit={reduced ? undefined : "exit"}
              variants={reduced ? undefined : backdropVariants}
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Latest project updates"
              className="relative my-auto flex w-full max-w-2xl flex-col gap-6 border border-hairline bg-surface-raised p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] sm:p-8"
              initial={reduced ? undefined : "hidden"}
              animate={reduced ? undefined : "visible"}
              exit={reduced ? undefined : "exit"}
              variants={reduced ? undefined : panelVariants}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-caption text-accent tracking-wide uppercase">
                    Last updated: {update.month}
                  </span>
                  <h2 className="text-heading-4 text-fg">What&rsquo;s new on the corridor</h2>
                </div>
                <button
                  ref={closeRef}
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

              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-hairline pt-4">
                {LINKS.map((link) => (
                  <PageTransitionLink
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="text-small text-fg underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label} →
                  </PageTransitionLink>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
