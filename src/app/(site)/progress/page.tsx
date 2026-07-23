import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { AnimatedProgressBar } from "@/components/ui/animated-progress-bar";
import { MilestoneTimeline } from "@/components/progress/milestone-timeline";
import { BulletinFeed } from "@/components/progress/bulletin-feed";
import { DownloadSummaryButton } from "@/components/progress/download-summary-button";
import { projectFacts, progress, interchanges } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import {
  REPORT_LABEL,
  earthworks,
  concreteWorks,
  drainage,
  footbridges,
  recentActivity,
  considerations,
  type Quantity,
} from "@/content/report";
import { formatLongDate, formatThousands } from "@/lib/format";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.progress);

const overallPct = isPlaceholder(progress.overallPercentComplete) ? 46 : progress.overallPercentComplete;
const workPackages = isPlaceholder(progress.workPackages) ? [] : progress.workPackages;

const statusFacts = [
  { label: "Awarded", value: formatLongDate(projectFacts.contractAwardDate) },
  { label: "Construction commenced", value: formatLongDate(projectFacts.commencementDate) },
  { label: "Scheduled completion", value: formatLongDate(projectFacts.scheduledCompletionDate) },
  { label: "Contract duration", value: `${formatThousands(projectFacts.contractDurationDays)} days` },
  { label: "Equipment on site", value: formatThousands(projectFacts.equipmentOnSite) },
  { label: "Contract variation", value: projectFacts.variationAsOfMay2026 },
] as const;

