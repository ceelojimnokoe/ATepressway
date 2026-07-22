import Image from "next/image";
import type { BoardMember } from "@/content/project";

/**
 * Board member card. Renders the supplied portrait with placeholder name,
 * title and description — the identities are not yet confirmed, so the copy
 * is deliberately neutral (see `boardMembers` in content/project.ts). A
 * small caption makes the provisional status explicit on screen.
 */
export function BoardMemberCard({ member }: { readonly member: BoardMember }) {
  return (
    <figure className="flex h-full flex-col border border-rule bg-raised">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sunk">
        <Image
          src={member.photo.src}
          alt={member.photo.alt}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          loading="lazy"
          className="object-cover object-top"
        />
      </div>
      <figcaption className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-caption text-ink-3 tracking-wide uppercase">To be confirmed</span>
        <span className="text-body text-ink-1">{member.name}</span>
        <span className="text-small text-ink-2">{member.title}</span>
        <p className="mt-1 text-small text-ink-3">{member.description}</p>
      </figcaption>
    </figure>
  );
}
