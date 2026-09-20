"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/content/navigation";
import { NavLink } from "./nav-link";
import { cn } from "@/lib/cn";

/** Does the current route belong to this parent (its own page or any child's)? */
function isInGroup(pathname: string, hrefs: readonly string[]): boolean {
  return hrefs.some((href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)));
}

/**
 * The link list inside the hamburger menu (below `lg`). No hover anywhere:
 * every parent is a real link to its own page PLUS a separate chevron button
 * that expands its sub-items inline, in place — the existing mobile menu
 * stays a single vertical list, with no second panel or nested-menu
 * mechanism. Both controls are at least 48px tall/wide (the row height the
 * menu already used).
 *
 * The menu unmounts when closed, so this component's state is fresh every
 * time it opens — and it opens with the group containing the current page
 * already expanded, so a visitor on /design sees "The Project" open with
 * Design marked as the current page.
 */
export function MobileNavList({ onNavigate }: { readonly onNavigate: () => void }) {
  const pathname = usePathname();
  const [expandedId, setExpandedId] = useState<string | null>(() => {
    const active = primaryNav.find(
      (item) => item.children && isInGroup(pathname, [item.href, ...item.children.map((child) => child.href)]),
    );
    return active ? active.href : null;
  });

  return (
    <ul className="mx-auto flex w-full max-w-5xl flex-col px-4 py-2 sm:px-8">
      {primaryNav.map((item) => {
        const children = item.children;
        if (!children) {
          return (
            <li key={item.href} className="border-b border-hairline last:border-b-0">
              <NavLink
                href={item.href}
                onClick={onNavigate}
                className="block py-3 text-body font-medium"
                inactiveClass="text-fg hover:text-accent"
              >
                {item.label}
              </NavLink>
            </li>
          );
        }

        const expanded = expandedId === item.href;
        const subListId = `mobile-sub-${item.href.replace("/", "")}`;
        return (
          <li key={item.href} className="border-b border-hairline last:border-b-0">
            <div className="flex items-stretch">
              <NavLink
                href={item.href}
                sectionHrefs={children.map((child) => child.href)}
                onClick={onNavigate}
                className="block flex-1 py-3 text-body font-medium"
                inactiveClass="text-fg hover:text-accent"
              >
                {item.label}
              </NavLink>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={expanded ? subListId : undefined}
                aria-label={`${item.label} submenu`}
                onClick={() => setExpandedId(expanded ? null : item.href)}
                className="flex w-12 shrink-0 items-center justify-center text-fg-muted transition-colors duration-150 ease-out hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  className={cn("h-3.5 w-3.5 transition-transform duration-150 ease-out", expanded && "rotate-180")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 4.5 6 8l3.5-3.5" />
                </svg>
              </button>
            </div>
            {/* Rendered only while expanded — display:none semantics, so the
                collapsed links are out of the tab order and the a11y tree. */}
            {expanded && (
              <ul id={subListId} className="mb-2 flex flex-col border-l border-hairline pl-4">
                {children.map((child) => (
                  <li key={child.href}>
                    <NavLink
                      href={child.href}
                      onClick={onNavigate}
                      className="block py-3 text-body"
                      inactiveClass="text-fg-muted hover:text-accent"
                    >
                      {child.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
