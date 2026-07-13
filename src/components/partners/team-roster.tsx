import { team } from "@/content/project";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

/** team is entirely placeholder — an honest TBC block, never fabricated people. */
export function TeamRoster() {
  return (
    <section>
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Team</h2>
        <PlaceholderNotice value={team} size="display">
          {(members) =>
            members.length === 0 ? (
              <p className="text-small text-ink-2">No team members listed.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {members.map((member) => (
                  <li key={member.name} className="flex flex-col gap-1">
                    <span className="text-body text-ink-1">{member.name}</span>
                    <span className="text-small text-ink-2">{member.title}</span>
                  </li>
                ))}
              </ul>
            )
          }
        </PlaceholderNotice>
      </ViewportReveal>
    </section>
  );
}
