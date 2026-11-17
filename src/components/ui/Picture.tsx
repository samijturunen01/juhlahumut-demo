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
  style?: CSSProperties;
}

/**
 * Responsive, layout-stable photograph.
 * AVIF first, WebP fallback; intrinsic width/height reserve the space, and a
 * 16px blurred preview of the same photo sits behind it until it has loaded.
 */
export function Picture({ slug, alt, sizes, className, imgClassName, priority = false, position, style }: PictureProps) {
  const meta = imageManifest[slug];
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
