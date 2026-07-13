"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/content/navigation";

interface MobileNavProps {
  readonly items: readonly NavItem[];
}

/** The one interactive leaf in the header — everything else in SiteHeader is static markup. */
export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-list"
        className="border border-rule px-3 py-1.5 text-caption text-ink-1 uppercase tracking-wide"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <nav id="mobile-nav-list" aria-label="Primary" className="absolute inset-x-0 top-full bg-void">
          <ul className="flex flex-col border-t border-rule">
            {items.map((item) => (
              <li key={item.href} className="border-b border-rule">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-body text-ink-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
