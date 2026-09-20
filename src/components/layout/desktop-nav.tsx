"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { usePathname } from "next/navigation";
import { primaryNav, type NavItem } from "@/content/navigation";
import { NavLink } from "./nav-link";
import { cn } from "@/lib/cn";

type OpenMode = "hover" | "pinned";
interface OpenState {
  readonly id: string;
  readonly mode: OpenMode;
}

/** Grace period so the pointer can cross the gap between trigger and panel without the menu flickering shut. */
const HOVER_CLOSE_DELAY_MS = 150;

function Chevron({ open }: { readonly open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={cn(
        "h-3 w-3 transition-transform duration-150 ease-out",
        open && "rotate-180",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

interface NavDropdownProps {
  readonly item: NavItem;
  readonly isOpen: boolean;
  /** Anchor the panel to the trigger's right edge instead of its left (last item, so it can't run off the bar). */
  readonly alignRight: boolean;
  readonly onHoverOpen: () => void;
  readonly onHoverClose: () => void;
  readonly onToggle: () => void;
  readonly onClose: () => void;
  readonly onPin: () => void;
}

/**
 * One top-level item with a dropdown. Two separate controls, so following the
 * link and opening the menu are never the same action: the label is a real
 * link to the parent's own page, and a chevron button beside it toggles the
 * sub-items (WAI-ARIA "disclosure navigation" pattern — aria-expanded +
 * aria-controls on the button, plain links in a list; NOT role="menu", which
 * would make screen readers announce menu items instead of links and switch
 * them into application-menu mode).
 *
 * Opens on mouse hover (with a short close delay), on chevron click/tap
 * (which "pins" it open — a click while hover-opened pins rather than
 * toggles it shut), and from the keyboard. Closes on Esc (focus returns to
 * the chevron), on focus leaving the item, on an outside click, and on route
 * change.
 */
function NavDropdown({
  item,
  isOpen,
  alignRight,
  onHoverOpen,
  onHoverClose,
  onToggle,
  onClose,
  onPin,
}: NavDropdownProps) {
  const panelId = useId();
  const wrapperRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  /** Set when the keyboard opens the menu, so focus moves into it once it is visible. */
  const pendingFocus = useRef<"first" | "last" | null>(null);

  const children = item.children ?? [];
  const sectionHrefs = children.map((child) => child.href);

  useLayoutEffect(() => {
    if (!isOpen || !pendingFocus.current) return;
    const links = panelRef.current?.querySelectorAll<HTMLAnchorElement>("a");
    if (links && links.length > 0) {
      (pendingFocus.current === "last" ? links[links.length - 1] : links[0]).focus();
    }
    pendingFocus.current = null;
  }, [isOpen]);

  function panelLinks(): HTMLAnchorElement[] {
    return Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    const target = event.target as HTMLElement;
    const inPanel = panelRef.current?.contains(target) ?? false;

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      onClose();
      buttonRef.current?.focus();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!inPanel) {
        // From the link or the chevron: open (pinned) and land on the first / last item.
        pendingFocus.current = event.key === "ArrowDown" ? "first" : "last";
        if (isOpen) {
          const links = panelLinks();
          if (links.length > 0) {
            (pendingFocus.current === "last" ? links[links.length - 1] : links[0]).focus();
          }
          pendingFocus.current = null;
        }
        onPin();
        return;
      }
      const links = panelLinks();
      const index = links.indexOf(target as HTMLAnchorElement);
      const step = event.key === "ArrowDown" ? 1 : -1;
      links[(index + step + links.length) % links.length]?.focus();
      return;
    }

    if (inPanel && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      const links = panelLinks();
      (event.key === "Home" ? links[0] : links[links.length - 1])?.focus();
    }
  }

  function handlePointerEnter(event: PointerEvent<HTMLLIElement>) {
    if (event.pointerType === "mouse") onHoverOpen();
  }

  function handlePointerLeave(event: PointerEvent<HTMLLIElement>) {
    if (event.pointerType === "mouse") onHoverClose();
  }

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        // Close when focus moves to something outside this item. A null
        // relatedTarget (focus went nowhere) is left to the outside-click
        // handler, so a click on non-focusable padding can't shut it.
        const next = event.relatedTarget as Node | null;
        if (next && !wrapperRef.current?.contains(next)) onClose();
      }}
    >
      <div className="flex items-center">
        <NavLink
          href={item.href}
          sectionHrefs={sectionHrefs}
          className="text-small font-medium"
          inactiveClass="text-fg-muted hover:text-accent"
        >
          {item.label}
        </NavLink>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={`${item.label} submenu`}
          onClick={onToggle}
          className="-my-2 flex h-9 w-7 items-center justify-center text-fg-muted transition-colors duration-150 ease-out hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Chevron open={isOpen} />
        </button>
      </div>

      {/* Always rendered, hidden with visibility (not display) so the
          open/close can fade — `invisible` also removes the links from the
          tab order and the accessibility tree while closed. The pt-3 is a
          bridge, not a margin: it keeps the pointer inside this item while
          it travels from the trigger down to the panel.

          `visibility` is transitioned ONLY on close, with a delay equal to the
          fade (so the panel stays until it has faded out). On open it flips at
          once: a visibility transition would leave it `hidden` for the first
          frame, and the keyboard path focuses the first link the moment the
          panel opens — focus() on a hidden element silently does nothing.
          150ms = --duration-fast, ease-out = --ease-out (globals.css). */}
      <div
        className={cn(
          "absolute top-full z-10 pt-3",
          alignRight ? "right-0" : "left-0",
          isOpen
            ? "visible translate-y-0 opacity-100 [transition:opacity_150ms_ease-out,transform_150ms_ease-out]"
            : "invisible -translate-y-1 opacity-0 [transition:opacity_150ms_ease-out,transform_150ms_ease-out,visibility_0s_linear_150ms]",
        )}
      >
        <ul
          ref={panelRef}
          id={panelId}
          className="min-w-[12.5rem] border border-hairline bg-surface-raised py-1 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.45)]"
        >
          {children.map((child) => (
            <li key={child.href}>
              <NavLink
                href={child.href}
                onClick={onClose}
                className="block px-4 py-2.5 text-small font-medium"
                inactiveClass="text-fg hover:bg-surface-sunk hover:text-accent"
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/**
 * The desktop (lg and up) top-bar nav: plain links for single pages and a
 * NavDropdown for each parent. Open state is held HERE, one value for the
 * whole bar, so at most one dropdown is ever open — hovering or opening a
 * second one replaces the first rather than stacking a pinned menu under a
 * hovered one.
 */
export function DesktopNav() {
  const [open, setOpen] = useState<OpenState | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearCloseTimer();
    setOpen(null);
  }, [clearCloseTimer]);

  // Close on navigation.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // An outside pointer press closes an open menu (covers pinned menus, which
  // hover-leave deliberately leaves alone).
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: globalThis.PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  const lastDropdownIndex = primaryNav.reduce(
    (last, item, index) => (item.children ? index : last),
    -1,
  );

  return (
    <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-5 xl:gap-6">
        {primaryNav.map((item, index) => {
          if (!item.children) {
            return (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="text-small font-medium"
                  inactiveClass="text-fg-muted hover:text-accent"
                >
                  {item.label}
                </NavLink>
              </li>
            );
          }
          const id = item.href;
          const isOpen = open?.id === id;
          return (
            <NavDropdown
              key={id}
              item={item}
              isOpen={isOpen}
              alignRight={index === lastDropdownIndex}
              onHoverOpen={() => {
                clearCloseTimer();
                // Hover never demotes a pinned menu of the same item, and
                // replaces whichever other menu was open.
                setOpen((current) =>
                  current?.id === id && current.mode === "pinned" ? current : { id, mode: "hover" },
                );
              }}
              onHoverClose={() => {
                clearCloseTimer();
                closeTimer.current = window.setTimeout(() => {
                  setOpen((current) => (current?.id === id && current.mode === "hover" ? null : current));
                }, HOVER_CLOSE_DELAY_MS);
              }}
              onToggle={() => {
                clearCloseTimer();
                // Hover-open → click pins it; pinned → click closes; closed → click pins.
                setOpen((current) =>
                  current?.id === id && current.mode === "pinned" ? null : { id, mode: "pinned" },
                );
              }}
              onPin={() => {
                clearCloseTimer();
                setOpen({ id, mode: "pinned" });
              }}
              onClose={close}
            />
          );
        })}
      </ul>
    </nav>
  );
}
