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
 * A parent with `children` is ALWAYS also a real link: its own `href` is a
 * page you land on by clicking it (About → /about, The Project → /project,
 * Contact → /contact), never a menu-only trigger. In the header the dropdown
 * is opened by a separate chevron button beside that link, so opening the
 * menu and following the link are two different, unambiguous controls. Each
 * parent's first child is that same page, so the dropdown lists every page
 * in the group, including the parent's own.
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
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Investment Info", href: "/investment" },
    ],
  },
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
