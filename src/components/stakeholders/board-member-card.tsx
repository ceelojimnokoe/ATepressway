import Image from "next/image";
import type { BoardMember } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";

/** Resolve a possibly-placeholder field to its display text + TBC flag. */
function resolve(value: string | { readonly fallback: string }): { text: string; tbc: boolean } {
  return isPlaceholder(value as string)
    ? { text: (value as { readonly fallback: string }).fallback, tbc: true }
    : { text: value as string, tbc: false };
}

/**
 * Board seat card. Deliberately the same layout as TeamMemberCard — avatar,
 * name, title, then an expandable "View profile" — so the board reads as
 * one system with the project team. Every identity field is a placeholder
 * today, so each card states its provisional status rather than implying a
 * confirmed appointment.
 */
export function BoardMemberCard({ member }: { readonly member: BoardMember }) {
  const name = resolve(member.name);
  const title = resolve(member.title);
  const bio = resolve(member.bio);

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
          <span className="text-body text-ink-1">{name.text}</span>
          <span className="text-small text-ink-2">{title.text}</span>
        </div>
      </div>

      <p className="text-small text-ink-2">{bio.text}</p>

      <details className="border-t border-rule pt-3">
        <summary className="cursor-pointer list-none text-small text-ink-1 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime">
          View profile
        </summary>
        <ul className="mt-3 flex flex-col gap-1.5">
          {member.credentials.length > 0 ? (
            member.credentials.map((item) => (
              <li key={item} className="flex gap-2 text-small text-ink-2">
                <span aria-hidden="true" className="text-ink-3">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li className="text-small text-ink-3">
              Profile details to be confirmed by the stakeholders.
            </li>
          )}
        </ul>
      </details>
    </div>
  );
}
