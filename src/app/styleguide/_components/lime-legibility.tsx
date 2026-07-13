"use client";

import { useEffect, useRef, useState } from "react";
import { contrastRatio, parseRgb } from "../_lib/contrast";

interface Ratios {
  readonly void: number;
  readonly paper: number;
}

export function LimeLegibilityDemo() {
  const voidCardRef = useRef<HTMLDivElement>(null);
  const paperCardRef = useRef<HTMLDivElement>(null);
  const limeOnVoidRef = useRef<HTMLSpanElement>(null);
  const [ratios, setRatios] = useState<Ratios | null>(null);

  useEffect(() => {
    if (!voidCardRef.current || !paperCardRef.current || !limeOnVoidRef.current) return;
    const limeRgb = parseRgb(getComputedStyle(limeOnVoidRef.current).color);
    const voidRgb = parseRgb(getComputedStyle(voidCardRef.current).backgroundColor);
    const paperRgb = parseRgb(getComputedStyle(paperCardRef.current).backgroundColor);
    setRatios({ void: contrastRatio(limeRgb, voidRgb), paper: contrastRatio(limeRgb, paperRgb) });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
      <div ref={voidCardRef} className="flex flex-col items-start gap-3 bg-void p-8">
        <span ref={limeOnVoidRef} className="text-heading-3 text-lime">
          Aa — lime on void
        </span>
        <span className="text-caption text-ink-2">
          {ratios ? `${ratios.void.toFixed(1)}:1 — passes` : "measuring…"}
        </span>
      </div>
      <div ref={paperCardRef} className="flex flex-col items-start gap-3 bg-paper p-8">
        <span className="text-heading-3 text-lime">Aa — lime on paper</span>
        <span className="text-caption text-paper-ink-2">
          {ratios ? `${ratios.paper.toFixed(1)}:1 — fails` : "measuring…"}
        </span>
      </div>
    </div>
  );
}
