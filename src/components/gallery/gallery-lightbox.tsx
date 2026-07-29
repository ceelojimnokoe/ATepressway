"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface LightboxImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly caption: string;
}

interface GalleryLightboxProps {
  readonly images: readonly LightboxImage[];
  /**
   * Id of the element whose descendant `[data-lightbox-index]` triggers this
   * viewer should respond to. Omit to listen on the whole document (fine
   * when there is a single lightbox on the page, e.g. the gallery). Set it
   * when multiple lightboxes coexist (e.g. the four Progress structures) so
   * each responds only to its own triggers.
   */
  readonly rootId?: string;
}

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/**
 * Self-contained image viewer for the gallery. It is a STANDALONE client
 * leaf — it does NOT wrap the grid. The grid is a pure server component
 * rendered independently in the page, and its tiles carry a
 * `data-lightbox-index`. This component attaches ONE delegated click
 * listener on `document`, so a tile click (mouse or keyboard-activated)
 * opens the viewer without the grid depending on this component hydrating.
 *
 * Consequence: if this component ever fails to hydrate, the gallery images
 * stay fully visible (they aren't its children). It renders nothing until a
 * tile is opened, so a closed lightbox can never cover or hide the page.
 *
 * Accessibility: role="dialog" + aria-modal; focus opens on Close; Tab is
 * trapped; Esc closes; ArrowLeft/Right page; body scroll locked while open;
 * focus returns to the tile that opened it.
 */
export function GalleryLightbox({ images, rootId }: GalleryLightboxProps) {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const count = images.length;
  const open = index !== null;

  const close = useCallback(() => {
    setIndex(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count],
  );

  // Delegated open — scoped to `rootId` when given, else the whole document.
  // Either way the triggers live in server-rendered markup, so the grid does
  // not depend on this component to be visible.
  useEffect(() => {
    const root: Document | HTMLElement | null = rootId
      ? document.getElementById(rootId)
      : document;
    if (!root) return;
    function onClick(event: Event) {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest?.<HTMLElement>("[data-lightbox-index]");
      if (!trigger) return;
      const i = Number(trigger.dataset.lightboxIndex);
      if (!Number.isInteger(i) || i < 0 || i >= images.length) return;
      triggerRef.current = trigger;
      setIndex(i);
    }
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [images.length, rootId]);

  // Keyboard, focus move, focus trap, scroll lock — only while open.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowRight" && count > 1) {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft" && count > 1) {
        event.preventDefault();
        step(-1);
      } else if (event.key === "Tab") {
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
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close, step, count]);

  // Nothing rendered until a tile is opened — a closed lightbox can't cover
  // or hide the page.
  if (index === null) return null;
  const current = images[index];
  if (!current) return null;

  return (
    <div
      ref={dialogRef}
      data-theme="dark"
      role="dialog"
      aria-modal="true"
      aria-label={current.caption}
      className="fixed inset-0 z-50 flex flex-col bg-surface/95"
    >
      {/* Backdrop click-to-close (pointer only; keyboard uses Esc/Close). */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 -z-10 cursor-zoom-out"
      />

      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <span className="figure text-caption text-fg-faint">
          {index + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          className="border border-hairline px-3 py-1.5 text-caption text-fg uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          Close
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2 px-2 pb-2 sm:gap-4 sm:px-4">
        {count > 1 && (
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous image"
            className="figure shrink-0 border border-hairline px-3 py-4 text-body text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            ‹
          </button>
        )}

        <figure className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <Image
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="90vw"
            className="h-auto max-h-[78vh] w-auto max-w-full object-contain"
          />
          <figcaption className="text-small text-fg-muted">{current.caption}</figcaption>
        </figure>

        {count > 1 && (
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next image"
            className="figure shrink-0 border border-hairline px-3 py-4 text-body text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
