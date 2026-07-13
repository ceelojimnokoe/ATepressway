import { cn } from "@/lib/cn";

interface FigureProps {
  readonly value: string | number;
  readonly signal?: boolean;
  readonly className?: string;
}

/** Mono + tabular-nums number display. Every number on the site renders through this. */
export function Figure({ value, signal = false, className }: FigureProps) {
  return (
    <span className={cn("figure", signal ? "text-lime" : "text-ink-1", className)}>{value}</span>
  );
}
