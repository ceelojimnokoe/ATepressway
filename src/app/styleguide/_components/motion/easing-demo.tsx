"use client";

import { useRef } from "react";
import { motion, useAnimation, type LegacyAnimationControls } from "motion/react";
import { duration, easing, type EasingCurve } from "@/lib/motion";
import { ReplayButton } from "../replay-button";

interface Curve {
  readonly name: string;
  readonly value: EasingCurve;
  readonly trackRef: React.RefObject<HTMLDivElement | null>;
  readonly controls: LegacyAnimationControls;
}

export function EasingCompareDemo() {
  const standardRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);
  const standardControls = useAnimation();
  const outControls = useAnimation();
  const inControls = useAnimation();

  const curves: readonly Curve[] = [
    { name: "standard", value: easing.standard, trackRef: standardRef, controls: standardControls },
    { name: "out", value: easing.out, trackRef: outRef, controls: outControls },
    { name: "in", value: easing.in, trackRef: inRef, controls: inControls },
  ];

  function play() {
    for (const curve of curves) {
      const distance = curve.trackRef.current ? curve.trackRef.current.clientWidth - 24 : 0;
      curve.controls.set({ x: 0 });
      curve.controls.start({
        x: distance,
        transition: { duration: duration.slow, ease: curve.value },
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {curves.map((curve) => (
        <div key={curve.name} className="flex flex-col gap-2">
          <span className="figure text-caption text-ink-3">
            {curve.name} · cubic-bezier({curve.value.join(", ")})
          </span>
          <div ref={curve.trackRef} className="relative h-6 w-full max-w-md border-b border-rule">
            <motion.div
              animate={curve.controls}
              className="absolute top-0 left-0 h-6 w-6 rounded-full bg-lime"
            />
          </div>
        </div>
      ))}
      <ReplayButton onClick={play} />
    </div>
  );
}
