import { cn } from "@/lib/cn";
import type { MonthlyTable as MonthlyTableData } from "@/content/project";

/** A cell reads as a figure (mono + tabular-nums, per the site's numbers
 *  rule) if it contains a digit, or is the source's own "no data" dash —
 *  covers every percentage, count and chainage in these tables without the
 *  component needing to know which column is which. */
function isFigureCell(cell: string): boolean {
  return /\d/.test(cell) || cell === "-";
}

/**
 * One verbatim table from a source document (src/content/project.ts,
 * MonthlyTable) — every row and column exactly as published, inside the
 * same native <details>/<summary> disclosure the FAQ section uses, so it's
 * keyboard-operable and fully readable with no JavaScript. Open by default:
 * nothing is hidden on load, a reader can only choose to collapse it.
 * Horizontally scrollable rather than stacked on narrow screens — a
 * reflowed "card per row" view would change what the table's rows and
 * columns mean, which a literally-verbatim reproduction shouldn't risk.
 */
export function MonthlyTable({ table }: { readonly table: MonthlyTableData }) {
  return (
    <details className="group border border-hairline" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-surface-raised px-4 py-3 text-small font-medium text-fg transition-colors duration-200 ease-out hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        <span>{table.caption}</span>
        <span
          aria-hidden="true"
          className="shrink-0 text-fg-faint transition-transform duration-200 ease-out group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="overflow-x-auto border-t border-hairline">
        <table className="w-full min-w-[640px] border-collapse text-small">
          <caption className="sr-only">{table.caption}</caption>
          <thead>
            <tr className="border-b border-hairline bg-surface-sunk">
              {table.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-2.5 text-left text-caption font-medium tracking-wide text-fg-muted uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-hairline last:border-b-0">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      "px-4 py-2.5 whitespace-nowrap text-fg",
                      isFigureCell(cell) && "figure tabular-nums",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
