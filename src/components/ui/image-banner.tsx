import Image from "next/image";
import type { StockImage } from "@/content/stock-media";
import { cn } from "@/lib/cn";

interface ImageBannerProps {
  readonly image: StockImage;
  readonly className?: string;
}

/**
 * Full-bleed banner for stock construction photography — breaks the
 * max-w-5xl content column on purpose (see CLAUDE.md "break the black").
 * Desaturated + darkened grade, not a lime duotone: lime is a signal
 * colour and is never a background wash, even a subtle one.
 */
export function ImageBanner({ image, className }: ImageBannerProps) {
  return (
    <div className={cn("relative h-64 w-full overflow-hidden bg-sunk sm:h-96 md:h-[32rem]", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        className="object-cover [filter:grayscale(0.35)_contrast(1.05)_brightness(0.6)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/10" />
    </div>
  );
}
