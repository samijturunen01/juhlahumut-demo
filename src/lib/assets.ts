import { imageManifest, type ImageSlug } from '@/data/images.generated';

/** Resolves a file in /public against the configured base path (GitHub Pages serves from a sub-folder). */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const imageUrl = (slug: ImageSlug, width: number, ext: 'avif' | 'webp') => asset(`images/${slug}-${width}.${ext}`);

export const imageSrcSet = (slug: ImageSlug, ext: 'avif' | 'webp'): string =>
  imageManifest[slug].widths.map((w) => `${imageUrl(slug, w, ext)} ${w}w`).join(', ');

export const largestImage = (slug: ImageSlug, ext: 'avif' | 'webp' = 'webp'): string => {
  const widths = imageManifest[slug].widths;
  return imageUrl(slug, widths[widths.length - 1] as number, ext);
};
