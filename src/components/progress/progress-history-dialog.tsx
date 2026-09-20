"use client";

import type { ProgressHistoryEntry } from "@/content/project";
import { Modal } from "@/components/ui/modal";

/**
 * The dialog half of "Previous progress" — split from the button
 * (progress-history.tsx) so the Modal and its motion code load only when the
 * button is first clicked, rather than adding ~24 kB of client JS to every
 * visit to /progress (measured: 147 → 171 kB First Load with it inlined).
 */
export function ProgressHistoryDialog({
  open,
  onClose,
  entries,
}: {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly entries: readonly ProgressHistoryEntry[];
}) {
  return (
    <Modal open={open} onClose={onClose} label="Previous progress" wide>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-caption text-accent tracking-wide uppercase">Progress history</span>
          <h2 className="text-heading-4 text-fg">Previous progress</h2>
        </div>
        {/* First focusable in the panel, so Modal gives it the initial focus. */}
        <button
          type="button"
          onClick={onClose}
          className="figure -mt-1 shrink-0 px-2 text-body text-fg-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="Close previous progress"
        >
          ×
        </button>
      </div>

      <ol className="flex flex-col border-b border-hairline">
        {entries.map((entry) => (
          <li
            key={entry.month}
            className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-hairline py-5 sm:grid-cols-[10rem_minmax(0,1fr)]"
          >
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-2 text-body text-fg">
                {entry.month}
                {entry.isLatest && (
                  // Solid lime fill with near-black text — legal on any
                  // surface per the lime rule; a fill, not lime text.
                  <span className="border border-accent bg-lime px-1.5 py-0.5 text-caption tracking-wide text-void uppercase">
                    Latest
                  </span>
                )}
              </span>
              <span className="figure text-small text-fg-muted tabular-nums">
                {entry.overallPct}% overall
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {entry.changes.map((change) => (
                <li key={change} className="flex gap-2 text-small text-fg-muted">
                  <span aria-hidden="true" className="text-accent">
                    —
                  </span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Modal>
  );
}
