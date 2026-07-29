"use client";

import { Component, type ReactNode } from "react";

interface SafeBoundaryProps {
  readonly children: ReactNode;
  /** Rendered instead of the children if they throw. Defaults to nothing. */
  readonly fallback?: ReactNode;
  readonly label?: string;
}

interface SafeBoundaryState {
  readonly hasError: boolean;
}

/**
 * Minimal client error boundary. If its children throw — including during
 * hydration — it renders `fallback` (nothing by default) instead of letting
 * the error bubble up and take down the rest of the page.
 *
 * Used to isolate the gallery's interactive leaves (the filter and the
 * lightbox). The server-rendered grid is a SIBLING of these boundaries, not
 * a child, so even if an interactive leaf fails to hydrate, the gallery
 * images remain fully visible. This is the safety net for the class of
 * failure where the gallery renders on the server but a client component
 * throws on the browser.
 */
export class SafeBoundary extends Component<SafeBoundaryProps, SafeBoundaryState> {
  state: SafeBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SafeBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Logged in every environment (browser console only) so that if an
    // interactive leaf still fails after deployment, the real error is
    // visible for diagnosis even though the page keeps working.
    console.error(`[gallery] ${this.props.label ?? "component"} failed to render:`, error);
  }

  render() {
    return this.state.hasError ? (this.props.fallback ?? null) : this.props.children;
  }
}
