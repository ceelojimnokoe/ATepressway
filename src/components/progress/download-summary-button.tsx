/**
 * "Download progress summary (PDF)" control, sited next to the overall
 * completion figure.
 *
 * The PDF itself does not exist yet, so this is deliberately inert: no
 * href, no stub route. A stub that 404s or serves an empty file is worse
 * than an honestly unavailable control — it would look like the site is
 * broken. It uses aria-disabled rather than the disabled attribute so the
 * control stays focusable and assistive tech can reach the explanation,
 * which is also visible on screen.
 *
 * To wire it up later: swap the <button> for an <a href="/…/summary.pdf"
 * download>, drop the aria-disabled and the "coming soon" badge, and keep
 * the styling as-is.
 */
export function DownloadSummaryButton() {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-disabled="true"
        aria-describedby="progress-pdf-note"
        className="inline-flex w-fit cursor-not-allowed items-center gap-3 border border-rule bg-transparent px-5 py-3 text-caption tracking-wide text-ink-3 uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
      >
        <span aria-hidden="true">↓</span>
        <span>Download progress summary (PDF)</span>
        <span className="border border-rule px-2 py-0.5 text-ink-3">Coming soon</span>
      </button>
      <p id="progress-pdf-note" className="max-w-md text-caption text-ink-3">
        The downloadable summary is being prepared and will be published here once the report is
        cleared for release.
      </p>
    </div>
  );
}
