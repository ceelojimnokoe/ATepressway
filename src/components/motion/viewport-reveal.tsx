"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

interface ViewportRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * The standard once-on-scroll reveal used by the Server Component sections
 * across the site. Wrapping server-rendered content in this stays a leaf
 * Client Component — the section itself is untouched. Content is visible
 * by default (see {@link Reveal}); the entrance is a progressive
 * enhancement that never hides content if JavaScript doesn't run.
 */
export function ViewportReveal({ children, className }: ViewportRevealProps) {
  return (
    <Reveal className={className} distance={12} amount={0.3}>
      {children}
    </Reveal>
  );
}
