import Image from "next/image";
import type { MonthlyUpdate, ProgressHistoryEntry } from "@/content/project";
import { mediaRegistry } from "@/content/media";
import { nextMonthLabel } from "@/lib/format";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { ProgressHistory } from "@/components/progress/progress-history";
import { MonthlyTable } from "@/components/progress/monthly-table";

/**
 * "This month and next" — pulled out of page.tsx on 16 Oct 2026 when this
 * section grew verbatim tables (see content/project.ts, MonthlyUpdate).
 * `update` is always `latestMonthlyUpdate`; kept as a prop rather than
 * importing it directly so the section has no hidden dependency on which
 * entry is "latest" — the caller decides that.
 *
 * `completedHeading`/`plannedHeading` on the update are the source
 * document's own section headings, used verbatim when present; the
 * synthesised "Completed in {month}" / "Planned for {next month}" is the
 * fallback for months with no cited document to quote. Bullet lists stay
 * plain, always-visible lists under real headings — only the tables (the
 * dense, verbatim-reproduced blocks) are individually collapsible, open by
 * default, via MonthlyTable's own <details>.
 */
export function ThisMonthAndNext({
  update,
  history,
}: {
  readonly update: MonthlyUpdate;
  readonly history: readonly ProgressHistoryEntry[];
}) {
  return (
    // id + scroll-mt-24 so the Updates popup's "This month and next" link
    // lands below the sticky header, not underneath it (client
    // instruction, 4 Sept 2026).
    <section id="this-month-and-next" className="scroll-mt-24 border-b border-hairline bg-surface">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-heading-4 text-fg">This month and next</h2>
          {/* "Previous progress" history (client instruction, 20 Sept
              2026): a button opening a dialog, fed by progressHistory —
              derived from the same monthlyUpdates array this section
              reads, so a new month updates both. */}
          <ProgressHistory entries={history} />
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-4">
            <h3 className="text-body text-fg">{update.completedHeading ?? `Completed in ${update.month}`}</h3>
            <ul className="flex flex-col gap-2">
              {update.completed.map((entry) => (
                <li key={entry} className="flex gap-2 text-small text-fg-muted">
                  <span aria-hidden="true" className="text-accent">
                    —
                  </span>
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
            {update.completedTables?.map((table) => <MonthlyTable key={table.id} table={table} />)}
            {update.completedImages && (
              <ul className="mt-1 grid grid-cols-2 gap-3">
                {update.completedImages.map((key) => {
                  const asset = mediaRegistry[key];
                  return (
                    <li
                      key={key}
                      className="relative aspect-[16/10] overflow-hidden border border-hairline bg-surface-sunk"
                    >
                      <Image
                        src={asset.src}
                        alt={asset.alt}
                        fill
                        sizes="(min-width: 1024px) 22vw, 45vw"
                        loading="lazy"
                        className="object-cover"
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <h3 className="text-body text-fg">
              {update.plannedHeading ?? `Planned for ${nextMonthLabel(update.month)}`}
            </h3>
            <ul className="flex flex-col gap-2">
              {update.planned.map((entry) => (
                <li key={entry} className="flex gap-2 text-small text-fg-muted">
                  <span aria-hidden="true" className="text-fg-faint">
                    —
                  </span>
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
            {update.plannedTables?.map((table) => <MonthlyTable key={table.id} table={table} />)}
            {/* "Contractor work plan" subsection and its two work-plan
                sheet images REMOVED from the render (client instruction,
                20 Sept 2026). Deliberately NOT deleted from the data:
                `plannedImages` on the August entry in monthlyUpdates
                (content/project.ts) and the workPlanSep2026PageOne/Two
                entries in the media registry are untouched. The 16 Oct
                2026 "reproduce the document in full" instruction applies
                to the September/October document specifically (see its
                own comment in content/project.ts) and was flagged, not
                assumed to also reverse this separate removal — still
                nothing renders `plannedImages`. */}
          </div>
        </div>
      </ViewportReveal>
    </section>
  );
}
