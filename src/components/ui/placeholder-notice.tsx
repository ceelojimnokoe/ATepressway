import type { ReactNode } from "react";
import { isPlaceholder, type Placeholder } from "@/content/placeholder";

interface PlaceholderNoticeProps<T> {
  readonly value: T | Placeholder<T>;
  readonly children: (value: T) => ReactNode;
  /**
   * "chip" (default): the small inline TBC label used for incidental
   * facts (a contact email, a photo credit). "display": a headline-scale
   * dash occupying roughly the footprint the real figure would — for the
   * rare case where the missing fact IS the headline, and shrinking its
   * placeholder to a footnote-sized chip would misrepresent how
   * important that absence is.
   */
  readonly size?: "chip" | "display";
}

/**
 * The one place isPlaceholder() gets checked and turned into a visible
 * "to be confirmed" state. Any component rendering a value that might be
 * unresolved should route through this rather than checking inline.
 */
export function PlaceholderNotice<T>({ value, children, size = "chip" }: PlaceholderNoticeProps<T>) {
  if (isPlaceholder(value)) {
    if (size === "display") {
      return (
        <div className="flex flex-col items-start gap-2 border border-dashed border-hairline bg-surface-raised px-6 py-8 sm:py-10">
          <span aria-hidden="true" className="figure text-heading-1 text-fg-faint">
            —
          </span>
          <span className="text-small text-fg-faint uppercase tracking-wide">
            {value.label} · to be confirmed
          </span>
        </div>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 border border-dashed border-hairline bg-surface-raised px-3 py-1.5 text-caption text-fg-faint uppercase tracking-wide">
        <span aria-hidden="true">—</span>
        {value.label} · to be confirmed
      </span>
    );
  }
  return <>{children(value)}</>;
}
