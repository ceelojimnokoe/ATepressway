import Image from "next/image";
import type { BoardMember } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";
import { cn } from "@/lib/cn";

type CardVariant = "compact" | "feature";

function resolveText(value: string | { readonly fallback: string }): string {
  return isPlaceholder(value as string) ? (value as { readonly fallback: string }).fallback : (value as string);
}

function resolveBio(
  value: readonly string[] | { readonly fallback: readonly string[] },
): readonly string[] {
  return isPlaceholder(value as readonly string[])
    ? (value as { readonly fallback: readonly string[] }).fallback
    : (value as readonly string[]);
}

/**
 * One board seat. Data-driven: every member is a record in project.ts, so
 * this card is written once. A supplied portrait renders through next/image
 * (reserved square box → no layout shift); a member without a photo gets a
 * tasteful initials avatar — never a fake photo, never a broken image.
 *
 * The full biography lives inside a native <details> disclosure ("View
 * profile"), so long bios never blow out the card or overflow the viewport —
 * they expand in place and the page scrolls. `variant="feature"` (used on
 * /stakeholders) leads with a large square portrait; `compact` (the home
 * preview) keeps a small inline avatar. The Chairman gets a subtle badge.
 */
export function BoardMemberCard({
  member,
  variant = "compact",
}: {
  readonly member: BoardMember;
  readonly variant?: CardVariant;
}) {
  const name = resolveText(member.name);
  const bio = resolveBio(member.bio);
  const feature = variant === "feature";

  const avatar = member.photo ? (
    <Image
      src={member.photo.src}
      alt={member.photo.alt}
      fill
      sizes={feature ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" : "64px"}
      className="object-cover object-top"
    />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "figure flex h-full w-full items-center justify-center text-fg-muted",
        feature ? "text-heading-1" : "text-heading-4",
      )}
    >
      {member.initials}
    </span>
  );

  return (
    <div className="flex h-full flex-col gap-5 border border-hairline bg-surface-raised p-6">
      {feature ? (
        <>
          <div className="relative aspect-square w-full overflow-hidden border border-hairline bg-surface-sunk">
            {avatar}
          </div>
          <div className="flex flex-col gap-2">
            {member.isChairman && (
              <span className="w-fit border border-accent bg-lime px-2 py-0.5 text-caption tracking-wide text-void uppercase">
                Chairman
              </span>
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-heading-4 text-fg">{name}</h3>
              <span className="text-small text-fg-muted">{member.role}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-hairline bg-surface-sunk">
            {avatar}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body text-fg">{name}</span>
              {member.isChairman && (
                <span className="border border-accent bg-lime px-1.5 py-0.5 text-caption tracking-wide text-void uppercase">
                  Chair
                </span>
              )}
            </div>
            <span className="text-small text-fg-muted">{member.role}</span>
          </div>
        </div>
      )}

      <details className="border-t border-hairline pt-3">
        <summary className="cursor-pointer list-none py-1 text-small text-fg underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
          View profile
        </summary>
        <div className="mt-3 flex flex-col gap-3 text-small text-fg-muted">
          {bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </details>
    </div>
  );
}
