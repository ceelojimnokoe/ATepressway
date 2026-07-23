import type { ReactNode } from "react";
import {
  projectFacts,
  progress,
  sections,
  scopeOfWorks,
  stakeholders,
  specialistContractors,
  reconstructionRationale,
  laneConfiguration,
} from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { formatLongDate } from "@/lib/format";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const overallPct = isPlaceholder(progress.overallPercentComplete) ? null : progress.overallPercentComplete;
const asOf = isPlaceholder(progress.asOf) ? null : progress.asOf;
const source = isPlaceholder(progress.signOffSource) ? null : progress.signOffSource;

const totalLanes = laneConfiguration.freeway.lanes + laneConfiguration.urban.lanes;

interface Faq {
  readonly id: string;
  readonly question: string;
  readonly answer: ReactNode;
}

/**
 * Every answer is assembled from src/content/project.ts — no figure,
 * date or attribution is written by hand here. Where the project has not
 * published something (day-to-day lane closures, tolling arrangements,
 * the public contact channel), the answer says so rather than guessing.
 */
const faqs: readonly Faq[] = [
  {
    id: "route-affected",
    question: "Is my route affected?",
    answer: (
      <>
        <p>
          The design corridor is {projectFacts.corridorLengthKm} km across three sections:
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {sections.map((s) => (
            <li key={s.id}>
              <span className="text-ink-1">{s.label}</span> — {s.name} ({s.road}), {s.lengthKm} km,{" "}
              {s.from} to {s.to}.
            </li>
          ))}
        </ul>
        <p className="mt-2">
          Section 1, the {projectFacts.section1LengthKm} km Accra–Tema Motorway, is the length
          currently under construction.
        </p>
      </>
    ),
  },
  {
    id: "completion",
    question: "When will Section 1 be finished?",
    answer: (
      <p>
        The contractor commenced on {formatLongDate(projectFacts.commencementDate)}, starting a{" "}
        {projectFacts.constructionWindowMonths}-month construction window. Scheduled completion is{" "}
        {formatLongDate(projectFacts.scheduledCompletionDate)}.
      </p>
    ),
  },
  {
    id: "progress",
    question: "How much of the work has been completed?",
    answer: (
      <p>
        {overallPct !== null ? (
          <>
            Overall physical progress stands at {overallPct}%
            {asOf ? ` as of ${asOf}` : ""}. Progress is reported structure by structure on the
            progress page{source ? `, sourced from the ${source}` : ""}.
          </>
        ) : (
          <>Progress figures are published on the progress page as each monthly report is issued.</>
        )}
      </p>
    ),
  },
  {
    id: "corridor-open",
    question: "Is the corridor open while construction is under way?",
    answer: (
      <p>
        Yes — the works are being built along the existing corridor while it stays in use, which is
        why traffic-diversion works form part of the current programme. Day-to-day lane and closure
        information is not published on this site; it is issued by the works teams on the ground.
      </p>
    ),
  },
  {
    id: "why-reconstruct",
    question: "Why is the road being reconstructed rather than resurfaced?",
    answer: (
      <p>
        The existing pavement was designed for a {reconstructionRationale.designLifeYears}-year
        life. It now shows {reconstructionRationale.distressTypes.join(", ")} — damage that a
        resurfacing would not resolve.
      </p>
    ),
  },
  {
    id: "what-is-built",
    question: "What is actually being built?",
    answer: (
      <>
        <p>
          The corridor is rebuilt to {totalLanes} lanes — {laneConfiguration.freeway.lanes} lanes of{" "}
          {laneConfiguration.freeway.surface} and {laneConfiguration.urban.lanes} lanes of{" "}
          {laneConfiguration.urban.surface}. The works scope covers:
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {scopeOfWorks.map((item) => (
            <li key={item.id}>{item.description}.</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "funding",
    question: "How is the project funded?",
    answer: (
      <p>
        {stakeholders.fundingAgency.name} is the Funding Agency. The contract price is{" "}
        {projectFacts.contractPriceDisplay} before tax, and{" "}
        {projectFacts.contractPriceWithTaxUSD.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        including tax. Approved variation to the contract price as of {asOf ?? "the latest report"}{" "}
        is {projectFacts.variationAsOfMay2026}.
      </p>
    ),
  },
  {
    id: "who-builds",
    question: "Who is responsible for the works?",
    answer: (
      <>
        <p>
          {stakeholders.employer.name} is the Employer — it commissions and oversees the works, it
          does not build the road. The delivery chain is:
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          <li>{stakeholders.employer.name} — Employer</li>
          <li>{stakeholders.fundingAgency.name} — Funding Agency</li>
          <li>{stakeholders.employersRepresentative.name} — Employer&rsquo;s Representative</li>
          <li>{stakeholders.employersRepAgent.name} — Employer&rsquo;s Representative&rsquo;s Agent</li>
          <li>{stakeholders.epcContractor.name} — EPC Contractor</li>
        </ul>
      </>
    ),
  },
  {
    id: "disruption",
    question: "Who do I contact about property or utility disruption?",
    answer: (
      <>
        <p>Utility relocation along the corridor is carried out by specialist contractors:</p>
        <ul className="mt-2 flex flex-col gap-1">
          {specialistContractors.map((c) => (
            <li key={c.name}>
              {c.name} — {c.role}.
            </li>
          ))}
        </ul>
        <p className="mt-2">
          A public contact channel for the project is being finalised and will be published here
          once confirmed. In the meantime, please use the enquiry form below.
        </p>
      </>
    ),
  },
  {
    id: "tolls",
    question: "Will the corridor be tolled?",
    answer: (
      <p>
        The works scope includes the construction of {projectFacts.tollPlazaCount} toll plazas.
        Tolling arrangements, tariffs and start dates are not part of the published construction
        scope and are not confirmed here.
      </p>
    ),
  },
];

/**
 * Frequently asked questions, full width above the enquiry content. Built
 * on native <details>/<summary>, so it is keyboard-operable and fully
 * readable with no JavaScript — no custom accordion state to get wrong.
 */
export function FaqSection() {
  return (
    <section className="border-b border-rule bg-void">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-heading-3 text-ink-1">Frequently asked questions</h2>
          <p className="max-w-2xl text-body text-ink-2">
            Answers drawn from the project record. Where something has not been published, the
            answer says so.
          </p>
        </div>

        <ul className="flex flex-col border-t border-rule">
          {faqs.map((faq) => (
            <li key={faq.id} className="border-b border-rule">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-body text-ink-1 transition-colors duration-200 ease-out hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-ink-3 transition-transform duration-200 ease-out group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="max-w-3xl pb-6 text-small text-ink-2">{faq.answer}</div>
              </details>
            </li>
          ))}
        </ul>
      </ViewportReveal>
    </section>
  );
}
