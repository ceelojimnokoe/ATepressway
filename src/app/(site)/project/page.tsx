import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { CorridorExplorer } from "@/components/corridor/corridor-explorer";
import { FullScope } from "@/components/project/full-scope";
import { Figure } from "@/components/ui/figure";
import { sections, projectFacts, scopeOfWorks } from "@/content/project";
import { mediaRegistry } from "@/content/media";
import { corridorPlaceJsonLd } from "@/content/structured-data";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.project);

const reasons = [
  {
    title: "Increased mobility and accessibility",
    body: "A rebuilt, higher-capacity corridor that moves people and vehicles more reliably across Accra and Tema.",
  },
  {
    title: "Reduced congestion",
    body: "Grade-separated interchanges and added capacity ease pressure across the N1, N4, Liberation Road and N6 corridors.",
  },
  {
    title: "Safer pedestrian movement",
    body: "Dedicated pedestrian crossing points separate people on foot from high-speed traffic.",
  },
  {
    title: "Improved regional connectivity",
    body: "Stronger links between the capital, residential and industrial communities and the Tema logistics area.",
  },
  {
    title: "Stronger links for freight and trade",
    body: "More reliable access to and from the Tema transport and logistics area for goods movement.",
  },
  {
    title: "More durable road and drainage infrastructure",
    body: "Reconstructed pavement and upgraded drainage built for the corridor's demand.",
  },
] as const;

const whyImage = mediaRegistry.bridgeTBeamLaunch;

export default function ProjectPage() {
  return (
    <>
      <JsonLd data={corridorPlaceJsonLd()} />
      <PageHero
        media="flowerPotRemodel"
        scrimIntensity="light"
        title="The Project"
        subtitle={
          <>
            The Accra–Tema Motorway and Extensions Project is a {projectFacts.corridorLengthKm} km
            overall design project. Section 1 corridor — Tema Roundabout to Tetteh Quarshie
            Interchange — is the phase currently under construction.
          </>
        }
      />

      {/* The whole plan first, then the interactive way to dig into it. */}
      <FullScope />

      {/* Interactive corridor explorer — ADDITIVE. The detailed sections below
          it (the three-section grid, why-reconstruction, scope) all remain as
          the full/fallback view. */}
      <section className="border-b border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-heading-4 text-fg">Explore the corridor</h2>
            <p className="max-w-3xl text-body text-fg-muted">
              Move along the {projectFacts.corridorLengthKm} km corridor to see its three sections,
              their boundaries and the interchanges. Select any point for its detail; interchange
              positions are approximate, drawn from reported chainage and pending confirmation.
            </p>
          </div>
          <CorridorExplorer />
        </ViewportReveal>
      </section>

      {/* The three design sections */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-heading-4 text-fg">A 27.7 km design, one section under construction</h2>
            <p className="max-w-3xl text-body text-fg-muted">
              The full design programme spans three sections. Section 1 — the 19.5 km Accra–Tema
              Motorway corridor — is the section currently being built, and Sections 2 and 3 form
              part of the wider design programme.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-3">
            {sections.map((section, index) => (
              <div key={section.id} className="flex flex-col gap-2 bg-surface p-6">
                <span className="text-caption text-fg-faint tracking-wide uppercase">
                  Section {index + 1} · {section.road}
                </span>
                <h3 className="text-heading-4 text-fg">{section.name}</h3>
                <div className="flex items-baseline gap-1">
                  <Figure value={section.lengthKm.toFixed(1)} className="text-heading-3" />
                  <span className="text-small text-fg-muted">km</span>
                </div>
                <p className="text-small text-fg-muted">
                  {section.from} → {section.to}
                  {index === 0 ? " · under construction" : ""}
                </p>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Why reconstruction */}
      <section className="border-b border-hairline bg-surface-raised">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-12">
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-hairline bg-surface-sunk">
              <Image
                src={whyImage.src}
                alt={whyImage.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-heading-4 text-fg">Why the motorway is being reconstructed</h2>
              <p className="text-body text-fg-muted">
                The Accra-Tema Motorway &amp; Extensions PPP Project is Ghana&rsquo;s first road
                public private partnership (PPP) project.
              </p>
              <p className="text-body text-fg-muted">
                The Accra - Tema Motorway dual carriageway links Accra and the industrial city of
                Tema, where Ghana&rsquo;s main port is located. It was opened as a freeway in 1964
                under Ghana&rsquo;s first president, Kwame Nkrumah. The design life of the motorway
                was intended for 20 years and the pavement has outlived its terminal level of
                serviceability with visible fatigue-cracking, joint failures and pumping under
                wheel load and requires reconstruction.
              </p>
              <p className="text-body text-fg-muted">
                The project scope of the ATMP covers 27.7 km and involves an upgrade of 27.7KM of
                the national road network in the Greater Accra Region together with the operation
                and maintenance of the road, including toll road system on certain sections. The
                Project will be delivered in two phases, ensuring timely delivery and efficiency
                providing solutions to address the challenges with the freeway.
              </p>
              <p className="text-body text-fg-muted">
                The reconstruction and extension project is intended to improve mobility and
                accessibility, ease congestion across the N1, N4, Liberation Road and N6 corridors,
                strengthen regional integration and provide safer and more reliable transport
                infrastructure — supporting Ghana&rsquo;s broader goal of an integrated, efficient
                and sustainable transport system.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <div key={reason.title} className="flex flex-col gap-2 bg-surface-raised p-6">
                <h3 className="text-body text-fg">{reason.title}</h3>
                <p className="text-small text-fg-muted">{reason.body}</p>
              </div>
            ))}
          </div>
        </ViewportReveal>
      </section>

      {/* Scope of work */}
      <section className="border-b border-hairline bg-surface">
        <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
          <h2 className="text-heading-4 text-fg">Scope of work</h2>
          <ul className="grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {scopeOfWorks.map((item) => (
              <li key={item.id} className="flex gap-3 bg-surface p-5 text-body text-fg">
                <span aria-hidden="true" className="text-accent">
                  —
                </span>
                <span>{item.description}</span>
              </li>
            ))}
          </ul>
          <p className="text-caption text-fg-faint">
            The Section 1 scope includes {projectFacts.pedestrianFootbridges} pedestrian crossing
            points.
          </p>
        </ViewportReveal>
      </section>
    </>
  );
}
