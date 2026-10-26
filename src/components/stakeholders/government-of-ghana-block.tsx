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
          {/*
           * CARD_WIDTH below (12rem / 14rem from `sm`) is applied identically
           * to the President's solo wrapper and to each minister's `li` — the
           * one shared size both reads from. Previously the President's
           * wrapper capped at 11rem/13rem while the ministers sat in a
           * `grid-cols-2` whose cells stretched to ~17.4rem, so his card
           * rendered visibly smaller even though BoardMemberCard itself
           * (aspect-square + object-cover) is identical for all three — the
           * mismatch was purely this container sizing, now fixed by using
           * the same fixed max-width everywhere instead of a stretchy grid
           * for the pair below him (client-reported, 24 Oct 2026; measured
           * before/after in the report).
           */}
          <div className="mx-auto flex w-full max-w-[12rem] flex-col items-center sm:max-w-[14rem]">
            <BoardMemberCard member={contractingAuthorityOfficeHolders[0]} />
          </div>
          {contractingAuthorityOfficeHolders.length > 1 && (
            // items-start (not items-center) — client-reported, 26 Oct 2026:
            // the two ministers' names/roles don't always wrap to the same
            // number of lines (today, "Minister for Roads & Highways" runs
            // longer than "Minister for Finance"), which made their card
            // heights differ; items-center then centred each card within
            // the row and put the two PHOTOS out of vertical alignment by
            // half that difference — confirmed by measuring both images'
            // top offset before this fix, not assumed. items-start pins
            // both photos to the same top edge regardless of text length,
            // and reserveTextHeight below (BoardMemberCard) keeps the two
            // cards the same overall height too.
            <ul className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-center">
              {contractingAuthorityOfficeHolders.slice(1).map((person) => (
                <li key={person.name} className="w-full max-w-[12rem] sm:max-w-[14rem]">
                  <BoardMemberCard member={person} reserveTextHeight={80} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
