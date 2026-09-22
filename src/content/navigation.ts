/**
 * Primary site navigation, shared by SiteHeader (desktop bar + mobile menu)
 * and SiteFooter (src/components/layout/).
 *
 * Restructured 20 Sept 2026 (client instruction) from 9 flat items to 7
 * top-level items, with a tenth page (Investment Info) added:
 *
 *   Home · About ▾ · The Project ▾ · Progress · Gallery · Stakeholders · Contact ▾
 *
 *   About        → About Us, Investment Info
 *   The Project  → Project, Design
 *   Contact      → Contact, FAQ
 *
 * ⚠ Investment Info REMOVED from "About" below, 22 Sept 2026 (pre-launch
 * review, Stage 0) — the client has not approved that page's wording yet, so
 * it must not be publicly reachable or linked to at launch. The page, its
 * route, and its content are all UNTOUCHED and still live at /investment by
 * direct URL (see src/app/(site)/investment/page.tsx and
 * src/content/investment.ts) — only the link to it, here, is gone. With
 * Investment Info gone, "About" has no second child, so it is written below
 * as a plain item (no `children`), same shape as Progress/Gallery/
 * Stakeholders, exactly as it was before the 20 Sept restructure ever added
 * a dropdown to it. To bring the page back: re-add the `children` array
 * below (About Us + Investment Info, as in git history for this file before
 * this comment) and remove `draft: true` from `routes.investment` in
 * content/seo.ts once the client approves the copy — see the header comment
 * on `investmentContent` in content/investment.ts.
 *
 * A parent with `children` is ALWAYS also a real link: its own `href` is a
 * page you land on by clicking it (The Project → /project, Contact →
 * /contact), never a menu-only trigger. In the header the dropdown is opened
 * by a separate chevron button beside that link, so opening the menu and
 * following the link are two different, unambiguous controls. Each parent's
 * first child is that same page, so the dropdown lists every page in the
 * group, including the parent's own.
 *
 * Below `lg` the header collapses this list into the hamburger menu; the
 * same split control (link + expand button) is used there, with the
 * sub-items expanding inline.
 */

export interface NavChild {
  readonly label: string;
  readonly href: string;
}

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly children?: readonly NavChild[];
}

export const primaryNav: readonly NavItem[] = [
  { label: "Home", href: "/" },
  // Plain link, not a dropdown — see the header comment above (Investment
  // Info removed pending approval; "About Us" is this item's pre-restructure
  // label, restored because a one-item dropdown would be pointless).
  { label: "About Us", href: "/about" },
  {
    label: "The Project",
    href: "/project",
    children: [
      { label: "Project", href: "/project" },
      { label: "Design", href: "/design" },
    ],
  },
  { label: "Progress", href: "/progress" },
  { label: "Gallery", href: "/gallery" },
  { label: "Stakeholders", href: "/stakeholders" },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
] as const;

/**
 * Every page as a flat list, in nav order — a parent with children is
 * replaced by its children (whose first entry is the parent's own page), so
 * this is exactly the ten public pages. Used by the footer, which has no
 * dropdowns and should list every page rather than only the seven headings.
 */
export const allNavPages: readonly NavChild[] = primaryNav.flatMap((item) =>
  item.children ? item.children : [{ label: item.label, href: item.href }],
);
