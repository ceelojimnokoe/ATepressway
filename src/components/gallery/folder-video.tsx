"use client";

import { useRef, useState } from "react";
import type { RegisteredMediaAsset } from "@/content/media";

/**
 * Featured video at the top of a folder page. A native <video controls> —
 * `preload="none"` plus a `poster`, no autoplay — so the browser fetches
 * only the poster until the visitor presses play (the overlay button below
 * or the native control; both call the same element). The overlay exists
 * because Chromium shows no large play affordance on a poster by itself; it
 * is a real <button>, keyboard-focusable, and unmounts once playback starts
 * so it can never sit over the native controls. The poster is a plain
 * `poster` attribute, not a next/image — a <video> can only take a URL.
 * No motion is applied anywhere here.
 */
export function FolderVideo({ video, label }: { readonly video: RegisteredMediaAsset; readonly label: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-hairline bg-void" data-theme="dark">
      <video
        ref={ref}
        controls
        playsInline
        preload="none"
        poster={video.poster?.src}
        aria-label={label}
        onPlay={() => setStarted(true)}
        className="absolute inset-0 h-full w-full object-contain"
      >
        <source src={video.src} type="video/mp4" />
        Your browser can’t play this video.
      </video>
      {!started && (
        <button
          type="button"
          onClick={() => void ref.current?.play()}
          aria-label={`Play video: ${label}`}
          className="absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
        >
          <span
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center border border-accent bg-lime text-void"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
