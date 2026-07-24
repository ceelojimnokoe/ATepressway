import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { AnimatedFigure } from "@/components/ui/animated-figure";
import { StructureProgress } from "@/components/progress/structure-progress";
import { MilestoneTimeline } from "@/components/progress/milestone-timeline";
import { BulletinFeed } from "@/components/progress/bulletin-feed";
import { DownloadSummaryButton } from "@/components/progress/download-summary-button";
import { projectFacts, progress, interchanges } from "@/content/project";
import { mediaRegistry } from "@/content/media";
import { structureDesignImages } from "@/content/structure-media";
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
    <ul className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
      {items.map((q) => (
        <li key={q.label} className="flex items-baseline justify-between gap-4 py-3">
          <span className="text-small text-fg-muted">{q.label}</span>
          <span className="figure shrink-0 text-body text-fg">
            {formatThousands(q.value)} <span className="text-small text-fg-faint">{q.unit}</span>
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
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-3">
            <span className="text-caption text-fg-faint tracking-wide uppercase">Overall physical progress</span>
            <AnimatedFigure value={overallPct} suffix="%" signal className="text-figure" />
            <span className="text-small text-fg-muted">As of {isPlaceholder(progress.asOf) ? "May 2026" : progress.asOf} · {progress.reportSeries}</span>
          </div>

          <DownloadSummaryButton />

          <dl className="grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {statusFacts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1 bg-surface p-5">
                <dt className="text-caption text-fg-faint tracking-wide uppercase">{fact.label}</dt>
                <dd className="figure text-body text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </ViewportReveal>
      </section>

      {/* Interchange progress */}
      <section className="border-b border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-heading-4 text-fg">Interchange progress</h2>
            <p className="text-small text-fg-muted">Select a structure to view its proposed design.</p>
          </div>
          <div className="flex flex-col gap-6">
            {interchanges.map((interchange) => {
              const pkg = workPackages.find((w) => w.id === interchange.id);
              if (!pkg) return null;
              const images = (structureDesignImages[interchange.id] ?? []).map((key) => {
                const asset = mediaRegistry[key];
                return {
                  src: asset.src,
                  alt: asset.alt,
                  width: asset.width,
                  height: asset.height,
                  caption: `${interchange.name} Interchange — proposed design`,
                };
              });
              return (
                <StructureProgress
                  key={interchange.id}
                  label={`${interchange.name} Interchange`}
                  percent={pkg.percentComplete}
                  sublabel={`${interchange.chainageLabel} · ${interchange.mayActivity}`}
                  images={images}
                />
              );
            })}
          </div>
          <p className="text-caption text-fg-faint">
            Interchange progress figures reflect the {REPORT_LABEL.replace("Monthly", "monthly")}.
          </p>
        </ViewportReveal>
      </section>

      {/* Works in progress */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Works in progress</h2>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Earthworks */}
            <div className="flex flex-col gap-4">
              <h3 className="text-body text-fg">Earthworks</h3>
              <p className="text-small text-fg-muted">{earthworks.summary}</p>
              <QuantityList items={earthworks.quantities} />
              <p className="text-caption text-fg-faint">Cumulative quantities recorded to date in the May 2026 report.</p>
            </div>

            {/* Concrete */}
            <div className="flex flex-col gap-4">
              <h3 className="text-body text-fg">Concrete and structural works</h3>
              <p className="text-small text-fg-muted">{concreteWorks.summary}</p>
              <QuantityList items={concreteWorks.quantities} />
            </div>

            {/* Drainage */}
            <div className="flex flex-col gap-4">
              <h3 className="text-body text-fg">Drainage and culverts</h3>
              <p className="text-small text-fg-muted">{drainage.summary}</p>
              <ul className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-fg-muted">Box culverts in the programme</span>
                  <span className="figure text-fg">{drainage.boxCulverts.programme}</span>
                </li>
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-fg-muted">Commenced</span>
                  <span className="figure text-fg">{drainage.boxCulverts.commenced}</span>
                </li>
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-fg-muted">Completed</span>
                  <span className="figure text-fg">{drainage.boxCulverts.completed}</span>
                </li>
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-fg-muted">Ongoing</span>
                  <span className="figure text-fg">{drainage.boxCulverts.ongoing}</span>
                </li>
                <li className="flex items-baseline justify-between py-3 text-small">
                  <span className="text-fg-muted">Outstanding</span>
                  <span className="figure text-fg">{drainage.boxCulverts.outstanding}</span>
                </li>
              </ul>
              <p className="text-small text-fg-muted">{drainage.bridgeCulverts.note}</p>
            </div>

            {/* Footbridges */}
            <div className="flex flex-col gap-4">
              <h3 className="text-body text-fg">Footbridges</h3>
              <p className="text-small text-fg-muted">{footbridges.summary}</p>
              <details className="border border-hairline bg-surface-raised">
                <summary className="cursor-pointer list-none px-4 py-3 text-small text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                  View reported footbridge statuses
                </summary>
                <table className="w-full border-t border-hairline text-small">
                  <thead>
                    <tr className="text-fg-faint">
                      <th scope="col" className="px-4 py-2 text-left font-normal">Chainage</th>
                      <th scope="col" className="px-4 py-2 text-right font-normal">Reported status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {footbridges.statuses.map((s) => (
                      <tr key={s.chainage} className="border-t border-hairline">
                        <td className="figure px-4 py-2 text-fg">{s.chainage}</td>
                        <td className="px-4 py-2 text-right">
                          {s.percent === null ? (
                            <span className="text-fg-faint">Not yet reported</span>
                          ) : (
                            <span className="figure text-fg">{s.percent}%</span>
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
      <section className="border-b border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Recent construction activity</h2>
          <ul className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
            {recentActivity.map((item) => (
              <li key={`${item.location}-${item.chainage}`} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div className="flex flex-col">
                  <span className="text-body text-fg">{item.location}</span>
                  <span className="figure text-caption text-fg-faint">{item.chainage}</span>
                </div>
                <span className="text-small text-fg-muted sm:text-right">{item.activity}</span>
              </li>
            ))}
          </ul>
        </ViewportReveal>
      </section>

      {/* Construction considerations */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Construction considerations</h2>
          <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-3">
            {considerations.map((c) => (
              <div key={c.title} className="flex flex-col gap-2 bg-surface p-6">
                <h3 className="text-body text-fg">{c.title}</h3>
                <p className="text-small text-fg-muted">{c.body}</p>
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
