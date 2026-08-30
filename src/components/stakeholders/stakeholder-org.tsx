import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import type { OrgPerson, Stakeholder } from "@/content/project";
import { BoardMemberCard } from "./board-member-card";

/**
 * One organisation in the delivery chain, with its board representation nested
 * beneath it. The name/logo links to the organisation's own site in a new tab
 * where the client supplied a URL.
 *
 * IMPORTANT framing: everyone in `members` is a director of A.T. Expressway
 * Ltd. The nesting groups them by the body they come from — it does NOT claim
 * they sit on that body's own board. The heading says "represented on the ATEL
 * Board by" for exactly that reason; do not shorten it to "Board members".
 */
export function StakeholderOrg({
  stakeholder,
  members,
  executives = [],
  membersLabel = "Represented on the ATEL Board by",
}: {
  readonly stakeholder: Stakeholder;
  readonly members: readonly OrgPerson[];
  /** Executive leadership, listed above the main roster under its own heading. */
  readonly executives?: readonly OrgPerson[];
  /** Heading for the main roster — differs per organisation. */
  readonly membersLabel?: string;
}) {
  const logo = stakeholder.logo ? mediaRegistry[stakeholder.logo] : null;
  const nameInner = stakeholder.website ? (
    <a
      href={stakeholder.website}
      target="_blank"
      rel="noreferrer noopener"
      className="underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {stakeholder.name}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    stakeholder.name
  );

  return (
    <div className="flex flex-col gap-5 border border-hairline bg-surface-raised p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-caption text-fg-faint tracking-wide uppercase">{stakeholder.role}</span>
          <h3 className="text-heading-4 text-fg">{nameInner}</h3>
          <p className="max-w-2xl text-small text-fg-muted">{stakeholder.gloss}</p>
        </div>
        {logo && (
          <div className="flex h-16 w-fit max-w-full shrink-0 items-center bg-paper px-5">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-9 w-auto max-w-full object-contain"
            />
          </div>
        )}
      </div>

      {executives.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-hairline pt-5">
          <span className="text-caption text-fg-faint tracking-wide uppercase">
            Executive leadership
          </span>
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {executives.map((person) => (
              <li key={person.name}>
                <BoardMemberCard member={person} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {members.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-hairline pt-5">
          <span className="text-caption text-fg-faint tracking-wide uppercase">
            {membersLabel}
          </span>
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {members.map((member) => (
              <li key={member.name}>
                <BoardMemberCard member={member} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
