"use client";

import { useRef, useState } from "react";
import { animate, useReducedMotion, type AnimationPlaybackControlsWithThen } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { CorridorTrack } from "./corridor-track";
import { ProgressStrip, ScrubReadout } from "./corridor-readout";
import {
  buildSegments,
  buildValueText,
  clampKm,
  findSegmentAt,
  isProgressConfirmed,
  landmarkKms,
  nextLandmark,
  percentToKm,
  previousLandmark,
  unconfirmedInterchangeNames,
} from "./geometry";

const FINE_STEP_KM = 0.2;

interface CorridorProps {
  readonly variant?: "hero" | "full";
  readonly className?: string;
  readonly defaultValueKm?: number;
  readonly onScrub?: (km: number) => void;
}

export function Corridor({
  variant = "full",
  className,
  defaultValueKm = 0,
  onScrub,
}: CorridorProps) {
  const segments = buildSegments();
  const totalKm = segments[segments.length - 1]?.endKm ?? 0;
  const landmarks = landmarkKms(segments);
  const progressConfirmed = isProgressConfirmed();
  const unconfirmedNames = unconfirmedInterchangeNames();

  const [valueKm, setValueKm] = useState(() => clampKm(defaultValueKm, totalKm));
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const controlsRef = useRef<AnimationPlaybackControlsWithThen | null>(null);
  // valueKmRef mirrors the animating/displayed position, updated on every
  // spring frame. targetKmRef mirrors the *intended* destination, updated
  // synchronously the instant a step is requested. These have to be two
  // separate refs: rapid key repeats arrive faster than a single
  // animation frame, so if the next step read valueKmRef (only updated
  // inside onUpdate), every rapid press would compute its target from
  // the same not-yet-advanced position and they'd overwrite each other
  // instead of accumulating. targetKmRef always reflects every step
  // that's been requested, even ones the spring hasn't visually caught
  // up to yet.
  const valueKmRef = useRef(valueKm);
  const targetKmRef = useRef(valueKm);

  const activeSegment = findSegmentAt(valueKm, segments);
  const roundedKm = Math.round(valueKm * 10) / 10;
  const valueText = buildValueText(activeSegment, roundedKm, progressConfirmed);

  function commit(km: number) {
    const clamped = clampKm(km, totalKm);
    valueKmRef.current = clamped;
    setValueKm(clamped);
    onScrub?.(clamped);
  }

  function updateFromClientX(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    controlsRef.current?.stop();
    const km = percentToKm(((clientX - rect.left) / rect.width) * 100, totalKm);
    targetKmRef.current = km;
    commit(km);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    isDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    updateFromClientX(event.clientX);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function animateTo(targetKm: number) {
    controlsRef.current?.stop();
    const clamped = clampKm(targetKm, totalKm);
    targetKmRef.current = clamped;
    if (reducedMotion) {
      commit(clamped);
      return;
    }
    controlsRef.current = animate(valueKmRef.current, clamped, {
      ...spring.drag,
      onUpdate: (latest) => commit(latest),
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // Based on the intended target, not the animating position — see
    // targetKmRef's comment above.
    const base = targetKmRef.current;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        animateTo(event.shiftKey ? nextLandmark(base, landmarks, totalKm) : base + FINE_STEP_KM);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        animateTo(event.shiftKey ? previousLandmark(base, landmarks) : base - FINE_STEP_KM);
        break;
      case "PageUp":
        event.preventDefault();
        animateTo(nextLandmark(base, landmarks, totalKm));
        break;
      case "PageDown":
        event.preventDefault();
        animateTo(previousLandmark(base, landmarks));
        break;
      case "Home":
        event.preventDefault();
        animateTo(0);
        break;
      case "End":
        event.preventDefault();
        animateTo(totalKm);
        break;
      default:
        break;
    }
  }

  const compact = variant === "hero";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <CorridorTrack
        segments={segments}
        totalKm={totalKm}
        valueKm={valueKm}
        roundedValueKm={roundedKm}
        valueText={valueText}
        compact={compact}
        trackRef={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      />

      <ProgressStrip confirmed={progressConfirmed} />

      {!compact && (
        <ScrubReadout
          segment={activeSegment}
          valueKm={valueKm}
          unconfirmedInterchangeNames={unconfirmedNames}
        />
      )}
    </div>
  );
}
