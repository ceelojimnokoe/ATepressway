"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { reveal } from "@/lib/motion";
import { ReplayButton } from "../replay-button";

interface RevealDemoProps {
  readonly sampleText: string;
}

export function RevealDemo({ sampleText }: RevealDemoProps) {
  const controls = useAnimation();

  function play() {
    controls.set("hidden");
    controls.start("visible");
  }

  useEffect(() => {
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        variants={reveal}
        initial="hidden"
        animate={controls}
        className="w-fit border border-rule bg-raised px-6 py-4 text-body text-ink-1"
      >
        {sampleText}
      </motion.div>
      <ReplayButton onClick={play} />
    </div>
  );
}
