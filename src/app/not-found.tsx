import Link from "next/link";

/**
 * Root 404. Rendered inside the root layout (fonts + globals), so it uses
 * the normal design tokens. It sits outside the (site) route group, so it
 * has no SiteHeader/Footer — a deliberately spare dead-end with one way
 * back.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center bg-void">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-8">
        <span className="figure text-figure text-ink-2">404</span>
        <h1 className="text-heading-3 text-ink-1">Page not found</h1>
        <p className="max-w-md text-body text-ink-2">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <Link href="/" className="w-fit text-small text-ink-1 underline underline-offset-4">
          Return home →
        </Link>
      </div>
    </main>
  );
}
