import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { Picture } from '@/components/ui/Picture';
import type { ImageSlug } from '@/data/images.generated';
import { rentalExample } from '@/data/pricing';
import { pages } from '@/data/site';
import { cx } from '@/lib/format';

interface Chapter {
  id: string;
  time: string;
  place: string;
  title: string;
  text: string;
  link: { to: string; label: string };
  photos: { slug: ImageSlug; alt: string; position?: string }[];
}

/**
 * The venue tour, told as one evening. The times are an ILLUSTRATION built on the
 * company's example rental window (klo 16–24) – the copy says so explicitly.
 */
const chapters: Chapter[] = [
  {
    id: 'sali',
    time: '16:00',
    place: 'Alakerta · Sali',
    title: 'Ovet auki, takka lämpimänä.',
    text: 'Ilta alkaa salista. Puukatto, avotakka ja suuret ikkunat terassille – tilaa on seurustella sohvilla, kattaa pöydät ja pitää puheet. Videotykki ja 75″ televisio ovat valmiina kuvia ja ohjelmaa varten.',
    link: { to: `${pages.venue.path}#sali`, label: 'Juhla- ja ruokailutilat' },
    photos: [{ slug: 'sali-takka-portaat', alt: 'Sali: puukatto, avotakka, tarjoilulinjasto ja portaat yläkertaan' }],
  },
  {
    id: 'poyta',
    time: '18:00',
    place: 'Alakerta · Ruokailu',
    title: 'Pöytä on katettu.',
    text: 'Talon oma catering tuo illallisen pöytään: valmiit menut salaateista pääruokiin, kesäkaudella myös hiiligrillistä. Lasit löytyvät talosta – omat juomat saa tuoda mukanaan.',
    link: { to: pages.catering.path, label: 'Catering ja menut' },
    photos: [{ slug: 'sininen-sali', alt: 'Ruokailutila, jossa pyöreät pöydät ja riippuvalaisimet' }],
  },
  {
    id: 'sauna',
    time: '20:00',
    place: 'Alakerta · Saunaosasto',
    title: 'Löylyt odottavat.',
    text: 'Tunnelmavalaistu sauna, pyyhkeet ja pesuaineet kuuluvat tilavuokraan. Saunatiloista pääsee suoraan ulkoterassille – ja lisäpalveluna terassilla odottaa valmiiksi lämmitetty kylpytynnyri.',
    link: { to: `${pages.venue.path}#sauna`, label: 'Saunaosasto' },
    photos: [
      { slug: 'sauna', alt: 'Tunnelmavalaistu sauna, jonka keskellä on pilarikiuas' },
      { slug: 'pukuhuone', alt: 'Saunaosaston pukuhuone puupenkkeineen' },
    ],
  },
  {
    id: 'pelit',
    time: '22:00',
    place: 'Yläkerta · Pelitila',
    title: 'Peli käyntiin.',
    text: 'Portaat ylös, ja ilta saa uuden vaihteen: biljardi, ilmakiekko, voima- ja nopeuspelit, flipperi ja darts. Musiikki soi talon äänentoistosta suoraan omasta soittolistasta.',
    link: { to: `${pages.venue.path}#pelitila`, label: 'Pelitila' },
    photos: [
      { slug: 'pelitila-panoraama', alt: 'Yläkerran pelitila: biljardipöytä ja pelejä värivaloissa', position: '30% 50%' },
      { slug: 'biljardi', alt: 'Biljardipöytä, pallot ja kaksi keppiä', position: '50% 35%' },
    ],
  },
];

