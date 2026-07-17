import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { organization, projectFacts, progress } from "@/content/project";
import { isPlaceholder } from "@/content/placeholder";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Rendered through Satori (next/og) — a separate pipeline from the site's
 * normal CSS. It can't resolve our @theme custom properties or load
 * next/font's files, so this is the one deliberate exception to "tokens
 * only": the hex values are copied verbatim from globals.css.
 *
 * The background is the client's real corridor aerial (a 1200×630 crop of
 * hero-corridor-aerial.jpg, committed as og-hero-bg.jpg), read from disk
 * and embedded so it resolves at build time without a running server.
 * Text is drawn straight from content — no stale or placeholder figures.
 */
const bgDataUri = `data:image/jpeg;base64,${readFileSync(
  join(process.cwd(), "public/images/og-hero-bg.jpg"),
).toString("base64")}`;

export function renderOgImage() {
  const pct = isPlaceholder(progress.overallPercentComplete)
    ? null
    : progress.overallPercentComplete;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          backgroundColor: "#030303",
          backgroundImage: `url(${bgDataUri})`,
          backgroundSize: "1200px 630px",
        }}
      >
        {/* Darkening for text legibility — heaviest at the bottom where the text sits. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            backgroundImage:
              "linear-gradient(to top, rgba(3,3,3,0.94), rgba(3,3,3,0.5) 55%, rgba(3,3,3,0.15))",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ fontSize: 26, color: "#A8A8A3", textTransform: "uppercase", letterSpacing: 4 }}>
            {organization.shortName}
          </div>
          <div style={{ display: "flex", fontSize: 60, color: "#F5F5F3", marginTop: 20, lineHeight: 1.1 }}>
            Accra–Tema Motorway reconstruction
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 32, fontFamily: "monospace", fontSize: 34 }}>
            {pct !== null && <span style={{ color: "#C8F31D" }}>{pct}% complete</span>}
            {pct !== null && <span style={{ color: "#6B6B67" }}>·</span>}
            <span style={{ color: "#F5F5F3" }}>{projectFacts.corridorLengthKm} km corridor</span>
          </div>
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  );
}
