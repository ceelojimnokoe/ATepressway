import { projectFacts, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { formatLongDate } from "@/lib/format";
import { cn } from "@/lib/cn";

type MilestoneState = "completed" | "active" | "upcoming";

interface Milestone {
  readonly date: string;
  readonly label: string;
  readonly detail?: string;
  readonly state: MilestoneState;
}

/**
 * The real reconstruction timeline from the MPR: award → commencement →
 * the current 46% reporting point → scheduled completion. The current
 * point (the latest MPR) is the one "active" node; award and commencement
 * are past, completion is ahead. The 1964 opening lives on /project — this
 * timeline is the reconstruction only.
 */
function buildMilestones(): readonly Milestone[] {
  const asOf = isPlaceholder(progress.asOf) ? null : progress.asOf;
  const pct = isPlaceholder(progress.overallPercentComplete)
    ? null
    : progress.overallPercentComplete;

  return [
    {
      date: formatLongDate(projectFacts.contractAwardDate),
      label: "Contract awarded",
      state: "completed",
    },
    {
      date: formatLongDate(projectFacts.commencementDate),
      // "EPC Commences" (client instruction, 3 Sept 2026) — was "Construction
      // commenced"; same change applied to the Home page's corridor timeline.
      label: "EPC Commences",
      detail: `${projectFacts.constructionWindowMonths}-month window begins`,
      state: "completed",
    },
    {
      date: asOf ?? "—",
      label: pct !== null ? `${pct}% complete` : "Current status",
      detail: `Latest ${progress.reportSeries}`,
      state: "active",
    },
    {
      date: formatLongDate(projectFacts.scheduledCompletionDate),
      label: "Scheduled completion",
      state: "upcoming",
    },
  ];
}

export function MilestoneTimeline() {
  const milestones = buildMilestones();

  return (
    <section className="border-b border-hairline bg-surface-raised">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-fg">Milestone timeline</h2>

        <ol className="flex flex-col">
          {milestones.map((milestone, index) => (
            <li key={milestone.label} className="relative flex gap-4 pb-10 last:pb-0">
              {index < milestones.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-3 left-[5px] h-full w-px",
                    milestone.state === "upcoming" ? "bg-hairline" : "bg-fg-muted",
                  )}
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                  milestone.state === "active" && "border border-accent bg-lime",
                  milestone.state === "completed" && "bg-fg",
                  milestone.state === "upcoming" && "border border-hairline bg-surface",
                )}
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="figure text-small text-fg-muted">{milestone.date}</span>
                  {milestone.state === "active" && (
                    <span className="text-caption text-accent tracking-wide uppercase">Current</span>
                  )}
                </div>
                <span className="text-body text-fg">{milestone.label}</span>
                {milestone.detail && <span className="text-caption text-fg-faint">{milestone.detail}</span>}
              </div>
            </li>
          ))}
        </ol>
      </ViewportReveal>
    </section>
  );
}
