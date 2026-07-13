"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { reveal, staggerContainer } from "@/lib/motion";
import { ReplayButton } from "../replay-button";

interface StaggerDemoProps {
  readonly items: readonly string[];
}

export function StaggerDemo({ items }: StaggerDemoProps) {
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
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="flex flex-col gap-2"
      >
        {items.map((item) => (
          <motion.li
            key={item}
            variants={reveal}
            className="border border-rule bg-raised px-4 py-2 text-small text-ink-1"
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>
      <ReplayButton onClick={play} />
    </div>
  );
}
