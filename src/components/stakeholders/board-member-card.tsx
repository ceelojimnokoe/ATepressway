import Image from "next/image";
import type { BoardMember } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";

type CardVariant = "compact" | "feature";

/** Resolve a possibly-placeholder field to its display text + TBC flag. */
function resolve(value: string | { readonly fallback: string }): { text: string; tbc: boolean } {
  return isPlaceholder(value as string)
    ? { text: (value as { readonly fallback: string }).fallback, tbc: true }
    : { text: value as string, tbc: false };
}

/**
 * Board seat card — the same layout system as TeamMemberCard so the board
 * reads as one system with the project team. Every identity field is a
 * placeholder today, so each card states its provisional status rather than
 * implying a confirmed appointment.
 *
 * `variant="feature"` (used on /stakeholders) leads with a large square
 * portrait and stacks; `compact` (the default, used in the home preview)
 * keeps the small inline avatar.
 */
export function BoardMemberCard({
  member,
  variant = "compact",
}: {
  readonly member: BoardMember;
  readonly variant?: CardVariant;
}) {
  const name = resolve(member.name);
  const title = resolve(member.title);
  const bio = resolve(member.bio);
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
            <h3 className="text-heading-4 text-fg">{name.text}</h3>
            <span className="text-small text-fg-muted">{title.text}</span>
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
            <span className="text-body text-fg">{name.text}</span>
            <span className="text-small text-fg-muted">{title.text}</span>
          </div>
        </div>
      )}

      <p className="text-small text-fg-muted">{bio.text}</p>

      <details className="border-t border-hairline pt-3">
        <summary className="cursor-pointer list-none text-small text-fg underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
          View profile
        </summary>
        <ul className="mt-3 flex flex-col gap-1.5">
          {member.credentials.length > 0 ? (
            member.credentials.map((item) => (
              <li key={item} className="flex gap-2 text-small text-fg-muted">
                <span aria-hidden="true" className="text-fg-faint">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li className="text-small text-fg-faint">
              Profile details to be confirmed by the stakeholders.
            </li>
          )}
        </ul>
      </details>
    </div>
  );
}
