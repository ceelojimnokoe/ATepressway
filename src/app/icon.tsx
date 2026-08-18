import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Favicon, generated from the real ATEL logo (public/images/atel-logo.png)
 * rather than a static drop-in, so Next emits a properly-sized icon and the
 * matching <link> tag. The logo sits, contained, on a white plate that
 * matches its own baked-in white ground. Apple touch icon is a sibling
 * (apple-icon.tsx) at 180×180.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const logo = await readFile(join(process.cwd(), "public/images/atel-logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={29} height={24} alt="" />
      </div>
    ),
    { ...size },
  );
}
