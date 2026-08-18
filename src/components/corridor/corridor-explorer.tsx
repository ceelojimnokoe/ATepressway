"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { animate, useReducedMotion, type AnimationPlaybackControlsWithThen } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { buildSegments, clampKm, findSegmentAt, kmToPercent, percentToKm } from "./geometry";
import { interchanges, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { mediaRegistry, type MediaKey } from "@/content/media";
import { structureDesignImages } from "@/content/structure-media";
import { GalleryLightbox, type LightboxImage } from "@/components/gallery/gallery-lightbox";

type PointKind = "endpoint" | "boundary" | "interchange";

interface Demarcation {
  readonly id: string;
  readonly km: number;
  readonly name: string;
  readonly kind: PointKind;
  /** Interchange positions come from approximate chainage labels, not a confirmed offset. */
  readonly approximate: boolean;
  /** Short position label — the chainage for interchanges, a role for the rest. */
  readonly meta: string;
  readonly percent?: number;
  readonly activity?: string;
  /** Indices into the flat `images` array (empty when the point has no tagged media). */
  readonly imageIndices: readonly number[];
}

const ROOT_ID = "corridor-explorer";

/**
 * Built once at module load from the SAME geometry the corridor bar uses.
 * Section boundaries and endpoints sit at exact km; interchanges are placed
 * from their approximate chainage labels (their real offset is still a
 * placeholder in content) and flagged `approximate` so the UI can say so.
 */
const { segments, totalKm, points, images } = (() => {
  const segments = buildSegments();
  const totalKm = segments[segments.length - 1]?.endKm ?? 0;
  const s1 = segments.find((s) => s.section.id === "s1");
  const workPackages = isPlaceholder(progress.workPackages) ? [] : progress.workPackages;

  const images: LightboxImage[] = [];
  const pushImages = (keys: readonly MediaKey[]): number[] => {
    const idx: number[] = [];
    for (const key of keys) {
      const asset = mediaRegistry[key];
      if (!asset || !asset.onDisk) continue;
      idx.push(images.length);
      images.push({ src: asset.src, alt: asset.alt, width: asset.width, height: asset.height, caption: asset.alt });
    }
    return idx;
  };

  const list: Demarcation[] = [];

  list.push({
    id: "start",
    km: 0,
    name: segments[0]?.displayFrom ?? "Start",
    kind: "endpoint",
    approximate: false,
    meta: "Corridor start",
    imageIndices: [],
  });

  for (const seg of segments.slice(1)) {
    // Skip a boundary whose junction is itself an interchange (e.g. Tetteh
    // Quarshie is both the S2/S1 boundary and an interchange) — the
    // interchange point covers it, so we don't draw two markers on the spot.
    if (interchanges.some((ic) => ic.name === seg.displayFrom)) continue;
    list.push({
      id: `boundary-${seg.section.id}`,
      km: seg.startKm,
      name: seg.displayFrom,
      kind: "boundary",
      approximate: false,
      meta: "Section boundary",
      imageIndices: [],
    });
  }

  for (const ic of interchanges) {
    const match = ic.chainageLabel.match(/(\d+)\s*\+\s*(\d+)/);
    const offsetKm = match ? Number(match[1]) + Number(match[2]) / 1000 : 0;
    const km = clampKm((s1?.startKm ?? 0) + offsetKm, totalKm);
    const pkg = workPackages.find((w) => w.id === ic.id);
    list.push({
      id: ic.id,
      km,
      name: ic.name,
      kind: "interchange",
      approximate: true,
      meta: ic.chainageLabel,
      percent: pkg?.percentComplete,
      activity: ic.mayActivity,
      imageIndices: pushImages(structureDesignImages[ic.id] ?? []),
    });
  }

  list.push({
    id: "end",
    km: totalKm,
    name: segments[segments.length - 1]?.displayTo ?? "End",
    kind: "endpoint",
    approximate: false,
    meta: "Corridor end",
    imageIndices: [],
  });

  list.sort((a, b) => a.km - b.km);
  return { segments, totalKm, points: list, images };
})();

function nearest(km: number): Demarcation {
  return points.reduce((best, p) => (Math.abs(p.km - km) < Math.abs(best.km - km) ? p : best), points[0]);
}

/**
 * Interactive, explorable version of the corridor bar — additive to the
 * existing /project content. Reuses geometry.ts (the proportional km scale),
 * the drag-spring scrubber pattern, motion tokens and GalleryLightbox (the
 * same modal Gallery and the Progress structures use). Tap/click a
 * demarcation — on the bar or in the card strip — to read its detail; a
 * tagged structure's design images open in the shared lightbox.
 */
export function CorridorExplorer() {
  const firstInterchange = points.find((p) => p.kind === "interchange") ?? points[0];
  const [activeId, setActiveId] = useState<string>(firstInterchange.id);
  const [handleKm, setHandleKm] = useState<number>(firstInterchange.km);

  const active = points.find((p) => p.id === activeId) ?? points[0];
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const handleKmRef = useRef(handleKm);
  const controlsRef = useRef<AnimationPlaybackControlsWithThen | null>(null);

  function setKm(km: number) {
    const clamped = clampKm(km, totalKm);
    handleKmRef.current = clamped;
    setHandleKm(clamped);
  }

  function animateTo(km: number) {
    controlsRef.current?.stop();
    const clamped = clampKm(km, totalKm);
    if (reduced) {
      setKm(clamped);
      return;
    }
    controlsRef.current = animate(handleKmRef.current, clamped, {
      ...spring.drag,
      onUpdate: (latest) => setKm(latest),
    });
  }

  function select(point: Demarcation) {
    setActiveId(point.id);
    animateTo(point.km);
  }

  function updateFromClientX(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    controlsRef.current?.stop();
    setKm(percentToKm(((clientX - rect.left) / rect.width) * 100, totalKm));
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }
  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  }
  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const snap = nearest(handleKmRef.current);
    setActiveId(snap.id);
    animateTo(snap.km);
  }

  const handlePercent = kmToPercent(handleKm, totalKm);
  const activeSection = findSegmentAt(active.km, segments).section;

  return (
    <div id={ROOT_ID} className="flex flex-col gap-8">
      {/* --- The proportional bar with clickable demarcations --- */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between text-caption text-fg-muted">
          <span>{segments[0]?.displayFrom}</span>
          <span>{segments[segments.length - 1]?.displayTo}</span>
        </div>

        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative h-4 w-full touch-none select-none"
        >
          {/* Segments — proportional to real km. */}
          <div className="absolute inset-0 flex overflow-hidden bg-hairline">
            {segments.map((segment, index) => (
              <div
                key={segment.section.id}
                style={{ flexGrow: segment.section.lengthKm, flexBasis: 0 }}
                className={cn("h-full bg-surface-sunk", index > 0 && "border-l border-hairline")}
              />
            ))}
          </div>

          {/* Demarcation markers. Boundaries are solid ticks; interchanges are
              hollow (approximate). The active one gets the lime signal. */}
          {points
            .filter((p) => p.kind !== "endpoint")
            .map((p) => {
              const isActive = p.id === active.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => select(p)}
                  aria-label={`${p.name}${p.approximate ? " (approximate position)" : ""}`}
                  aria-pressed={isActive}
                  style={{ left: `${kmToPercent(p.km, totalKm)}%` }}
                  className="group absolute top-1/2 z-10 flex h-11 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus:outline-none"
                >
                  <span
                    className={cn(
                      "block h-6 w-[3px] rounded-full transition-colors",
                      p.kind === "interchange"
                        ? cn("border border-accent", isActive ? "bg-lime" : "bg-surface group-hover:bg-lime")
                        : cn(isActive ? "bg-lime" : "bg-fg-muted group-hover:bg-fg"),
                      "group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-surface",
                    )}
                  />
                </button>
              );
            })}

          {/* Drag-spring handle — reuses the scrubber pattern. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-full">
            <div className="absolute inset-y-0 left-0 w-full" style={{ transform: `translateX(${handlePercent}%)` }}>
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <span className="block h-5 w-5 rounded-full border-2 border-accent bg-surface" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-caption text-fg-faint">
          Drag along the corridor, or select a point below. Interchange positions are approximate
          (from reported chainage) and pending confirmation.
        </p>
      </div>

      {/* --- Detail panel for the active demarcation --- */}
      <div className="flex flex-col gap-4 border border-hairline bg-surface-raised p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div className="flex flex-col gap-1">
            <span className="text-caption text-accent tracking-wide uppercase">
              {active.kind === "interchange" ? "Interchange" : active.kind === "boundary" ? "Section boundary" : "Corridor end"}
              {active.approximate ? " · approx." : ""}
            </span>
            <h3 className="text-heading-4 text-fg">{active.name}</h3>
          </div>
          {typeof active.percent === "number" && (
            <div className="flex items-baseline gap-1.5">
              <span className="figure text-heading-3 text-accent tabular-nums">{active.percent}</span>
              <span className="text-small text-fg-muted">% complete</span>
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-caption text-fg-faint tracking-wide uppercase">Chainage</dt>
            <dd className="figure text-small text-fg tabular-nums">{active.meta}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-caption text-fg-faint tracking-wide uppercase">Section</dt>
            <dd className="text-small text-fg">{activeSection.name} · {activeSection.road}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-caption text-fg-faint tracking-wide uppercase">Position</dt>
            <dd className="figure text-small text-fg tabular-nums">
              {active.km.toFixed(1)} km{active.approximate ? " (approx.)" : ""}
            </dd>
          </div>
        </dl>

        {active.activity && (
          <p className="text-small text-fg-muted">
            <span className="text-fg-faint">Reported activity (May 2026): </span>
            {active.activity}
          </p>
        )}

        {active.imageIndices.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-caption text-fg-faint tracking-wide uppercase">Proposed design</span>
            <div className="flex flex-wrap gap-3">
              {active.imageIndices.map((index) => {
                const image = images[index];
                return (
                  <button
                    key={image.src}
                    type="button"
                    data-lightbox-index={index}
                    aria-label={`View larger: ${image.caption}`}
                    className="relative aspect-[4/3] w-40 overflow-hidden border border-hairline bg-surface-sunk focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <Image src={image.src} alt={image.alt} fill sizes="160px" loading="lazy" className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* --- Tap-through card strip: the mobile browse (horizontal snap) and a
              quick nav on desktop. Every point is a full-size tap target. --- */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {points.map((p) => {
          const isActive = p.id === active.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p)}
              aria-pressed={isActive}
              className={cn(
                "flex w-44 shrink-0 snap-start flex-col gap-1 border p-4 text-left transition-colors sm:w-auto sm:flex-1 sm:basis-40",
                isActive ? "border-accent bg-surface-raised" : "border-hairline bg-surface hover:border-fg-muted",
              )}
            >
              <span className="text-caption text-fg-faint tracking-wide uppercase">
                {p.kind === "interchange" ? "Interchange" : p.kind === "boundary" ? "Boundary" : "Endpoint"}
              </span>
              <span className="text-small text-fg">{p.name}</span>
              <span className="figure text-caption text-fg-muted tabular-nums">
                {p.meta}
                {typeof p.percent === "number" ? ` · ${p.percent}%` : ""}
              </span>
            </button>
          );
        })}
      </div>

      <GalleryLightbox images={images} rootId={ROOT_ID} />
    </div>
  );
}
