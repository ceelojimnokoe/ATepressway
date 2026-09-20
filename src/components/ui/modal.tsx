"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { duration, easing } from "@/lib/motion";

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

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

interface ModalProps {
  readonly open: boolean;
  /** Called on Esc and backdrop click. The caller sets `open` false and returns focus to its trigger. */
  readonly onClose: () => void;
  /** Accessible name for the dialog. */
  readonly label: string;
  readonly children: ReactNode;
  /**
   * A wider panel (max-w-3xl instead of max-w-2xl) for longer content. A fixed
   * choice rather than a className override, so this doesn't need `cn` /
   * tailwind-merge — which added ~24 kB of client JS to /progress when tried.
   */
  readonly wide?: boolean;
}

/**
 * The site's shared dialog shell — extracted (20 Sept 2026) from the Latest
 * Updates panel so it and the Progress history dialog behave identically
 * instead of carrying two copies of the same logic. The behavior is the
 * Latest Updates panel's, unchanged, which itself follows the gallery
 * lightbox's conventions: role="dialog" + aria-modal, focus moves to the
 * first focusable control on open, Tab is trapped inside, Esc closes, body
 * scroll is locked while open. The entrance/exit reuse the site's standard
 * `reveal` motion values and are skipped entirely under reduced motion.
 *
 * Put the close button FIRST in the panel's DOM order — it receives the
 * initial focus.
 */
export function Modal({ open, onClose, label, wide = false, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const reduced = useReducedMotion();

  // Callers can pass an inline handler; the effect below must not re-run (and
  // re-steal focus) every time a parent re-renders, so it reads the latest
  // handler through a ref instead of depending on it.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
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
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          {/* Backdrop — pointer only; keyboard uses Esc or the close button. */}
          <motion.button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={onClose}
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
            aria-label={label}
            className={`relative my-auto flex w-full flex-col gap-6 border border-hairline bg-surface-raised p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] sm:p-8 ${wide ? "max-w-3xl" : "max-w-2xl"}`}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "visible"}
            exit={reduced ? undefined : "exit"}
            variants={reduced ? undefined : panelVariants}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
