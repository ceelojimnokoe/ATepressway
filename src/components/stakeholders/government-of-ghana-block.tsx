import Image from "next/image";
import { mediaRegistry } from "@/content/media";
import { governmentOfGhana, contractingAuthorityOfficeHolders } from "@/content/project";
import { BoardMemberCard } from "./board-member-card";

/**
 * The Government of Ghana entry — one shared block rendered on Home
 * ("08 — Delivery"), /stakeholders (first in the delivery chain) and, since
 * 23 Oct 2026, /about, reading from the single `governmentOfGhana` content
 * export so none of the three ever drift apart. Header row (role caption,
 * linked title, gloss, logo) matches StakeholderOrg's own name+logo layout
 * exactly (client instruction, 4 Sept 2026) — same position, same link
 * styling — so this reads as one more entry in the same visual language,
 * not a one-off.
 *
 * `showOfficeHolders` (client instruction, 21 Oct 2026) adds the three
 * current office-holder cards (content/project.ts,
 * contractingAuthorityOfficeHolders). Defaults to false/unset so Home —
 * which renders this block with no props — is unaffected; /stakeholders
 * and /about both pass it.
 *
 * Layout restructured 23 Oct 2026 (client instruction — "the President
 * can't share a line with the ministers"): the first entry in
 * `contractingAuthorityOfficeHolders` (the President) renders alone on its
 * own centred row at every width; the rest of the array renders below it in
 * a row that stacks to one column at 360px and two columns from `sm`
 * upward, in array order. This replaced the generic multi-column Roster
 * grid StakeholderOrg uses elsewhere, which can't produce a "one alone,
 * others below" layout — BoardMemberCard itself (photo/name/role only) is
 * unchanged, only its container here is bespoke to this one block.
 */
export function GovernmentOfGhanaBlock({
  showOfficeHolders = false,
}: {
  readonly showOfficeHolders?: boolean;
} = {}) {
  const logo = mediaRegistry[governmentOfGhana.logo];
  const supportingLogos = governmentOfGhana.supportingLogos.map((key) => mediaRegistry[key]);

  return (
    <div className="flex flex-col gap-5 border border-hairline bg-surface-raised p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-caption text-fg-faint tracking-wide uppercase">
            {governmentOfGhana.subtitle}
          </span>
          <h3 className="text-heading-4 text-fg">
            <a
              href={governmentOfGhana.website}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {governmentOfGhana.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </h3>
          <p className="max-w-2xl text-small text-fg-muted">{governmentOfGhana.paragraph}</p>
        </div>
        <div className="flex h-16 w-fit max-w-full shrink-0 items-center bg-paper px-5">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-9 w-auto max-w-full object-contain"
          />
        </div>
      </div>

      {supportingLogos.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
          {supportingLogos.map((supportingLogo) => (
            <div key={supportingLogo.src} className="flex h-14 w-fit max-w-full items-center bg-paper px-4">
              <Image
                src={supportingLogo.src}
                alt={supportingLogo.alt}
                width={supportingLogo.width}
                height={supportingLogo.height}
                className="h-8 w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      )}

      {showOfficeHolders && contractingAuthorityOfficeHolders.length > 0 && (
        <div className="flex flex-col gap-5 border-t border-hairline pt-5">
          <span className="text-caption text-fg-faint tracking-wide uppercase">Government office holders</span>
          <div className="mx-auto w-1/2 max-w-[11rem] sm:max-w-[13rem]">
            <BoardMemberCard member={contractingAuthorityOfficeHolders[0]} />
          </div>
          {contractingAuthorityOfficeHolders.length > 1 && (
            <ul className="mx-auto grid w-full max-w-xl grid-cols-1 gap-5 sm:grid-cols-2">
              {contractingAuthorityOfficeHolders.slice(1).map((person) => (
                <li key={person.name}>
                  <BoardMemberCard member={person} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
