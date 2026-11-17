import { useMemo, useState } from 'react';
import { ArrowUpRight, Expand } from 'lucide-react';
import { Lightbox } from '@/components/gallery/Lightbox';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { Picture } from '@/components/ui/Picture';
import { company } from '@/data/company';
import { galleryCategories, galleryItems, type GalleryCategory } from '@/data/gallery';

type Filter = GalleryCategory | 'kaikki';

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>('kaikki');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(() => (filter === 'kaikki' ? galleryItems : galleryItems.filter((item) => item.category === filter)), [filter]);
  const counts = useMemo(() => {
    const result: Record<string, number> = { kaikki: galleryItems.length };
    for (const item of galleryItems) result[item.category] = (result[item.category] ?? 0) + 1;
    return result;
  }, []);
  const activeLabel = galleryCategories.find((c) => c.id === filter)?.label ?? '';

  return (
    <>
      <PageHero
        eyebrow="Galleria"
        title={
          <>
            Katso, missä <em>juhlitaan.</em>
          </>
        }
        lede="Kaikki kuvat ovat Juhlahumujen omista tiloista: alakerran sali ja avotakka, tunnelmavalaistu saunaosasto ja yläkerran pelitila."
      />

      <section className="theme-night relative pb-[var(--section-y)]" aria-labelledby="gallery-title">
        <h2 id="gallery-title" className="sr-only">
          Kuvat
        </h2>
        <div className="shell">
          <div className="sticky top-(--header-h) z-20 -mx-(--gutter) border-b border-cream/10 bg-night/90 px-(--gutter) py-3 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div role="group" aria-label="Rajaa kuvia tilan mukaan" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
                {galleryCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className="chip shrink-0 !min-h-11"
                    aria-pressed={filter === category.id}
                    onClick={() => setFilter(category.id)}
                  >
                    {category.label}
                    <span className="numeral text-xs opacity-60">{counts[category.id] ?? 0}</span>
                  </button>
                ))}
              </div>
              <p className="text-[0.82rem] text-smoke max-sm:hidden" aria-live="polite">
                {visible.length} kuvaa{filter !== 'kaikki' && ` · ${activeLabel}`}
              </p>
            </div>
          </div>

          <ul key={filter} className="gallery-grid mt-8 columns-1 gap-4 sm:columns-2 lg:mt-12 lg:columns-3 lg:gap-5">
            {visible.map((item, index) => (
              <li key={item.slug} className="gallery-item mb-4 break-inside-avoid lg:mb-5" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="group relative block w-full overflow-hidden rounded-md text-left"
                  aria-label={`Avaa kuva suurena: ${item.caption}`}
                >
                  <Picture
                    slug={item.slug}
                    alt={item.alt}
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
                    priority={index < 3}
                    className="block"
                    imgClassName="block h-auto w-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
                  />
                  <span
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-night/85 via-night/0 to-night/0 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5" aria-hidden="true">
                    <span>
                      <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ember">
                        {galleryCategories.find((c) => c.id === item.category)?.label}
                      </span>
                      <span className="mt-1 block font-display text-lg leading-tight text-cream">{item.caption}</span>
                    </span>
                    <span className="grid size-10 shrink-0 translate-y-2 place-items-center rounded-full bg-cream/15 text-cream opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <Expand className="size-4" />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-6 border-t border-cream/10 pt-10 md:grid-cols-[1fr_auto] md:items-center">
            <p className="max-w-xl text-[0.95rem] leading-relaxed text-smoke">
              Haluatko nähdä tilat liikkeessä? Juhlahumujen esittelyvideo löytyy yrityksen YouTube-kanavalta, ja tuoreimmat tunnelmat Instagramista.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <a href={company.videoUrl} target="_blank" rel="noreferrer" className="link-line text-[0.95rem]">
                Esittelyvideo
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only"> (YouTube, avautuu uuteen välilehteen)</span>
              </a>
              {company.social.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="link-line text-[0.95rem]">
                  {s.label}
                  <ArrowUpRight aria-hidden="true" />
                  <span className="sr-only"> (avautuu uuteen välilehteen)</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Lightbox
        items={visible}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
        label={`Galleria – ${activeLabel}`}
      />

      <CtaBand
        title={
          <>
            Näyttääkö <em>sopivalta?</em>
          </>
        }
        text="Kerro, millaista tilaisuutta suunnittelet ja milloin – saat tarjouksen juuri teidän seurueellenne."
      />
    </>
  );
}