export function EveningTour() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  // Which chapter is in view drives the clock in the sticky column. Ordinary scrolling – nothing is pinned or hijacked.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="theme-night grain relative" aria-labelledby="tour-title">
      <div className="shell section relative z-10">
        <div className="grid gap-x-12 lg:grid-cols-12">
          {/* Sticky clock */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <p className="eyebrow" data-reveal="up">
                Kierros talossa
              </p>
              <h2 id="tour-title" className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
                Illan <em>kaari.</em>
              </h2>
              <p className="lede mt-6 max-w-sm" data-reveal="up" data-reveal-delay="0.1">
                Yksi ilta, kaksi kerrosta ja monta tunnelmaa. Näin juhlat voisivat edetä {rentalExample.timeWindow}.
              </p>

              <div className="mt-12 hidden lg:block" aria-hidden="true">
                <div className="numeral h-[1em] overflow-hidden text-[clamp(4rem,7.2vw,7.5rem)] leading-none text-cream">
                  <div className="transition-transform duration-[900ms] ease-out-expo" style={{ transform: `translateY(-${active}em)` }}>
                    {chapters.map((c) => (
                      <div key={c.id} className="h-[1em]">
                        {c.time}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-4 text-xs font-semibold tracking-[0.2em] text-smoke">
                  <span>16</span>
                  <span className="relative h-px flex-1 bg-cream/15">
                    <span
                      className="absolute inset-y-0 left-0 w-full origin-left bg-ember transition-transform duration-[900ms] ease-out-expo"
                      style={{ transform: `scaleX(${(active + 1) / chapters.length})` }}
                    />
                  </span>
                  <span>24</span>
                </div>
              </div>

              <p className="mt-8 max-w-xs text-[0.82rem] leading-relaxed text-smoke" data-reveal="up" data-reveal-delay="0.15">
                Kellonajat ovat kuvitusta, eivät ohjelma: illan aikataulun päätätte te.
              </p>
            </div>
          </div>

          {/* Chapters */}
          <ol className="mt-16 space-y-24 lg:col-span-8 lg:mt-0 lg:space-y-40">
            {chapters.map((chapter, index) => (
              <li
                key={chapter.id}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                data-index={index}
              >
                <div
                  className={cx(
                    'grid gap-4',
                    chapter.photos.length > 1 && (index % 2 === 0 ? 'sm:grid-cols-[1.55fr_1fr] sm:items-end' : 'sm:grid-cols-[1fr_1.55fr] sm:items-start'),
                  )}
                >
                  {chapter.photos.map((photo, photoIndex) => {
                    const isPrimary = chapter.photos.length === 1 || (index % 2 === 0 ? photoIndex === 0 : photoIndex === 1);
                    return (
                      <div
                        key={photo.slug}
                        className={cx(
                          'frame',
                          isPrimary ? 'aspect-[3/2]' : 'aspect-[4/5] max-sm:hidden',
                          chapter.photos.length === 1 && index % 2 === 0 && 'rounded-tl-[clamp(3rem,10vw,8rem)]',
                          chapter.photos.length === 1 && index % 2 === 1 && 'rounded-br-[clamp(3rem,10vw,8rem)]',
                          index % 2 === 1 && chapter.photos.length > 1 && (photoIndex === 0 ? 'order-1' : 'order-2'),
                        )}
                        data-reveal="mask"
                        data-reveal-delay={String(photoIndex * 0.14)}
                      >
                        <Picture
                          slug={photo.slug}
                          alt={photo.alt}
                          position={photo.position}
                          frameAspect={isPrimary ? 1.5 : 0.8}
                          sizes={isPrimary ? '(min-width: 1024px) 40vw, (min-width: 640px) 58vw, 100vw' : '(min-width: 1024px) 24vw, 36vw'}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-[auto_1fr]">
                  <p className="numeral text-3xl leading-none text-ember sm:pt-1 lg:hidden" data-reveal="up">
                    {chapter.time}
                  </p>
                  <div className="max-w-xl">
                    <p className="eyebrow eyebrow--plain" data-reveal="up">
                      <span className="max-lg:hidden">
                        {chapter.time}
                        <span className="mx-2 text-ember">/</span>
                      </span>
                      {chapter.place}
                    </p>
                    <h3 className="display-md mt-4" data-reveal="up" data-reveal-delay="0.05">
                      {chapter.title}
                    </h3>
                    <p className="mt-5 text-[1.02rem] leading-relaxed text-smoke" data-reveal="up" data-reveal-delay="0.1">
                      {chapter.text}
                    </p>
                    <Link to={chapter.link.to} className="link-line mt-6 text-[0.95rem]" data-reveal="up" data-reveal-delay="0.15">
                      {chapter.link.label}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
