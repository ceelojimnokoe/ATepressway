"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
  readonly children: ReactNode;
}

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/**
 * Wraps the server-rendered grid and turns clicks on any tile marked with
 * `data-lightbox-index` into a modal viewer. The grid stays a server
 * component: this client leaf listens via one delegated click handler
 * (attached to the wrapper by ref, so there's no interactive-handler on a
 * static element) and reads the index off the clicked tile.
 *
 * Accessibility: role="dialog" + aria-modal; opens focus on the close
 * button; Tab is trapped within the dialog; Esc closes; ArrowLeft/Right
 * page through images; body scroll is locked while open; and the tile
 * that opened the viewer gets focus back on close.
 */
export function GalleryLightbox({ images, children }: GalleryLightboxProps) {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const open = index !== null;
  const count = images.length;

  const close = useCallback(() => {
    setIndex(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count],
  );

  // Delegated open — attached by ref so the wrapper carries no JSX click
  // handler (the real triggers are the tiles' own <button>s, which stay
  // keyboard-operable and bubble their activation here).
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    function onClick(event: MouseEvent) {
      const trigger = (event.target as HTMLElement).closest<HTMLElement>("[data-lightbox-index]");
      if (!trigger) return;
      const i = Number(trigger.dataset.lightboxIndex);
      if (Number.isNaN(i)) return;
      triggerRef.current = trigger;
      setIndex(i);
    }
    grid.addEventListener("click", onClick);
    return () => grid.removeEventListener("click", onClick);
  }, []);

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

  const current = open ? images[index] : null;

  return (
    <>
      <div ref={gridRef}>{children}</div>

      {open && current && (
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
      )}
    </>
  );
}
