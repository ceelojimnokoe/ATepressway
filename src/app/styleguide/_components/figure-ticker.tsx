"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion, type AnimationPlaybackControlsWithThen } from "motion/react";
import { duration, easing } from "@/lib/motion";
import { ReplayButton } from "./replay-button";

const TARGET = 46;

export function FigureTicker() {
  const valueRef = useRef<HTMLSpanElement>(null);
  const controlsRef = useRef<AnimationPlaybackControlsWithThen | null>(null);
  const reducedMotion = useReducedMotion();

  function play() {
    controlsRef.current?.stop();
    const el = valueRef.current;
    if (!el) return;

    if (reducedMotion) {
      el.textContent = String(TARGET);
      return;
    }

    el.textContent = "0";
    controlsRef.current = animate(0, TARGET, {
      duration: duration.slow,
      ease: easing.standard,
      onUpdate: (latest) => {
        if (el) el.textContent = String(Math.round(latest));
      },
    });
  }

  useEffect(() => {
    play();
    return () => controlsRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-start gap-4">
      <span ref={valueRef} className="figure text-figure text-lime" aria-live="polite">
        0
      </span>
      <ReplayButton onClick={play} label="Replay count" />
    </div>
  );
}
