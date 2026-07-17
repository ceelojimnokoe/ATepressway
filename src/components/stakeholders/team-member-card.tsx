import Image from "next/image";
import type { TeamMember } from "@/content/project";

/**
 * A team profile with a short biography and an expandable credentials
 * list. When no photograph is supplied, the avatar shows the member's
 * initials — never a generated or fake portrait.
 */
export function TeamMemberCard({ member }: { readonly member: TeamMember }) {
  return (
    <div className="flex h-full flex-col gap-4 border border-rule bg-raised p-6">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-rule bg-sunk">
          {member.photo ? (
            <Image
              src={member.photo.src}
              alt={member.photo.alt}
              fill
              sizes="64px"
              className="object-cover object-top"
            />
          ) : (
            <span
              aria-hidden="true"
              className="figure flex h-full w-full items-center justify-center text-heading-4 text-ink-2"
            >
              {member.initials}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-body text-ink-1">{member.name}</span>
          <span className="text-small text-ink-2">{member.title}</span>
        </div>
      </div>

      <p className="text-small text-ink-2">{member.bio}</p>

      <details className="border-t border-rule pt-3">
        <summary className="cursor-pointer list-none text-small text-ink-1 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime">
          View profile
        </summary>
        <ul className="mt-3 flex flex-col gap-1.5">
          {member.credentials.map((item) => (
            <li key={item} className="flex gap-2 text-small text-ink-2">
              <span aria-hidden="true" className="text-ink-3">
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
