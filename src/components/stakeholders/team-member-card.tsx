import Image from "next/image";
import type { TeamMember } from "@/content/project";

type CardVariant = "compact" | "feature";

/**
 * A team profile with a short biography and an expandable credentials list.
 * When no photograph is supplied, the avatar shows the member's initials —
 * never a generated or fake portrait.
 *
 * `variant="feature"` (used on /stakeholders) leads with a large square
 * portrait header and the layout stacks, so the bigger image reads properly
 * on every width instead of cramping the text beside it. `compact` (the
 * default, used in smaller previews) keeps the small inline avatar.
 */
export function TeamMemberCard({
  member,
  variant = "compact",
}: {
  readonly member: TeamMember;
  readonly variant?: CardVariant;
}) {
  const feature = variant === "feature";

  return (
    <div className="flex h-full flex-col gap-5 border border-hairline bg-surface-raised p-6">
      {feature ? (
        <>
          <div className="relative aspect-square w-full overflow-hidden border border-hairline bg-surface-sunk">
            {member.photo ? (
              <Image
                src={member.photo.src}
                alt={member.photo.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover object-top"
              />
            ) : (
              <span
                aria-hidden="true"
                className="figure flex h-full w-full items-center justify-center text-heading-1 text-fg-muted"
              >
                {member.initials}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-heading-4 text-fg">{member.name}</h3>
            <span className="text-small text-fg-muted">{member.title}</span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-hairline bg-surface-sunk">
            {member.photo ? (
              <Image src={member.photo.src} alt={member.photo.alt} fill sizes="64px" className="object-cover object-top" />
            ) : (
              <span aria-hidden="true" className="figure flex h-full w-full items-center justify-center text-heading-4 text-fg-muted">
                {member.initials}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-body text-fg">{member.name}</span>
            <span className="text-small text-fg-muted">{member.title}</span>
          </div>
        </div>
      )}

      <p className="text-small text-fg-muted">{member.bio}</p>

      <details className="border-t border-hairline pt-3">
        <summary className="cursor-pointer list-none text-small text-fg underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
          View profile
        </summary>
        <ul className="mt-3 flex flex-col gap-1.5">
          {member.credentials.map((item) => (
            <li key={item} className="flex gap-2 text-small text-fg-muted">
              <span aria-hidden="true" className="text-fg-faint">
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
