"use client";

import { motion } from "motion/react";
import { barFill, trackDraw, viewport } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { kmToPercent, sectionFillFraction, type CorridorSegment } from "./geometry";

interface SegmentFillProps {
  readonly segment: CorridorSegment;
}

function SegmentFill({ segment }: SegmentFillProps) {
  const fraction = sectionFillFraction(segment.section.id);

  if (fraction === null) {
    // Unconfirmed: render the muted "upcoming" treatment only. No lime,
    // no guessed percentage — see corridor-readout.tsx for the explicit
    // "pending confirmation" disclosure that pairs with this.
    return <div className="h-full w-full bg-hairline" />;
  }

  return (
    <div data-theme="dark" className="h-full w-full bg-surface-sunk">
      <motion.div
        initial={barFill.hidden}
        whileInView={barFill.visible(fraction)}
        viewport={viewport}
        className="h-full w-full origin-left bg-lime"
      />
    </div>
  );
}

interface CorridorTrackProps {
  readonly segments: readonly CorridorSegment[];
  readonly totalKm: number;
  readonly valueKm: number;
  readonly roundedValueKm: number;
  readonly valueText: string;
  readonly compact?: boolean;
  readonly trackRef: React.RefObject<HTMLDivElement | null>;
  readonly onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  readonly onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  readonly onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export function CorridorTrack({
  segments,
  totalKm,
  valueKm,
  roundedValueKm,
  valueText,
  compact = false,
  trackRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: CorridorTrackProps) {
  const percent = kmToPercent(valueKm, totalKm);
  const first = segments[0];
  const last = segments[segments.length - 1];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-caption text-fg-muted">{first?.displayFrom}</span>
        <span className="text-caption text-fg-muted">{last?.displayTo}</span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn("relative w-full touch-none select-none", compact ? "h-2" : "h-3")}
      >
        {/*
          Visual track only — scaleX draws in left-to-right once, on
          scroll. Segments reveal in sequence as a side effect of the
          sweep (they're laid out left-to-right inside it), so no
          separate per-segment stagger is needed. Kept as a distinct
          layer from trackRef so the scaleX transform never stretches
          the handle, which is a sibling, not a child, of this element.
        */}
        <motion.div
          initial={trackDraw.hidden}
          whileInView={trackDraw.visible}
          viewport={viewport}
          className="absolute inset-0 flex origin-left bg-hairline"
        >
          {segments.map((segment, index) => (
            <div
              key={segment.section.id}
              style={{ flexGrow: segment.section.lengthKm, flexBasis: 0 }}
              className={cn("relative h-full", index > 0 && "border-l border-hairline")}
            >
              <SegmentFill segment={segment} />
            </div>
          ))}
        </motion.div>

        {/*
          Positioning layer spans the full track, so translateX(percent%)
          moves the handle by percent% of the *track* width — the position
          animates on the compositor (transform), never `left` (which would
          trigger layout each spring frame during keyboard scrubbing). The
          layer is pointer-transparent so track drags pass through to the
          parent; the handle re-enables pointer events for itself.
        */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full">
          <div className="absolute inset-y-0 left-0 w-full" style={{ transform: `translateX(${percent}%)` }}>
            <div
              role="slider"
              tabIndex={0}
              aria-label="Corridor position"
              aria-valuemin={0}
              aria-valuemax={totalKm}
              aria-valuenow={roundedValueKm}
              aria-valuetext={valueText}
              onKeyDown={onKeyDown}
              className="group pointer-events-auto absolute top-1/2 left-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center focus:outline-none active:cursor-grabbing"
            >
              <div
                className={cn(
                  "rounded-full border-2 border-accent bg-surface",
                  "group-hover:bg-lime group-active:bg-lime",
                  "group-focus-visible:bg-lime group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-void",
                  compact ? "h-4 w-4" : "h-5 w-5",
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="flex text-caption text-fg-faint">
          {segments.map((segment) => (
            <span
              key={segment.section.id}
              style={{ flexGrow: segment.section.lengthKm, flexBasis: 0 }}
              className="hidden text-center sm:block"
            >
              {segment.section.road}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