function QuantityList({ items }: { readonly items: readonly Quantity[] }) {
  return (
    <ul className="flex flex-col divide-y divide-rule border-t border-b border-rule">
      {items.map((q) => (
        <li key={q.label} className="flex items-baseline justify-between gap-4 py-3">
          <span className="text-small text-ink-2">{q.label}</span>
          <span className="figure shrink-0 text-body text-ink-1">
            {formatThousands(q.value)} <span className="text-small text-ink-3">{q.unit}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ProgressPage() {
  return (
    <>
      <PageHero
        media="bridgeDeckPour"
        title="Construction Progress"
        subtitle={<>Verified highlights from the May 2026 monthly progress report.</>}
      />

      {/* Overall status */}
      <section className="border-b border-rule bg-void">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-3">
            <span className="text-caption text-ink-3 tracking-wide uppercase">Overall physical progress</span>
            <AnimatedFigure value={overallPct} suffix="%" signal className="text-figure" />
            <span className="text-small text-ink-2">As of {isPlaceholder(progress.asOf) ? "May 2026" : progress.asOf} · {progress.reportSeries}</span>
          </div>

          <DownloadSummaryButton />

          <dl className="grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {statusFacts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1 bg-void p-5">
                <dt className="text-caption text-ink-3 tracking-wide uppercase">{fact.label}</dt>
                <dd className="figure text-body text-ink-1">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </ViewportReveal>
      </section>

      {/* Interchange progress */}
      <section className="border-b border-rule bg-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-ink-1">Interchange progress</h2>
          <div className="flex flex-col gap-6">
            {interchanges.map((interchange) => {
              const pkg = workPackages.find((w) => w.id === interchange.id);
              if (!pkg) return null;
              return (
                <AnimatedProgressBar
                  key={interchange.id}
                  label={`${interchange.name} Interchange`}
                  percent={pkg.percentComplete}
                  sublabel={`${interchange.chainageLabel} · ${interchange.mayActivity}`}
                />
              );
            })}
          </div>
          <p className="text-caption text-ink-3">
            Interchange progress figures reflect the {REPORT_LABEL.replace("Monthly", "monthly")}.
          </p>
        </ViewportReveal>
      </section>

      {/* Works in progress */}
      <section className="border-b border-rule bg-void">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-ink-1">Works in progress</h2>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Earthworks */}
            <div className="flex flex-col gap-4">
              <h3 className="text-body text-ink-1">Earthworks</h3>
              <p className="text-small text-ink-2">{earthworks.summary}</p>
              <QuantityList items={earthworks.quantities} />
              <p className="text-caption text-ink-3">Cumulative quantities recorded to date in the May 2026 report.</p>
            </div>

            {/* Concrete */}
            <div className="flex flex-col gap-4">
              <h3 className="text-body text-ink-1">Concrete and structural works</h3>
              <p className="text-small text-ink-2">{concreteWorks.summary}</p>
              <QuantityList items={concreteWorks.quantities} />
            </div>

            {/* Drainage */}
            <div className="flex flex-col gap-4">
              <h3 className="text-body text-ink-1">Drainage and culverts</h3>
              <p className="text-small text-ink-2">{drainage.summary}</p>
              <ul className="flex flex-col divide-y divide-rule border-t border-b border-rule">
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-ink-2">Box culverts in the programme</span>
                  <span className="figure text-ink-1">{drainage.boxCulverts.programme}</span>
                </li>
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-ink-2">Commenced</span>
                  <span className="figure text-ink-1">{drainage.boxCulverts.commenced}</span>
                </li>
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-ink-2">Completed</span>
                  <span className="figure text-ink-1">{drainage.boxCulverts.completed}</span>
                </li>
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-ink-2">Ongoing</span>
                  <span className="figure text-ink-1">{drainage.boxCulverts.ongoing}</span>
                </li>
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-ink-2">Outstanding</span>
                  <span className="figure text-ink-1">{drainage.boxCulverts.outstanding}</span>
                </li>
              </ul>
              <p className="text-small text-ink-2">{drainage.bridgeCulverts.note}</p>
            </div>

            {/* Footbridges */}
            <div className="flex flex-col gap-4">
              <h3 className="text-body text-ink-1">Footbridges</h3>
              <p className="text-small text-ink-2">{footbridges.summary}</p>
              <details className="border border-rule bg-raised">
                <summary className="cursor-pointer list-none px-4 py-3 text-small text-ink-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime">
                  View reported footbridge statuses
                </summary>
                <table className="w-full border-t border-rule text-small">
                  <thead>
                    <tr className="text-ink-3">
                      <th scope="col" className="px-4 py-2 text-left font-normal">Chainage</th>
                      <th scope="col" className="px-4 py-2 text-right font-normal">Reported status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {footbridges.statuses.map((s) => (
                      <tr key={s.chainage} className="border-t border-rule">
                        <td className="figure px-4 py-2 text-ink-1">{s.chainage}</td>
                        <td className="px-4 py-2 text-right">
                          {s.percent === null ? (
                            <span className="text-ink-3">Not yet reported</span>
                          ) : (
                            <span className="figure text-ink-1">{s.percent}%</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </div>
          </div>
        </ViewportReveal>
      </section>

      {/* Recent construction activity */}
      <section className="border-b border-rule bg-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-ink-1">Recent construction activity</h2>
          <ul className="flex flex-col divide-y divide-rule border-t border-b border-rule">
            {recentActivity.map((item) => (
              <li key={`${item.location}-${item.chainage}`} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div className="flex flex-col">
                  <span className="text-body text-ink-1">{item.location}</span>
                  <span className="figure text-caption text-ink-3">{item.chainage}</span>
                </div>
                <span className="text-small text-ink-2 sm:text-right">{item.activity}</span>
              </li>
            ))}
          </ul>
        </ViewportReveal>
      </section>

      {/* Construction considerations */}
      <section className="border-b border-rule bg-void">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-ink-1">Construction considerations</h2>
          <div className="grid grid-cols-1 gap-px border border-rule bg-rule md:grid-cols-3">
            {considerations.map((c) => (
              <div key={c.title} className="flex flex-col gap-2 bg-void p-6">
                <h3 className="text-body text-ink-1">{c.title}</h3>
                <p className="text-small text-ink-2">{c.body}</p>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </section>

      <MilestoneTimeline />
      <BulletinFeed />
    </>
  );
}
