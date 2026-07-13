"use client";

import { motion } from "motion/react";
import { barFill, viewport } from "@/lib/motion";
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
    return <div className="h-full w-full bg-rule" />;
  }

  return (
    <div className="h-full w-full bg-rule">
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
        <span className="text-caption text-ink-2">{first?.displayFrom}</span>
        <span className="text-caption text-ink-2">{last?.displayTo}</span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          "relative flex w-full touch-none select-none bg-rule",
          compact ? "h-2" : "h-3",
        )}
      >
        {segments.map((segment, index) => (
          <div
            key={segment.section.id}
            style={{ flexGrow: segment.section.lengthKm, flexBasis: 0 }}
            className={cn("relative h-full", index > 0 && "border-l border-void")}
          >
            <SegmentFill segment={segment} />
          </div>
        ))}

        <div
          role="slider"
          tabIndex={0}
          aria-label="Corridor position"
          aria-valuemin={0}
          aria-valuemax={totalKm}
          aria-valuenow={roundedValueKm}
          aria-valuetext={valueText}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center focus:outline-none active:cursor-grabbing"
          style={{ left: `${percent}%` }}
        >
          <div
            className={cn(
              "w-1 bg-lime focus-visible:ring-2 focus-visible:ring-lime",
              compact ? "h-4" : "h-6",
            )}
          />
        </div>
      </div>

      {!compact && (
        <div className="flex text-caption text-ink-3">
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
