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
/**
 * Q&A supplied by the client (ATEL FAQ pack, August 2026), reproduced in the
 * client's own words. These sit ABOVE the project-record answers below, in the
 * same accordion. Where a figure here differs in precision from the site's
 * verified figures (the pack quotes a "maximum US$340M" contract ceiling, the
 * site cites the exact US$338.9M contract price), the client's wording is kept
 * as written and the difference is flagged rather than silently reconciled.
 */
const clientFaqs: readonly Faq[] = [
  {
    id: "what-is-the-project",
    question: "What is the Accra-Tema Motorway & Extensions Project?",
    answer: (
      <>
        <p>
          The Project consists of three distinct road links that function together to move traffic
          between Tema Port, Accra and its surrounding urban and peri-urban areas. The scope of the
          project comprises roads constituting a 27.7km long road network made up of:
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          <li>Section 1: Tema Roundabout to Tetteh Quarshie Interchange &mdash; 19.5km (N1)</li>
          <li>Section 2: Tetteh Quarshie Interchange to Apenkwa Interchange &mdash; 5.7km (N1)</li>
          <li>Section 3: Apenkwa Interchange to Neoplan Junction &mdash; 2.5km (N6)</li>
        </ul>
        <p className="mt-2">
          On completion, the Project will have a 10-lane Section 1, 12-lane Section 2, and a 6-lane
          Section 3. In addition, the Project will have five (5) new interchanges and two (2)
          remodelled interchanges (Tetteh Quarshie and Apenkwa).
        </p>
      </>
    ),
  },
  {
    id: "why-giif",
    question:
      "What informed the decision to assign the Project to the Ghana Infrastructure Investment Fund (GIIF)?",
    answer: (
      <>
        <p>Government&rsquo;s strategic decision is premised on these pillars:</p>
        <ul className="mt-2 flex flex-col gap-1">
          <li>
            The PPP Act provides for a project to be procured through GIIF when a competitively
            procured tender process falls through;
          </li>
          <li>
            GIIF has the capacity to raise complementary long-term financing to deliver the Project
            on behalf of the Ghanaian people;
          </li>
          <li>
            It fits within GIIF&rsquo;s mandate, as Ghana&rsquo;s sovereign wealth fund for
            infrastructure, to catalyse the development of critical infrastructure in Ghana;
          </li>
          <li>
            To deliver a local solution to a local problem by utilising Ghanaian expertise, capital
            and institutions.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "who-is-giif",
    question: "Who is GIIF and who are the shareholders?",
    answer: (
      <>
        <p>
          GIIF was established to resolve a problem most African countries have experienced &mdash;
          how to unlock more private sector financing to fund and solve infrastructure deficits.
        </p>
        <p className="mt-2">
          GIIF was established pursuant to the Ghana Infrastructure Investment Fund Act, 2014 (Act
          877) with a mandate to identify, develop, invest, mobilise and manage investments in a
          diversified portfolio of infrastructure assets in Ghana for national development, in a
          profitable and sustainable way. GIIF is 100% owned by the Government of Ghana.
        </p>
        <p className="mt-2">
          GIIF has not only relied on the initial funding it received from government. It has also
          raised US$160M of long-term debt financing from two premier global financing institutions,
          without a sovereign guarantee.
        </p>
      </>
    ),
  },
  {
    id: "transaction-structure",
    question: "What is the structure of the transaction?",
    answer: (
      <>
        <p>
          The Ministry of Roads and Highways, acting through the Ghana Highway Authority as
          Contracting Authority, has awarded a 30-year concession to A.T. Expressway Ltd (the
          Concessionaire or &ldquo;ATEL&rdquo;) under a Concession Agreement.
        </p>
        <p className="mt-2">
          Under the Concession Agreement, ATEL is responsible for the design, finance, build,
          operation and maintenance of the project. ATEL has signed a FIDIC Silver Book EPC Contract
          for the design of the three sections and the construction of the Section 1 Works. On expiry
          of the concession, the road and ancillary assets will be transferred to the Ghana Highway
          Authority.
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          <li>
            Government is responsible for acquiring additional land and resettling Project-Affected
            Persons.
          </li>
          <li>
            The Ghana Highway Authority is responsible for relocating utilities within the corridor,
            and also acts as Employer&rsquo;s Representative for the Section 1 Works, with Associated
            Consultants Limited as Employer&rsquo;s Representative&rsquo;s Agent.
          </li>
          <li>The Ministry of Finance funds applicable taxes on the Section 1 Works.</li>
        </ul>
        <p className="mt-2">
          To recoup its investment, ATEL will toll Sections 1 and 2 only, but will operate and
          maintain all sections for the period of the concession, and will pay concession fees to
          Government through the Ghana Highway Authority.
        </p>
      </>
    ),
  },
  {
    id: "who-is-concessionaire",
    question: "Who is the Concessionaire and who are the shareholders?",
    answer: (
      <p>
        ATEL is the Concessionaire and is currently owned by GIIF. ATEL is currently raising equity
        and debt financing under the PPP structure to increase private participation in the project.
      </p>
    ),
  },
  {
    id: "concession-approved",
    question: "Has the Concession Agreement been approved?",
    answer: (
      <p>
        Pursuant to the Public Private Partnership Act 2020 (Act 1039), the Concession Agreement has
        been approved by the PPP Committee and Cabinet. Parliament granted its approval of the
        Concession Agreement on 15th December 2023 in accordance with the Act.
      </p>
    ),
  },
  {
    id: "who-constructs",
    question: "Who is going to construct the road?",
    answer: (
      <>
        <p>
          The responsibility for engineering, procurement and construction is that of the
          Concessionaire, which transfers those obligations and risks to an EPC contractor through a
          FIDIC Silver Book EPC contract.
        </p>
        <p className="mt-2">
          As Concessionaire, ATEL has awarded the contract for Phase I to Maripoma Enterprise Limited
          under a FIDIC Silver Book EPC Contract. Maripoma is responsible for the design of the three
          sections of the project and the construction of the Section 1 Works only. The Phase 2 EPC
          (Sections 2 and 3) and the Operation and Maintenance procurement packages are being
          developed.
        </p>
      </>
    ),
  },
  {
    id: "phases",
    question: "Is the Project going to be delivered in phases?",
    answer: (
      <>
        <p>The Project will be delivered in two phases:</p>
        <ul className="mt-2 flex flex-col gap-1">
          <li>Phase I is Section 1 &mdash; the Accra&ndash;Tema Motorway (19.5km).</li>
          <li>Phase II comprises Section 2 &mdash; George Bush Highway (5.7km);</li>
          <li>
            Section 3 &mdash; a portion of the Nsawam Road (N6) linking to the N1, from Neoplan
            Interchange to Apenkwa (2.5km);
          </li>
          <li>and the Operation and Maintenance of the Project.</li>
        </ul>
      </>
    ),
  },
  {
    id: "silver-book",
    question: "Why is the FIDIC Silver Book being used?",
    answer: (
      <>
        <p>
          The FIDIC Silver Book is often preferred in EPC/Turnkey projects, particularly those that
          are project-financed, because it provides a high degree of cost and time certainty. This is
          achieved by allocating most of the project risks to the contractor, including design and
          completion risks, which makes it attractive to lenders who want to minimise financial
          exposure.
        </p>
        <p className="mt-2">
          Lenders require greater certainty about a project&rsquo;s final costs as part of due
          diligence on bankable projects. The traditional allocation of risks in contracts such as
          FIDIC&rsquo;s Red and Yellow Books results in final cost uncertainties that tend to make
          lenders wary of construction risk and its related cost.
        </p>
        <p className="mt-2">
          In response, the Concessionaire negotiated and awarded a Silver Book EPC contract to
          Maripoma Enterprise Limited to provide certainty of construction contract costs for Phase
          I.
        </p>
      </>
    ),
  },
  {
    id: "construction-cost",
    question: "What is the cost of the ongoing construction work?",
    answer: (
      <p>
        The Concessionaire has signed an EPC contract for Phase I which covers the design of the
        entire 27.7km project and the construction of the 19.5km Section 1 Works. The construction of
        Section 1 covers 36 months (including a period for detailed design) for a maximum of US$340M,
        exclusive of applicable taxes.
      </p>
    ),
  },
  {
    id: "who-is-maripoma",
    question: "Who is Maripoma Enterprise Limited?",
    answer: (
      <p>
        Maripoma Enterprise Limited is a private limited liability construction company incorporated
        in Ghana and is the Phase 1 EPC Contractor. It is a fully indigenous Ghanaian company with a
        multi-million construction portfolio handling projects in Ghana and beyond.
      </p>
    ),
  },
  {
    id: "when-complete",
    question: "When would the Accra-Tema Motorway be completed?",
    answer: (
      <p>
        Phase 1 is currently ongoing. The design and construction of Section 1 &mdash; which includes
        the Accra&ndash;Tema Motorway, three new interchanges at Teshie Link, Lashibi and Community
        18, and extends to Accra Polo Club and Emmanuel Eye Clinic &mdash; would be completed in 36
        months ending August 2027.
      </p>
    ),
  },
  {
    id: "structure-benefits",
    question: "What are the benefits, if any, of this structure?",
    answer: (
      <>
        <p>
          This ambitious project is Ghana&rsquo;s first road PPP and provides a structure that gives
          the Ghanaian people a significant stake in the Project. The PPP structure will provide
          accountability and private sector participation in this significant road infrastructure.
          The Project presents a secure investment opportunity for institutions and investors seeking
          viable long-term investment. Its successful implementation will set the tone for similar
          PPPs in Ghana and beyond.
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          <li>
            Once built and de-risked, the project can be refinanced by local investment institutions
            such as pension funds, allowing the initial Government funds to be repaid or used to fund
            future road projects.
          </li>
          <li>
            Financial benefits accrue to Government. GIIF owns the Project on behalf of the Ghanaian
            people, and therefore accrues significant financial benefits on their behalf.
          </li>
          <li>The PPP structure allows for the involvement of key local financial institutions.</li>
          <li>
            A concession fee is payable to Government throughout the operational life of the
            concession.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "is-it-ppp",
    question: "Is the project a PPP?",
    answer: (
      <>
        <p>
          In 2020, Government, acting through the Ministry of Finance, requested GIIF to develop a
          GIIF-led PPP solution for the delivery of the Project, leveraging Government anchor capital
          in the form of a construction grant (Viability Gap Funding) by raising maximum funds from
          the market. This mandate resulted in GIIF incorporating ATEL as an initially wholly owned
          private entity to develop, finance, build, operate and maintain the project.
        </p>
        <p className="mt-2">
          Under the Public Private Partnership Act 2020 (Act 1039), the Ministry of Finance is
          providing ATEL with viability gap funding in the form of a construction grant as initial
          financial support. This is Government&rsquo;s intervention to ensure tolls are affordable
          to the Ghanaian road user and to ensure commercial viability for investors. GIIF is also
          providing initial equity to ATEL for the accelerated delivery of the project.
        </p>
        <p className="mt-2">
          ATEL, post construction of the road, will sell down a significant portion of its equity to
          institutional investors, such as pension funds, which require safe and secure long-term
          investments. This PPP structure provides transparency, accountability, risk sharing, and a
          clear legal and institutional framework.
        </p>
      </>
    ),
  },
];

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
              <span className="text-fg">{s.label}</span> — {s.name} ({s.road}), {s.lengthKm} km,{" "}
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
        {projectFacts.contractPriceDisplay} before tax. Approved variation to the contract price as
        of {asOf ?? "the latest report"} is {projectFacts.variationAsOfMay2026}.
      </p>
    ),
  },
  {
    id: "who-builds",
    question: "Who is responsible for the works?",
    answer: (
      <>
        <p>
          {stakeholders.employer.name} is the Concessionaire/Employer — it commissions and oversees
          the works, it does not build the road. The delivery chain is:
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          <li>{stakeholders.employer.name} — Concessionaire/Employer</li>
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
        Whether, when and how the corridor will be tolled has not yet been finalised, and no tariffs
        or start dates have been set. This page will be updated once the arrangements are confirmed.
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
    <section className="border-b border-hairline bg-surface">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-heading-3 text-fg">Frequently asked questions</h2>
          <p className="max-w-2xl text-body text-fg-muted">
            Answers drawn from the project record. Where something has not been published, the
            answer says so.
          </p>
        </div>

        <ul className="flex flex-col border-t border-hairline">
          {[...clientFaqs, ...faqs].map((faq) => (
            <li key={faq.id} className="border-b border-hairline">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-body text-fg transition-colors duration-200 ease-out hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-fg-faint transition-transform duration-200 ease-out group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="max-w-3xl pb-6 text-small text-fg-muted">{faq.answer}</div>
              </details>
            </li>
          ))}
        </ul>
      </ViewportReveal>
    </section>
  );
}
