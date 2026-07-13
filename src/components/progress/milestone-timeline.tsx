import { projectFacts } from "@/content/project";
import { Figure } from "@/components/ui/figure";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { cn } from "@/lib/cn";

type MilestoneState = "completed" | "active" | "upcoming";

interface Milestone {
  readonly year: number;
  readonly label: string;
  readonly state: MilestoneState;
}

/**
 * "Active" marks the phase we're currently in, not just whichever event
 * date has passed — the reconstruction-commenced milestone stays
 * "active" (not "completed") for the whole 36-month window, since that's
 * the useful answer to "where are we," computed against the real server
 * clock at request time.
 */
function buildMilestones(): readonly Milestone[] {
  const now = new Date();
  const startDate = new Date(projectFacts.reconstructionStartYear, 0, 1);
  const targetDate = new Date(startDate);
  targetDate.setMonth(targetDate.getMonth() + projectFacts.constructionWindowMonths);

  const reconstructionState: MilestoneState =
    now < startDate ? "upcoming" : now < targetDate ? "active" : "completed";
  const targetState: MilestoneState = now < targetDate ? "upcoming" : "completed";

  return [
    {
      year: projectFacts.openedYear,
      label: `Opened under ${projectFacts.openedUnder}`,
      state: "completed",
    },
    {
      year: projectFacts.reconstructionStartYear,
      label: "Reconstruction commenced",
      state: reconstructionState,
    },
    {
      year: targetDate.getFullYear(),
      label: `Target completion — ${projectFacts.constructionWindowMonths}-month window from commencement`,
      state: targetState,
    },
  ];
}

export function MilestoneTimeline() {
  const milestones = buildMilestones();

  return (
    <section className="border-b border-rule">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Milestone timeline</h2>

        <ol className="flex flex-col">
          {milestones.map((milestone, index) => (
            <li key={milestone.year} className="relative flex gap-4 pb-10 last:pb-0">
              {index < milestones.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-3 left-[5px] h-full w-px",
                    milestone.state === "upcoming" ? "bg-rule" : "bg-ink-2",
                  )}
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                  milestone.state === "active" && "bg-lime",
                  milestone.state === "completed" && "bg-ink-1",
                  milestone.state === "upcoming" && "border border-rule bg-void",
                )}
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <Figure value={milestone.year} className="text-heading-3" />
                  {milestone.state === "active" && (
                    <span className="text-caption text-lime tracking-wide uppercase">Active</span>
                  )}
                </div>
                <span className="text-body text-ink-1">{milestone.label}</span>
              </div>
            </li>
          ))}
        </ol>
      </ViewportReveal>
    </section>
  );
}
