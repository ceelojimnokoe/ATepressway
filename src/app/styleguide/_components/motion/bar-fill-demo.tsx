"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { barFill } from "@/lib/motion";
import { ReplayButton } from "../replay-button";

const DEMO_VALUE = 0.62;

export function BarFillDemo() {
  const controls = useAnimation();

  function play() {
    controls.set(barFill.hidden);
    controls.start(barFill.visible(DEMO_VALUE));
  }

  useEffect(() => {
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="h-3 w-full max-w-md overflow-hidden bg-raised">
        <motion.div
          initial={barFill.hidden}
          animate={controls}
          className="h-full w-full origin-left bg-lime"
        />
      </div>
      <span className="text-caption text-ink-3">
        Illustrative fill — mechanism only, not a real progress figure.
      </span>
      <ReplayButton onClick={play} />
    </div>
  );
}
