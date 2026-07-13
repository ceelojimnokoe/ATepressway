"use client";

import { useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import { spring } from "@/lib/motion";
import { ReplayButton } from "../replay-button";

export function SpringPressDemo() {
  const controls = useAnimation();

  async function play() {
    await controls.start({ scale: 0.92, transition: spring.press });
    controls.start({ scale: 1, transition: spring.press });
  }

  return (
    <div className="flex items-center gap-6">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92, transition: spring.press }}
        animate={controls}
        onClick={play}
        className="border border-rule bg-raised px-6 py-3 text-body text-ink-1"
      >
        Press me
      </motion.button>
      <ReplayButton onClick={play} label="Replay press" />
    </div>
  );
}

export function SpringDragDemo() {
  const controls = useAnimation();
  const constraintsRef = useRef<HTMLDivElement>(null);

  function snapBack() {
    controls.start({ x: 0, transition: spring.drag });
  }

  function replay() {
    controls.set({ x: 96 });
    controls.start({ x: 0, transition: spring.drag });
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={constraintsRef} className="h-16 w-full max-w-md border border-rule bg-raised">
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          onDragEnd={snapBack}
          animate={controls}
          className="h-16 w-16 bg-lime"
        />
      </div>
      <ReplayButton onClick={replay} label="Replay drag" />
    </div>
  );
}

export function SpringToggleDemo() {
  const [on, setOn] = useState(false);

  function replay() {
    setOn(false);
    requestAnimationFrame(() => setOn(true));
  }

  return (
    <div className="flex items-center gap-6">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((value) => !value)}
        className="h-8 w-14 border border-rule bg-raised p-1"
      >
        <motion.span
          className="block h-6 w-6 bg-lime"
          animate={{ x: on ? 24 : 0 }}
          transition={spring.toggle}
        />
      </button>
      <ReplayButton onClick={replay} label="Replay toggle" />
    </div>
  );
}
