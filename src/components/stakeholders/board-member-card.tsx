import Image from "next/image";
import type { OrgPerson } from "@/content/project";

/**
 * One person card — a board seat, an executive, a consultant or contractor
 * engineer — reduced to the three fields the client asked for: photo, name and
 * position. There is deliberately no biography and no "view profile"
 * disclosure — the board reads as a clean roster, not a set of profiles.
 *
 * A supplied portrait renders through next/image in a reserved square (no
 * layout shift); a member without one gets an initials avatar, never a broken
 * image. Cards are nested under their affiliated organisation on
 * /stakeholders, so they are sized to sit inside another card.
 */
export function BoardMemberCard({ member }: { readonly member: OrgPerson }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden border border-hairline bg-surface-sunk">
        {member.photo ? (
          <Image
            src={member.photo.src}
            alt={member.photo.alt}
            fill
            sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover object-top"
            style={
              member.photo.crop
                ? { transform: `scale(${member.photo.crop.scale})`, transformOrigin: member.photo.crop.origin }
                : undefined
            }
          />
        ) : (
          <span
            aria-hidden="true"
            className="figure flex h-full w-full items-center justify-center text-heading-4 text-fg-muted"
          >
            {member.initials}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-small text-fg">{member.name}</span>
        <span className="text-caption text-fg-muted">{member.role}</span>
      </div>
    </div>
  );
}
