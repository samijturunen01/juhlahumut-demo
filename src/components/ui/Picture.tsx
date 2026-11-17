import type { CSSProperties } from 'react';
import { imageManifest, type ImageSlug } from '@/data/images.generated';
import { imageSrcSet, largestImage } from '@/lib/assets';

interface PictureProps {
  slug: ImageSlug;
  alt: string;
  /** The rendered width of the image at each breakpoint – lets the browser pick the smallest sufficient file. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Above-the-fold image: load eagerly with high priority. Everything else is lazy. */
  priority?: boolean;
  /** CSS object-position, for art-directed crops inside a fixed frame. */
  position?: string;
  /**
   * Aspect ratio (width / height) of the frame the photo is cover-cropped into. When the photo is
   * wider than its frame, only part of it is visible, so a larger file is needed for the same
   * sharpness – the `sizes` hint is scaled up accordingly.
   */
  frameAspect?: number;
  style?: CSSProperties;
}

/**
 * Responsive, layout-stable photograph.
 * AVIF first, WebP fallback; intrinsic width/height reserve the space, and a
 * 16px blurred preview of the same photo sits behind it until it has loaded.
 */
export function Picture({ slug, alt, sizes, className, imgClassName, priority = false, position, style, frameAspect }: PictureProps) {
  const meta = imageManifest[slug];
  sizes = frameAspect ? scaleSizes(sizes, meta.width / meta.height / frameAspect) : sizes;
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={imageSrcSet(slug, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={imageSrcSet(slug, 'webp')} sizes={sizes} />
      <img
        src={largestImage(slug)}
        alt={alt}
        width={meta.width}
        height={meta.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className={imgClassName}
        style={{
          backgroundColor: meta.color,
          backgroundImage: `url(${meta.lqip})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          objectPosition: position,
        }}
      />
    </picture>
  );
}

/** Multiplies every vw / px length in a `sizes` attribute by `factor` (only ever upwards). */
function scaleSizes(sizes: string, factor: number): string {
  if (factor <= 1.05) return sizes;
  // Lengths inside media conditions, e.g. "(min-width: 1024px)", are left alone.
  return sizes.replace(/(\d+(?:\.\d+)?)(vw|px)(?![^(]*\))/g, (_, n: string, unit: string) => `${Math.round(Number(n) * factor)}${unit}`);
}
