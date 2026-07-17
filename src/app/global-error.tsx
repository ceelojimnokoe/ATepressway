"use client";

/**
 * Custom 500 / root error boundary. This replaces the root layout when the
 * layout itself throws, so it must render its own <html>/<body> and can't
 * rely on globals.css being applied — hence self-contained inline styles
 * using the same token hex values as globals.css.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#030303",
          color: "#f5f5f3",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
        }}
      >
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 64, color: "#a8a8a3" }}>
            500
          </span>
          <h1 style={{ fontSize: 32, margin: 0, lineHeight: 1.2 }}>Something went wrong</h1>
          <p style={{ fontSize: 16, color: "#a8a8a3", margin: 0, lineHeight: 1.6 }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              width: "fit-content",
              border: "1px solid #232323",
              backgroundColor: "#121212",
              color: "#f5f5f3",
              padding: "12px 24px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
