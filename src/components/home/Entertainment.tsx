import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Picture } from '@/components/ui/Picture';
import { imageManifest, type ImageSlug } from '@/data/images.generated';
import { pages } from '@/data/site';

const reel: { slug: ImageSlug; alt: string; label: string }[] = [
  { slug: 'biljardi', alt: 'Biljardipöytä, pallot ja kaksi keppiä', label: 'Biljardi' },
  { slug: 'ilmakiekko-valot', alt: 'Ilmakiekkopöytä pelitilan värivaloissa', label: 'Ilmakiekko' },
  { slug: 'nyrkkeilypeli', alt: 'Nyrkkeilypeli', label: 'Voimapelit' },
  { slug: 'sauna', alt: 'Tunnelmavalaistu sauna', label: 'Sauna' },
  { slug: 'flipperi-voimapeli', alt: 'Flipperi ja voimapeli', label: 'Flipperi' },
  { slug: 'nopeuspeli', alt: 'Nopeuspeli', label: 'Nopeuspelit' },
  { slug: 'ilmakiekko', alt: 'Ilmakiekkopöytä ja mailat lähikuvassa', label: 'Ilmakiekko' },
  { slug: 'pelikabinetti', alt: 'Pelikabinetti', label: 'Pelikabinetti' },
  { slug: 'pelitila-parvi', alt: 'Yläkerran parvi, jossa baarijakkarat ja pelejä', label: 'Parvi' },
];

const features = [
  { name: 'Sauna', detail: 'Tunnelmavalaistu, sisältyy tilavuokraan' },
  { name: 'Biljardi', detail: 'Oma pöytä yläkerran pelitilassa' },
  { name: 'Ilmakiekko', detail: 'Nopeaa kisaa koko seurueelle' },
  { name: 'Voima- ja nopeuspelit', detail: 'Lisäksi flipperi, darts ja pelikonsoli' },
  { name: 'Äänentoisto', detail: 'Yhdistä esimerkiksi Spotifyhin' },
  { name: 'Kylpytynnyri', detail: 'Lisäpalveluna, 10–12 hengelle' },
];

/** A film-strip of the things that make the venue its own: sauna, games, sound. Native horizontal scrolling – drag, swipe, or use the arrows. */
export function Entertainment() {
  const track = useRef<HTMLUListElement>(null);
  const scrollBy = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.8, 640), behavior: 'smooth' });
  };

  return (
    <section className="theme-night grain relative overflow-clip" aria-labelledby="fun-title">
      <div className="shell section relative z-10 !pb-0">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal="up">
              Sauna ja pelit
            </p>
            <h2 id="fun-title" className="display-lg mt-6" data-reveal="up" data-reveal-delay="0.05">
              Löylystä <em>pelipöytään.</em>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="lede" data-reveal="up" data-reveal-delay="0.1">
              Juhlissa on parasta, kun jokaiselle löytyy tekemistä. Täällä sitä ei tarvitse keksiä itse – sauna ja pelikoneet kuuluvat tilavuokraan.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 lg:mt-16">
        <ul
          ref={track}
          tabIndex={0}
          aria-label="Kuvia saunasta ja pelitilasta – vieritä sivusuunnassa"
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-(--gutter) pb-2 sm:gap-4 lg:snap-proximity"
        >
          {reel.map((item, index) => {
            const meta = imageManifest[item.slug];
            return (
              <li key={item.slug} className="shrink-0 snap-start scroll-ml-(--gutter)" data-reveal="up" data-reveal-delay={String(Math.min(index, 5) * 0.06)}>
                <figure>
                  <div className="frame h-[19rem] sm:h-[24rem] lg:h-[30rem]" style={{ aspectRatio: `${meta.width} / ${meta.height}` }}>
                    <Picture slug={item.slug} alt={item.alt} sizes="(min-width: 1024px) 45rem, (min-width: 640px) 36rem, 28rem" />
                  </div>
                  <figcaption className="mt-3 flex items-baseline gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-smoke">
                    <span className="numeral text-ember">{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>

        <div className="shell mt-6 flex items-center justify-between gap-6">
          <p className="text-[0.8rem] text-smoke lg:hidden">Pyyhkäise nähdäksesi lisää</p>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Edelliset kuvat"
              className="grid size-12 place-items-center rounded-full border border-cream/25 transition-colors hover:border-ember hover:text-ember"
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Seuraavat kuvat"
              className="grid size-12 place-items-center rounded-full border border-cream/25 transition-colors hover:border-ember hover:text-ember"
            >
              <ArrowRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="shell section relative z-10 !pt-16 lg:!pt-24">
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <li key={feature.name} className="border-t border-(--line) py-6" data-reveal="up" data-reveal-delay={String((index % 3) * 0.06)}>
              <h3 className="display-sm">{feature.name}</h3>
              <p className="mt-2 text-[0.95rem] text-smoke">{feature.detail}</p>
            </li>
          ))}
        </ul>
        <Link to={pages.gallery.path} className="link-line mt-10" data-reveal="up">
          Katso koko galleria
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
