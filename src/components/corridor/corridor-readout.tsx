import { Figure } from "@/components/ui/figure";
import type { CorridorSegment } from "./geometry";

interface ProgressStripProps {
  readonly confirmed: boolean;
}

/**
 * The single most important thing a stakeholder needs to see, sitting
 * directly under the track it qualifies — not a footnote. Deliberately
 * not caption/ink-3 (our own "quiet" treatment); this is text-small/ink-2
 * in a bordered strip so it reads with real presence.
 */
export function ProgressStrip({ confirmed }: ProgressStripProps) {
  if (confirmed) return null;

  return (
    <div className="border-l-2 border-hairline bg-surface-raised px-4 py-3 text-small text-fg-muted">
      Construction progress — pending confirmation.
    </div>
  );
}

interface ScrubReadoutProps {
  readonly segment: CorridorSegment;
  readonly valueKm: number;
  readonly unconfirmedInterchangeNames: readonly string[];
}

export function ScrubReadout({ segment, valueKm, unconfirmedInterchangeNames }: ScrubReadoutProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <Figure value={valueKm.toFixed(1)} signal className="text-heading-3" />
        <span className="text-small text-fg-muted">km</span>
      </div>
      <p className="text-body text-fg">
        {segment.section.name} · {segment.section.road} · {segment.section.lengthKm} km
      </p>
      <p className="text-small text-fg-muted">
        {segment.displayFrom} → {segment.displayTo}
      </p>
      {unconfirmedInterchangeNames.length > 0 && (
        <p className="text-caption text-fg-faint">
          Interchanges: {unconfirmedInterchangeNames.join(", ")} — positions to be confirmed.
        </p>
      )}
    </div>
  );
}
