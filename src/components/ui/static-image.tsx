import Image, { type ImageProps } from "next/image";
import { imageManifest } from "@/content/image-manifest";

export default function StaticImage(props: ImageProps) {
  const entry = typeof props.src === "string" ? imageManifest[props.src] : undefined;
  if (!entry) return <Image {...props} alt={props.alt} />;

  const srcSet = entry.widths.map((width) => `/img/${entry.stem}-${width}.avif ${width}w`).join(", ");
  const sizes = props.sizes ?? (props.width != null ? `${props.width}px` : props.fill ? "100vw" : undefined);
  const { priority, ...imageProps } = props;

  return (
    <>
      {priority && (
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href={`/img/${entry.stem}-${entry.widths[0]}.avif`}
          imageSrcSet={srcSet}
          imageSizes={sizes}
          fetchPriority={props.fetchPriority}
        />
      )}
      <picture>
        <source type="image/avif" srcSet={srcSet} sizes={sizes} />
        <Image {...imageProps} alt={props.alt} />
      </picture>
    </>
  );
}
