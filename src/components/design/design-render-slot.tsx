import Image from "next/image";
import { DESIGN_DISCLAIMER, type DesignRender } from "@/content/design";
import { mediaRegistry, isRenderable } from "@/content/media";

interface DesignRenderSlotProps {
  readonly render: DesignRender;
  /** Tighter type and label for the compact sections. */
  readonly compact?: boolean;
}

/**
 * The ONLY way a design render reaches the page — and it always stamps
 * DESIGN_DISCLAIMER beneath the image. There is deliberately no prop to
 * suppress or override the disclaimer: the caption is composed here as
 * `{render.caption}` + the fixed disclaimer line, so it is structurally
 * impossible to render a proposed visualisation without the "final
 * construction may vary" notice. Do not add a bypass. Do not render
 * design renders with a bare <Image>/<img> elsewhere.
 *
 * Until a real render lands, the image area is a deliberate labelled
 * diagram frame — a double-ruled frame with corner ticks and a mono
 * "DESIGN RENDER · to be issued" plate — so it reads as an intentional
 * placeholder, never a broken image. The box's aspect ratio is reserved
 * from the registry (real render) or a 16:9 default (pending), so
 * nothing shifts when artwork arrives.
 */
export function DesignRenderSlot({ render, compact = false }: DesignRenderSlotProps) {
  const asset = render.media ? mediaRegistry[render.media] : undefined;
  const showImage = asset !== undefined && isRenderable(asset);
  const aspectRatio = showImage ? `${asset.width} / ${asset.height}` : "16 / 9";

  return (
    <figure className="flex flex-col gap-3">
      <div className="relative w-full overflow-hidden border border-rule bg-sunk" style={{ aspectRatio }}>
        {showImage ? (
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-raised">
            {/* Inset inner rule — the "matte" of a drawing frame. */}
            <div className="absolute inset-2.5 border border-rule sm:inset-3" />
            {/* Corner registration ticks. */}
            <span aria-hidden="true" className="absolute top-2 left-2 h-3 w-3 border-t border-l border-ink-3" />
            <span aria-hidden="true" className="absolute top-2 right-2 h-3 w-3 border-t border-r border-ink-3" />
            <span aria-hidden="true" className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-ink-3" />
            <span aria-hidden="true" className="absolute right-2 bottom-2 h-3 w-3 border-r border-b border-ink-3" />
            {/* Centre plate. */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span className={`figure tracking-widest text-ink-3 uppercase ${compact ? "text-caption" : "text-small"}`}>
                Design render
              </span>
              <span className="text-caption text-ink-3">to be issued</span>
            </div>
          </div>
        )}
      </div>
      <figcaption className="flex flex-col gap-1">
        <span className={compact ? "text-caption text-ink-1" : "text-small text-ink-1"}>{render.caption}</span>
        <span className="text-caption text-ink-3">{DESIGN_DISCLAIMER}</span>
      </figcaption>
    </figure>
  );
}
