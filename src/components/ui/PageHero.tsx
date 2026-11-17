import type { ReactNode } from 'react';
import type { ImageSlug } from '@/data/images.generated';
import { Picture } from './Picture';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  image?: { slug: ImageSlug; alt: string; position?: string };
  children?: ReactNode;
}

/** Opening band shared by the sub-pages: large editorial title, optional photograph, the brand's amber disc as light. */
export function PageHero({ eyebrow, title, lede, image, children }: PageHeroProps) {
  return (
    <section className="theme-night grain relative isolate overflow-clip">
      <div className="disc-glow -right-[18vw] top-[12%] -z-10 h-[34vw] w-[92vw] opacity-70 lg:h-[24vw] lg:w-[64vw]" aria-hidden="true" />
      <div className="shell relative z-10 grid items-end gap-x-10 gap-y-10 pb-14 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:pb-20 lg:pt-[calc(var(--header-h)+5.5rem)]">
        <div className={image ? 'lg:col-span-7' : 'lg:col-span-9'}>
          <p className="eyebrow" data-reveal="up">
            {eyebrow}
          </p>
          <h1 className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
            {title}
          </h1>
          {lede && (
            <p className="lede mt-7 max-w-[38rem]" data-reveal="up" data-reveal-delay="0.12">
              {lede}
            </p>
          )}
          {children && (
            <div className="mt-9" data-reveal="up" data-reveal-delay="0.18">
              {children}
            </div>
          )}
        </div>
        {image && (
          <div className="lg:col-span-5">
            <div className="frame aspect-[4/3] rounded-tl-[clamp(3rem,9vw,7.5rem)] lg:aspect-[5/4]" data-reveal="mask">
              <Picture slug={image.slug} alt={image.alt} position={image.position} priority sizes="(min-width: 1024px) 40vw, 100vw" frameAspect={1.25} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
