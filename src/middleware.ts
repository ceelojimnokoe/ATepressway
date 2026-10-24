import { NextResponse, type NextRequest } from "next/server";

/**
 * Redirects the old flat Gallery's `?page=N` and `?category=…` URLs to
 * plain `/gallery` (client instruction, 24 Oct 2026 — folders replaced both
 * pagination and the category filter, so neither param means anything now).
 * These were real, possibly-shared/bookmarked links, so a redirect rather
 * than letting them 404 or silently rendering the new page with a stale
 * query string attached.
 *
 * Deliberately in middleware, not in the page itself: a Server Component
 * that reads `searchParams` opts out of static prerendering, and the
 * Gallery index has no other reason to be dynamic.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === "/gallery" && (searchParams.has("page") || searchParams.has("category"))) {
    return NextResponse.redirect(new URL("/gallery", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/gallery",
};
