import {
  sections,
  interchanges,
  progress,
  projectFacts,
  isPlaceholder,
  type ProjectSection,
  type Interchange,
} from "@/content/project";

/**
 * Display order, left to right: Neoplan Junction side to Tema Roundabout
 * side (confirmed with the client — Tema is east, and this puts S1, the
 * only section under active construction, at the right where the eye
 * lands).
 *
 * This is NOT the content array order (s1, s2, s3). S1 and S2 both
 * originate at Tetteh Quarshie — it's an interior junction, not a
 * chained endpoint — so the real single-line geography is:
 *
 *   Neoplan – [S3, 2.5km] – Apenkwa – [S2, 5.7km] – Tetteh Quarshie – [S1, 19.5km] – Tema
 *
 * Section numbers therefore read 3, 2, 1 left to right. That's correct,
 * not a bug — which is why nothing in this module (or Corridor.tsx)
 * surfaces `section.label` as a standalone ordinal. Sections are always
 * identified by name + road.
 */
export const DISPLAY_ORDER: readonly ProjectSection["id"][] = ["s3", "s2", "s1"];

/**
 * Whether a section's stored from/to already matches left-to-right
 * display traversal. S3 and S2 are stored in the opposite direction from
 * how they're drawn; S1 happens to match. See DISPLAY_ORDER above.
 */
const FORWARD_IN_DISPLAY: Readonly<Record<ProjectSection["id"], boolean>> = {
  s3: false,
  s2: false,
  s1: true,
};

export interface CorridorSegment {
  readonly section: ProjectSection;
  readonly startKm: number;
  readonly endKm: number;
  readonly displayFrom: string;
  readonly displayTo: string;
  readonly forward: boolean;
}

export function buildSegments(): readonly CorridorSegment[] {
  const byId = new Map(sections.map((section) => [section.id, section]));
  let cursor = 0;
  const built = DISPLAY_ORDER.map((id) => {
    const section = byId.get(id);
    if (!section) {
      throw new Error(`Corridor geometry: content is missing section "${id}"`);
    }
    const startKm = cursor;
    const endKm = cursor + section.lengthKm;
    cursor = endKm;
    const forward = FORWARD_IN_DISPLAY[id];
    return {
      section,
      startKm,
      endKm,
      displayFrom: forward ? section.from : section.to,
      displayTo: forward ? section.to : section.from,
      forward,
    };
  });

  const total = built[built.length - 1]?.endKm ?? 0;
  if (Math.abs(total - projectFacts.corridorLengthKm) > 1e-6) {
    throw new Error(
      `Corridor geometry: section lengths sum to ${total}km, but projectFacts.corridorLengthKm is ${projectFacts.corridorLengthKm}km. Content has drifted out of sync.`,
    );
  }

  return built;
}

const EPSILON = 1e-6;

export function clampKm(km: number, totalKm: number): number {
  return Math.min(Math.max(km, 0), totalKm);
}

export function kmToPercent(km: number, totalKm: number): number {
  return (clampKm(km, totalKm) / totalKm) * 100;
}

export function percentToKm(percent: number, totalKm: number): number {
  return clampKm((percent / 100) * totalKm, totalKm);
}

export function findSegmentAt(
  km: number,
  segments: readonly CorridorSegment[],
): CorridorSegment {
  const match = segments.find((segment) => km < segment.endKm - EPSILON);
  return match ?? segments[segments.length - 1];
}

/** Section boundaries a keyboard user can jump to with Shift+Arrow / Page Up/Down. */
export function landmarkKms(segments: readonly CorridorSegment[]): readonly number[] {
  return segments.slice(1).map((segment) => segment.startKm);
}

export function nextLandmark(km: number, landmarks: readonly number[], totalKm: number): number {
  return landmarks.find((mark) => mark > km + EPSILON) ?? totalKm;
}

export function previousLandmark(km: number, landmarks: readonly number[]): number {
  const reversed = [...landmarks].reverse();
  return reversed.find((mark) => mark < km - EPSILON) ?? 0;
}

/**
 * Fill always renders left to right, matching the corridor's own reading
 * direction, regardless of a section's stored from/to. progress.sections
 * (once resolved) gives one aggregate percentComplete per section, not
 * which end construction started from — we don't have that data, so a
 * single consistent fill direction is the honest choice, not a claim
 * about real build sequencing.
 */
export function sectionFillFraction(sectionId: ProjectSection["id"]): number | null {
  if (isPlaceholder(progress.sections)) return null;
  const match = progress.sections.find((entry) => entry.sectionId === sectionId);
  return match ? match.percentComplete / 100 : null;
}

export function isProgressConfirmed(): boolean {
  return !isPlaceholder(progress.sections);
}

export interface InterchangeTick {
  readonly interchange: Interchange;
  readonly km: number;
}

/**
 * Only interchanges with a resolved (non-placeholder) position get
 * plotted. Positions are placeholder for all five today, so this
 * returns an empty list — see unconfirmedInterchangeNames() for the
 * honest alternative used while that's true.
 */
export function confirmedInterchangeTicks(
  segments: readonly CorridorSegment[],
): readonly InterchangeTick[] {
  const ticks: InterchangeTick[] = [];
  for (const interchange of interchanges) {
    if (isPlaceholder(interchange.position)) continue;
    const position = interchange.position;
    const segment = segments.find((s) => s.section.id === position.sectionId);
    if (!segment) continue;
    const km = segment.forward
      ? segment.startKm + position.offsetKm
      : segment.endKm - position.offsetKm;
    ticks.push({ interchange, km });
  }
  return ticks;
}

export function unconfirmedInterchangeNames(): readonly string[] {
  return interchanges.filter((i) => isPlaceholder(i.position)).map((i) => i.name);
}

/**
 * aria-valuetext and the visual readout say the same thing, deliberately
 * without section.label — see DISPLAY_ORDER's comment on why ordinals
 * never surface here.
 */
export function buildValueText(segment: CorridorSegment, km: number, progressConfirmed: boolean): string {
  const distance = `${km.toFixed(1)} kilometres`;
  const location = `${segment.section.name}, ${segment.section.road}, ${segment.displayFrom} to ${segment.displayTo}`;
  const status = progressConfirmed ? "" : ", construction progress pending confirmation";
  return `${distance} — ${location}${status}`;
}
