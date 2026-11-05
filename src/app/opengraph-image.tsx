import { renderOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";

// Required by `output: "export"`: this route is rendered once at build time.
export const dynamic = "force-static";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage();
}
