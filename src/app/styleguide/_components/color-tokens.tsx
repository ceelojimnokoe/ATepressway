"use client";

import { useEffect, useRef, useState } from "react";
import { contrastRatio, parseRgb, rgbToHex } from "../_lib/contrast";

interface ColorToken {
  readonly variable: string;
  readonly label: string;
  readonly swatchClassName: string;
}

const COLOR_TOKENS: readonly ColorToken[] = [
  { variable: "--color-void", label: "Void", swatchClassName: "bg-void" },
  { variable: "--color-raised", label: "Raised", swatchClassName: "bg-raised" },
  { variable: "--color-sunk", label: "Sunk", swatchClassName: "bg-sunk" },
  { variable: "--color-rule", label: "Rule", swatchClassName: "bg-rule" },
  { variable: "--color-paper", label: "Paper", swatchClassName: "bg-paper" },
  { variable: "--color-paper-raised", label: "Paper raised", swatchClassName: "bg-paper-raised" },
  { variable: "--color-paper-sunk", label: "Paper sunk", swatchClassName: "bg-paper-sunk" },
  { variable: "--color-paper-rule", label: "Paper rule", swatchClassName: "bg-paper-rule" },
  { variable: "--color-ink-1", label: "Ink 1", swatchClassName: "bg-ink-1" },
  { variable: "--color-ink-2", label: "Ink 2", swatchClassName: "bg-ink-2" },
  { variable: "--color-ink-3", label: "Ink 3", swatchClassName: "bg-ink-3" },
  { variable: "--color-paper-ink-1", label: "Paper ink 1", swatchClassName: "bg-paper-ink-1" },
  { variable: "--color-paper-ink-2", label: "Paper ink 2", swatchClassName: "bg-paper-ink-2" },
  { variable: "--color-paper-ink-3", label: "Paper ink 3", swatchClassName: "bg-paper-ink-3" },
  { variable: "--color-lime", label: "Lime", swatchClassName: "bg-lime" },
  { variable: "--color-signal-ink", label: "Signal ink", swatchClassName: "bg-signal-ink" },
];

interface Measured {
  readonly hex: string;
  readonly ratioVsVoid: number;
}

export function ColorTokens() {
  const [measurements, setMeasurements] = useState<Record<string, Measured>>({});
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const voidRgb = parseRgb(getComputedStyle(document.documentElement).getPropertyValue("--color-void"));
    const next: Record<string, Measured> = {};
    for (const token of COLOR_TOKENS) {
      const el = refs.current[token.variable];
      if (!el) continue;
      const rgb = parseRgb(getComputedStyle(el).backgroundColor);
      next[token.variable] = { hex: rgbToHex(rgb), ratioVsVoid: contrastRatio(rgb, voidRgb) };
    }
    setMeasurements(next);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-4">
      {COLOR_TOKENS.map((token) => {
        const measured = measurements[token.variable];
        return (
          <div key={token.variable} className="flex flex-col bg-void">
            <div
              ref={(el) => {
                refs.current[token.variable] = el;
              }}
              className={`h-20 ${token.swatchClassName}`}
            />
            <div className="flex flex-col gap-1 p-3">
              <span className="text-small text-ink-1">{token.label}</span>
              <span className="figure text-caption text-ink-2">{token.variable}</span>
              <span className="figure text-caption text-ink-3">{measured ? measured.hex : "—"}</span>
              <span className="figure text-caption text-ink-3">
                {measured ? `${measured.ratioVsVoid.toFixed(1)}:1 vs void` : "—"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
