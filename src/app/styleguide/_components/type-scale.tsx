"use client";

import { useEffect, useRef, useState } from "react";

export interface TypeScaleStep {
  readonly token: string;
  readonly className: string;
  readonly sample: string;
}

interface Measured {
  readonly fontFamily: string;
  readonly fontSize: string;
  readonly fontWeight: string;
  readonly lineHeight: string;
}

function TypeScaleRow({ step }: { step: TypeScaleStep }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [measured, setMeasured] = useState<Measured | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const style = getComputedStyle(ref.current);
    setMeasured({
      fontFamily: style.fontFamily.split(",")[0]?.replace(/["']/g, "") ?? "",
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
    });
  }, []);

  return (
    <div className="flex flex-col gap-3 border-b border-rule py-6 last:border-b-0">
      <p ref={ref} className={`${step.className} font-normal text-ink-1`}>
        {step.sample}
      </p>
      <p className="figure text-caption text-ink-3">
        {step.token} · {measured ? measured.fontFamily : "—"} · {measured ? measured.fontSize : "—"} ·{" "}
        {measured ? `weight ${measured.fontWeight}` : "—"} ·{" "}
        {measured ? `line-height ${measured.lineHeight}` : "—"}
      </p>
    </div>
  );
}

export function TypeScale({ steps }: { steps: readonly TypeScaleStep[] }) {
  return (
    <div className="flex flex-col">
      {steps.map((step) => (
        <TypeScaleRow key={step.token} step={step} />
      ))}
    </div>
  );
}
