"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ProgressHistoryEntry } from "@/content/project";

// Loaded on first click, not with the page — see progress-history-dialog.tsx.
const ProgressHistoryDialog = dynamic(
  () => import("./progress-history-dialog").then((module) => module.ProgressHistoryDialog),
  { ssr: false },
);

/**
 * "Previous progress" — a chronological record of past progress updates,
 * presented like release notes (date + what changed), behind a button rather
 * than permanently expanded on the page (client instruction, 20 Sept 2026).
 *
 * The entries are DERIVED from `monthlyUpdates` (see `progressHistory` in
 * src/content/project.ts) and passed in from the server page — there is no
 * second content model here. The dialog itself is the shared Modal (extracted
 * from the Latest Updates panel), so it behaves identically: focus in, Tab
 * trap, Esc, scroll lock, and the site's standard entrance motion with
 * reduced-motion respected. Focus returns to the button on close.
 *
 * The dialog code loads on the first click and then stays mounted (toggled by
 * `open`), so the Modal's exit animation still plays on every close.
 */
export function ProgressHistory({ entries }: { readonly entries: readonly ProgressHistoryEntry[] }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  if (entries.length === 0) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setEverOpened(true);
          setOpen(true);
        }}
        className="inline-flex w-fit items-center gap-2 border border-hairline px-6 py-3 text-small tracking-wide text-fg uppercase transition-colors duration-200 ease-out hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Previous progress
      </button>

      {everOpened && <ProgressHistoryDialog open={open} onClose={close} entries={entries} />}
    </>
  );
}
