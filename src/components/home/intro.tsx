import { projectFacts } from "@/content/project";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";

/**
 * Editorial introduction: a section marker, an oversized heading revealed
 * word-by-word, and a short readable paragraph. The copy is server-
 * rendered and legible without any animation.
 */
export function Intro() {
  return (
    <section className="border-b border-rule bg-void">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-24 sm:px-8 md:grid-cols-[10rem_1fr] md:gap-12">
        <Reveal direction="up" distance={12}>
          <span className="figure text-caption text-lime tracking-[0.2em] uppercase">01 — The project</span>
        </Reveal>

        <div className="flex flex-col gap-6">
          <TextReveal
            as="h2"
            text="A 27.7 km design programme. One section under construction."
            className="max-w-3xl text-heading-3 text-ink-1 sm:text-heading-2"
          />
          <Reveal direction="up" distance={16} delay={0.1} className="max-w-2xl">
            <p className="text-lead text-ink-2">
              The Accra–Tema Motorway and Extensions Project reconstructs and expands a critical
              corridor in Ghana&rsquo;s national road network. The May 2026 monthly progress report
              focuses on Section 1 — the {projectFacts.section1LengthKm} km Accra–Tema Motorway
              corridor from Tema Roundabout to Tetteh Quarshie Interchange — currently being built.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
