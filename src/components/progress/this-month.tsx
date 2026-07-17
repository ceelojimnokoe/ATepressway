import { latestMonthlyUpdate } from "@/content/project";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { Figure } from "@/components/ui/figure";
import { nextMonthLabel } from "@/lib/format";

function firstWord(text: string): string {
  return text.split(" ")[0];
}

function Column({ heading, items }: { readonly heading: string; readonly items: readonly string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-caption text-ink-3 tracking-wide uppercase">{heading}</h3>
      {items.length === 0 ? (
        <div className="border border-dashed border-rule bg-raised px-4 py-6 text-small text-ink-3">
          Added from each Monthly Progress Report.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-small text-ink-1">
              <span aria-hidden="true" className="text-ink-3">
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * The rolling "this month" summary: what was completed, what's planned
 * next. Reads the newest entry of monthlyUpdates — adding a month is a
 * single content edit. Narrative bullets are the client's to supply from
 * each MPR; until then each column shows an honest "to be added" state
 * rather than an invented summary.
 */
export function ThisMonth() {
  if (!latestMonthlyUpdate) return null;
  const { month, completed, planned, overallPct } = latestMonthlyUpdate;

  return (
    <section className="border-b border-rule bg-void">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-4 text-ink-1">This month</h2>
          <span className="text-small text-ink-2">
            {month} · <Figure value={`${overallPct}%`} /> overall
          </span>
        </div>

        <div className="grid gap-8 border-t border-rule pt-8 sm:grid-cols-2">
          <Column heading={`Completed in ${firstWord(month)}`} items={completed} />
          <Column heading={`Planned for ${firstWord(nextMonthLabel(month))}`} items={planned} />
        </div>
      </ViewportReveal>
    </section>
  );
}
