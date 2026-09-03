import { bulletins } from "@/content/project";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

/**
 * "No bulletins published yet" (zero entries) and "to be confirmed" (an
 * unresolved fact) are different claims — this only ever renders the
 * former, since bulletins is a real array, never a placeholder. See
 * project.ts.
 */
export function BulletinFeed() {
  const newestFirst = [...bulletins].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="bg-surface-sunk">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-2">
          {/* Label only — "Newsletters" per client instruction (2 Sept
              2026). The underlying data (bulletins, Bulletin, BulletinFeed)
              is unchanged; only the visible text differs. */}
          <h2 className="text-heading-4 text-fg">Newsletters</h2>
          <p className="text-small text-fg-muted">Notices between monthly reports.</p>
        </div>

        {newestFirst.length === 0 ? (
          <p className="text-small text-fg-muted">No newsletters published yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
            {newestFirst.map((bulletin) => (
              <li key={bulletin.href} className="flex flex-col gap-2 py-6">
                <span className="text-caption text-fg-faint tracking-wide uppercase">{bulletin.date}</span>
                <p className="text-body text-fg">{bulletin.headline}</p>
                <p className="text-small text-fg-muted">{bulletin.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </ViewportReveal>
    </section>
  );
}
