import { ImageResponse } from "next/og";
import { organization, projectFacts } from "@/content/project";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Rendered through Satori (next/og) — a separate pipeline from the
 * site's normal CSS. It can't resolve our @theme custom properties or
 * load next/font's generated font files, so this is the one deliberate
 * exception to "tokens only": the hex values below are copied verbatim
 * from globals.css, and the font stays a generic sans-serif/monospace
 * rather than Geist, to avoid the complexity of loading raw font bytes
 * for one image. Real data (corridor length, investment), not a stock
 * photo or a placeholder graphic — this is what "a real OG image" means
 * given the site has no confirmed photography yet.
 */
// "≈" (U+2248) isn't covered by Satori's default font here — it rendered
// as a missing-glyph box, confirmed by actually looking at the output.
// Swapped for a plain-ASCII "~" in this one rendering context only;
// projectFacts.investmentDisplay itself is untouched.
const investmentDisplay = projectFacts.investmentDisplay.replace("≈", "~");

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          backgroundColor: "#030303",
          color: "#F5F5F3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#A8A8A3", textTransform: "uppercase", letterSpacing: 4 }}>
          {organization.shortName}
        </div>
        <div style={{ display: "flex", fontSize: 56, marginTop: 28, lineHeight: 1.15, maxWidth: 900 }}>
          Accra–Tema Motorway reconstruction
        </div>
        <div style={{ display: "flex", gap: 48, marginTop: 56, fontFamily: "monospace" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 40, color: "#C8F31D" }}>
              {projectFacts.corridorLengthKm}km
            </div>
            <div style={{ display: "flex", fontSize: 20, color: "#A8A8A3", marginTop: 8 }}>corridor</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 40, color: "#C8F31D" }}>{investmentDisplay}</div>
            <div style={{ display: "flex", fontSize: 20, color: "#A8A8A3", marginTop: 8 }}>investment</div>
          </div>
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  );
}
