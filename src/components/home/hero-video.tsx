import Image from "next/image";
import type { StockVideo } from "@/content/stock-media";

interface HeroVideoProps {
  readonly video: StockVideo;
}

/**
 * Full-bleed hero background. The poster renders unconditionally
 * underneath the video (via next/image, priority — it's the LCP
 * candidate) as a loading frame and as the no-JS/failed-playback
 * fallback.
 *
 * Deliberate exception to CLAUDE.md's "every animation is off under
 * prefers-reduced-motion" rule: explicitly instructed to keep this loop
 * playing on every device regardless of the user's motion preference,
 * so there's no motion-reduce gate here on purpose.
 */
export function HeroVideo({ video }: HeroVideoProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-void">
      <Image
        src={video.poster}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={video.poster}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-void/65" />
    </div>
  );
}
